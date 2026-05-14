// Agent Registry — A02 Tool Registry & Discovery + A04 Agent Memory Layer + A05 Vector Store
// Excel modules: A02 / A04 / A05 — agent-runtime kataloğu
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Robot, Toolbox, Database, MagnifyingGlass, ListNumbers, Sparkle, ShieldCheck, Lightning, ArrowsClockwise } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

type Tab = 'tools' | 'memory' | 'vector';

interface Tool {
  id: string;
  name: string;
  category: 'data' | 'comms' | 'analytics' | 'media' | 'auth' | 'workflow';
  scope: 'tenant' | 'global';
  inputs: string[];
  output: string;
  signed: boolean;
  callsToday: number;
  errorRate: number;
  lastUsed: string;
  ai: boolean;
}

const TOOLS: Tool[] = [
  { id: 't-listing-search', name: 'listing.search', category: 'data', scope: 'global', inputs: ['query', 'filters'], output: 'Listing[]', signed: true, callsToday: 8240, errorRate: 0.02, lastUsed: '5dk önce', ai: true },
  { id: 't-tkgm-verify', name: 'tkgm.verify_parcel', category: 'data', scope: 'tenant', inputs: ['il', 'ada', 'parsel'], output: 'TkgmRecord', signed: true, callsToday: 412, errorRate: 0.15, lastUsed: '12dk önce', ai: false },
  { id: 't-value-estimate', name: 'ai.value_estimate', category: 'analytics', scope: 'global', inputs: ['listingId'], output: 'ValuationBand', signed: true, callsToday: 1820, errorRate: 0.01, lastUsed: '1dk önce', ai: true },
  { id: 't-message-send', name: 'message.send', category: 'comms', scope: 'tenant', inputs: ['threadId', 'body'], output: 'MessageId', signed: true, callsToday: 3120, errorRate: 0.05, lastUsed: '8sn önce', ai: false },
  { id: 't-image-rank', name: 'media.image_rank', category: 'media', scope: 'global', inputs: ['imageIds'], output: 'rankedIds', signed: true, callsToday: 642, errorRate: 0.08, lastUsed: '2dk önce', ai: true },
  { id: 't-notification-push', name: 'notify.user', category: 'comms', scope: 'tenant', inputs: ['userId', 'title', 'body'], output: 'NotificationId', signed: true, callsToday: 5840, errorRate: 0.01, lastUsed: 'şimdi', ai: false },
  { id: 't-risk-score', name: 'ai.risk_score', category: 'analytics', scope: 'global', inputs: ['listingId'], output: 'RiskScore', signed: true, callsToday: 920, errorRate: 0.03, lastUsed: '30sn önce', ai: true },
  { id: 't-kyc-verify', name: 'auth.kyc_verify', category: 'auth', scope: 'tenant', inputs: ['userId', 'docType', 'docHash'], output: 'KycStatus', signed: true, callsToday: 84, errorRate: 0.12, lastUsed: '4dk önce', ai: false },
  { id: 't-eca-trigger', name: 'workflow.trigger_rule', category: 'workflow', scope: 'tenant', inputs: ['ruleId', 'payload'], output: 'actionsRun[]', signed: true, callsToday: 1240, errorRate: 0.04, lastUsed: '15sn önce', ai: false },
  { id: 't-vector-search', name: 'vector.semantic_search', category: 'data', scope: 'global', inputs: ['embedding', 'topK'], output: 'matches[]', signed: true, callsToday: 412, errorRate: 0.02, lastUsed: '3dk önce', ai: true },
  { id: 't-audit-write', name: 'audit.write', category: 'workflow', scope: 'tenant', inputs: ['actor', 'event', 'resource'], output: 'AuditId', signed: true, callsToday: 12420, errorRate: 0.00, lastUsed: 'şimdi', ai: false },
  { id: 't-export-csv', name: 'export.csv', category: 'data', scope: 'tenant', inputs: ['resource', 'filters'], output: 'fileUrl', signed: false, callsToday: 38, errorRate: 0.08, lastUsed: '1sa önce', ai: false }
];

interface MemoryEntry {
  id: string;
  agentId: string;
  type: 'episodic' | 'semantic' | 'preference' | 'tool_use';
  key: string;
  preview: string;
  importance: number;
  createdAt: string;
  ttl: string;
}

