import { Link } from 'react-router-dom';
import { Compass } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <Compass size={48} weight="duotone" className="mx-auto text-brand-500" />
      <h1 className="mt-3 text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-1 text-fg-3">Aradığınız sayfa burada değil.</p>
      <Link to="/" className="inline-block mt-4"><Button>Anasayfa</Button></Link>
    </div>
  );
}
