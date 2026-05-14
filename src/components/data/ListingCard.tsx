import { Link } from 'react-router-dom';
import { Heart, MapPin, Ruler, Eye, ChatCircle, Stack as StackIcon, Sparkle } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { cls } from '@/lib/utils/cls';
import { formatArea, formatPrice, compactNumber } from '@/lib/utils/format';
import { IMAR_LABELS, TKGM_LABELS } from '@/data/fixtures/imar-types';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiBadge } from '@/components/ui/AiBadge';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { useCompare } from '@/store/compare';
import type { Listing } from '@/types/domain';

function isNew(publishedAt?: string): boolean {
  if (!publishedAt) return false;
  return (Date.now() - new Date(publishedAt).getTime()) < 7 * 86400_000;
}

interface Props {
  listing: Listing;
  variant?: 'grid' | 'list' | 'compact';
  hideStatus?: boolean;
}

export function ListingCard({ listing, variant = 'grid', hideStatus }: Props) {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const compare = useCompare();
  const isFav = !!auth.currentUserId && !!data.favorites.find((f) => f.userId === auth.currentUserId && f.listingId === listing.id);
  const isInCompare = compare.has(listing.id);
  const compareFull = compare.ids.length >= 4 && !isInCompare;
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.currentUserId) { window.location.hash = '#/auth'; return; }
    data.toggleFavorite(auth.currentUserId, listing.id);
  }

  function toggleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (compareFull) return;
    isInCompare ? compare.remove(listing.id) : compare.add(listing.id);
  }

  if (variant === 'list') {
    return (
      <Link to={`/listings/${listing.id}`} className="group flex gap-3 lg:gap-4 p-3 rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
        <img src={listing.images[0]?.thumbUrl} alt="" loading="lazy" className="w-28 h-28 lg:w-40 lg:h-32 object-cover rounded-r-2 bg-slate-200" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-fg-1 line-clamp-2 group-hover:text-brand-600">{listing.title}</h3>
            <div className="text-right shrink-0">
              <div className="font-semibold text-brand-700 dark:text-brand-300">{formatPrice(listing.price, locale)}</div>
              <div className="text-xs text-fg-3">{compactNumber(listing.pricePerM2, locale)} ₺/m²</div>
            </div>
          </div>
          <div className="text-sm text-fg-3 mt-1 inline-flex items-center gap-1"><MapPin size={14} /> {listing.city} · {listing.district}</div>
          <div className="text-xs text-fg-3 mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1"><Ruler size={12} /> {formatArea(listing.area, locale)}</span>
            <span>·</span>
            <span>{IMAR_LABELS[listing.imarType].tr}</span>
            <span>·</span>
            <span>TKGM: {TKGM_LABELS[listing.tkgmStatus].tr}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {!hideStatus && <StatusBadge status={listing.status} size="sm" />}
            <RiskBadge size="sm" score={listing.aiRiskScore} reasons={listing.aiRiskReasons} />
            {listing.aiTags.slice(0, 2).map((tag) => <AiBadge key={tag}>{tag}</AiBadge>)}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={toggleFav} className={cls('p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800', isFav && 'text-rose-500')} aria-label={t('actions.favorite')}>
            <Heart weight={isFav ? 'fill' : 'regular'} size={18} />
          </button>
          <button onClick={toggleCompare} disabled={compareFull} title={compareFull ? '4 ilanlık karşılaştırma sınırı doldu' : undefined} className={cls('p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800', isInCompare && 'text-brand-600', compareFull && 'opacity-40 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent')} aria-label={t('actions.compare')}>
            <StackIcon weight={isInCompare ? 'fill' : 'regular'} size={18} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/listings/${listing.id}`} className="group block rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="relative">
        <img
          src={listing.images[0]?.thumbUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full aspect-[4/3] object-cover bg-slate-200 dark:bg-slate-800 transition-opacity duration-300 [&:not([data-loaded])]:opacity-0 [&[data-loaded]]:opacity-100"
          onLoad={(e) => e.currentTarget.setAttribute('data-loaded', '')}
          ref={(el) => { if (el?.complete) el.setAttribute('data-loaded', ''); }}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button onClick={toggleFav} className={cls('p-2 rounded-full bg-white/90 backdrop-blur shadow-sm', isFav ? 'text-rose-500' : 'text-fg-2')} aria-label={t('actions.favorite')}>
            <Heart weight={isFav ? 'fill' : 'regular'} size={16} />
          </button>
          <button onClick={toggleCompare} disabled={compareFull} title={compareFull ? '4 ilanlık karşılaştırma sınırı doldu' : undefined} className={cls('p-2 rounded-full bg-white/90 backdrop-blur shadow-sm', isInCompare ? 'text-brand-600' : 'text-fg-2', compareFull && 'opacity-40 cursor-not-allowed')} aria-label={t('actions.compare')}>
            <StackIcon weight={isInCompare ? 'fill' : 'regular'} size={16} />
          </button>
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {!hideStatus && listing.status !== 'live' && <StatusBadge status={listing.status} size="sm" />}
          {isNew(listing.publishedAt) && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-accent-500 text-white">YENİ</span>
          )}
          <RiskBadge size="sm" score={listing.aiRiskScore} reasons={listing.aiRiskReasons} />
        </div>
        {listing.aiTags[0] && (
          <div className="absolute bottom-2 left-2">
            <AiBadge>{listing.aiTags[0]}</AiBadge>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start gap-2 justify-between">
          <h3 className="font-medium text-fg-1 line-clamp-2 leading-snug group-hover:text-brand-600">{listing.title}</h3>
        </div>
        <div className="text-sm text-fg-3 mt-1 inline-flex items-center gap-1">
          <MapPin size={14} /> {listing.city} · {listing.district}
        </div>
        <div className="text-xs text-fg-3 mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1"><Ruler size={12} /> {formatArea(listing.area, locale)}</span>
          <span>·</span>
          <span>{IMAR_LABELS[listing.imarType].tr}</span>
        </div>
        <div className="flex items-end justify-between mt-2.5">
          <div>
            <div className="font-semibold text-brand-700 dark:text-brand-300 text-lg leading-none">{formatPrice(listing.price, locale)}</div>
            <div className="text-[11px] text-fg-3 mt-0.5">{compactNumber(listing.pricePerM2, locale)} ₺/m²</div>
          </div>
          <div className="flex gap-2 text-xs text-fg-3">
            <span className="inline-flex items-center gap-0.5"><Eye size={12} /> {listing.views}</span>
            <span className="inline-flex items-center gap-0.5"><ChatCircle size={12} /> {listing.messageCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
