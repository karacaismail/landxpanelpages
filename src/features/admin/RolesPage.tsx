import { useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { CheckCircle, XCircle, ShieldCheck, Robot, Eye, EyeSlash, Funnel, Sparkle, Plus, Warning } from '@phosphor-icons/react';
import { can, type Resource, type Action } from '@/lib/permissions/rbac';
import type { Role } from '@/types/domain';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

const RESOURCES: Resource[] = ['listing', 'offer', 'message', 'viewing', 'user', 'role', 'rule', 'audit', 'tkgm', 'notification', 'settings', 'modules'];
const ROLES: Role[] = ['guest', 'buyer', 'seller', 'moderator', 'admin'];

interface FieldMaskPolicy {
  id: string;
  field: string;
  resource: string;
  rule: 'always' | 'unless_owner' | 'unless_role' | 'unless_kyc_full';
  conditionValue?: string;
  maskPattern: string;
  description: string;
}

const FIELD_MASKS: FieldMaskPolicy[] = [
  { id: 'fm-1', field: 'users.email', resource: 'user', rule: 'unless_role', conditionValue: 'admin', maskPattern: 'a***@d***.com', description: 'E-posta sadece admin görür' },
  { id: 'fm-2', field: 'users.phone', resource: 'user', rule: 'unless_role', conditionValue: 'admin', maskPattern: '+90 5** *** ** 42', description: 'Telefon admin görür' },
  { id: 'fm-3', field: 'users.tckn', resource: 'user', rule: 'always', maskPattern: '*********', description: 'TCKN hiç görünmez (KYC sonrası karşılaştırma için hash karşılaştırma)' },
  { id: 'fm-4', field: 'listings.precise_lat', resource: 'listing', rule: 'unless_owner', maskPattern: '41.0***', description: 'Tam koordinat sadece sahibi görür' },
  { id: 'fm-5', field: 'listings.precise_lng', resource: 'listing', rule: 'unless_owner', maskPattern: '29.0***', description: 'Tam koordinat sadece sahibi görür' },
  { id: 'fm-6', field: 'offers.buyer_id', resource: 'offer', rule: 'unless_role', conditionValue: 'seller', maskPattern: 'u-****', description: 'Alıcı kimliği sadece satıcıya görünür' },
  { id: 'fm-7', field: 'messages.body', resource: 'message', rule: 'unless_role', conditionValue: 'participant', maskPattern: '[redacted]', description: 'Mesaj içeriği sadece taraflar' },
  { id: 'fm-8', field: 'payments.iban', resource: 'payment', rule: 'unless_kyc_full', maskPattern: 'TR** **** **** **** **34 56', description: 'IBAN sadece KYC tam kullanıcıya' }
];

interface RowFilter {
  id: string;
  resource: string;
  role: Role | 'agent';
  predicate: string;
  description: string;
}

const ROW_FILTERS: RowFilter[] = [
  { id: 'rf-1', resource: 'listing', role: 'buyer', predicate: 'status = \'live\'', description: 'Alıcı sadece canlı ilanları görür' },
  { id: 'rf-2', resource: 'listing', role: 'seller', predicate: 'owner_id = current_user_id() OR status = \'live\'', description: 'Satıcı kendi tüm ilanlarını + canlı diğerlerini görür' },
  { id: 'rf-3', resource: 'offer', role: 'buyer', predicate: 'buyer_id = current_user_id()', description: 'Alıcı kendi tekliflerini görür' },
  { id: 'rf-4', resource: 'offer', role: 'seller', predicate: 'seller_id = current_user_id()', description: 'Satıcı kendi alan tekliflerini görür' },
  { id: 'rf-5', resource: 'message', role: 'buyer', predicate: 'EXISTS(SELECT 1 FROM thread_participants WHERE thread_id = messages.thread_id AND user_id = current_user_id())', description: 'Sadece konuşma taraflarındaki mesajları' },
  { id: 'rf-6', resource: 'audit', role: 'moderator', predicate: 'resource_type IN (\'listing\', \'offer\', \'message\')', description: 'Moderatör sadece content audit\'i' },
  { id: 'rf-7', resource: 'tkgm_query', role: 'seller', predicate: 'user_id = current_user_id()', description: 'Satıcı kendi TKGM sorgu geçmişini görür' },
  { id: 'rf-8', resource: 'listing', role: 'agent', predicate: 'tenant_id = current_tenant_id()', description: 'Agent sadece kendi tenant\'ının verisine erişir' }
];

const RULE_TR: Record<FieldMaskPolicy['rule'], string> = {
  always: 'her zaman maskeli',
  unless_owner: 'sahibi hariç maskeli',
  unless_role: 'bu rol hariç maskeli',
  unless_kyc_full: 'tam KYC hariç maskeli'
};

export default function RolesPage() {
  const [tab, setTab] = useState<'rbac' | 'agents' | 'field-mask' | 'row-level'>('rbac');

  return (
    <div>
      <SectionHeading
        title="Roller, İzinler & Veri Güvenliği (I04)"
        description="RBAC + ABAC + Agent Capability Scopes (A03) + Field Mask + Row-level Security"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel I04 + A03</AiBadge>
            <Button size="sm" iconLeft={<Sparkle size={14} />} onClick={() => toast('ai', 'Politika analizi', 'Mock: 0 ihlal, 0 escalation tespit edildi.')}>AI denetim</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Rol" value={ROLES.length} icon={<ShieldCheck size={20} weight="fill" />} />
        <Stat label="Kaynak" value={RESOURCES.length} icon={<Funnel size={20} weight="fill" />} />
        <Stat label="Field mask" value={FIELD_MASKS.length} icon={<EyeSlash size={20} weight="fill" />} />
        <Stat label="Row filter" value={ROW_FILTERS.length} icon={<Eye size={20} weight="fill" />} />
        <Stat label="İhlal (30g)" value={0} icon={<Warning size={20} weight="fill" />} hint="Escalation 0" />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'rbac' as const, label: 'RBAC Matrisi', Icon: ShieldCheck },
          { id: 'agents' as const, label: 'Agent Scopes (A03)', Icon: Robot },
          { id: 'field-mask' as const, label: 'Field Mask', Icon: EyeSlash },
          { id: 'row-level' as const, label: 'Row-level Security', Icon: Funnel }
        ].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cls(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
            tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
          )}>
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'rbac' && (
        <Card>
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><ShieldCheck size={16} weight="fill" className="text-brand-500" /> İzin matrisi (read)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left px-3 py-2 font-medium text-fg-3">Kaynak / Rol</th>
                  {ROLES.map((r) => <th key={r} className="px-3 py-2 font-medium text-fg-3 capitalize">{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {RESOURCES.map((res) => (
                  <tr key={res} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-3 py-2 text-fg-2">{res}</td>
                    {ROLES.map((role) => (
                      <td key={role} className="px-3 py-2 text-center">
                        {can(role, res, 'read') ? <CheckCircle size={16} weight="fill" className="text-emerald-500 inline" /> : <XCircle size={16} className="text-fg-4 inline" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-fg-3 mt-2">✓ = okuma yetkisi. CRUD detayı satır seçilince expand olur. ABAC koşulları "Field Mask" ve "Row-level Security" sekmelerinde.</p>
        </Card>
      )}

      {tab === 'agents' && (
        <Card>
          <div className="flex items-center gap-2 mb-2"><Robot size={18} weight="fill" className="text-accent-500" /><h3 className="font-medium">Agent capability scopes (A03)</h3></div>
          <p className="text-sm text-fg-3 mb-3">Agent kullanıcı adına çalışırken: <strong className="text-fg-1">etkin_yetki = user_perms ∩ agent_scope ∩ session_limits</strong></p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { name: 'auto-reply-agent', tools: 'send_message, read_listing', session: '30s · 500 token', isolation: 'session-bound' },
              { name: 'price-watcher-agent', tools: 'read_listing, notify_user', session: '24sa · 2000 token', isolation: 'user-bound' },
              { name: 'lead-router-agent', tools: 'read_offer, route_to_seller', session: '1sa · 1500 token', isolation: 'tenant-bound' },
              { name: 'tkgm-verifier-agent', tools: 'verify_parcel', session: '1dk · 200 token', isolation: 'tool-bound' },
              { name: 'risk-scorer-agent', tools: 'compute_risk_score', session: '5dk · 5000 token', isolation: 'system-bound' },
              { name: 'message-helper-agent', tools: 'draft_reply', session: '15dk · 1000 token', isolation: 'thread-bound' }
            ].map((a) => (
              <div key={a.name} className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
                <div className="font-medium text-sm inline-flex items-center gap-1.5"><Robot size={12} weight="fill" className="text-accent-500" />{a.name}</div>
                <div className="text-[11px] text-fg-3 mt-1">Tools: <code>{a.tools}</code></div>
                <div className="text-[11px] text-fg-3">Session: <strong>{a.session}</strong></div>
                <div className="text-[11px] text-fg-3">Blast-radius: <em>{a.isolation}</em></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'field-mask' && (
        <Card>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-medium inline-flex items-center gap-2"><EyeSlash size={14} weight="fill" /> Field-level Mask Policy</h3>
              <p className="text-sm text-fg-3">Hassas alanlar role/sahiplik/KYC durumuna göre maskelenir. D02 PII Governance ile entegre.</p>
            </div>
            <Button size="sm" iconLeft={<Plus size={14} />} onClick={() => toast('info', 'Yeni mask', 'Wizard mock — kural editör açıldı.')}>Yeni mask</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                  <th className="text-left py-2">Alan</th>
                  <th className="text-left py-2 hidden sm:table-cell">Kural</th>
                  <th className="text-left py-2 hidden md:table-cell">Koşul</th>
                  <th className="text-left py-2">Maske</th>
                  <th className="text-left py-2 hidden lg:table-cell">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {FIELD_MASKS.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-2"><code className="text-xs">{m.field}</code></td>
                    <td className="py-2 hidden sm:table-cell"><span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{RULE_TR[m.rule]}</span></td>
                    <td className="py-2 hidden md:table-cell text-xs">{m.conditionValue ? <code>{m.conditionValue}</code> : '—'}</td>
                    <td className="py-2"><code className="text-xs font-mono">{m.maskPattern}</code></td>
                    <td className="py-2 hidden lg:table-cell text-xs text-fg-3">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'row-level' && (
        <Card>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-medium inline-flex items-center gap-2"><Funnel size={14} weight="fill" /> Row-Level Security Predicates</h3>
              <p className="text-sm text-fg-3">PostgreSQL RLS policy'leri ile her kayda erişim filtrelenir. Cross-tenant breach 0 (I05).</p>
            </div>
            <Button size="sm" iconLeft={<Plus size={14} />} onClick={() => toast('info', 'Yeni predicate', 'SQL editör açıldı, AI öneri hazır.')}>Yeni predicate</Button>
          </div>
          <ul className="space-y-2">
            {ROW_FILTERS.map((f) => (
              <li key={f.id} className="p-3 rounded-r-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <code className="text-xs text-brand-700 dark:text-brand-300 font-medium">{f.resource}</code>
                  <span className="text-xs text-fg-3">·</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{f.role}</span>
                </div>
                <pre className="text-[11px] bg-slate-900 text-emerald-300 rounded p-2 overflow-x-auto font-mono">{f.predicate}</pre>
                <div className="text-[11px] text-fg-3 mt-1">{f.description}</div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
