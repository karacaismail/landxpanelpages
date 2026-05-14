import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Ruler, Heart, ChatCircle, Calendar, ShareNetwork, Stack as StackIcon, ArrowLeft, ShieldCheck, Sparkle, House, CurrencyCircleDollar, CheckCircle, Buildings } from '@phosphor-icons/react';
import { useData } from '@/store/data';
import { useAuth } from '@/store/auth';
import { useCompare } from '@/store/compare';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiBadge } from '@/components/ui/AiBadge';
import { ImageGallery } from '@/components/data/ImageGallery';
import { ValuationBar } from '@/components/data/ValuationBar';
import { ListingCard } from '@/components/data/ListingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { IMAR_LABELS, TKGM_LABELS, TAPU_LABELS } from '@/data/fixtures/imar-types';
import { formatPrice, formatArea, formatRelTime, compactNumber } from '@/lib/utils/format';
import { nanoid } from 'nanoid';
import type { Offer, Viewing } from '@/types/domain';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const data = useData();
  const auth = useAuth();
  const compare = useCompare();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const listing = data.listings.find((l) => l.id === id);
  const seller = listing ? data.users.find((u) => u.id === listing.ownerId) : null;

  const similar = useMemo(() => {
    if (!listing) return [];
    return data.listings
      .filter((l) => l.id !== listing.id && l.status === 'live' && (l.city === listing.city || l.imarType === listing.imarType))
      .slice(0, 6);
  }, [data.listings, listing]);

  const [offerModal, setOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number | ''>('');
  const [viewingModal, setViewingModal] = useState(false);
  const [viewingDate, setViewingDate] = useState('');

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState title={t('common.notFound')} description="Bu ilan kaldırılmış veya yayında değil." cta={<Button onClick={() => navigate('/listings')}>Keşfet</Button>} />
      </div>
    );
  }

  const isFav = !!auth.currentUserId && !!data.favorites.find((f) => f.userId === auth.currentUserId && f.listingId === listing.id);
  const isInCompare = compare.has(listing.id);

  function toggleFav() {
    if (!auth.currentUserId) return navigate('/auth?next=' + encodeURIComponent(`/listings/${listing!.id}`));
    data.toggleFavorite(auth.currentUserId, listing!.id);
  }

  function submitOffer() {
    if (!auth.currentUserId || typeof offerAmount !== 'number' || !listing) return;
    const offer: Offer = {
      id: `o-${nanoid(6)}`,
      listingId: listing.id,
      buyerId: auth.currentUserId,
      sellerId: listing.ownerId,
      amount: offerAmount,
      status: 'pending',
      validUntil: new Date(Date.now() + 7 * 86400_000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{ at: new Date().toISOString(), by: auth.currentUserId, amount: offerAmount, status: 'pending', note: 'Yeni teklif' }]
    };
    data.upsertOffer(offer);
    data.addNotification({
      id: `n-${nanoid(6)}`,
      userId: listing.ownerId,
      channel: 'in_app',
      priority: 'now',
      title: 'Yeni teklif aldınız',
      body: `${listing.id}: ${offerAmount.toLocaleString('tr-TR')} ₺`,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/seller/offers`
    });
    setOfferModal(false);
    navigate('/account/offers');
  }

  function submitViewing() {
    if (!auth.currentUserId || !viewingDate || !listing) return;
    const v: Viewing = {
      id: `v-${nanoid(6)}`,
      listingId: listing.id,
      visitorId: auth.currentUserId,
      sellerId: listing.ownerId,
      scheduledAt: new Date(viewingDate).toISOString(),
      status: 'requested'
    };
    data.upsertViewing(v);
    setViewingModal(false);
    navigate('/account/viewings');
  }

  function share() {
    const url = `${window.location.origin}${window.location.pathname}#/listings/${listing!.id}`;
    if ((navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      void (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share!({ title: listing!.title, text: listing!.aiSummary, url });
    } else {
      void navigator.clipboard.writeText(url);
      alert('Bağlantı panoya kopyalandı');
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-fg-3 hover:text-fg-1 text-sm mb-3"><ArrowLeft size={16} /> Geri</button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sol: galeri + içerik */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">{listing.title}</h1>
                <div className="text-fg-3 text-sm mt-1 inline-flex items-center gap-1"><MapPin size={14} /> {listing.city} · {listing.district} · {listing.neighborhood}</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={listing.status} />
                <RiskBadge score={listing.aiRiskScore} reasons={listing.aiRiskReasons} />
                {listing.aiTags.slice(0, 3).map((tg) => <AiBadge key={tg}>{tg}</AiBadge>)}
              </div>
            </div>
          </div>

          <ImageGallery images={listing.images} />

          {/* AI özet */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Sparkle size={16} weight="fill" className="text-brand-500" />
              <h3 className="font-medium">{t('ai.summary')}</h3>
            </div>
            <p className="text-fg-2">{listing.aiSummary}</p>
            <ul className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
              {listing.aiRiskReasons.slice(0, 6).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-fg-3">
                  <CheckCircle size={14} weight="fill" className="text-brand-500 mt-1 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Spec grid */}
          <Card>
            <h3 className="font-medium mb-3">{t('listing.specs')}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <Spec label="Alan" value={formatArea(listing.area, locale)} icon={<Ruler size={14} />} />
              <Spec label="Fiyat" value={formatPrice(listing.price, locale)} icon={<CurrencyCircleDollar size={14} />} />
              <Spec label="m² başı" value={`${compactNumber(listing.pricePerM2, locale)} ₺`} />
              <Spec label="İmar" value={IMAR_LABELS[listing.imarType].tr} icon={<House size={14} />} />
              <Spec label="Tapu" value={TAPU_LABELS[listing.tapuType].tr} />
              <Spec label="TKGM" value={TKGM_LABELS[listing.tkgmStatus].tr} icon={<ShieldCheck size={14} />} />
              {listing.hisseRatio && <Spec label="Hisse" value={`${listing.hisseRatio}/100`} />}
              <Spec label="Ada / Parsel" value={`${listing.ada} / ${listing.parsel}`} />
              <Spec label="Pafta" value={listing.pafta || '—'} />
            </div>
          </Card>

          {/* Altyapı */}
          <Card>
            <h3 className="font-medium mb-3">{t('listing.infrastructure')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <Utility label="Yol" on={listing.utilities.road} />
              <Utility label="Elektrik" on={listing.utilities.electricity} />
              <Utility label="Su" on={listing.utilities.water} />
              <Utility label="Doğalgaz" on={listing.utilities.gas} />
              <Utility label="İnternet" on={listing.utilities.internet} />
            </div>
          </Card>

          {/* Özellikler */}
          <Card>
            <h3 className="font-medium mb-3">Öne çıkan özellikler</h3>
            <div className="flex flex-wrap gap-1.5">
              {listing.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-fg-2">{f}</span>
              ))}
            </div>
          </Card>

          {/* Açıklama */}
          <Card>
            <h3 className="font-medium mb-2">Açıklama</h3>
            <p className="text-fg-2 whitespace-pre-line">{listing.description}</p>
          </Card>

          {/* Lokasyon (mock) */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t('listing.location')}</h3>
              <span className="text-xs text-fg-3">Lat: {listing.lat.toFixed(4)} · Lng: {listing.lng.toFixed(4)}</span>
            </div>
            <div className="aspect-[16/9] rounded-r-2 bg-gradient-to-br from-emerald-100 to-sky-100 dark:from-emerald-900/40 dark:to-sky-900/40 border border-slate-200 dark:border-slate-800 grid place-items-center">
              <div className="text-fg-3 text-sm inline-flex items-center gap-2"><MapPin size={18} /> Harita önizleme (mock)</div>
            </div>
          </Card>

          {/* Similar */}
          {similar.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">{t('listing.similar')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {similar.map((s) => <ListingCard key={s.id} listing={s} hideStatus />)}
              </div>
            </div>
          )}
        </div>

        {/* Sağ: actions */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-3">
            <Card>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-fg-3">{t('common.price')}</div>
                  <div className="text-2xl font-semibold text-brand-700 dark:text-brand-300">{formatPrice(listing.price, locale)}</div>
                </div>
                <div className="text-xs text-fg-3 text-right">
                  {compactNumber(listing.pricePerM2, locale)} ₺/m²<br />
                  {formatArea(listing.area, locale)}
                </div>
              </div>
              <ValuationBar valuation={listing.aiValuation} currentPrice={listing.price} />
              <div className="grid grid-cols-3 gap-2 mt-3">
                <Button variant="outline" iconLeft={<Heart weight={isFav ? 'fill' : 'regular'} size={16} />} onClick={toggleFav}>{isFav ? 'Kayıtlı' : t('actions.favorite')}</Button>
                <Button variant="outline" iconLeft={<StackIcon weight={isInCompare ? 'fill' : 'regular'} size={16} />} onClick={() => isInCompare ? compare.remove(listing.id) : compare.add(listing.id)}>Karş.</Button>
                <Button variant="outline" iconLeft={<ShareNetwork size={16} />} onClick={share}>{t('actions.share')}</Button>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <Button iconLeft={<ChatCircle size={16} />} onClick={() => navigate('/account/messages')}>{t('listing.actionMessage')}</Button>
                <Button variant="secondary" iconLeft={<CurrencyCircleDollar size={16} />} onClick={() => setOfferModal(true)}>{t('listing.actionOffer')}</Button>
                <Button variant="outline" iconLeft={<Calendar size={16} />} onClick={() => setViewingModal(true)}>{t('listing.actionViewing')}</Button>
              </div>
            </Card>

            {/* Seller card */}
            {seller && (
              <Card>
                <h3 className="font-medium mb-3">{t('listing.seller')}</h3>
                <Link to="#" className="flex items-center gap-3">
                  <img src={seller.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{seller.displayName}</div>
                    <div className="text-xs text-fg-3">
                      ★ {seller.rating} · {seller.principalType === 'org' ? 'Kurumsal' : 'Bireysel'}
                      {seller.kycLevel === 'full' && <span className="ml-1 inline-flex items-center gap-0.5 text-emerald-600"><ShieldCheck size={12} weight="fill" /> Doğrulanmış</span>}
                    </div>
                  </div>
                </Link>
                {seller.bio && <p className="text-sm text-fg-3 mt-3">{seller.bio}</p>}
              </Card>
            )}

            <Card padding="sm">
              <div className="text-xs text-fg-3">
                İlan #{listing.id} · {listing.publishedAt ? formatRelTime(listing.publishedAt, locale) + ' yayında' : 'Henüz yayınlanmadı'}
              </div>
              <div className="text-xs text-fg-3 mt-0.5">
                {listing.views} görüntülenme · {listing.favoriteCount} favori · {listing.offerCount} teklif
              </div>
            </Card>
          </div>
        </aside>
      </div>

      {/* Offer modal */}
      {offerModal && (
        <Modal title="Teklif yap" onClose={() => setOfferModal(false)}>
          <p className="text-sm text-fg-3 mb-3">Liste fiyatı: <strong className="text-fg-1">{formatPrice(listing.price, locale)}</strong>. AI önerisi: <strong className="text-brand-700 dark:text-brand-300">{formatPrice(Math.round(listing.price * 0.92 / 10000) * 10000, locale)}</strong></p>
          <input type="number" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value ? Number(e.target.value) : '')} placeholder="Teklif tutarı (₺)" className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base min-h-[44px]" />
          <div className="flex gap-2 mt-3">
            <Button variant="outline" block onClick={() => setOfferModal(false)}>{t('actions.cancel')}</Button>
            <Button block disabled={typeof offerAmount !== 'number'} onClick={submitOffer}>Teklif gönder</Button>
          </div>
        </Modal>
      )}

      {/* Viewing modal */}
      {viewingModal && (
        <Modal title="Görme randevusu" onClose={() => setViewingModal(false)}>
          <p className="text-sm text-fg-3 mb-3">İlan sahibi ile yüz yüze görüşme için tarih önerin.</p>
          <input type="datetime-local" value={viewingDate} onChange={(e) => setViewingDate(e.target.value)} className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base min-h-[44px]" />
          <div className="flex gap-2 mt-3">
            <Button variant="outline" block onClick={() => setViewingModal(false)}>{t('actions.cancel')}</Button>
            <Button block disabled={!viewingDate} onClick={submitViewing}>Randevu öner</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Spec({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-fg-3 inline-flex items-center gap-1">{icon}{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}

function Utility({ label, on }: { label: string; on: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-r-2 px-3 py-2 ${on ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-fg-3'}`}>
      <span className="text-sm">{label}</span>
      {on ? <CheckCircle weight="fill" size={16} /> : <span className="text-xs">Yok</span>}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div role="dialog" aria-label={title} className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-r-4 p-4 lg:p-6 shadow-2xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}
