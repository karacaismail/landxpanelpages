// AI Ops — A06 Prompt Library + A07 LLM Provider Abstraction + A08 LLM Observability & Cost Tracking
// Excel modules: A06, A07, A08 — admin-only AI operasyon merkezi
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Sparkle, Brain, Robot, Lightning, ChartLineUp, Copy, Pencil, Plus, Flask, GitBranch, CurrencyCircleDollar, Play, Stop } from '@phosphor-icons/react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

type Tab = 'prompts' | 'providers' | 'observability';

interface PromptTemplate {
  id: string;
  name: string;
  category: 'listing' | 'message' | 'risk' | 'pricing' | 'support';
  versions: { v: string; author: string; at: string; body: string; tokenAvg: number; rating: number }[];
  active: string;
  uses30d: number;
}

const PROMPTS: PromptTemplate[] = [
  {
    id: 'pt-listing-title',
    name: 'Listing Title Generator',
    category: 'listing',
    versions: [
      { v: '1.0', author: 'system', at: '2026-02-10', body: 'Sen bir Türk arsa pazaryeri başlık yazarı...', tokenAvg: 184, rating: 4.2 },
      { v: '1.1', author: 'ismail.k', at: '2026-04-02', body: 'Sen bir Türk arsa pazaryeri başlık yazarısın. Aşağıdaki ilan özelliklerinden 80 karakter altında SEO uyumlu, lokasyon vurgulu başlık üret. Etkili kelimeler: imarlı, müstakil tapu, fırsat, yatırımlık.', tokenAvg: 156, rating: 4.6 },
      { v: '1.2', author: 'ai.assistant', at: '2026-05-08', body: 'You are a Turkish land marketplace copywriter. Produce a <80 character SEO title emphasizing parcel type, district, m², investment angle. Use no exclamation, max 1 emoji forbidden, plain text.', tokenAvg: 142, rating: 4.8 }
    ],
    active: '1.2',
    uses30d: 1284
  },
  {
    id: 'pt-description',
    name: 'Listing Description Draft',
    category: 'listing',
    versions: [
      { v: '1.0', author: 'system', at: '2026-02-10', body: 'İlan açıklaması üret...', tokenAvg: 612, rating: 4.0 },
      { v: '2.0', author: 'ismail.k', at: '2026-04-22', body: 'Tek paragraf 280-340 karakter Türkçe açıklama. Lokasyon avantajı, imar durumu, ulaşım, kullanım potansiyeli, fiyat-değer notası dahil. Mübalağasız, sade.', tokenAvg: 478, rating: 4.7 }
    ],
    active: '2.0',
    uses30d: 956
  },
  {
    id: 'pt-risk-explain',
    name: 'Risk Score Explainer',
    category: 'risk',
    versions: [
      { v: '1.0', author: 'system', at: '2026-03-01', body: 'TKGM, imar, hisse durumlarına göre 3 cümlelik risk yorumu', tokenAvg: 220, rating: 4.4 }
    ],
    active: '1.0',
    uses30d: 642
  },
  {
    id: 'pt-message-reply',
    name: 'Message Auto-Reply Helper',
    category: 'message',
    versions: [
      { v: '1.0', author: 'system', at: '2026-03-15', body: 'Müzakere bağlamına göre 3 farklı yanıt önerisi', tokenAvg: 312, rating: 4.5 }
    ],
    active: '1.0',
    uses30d: 2104
  },
  {
    id: 'pt-pricing',
    name: 'Valuation Confidence Note',
    category: 'pricing',
    versions: [
      { v: '1.0', author: 'system', at: '2026-02-20', body: 'AI emsal değerleme güven aralığı açıklaması', tokenAvg: 168, rating: 4.3 }
    ],
    active: '1.0',
    uses30d: 489
  },
  {
    id: 'pt-support',
    name: 'Support Ticket Categorizer',
    category: 'support',
    versions: [
      { v: '1.0', author: 'system', at: '2026-03-20', body: 'Destek bildirimi → kategori + öncelik tahmini', tokenAvg: 95, rating: 4.6 }
    ],
    active: '1.0',
    uses30d: 178
  }
];

interface LlmProvider {
  id: string;
  name: string;
  vendor: 'anthropic' | 'openai' | 'google' | 'meta' | 'mistral' | 'local';
  modelId: string;
  context: number;
  pricing: { in: number; out: number };
  status: 'active' | 'standby' | 'disabled';
  latencyP95: number;
  successRate: number;
  monthlyCalls: number;
  monthlyCostUsd: number;
}