const MEMORIES: MemoryEntry[] = [
  { id: 'm-1', agentId: 'agt-buyer-helper', type: 'preference', key: 'preferred_districts', preview: 'Beykoz, Şile, Kandıra — özellikle deniz manzaralı', importance: 0.92, createdAt: '2026-04-22', ttl: 'kalıcı' },
  { id: 'm-2', agentId: 'agt-buyer-helper', type: 'episodic', key: 'last_compare_session', preview: '3 ilan kıyaslandı: L-0024, L-0091, L-0142. L-0091 favoriye alındı.', importance: 0.68, createdAt: '2026-05-12', ttl: '90 gün' },
  { id: 'm-3', agentId: 'agt-seller-assistant', type: 'tool_use', key: 'tkgm_quota', preview: '24 sorgu / 100 günlük kota — 76 kalan', importance: 0.55, createdAt: '2026-05-13', ttl: '24sa' },
  { id: 'm-4', agentId: 'agt-admin-ops', type: 'semantic', key: 'platform_kpis', preview: 'Aylık onay süresi <4sa hedef. Şu an 6.2sa.', importance: 0.85, createdAt: '2026-05-01', ttl: '7 gün' },
  { id: 'm-5', agentId: 'agt-buyer-helper', type: 'preference', key: 'budget_band', preview: '2.5M – 6M ₺ aralığı', importance: 0.88, createdAt: '2026-04-10', ttl: 'kalıcı' },
  { id: 'm-6', agentId: 'agt-message-helper', type: 'episodic', key: 'tone_feedback', preview: 'Kullanıcı kısa-direkt yanıtları tercih ediyor', importance: 0.72, createdAt: '2026-05-08', ttl: '60 gün' },
  { id: 'm-7', agentId: 'agt-admin-ops', type: 'tool_use', key: 'eca_history_window', preview: 'Son 24 saat: 142 kural tetiklendi, 38 notify.user', importance: 0.42, createdAt: '2026-05-13', ttl: '24sa' },
  { id: 'm-8', agentId: 'agt-buyer-helper', type: 'semantic', key: 'risk_appetite', preview: 'TKGM şerhli ilanlardan kaçınıyor', importance: 0.91, createdAt: '2026-03-22', ttl: 'kalıcı' }
];

interface VectorIndex {
  id: string;
  name: string;
  type: 'listing-text' | 'image' | 'message' | 'rule';
  count: number;
  dim: number;
  model: string;
  sizeMB: number;
  builtAt: string;
}

const INDEXES: VectorIndex[] = [
  { id: 'v-listing-text', name: 'listing.text', type: 'listing-text', count: 220, dim: 1536, model: 'text-embedding-3-large', sizeMB: 12.4, builtAt: '2026-05-13 02:00' },
  { id: 'v-listing-img', name: 'listing.image', type: 'image', count: 1840, dim: 512, model: 'clip-vit-l-14', sizeMB: 48.2, builtAt: '2026-05-13 02:14' },
  { id: 'v-message', name: 'message.body', type: 'message', count: 8240, dim: 768, model: 'multilingual-e5-large', sizeMB: 24.1, builtAt: '2026-05-13 04:00' },
  { id: 'v-rule', name: 'eca.rule', type: 'rule', count: 22, dim: 1536, model: 'text-embedding-3-large', sizeMB: 0.2, builtAt: '2026-05-13 04:02' }
];

export default function AgentRegistryPage() {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const tab: Tab = (section === 'memory' || section === 'vector') ? section : 'tools';
  const setTab = (t: Tab) => navigate(`/admin/agent-registry/${t}`);

  return (
    <div>
      <SectionHeading
        title="Agent Registry"
        description="A02 Tool Registry · A04 Memory Layer · A05 Vector Store"
        actions={<AiBadge>Excel A02/A04/A05</AiBadge>}
      />
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'tools' as Tab, label: 'Tool Registry', Icon: Toolbox },
          { id: 'memory' as Tab, label: 'Memory Layer', Icon: Database },
          { id: 'vector' as Tab, label: 'Vector Store', Icon: MagnifyingGlass }
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cls(
              'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors',
              tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
            )}
            aria-current={tab === id}
          >
            <Icon size={16} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'tools' && <ToolsTab />}
      {tab === 'memory' && <MemoryTab />}
      {tab === 'vector' && <VectorTab />}
    </div>
  );
}

