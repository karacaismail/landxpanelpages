import { useParams, Link } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { PuzzlePiece, ShieldCheck, Storefront, Star, Sparkle, CheckCircle, Warning, FileLock, Hash, Clock, Download, GitBranch, ArrowsClockwise, ArrowCounterClockwise, Database } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface Plugin {
  id: string;
  name: string;
  author: string;
  version: string;
  installed: boolean;
  rating: number;
  installs: number;
  desc: string;
  category: 'integration' | 'ai' | 'ui' | 'tools' | 'payments';
  permissions: string[];
  signed: boolean;
  lastUpdate: string;
}

const PLUGINS: Plugin[] = [
  { id: 'p-tkgm',     name: 'TKGM Connector',     author: 'LandX',       version: '2.1.0', installed: true,  rating: 4.8, installs: 1240, desc: 'Tapu ve Kadastro entegrasyonu',  category: 'integration', permissions: ['network', 'pii.read'], signed: true,  lastUpdate: '2026-05-10' },
  { id: 'p-ai-val',   name: 'AI Valuation Pro',   author: 'LandX Labs',  version: '1.4.2', installed: true,  rating: 4.6, installs: 892,  desc: 'Genişletilmiş emsal değerleme',  category: 'ai',          permissions: ['listing.read', 'llm'],  signed: true,  lastUpdate: '2026-05-08' },
  { id: 'p-iyzico',   name: 'iyzico Payments',    author: 'iyzico',      version: '0.9.3', installed: false, rating: 4.2, installs: 240,  desc: 'Komisyon ödeme akışı',           category: 'payments',    permissions: ['network', 'payment'],   signed: true,  lastUpdate: '2026-05-09' },
  { id: 'p-edevlet',  name: 'e-Devlet KYC',       author: 'LandX',       version: '1.0.1', installed: true,  rating: 4.7, installs: 1100, desc: 'Kimlik doğrulama (mock)',         category: 'integration', permissions: ['network', 'pii.write'], signed: true,  lastUpdate: '2026-04-28' },
  { id: 'p-leaflet',  name: 'Leaflet Map',        author: 'Community',   version: '1.9.4', installed: true,  rating: 4.5, installs: 2100, desc: 'OSM harita desteği',              category: 'ui',          permissions: ['network'],              signed: true,  lastUpdate: '2026-04-12' },
  { id: 'p-export',   name: 'Bulk Export',        author: 'LandX',       version: '0.4.0', installed: false, rating: 4.0, installs: 520,  desc: 'CSV/XLSX dışa aktarım',           category: 'tools',       permissions: ['listing.read'],         signed: true,  lastUpdate: '2026-04-30' },
  { id: 'p-tour',     name: 'Onboarding Tour',    author: 'LandX Labs',  version: '0.3.1', installed: false, rating: 4.3, installs: 380,  desc: 'Adımlı kullanıcı turu',           category: 'ui',          permissions: [],                       signed: true,  lastUpdate: '2026-05-01' },
  { id: 'p-prompt-ab',name: 'Prompt A/B Lab',     author: 'LandX Labs',  version: '0.6.0', installed: true,  rating: 4.4, installs: 410,  desc: 'Prompt A/B test ortamı',          category: 'ai',          permissions: ['llm', 'analytics'],     signed: true,  lastUpdate: '2026-05-11' }
];

const REVIEW_QUEUE = [
  { name: 'iyzico Payments v0.9.3', sub: 'Yeni sürüm — payment scope ekleniyor', sev: 'orta', daysOld: 2 },
  { name: 'Bulk Export v0.4.0',     sub: 'Genişletilmiş CSV alanları',          sev: 'düşük', daysOld: 5 }
];

const REVIEW_HISTORY = [
  { name: 'TKGM Connector v2.1.0', date: '2026-05-10', result: 'onaylandı', findings: 0 },
  { name: 'AI Valuation Pro v1.4.2', date: '2026-05-08', result: 'onaylandı', findings: 2 },
  { name: 'e-Devlet KYC v1.0.1', date: '2026-04-28', result: 'onaylandı', findings: 1 },
  { name: 'Prompt A/B Lab v0.6.0', date: '2026-05-11', result: 'onaylandı', findings: 0 },
  { name: 'Suspicious Tools v0.2.0', date: '2026-04-22', result: 'reddedildi', findings: 7 }
];

