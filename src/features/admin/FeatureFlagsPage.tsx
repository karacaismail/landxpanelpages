// K05 Service Container & Configuration — Feature Flags + Config Hierarchy
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { ToggleLeft, ToggleRight, Sliders, Code, Lightning, Sparkle, Plus, MagnifyingGlass, GitBranch, Clock, Users, ShieldCheck, Warning } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  state: 'on' | 'off' | 'ramp' | 'targeted';
  rampPercent?: number;
  targetRoles?: string[];
  targetTenants?: string[];
  category: 'experiment' | 'kill-switch' | 'rollout' | 'permission' | 'ai';
  owner: string;
  lastChanged: string;
}

interface ConfigEntry {
  key: string;
  value: string;
  scope: 'global' | 'tenant' | 'user';
  type: 'string' | 'int' | 'bool' | 'json';
  source: 'env' | 'db' | 'override';
  readP99Ms: number;
}

const FLAGS: FeatureFlag[] = [
  { id: 'ff-1', key: 'feature.ai_value_estimate', name: 'AI Değerleme', description: 'Listing detayda emsal değerleme bandı göster', state: 'on', category: 'ai', owner: 'ai-runtime', lastChanged: '2026-04-12' },
  { id: 'ff-2', key: 'feature.semantic_search', name: 'Semantik arama', description: 'Vector store ile NL arama', state: 'ramp', rampPercent: 65, category: 'rollout', owner: 'search', lastChanged: '2026-05-10' },
  { id: 'ff-3', key: 'experiment.new_wizard_v3', name: 'Yeni ilan sihirbazı v3', description: 'A/B test - yeni adımlama', state: 'ramp', rampPercent: 20, category: 'experiment', owner: 'product', lastChanged: '2026-05-13' },
  { id: 'ff-4', key: 'kill.tkgm_api_v1', name: 'TKGM API v1 kill', description: 'Eski TKGM endpoint\'ini kapat', state: 'off', category: 'kill-switch', owner: 'integrations', lastChanged: '2026-05-01' },
  { id: 'ff-5', key: 'permission.bulk_delete', name: 'Toplu silme', description: 'Sadece admin için', state: 'targeted', targetRoles: ['admin'], category: 'permission', owner: 'platform', lastChanged: '2026-03-22' },
  { id: 'ff-6', key: 'feature.compare_4_listings', name: '4 ilan karşılaştırma', description: '3\'ten 4\'e çıkar', state: 'on', category: 'rollout', owner: 'product', lastChanged: '2026-04-30' },
  { id: 'ff-7', key: 'experiment.opus_for_complex', name: 'Karmaşık promptlarda Opus', description: 'Default Sonnet, complex işlerde Opus 4.7', state: 'ramp', rampPercent: 100, category: 'ai', owner: 'ai-runtime', lastChanged: '2026-05-08' },
  { id: 'ff-8', key: 'feature.streaming_responses', name: 'SSE streaming', description: 'Token-by-token cevap akışı', state: 'on', category: 'ai', owner: 'ai-runtime', lastChanged: '2026-04-25' },
  { id: 'ff-9', key: 'experiment.dark_mode_default', name: 'Dark mode default', description: 'Yeni kullanıcılarda dark default', state: 'off', category: 'experiment', owner: 'product', lastChanged: '2026-05-04' },
  { id: 'ff-10', key: 'permission.export_csv', name: 'CSV dışa aktarım', description: 'Pro+ plan tenant\'ları', state: 'targeted', targetTenants: ['Anadolu Yatırım', 'Kıyı Emlak Grubu'], category: 'permission', owner: 'platform', lastChanged: '2026-04-18' },
  { id: 'ff-11', key: 'kill.legacy_search', name: 'Eski arama API kill', description: 'BM25-only arama kaldır', state: 'off', category: 'kill-switch', owner: 'search', lastChanged: '2026-05-02' },
  { id: 'ff-12', key: 'feature.eca_dnd_editor', name: 'ECA sürükle-bırak editör', description: 'Yeni dnd-kit tabanlı editör', state: 'on', category: 'rollout', owner: 'platform', lastChanged: '2026-05-13' }
];

const CONFIGS: ConfigEntry[] = [
  { key: 'app.tenant_default_plan', value: 'starter', scope: 'global', type: 'string', source: 'db', readP99Ms: 1.2 },
  { key: 'app.session_ttl_minutes', value: '480', scope: 'global', type: 'int', source: 'env', readP99Ms: 0.4 },
  { key: 'ai.default_model', value: 'claude-sonnet-4-6', scope: 'global', type: 'string', source: 'db', readP99Ms: 0.8 },
  { key: 'ai.max_tokens_per_request', value: '8000', scope: 'tenant', type: 'int', source: 'db', readP99Ms: 1.4 },
  { key: 'eca.demo_runner_interval_ms', value: '45000', scope: 'global', type: 'int', source: 'override', readP99Ms: 0.6 },
  { key: 'security.password_min_length', value: '12', scope: 'global', type: 'int', source: 'env', readP99Ms: 0.3 },
  { key: 'kvkk.data_retention_days', value: '730', scope: 'tenant', type: 'int', source: 'db', readP99Ms: 1.1 },
  { key: 'notifications.quiet_hours', value: '{"from":"22:00","to":"08:00"}', scope: 'user', type: 'json', source: 'db', readP99Ms: 2.4 },
  { key: 'app.cdn_origin', value: 'https://cdn.landx.test', scope: 'global', type: 'string', source: 'env', readP99Ms: 0.2 },
  { key: 'audit.retention_years', value: '7', scope: 'global', type: 'int', source: 'env', readP99Ms: 0.3 }
];

