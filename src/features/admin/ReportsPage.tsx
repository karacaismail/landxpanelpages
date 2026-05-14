import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { Users, MapPin, Briefcase, ChartLineUp, Cpu, Pulse, Sparkle, Funnel, CurrencyCircleDollar, Eye, Clock, Download, FileText, ChartBar, Brain, ArrowUpRight, ArrowDownRight, Warning, CheckCircle } from '@phosphor-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend, Line, LineChart, FunnelChart as RechartsFunnel, RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis, ComposedChart } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

const COLORS = ['#0e7c61', '#c97f1d', '#2563eb', '#d97706', '#dc2626', '#16a34a', '#7c3aed', '#475569'];

const TABS = [
  { id: '', label: 'Genel Bakış', Icon: ChartLineUp },
  { id: 'financial', label: 'Finansal', Icon: CurrencyCircleDollar },
  { id: 'funnel', label: 'Conversion Funnel', Icon: Funnel },
  { id: 'cohort', label: 'Cohort & Retention', Icon: Users },
  { id: 'geographic', label: 'Coğrafi', Icon: MapPin },
  { id: 'ai-usage', label: 'AI Kullanım', Icon: Brain },
  { id: 'health', label: 'SLO & Sağlık', Icon: Pulse }
];

export default function ReportsPage() {
  const { section } = useParams();
  const view = (section || '') as '' | 'ai-usage' | 'health' | 'financial' | 'funnel' | 'cohort' | 'geographic';

  return (
    <div>
      <SectionHeading
        title="Raporlar"
        description="Enterprise dashboard — 7 alt sekme"
        actions={
          <div className="flex flex-wrap gap-1.5">
            <AiBadge>AI özet</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<Download size={14} />} onClick={() => toast('success', 'CSV dışa aktarım', 'reports-overview.csv hazırlandı (mock).')}>CSV</Button>
            <Button size="sm" variant="outline" iconLeft={<FileText size={14} />} onClick={() => toast('success', 'PDF rapor', 'monthly-board-report.pdf hazırlandı (mock).')}>PDF</Button>
          </div>
        }
      />

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {TABS.map(({ id, label, Icon }) => (
          <Link
            key={id}
            to={`/admin/reports${id ? '/' + id : ''}`}
            className={cls(
              'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors',
              view === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
            )}
            aria-current={view === id}
          >
            <Icon size={14} weight={view === id ? 'fill' : 'regular'} /> {label}
          </Link>
        ))}
      </div>

      {view === '' && <Overview />}
      {view === 'financial' && <FinancialDashboard />}
      {view === 'funnel' && <FunnelDashboard />}
      {view === 'cohort' && <CohortDashboard />}
      {view === 'geographic' && <GeographicDashboard />}
      {view === 'ai-usage' && <AiUsage />}
      {view === 'health' && <HealthDashboard />}
    </div>
  );
}

