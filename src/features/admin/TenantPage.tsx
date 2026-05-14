import { useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Buildings, Users, ShieldCheck, Pulse, Sparkle, Hourglass, CheckCircle, Archive } from '@phosphor-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cls } from '@/lib/utils/cls';

type TenantStatus = 'active' | 'suspended' | 'archived' | 'provisioning';

interface TenantRow {
  id: string;
  name: string;
  domain: string;
  status: TenantStatus;
  plan: 'demo' | 'starter' | 'pro' | 'enterprise';
  users: number;
  listings: number;
  storageGb: number;
  createdAt: string;
}

const TENANTS: TenantRow[] = [
  { id: 't-001', name: 'LandX Demo',            domain: 'demo.landx.test',        status: 'active',       plan: 'demo',       users: 60,  listings: 220, storageGb: 1.4, createdAt: '2025-09-01' },
  { id: 't-002', name: 'Kıyı Emlak Grubu',      domain: 'kiyiemlak.landx.test',   status: 'active',       plan: 'pro',        users: 24,  listings: 142, storageGb: 6.2, createdAt: '2026-01-12' },
  { id: 't-003', name: 'Anadolu Yatırım',       domain: 'anadolu.landx.test',     status: 'active',       plan: 'enterprise', users: 78,  listings: 412, storageGb: 18.7, createdAt: '2025-11-04' },
  { id: 't-004', name: 'Test Kurum 1',          domain: 'test1.landx.test',       status: 'suspended',    plan: 'starter',    users: 4,   listings: 8,   storageGb: 0.2, createdAt: '2026-03-22' },
  { id: 't-005', name: 'Bodrum Mülk',           domain: 'bodrum.landx.test',      status: 'provisioning', plan: 'pro',        users: 0,   listings: 0,   storageGb: 0,   createdAt: '2026-05-12' },
  { id: 't-006', name: 'Eski Müşteri',          domain: 'eski.landx.test',        status: 'archived',     plan: 'starter',    users: 0,   listings: 0,   storageGb: 0.05, createdAt: '2024-08-19' }
];

const PLAN_QUOTAS: Record<TenantRow['plan'], { listings: number; users: number; storage: number; price: string }> = {
  demo:        { listings: 1000, users: 100, storage: 5,   price: 'ücretsiz' },
  starter:     { listings: 50,   users: 10,  storage: 1,   price: '₺990/ay' },
  pro:         { listings: 500,  users: 50,  storage: 10,  price: '₺4.900/ay' },
  enterprise:  { listings: 5000, users: 500, storage: 100, price: 'özel' }
};

const STATUS_LABEL: Record<TenantStatus, { tr: string; color: string; Icon: typeof Buildings }> = {
  active: { tr: 'Aktif', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200', Icon: CheckCircle },
  suspended: { tr: 'Askıda', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', Icon: ShieldCheck },
  archived: { tr: 'Arşivli', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', Icon: Archive },
  provisioning: { tr: 'Provisioning', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200', Icon: Hourglass }
};

const USAGE_30D = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  listings: Math.round(165 + Math.sin(i / 4) * 12 + i * 1.3),
  apiCalls: Math.round(28000 + Math.cos(i / 5) * 5000 + i * 240)
}));

export default function TenantPage() {
  const [selected, setSelected] = useState<TenantRow>(TENANTS[0]);

  return (
    <div>
      <SectionHeading title="Tenant Lifecycle (I01)" description="Multi-tenant provisioning · kota · izolasyon · arşivleme" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Tenant" value={TENANTS.length} icon={<Buildings size={20} weight="fill" />} />
        <Stat label="Aktif" value={TENANTS.filter((t) => t.status === 'active').length} icon={<CheckCircle size={20} weight="fill" />} />
        <Stat label="Toplam kullanıcı" value={TENANTS.reduce((s, t) => s + t.users, 0)} icon={<Users size={20} weight="fill" />} />
        <Stat label="İzolasyon ihlali" value={0} icon={<ShieldCheck size={20} weight="fill" />} hint="I05 enforcement" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Tenant list */}
        <div className="lg:col-span-1 space-y-2">
          {TENANTS.map((t) => {
            const s = STATUS_LABEL[t.status];
            const active = selected.id === t.id;
            return (
              <button key={t.id} onClick={() => setSelected(t)} className={cls('w-full text-left p-3 rounded-r-3 border transition-colors', active ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-r-2 bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600 shrink-0"><Buildings size={16} weight="duotone" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-fg-3 truncate">{t.domain}</div>
                  </div>
                  <span className={cls('text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5', s.color)}>
                    <s.Icon size={10} weight="fill" /> {s.tr}
                  </span>
                </div>
              </button>
            );
          })}
          <Button block variant="outline" iconLeft={<Sparkle size={14} weight="fill" />}>+ Yeni tenant (provisioning)</Button>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-medium text-lg">{selected.name}</h3>
                <code className="text-xs text-fg-3">{selected.domain} · oluşturuldu {selected.createdAt}</code>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.status === 'active' && <Button size="sm" variant="outline">Askıya al</Button>}
                {selected.status === 'suspended' && <Button size="sm" variant="success">Aktive et</Button>}
                {selected.status !== 'archived' && <Button size="sm" variant="ghost">Arşivle</Button>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-fg-3">Plan</div>
                <div className="font-medium mt-1 capitalize">{selected.plan}</div>
                <div className="text-xs text-fg-3">{PLAN_QUOTAS[selected.plan].price}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-fg-3">Schema</div>
                <code className="block mt-1 text-xs">tenant_{selected.id.slice(2)}</code>
                <div className="text-xs text-fg-3">izolasyon: schema-per-tenant</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-fg-3">Bölge</div>
                <div className="font-medium mt-1">eu-west-1</div>
                <div className="text-xs text-fg-3">KVKK uyumlu</div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium mb-3">Kota kullanımı</h3>
            <Usage label="İlanlar" value={selected.listings} max={PLAN_QUOTAS[selected.plan].listings} unit="" />
            <Usage label="Kullanıcılar" value={selected.users} max={PLAN_QUOTAS[selected.plan].users} unit="" />
            <Usage label="Depolama" value={selected.storageGb} max={PLAN_QUOTAS[selected.plan].storage} unit="GB" decimals={1} />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium inline-flex items-center gap-2"><Pulse size={16} weight="fill" /> Son 30 gün aktivitesi</h3>
              <span className="text-xs text-fg-3">İlan + API çağrısı</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer>
                <AreaChart data={USAGE_30D}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="listings" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                  <Area yAxisId="right" type="monotone" dataKey="apiCalls" stroke="#c97f1d" fill="rgba(201,127,29,0.18)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium mb-2">İzolasyon kontrolü (I05)</h3>
            <ul className="text-sm space-y-1">
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Cross-tenant query saldırısı: <strong>0</strong></li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Schema switch overhead: P99 1.8ms</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Tenant context propagation hata: %0.00</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Agent çağrılarında tenant context korunuyor</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-medium mb-2">Tenant ayarları</h3>
            <div className="space-y-2">
              <Input label="Tenant adı" defaultValue={selected.name} block />
              <Input label="Domain" defaultValue={selected.domain} block />
              <Input label="Plan" defaultValue={selected.plan} block />
              <Button size="sm">Kaydet</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Usage({ label, value, max, unit, decimals = 0 }: { label: string; value: number; max: number; unit: string; decimals?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-brand-500';
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-fg-3">{value.toFixed(decimals)} / {max.toFixed(decimals)} {unit} · %{pct}</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cls('h-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
