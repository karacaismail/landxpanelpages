import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Sparkle, MapTrifold, GridFour, ListBullets, X, BookmarkSimple } from '@phosphor-icons/react';
import { useData } from '@/store/data';
import { useAuth } from '@/store/auth';
import { ListingCard } from '@/components/data/ListingCard';
import { LandMap } from '@/components/map/LandMap';
import { FilterBar } from '@/components/data/FilterBar';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { AiBadge } from '@/components/ui/AiBadge';
import { parseQuery } from '@/lib/ai/nl-parser';
import type { Listing, SavedSearchFilters } from '@/types/domain';
import { nanoid } from 'nanoid';
import { cls } from '@/lib/utils/cls';

type Sort = 'newest' | 'priceAsc' | 'priceDesc' | 'areaDesc' | 'riskAsc';
type View = 'grid' | 'list' | 'map';

export default function DiscoverPage() {
  const { t } = useTranslation();
  const data = useData();
  const auth = useAuth();
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [view, setView] = useState<View>('grid');
  const [sort, setSort] = useState<Sort>('newest');
  const [q, setQ] = useState(sp.get('q') || '');
  const [filters, setFilters] = useState<SavedSearchFilters>(() => {
    const initial: SavedSearchFilters = {};
    if (sp.get('q')) Object.assign(initial, parseQuery(sp.get('q')!));
    if (sp.get('imar')) initial.imarType = sp.get('imar') as never;
    if (sp.get('city')) initial.city = sp.get('city')!;
    if (sp.get('district')) initial.district = sp.get('district')!;
    if (sp.get('tkgm')) initial.tkgmStatus = sp.get('tkgm') as never;
    if (sp.get('tapu')) initial.tapuType = sp.get('tapu') as never;
    if (sp.get('minPrice')) initial.minPrice = Number(sp.get('minPrice'));
    if (sp.get('maxPrice')) initial.maxPrice = Number(sp.get('maxPrice'));
    if (sp.get('minArea')) initial.minArea = Number(sp.get('minArea'));
    if (sp.get('maxArea')) initial.maxArea = Number(sp.get('maxArea'));
    return initial;
  });

  useEffect(() => {
    const next: Record<string, string> = {};
    if (q) next.q = q;
    if (filters.imarType) next.imar = filters.imarType;
    setSp(next, { replace: true });
  }, [q, filters.imarType, setSp]);

  const filtered = useMemo<Listing[]>(() => {
    let out = data.listings.filter((l) => l.status === 'live');
    if (filters.city) out = out.filter((l) => l.city === filters.city);
    if (filters.district) out = out.filter((l) => l.district === filters.district);
    if (filters.imarType) out = out.filter((l) => l.imarType === filters.imarType);
    if (filters.tapuType) out = out.filter((l) => l.tapuType === filters.tapuType);
    if (filters.tkgmStatus) out = out.filter((l) => l.tkgmStatus === filters.tkgmStatus);
    if (filters.minPrice !== undefined) out = out.filter((l) => l.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) out = out.filter((l) => l.price <= filters.maxPrice!);
    if (filters.minArea !== undefined) out = out.filter((l) => l.area >= filters.minArea!);
    if (filters.maxArea !== undefined) out = out.filter((l) => l.area <= filters.maxArea!);
    if (filters.features?.length) out = out.filter((l) => filters.features!.every((f) => l.features.includes(f)));
    if (q.trim()) {
      const nq = q.toLocaleLowerCase('tr-TR');
      out = out.filter((l) => (
        l.title.toLocaleLowerCase('tr-TR').includes(nq) ||
        l.city.toLocaleLowerCase('tr-TR').includes(nq) ||
        l.district.toLocaleLowerCase('tr-TR').includes(nq) ||
        l.aiTags.some((x) => x.toLocaleLowerCase('tr-TR').includes(nq))
      ));
    }
    switch (sort) {
      case 'priceAsc': return [...out].sort((a, b) => a.price - b.price);
      case 'priceDesc': return [...out].sort((a, b) => b.price - a.price);
      case 'areaDesc': return [...out].sort((a, b) => b.area - a.area);
      case 'riskAsc': return [...out].sort((a, b) => a.aiRiskScore - b.aiRiskScore);
      default: return [...out].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
    }
  }, [data.listings, filters, q, sort]);

  function aiParse() {
    if (!q.trim()) return;
    const parsed = parseQuery(q);
    const { remainingTokens, ...rest } = parsed;
    setFilters((f) => ({ ...f, ...rest }));
  }

  function aiSuggestFromFavorites() {
    if (!auth.currentUserId) { navigate('/auth?next=' + encodeURIComponent('/listings')); return; }
    const favIds = data.favorites.filter((f) => f.userId === auth.currentUserId).map((f) => f.listingId);
    const favs = data.listings.filter((l) => favIds.includes(l.id));
    if (favs.length === 0) {
      alert('Henüz favoriniz yok. Birkaç ilanı favorileyince size benzer ilanlar önerebilirim.');
      return;
    }
    // En yaygın şehir, imar, tapu
    const top = <T,>(arr: T[]): T | undefined => {
      const m = new Map<T, number>();
      arr.forEach((v) => m.set(v, (m.get(v) || 0) + 1));
      return Array.from(m.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    };
    const topCity = top(favs.map((f) => f.city));
    const topImar = top(favs.map((f) => f.imarType));
    const topTapu = top(favs.map((f) => f.tapuType));
    const avgPrice = favs.reduce((s, l) => s + l.price, 0) / favs.length;
    setFilters({
      city: topCity,
      imarType: topImar,
      tapuType: topTapu,
      minPrice: Math.round(avgPrice * 0.7 / 10000) * 10000,
      maxPrice: Math.round(avgPrice * 1.3 / 10000) * 10000
    });
    setQ('');
  }

  function saveSearch() {
    if (!auth.currentUserId) { navigate('/auth'); return; }
    data.upsertSavedSearch({
      id: `ss-${nanoid(6)}`,
      userId: auth.currentUserId,
      name: q.trim() || (filters.city || 'Aramam'),
      filters,
      alertEnabled: true,
      matchCount: filtered.length,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      {/* Niyet çubuğu */}
      <div className="rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 mb-4">
        <div className="flex flex-col md:flex-row gap-2 items-stretch">
          <div className="flex-1 relative">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="İstanbul Beykoz 5000 m² imarlı 2.5M altı, deniz manzaralı..."
              className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3 py-2.5 text-base min-h-[44px]"
              aria-label="Niyet veya arama"
            />
            {q && <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Temizle"><X size={14} /></button>}
          </div>
          <Button onClick={aiParse} iconLeft={<Sparkle size={16} weight="fill" />}>AI ile parse et</Button>
          <Button variant="outline" onClick={aiSuggestFromFavorites} iconLeft={<Sparkle size={16} weight="fill" />}>Bana öner</Button>
          <FilterBar value={filters} onChange={setFilters} onClear={() => setFilters({})} />
          <Button variant="outline" iconLeft={<BookmarkSimple size={16} />} onClick={saveSearch}>Aramayı kaydet</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Object.entries(filters).filter(([k, v]) => v !== undefined && v !== '' && k !== 'query').map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1 text-xs bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 rounded-full px-2 py-0.5">
              {k}: {Array.isArray(v) ? v.join(',') : String(v)}
              <button onClick={() => setFilters((f) => { const n = { ...f }; delete (n as Record<string, unknown>)[k]; return n; })} aria-label="Çıkar"><X size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      <SectionHeading
        title={t('discover.results', { count: filtered.length })}
        actions={
          <div className="flex gap-1.5">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm min-h-[40px]">
              <option value="newest">{t('discover.sortNewest')}</option>
              <option value="priceAsc">{t('discover.sortPriceAsc')}</option>
              <option value="priceDesc">{t('discover.sortPriceDesc')}</option>
              <option value="areaDesc">{t('discover.sortAreaDesc')}</option>
              <option value="riskAsc">{t('discover.sortRiskAsc')}</option>
            </select>
            <div className="inline-flex rounded-r-2 border border-slate-300 dark:border-slate-700 overflow-hidden">
              <ViewBtn active={view === 'grid'} Icon={GridFour} onClick={() => setView('grid')} label={t('discover.gridView')} />
              <ViewBtn active={view === 'list'} Icon={ListBullets} onClick={() => setView('list')} label={t('discover.listView')} />
              <ViewBtn active={view === 'map'} Icon={MapTrifold} onClick={() => setView('map')} label={t('discover.mapView')} />
            </div>
          </div>
        }
      />

      {/* AI Top 3 öneri çubuğu */}
      {filtered.length > 3 && (
        <div className="mb-4 rounded-r-3 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30 border border-brand-200/60 dark:border-brand-700/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkle size={14} weight="fill" className="text-brand-500" />
            <span className="text-sm font-medium">AI: Top 3 öneri</span>
            <span className="text-[11px] text-fg-3 ml-1 hidden sm:inline">— güven × düşük risk önceliklendirildi</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            {[...filtered].sort((a, b) => (b.aiValuation.confidence * 100 - b.aiRiskScore) - (a.aiValuation.confidence * 100 - a.aiRiskScore)).slice(0, 3).map((l) => {
              const reasons: string[] = [];
              if (l.aiRiskScore < 30) reasons.push('düşük risk');
              if (l.tkgmStatus === 'temiz') reasons.push('TKGM temiz');
              if (l.aiValuation.confidence > 0.8) reasons.push('yüksek güven');
              if (l.features.includes('Yatırımlık')) reasons.push('yatırımlık');
              if (l.utilities.road && l.utilities.electricity) reasons.push('altyapı tam');
              const why = reasons.slice(0, 3).join(' · ') || 'iyi eşleşme';
              return (
                <button key={l.id} onClick={() => navigate(`/listings/${l.id}`)} className="text-left p-2 rounded-r-2 hover:bg-white/60 dark:hover:bg-slate-900/50 transition-colors flex gap-2">
                  <img src={l.images[0]?.thumbUrl} alt="" className="w-12 h-12 rounded-r-1 object-cover bg-slate-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{l.title}</div>
                    <div className="text-xs text-fg-3 truncate">{l.city} · risk {l.aiRiskScore}</div>
                    <div className="text-[11px] text-brand-700 dark:text-brand-300 inline-flex items-center gap-1 mt-0.5"><Sparkle size={10} weight="fill" /> {why}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={t('discover.noResults')}
          description={t('common.tryDifferent')}
          aiHint="Filtreyi gevşetmemi veya başka bir bölge önermemi ister misiniz?"
          cta={<Button onClick={() => setFilters({})}>{t('discover.clearFilters')}</Button>}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.slice(0, 60).map((l) => <ListingCard key={l.id} listing={l} hideStatus />)}
        </div>
      ) : view === 'list' ? (
        <div className="space-y-3">
          {filtered.slice(0, 60).map((l) => <ListingCard key={l.id} listing={l} variant="list" hideStatus />)}
        </div>
      ) : (
        <div className="rounded-r-3 border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <LandMap
            points={filtered.slice(0, 200).map((l) => ({ id: l.id, lat: l.lat, lng: l.lng, title: l.title, href: `#/listings/${l.id}` }))}
            height={520}
            center={filtered.length ? [filtered[0].lat, filtered[0].lng] : undefined}
            zoom={filtered.length === 1 ? 11 : 6}
          />
        </div>
      )}
    </div>
  );
}

function ViewBtn({ active, Icon, onClick, label }: { active: boolean; Icon: typeof MagnifyingGlass; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cls('inline-flex items-center justify-center min-w-10 min-h-10 px-2', active ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-900 text-fg-2 hover:bg-slate-50 dark:hover:bg-slate-800')}
      aria-label={label}
      title={label}
    >
      <Icon size={16} />
    </button>
  );
}
