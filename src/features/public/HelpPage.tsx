import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Sparkle } from '@phosphor-icons/react';

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

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-3 lg:px-6 py-6 space-y-4">
      <SectionHeading title="Yardım & Kısayollar" description="LandX'i daha hızlı kullanın" />
      <Card>
        <div className="flex items-center gap-2 mb-3"><Sparkle size={18} weight="fill" className="text-brand-500" /><h3 className="font-medium">AI ile başlangıç</h3></div>
        <ul className="text-sm space-y-1 text-fg-2">
          <li>• Niyetinizi yazın: "İstanbul Beykoz 5000 m² imarlı 2.5M altı"</li>
          <li>• Komut paletini açın (Cmd+K), eylem önerin: "Yeni ECA kuralı ekle"</li>
          <li>• AI yardımcı sayfayı görür — soru sorun, öneri kabul edin</li>
        </ul>
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