function ToolsTab() {
  const cols: Column<Tool>[] = [
    { key: 'name', header: 'Tool', cell: (r) => (
      <div className="flex items-center gap-2">
        <code className="font-medium text-sm text-brand-700 dark:text-brand-300">{r.name}</code>
        {r.ai && <Sparkle size={12} weight="fill" className="text-brand-500" />}
        {r.signed && <ShieldCheck size={12} weight="fill" className="text-emerald-500" />}
      </div>
    )},
    { key: 'category', header: 'Kategori', cell: (r) => <code className="text-xs">{r.category}</code>, hideOn: 'sm' },
    { key: 'scope', header: 'Scope', cell: (r) => <StatusBadge status={r.scope === 'tenant' ? 'review' : 'live'} size="sm" />, hideOn: 'md' },
    { key: 'inputs', header: 'Girdi → Çıktı', cell: (r) => <span className="text-xs text-fg-3 font-mono">{r.inputs.join(', ')} → {r.output}</span>, hideOn: 'lg' },
    { key: 'calls', header: 'Bugün çağrı', accessor: (r) => r.callsToday, cell: (r) => <span className="font-medium tabular-nums">{r.callsToday.toLocaleString('tr-TR')}</span>, sortable: true },
    { key: 'err', header: 'Hata', accessor: (r) => r.errorRate, cell: (r) => <span className={cls('text-xs tabular-nums', r.errorRate > 0.1 ? 'text-amber-600 dark:text-amber-400' : 'text-fg-3')}>{(r.errorRate * 100).toFixed(2)}%</span>, sortable: true },
    { key: 'last', header: 'Son', cell: (r) => <span className="text-xs text-fg-3">{r.lastUsed}</span>, hideOn: 'md' }
  ];
  const totalCalls = TOOLS.reduce((s, t) => s + t.callsToday, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Kayıtlı tool" value={TOOLS.length} icon={<Toolbox size={20} weight="fill" />} hint={`${TOOLS.filter((t) => t.ai).length} AI-augmented`} />
        <Stat label="Bugün çağrı" value={totalCalls.toLocaleString('tr-TR')} icon={<Lightning size={20} weight="fill" />} hint="Tüm tool'lar" />
        <Stat label="MCP imzalı" value={`${TOOLS.filter((t) => t.signed).length}/${TOOLS.length}`} icon={<ShieldCheck size={20} weight="fill" />} hint="Cryptographic" />
        <Stat label="Hata oranı" value={`${(TOOLS.reduce((s, t) => s + t.errorRate, 0) / TOOLS.length * 100).toFixed(2)}%`} icon={<Sparkle size={20} weight="fill" />} hint="Ortalama" />
      </div>
      <Card className="!p-0 overflow-hidden">
        <DataTable
          data={TOOLS}
          columns={cols}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Tool ara..."
          storageKey="agent-registry-tools"
          aiSuggestions={[
            { label: 'Yüksek hata oranlı tool: tkgm.verify_parcel', onRun: () => toast('warning', 'AI uyarı', 'tkgm.verify_parcel hata oranı son 24h\'de %15. Inceleyin.') },
            { label: 'Tool kullanım örüntülerini öğren', onRun: () => toast('ai', 'Pattern mining', 'Mock: listing.search → ai.value_estimate %78 birlikte kullanılıyor.') }
          ]}
        />
      </Card>
    </div>
  );
}