function Overview() {
  const data = useData();
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const cityBuckets = useMemo(() => {
    const m = new Map<string, number>();
    data.listings.forEach((l) => m.set(l.city, (m.get(l.city) || 0) + 1));
    return Array.from(m.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [data.listings]);

  const sellerLeaderboard = useMemo(() => {
    const sellers = data.users.filter((u) => u.roles.includes('seller'));
    return sellers.map((s) => {
      const own = data.listings.filter((l) => l.ownerId === s.id);
      const live = own.filter((l) => l.status === 'live').length;
      const views = own.reduce((sum, l) => sum + l.views, 0);
      return { name: s.displayName.slice(0, 20), live, views };
    }).sort((a, b) => b.views - a.views).slice(0, 8);
  }, [data.users, data.listings]);

  const kycPie = useMemo(() => {
    const m = new Map<string, number>();
    data.users.forEach((u) => m.set(u.kycLevel, (m.get(u.kycLevel) || 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [data.users]);
  const imarPie = useMemo(() => {
    const m = new Map<string, number>();
    data.listings.forEach((l) => m.set(l.imarType, (m.get(l.imarType) || 0) + 1));
    return Array.from(m.entries()).map(([imar, value]) => ({ name: imar, value }));
  }, [data.listings]);
  const days = useMemo(() => Array.from({ length: period }, (_, i) => ({
    day: i + 1,
    listings: Math.round(6 + Math.sin(i / 4) * 3 + Math.random() * 4),
    offers: Math.round(3 + Math.cos(i / 5) * 2 + Math.random() * 3)
  })), [period]);

  return (
    <>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs text-fg-3">Dönem:</span>
        {([7, 30, 90] as const).map((d) => (
          <button key={d} onClick={() => setPeriod(d)} className={`rounded-full px-3 py-1 text-xs border ${period === d ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2'}`}>Son {d} gün</button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Kullanıcı" value={data.users.length} icon={<Users size={20} weight="fill" />} delta={{ value: 12.4 }} />
        <Stat label="İlanlar" value={data.listings.length} icon={<MapPin size={20} weight="fill" />} delta={{ value: 8.2 }} />
        <Stat label="Teklifler" value={data.offers.length} icon={<Briefcase size={20} weight="fill" />} delta={{ value: 3.1 }} />
        <Stat label="Dönüşüm" value="4.2%" icon={<ChartLineUp size={20} weight="fill" />} delta={{ value: 0.4 }} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <h3 className="font-medium mb-2">Günlük yayın aktivitesi</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="listings" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                <Area type="monotone" dataKey="offers" stroke="#c97f1d" fill="rgba(201,127,29,0.18)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">İmar dağılımı</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={imarPie} dataKey="value" nameKey="name" outerRadius={80} label>
                  {imarPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <h3 className="font-medium mb-2">İl bazlı ilan sayısı (Top 10)</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={cityBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="city" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0e7c61" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <h3 className="font-medium mb-2">KYC dağılımı</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={kycPie} dataKey="value" nameKey="name" outerRadius={80} label>
                  {kycPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Top 8 satıcı (görüntülenme)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={sellerLeaderboard} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                <Tooltip />
                <Bar dataKey="views" fill="#c97f1d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}

function AiUsage() {
  const days = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    tokens: Math.round(45000 + Math.sin(i / 3) * 12000 + Math.random() * 8000),
    cost: Math.round((45000 + Math.sin(i / 3) * 12000) * 0.000003 * 100) / 100,
    latencyP95: Math.round(800 + Math.cos(i / 4) * 200 + Math.random() * 100)
  })), []);

  const providers = [
    { name: 'Anthropic Claude', value: 62, color: '#0e7c61' },
    { name: 'OpenAI GPT', value: 24, color: '#c97f1d' },
    { name: 'Azure OpenAI', value: 8, color: '#2563eb' },
    { name: 'Ollama (lokal)', value: 6, color: '#16a34a' }
  ];

  const features = [
    { feature: 'Listing özet', tokens: 145000, cost: 0.435 },
    { feature: 'NL arama', tokens: 98000, cost: 0.294 },
    { feature: 'Risk açıklama', tokens: 76000, cost: 0.228 },
    { feature: 'Mesaj taslak', tokens: 68000, cost: 0.204 },
    { feature: 'Fiyat öneri', tokens: 42000, cost: 0.126 },
    { feature: 'Bildirim', tokens: 21000, cost: 0.063 }
  ];

  return (
    <>
      <Card className="mb-4 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-1.5"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI özet</span></div>
        <p className="text-sm text-fg-2">Son 30 günde 1.45M token. Toplam maliyet ₺1.35 (mock). En aktif: Listing özet ve NL arama. Halüsinasyon eşiği: %2.1, hedef &lt;%5.</p>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Toplam Token" value="1.45M" icon={<Cpu size={20} weight="fill" />} delta={{ value: 18.2 }} />
        <Stat label="Maliyet" value="₺1.35" icon={<ChartLineUp size={20} weight="fill" />} delta={{ value: -4.1 }} />
        <Stat label="P95 Latency" value="820ms" icon={<Pulse size={20} weight="fill" />} delta={{ value: -2.4 }} />
        <Stat label="Halüsinasyon" value="2.1%" icon={<Sparkle size={20} weight="fill" />} delta={{ value: 0.3 }} hint="Hedef <%5" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <h3 className="font-medium mb-2">Günlük token kullanımı</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="tokens" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">P95 Latency (ms)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="latencyP95" stroke="#c97f1d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-2">Sağlayıcı dağılımı</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={providers} dataKey="value" nameKey="name" outerRadius={80} label>
                  {providers.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Özellik bazlı tüketim</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                <th className="text-left py-2">Özellik</th>
                <th className="text-right py-2">Token</th>
                <th className="text-right py-2">Maliyet (₺)</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.feature} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-2">{f.feature}</td>
                  <td className="text-right">{f.tokens.toLocaleString('tr-TR')}</td>
                  <td className="text-right">{f.cost.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}

function HealthDashboard() {
  const sloData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    p99: Math.round(320 + Math.random() * 80),
    errorRate: Math.round(Math.random() * 50) / 100
  })), []);

  const incidents = [
    { id: 'i-001', sev: 'P3', title: 'TKGM API geçici yavaşlama', status: 'çözüldü', mttr: '24dk' },
    { id: 'i-002', sev: 'P2', title: 'Cache invalidation eksikliği', status: 'çözüldü', mttr: '48dk' },
    { id: 'i-003', sev: 'P3', title: 'CDN bölgesel gecikme', status: 'çözüldü', mttr: '12dk' }
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Uptime (30g)" value="99.94%" icon={<Pulse size={20} weight="fill" />} hint="SLO ≥99.9%" />
        <Stat label="Hata Bütçesi" value="%60 kaldı" icon={<ChartLineUp size={20} weight="fill" />} hint="bu ay" />
        <Stat label="MTTR" value="28dk" icon={<Pulse size={20} weight="fill" />} delta={{ value: -12.4 }} />
        <Stat label="Açık olay" value={0} icon={<Sparkle size={20} weight="fill" />} hint="P1/P2 yok" />
      </div>

      <Card className="mb-4">
        <h3 className="font-medium mb-2">P99 Latency & Hata Oranı</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={sloData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="p99" stroke="#0e7c61" strokeWidth={2} dot={false} name="P99 ms" />
              <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#dc2626" strokeWidth={2} dot={false} name="Hata %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-2">Son olaylar</h3>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {incidents.map((i) => (
            <li key={i.id} className="py-2 flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">{i.sev}</span>
              <span className="flex-1">{i.title}</span>
              <span className="text-xs text-fg-3">MTTR: {i.mttr}</span>
              <span className="text-xs text-emerald-600">{i.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

// ───────── Financial Dashboard ─────────
function FinancialDashboard() {
  const monthly = useMemo(() => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return months.slice(0, 5).map((m, i) => ({
      month: m,
      grossVolume: Math.round(2400000 + Math.sin(i) * 380000 + i * 240000),
      commission: Math.round(48000 + Math.sin(i) * 8000 + i * 4200),
      arr: Math.round(580000 + i * 32000),
      newDeals: Math.round(8 + Math.sin(i / 2) * 2 + i)
    }));
  }, []);
  const planMix = [
    { name: 'Demo', value: 1, color: '#94a3b8' },
    { name: 'Starter (₺990)', value: 12, color: '#0ea5e9' },
    { name: 'Pro (₺4.900)', value: 18, color: '#0e7c61' },
    { name: 'Enterprise', value: 3, color: '#c97f1d' }
  ];
  const arr = planMix.reduce((s, p) => s + p.value * (p.name.includes('Starter') ? 990 : p.name.includes('Pro') ? 4900 : p.name.includes('Enterprise') ? 18000 : 0), 0) * 12;
  return (
    <>
      <Card className="mb-4 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/30">
        <div className="flex items-center gap-2 mb-1.5"><Sparkle size={16} weight="fill" className="text-emerald-500" /><span className="font-medium">AI özet</span></div>
        <p className="text-sm text-fg-2">Bu ay komisyon geliri <strong>₺68.4K</strong> (+%18 önceki aya göre). 3 yeni Enterprise sözleşme, 2 churn riski. AI önerisi: Bodrum Mülk tenant'ı için upsell fırsatı (Pro → Enterprise, +₺13K ARR).</p>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="MRR" value="₺58.4K" icon={<CurrencyCircleDollar size={20} weight="fill" />} delta={{ value: 12.4 }} />
        <Stat label="ARR" value={`₺${(arr / 1000).toFixed(0)}K`} icon={<ChartLineUp size={20} weight="fill" />} delta={{ value: 18.2 }} />
        <Stat label="GMV (ay)" value="₺3.6M" icon={<Briefcase size={20} weight="fill" />} delta={{ value: 24.1 }} />
        <Stat label="Komisyon" value="₺72K" icon={<CurrencyCircleDollar size={20} weight="fill" />} delta={{ value: 18.2 }} hint="%2 GMV" />
        <Stat label="Churn (90g)" value="2.1%" icon={<Warning size={20} weight="fill" />} delta={{ value: -0.3 }} hint="Sektör 4.8%" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <h3 className="font-medium mb-2">GMV + Komisyon trendi</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <ComposedChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₺${v.toLocaleString('tr-TR')}`} />
                <Legend />
                <Bar yAxisId="left" dataKey="grossVolume" fill="rgba(14,124,97,0.6)" name="GMV" />
                <Line yAxisId="right" type="monotone" dataKey="commission" stroke="#c97f1d" strokeWidth={2} name="Komisyon" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Tenant plan dağılımı (gelir)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={planMix} dataKey="value" nameKey="name" outerRadius={80} label>
                  {planMix.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <h3 className="font-medium mb-2">Aylık brif</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left py-2">Ay</th>
              <th className="text-right py-2">GMV</th>
              <th className="text-right py-2">Komisyon</th>
              <th className="text-right py-2">ARR</th>
              <th className="text-right py-2">Yeni anlaşma</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((m) => (
              <tr key={m.month} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="py-2 font-medium">{m.month}</td>
                <td className="text-right tabular-nums">₺{m.grossVolume.toLocaleString('tr-TR')}</td>
                <td className="text-right tabular-nums">₺{m.commission.toLocaleString('tr-TR')}</td>
                <td className="text-right tabular-nums">₺{m.arr.toLocaleString('tr-TR')}</td>
                <td className="text-right tabular-nums">{m.newDeals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// ───────── Funnel Dashboard ─────────
function FunnelDashboard() {
  const buyerFunnel = [
    { stage: 'Site ziyareti', count: 28400, dropoff: 0 },
    { stage: 'İlan görüntüleme', count: 12800, dropoff: 55 },
    { stage: 'Detay açma', count: 6240, dropoff: 51 },
    { stage: 'Favorile/karşılaştır', count: 2840, dropoff: 54 },
    { stage: 'Mesaj/teklif', count: 824, dropoff: 71 },
    { stage: 'Satış kapanış', count: 142, dropoff: 83 }
  ];
  const sellerFunnel = [
    { stage: 'Kayıt', count: 380, dropoff: 0 },
    { stage: 'İlk ilan başlat', count: 268, dropoff: 29 },
    { stage: 'AI ile doldur', count: 220, dropoff: 18 },
    { stage: 'Yayın talebi', count: 184, dropoff: 16 },
    { stage: 'Canlı', count: 162, dropoff: 12 }
  ];
  return (
    <>
      <Card className="mb-4 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/30">
        <div className="flex items-center gap-2 mb-1.5"><Sparkle size={16} weight="fill" className="text-amber-500" /><span className="font-medium">AI özet</span></div>
        <p className="text-sm text-fg-2">Alıcı funnel'da en büyük drop "Detay → Mesaj/Teklif" arası (%71). AI önerisi: ilan detayında "1-tık teklif" CTA, fiyat alarmı promosyonu. Satıcı funnel'da AI auto-fill kullanımı oluşturma oranını %35 yükseltiyor.</p>
      </Card>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-3 inline-flex items-center gap-2"><Eye size={16} /> Alıcı yolculuğu</h3>
          <div className="space-y-2">
            {buyerFunnel.map((s, i) => {
              const pct = (s.count / buyerFunnel[0].count) * 100;
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="font-medium">{i + 1}. {s.stage}</span>
                    <span className="text-fg-3 text-xs">
                      {s.count.toLocaleString('tr-TR')}
                      {s.dropoff > 0 && <span className="ml-2 text-rose-600">-%{s.dropoff}</span>}
                    </span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-r-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-fg-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <strong>Genel dönüşüm:</strong> %{(buyerFunnel[buyerFunnel.length - 1].count / buyerFunnel[0].count * 100).toFixed(2)} (ziyaret → satış)
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-3 inline-flex items-center gap-2"><Briefcase size={16} /> Satıcı yolculuğu</h3>
          <div className="space-y-2">
            {sellerFunnel.map((s, i) => {
              const pct = (s.count / sellerFunnel[0].count) * 100;
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="font-medium">{i + 1}. {s.stage}</span>
                    <span className="text-fg-3 text-xs">
                      {s.count.toLocaleString('tr-TR')}
                      {s.dropoff > 0 && <span className="ml-2 text-rose-600">-%{s.dropoff}</span>}
                    </span>
                  </div>
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-r-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-fg-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <strong>Aktivasyon oranı:</strong> %{(sellerFunnel[sellerFunnel.length - 1].count / sellerFunnel[0].count * 100).toFixed(1)} (kayıt → canlı ilan)
          </div>
        </Card>
      </div>
    </>
  );
}

// ───────── Cohort Dashboard ─────────
function CohortDashboard() {
  // Mock 6 cohort, 6 month retention
  const cohorts = ['Aralık 2025', 'Ocak 2026', 'Şubat 2026', 'Mart 2026', 'Nisan 2026', 'Mayıs 2026'];
  const monthsOut = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];
  const data = cohorts.map((c, ci) => {
    const row: Record<string, string | number> = { cohort: c, size: 80 + Math.round(Math.random() * 60) };
    monthsOut.forEach((m, mi) => {
      if (mi > cohorts.length - 1 - ci) return;
      const base = 100 - mi * 12 - Math.random() * 8;
      row[m] = Math.max(0, Math.round(base));
    });
    return row;
  });

  function cellColor(val: number): string {
    if (val >= 80) return 'bg-emerald-500 text-white';
    if (val >= 60) return 'bg-emerald-300 text-emerald-900';
    if (val >= 40) return 'bg-amber-200 text-amber-900';
    if (val >= 20) return 'bg-orange-200 text-orange-900';
    if (val > 0) return 'bg-rose-200 text-rose-900';
    return 'bg-slate-100 dark:bg-slate-800 text-fg-3';
  }
  return (
    <>
      <Card className="mb-4 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-1.5"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI özet</span></div>
        <p className="text-sm text-fg-2">Ocak 2026 cohort'u M3'te %72 retention ile en güçlüsü. Şubat'taki düşüşün sebebi: KYC zorunluluğu lansmanı (geçici friction). M2 retention son 3 ayda +%8.</p>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Avg M1 retention" value="78%" icon={<Users size={20} weight="fill" />} delta={{ value: 4.2 }} />
        <Stat label="Avg M3 retention" value="52%" icon={<Users size={20} weight="fill" />} delta={{ value: 8.1 }} />
        <Stat label="Power users (5+)" value="142" icon={<Sparkle size={20} weight="fill" />} delta={{ value: 18.4 }} hint="Aylık 5+ giriş" />
        <Stat label="LTV (avg)" value="₺2.4K" icon={<CurrencyCircleDollar size={20} weight="fill" />} delta={{ value: 12.2 }} />
      </div>

      <Card>
        <h3 className="font-medium mb-3">Retention matrisi (% — Mxx ayında hâlâ aktif)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left pb-2 pr-3 text-fg-3 font-medium">Cohort</th>
                <th className="text-right pb-2 pr-3 text-fg-3 font-medium">Boyut</th>
                {monthsOut.map((m) => <th key={m} className="text-center pb-2 px-1 text-fg-3 font-medium">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.cohort as string}>
                  <td className="py-1 pr-3 font-medium">{row.cohort}</td>
                  <td className="py-1 pr-3 text-right tabular-nums text-fg-3">{row.size}</td>
                  {monthsOut.map((m) => {
                    const val = row[m] as number | undefined;
                    return (
                      <td key={m} className="py-1 px-0.5">
                        {val !== undefined ? (
                          <div className={cls('rounded text-center py-1.5 font-medium tabular-nums', cellColor(val))}>
                            {val}%
                          </div>
                        ) : (
                          <div className="rounded text-center py-1.5 text-fg-3 bg-slate-50 dark:bg-slate-800/30">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-3">
          <span>Düşük</span>
          <div className="flex gap-0.5">
            {[20, 40, 60, 80, 100].map((v) => <div key={v} className={cls('w-6 h-3 rounded-sm', cellColor(v - 5))} />)}
          </div>
          <span>Yüksek</span>
        </div>
      </Card>
    </>
  );
}

// ───────── Geographic Dashboard ─────────
function GeographicDashboard() {
  const d = useData();
  const cityStats = useMemo(() => {
    const m = new Map<string, { listings: number; views: number; offers: number; sold: number }>();
    d.listings.forEach((l) => {
      const cur = m.get(l.city) || { listings: 0, views: 0, offers: 0, sold: 0 };
      cur.listings++;
      cur.views += l.views;
      if (l.status === 'sold') cur.sold++;
      m.set(l.city, cur);
    });
    d.offers.forEach((o) => {
      const l = d.listings.find((x) => x.id === o.listingId);
      if (l) {
        const cur = m.get(l.city);
        if (cur) cur.offers++;
      }
    });
    return Array.from(m.entries()).map(([city, s]) => ({ city, ...s, conv: s.listings > 0 ? (s.sold / s.listings) * 100 : 0 })).sort((a, b) => b.listings - a.listings).slice(0, 15);
  }, [d.listings, d.offers]);

  const totalGmv = cityStats.reduce((s, c) => s + c.sold * 2_400_000, 0);
  return (
    <>
      <Card className="mb-4 bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/30">
        <div className="flex items-center gap-2 mb-1.5"><Sparkle size={16} weight="fill" className="text-sky-500" /><span className="font-medium">AI özet</span></div>
        <p className="text-sm text-fg-2">İstanbul ilan hacminin %22'sini oluşturuyor ama dönüşüm İzmir + Muğla'da %18 daha yüksek. AI önerisi: İzmir & Muğla için reklam bütçesi artırılsın.</p>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Aktif il" value={cityStats.length} icon={<MapPin size={20} weight="fill" />} hint="81 toplam" />
        <Stat label="Top il GMV" value={`₺${(cityStats[0]?.sold * 2.4 || 0).toFixed(1)}M`} icon={<CurrencyCircleDollar size={20} weight="fill" />} />
        <Stat label="Toplam GMV" value={`₺${(totalGmv / 1000000).toFixed(1)}M`} icon={<ChartLineUp size={20} weight="fill" />} delta={{ value: 24.1 }} />
        <Stat label="Avg dönüşüm" value={`${(cityStats.reduce((s, c) => s + c.conv, 0) / cityStats.length).toFixed(1)}%`} icon={<Funnel size={20} weight="fill" />} />
      </div>
      <Card>
        <h3 className="font-medium mb-2">İl bazlı performans (Top 15)</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left py-2">İl</th>
              <th className="text-right py-2">İlan</th>
              <th className="text-right py-2">Görüntülenme</th>
              <th className="text-right py-2 hidden sm:table-cell">Teklif</th>
              <th className="text-right py-2 hidden md:table-cell">Satış</th>
              <th className="text-right py-2">Dönüşüm</th>
            </tr>
          </thead>
          <tbody>
            {cityStats.map((c) => (
              <tr key={c.city} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="py-2 font-medium">{c.city}</td>
                <td className="text-right tabular-nums">{c.listings}</td>
                <td className="text-right tabular-nums">{c.views.toLocaleString('tr-TR')}</td>
                <td className="text-right tabular-nums hidden sm:table-cell">{c.offers}</td>
                <td className="text-right tabular-nums hidden md:table-cell">{c.sold}</td>
                <td className="text-right tabular-nums">
                  <span className={cls('font-medium', c.conv >= 5 ? 'text-emerald-600 dark:text-emerald-400' : c.conv >= 2 ? 'text-fg-1' : 'text-fg-3')}>
                    {c.conv.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