const PROVIDERS: LlmProvider[] = [
  { id: 'p-claude-opus-47', name: 'Claude Opus 4.7', vendor: 'anthropic', modelId: 'claude-opus-4-7', context: 1000000, pricing: { in: 15, out: 75 }, status: 'active', latencyP95: 2140, successRate: 99.8, monthlyCalls: 42180, monthlyCostUsd: 8412 },
  { id: 'p-claude-sonnet-46', name: 'Claude Sonnet 4.6', vendor: 'anthropic', modelId: 'claude-sonnet-4-6', context: 1000000, pricing: { in: 3, out: 15 }, status: 'active', latencyP95: 980, successRate: 99.9, monthlyCalls: 184220, monthlyCostUsd: 4280 },
  { id: 'p-claude-haiku-45', name: 'Claude Haiku 4.5', vendor: 'anthropic', modelId: 'claude-haiku-4-5-20251001', context: 200000, pricing: { in: 1, out: 5 }, status: 'active', latencyP95: 420, successRate: 99.9, monthlyCalls: 502400, monthlyCostUsd: 1820 },
  { id: 'p-gpt-5', name: 'GPT-5 Pro', vendor: 'openai', modelId: 'gpt-5-pro', context: 256000, pricing: { in: 12, out: 60 }, status: 'standby', latencyP95: 1840, successRate: 99.6, monthlyCalls: 8420, monthlyCostUsd: 1240 },
  { id: 'p-gemini-25', name: 'Gemini 2.5 Pro', vendor: 'google', modelId: 'gemini-2-5-pro', context: 2000000, pricing: { in: 7, out: 21 }, status: 'standby', latencyP95: 1320, successRate: 99.5, monthlyCalls: 5840, monthlyCostUsd: 612 },
  { id: 'p-llama-4-405', name: 'Llama 4 405B (self-host)', vendor: 'meta', modelId: 'llama-4-405b', context: 128000, pricing: { in: 0, out: 0 }, status: 'standby', latencyP95: 3200, successRate: 98.2, monthlyCalls: 1240, monthlyCostUsd: 0 },
  { id: 'p-mistral-large', name: 'Mistral Large 3', vendor: 'mistral', modelId: 'mistral-large-3', context: 128000, pricing: { in: 6, out: 24 }, status: 'disabled', latencyP95: 1620, successRate: 99.0, monthlyCalls: 0, monthlyCostUsd: 0 }
];

function dailyCostSeries(): { day: string; cost: number; calls: number }[] {
  const arr: { day: string; cost: number; calls: number }[] = [];
  const base = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(base.getTime() - i * 86400_000);
    arr.push({
      day: `${d.getDate()}/${d.getMonth() + 1}`,
      cost: 380 + Math.round(Math.sin(i / 3) * 80 + Math.random() * 40),
      calls: 18000 + Math.round(Math.cos(i / 4) * 4000 + Math.random() * 2000)
    });
  }
  return arr;
}

export default function AiOpsPage() {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const tab: Tab = (section === 'providers' || section === 'observability') ? section : 'prompts';
  const setTab = (t: Tab) => navigate(`/admin/ai-ops/${t}`);

  return (
    <div>
      <SectionHeading
        title="AI Ops"
        description="A06 Prompt Library · A07 LLM Providers · A08 Observability & Cost"
        actions={<AiBadge>Excel A06/A07/A08</AiBadge>}
      />

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'prompts' as Tab, label: 'Prompt Library', Icon: Sparkle },
          { id: 'providers' as Tab, label: 'LLM Providers', Icon: Robot },
          { id: 'observability' as Tab, label: 'Observability & Cost', Icon: ChartLineUp }
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

      {tab === 'prompts' && <PromptsTab />}
      {tab === 'providers' && <ProvidersTab />}
      {tab === 'observability' && <ObservabilityTab />}
    </div>
  );
}