export default function PluginsPage() {
  const { section } = useParams();
  const view = section === 'marketplace' ? 'marketplace' : section === 'security' ? 'security' : section === 'migrations' ? 'migrations' : section === 'developer' ? 'developer' : 'installed';
  return (
    <div>
      <SectionHeading title="Eklentiler" description="K01 Plugin Lifecycle · K03 Migration · O02 Marketplace · O03 Security Review" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Kurulu" value={PLUGINS.filter((p) => p.installed).length} icon={<PuzzlePiece size={20} weight="fill" />} />
        <Stat label="Marketplace" value={PLUGINS.length} icon={<Storefront size={20} weight="fill" />} />
        <Stat label="İmzalı" value={PLUGINS.filter((p) => p.signed).length} icon={<FileLock size={20} weight="fill" />} />
        <Stat label="İnceleme bekliyor" value={REVIEW_QUEUE.length} icon={<ShieldCheck size={20} weight="fill" />} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Link to="/admin/plugins"><Button size="sm" variant={view === 'installed' ? 'primary' : 'outline'} iconLeft={<PuzzlePiece size={14} />}>Kurulu ({PLUGINS.filter((p) => p.installed).length})</Button></Link>
        <Link to="/admin/plugins/marketplace"><Button size="sm" variant={view === 'marketplace' ? 'primary' : 'outline'} iconLeft={<Storefront size={14} />}>Marketplace ({PLUGINS.length})</Button></Link>
        <Link to="/admin/plugins/migrations"><Button size="sm" variant={view === 'migrations' ? 'primary' : 'outline'} iconLeft={<GitBranch size={14} />}>Migrations</Button></Link>
        <Link to="/admin/plugins/security"><Button size="sm" variant={view === 'security' ? 'primary' : 'outline'} iconLeft={<ShieldCheck size={14} />}>Güvenlik ({REVIEW_QUEUE.length})</Button></Link>
        <Link to="/admin/plugins/developer"><Button size="sm" variant={view === 'developer' ? 'primary' : 'outline'} iconLeft={<Database size={14} />}>Developer</Button></Link>
      </div>

      {view === 'security' && <SecurityReview />}
      {view === 'migrations' && <MigrationCenter />}
      {view === 'developer' && <DeveloperDashboard />}
      {(view === 'installed' || view === 'marketplace') && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLUGINS.filter((p) => view === 'installed' ? p.installed : true).map((p) => <PluginCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}

function PluginCard({ p }: { p: Plugin }) {
  const categoryColor: Record<Plugin['category'], string> = {
    integration: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
    ai: 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200',
    ui: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    tools: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    payments: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
  };
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-r-2 bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600"><PuzzlePiece size={18} weight="duotone" /></span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{p.name}</div>
          <div className="text-xs text-fg-3">{p.author} · v{p.version}</div>
        </div>
        <span className="inline-flex items-center gap-0.5 text-xs"><Star size={12} weight="fill" className="text-amber-500" /> {p.rating}</span>
      </div>
      <p className="text-sm text-fg-3 mt-1">{p.desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className={cls('text-[10px] px-1.5 py-0.5 rounded-full font-medium', categoryColor[p.category])}>{p.category}</span>
        {p.signed && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 inline-flex items-center gap-0.5"><FileLock size={10} weight="fill" /> imzalı</span>}
        <span className="text-[10px] text-fg-3 inline-flex items-center gap-0.5"><Download size={10} /> {p.installs}</span>
      </div>
      {p.permissions.length > 0 && (
        <div className="mt-2 text-[11px] text-fg-3">
          <span className="font-medium text-fg-2">İzinler: </span>{p.permissions.join(', ')}
        </div>
      )}
      <div className="mt-3 flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {p.installed ? <Button size="sm" variant="outline">Yapılandır</Button> : <Button size="sm">Yükle</Button>}
        <Button size="sm" variant="ghost">Detay</Button>
        {p.installed && <Button size="sm" variant="ghost" className="ml-auto !text-rose-600">Kaldır</Button>}
      </div>
    </Card>
  );
}

function SecurityReview() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-2"><Sparkle size={18} weight="fill" className="text-brand-500" /><h3 className="font-medium">Otomatik güvenlik denetimi</h3></div>
        <p className="text-sm text-fg-3 mb-3">Marketplace plugin'leri sandbox ortamda test edilir, supply chain hash zinciri doğrulanır (O03).</p>
        <div className="grid sm:grid-cols-3 gap-2">
          <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-xs uppercase tracking-wider text-fg-3">Sandbox test</div>
            <div className="font-medium text-emerald-600 mt-1">24/24 geçti</div>
          </div>
          <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-xs uppercase tracking-wider text-fg-3">İmza doğrulama</div>
            <div className="font-medium text-emerald-600 mt-1 inline-flex items-center gap-1"><Hash size={14} weight="fill" /> ✓ tüm yüklü</div>
          </div>
          <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
            <div className="text-xs uppercase tracking-wider text-fg-3">Supply chain</div>
            <div className="font-medium text-emerald-600 mt-1">Saldırı 0</div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Clock size={16} weight="duotone" /> İnceleme kuyruğu ({REVIEW_QUEUE.length})</h3>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {REVIEW_QUEUE.map((r, i) => (
            <li key={i} className="py-2 flex items-center gap-3">
              <Warning size={20} weight="fill" className={r.sev === 'orta' ? 'text-amber-500' : 'text-sky-500'} />
              <div className="flex-1">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-fg-3">{r.sub}</div>
              </div>
              <span className="text-xs text-fg-3">{r.daysOld}g önce</span>
              <Button size="xs" variant="outline">İncele</Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><CheckCircle size={16} weight="fill" className="text-emerald-500" /> Son inceleme sonuçları</h3>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {REVIEW_HISTORY.map((h, i) => (
            <li key={i} className="py-2 flex items-center gap-3">
              <span className="flex-1">{h.name}</span>
              <span className="text-xs text-fg-3">{h.date}</span>
              <span className="text-xs text-fg-3">{h.findings} bulgu</span>
              <span className={cls('text-xs px-2 py-0.5 rounded-full font-medium', h.result === 'onaylandı' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200')}>{h.result}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// K03 Migration & Versioning Engine — plugin sürüm geçişlerinde DB schema + data migration
interface Migration {
  id: string;
  plugin: string;
  from: string;
  to: string;
  type: 'schema' | 'data' | 'hybrid';
  status: 'pending' | 'running' | 'success' | 'failed' | 'rolled_back';
  aiGenerated: boolean;
  humanReviewed: boolean;
  estSec: number;
  runSec: number;
  destructive: boolean;
  ranAt: string;
  runBy: string;
}

const MIGRATIONS: Migration[] = [
  { id: 'mig-001', plugin: 'TKGM Connector', from: '2.0.4', to: '2.1.0', type: 'schema', status: 'success', aiGenerated: true, humanReviewed: true, estSec: 42, runSec: 38, destructive: false, ranAt: '2026-05-10 03:14', runBy: 'cron' },
  { id: 'mig-002', plugin: 'AI Valuation Pro', from: '1.4.0', to: '1.4.2', type: 'data', status: 'success', aiGenerated: true, humanReviewed: true, estSec: 120, runSec: 142, destructive: false, ranAt: '2026-05-08 03:04', runBy: 'cron' },
  { id: 'mig-003', plugin: 'e-Devlet KYC', from: '0.9.8', to: '1.0.1', type: 'hybrid', status: 'success', aiGenerated: false, humanReviewed: true, estSec: 240, runSec: 268, destructive: true, ranAt: '2026-04-28 22:00', runBy: 'admin@landx' },
  { id: 'mig-004', plugin: 'Prompt A/B Lab', from: '0.5.2', to: '0.6.0', type: 'schema', status: 'success', aiGenerated: true, humanReviewed: false, estSec: 18, runSec: 14, destructive: false, ranAt: '2026-05-11 02:30', runBy: 'cron' },
  { id: 'mig-005', plugin: 'iyzico Payments', from: '0.8.7', to: '0.9.3', type: 'hybrid', status: 'pending', aiGenerated: true, humanReviewed: false, estSec: 180, runSec: 0, destructive: true, ranAt: '—', runBy: '—' },
  { id: 'mig-006', plugin: 'Bulk Export', from: '0.3.2', to: '0.4.0', type: 'data', status: 'pending', aiGenerated: true, humanReviewed: false, estSec: 60, runSec: 0, destructive: false, ranAt: '—', runBy: '—' },
  { id: 'mig-007', plugin: 'AI Valuation Pro', from: '1.3.8', to: '1.4.0', type: 'data', status: 'rolled_back', aiGenerated: true, humanReviewed: true, estSec: 90, runSec: 38, destructive: false, ranAt: '2026-04-15 04:12', runBy: 'admin@landx' }
];

function MigrationCenter() {
  const successCount = MIGRATIONS.filter((m) => m.status === 'success').length;
  const pendingCount = MIGRATIONS.filter((m) => m.status === 'pending').length;
  const aiAcceptance = Math.round(MIGRATIONS.filter((m) => m.aiGenerated && m.status === 'success').length / MIGRATIONS.filter((m) => m.aiGenerated).length * 100);

  const statusColor: Record<Migration['status'], string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    failed: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
    rolled_back: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Toplam migration" value={MIGRATIONS.length} icon={<GitBranch size={20} weight="fill" />} hint={`${successCount} başarılı`} />
        <Stat label="Bekliyor" value={pendingCount} icon={<Clock size={20} weight="fill" />} hint="Approve gerekli" />
        <Stat label="AI üretimi" value={`${aiAcceptance}%`} icon={<Sparkle size={20} weight="fill" />} hint="Acceptance rate" />
        <Stat label="Avg p95" value="68sn" icon={<Database size={20} weight="fill" />} hint="Çalışma süresi" />
      </div>

      <Card className="bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI Migration Planner</span></div>
        <p className="text-sm text-fg-2">
          iyzico Payments v0.8.7 → v0.9.3 için AI tarafından üretilen migration planı hazır.
          <strong> 4 schema değişikliği</strong>, <strong>1 destructive operation</strong> (commission_rate alanı &gt; commission_basis_points migration).
          Tahmini süre: 180sn. <em>Human review bekleniyor.</em>
        </p>
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={() => toast('success', 'Plan onaylandı', 'iyzico migration kuyruğa alındı. Çalıştırılma: gece 03:00.')}>Planı onayla</Button>
          <Button size="sm" variant="outline" onClick={() => toast('info', 'Plan görüntülendi', 'Mock: schema diff + data SQL plan.json olarak indirilebilir.')}>Diff görüntüle</Button>
          <Button size="sm" variant="ghost" onClick={() => toast('warning', 'AI revize istendi', 'Yeni plan 30sn içinde üretilecek.')}>AI ile yeniden üret</Button>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-fg-3 font-semibold">Migration geçmişi</div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {MIGRATIONS.map((m) => (
            <li key={m.id} className="p-3 flex items-start gap-3">
              <span className={cls('shrink-0 text-[10px] font-bold uppercase rounded px-1.5 py-0.5', statusColor[m.status])}>{m.status === 'rolled_back' ? 'rolled back' : m.status}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">{m.plugin}</span>
                  <code className="text-xs text-fg-3">{m.from}</code>
                  <span className="text-xs text-fg-3">→</span>
                  <code className="text-xs text-brand-700 dark:text-brand-300">{m.to}</code>
                  <span className="text-[11px] uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-fg-3">{m.type}</span>
                  {m.aiGenerated && <span className="inline-flex items-center gap-0.5 text-[11px] text-brand-700 dark:text-brand-300"><Sparkle size={10} weight="fill" /> AI</span>}
                  {m.destructive && <span className="text-[11px] text-rose-600 dark:text-rose-400 inline-flex items-center gap-0.5"><Warning size={10} weight="fill" /> destructive</span>}
                </div>
                <div className="text-xs text-fg-3 mt-0.5">
                  Tahmin: {m.estSec}sn · Gerçek: {m.runSec || '—'}sn · {m.runBy} · {m.ranAt}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {m.status === 'pending' && <Button size="xs" iconLeft={<ArrowsClockwise size={12} />} onClick={() => toast('success', 'Migration çalıştırıldı', `${m.plugin} ${m.from}→${m.to} kuyruğa alındı.`)}>Çalıştır</Button>}
                {m.status === 'success' && <Button size="xs" variant="ghost" iconLeft={<ArrowCounterClockwise size={12} />} onClick={() => toast('warning', 'Rollback', `${m.plugin} ${m.to}→${m.from} rollback başlatıldı (mock).`)}>Rollback</Button>}
                {m.status === 'failed' && <Button size="xs" variant="outline">Logları gör</Button>}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// O02 Plugin Marketplace — Developer Dashboard: revenue, license keys, reviews
function DeveloperDashboard() {
  const REVENUE = [
    { month: 'Aralık', amount: 4280, installs: 142 },
    { month: 'Ocak', amount: 5240, installs: 168 },
    { month: 'Şubat', amount: 6820, installs: 184 },
    { month: 'Mart', amount: 7140, installs: 198 },
    { month: 'Nisan', amount: 8420, installs: 224 },
    { month: 'Mayıs', amount: 9840, installs: 268 }
  ];
  const LICENSES = [
    { id: 'lic-001', plugin: 'TKGM Connector', tenant: 'Anadolu Yatırım', tier: 'enterprise', key: 'LX-TKGM-A4F8-2026', issuedAt: '2026-01-12', expiresAt: '2027-01-12', seats: 'sınırsız', status: 'active' },
    { id: 'lic-002', plugin: 'AI Valuation Pro', tenant: 'Kıyı Emlak Grubu', tier: 'pro', key: 'LX-VALU-9C12-2026', issuedAt: '2026-02-08', expiresAt: '2026-08-08', seats: '50', status: 'active' },
    { id: 'lic-003', plugin: 'iyzico Payments', tenant: 'LandX Demo', tier: 'starter', key: 'LX-IYZI-3E44-2026', issuedAt: '2026-03-22', expiresAt: '2026-09-22', seats: '10', status: 'expiring' },
    { id: 'lic-004', plugin: 'Bulk Export', tenant: 'Test Kurum 1', tier: 'starter', key: 'LX-BULK-1A2B-2025', issuedAt: '2025-10-04', expiresAt: '2026-04-04', seats: '5', status: 'expired' }
  ];
  const REVIEWS = [
    { id: 'rev-001', plugin: 'TKGM Connector', stars: 5, author: 'A*** Y***', text: 'Müthiş, parsel doğrulama 3sn sürüyor. Form auto-fill harika.', at: '2026-05-12', helpful: 18 },
    { id: 'rev-002', plugin: 'AI Valuation Pro', stars: 5, author: 'M*** K***', text: 'Emsal değerleme bandı çok isabetli. Satış kapanış hızını artırdı.', at: '2026-05-11', helpful: 14 },
    { id: 'rev-003', plugin: 'iyzico Payments', stars: 3, author: 'C*** Ö***', text: 'İşe yarıyor ama dökümantasyon yetersiz. 2 saatte kurabildim.', at: '2026-05-08', helpful: 6 },
    { id: 'rev-004', plugin: 'e-Devlet KYC', stars: 4, author: 'Z*** B***', text: 'Doğrulama hızlı, ama bazen 2. denemede tutuyor.', at: '2026-05-05', helpful: 9 }
  ];
  const totalRev = REVENUE.reduce((s, r) => s + r.amount, 0);
  const totalInstalls = REVENUE.reduce((s, r) => s + r.installs, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Stat label="Aylık gelir" value={`$${REVENUE[REVENUE.length - 1].amount.toLocaleString('tr-TR')}`} icon={<Database size={20} weight="fill" />} hint="+%17 önceki ay" />
        <Stat label="6 ay toplam" value={`$${totalRev.toLocaleString('tr-TR')}`} icon={<Database size={20} weight="fill" />} />
        <Stat label="Aktif lisans" value={LICENSES.filter((l) => l.status === 'active').length} icon={<FileLock size={20} weight="fill" />} hint={`${LICENSES.filter((l) => l.status === 'expiring').length} yakında dolacak`} />
        <Stat label="Toplam install" value={totalInstalls.toLocaleString('tr-TR')} icon={<Download size={20} weight="fill" />} />
        <Stat label="Avg rating" value="4.6 ★" icon={<Star size={20} weight="fill" />} hint={`${REVIEWS.length} review`} />
      </div>

      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Database size={14} /> Aylık Gelir Trendi</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left py-2">Ay</th>
              <th className="text-right py-2">Gelir</th>
              <th className="text-right py-2 hidden sm:table-cell">Install</th>
              <th className="text-right py-2 hidden md:table-cell">Avg ARPU</th>
            </tr>
          </thead>
          <tbody>
            {REVENUE.map((r) => (
              <tr key={r.month} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="py-2 font-medium">{r.month}</td>
                <td className="text-right tabular-nums font-medium">${r.amount.toLocaleString('tr-TR')}</td>
                <td className="text-right tabular-nums hidden sm:table-cell">{r.installs}</td>
                <td className="text-right tabular-nums hidden md:table-cell text-fg-3">${(r.amount / r.installs).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><FileLock size={14} /> Lisans Anahtarları</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                <th className="text-left py-2">Plugin</th>
                <th className="text-left py-2 hidden sm:table-cell">Müşteri</th>
                <th className="text-left py-2 hidden md:table-cell">Tier</th>
                <th className="text-left py-2">Anahtar</th>
                <th className="text-left py-2 hidden lg:table-cell">Seats</th>
                <th className="text-left py-2 hidden md:table-cell">Bitiş</th>
                <th className="text-left py-2">Durum</th>
              </tr>
            </thead>
            <tbody>
              {LICENSES.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-2 font-medium text-xs">{l.plugin}</td>
                  <td className="py-2 hidden sm:table-cell text-xs">{l.tenant}</td>
                  <td className="py-2 hidden md:table-cell text-xs"><code>{l.tier}</code></td>
                  <td className="py-2"><code className="text-xs text-brand-700 dark:text-brand-300">{l.key}</code></td>
                  <td className="py-2 hidden lg:table-cell text-xs">{l.seats}</td>
                  <td className="py-2 hidden md:table-cell text-xs text-fg-3">{l.expiresAt}</td>
                  <td className="py-2">
                    <span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded',
                      l.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                        l.status === 'expiring' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                    )}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" iconLeft={<FileLock size={14} />} onClick={() => toast('success', 'Lisans üretildi', 'LX-NEW-XXXX-2026 - kopyalandı.')}>Yeni lisans üret</Button>
          <Button size="sm" variant="outline" onClick={() => toast('info', 'CSV indiriliyor', 'licenses-export-2026-05.csv')}>CSV indir</Button>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Star size={14} weight="fill" className="text-amber-500" /> Son Yorumlar</h3>
        <ul className="space-y-3">
          {REVIEWS.map((r) => (
            <li key={r.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-xs text-brand-700 dark:text-brand-300">{r.plugin}</code>
                <div className="inline-flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} weight={i < r.stars ? 'fill' : 'regular'} className={i < r.stars ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'} />
                  ))}
                </div>
                <span className="text-xs text-fg-3 ml-auto">{r.at}</span>
              </div>
              <p className="text-sm text-fg-2">{r.text}</p>
              <div className="text-[11px] text-fg-3 mt-1">— {r.author} · {r.helpful} kişi faydalı buldu · <button onClick={() => toast('ai', 'AI yanıt taslağı', 'Mock: developer cevap mektubu hazır.')} className="text-brand-600 hover:underline">AI cevap</button></div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
