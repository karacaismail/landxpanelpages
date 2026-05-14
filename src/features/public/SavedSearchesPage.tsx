import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BellRinging, BellSlash, Trash, MagnifyingGlass, BookmarkSimple, ArrowRight } from '@phosphor-icons/react';

export default function SavedSearchesPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const mine = useMemo(() => data.savedSearches.filter((s) => s.userId === auth.currentUserId), [data.savedSearches, auth.currentUserId]);

  function toggle(id: string) {
    const s = mine.find((x) => x.id === id);
    if (!s) return;
    data.upsertSavedSearch({ ...s, alertEnabled: !s.alertEnabled });
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title={t('nav.savedSearches')} description={`${mine.length} kayıtlı arama`} actions={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>} />
      {mine.length === 0 ? (
        <EmptyState icon={<BookmarkSimple size={48} weight="duotone" />} title={t('empty.searches')} description="Keşfet sayfasında aramayı kaydet butonunu kullanın." aiHint="Sık aradığınız bölgeleri öğrenip akıllı alarm oluşturayım mı?" cta={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mine.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-medium">{s.name}</h3>
                  <div className="text-xs text-fg-3 mt-0.5">{Object.entries(s.filters).filter(([k, v]) => k !== 'query' && v).slice(0, 5).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(',') : v}`).join(' · ')}</div>
                </div>
                <button onClick={() => toggle(s.id)} className={`p-2 rounded-r-2 ${s.alertEnabled ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/40' : 'text-fg-3 hover:bg-slate-100 dark:hover:bg-slate-800'}`} aria-label="Alarm aç/kapa">
                  {s.alertEnabled ? <BellRinging size={18} weight="fill" /> : <BellSlash size={18} />}
                </button>
              </div>
              <div className="text-xs text-fg-3 mb-3">Eşleşen: <strong className="text-fg-1">{s.matchCount}</strong></div>
              <div className="flex gap-2">
                <Button size="sm" iconLeft={<MagnifyingGlass size={14} />} onClick={() => navigate(`/listings?q=${encodeURIComponent(s.filters.query || s.name)}`)}>Ara</Button>
                <Button size="sm" variant="outline" iconLeft={<Trash size={14} />} onClick={() => data.removeSavedSearch(s.id)}>Sil</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
