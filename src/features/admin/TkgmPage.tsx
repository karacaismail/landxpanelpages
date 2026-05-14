// TKGM Entegrasyon Paneli — enterprise edition
import { useMemo, useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AiBadge } from '@/components/ui/AiBadge';
import {
  Buildings, ShieldCheck, Pulse, Sparkle, FileText, Upload, Warning,
  CheckCircle, Clock, ChartLineUp, Lightning, MapPin, Hash, ArrowsClockwise, X
} from '@phosphor-icons/react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { queryParcel, tkgmCodeMessage } from '@/lib/tkgm/mock-api';
import { formatDateTime } from '@/lib/utils/format';
import type { TkgmQuery } from '@/types/domain';
import { useAuth } from '@/store/auth';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#64748b'];

export default function TkgmPage() {
  const data = useData();
  const auth = useAuth();
  const [tab, setTab] = useState<'overview' | 'verify' | 'bulk' | 'ocr' | 'history' | 'monitoring'>('overview');
  const [il, setIl] = useState('İstanbul');
  const [ilce, setIlce] = useState('Beykoz');
  const [ada, setAda] = useState('1234');
  const [parsel, setParsel] = useState('56');
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<TkgmQuery | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number; ok: number; err: number }>({ done: 0, total: 0, ok: 0, err: 0 });
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<Record<string, string> | null>(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);

  async function run() {
    setLoading(true);
    const q = await queryParcel({ il, ilce, ada, parsel, userId: auth.currentUserId || 'u-0000' });
    data.recordTkgm(q);
    setLast(q);
    setLoading(false);
    if (q.status === 'OK') toast('success', 'TKGM doğrulandı', `${q.input.il}/${q.input.ilce} ${q.input.ada}/${q.input.parsel} — ${q.latencyMs}ms`);
    else toast('warning', `TKGM hatası: ${q.status}`, tkgmCodeMessage(q.status));
  }

  async function runBulk() {
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setBulkRunning(true);
    setBulkProgress({ done: 0, total: lines.length, ok: 0, err: 0 });
    for (const line of lines) {
      const parts = line.split(/[/,\s]+/).filter(Boolean);
      const [bIl, bIlce, bAda, bParsel] = parts;
      if (!bIl || !bIlce || !bAda || !bParsel) {
        setBulkProgress((p) => ({ ...p, done: p.done + 1, err: p.err + 1 }));
        continue;
      }
      const q = await queryParcel({ il: bIl, ilce: bIlce, ada: bAda, parsel: bParsel, userId: auth.currentUserId || 'u-0000' });
      data.recordTkgm(q);
      setBulkProgress((p) => ({ done: p.done + 1, total: p.total, ok: p.ok + (q.status === 'OK' ? 1 : 0), err: p.err + (q.status !== 'OK' ? 1 : 0) }));
      await new Promise((r) => setTimeout(r, 200));
    }
    setBulkRunning(false);
    toast('success', 'Toplu doğrulama tamamlandı', `${lines.length} sorgu işlendi.`);
  }

  function runOcr() {
    if (!ocrFile) return;
    setOcrProcessing(true);
    setOcrResult(null);
    setTimeout(() => {
      setOcrResult({
        'Belge tipi': 'Tapu Senedi (E-Tapu)',
        'Mal sahibi': 'M*** Y***',
        'İl': 'İstanbul',
        'İlçe': 'Beykoz',
        'Mahalle': 'Riva',
        'Ada': '1234',
        'Parsel': '56',
        'Yüzölçümü': '5.082 m²',
        'Cinsi': 'Tarla',
        'Hisse': 'Tam (1/1)',
        'TKGM Kaydı': '✓ Şerh yok'
      });
      setOcrProcessing(false);
      toast('ai', 'OCR tamamlandı', 'Belge bilgileri otomatik çıkarıldı, form alanlarına aktarılabilir.');
    }, 1800);
  }

  // Aggregations
  const stats = useMemo(() => {
    const total = data.tkgmQueries.length;
    const ok = data.tkgmQueries.filter((q) => q.status === 'OK').length;
    const avgLatency = total > 0 ? Math.round(data.tkgmQueries.reduce((s, q) => s + q.latencyMs, 0) / total) : 0;
    const last24h = data.tkgmQueries.filter((q) => Date.now() - new Date(q.createdAt).getTime() < 86400_000).length;
    return { total, ok, avgLatency, successRate: total > 0 ? Math.round((ok / total) * 100) : 0, last24h };
  }, [data.tkgmQueries]);

  const statusBreakdown = useMemo(() => {
    const m = new Map<string, number>();
    data.tkgmQueries.forEach((q) => m.set(q.status, (m.get(q.status) || 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data.tkgmQueries]);

  const hourly = useMemo(() => {
    const buckets: Record<number, number> = {};
    data.tkgmQueries.forEach((q) => {
      const h = new Date(q.createdAt).getHours();
      buckets[h] = (buckets[h] || 0) + 1;
    });
    return Array.from({ length: 24 }, (_, h) => ({ hour: `${h.toString().padStart(2, '0')}:00`, count: buckets[h] || 0 }));
  }, [data.tkgmQueries]);

  const latencyTrend = useMemo(() => {
    const last100 = data.tkgmQueries.slice(0, 30).reverse();
    return last100.map((q, i) => ({ i, ms: q.latencyMs }));
  }, [data.tkgmQueries]);

  const columns: Column<TkgmQuery>[] = [
    { key: 'createdAt', header: 'Zaman', sortable: true, cell: (r) => <span className="text-xs whitespace-nowrap">{formatDateTime(r.createdAt)}</span> },
    { key: 'input', header: 'Sorgu', cell: (r) => <code className="text-xs">{r.input.il}/{r.input.ilce} {r.input.ada}/{r.input.parsel}</code> },
    { key: 'status', header: 'Durum', cell: (r) => (
      <span className={cls('inline-flex items-center gap-1 text-xs',
        r.status === 'OK' ? 'text-emerald-600' : r.status.startsWith('E0') ? 'text-rose-600' : 'text-amber-600'
      )}>
        {r.status === 'OK' ? <CheckCircle size={12} weight="fill" /> : <Warning size={12} weight="fill" />}
        {r.status} — {tkgmCodeMessage(r.status)}
      </span>
    )},
    { key: 'latencyMs', header: 'Latency', accessor: (r) => r.latencyMs, sortable: true, cell: (r) => (
      <span className={cls('text-xs tabular-nums', r.latencyMs > 3000 ? 'text-amber-600' : 'text-fg-2')}>{r.latencyMs}ms</span>
    ), hideOn: 'sm' }
  ];

  return (
    <div>
      <SectionHeading
        title="TKGM Entegrasyon Paneli"
        description="Tapu ve Kadastro Genel Müdürlüğü mock servis · 6 entegrasyon noktası"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>AI OCR + Kota tahmin</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<ArrowsClockwise size={14} />} onClick={() => toast('success', 'Sistem health check', 'TKGM upstream: ✓ erişilebilir · auth: ✓ · ortalama latency 1.4sn')}>Health check</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Toplam sorgu" value={stats.total.toLocaleString('tr-TR')} icon={<Buildings size={20} weight="fill" />} hint={`${stats.last24h} son 24sa`} />
        <Stat label="Başarı oranı" value={`%${stats.successRate}`} icon={<ShieldCheck size={20} weight="fill" />} delta={{ value: 0.4 }} hint="Hedef >%98" />
        <Stat label="Ort. latency" value={`${stats.avgLatency}ms`} icon={<Pulse size={20} weight="fill" />} hint="P95 <3500ms" />
        <Stat label="Aylık kota" value="2,840 / 5,000" icon={<Lightning size={20} weight="fill" />} hint="%57 kullanım" />
        <Stat label="AI tahmin" value="+%6" icon={<Sparkle size={20} weight="fill" />} hint="Hafta sonu yoğunluk" />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Genel', Icon: ChartLineUp },
          { id: 'verify' as const, label: 'Parsel Doğrula', Icon: ShieldCheck },
          { id: 'bulk' as const, label: 'Toplu Doğrulama', Icon: Lightning },
          { id: 'ocr' as const, label: 'Belge OCR', Icon: FileText },
          { id: 'history' as const, label: 'Geçmiş', Icon: Clock },
          { id: 'monitoring' as const, label: 'İzleme', Icon: Pulse }
        ].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cls(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
            tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
          )}>
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-3">
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><ChartLineUp size={14} /> Son 30 sorgu — latency trendi</h3>
            <div className="h-44">
              <ResponsiveContainer>
                <LineChart data={latencyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="i" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ms" stroke="#0e7c61" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2">Status code dağılımı</h3>
            <div className="h-44">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                    {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Clock size={14} /> Saatlik sorgu hacmi</h3>
            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#c97f1d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-2 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
            <div className="flex items-start gap-3">
              <Sparkle size={20} weight="fill" className="text-brand-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">AI Operasyonel İçgörü</h3>
                <p className="text-sm text-fg-2 mt-1">
                  Son 7 gün TKGM API performansı: <strong className="text-emerald-600">stable</strong> (variance %4.2).
                  Cumartesi 14:00-18:00 arası %23 yoğunluk artışı — kota tükenmesi öngörülmüyor.
                  En sık hata: <code>E003 (Ada bulunamadı)</code> — kullanıcı eğitimi önerilir.
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button size="xs" onClick={() => toast('success', 'Kota uyarısı kuruldu', '%80 kullanımda Slack + email alarm.')}>Kota alarmı kur</Button>
                  <Button size="xs" variant="outline" onClick={() => toast('info', 'Eğitim önerisi', 'Mock: kullanıcılara form yardımı eklendi.')}>Form yardımı ekle</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'verify' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <h3 className="font-medium mb-3 inline-flex items-center gap-2"><MapPin size={14} weight="fill" className="text-brand-500" /> Parsel Sorgusu</h3>
            <div className="space-y-2">
              <Input label="İl" value={il} onChange={(e) => setIl(e.target.value)} block />
              <Input label="İlçe" value={ilce} onChange={(e) => setIlce(e.target.value)} block />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Ada" value={ada} onChange={(e) => setAda(e.target.value)} block />
                <Input label="Parsel" value={parsel} onChange={(e) => setParsel(e.target.value)} block />
              </div>
              <Button block loading={loading} onClick={run} iconLeft={<ShieldCheck size={16} />}>Doğrula</Button>
            </div>
            {last && (
              <div className={cls('mt-3 p-3 rounded-r-2 text-xs',
                last.status === 'OK' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200'
              )}>
                <div className="font-medium mb-1 inline-flex items-center gap-1.5">
                  {last.status === 'OK' ? <CheckCircle size={14} weight="fill" /> : <Warning size={14} weight="fill" />}
                  Sonuç: {last.status}
                </div>
                {last.result ? (
                  <ul className="space-y-0.5">
                    <li><strong>Mahalle:</strong> {last.result.mahalle}</li>
                    <li><strong>Yüzölçümü:</strong> {last.result.yuzolcumu} m²</li>
                    <li><strong>Cinsi:</strong> {last.result.cinsi}</li>
                    {last.result.hisse && <li><strong>Hisse:</strong> {last.result.hisse}</li>}
                  </ul>
                ) : <div>{tkgmCodeMessage(last.status)}</div>}
                <div className="text-fg-3 mt-2 flex items-center gap-2">
                  <Clock size={10} /> {last.latencyMs}ms · {formatDateTime(last.createdAt)}
                </div>
              </div>
            )}
          </Card>

          <div className="lg:col-span-2 space-y-3">
            <Card>
              <h3 className="font-medium mb-2">Yaygın hata kodları</h3>
              <ul className="text-sm space-y-1">
                {(['E001', 'E002', 'E003', 'E099'] as const).map((c) => (
                  <li key={c} className="flex items-center gap-2 text-xs">
                    <code className="text-rose-600 font-bold w-12">{c}</code>
                    <span className="text-fg-2 flex-1">{tkgmCodeMessage(c)}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/30">
              <h3 className="font-medium mb-1 inline-flex items-center gap-1.5">
                <Sparkle size={14} weight="fill" className="text-amber-500" /> AI Form Doldurucu
              </h3>
              <p className="text-sm text-fg-2 mb-2">Kullanıcı "Beykoz Riva 1234 parsel 56" gibi NL yazınca AI otomatik alanlara dağıtır.</p>
              <input
                placeholder='"İstanbul Beykoz 1234/56" gibi yazın'
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const parts = e.currentTarget.value.split(/[\s,/]+/).filter(Boolean);
                    if (parts.length >= 4) {
                      setIl(parts[0]); setIlce(parts[1]); setAda(parts[2]); setParsel(parts[3]);
                      toast('ai', 'AI form doldurdu', 'Alanlar otomatik dolduruldu.');
                    }
                  }
                }}
                className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              />
            </Card>
          </div>
        </div>
      )}

      {tab === 'bulk' && (
        <Card>
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Lightning size={14} weight="fill" className="text-amber-500" /> Toplu doğrulama</h3>
          <p className="text-sm text-fg-3 mb-3">Her satıra bir parsel: <code>İl İlçe Ada Parsel</code> (boşluk veya / ile ayrılmış).</p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={8}
            placeholder={'İstanbul Beykoz 1234 56\nİzmir Karşıyaka 5678 12\nAnkara Çankaya 9101 34'}
            className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono"
          />
          <div className="flex items-center gap-2 mt-3">
            <Button onClick={runBulk} disabled={bulkRunning || !bulkText.trim()} iconLeft={<Lightning size={14} />}>
              {bulkRunning ? `${bulkProgress.done}/${bulkProgress.total} işleniyor...` : 'Toplu doğrula'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast('info', 'CSV içe aktar', 'Mock: dosya seçici açıldı.')}>CSV içe aktar</Button>
          </div>
          {bulkProgress.total > 0 && (
            <div className="mt-3 space-y-2">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle size={12} weight="fill" /> {bulkProgress.ok} başarılı</span>
                <span className="text-rose-600 inline-flex items-center gap-1"><Warning size={12} weight="fill" /> {bulkProgress.err} hata</span>
                <span className="text-fg-3">{bulkProgress.done}/{bulkProgress.total}</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {tab === 'ocr' && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><FileText size={14} weight="fill" className="text-brand-500" /> Belge OCR</h3>
            <p className="text-sm text-fg-3 mb-3">Tapu belgesini yükle, AI bilgileri çıkarsın.</p>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setOcrFile(f); }}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-r-3 p-6 text-center"
            >
              <Upload size={32} weight="duotone" className="mx-auto mb-2 text-fg-3" />
              <p className="text-sm text-fg-2">
                {ocrFile ? <strong>{ocrFile.name}</strong> : 'Belgeyi sürükleyin ya da seçin'}
              </p>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setOcrFile(e.target.files?.[0] || null)} className="mt-3 text-xs" />
              <Button onClick={runOcr} disabled={!ocrFile || ocrProcessing} className="mt-3" iconLeft={<Sparkle size={14} weight="fill" />}>
                {ocrProcessing ? 'OCR çalışıyor...' : 'AI ile çıkar'}
              </Button>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2">OCR sonucu</h3>
            {!ocrResult && !ocrProcessing && <p className="text-sm text-fg-3">Henüz belge yüklenmedi.</p>}
            {ocrProcessing && (
              <div className="text-center py-8">
                <Sparkle size={32} weight="fill" className="text-brand-500 mx-auto animate-pulse" />
                <p className="text-sm text-fg-3 mt-2">AI belgeyi analiz ediyor...</p>
              </div>
            )}
            {ocrResult && (
              <>
                <dl className="space-y-1.5 text-sm">
                  {Object.entries(ocrResult).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-1 last:border-0">
                      <dt className="text-fg-3 text-xs uppercase tracking-wider">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Button block size="sm" className="mt-3" onClick={() => toast('success', 'Forma aktarıldı', 'Bilgiler İlan Wizard formuna otomatik yüklendi.')} iconLeft={<CheckCircle size={14} />}>Forma aktar</Button>
              </>
            )}
          </Card>
        </div>
      )}

      {tab === 'history' && (
        <Card className="!p-0 overflow-hidden">
          <DataTable data={data.tkgmQueries} columns={columns} rowKey={(r) => r.id} searchable pageSize={20} searchPlaceholder="Parsel / status ara..." storageKey="admin-tkgm" />
        </Card>
      )}

      {tab === 'monitoring' && (
        <div className="space-y-3">
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Pulse size={14} weight="fill" className="text-emerald-500" /> Upstream sağlık</h3>
            <div className="grid sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-r-2 bg-emerald-50 dark:bg-emerald-900/30">
                <div className="text-xs uppercase tracking-wider text-fg-3">Bağlantı</div>
                <div className="font-medium text-emerald-700 mt-0.5">✓ Erişilebilir</div>
                <div className="text-[11px] text-fg-3">Son ping 32sn önce</div>
              </div>
              <div className="p-2 rounded-r-2 bg-emerald-50 dark:bg-emerald-900/30">
                <div className="text-xs uppercase tracking-wider text-fg-3">SSL sertifika</div>
                <div className="font-medium text-emerald-700 mt-0.5">✓ Geçerli</div>
                <div className="text-[11px] text-fg-3">Süresi: 2026-11-12</div>
              </div>
              <div className="p-2 rounded-r-2 bg-amber-50 dark:bg-amber-900/30">
                <div className="text-xs uppercase tracking-wider text-fg-3">Auth</div>
                <div className="font-medium text-amber-700 mt-0.5">⚠ 30g kala yenile</div>
                <div className="text-[11px] text-fg-3">API key 60g geçerli</div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2">Son 24 saat latency dağılımı</h3>
            <div className="h-48">
              <ResponsiveContainer>
                <AreaChart data={latencyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="i" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="ms" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2">SLO durumu</h3>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> P95 latency &lt; 3.5sn — <strong className="ml-auto">3.2sn</strong></li>
              <li className="flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Başarı oranı &gt; %98 — <strong className="ml-auto">%{stats.successRate}</strong></li>
              <li className="flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Aylık kota &lt; %85 — <strong className="ml-auto">%57</strong></li>
              <li className="flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Hata oranı &lt; %2 — <strong className="ml-auto">%{100 - stats.successRate}</strong></li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
