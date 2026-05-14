import { useParams, Link } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PuzzlePiece, ShieldCheck, Storefront, Star, Sparkle } from '@phosphor-icons/react';

const PLUGINS = [
  { id: 'p-tkgm', name: 'TKGM Connector', author: 'LandX', version: '2.1.0', installed: true, rating: 4.8, desc: 'Tapu ve Kadastro entegrasyonu' },
  { id: 'p-ai-val', name: 'AI Valuation Pro', author: 'LandX Labs', version: '1.4.2', installed: true, rating: 4.6, desc: 'Genişletilmiş emsal verisiyle değerleme' },
  { id: 'p-iyzico', name: 'iyzico Payments', author: 'iyzico', version: '0.9.3', installed: false, rating: 4.2, desc: 'Komisyon ödeme akışı' },
  { id: 'p-edevlet', name: 'e-Devlet KYC', author: 'LandX', version: '1.0.1', installed: true, rating: 4.7, desc: 'Kimlik doğrulama (mock)' },
  { id: 'p-leaflet', name: 'Leaflet Map', author: 'Community', version: '1.9.4', installed: true, rating: 4.5, desc: 'OSM harita desteği' },
  { id: 'p-export', name: 'Bulk Export', author: 'LandX', version: '0.4.0', installed: false, rating: 4.0, desc: 'CSV/XLSX dışa aktarım' }
];

export default function PluginsPage() {
  const { section } = useParams();
  const view = section === 'marketplace' ? 'marketplace' : section === 'security' ? 'security' : 'installed';
  return (
    <div>
      <SectionHeading title="Eklentiler" description="Plugin lifecycle · Marketplace · Security review" />
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Link to="/admin/plugins"><Button size="sm" variant={view === 'installed' ? 'primary' : 'outline'} iconLeft={<PuzzlePiece size={14} />}>Kurulu</Button></Link>
        <Link to="/admin/plugins/marketplace"><Button size="sm" variant={view === 'marketplace' ? 'primary' : 'outline'} iconLeft={<Storefront size={14} />}>Marketplace</Button></Link>
        <Link to="/admin/plugins/security"><Button size="sm" variant={view === 'security' ? 'primary' : 'outline'} iconLeft={<ShieldCheck size={14} />}>Güvenlik</Button></Link>
      </div>
      {view === 'security' ? <SecurityReview /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLUGINS.filter((p) => view === 'installed' ? p.installed : true).map((p) => (
            <Card key={p.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-9 h-9 rounded-r-2 bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600"><PuzzlePiece size={18} weight="duotone" /></span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-fg-3">{p.author} · v{p.version}</div>
                </div>
                <span className="inline-flex items-center gap-0.5 text-xs"><Star size={12} weight="fill" className="text-amber-500" /> {p.rating}</span>
              </div>
              <p className="text-sm text-fg-3 mt-1">{p.desc}</p>
              <div className="mt-3 flex gap-2">
                {p.installed ? <Button size="sm" variant="outline">Yapılandır</Button> : <Button size="sm">Yükle</Button>}
                <Button size="sm" variant="ghost">Detay</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SecurityReview() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2"><Sparkle size={18} weight="fill" className="text-brand-500" /><h3 className="font-medium">Otomatik güvenlik denetimi</h3></div>
      <p className="text-sm text-fg-3 mb-3">Marketplace plugin'leri sandbox ortamda test edilir, supply chain hash zinciri doğrulanır.</p>
      <ul className="text-sm space-y-1">
        <li>• Sandbox test paketleri: 24/24 geçti</li>
        <li>• İmza doğrulama: tüm yüklü plugin'ler ✓</li>
        <li>• Yenisi: <strong>iyzico Payments v0.9.3</strong> — incelemede</li>
      </ul>
    </Card>
  );
}