function PromptsTab() {
  const [selectedId, setSelectedId] = useState<string>(PROMPTS[0].id);
  const selected = PROMPTS.find((p) => p.id === selectedId)!;
  const [activeVersion, setActiveVersion] = useState<string>(selected.active);

  const cols: Column<PromptTemplate>[] = [
    { key: 'name', header: 'Şablon', cell: (r) => (
      <button onClick={() => { setSelectedId(r.id); setActiveVersion(r.active); }} className="font-medium text-sm hover:text-brand-600 text-left">
        {r.name}
      </button>
    )},
    { key: 'category', header: 'Kategori', cell: (r) => <code className="text-xs">{r.category}</code> },
    { key: 'versions', header: 'Sürüm', cell: (r) => <span className="text-xs">{r.versions.length} sürüm · aktif <strong>v{r.active}</strong></span>, hideOn: 'sm' },
    { key: 'uses30d', header: 'Kullanım (30g)', accessor: (r) => r.uses30d, cell: (r) => <span className="font-medium tabular-nums">{r.uses30d.toLocaleString('tr-TR')}</span>, sortable: true },
    { key: 'rating', header: 'Skor', cell: (r) => {
      const v = r.versions.find((x) => x.v === r.active)!;
      return <span className="inline-flex items-center gap-1 text-sm">★ <span className="font-medium tabular-nums">{v.rating.toFixed(1)}</span></span>;
    }}
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card className="!p-0 overflow-hidden">
          <DataTable
            data={PROMPTS}
            columns={cols}
            rowKey={(r) => r.id}
            searchable
            searchPlaceholder="Şablon ara..."
            storageKey="ai-ops-prompts"
            aiSuggestions={[
              { label: 'En düşük skorlu prompt\'u v2\'ye yükselt', onRun: () => toast('ai', 'AI önerisi', 'Risk Score Explainer için yeni sürüm taslağı oluşturulabilir.') },
              { label: 'Token avg azaltma analizi', onRun: () => toast('info', 'Analiz', 'Mock: 3 promptta %18 token tasarrufu öneriliyor.') }
            ]}
          />
        </Card>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-20 space-y-3">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium inline-flex items-center gap-2"><Sparkle size={16} weight="fill" className="text-brand-500" />{selected.name}</h3>
              <span className="text-xs text-fg-3">v{activeVersion}</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-fg-3">Sürümler — A/B test için aktif sürümü seçin</div>
              <div className="flex flex-wrap gap-1">
                {selected.versions.map((v) => (
                  <button
                    key={v.v}
                    onClick={() => setActiveVersion(v.v)}
                    className={cls(
                      'text-xs px-2 py-1 rounded-full border',
                      v.v === activeVersion
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >v{v.v}</button>
                ))}
              </div>
              {(() => {
                const v = selected.versions.find((x) => x.v === activeVersion)!;
                return (
                  <>
                    <pre className="text-xs bg-slate-100 dark:bg-slate-800 rounded-r-2 p-2 whitespace-pre-wrap font-mono">{v.body}</pre>
                    <dl className="grid grid-cols-2 gap-2 text-xs">
                      <div><dt className="text-fg-3">Yazar</dt><dd className="font-medium">{v.author}</dd></div>
                      <div><dt className="text-fg-3">Tarih</dt><dd>{v.at}</dd></div>
                      <div><dt className="text-fg-3">Token avg</dt><dd className="font-medium tabular-nums">{v.tokenAvg}</dd></div>
                      <div><dt className="text-fg-3">Memnuniyet</dt><dd>★ {v.rating.toFixed(1)}</dd></div>
                    </dl>
                    <div className="flex gap-2 mt-2">
                      <Button size="xs" iconLeft={<Flask size={12} />} onClick={() => toast('ai', 'Dry-run', `${selected.name} v${v.v} test verisiyle çalıştırıldı. Latency 1.2s, token 152.`)}>Dry-run</Button>
                      <Button size="xs" variant="outline" iconLeft={<Copy size={12} />} onClick={() => { navigator.clipboard?.writeText(v.body); toast('success', 'Kopyalandı', 'Prompt panoya kopyalandı.'); }}>Kopyala</Button>
                      <Button size="xs" variant="outline" iconLeft={<Pencil size={12} />} onClick={() => toast('info', 'Düzenleme', 'Inline editor mock — schema-driven editor sonraki sürümde.')}>Düzenle</Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><GitBranch size={16} /> Sürüm geçmişi</h3>
            <ul className="text-xs space-y-1">
              {selected.versions.slice().reverse().map((v) => (
                <li key={v.v} className="flex items-center justify-between">
                  <span><strong>v{v.v}</strong> <span className="text-fg-3">— {v.author}</span></span>
                  <span className="text-fg-3">{v.at}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </aside>
    </div>
  );
}

function ProvidersTab() {
  const cols: Column<LlmProvider>[] = [
    { key: 'name', header: 'Sağlayıcı', cell: (r) => (
      <div>
        <div className="font-medium text-sm">{r.name}</div>
        <code className="text-[11px] text-fg-3">{r.modelId}</code>
      </div>
    )},
    { key: 'vendor', header: 'Vendor', cell: (r) => <code className="text-xs uppercase">{r.vendor}</code>, hideOn: 'sm' },
    { key: 'context', header: 'Context', cell: (r) => <span className="text-xs tabular-nums">{(r.context / 1000).toLocaleString('tr-TR')}K</span>, hideOn: 'md' },
    { key: 'pricing', header: 'Fiyat (1M tok)', cell: (r) => <span className="text-xs tabular-nums">${r.pricing.in} / ${r.pricing.out}</span>, hideOn: 'sm' },
    { key: 'latency', header: 'p95', accessor: (r) => r.latencyP95, cell: (r) => <span className="text-xs tabular-nums">{r.latencyP95}ms</span>, sortable: true },
    { key: 'success', header: 'Başarı', cell: (r) => <span className="text-xs tabular-nums">{r.successRate.toFixed(1)}%</span>, hideOn: 'md' },
    { key: 'cost', header: 'Aylık $', accessor: (r) => r.monthlyCostUsd, cell: (r) => <span className="font-medium tabular-nums">${r.monthlyCostUsd.toLocaleString('tr-TR')}</span>, sortable: true },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status === 'active' ? 'live' : r.status === 'standby' ? 'review' : 'rejected'} size="sm" /> }
  ];
  const total = PROVIDERS.reduce((s, p) => s + p.monthlyCostUsd, 0);
  const activeCount = PROVIDERS.filter((p) => p.status === 'active').length;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Aktif sağlayıcı" value={activeCount} icon={<Robot size={20} weight="fill" />} hint={`${PROVIDERS.length} toplam`} />
        <Stat label="Aylık toplam" value={`$${total.toLocaleString('tr-TR')}`} icon={<CurrencyCircleDollar size={20} weight="fill" />} hint="Tüm sağlayıcılar" />
        <Stat label="Ana model" value="Sonnet 4.6" icon={<Sparkle size={20} weight="fill" />} hint="184k/ay çağrı" />
        <Stat label="Failover" value="Opus → GPT-5" icon={<Lightning size={20} weight="fill" />} hint="Otomatik routing" />
      </div>
      <Card className="!p-0 overflow-hidden">
        <DataTable
          data={PROVIDERS}
          columns={cols}
          rowKey={(r) => r.id}
          searchable
          searchPlaceholder="Sağlayıcı ara..."
          storageKey="ai-ops-providers"
          aiSuggestions={[
            { label: 'Tasarruf önerisi: %40 trafik Haiku 4.5\'e yönlendir', onRun: () => toast('ai', 'Tasarruf önerisi', 'Mock: aylık tahmini ~$2.840 tasarruf.') }
          ]}
        />
      </Card>
      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><GitBranch size={16} /> Routing politikası</h3>
        <ul className="text-sm space-y-1 text-fg-2">
          <li>• <strong>default</strong> → <code>claude-sonnet-4-6</code> (cost-balanced)</li>
          <li>• <strong>complex</strong> (system prompt + 64k input) → <code>claude-opus-4-7</code></li>
          <li>• <strong>realtime</strong> (latency &lt; 500ms) → <code>claude-haiku-4-5</code></li>
          <li>• <strong>vision</strong> → <code>gemini-2-5-pro</code> (fallback: <code>opus-4-7</code>)</li>
          <li>• <strong>failover</strong>: 3 deneme · 2sn backoff · standby pool</li>
        </ul>
      </Card>
    </div>
  );
}

function ObservabilityTab() {
  const series = useMemo(() => dailyCostSeries(), []);
  const totalCost = series.reduce((s, r) => s + r.cost, 0);
  const totalCalls = series.reduce((s, r) => s + r.calls, 0);
  const byVendor = useMemo(() => {
    const grp = PROVIDERS.reduce<Record<string, number>>((acc, p) => {
      acc[p.vendor] = (acc[p.vendor] || 0) + p.monthlyCostUsd;
      return acc;
    }, {});
    return Object.entries(grp).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, []);
  const COLORS = ['#0e7c61', '#1d4ed8', '#c97f1d', '#7c3aed', '#dc2626', '#475569'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="30 gün maliyet" value={`$${totalCost.toLocaleString('tr-TR')}`} icon={<CurrencyCircleDollar size={20} weight="fill" />} hint="Tüm modeller" />
        <Stat label="30 gün çağrı" value={totalCalls.toLocaleString('tr-TR')} icon={<Lightning size={20} weight="fill" />} hint="Ortalama günlük ~25k" />
        <Stat label="Avg ms/çağrı" value="780ms" icon={<ChartLineUp size={20} weight="fill" />} hint="Tüm endpointler" />
        <Stat label="Hata oranı" value="0.18%" icon={<Brain size={20} weight="fill" />} hint="Bütün retry sonrası" />
      </div>
      <Card>
        <h3 className="font-medium mb-2">30 günlük maliyet trendi</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 5, right: 16, bottom: 0, left: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="cost" stroke="#0e7c61" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="grid lg:grid-cols-2 gap-3">
        <Card>
          <h3 className="font-medium mb-2">Günlük çağrı sayısı</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={series} margin={{ top: 5, right: 12, bottom: 0, left: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="calls" fill="#c97f1d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Vendor maliyet dağılımı</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byVendor} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {byVendor.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString('tr-TR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <StreamingDemoCard />
      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Plus size={16} /> Bütçe alarmı kuralları</h3>
        <ul className="text-sm space-y-1 text-fg-2">
          <li>• Günlük maliyet &gt; $600 → admin Slack + e-posta</li>
          <li>• Saatlik çağrı &gt; 2000 → otomatik rate-limit, Sonnet'e düşür</li>
          <li>• Provider success rate &lt; 99% (5dk) → failover'a geç</li>
          <li>• Aylık bütçe %85'i aşıldı → standby model'leri otomatik aç</li>
        </ul>
      </Card>
    </div>
  );
}

// A10 Streaming & SSE Primitives — token-by-token stream simülasyonu
const STREAM_TEXT =
  'AI değerleme bandı hesaplandı. Beykoz Riva bölgesinde son 12 aydaki 8 emsal incelendi. ' +
  'Bu parsel için önerilen fiyat aralığı 3.8M-4.5M TL. Güven aralığı %84. ' +
  'Tapu türü müstakil, imar tarım sınırı, TKGM kaydında şerh yok. ' +
  'Risk skoru 18/100 (düşük). Öneri: yayın için ideal fiyat 4.2M TL.';

function StreamingDemoCard() {
  const [streaming, setStreaming] = useState(false);
  const [shown, setShown] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);

  function stop() {
    if (tickRef.current) { clearTimeout(tickRef.current); tickRef.current = null; }
    setStreaming(false);
  }

  function start() {
    setShown('');
    setTokenCount(0);
    setElapsed(0);
    setStreaming(true);
    startRef.current = Date.now();
    const tokens = STREAM_TEXT.split(' ');
    let i = 0;
    const step = () => {
      if (i >= tokens.length) { stop(); return; }
      setShown((s) => (s ? s + ' ' : '') + tokens[i]);
      setTokenCount(i + 1);
      setElapsed(Date.now() - startRef.current);
      i++;
      tickRef.current = setTimeout(step, 40 + Math.random() * 80);
    };
    step();
  }

  useEffect(() => () => { if (tickRef.current) clearTimeout(tickRef.current); }, []);

  const tps = elapsed > 0 ? (tokenCount / (elapsed / 1000)).toFixed(1) : '0.0';

  return (
    <Card>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <h3 className="font-medium inline-flex items-center gap-2"><Lightning size={16} weight="fill" className="text-amber-500" /> A10 — Streaming Demo</h3>
        <div className="text-xs text-fg-3">
          {tokenCount} token · {(elapsed / 1000).toFixed(1)}sn · <strong className="text-fg-1">{tps} t/sn</strong>
        </div>
      </div>
      <p className="text-xs text-fg-3 mb-2">Token-by-token SSE simülasyonu — gerçek üretimde Claude'un stream API'sine bağlanır, geri bağlanma + retry primitive\'leri otomatik çalışır.</p>
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-r-2 p-3 text-sm font-mono min-h-[120px] whitespace-pre-wrap leading-relaxed">
        {shown}
        {streaming && <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-0.5 animate-pulse align-middle" />}
        {!streaming && !shown && <span className="text-slate-500">// Akış başlatılmadı. Aşağıdaki butona basın.</span>}
      </div>
      <div className="flex gap-2 mt-3">
        {!streaming
          ? <Button size="sm" iconLeft={<Play size={14} />} onClick={start}>Akışı başlat</Button>
          : <Button size="sm" variant="danger" iconLeft={<Stop size={14} />} onClick={stop}>Durdur</Button>}
        <Button size="sm" variant="outline" onClick={() => { setShown(''); setTokenCount(0); setElapsed(0); }} disabled={streaming}>Temizle</Button>
      </div>
    </Card>
  );
}