function MemoryTab() {
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const agents = useMemo(() => Array.from(new Set(MEMORIES.map((m) => m.agentId))), []);
  const filtered = agentFilter === 'all' ? MEMORIES : MEMORIES.filter((m) => m.agentId === agentFilter);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Memory entries" value={MEMORIES.length} icon={<Database size={20} weight="fill" />} hint={`${agents.length} agent`} />
        <Stat label="Episodic" value={MEMORIES.filter((m) => m.type === 'episodic').length} icon={<ListNumbers size={20} weight="fill" />} hint="Olay tabanlı" />
        <Stat label="Semantic" value={MEMORIES.filter((m) => m.type === 'semantic').length} icon={<Sparkle size={20} weight="fill" />} hint="Bilgi tabanlı" />
        <Stat label="Preference" value={MEMORIES.filter((m) => m.type === 'preference').length} icon={<Robot size={20} weight="fill" />} hint="Kullanıcı tercihleri" />
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-fg-3">Agent:</span>
        <button
          onClick={() => setAgentFilter('all')}
          className={cls('text-xs px-2 py-1 rounded-full border', agentFilter === 'all' ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 dark:border-slate-700')}
        >Tümü ({MEMORIES.length})</button>
        {agents.map((a) => {
          const count = MEMORIES.filter((m) => m.agentId === a).length;
          return (
            <button
              key={a}
              onClick={() => setAgentFilter(a)}
              className={cls('text-xs px-2 py-1 rounded-full border', agentFilter === a ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 dark:border-slate-700')}
            >{a} ({count})</button>
          );
        })}
      </div>
      <div className="grid gap-2">
        {filtered.map((m) => (
          <Card key={m.id} className="flex items-start gap-3">
            <div className={cls(
              'shrink-0 w-2 h-2 rounded-full mt-2',
              m.type === 'episodic' && 'bg-blue-500',
              m.type === 'semantic' && 'bg-purple-500',
              m.type === 'preference' && 'bg-emerald-500',
              m.type === 'tool_use' && 'bg-amber-500'
            )} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-xs font-medium">{m.agentId}</code>
                <span className="text-[11px] uppercase tracking-wider text-fg-3">{m.type}</span>
                <span className="text-[11px] text-fg-3">· TTL: {m.ttl}</span>
                <span className="text-[11px] text-fg-3 ml-auto">{m.createdAt}</span>
              </div>
              <div className="mt-1 text-sm">
                <strong className="text-fg-1">{m.key}:</strong> <span className="text-fg-2">{m.preview}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${m.importance * 100}%` }} />
                </div>
                <span className="text-[11px] tabular-nums text-fg-3 w-12 text-right">önem {(m.importance * 100).toFixed(0)}%</span>
                <button onClick={() => toast('warning', 'Memory eviction', `${m.key} kayıttan silindi (mock).`)} className="text-[11px] text-fg-3 hover:text-danger">unutmaya zorla</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VectorTab() {
  const total = INDEXES.reduce((s, i) => s + i.count, 0);
  const size = INDEXES.reduce((s, i) => s + i.sizeMB, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Index sayısı" value={INDEXES.length} icon={<Database size={20} weight="fill" />} hint="Aktif" />
        <Stat label="Embedded item" value={total.toLocaleString('tr-TR')} icon={<MagnifyingGlass size={20} weight="fill" />} hint="Toplam vektör" />
        <Stat label="Disk kullanım" value={`${size.toFixed(1)} MB`} icon={<ListNumbers size={20} weight="fill" />} hint="Tüm index'ler" />
        <Stat label="Son build" value="bugün 04:02" icon={<ArrowsClockwise size={20} weight="fill" />} hint="Nightly cron" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {INDEXES.map((idx) => (
          <Card key={idx.id}>
            <div className="flex items-start gap-3">
              <MagnifyingGlass size={24} weight="duotone" className="text-brand-500 shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-medium text-sm">{idx.name}</code>
                  <span className="text-[11px] uppercase text-fg-3">{idx.type}</span>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <div className="flex justify-between"><dt className="text-fg-3">Item</dt><dd className="font-medium tabular-nums">{idx.count.toLocaleString('tr-TR')}</dd></div>
                  <div className="flex justify-between"><dt className="text-fg-3">Dim</dt><dd className="tabular-nums">{idx.dim}</dd></div>
                  <div className="flex justify-between"><dt className="text-fg-3">Boyut</dt><dd className="tabular-nums">{idx.sizeMB.toFixed(1)} MB</dd></div>
                  <div className="flex justify-between"><dt className="text-fg-3">Build</dt><dd>{idx.builtAt.split(' ')[1]}</dd></div>
                </dl>
                <div className="text-[11px] text-fg-3 mt-2 truncate">Model: <code>{idx.model}</code></div>
                <div className="flex gap-2 mt-3">
                  <Button size="xs" iconLeft={<ArrowsClockwise size={12} />} onClick={() => toast('ai', 'Re-index', `${idx.name} arka planda yeniden inşa ediliyor (mock).`)}>Re-index</Button>
                  <Button size="xs" variant="outline" iconLeft={<MagnifyingGlass size={12} />} onClick={() => toast('info', 'Search', `${idx.name} üzerinde 'deniz manzara' araması — 12 sonuç (mock).`)}>Search</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Sparkle size={16} weight="fill" className="text-brand-500" />Semantic search demo</h3>
        <p className="text-sm text-fg-3 mb-2">Doğal dil ile arama yapın — embedding çıkarımı + cosine similarity ile en yakın eşleşmeler döner.</p>
        <div className="flex gap-2">
          <input
            placeholder="örn: kandıra deniz manzara tarım arazisi 5 dönüm altı"
            className="flex-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
          <Button onClick={() => toast('ai', 'Vector search', 'Mock: 8 ilan benzerlik 0.82+ ile bulundu. listing.text + listing.image karma sıralandı.')}>Ara</Button>
        </div>
      </Card>
    </div>
  );
}
