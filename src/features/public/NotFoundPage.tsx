import { Link } from 'react-router-dom';
import { Compass, Sparkle, House, MagnifyingGlass, ChatCircle, Heart } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const QUICK_LINKS = [
  { to: '/', label: 'Anasayfa', Icon: House },
  { to: '/listings', label: 'Keşfet', Icon: MagnifyingGlass },
  { to: '/account/favorites', label: 'Favoriler', Icon: Heart },
  { to: '/account/messages', label: 'Mesajlar', Icon: ChatCircle }
];

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <Compass size={48} weight="duotone" className="mx-auto text-brand-500" />
      <h1 className="mt-3 text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-1 text-fg-3">Aradığınız sayfa burada değil. URL doğru mu kontrol edin veya aşağıdaki rotalardan birini deneyin.</p>

      <Card className="mt-6 text-left bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><h3 className="font-medium">AI önerisi</h3></div>
        <p className="text-sm text-fg-2">Aşağıdaki popüler sayfalardan başlayın veya Cmd+K (komut paleti) ile niyetinizi yazın — sizin için doğru sayfaya gidelim.</p>
      </Card>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {QUICK_LINKS.map((l) => (
          <Link key={l.to} to={l.to}>
            <Card interactive className="!p-3 flex items-center gap-2 text-left">
              <l.Icon size={18} weight="duotone" className="text-brand-500" />
              <span className="text-sm font-medium">{l.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      <Link to="/" className="inline-block mt-6"><Button>Anasayfa</Button></Link>
    </div>
  );
}
