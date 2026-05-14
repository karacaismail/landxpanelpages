import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Sparkle } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const SHORTCUTS: Array<[string, string]> = [
  ['Cmd/Ctrl + K', 'Komut paletini aç'],
  ['Cmd/Ctrl + J', 'AI yardımcıyı aç/kapat'],
  ['Cmd/Ctrl + B', 'Sidebar daralt/genişlet'],
  ['/', 'Aramaya odakla (komut paleti)'],
  ['?', 'Bu yardım sayfasına git'],
  ['g + d', 'Discover/Keşfet'],
  ['g + m', 'Mesajlar'],
  ['g + f', 'Favoriler'],
  ['g + n', 'Bildirimler'],
  ['g + i', 'İlanlarım (satıcı)'],
  ['g + a', 'Onaylar (admin)'],
  ['g + u', 'Kullanıcılar (admin)'],
  ['g + r', 'ECA Kuralları (admin)'],
  ['g + s', 'Ayarlar (admin)'],
  ['Esc', 'Aktif modal/drawer kapat']
];

const GENERAL: Array<[string, string]> = [
  ['/', 'Anasayfa'], ['/listings', 'Keşfet'], ['/compare', 'Karşılaştır'],
  ['/sell', 'İlan yayınla'], ['/auth', 'Giriş'], ['/auth/register', 'Kayıt'],
  ['/legal/kvkk', 'KVKK'], ['/legal/terms', 'Şartlar'], ['/legal/cookies', 'Çerez'],
  ['/legal/accessibility', 'Erişilebilirlik'], ['/legal/ai', 'AI uyumluluk']
];

const ACCOUNT: Array<[string, string]> = [
  ['/account', 'Hesap hub'], ['/account/favorites', 'Favoriler'],
  ['/account/searches', 'Aramalarım'], ['/account/messages', 'Mesajlar'],
  ['/account/offers', 'Tekliflerim'], ['/account/viewings', 'Randevular'],
  ['/account/profile', 'Profil'], ['/account/ai-history', 'AI geçmişi'],
  ['/notifications', 'Bildirimler']
];

const PANEL: Array<[string, string]> = [
  ['/seller', 'Satıcı paneli'], ['/seller/listings', 'İlanlarım'],
  ['/seller/listings/new', 'Yeni ilan'], ['/seller/offers', 'Teklifler'],
  ['/seller/performance', 'Performans'],
  ['/admin', 'Yönetim paneli'], ['/admin/approvals', 'Onaylar'],
  ['/admin/users', 'Kullanıcılar'], ['/admin/roles', 'Roller'],
  ['/admin/rules', 'ECA kuralları'], ['/admin/audit', 'Denetim izi'],
  ['/admin/reports', 'Raporlar'], ['/admin/reports/ai-usage', 'AI kullanım'],
  ['/admin/reports/health', 'SLO & sağlık'], ['/admin/tkgm', 'TKGM'],
  ['/admin/modules', 'Modüller (33)'], ['/admin/modules/K02', 'Modül detay örnek'],
  ['/admin/notifications-templates', 'Bildirim şablonları'],
  ['/admin/settings', 'Ayarlar'], ['/admin/settings/ai-providers', 'AI sağlayıcılar'],
  ['/admin/settings/ai-prompts', 'AI promptlar'], ['/admin/settings/ai-tools', 'AI tools'],
  ['/admin/settings/pii', 'PII'], ['/admin/compliance', 'Uyumluluk'],
  ['/admin/plugins', 'Eklentiler']
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 lg:px-6 py-6 space-y-4">
      <SectionHeading title="Yardım & Sitemap" description="LandX'i daha hızlı kullanın" />
      <Card>
        <div className="flex items-center gap-2 mb-3"><Sparkle size={18} weight="fill" className="text-brand-500" /><h3 className="font-medium">AI ile başlangıç</h3></div>
        <ul className="text-sm space-y-1 text-fg-2">
          <li>• Niyetinizi yazın: "İstanbul Beykoz 5000 m² imarlı 2.5M altı"</li>
          <li>• Komut paletini açın (Cmd+K), eylem önerin: "Yeni ECA kuralı ekle"</li>
          <li>• AI yardımcı sayfayı görür — soru sorun, öneri kabul edin</li>
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium mb-3">AI dokunuşları nerede?</h3>
        <ul className="text-sm space-y-1.5 text-fg-2">
          <li>• <strong>Cmd+K</strong> her sayfada komut + niyet ortak alanı</li>
          <li>• <strong>Cmd+J</strong> AI Asistan Drawer (rol+sayfa bağlam aware)</li>
          <li>• Discover: AI Top 3 öneri çubuğu (güven × düşük risk)</li>
          <li>• İlan detay: <em>AI'a bu ilanı sor</em>, AI Değerleme, Risk açıklaması, 12 ay fiyat trendi</li>
          <li>• İlan wizard: niyet parse, AI başlık, AI fiyat, AI açıklama, TKGM doğrulama</li>
          <li>• Admin Approvals: AI red mektubu taslağı (ilanın özelliğine göre)</li>
          <li>• Admin Rules: 24 ECA kuralı, demo runner her 45sn'de mock olay üretir</li>
          <li>• Admin AI Usage: token/maliyet/latency/halüsinasyon dashboard'u</li>
          <li>• Bildirimler: AI gruplama (3+ benzeri toplanır)</li>
          <li>• Profile: AI hafıza (kullanıcı tercihlerini hatırlar)</li>
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium mb-3">Demo verisi (deterministik seed=42)</h3>
        <ul className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-1 text-fg-2">
          <li>• 60 kullanıcı (alıcı, satıcı, admin)</li>
          <li>• 220 ilan (81 il dağılımı)</li>
          <li>• 120 teklif · 40 thread · 300 mesaj</li>
          <li>• 35 randevu · 80 favori · 22 kayıtlı arama</li>
          <li>• 24 ECA kuralı (15 etkin)</li>
          <li>• 140 bildirim · 500 audit · 60 TKGM sorgusu</li>
          <li>• 33 modül (Excel master) × 1398 alan</li>
        </ul>
        <p className="text-xs text-fg-3 mt-3">Tüm veriler tarayıcıda Faker.tr ile üretiliyor. Sayfa yenilenince sıfırlanır.</p>
      </Card>

      <Card>
        <h3 className="font-medium mb-3">Tüm Rotalar</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <RouteGroup title={`Genel (${GENERAL.length})`} routes={GENERAL} />
          <RouteGroup title={`Hesap (${ACCOUNT.length})`} routes={ACCOUNT} />
          <RouteGroup title={`Satıcı + Yönetim (${PANEL.length})`} routes={PANEL} />
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-3">Klavye kısayolları</h3>
        <ul className="grid sm:grid-cols-2 gap-1 text-sm">
          {SHORTCUTS.map(([k, v]) => (
            <li key={k} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-1.5">
              <kbd className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{k}</kbd>
              <span className="text-fg-2">{v}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function RouteGroup({ title, routes }: { title: string; routes: Array<[string, string]> }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">{title}</div>
      <ul className="space-y-1">
        {routes.map(([path, label]) => (
          <li key={path}>
            <Link to={path} className="hover:underline inline-flex items-center gap-2 text-fg-2 hover:text-brand-700 dark:hover:text-brand-300">
              <span>{label}</span>
              <code className="text-[10px] text-fg-4">{path}</code>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