const CATEGORY_LABEL: Record<FeatureFlag['category'], { tr: string; cls: string }> = {
  experiment: { tr: 'Deney', cls: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300' },
  'kill-switch': { tr: 'Kill switch', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  rollout: { tr: 'Rollout', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  permission: { tr: 'İzin', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  ai: { tr: 'AI', cls: 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300' }
};

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(FLAGS);
  const [tab, setTab] = useState<'flags' | 'config' | 'di'>('flags');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | FeatureFlag['category']>('all');

  function toggle(id: string) {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, state: f.state === 'on' ? 'off' : 'on', lastChanged: new Date().toISOString().slice(0, 10) } : f));
    toast('success', 'Flag güncellendi', '< 2 saniyede tüm pod\'lara propagate edildi.');
  }

  function setRamp(id: string, pct: number) {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, state: 'ramp', rampPercent: pct, lastChanged: new Date().toISOString().slice(0, 10) } : f));
  }

  const filtered = useMemo(() => flags.filter((f) => {
    if (catFilter !== 'all' && f.category !== catFilter) return false;
    if (search.trim() && !(f.name + ' ' + f.key + ' ' + f.description).toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'))) return false;
    return true;
  }), [flags, catFilter, search]);

  const onCount = flags.filter((f) => f.state === 'on').length;
  const offCount = flags.filter((f) => f.state === 'off').length;
  const rampCount = flags.filter((f) => f.state === 'ramp').length;
  const targetedCount = flags.filter((f) => f.state === 'targeted').length;

  return (
    <div>
      <SectionHeading
        title="Feature Flags & Config (K05)"
        description="Service Container, Configuration Hierarchy, Feature Flags"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel K05</AiBadge>
            <Button size="sm" iconLeft={<Plus size={14} />} onClick={() => toast('info', 'Yeni flag', 'Wizard mock — gerçek deploy K03 ile.')}>Yeni flag</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Toplam flag" value={flags.length} icon={<ToggleRight size={20} weight="fill" />} />
        <Stat label="Açık" value={onCount} icon={<Lightning size={20} weight="fill" />} hint="Tüm kullanıcı" />
        <Stat label="Ramp" value={rampCount} icon={<GitBranch size={20} weight="fill" />} hint="Kısmi rollout" />
        <Stat label="Hedefli" value={targetedCount} icon={<Users size={20} weight="fill" />} hint="Belirli rol/tenant" />
        <Stat label="Kapalı" value={offCount} icon={<ToggleLeft size={20} weight="fill" />} />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'flags' as const, label: 'Feature Flags', Icon: ToggleRight },
          { id: 'config' as const, label: 'Configuration', Icon: Sliders },
          { id: 'di' as const, label: 'Service Container (DI)', Icon: Code }
        ].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cls(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
            tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
          )}>
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'flags' && (
        <>
          <Card className="mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative max-w-xs flex-1">
                <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Flag ara..." className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm min-h-[40px]" />
              </div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => setCatFilter('all')} className={cls('text-[11px] px-2 py-1 rounded-full', catFilter === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800')}>Tümü</button>
                {(Object.keys(CATEGORY_LABEL) as FeatureFlag['category'][]).map((c) => (
                  <button key={c} onClick={() => setCatFilter(c)} className={cls('text-[11px] px-2 py-1 rounded-full', catFilter === c ? CATEGORY_LABEL[c].cls + ' ring-2 ring-current' : CATEGORY_LABEL[c].cls)}>
                    {CATEGORY_LABEL[c].tr}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid gap-2">
            {filtered.map((f) => <FlagRow key={f.id} flag={f} onToggle={() => toggle(f.id)} onRamp={(p) => setRamp(f.id, p)} />)}
          </div>
        </>
      )}

      {tab === 'config' && <ConfigTable />}

      {tab === 'di' && <ServiceContainerView />}
    </div>
  );
}

function FlagRow({ flag, onToggle, onRamp }: { flag: FeatureFlag; onToggle: () => void; onRamp: (pct: number) => void }) {
  const isOn = flag.state === 'on';
  const cat = CATEGORY_LABEL[flag.category];
  return (
    <Card padding="sm">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={cls('shrink-0 mt-0.5 w-12 h-7 rounded-full transition-colors', isOn ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700')}
          aria-label={isOn ? 'Kapat' : 'Aç'}
          aria-pressed={isOn}
        >
          <span className={cls('block w-5 h-5 rounded-full bg-white transition-transform mt-1', isOn ? 'translate-x-6' : 'translate-x-1')} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm">{flag.name}</h4>
            <span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full', cat.cls)}>{cat.tr}</span>
            {flag.state === 'ramp' && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">RAMP %{flag.rampPercent}</span>}
            {flag.state === 'targeted' && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">HEDEFLİ</span>}
          </div>
          <code className="text-[11px] text-fg-3">{flag.key}</code>
          <p className="text-xs text-fg-3 mt-0.5">{flag.description}</p>
          {flag.state === 'ramp' && (
            <div className="mt-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={flag.rampPercent || 0}
                onChange={(e) => onRamp(Number(e.target.value))}
                className="w-full max-w-xs"
              />
            </div>
          )}
          {flag.targetRoles && (
            <div className="text-[10px] text-fg-3 mt-1">Roller: <code>{flag.targetRoles.join(', ')}</code></div>
          )}
          {flag.targetTenants && (
            <div className="text-[10px] text-fg-3 mt-1">Tenant: <code>{flag.targetTenants.join(', ')}</code></div>
          )}
          <div className="text-[11px] text-fg-3 mt-1 inline-flex items-center gap-2">
            <span>Sahip: <code>{flag.owner}</code></span>
            <span><Clock size={10} className="inline" /> {flag.lastChanged}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ConfigTable() {
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">Hierarchical config — env → DB → tenant override → user override. Yüksek frekanslı cache (P99 &lt;5ms hedef).</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
            <th className="text-left py-2">Anahtar</th>
            <th className="text-left py-2">Değer</th>
            <th className="text-left py-2 hidden sm:table-cell">Scope</th>
            <th className="text-left py-2 hidden md:table-cell">Tip</th>
            <th className="text-left py-2 hidden md:table-cell">Kaynak</th>
            <th className="text-right py-2 hidden lg:table-cell">Okuma P99</th>
          </tr>
        </thead>
        <tbody>
          {CONFIGS.map((c) => (
            <tr key={c.key} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
              <td className="py-2"><code className="text-xs">{c.key}</code></td>
              <td className="py-2 font-mono text-xs truncate max-w-xs">{c.value}</td>
              <td className="py-2 hidden sm:table-cell"><span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{c.scope}</span></td>
              <td className="py-2 hidden md:table-cell text-xs">{c.type}</td>
              <td className="py-2 hidden md:table-cell text-xs">{c.source}</td>
              <td className="py-2 hidden lg:table-cell text-xs text-right tabular-nums">{c.readP99Ms.toFixed(1)}ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ServiceContainerView() {
  const services = [
    { name: 'IListingRepository', impl: 'PostgresListingRepository', scope: 'singleton', deps: 0, healthy: true },
    { name: 'IAuthService', impl: 'OidcAuthService', scope: 'singleton', deps: 2, healthy: true },
    { name: 'ILlmProvider', impl: 'AnthropicProvider', scope: 'singleton', deps: 1, healthy: true },
    { name: 'IVectorStore', impl: 'PgvectorStore', scope: 'singleton', deps: 1, healthy: true },
    { name: 'IEventBus', impl: 'RedisEventBus', scope: 'singleton', deps: 0, healthy: true },
    { name: 'ITenantContext', impl: 'AsyncLocalStorageTenantContext', scope: 'scoped', deps: 0, healthy: true },
    { name: 'IAuditService', impl: 'AppendOnlyAuditService', scope: 'singleton', deps: 1, healthy: true },
    { name: 'INotificationDispatcher', impl: 'MultiChannelDispatcher', scope: 'singleton', deps: 4, healthy: true },
    { name: 'ITkgmClient', impl: 'MockTkgmClient', scope: 'singleton', deps: 0, healthy: false }
  ];
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">Dependency Injection container — kayıtlı servisler ve sağlık durumu.</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
            <th className="text-left py-2">Interface</th>
            <th className="text-left py-2">Implementation</th>
            <th className="text-left py-2 hidden sm:table-cell">Scope</th>
            <th className="text-right py-2 hidden md:table-cell">Bağımlılık</th>
            <th className="text-right py-2">Durum</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
              <td className="py-2"><code className="text-xs">{s.name}</code></td>
              <td className="py-2 text-xs">{s.impl}</td>
              <td className="py-2 hidden sm:table-cell"><span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{s.scope}</span></td>
              <td className="py-2 hidden md:table-cell text-right tabular-nums text-fg-3">{s.deps}</td>
              <td className="py-2 text-right">
                {s.healthy
                  ? <span className="inline-flex items-center gap-1 text-emerald-600"><ShieldCheck size={12} weight="fill" /> sağlıklı</span>
                  : <span className="inline-flex items-center gap-1 text-amber-600"><Warning size={12} weight="fill" /> degraded</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
