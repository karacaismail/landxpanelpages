import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Users, MapPin, Briefcase, ChartLineUp, Cpu, Pulse, Sparkle } from '@phosphor-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend, Line, LineChart } from 'recharts';

const COLORS = ['#0e7c61', '#c97f1d', '#2563eb', '#d97706', '#dc2626', '#16a34a', '#7c3aed', '#475569'];

const TABS = [
  { id: '', label: 'Genel Bakış' },
  { id: 'ai-usage', label: 'AI Kullanım' },
  { id: 'health', label: 'SLO & Sağlık' }
];

export default function ReportsPage() {
  const { section } = useParams();
  const view = (section || '') as '' | 'ai-usage' | 'health';

  return (
    <div>
      <SectionHeading title="Raporlar" description="Sistem genel kabini ve AI/SLO sekmeleri" />

      <div className="flex flex-wrap gap-1.5 mb-4">
        {TABS.map((t) => (
          <Link key={t.id} to={`/admin/reports${t.id ? '/' + t.id : ''}`}
            className={`rounded-full px-3 py-1 text-xs border ${view === t.id ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2'}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {view === '' && <Overview />}
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
