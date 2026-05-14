import { useParams, Link } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { PuzzlePiece, ShieldCheck, Storefront, Star, Sparkle, CheckCircle, Warning, FileLock, Hash, Clock, Download } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

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
  const view = section === 'marketplace' ? 'marketplace' : section === 'security' ? 'security' : 'installed';
  return (
    <div>
      <SectionHeading title="Eklentiler" description="K01 Plugin Lifecycle · O02 Marketplace · O03 Security Review" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Kurulu" value={PLUGINS.filter((p) => p.installed).length} icon={<PuzzlePiece size={20} weight="fill" />} />
        <Stat label="Marketplace" value={PLUGINS.length} icon={<Storefront size={20} weight="fill" />} />
        <Stat label="İmzalı" value={PLUGINS.filter((p) => p.signed).length} icon={<FileLock size={20} weight="fill" />} />
        <Stat label="İnceleme bekliyor" value={REVIEW_QUEUE.length} icon={<ShieldCheck size={20} weight="fill" />} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Link to="/admin/plugins"><Button size="sm" variant={view === 'installed' ? 'primary' : 'outline'} iconLeft={<PuzzlePiece size={14} />}>Kurulu ({PLUGINS.filter((p) => p.installed).length})</Button></Link>
        <Link to="/admin/plugins/marketplace"><Button size="sm" variant={view === 'marketplace' ? 'primary' : 'outline'} iconLeft={<Storefront size={14} />}>Marketplace ({PLUGINS.length})</Button></Link>
        <Link to="/admin/plugins/security"><Button size="sm" variant={view === 'security' ? 'primary' : 'outline'} iconLeft={<ShieldCheck size={14} />}>Güvenlik ({REVIEW_QUEUE.length})</Button></Link>
      </div>

      {view === 'security' ? <SecurityReview /> : (
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
