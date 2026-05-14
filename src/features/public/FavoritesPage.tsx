import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { ListingCard } from '@/components/data/ListingCard';
import { SectionHeading } from '@/components/data/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Heart } from '@phosphor-icons/react';

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
      <SectionHeading title={t('nav.favorites')} description={`${items.length} ilan`} />
      {items.length === 0 ? (
        <EmptyState icon={<Heart size={48} weight="duotone" />} title={t('empty.favorites')} description="Kalp ikonuna basarak ilanları kaydedin." aiHint="Beğendiğiniz ilanları analiz edip benzerlerini önereyim mi?" cta={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
