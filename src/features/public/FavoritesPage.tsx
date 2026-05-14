import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { ListingCard } from '@/components/data/ListingCard';
import { SectionHeading } from '@/components/data/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkle, ShieldCheck } from '@phosphor-icons/react';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils/format';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const items = useMemo(() => {
    if (!auth.currentUserId) return [];
    const ids = data.favorites.filter((f) => f.userId === auth.currentUserId).map((f) => f.listingId);
    return data.listings.filter((l) => ids.includes(l.id));
  }, [auth.currentUserId, data.favorites, data.listings]);

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title={t('nav.favorites')} description={`${items.length} ilan`} actions={items.length > 0 ? <Button variant="outline" onClick={() => navigate('/account/favorites/trends')}>Fiyat trendleri →</Button> : undefined} />
      {items.length === 0 ? (
        <EmptyState icon={<Heart size={48} weight="duotone" />} title={t('empty.favorites')} description="Kalp ikonuna basarak ilanları kaydedin." aiHint="Beğendiğiniz ilanları analiz edip benzerlerini önereyim mi?" cta={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>} />
      ) : (
        <>
          <Card className="mb-4 bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30">
            <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI özeti</span></div>
            <ul className="text-sm text-fg-2 space-y-1">
              <li>• Toplam fiyat aralığı: {formatPrice(Math.min(...items.map((l) => l.price)))} – {formatPrice(Math.max(...items.map((l) => l.price)))}</li>
              <li>• Ortalama m²: {Math.round(items.reduce((s, l) => s + l.area, 0) / items.length).toLocaleString('tr-TR')} m²</li>
              <li>• <ShieldCheck size={12} weight="fill" className="inline text-emerald-500" /> Temiz tapu: {items.filter((l) => l.tkgmStatus === 'temiz').length}/{items.length}</li>
              <li>• En düşük riskli: {items.reduce((m, l) => l.aiRiskScore < m.aiRiskScore ? l : m).title}</li>
              <li>• En çok eşleşen il: {(() => {
                const m = new Map<string, number>();
                items.forEach((l) => m.set(l.city, (m.get(l.city) || 0) + 1));
                const top = Array.from(m.entries()).sort((a, b) => b[1] - a[1])[0];
                return top ? `${top[0]} (${top[1]})` : '—';
              })()}</li>
            </ul>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </>
      )}
    </div>
  );
}
