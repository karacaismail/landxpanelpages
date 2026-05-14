import { Link, useLocation } from 'react-router-dom';
import { CaretRight, House } from '@phosphor-icons/react';

const LABELS: Record<string, string> = {
  admin: 'Yönetim',
  seller: 'Satıcı',
  account: 'Hesabım',
  listings: 'İlanlar',
  approvals: 'Onaylar',
  users: 'Kullanıcılar',
  roles: 'Roller',
  rules: 'ECA Kuralları',
  audit: 'Denetim İzi',
  reports: 'Raporlar',
  'ai-usage': 'AI Kullanım',
  health: 'SLO & Sağlık',
  tkgm: 'TKGM',
  modules: 'Modüller',
  'notifications-templates': 'Bildirim Şablonları',
  settings: 'Ayarlar',
  compliance: 'Uyumluluk',
  plugins: 'Eklentiler',
  marketplace: 'Marketplace',
  security: 'Güvenlik',
  tenant: 'Tenant Yönetimi',
  'agent-tasks': 'Agent Görevleri',
  performance: 'Performans',
  offers: 'Teklifler',
  messages: 'Mesajlar',
  viewings: 'Randevular',
  favorites: 'Favoriler',
  searches: 'Aramalarım',
  profile: 'Profil',
  'ai-history': 'AI Geçmişi',
  new: 'Yeni',
  edit: 'Düzenle',
  compare: 'Karşılaştır',
  notifications: 'Bildirimler',
  help: 'Yardım',
  auth: 'Giriş',
  register: 'Kayıt',
  legal: 'Yasal',
  kvkk: 'KVKK',
  terms: 'Şartlar',
  cookies: 'Çerez',
  accessibility: 'Erişilebilirlik',
  ai: 'AI Uyumluluk',
  sell: 'Sat',
  'ai-providers': 'AI Sağlayıcılar',
  'ai-prompts': 'AI Promptlar',
  'ai-tools': 'AI Araçlar',
  'ai-search': 'AI Arama',
  pii: 'PII Yönetimi',
  schema: 'Schema',
  'schema-history': 'Schema Geçmişi'
};

function label(seg: string): string {
  // Module id (K01, A09 vs.) gibi pattern
  if (/^[KIASDO]\d{2}$/.test(seg)) return seg;
  // Listing id (L0042)
  if (/^L\d{4}$/.test(seg)) return seg;
  return LABELS[seg] || seg;
}

export function Breadcrumb() {
  const loc = useLocation();
  const segs = loc.pathname.split('/').filter(Boolean);
  if (segs.length === 0) return null;

  const items: Array<{ label: string; to: string }> = [];
  let acc = '';
  for (const s of segs) {
    acc += '/' + s;
    items.push({ label: label(s), to: acc });
  }

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-fg-3 mb-3 inline-flex items-center flex-wrap gap-1">
      <Link to="/" className="inline-flex items-center gap-0.5 hover:text-fg-1"><House size={12} weight="duotone" /></Link>
      {items.map((it, i) => (
        <span key={it.to} className="inline-flex items-center gap-1">
          <CaretRight size={10} className="text-fg-4" />
          {i === items.length - 1 ? (
            <span className="text-fg-2 font-medium">{it.label}</span>
          ) : (
            <Link to={it.to} className="hover:text-fg-1">{it.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
