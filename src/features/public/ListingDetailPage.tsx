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
import { LandMap } from '@/components/map/LandMap';
import { PriceTrendChart } from '@/components/data/PriceTrendChart';
import { useAi } from '@/store/ai';
import { useUi } from '@/store/ui';
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
  const ai = useAi();
  const ui = useUi();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const listing = data.listings.find((l) => l.id === id);
  const seller = listing ? data.users.find((u) => u.id === listing.ownerId) : null;

  const similar = useMemo(() => {
    if (!listing) return [];
    return data.listings
      .filter((l) => l.id !== listing.id && l.status === 'live' && (l.city === listing.city || l.imarType === listing.imarType))
      .slice(0, 6);
  }, [data.listings, listing]);

  const sellerOther = useMemo(() => {
    if (!listing) return [];
    return data.listings.filter((l) => l.id !== listing.id && l.ownerId === listing.ownerId && l.status === 'live').slice(0, 3);
  }, [data.listings, listing]);

  const [offerModal, setOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number | ''>('');
  const [viewingModal, setViewingModal] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [shareModal, setShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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

  function openOrCreateThread() {
    if (!auth.currentUserId) { navigate('/auth?next=' + encodeURIComponent(`/listings/${listing!.id}`)); return; }
    if (!listing) return;
    const existing = data.threads.find((th) => th.participantIds.includes(auth.currentUserId!) && th.participantIds.includes(listing.ownerId) && th.listingId === listing.id);
    if (!existing) {
      const threadId = `th-new-${Date.now().toString(36)}`;
      const greeting = {
        id: `m-${threadId}-1`,
        threadId,
        senderId: auth.currentUserId,
        body: `Merhaba, "${listing.title}" ilanınızla ilgileniyorum. Detay alabilir miyim?`,
        createdAt: new Date().toISOString(),
        readBy: [auth.currentUserId],
        aiSuggestedReplies: ['Merhaba, tabii. Nasıl yardımcı olabilirim?', 'Görme randevusu için tarih önerebilirim.']
      };
      data.addMessage(greeting);
      // best-effort thread record (DataStore doesn't have upsertThread, addMessage suffices)
    }
    navigate('/account/messages');
  }

  function share() {
    setShareModal(true);
  }

  function nativeShare() {
    if (!listing) return;
    const url = `${window.location.origin}${window.location.pathname}#/listings/${listing.id}`;
    const n = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (n.share) {
      void n.share({ title: listing.title, text: listing.aiSummary, url });
      setShareModal(false);
    } else {
      void navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  function copyLink() {
    if (!listing) return;
    const url = `${window.location.origin}${window.location.pathname}#/listings/${listing.id}`;
    void navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  function shareOn(network: 'whatsapp' | 'x' | 'mail' | 'linkedin') {
    if (!listing) return;
    const url = encodeURIComponent(`${window.location.origin}${window.location.pathname}#/listings/${listing.id}`);
    const text = encodeURIComponent(`${listing.title} — LandX`);
    const targets: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      mail: `mailto:?subject=${text}&body=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    window.open(targets[network], '_blank', 'noopener');
  }

  function askAi() {
    if (!listing) return;
    ai.appendUser(`"${listing.title}" ilanı hakkında ne düşünüyorsun? ${listing.city}/${listing.district}, ${listing.area} m², ${listing.price.toLocaleString('tr-TR')} ₺. TKGM: ${listing.tkgmStatus}, tapu: ${listing.tapuType}, imar: ${listing.imarType}.`);
    ai.setThinking(true);
    setTimeout(() => {
      ai.setThinking(false);
      const verdict = listing.aiRiskScore < 30 ? 'Genel olarak düşük risk' : listing.aiRiskScore < 60 ? 'Orta risk, dikkatli ilerlemek gerek' : 'Yüksek risk, detaylı inceleme önerilir';
      const valDelta = ((listing.price - listing.aiValuation.mid) / listing.aiValuation.mid * 100);
      const priceMsg = Math.abs(valDelta) < 5 ? 'AI değerleme bandında' : valDelta > 0 ? `bant üstünde (+%${valDelta.toFixed(1)})` : `bant altında (%${valDelta.toFixed(1)})`;
      ai.appendAssistant(`Bu ilanı incelemem:\n\n• Konum: ${listing.city}/${listing.district} — ${listing.aiValuation.confidence > 0.8 ? 'değerleme güveni yüksek' : 'değerleme güveni orta'}\n• Fiyat: ${priceMsg}\n• Risk skoru: ${listing.aiRiskScore}/100 — ${verdict}\n• Tapu: ${listing.tapuType === 'mustakil' ? 'müstakil ✓' : listing.tapuType}\n• TKGM: ${listing.tkgmStatus}${listing.tkgmStatus === 'temiz' ? ' ✓' : ' — kontrol önerilir'}\n• Öne çıkan: ${listing.aiTags.slice(0, 3).join(', ')}\n\nNet önerim: ${listing.aiRiskScore < 30 && listing.tkgmStatus === 'temiz' ? 'görme randevusu + ortalama %5-8 pazarlık.' : 'önce tapu belgelerini iste, görme randevusunu sonra al.'}`);
    }, 1200);
    ui.setAssistant(true);
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-fg-3 hover:text-fg-1 text-sm"><ArrowLeft size={16} /> Geri</button>
        <Button size="sm" variant="outline" iconLeft={<Sparkle size={14} weight="fill" />} onClick={askAi}>AI'a bu ilanı sor</Button>
      </div>

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

          {/* Lokasyon (mock) — komşu ilanlar dahil */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t('listing.location')}</h3>
              <span className="text-xs text-fg-3">Lat: {listing.lat.toFixed(4)} · Lng: {listing.lng.toFixed(4)}</span>
            </div>
            <LandMap
              points={[
                { id: listing.id, lat: listing.lat, lng: listing.lng, title: '★ ' + listing.title, href: `#/listings/${listing.id}` },
                ...(() => {
                  // 5 yakın komşu ilanlar
                  const others = data.listings.filter((l) => l.id !== listing.id && l.status === 'live' && l.city === listing.city);
                  return others
                    .map((l) => ({ ...l, dist: Math.hypot(l.lat - listing.lat, l.lng - listing.lng) }))
                    .sort((a, b) => a.dist - b.dist)
                    .slice(0, 5)
                    .map((l) => ({ id: l.id, lat: l.lat, lng: l.lng, title: l.title, href: `#/listings/${l.id}` }));
                })()
              ]}
              height={360}
              zoom={11}
              center={[listing.lat, listing.lng]}
              className="overflow-hidden rounded-r-2 border border-slate-200 dark:border-slate-800"
            />
            <p className="text-xs text-fg-3 mt-2">★ Bu ilan · diğerleri bölgedeki en yakın 5 ilan</p>
          </Card>

          {/* Fiyat trendi */}
          <PriceTrendCard listingId={listing.id} basePrice={listing.price} />

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
                <Button iconLeft={<ChatCircle size={16} />} onClick={openOrCreateThread}>{t('listing.actionMessage')}</Button>
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
                {sellerOther.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Bu satıcının diğer ilanları</div>
                    <ul className="space-y-1.5">
                      {sellerOther.map((o) => (
                        <li key={o.id}>
                          <Link to={`/listings/${o.id}`} className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-r-2 p-1 -mx-1">
                            <img src={o.images[0]?.thumbUrl} alt="" className="w-10 h-10 rounded-r-1 object-cover bg-slate-200" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate">{o.title}</div>
                              <div className="text-xs text-fg-3 truncate">{o.city} · {formatPrice(o.price, locale)}</div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

      {/* Share modal */}
      {shareModal && (
        <Modal title="İlanı paylaş" onClose={() => setShareModal(false)}>
          <p className="text-sm text-fg-3 mb-3">İlan bağlantısını paylaşın:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <Button variant="outline" onClick={() => shareOn('whatsapp')}>WhatsApp</Button>
            <Button variant="outline" onClick={() => shareOn('x')}>X (Twitter)</Button>
            <Button variant="outline" onClick={() => shareOn('mail')}>E-posta</Button>
            <Button variant="outline" onClick={() => shareOn('linkedin')}>LinkedIn</Button>
          </div>
          <div className="flex gap-2">
            <input
              readOnly
              value={`${window.location.origin}${window.location.pathname}#/listings/${listing.id}`}
              className="flex-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
            />
            <Button onClick={copyLink}>{shareCopied ? 'Kopyalandı ✓' : 'Kopyala'}</Button>
          </div>
          {(navigator as Navigator & { share?: unknown }).share && (
            <Button block variant="ghost" className="mt-2" onClick={nativeShare}>Cihaz paylaşımı</Button>
          )}
        </Modal>
      )}

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
          <ViewingQuickSlots value={viewingDate} onChange={setViewingDate} />
          <input type="datetime-local" value={viewingDate} onChange={(e) => setViewingDate(e.target.value)} className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base min-h-[44px] mt-3" />
          <div className="flex gap-2 mt-3">
            <Button variant="outline" block onClick={() => setViewingModal(false)}>{t('actions.cancel')}</Button>
            <Button block disabled={!viewingDate} onClick={submitViewing}>Randevu öner</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ViewingQuickSlots({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now = new Date();
  function setHr(d: Date, h: number) { const r = new Date(d); r.setHours(h, 0, 0, 0); return r; }
  const tom = new Date(now); tom.setDate(tom.getDate() + 1);
  const sat = new Date(now); sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7 || 7));
  const sun = new Date(now); sun.setDate(sun.getDate() + ((0 - sun.getDay() + 7) % 7 || 7));
  const slots = [
    { label: 'Bugün 17:00', date: setHr(now, 17) },
    { label: 'Yarın 11:00', date: setHr(tom, 11) },
    { label: 'Yarın 15:00', date: setHr(tom, 15) },
    { label: 'Cumartesi 11:00', date: setHr(sat, 11) },
    { label: 'Pazar 13:00', date: setHr(sun, 13) }
  ];
  function toLocal(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {slots.map((s) => {
        const v = toLocal(s.date);
        const on = value === v;
        return (
          <button key={s.label} type="button" onClick={() => onChange(v)} className={`rounded-full px-3 py-1 text-xs border transition-colors ${on ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{s.label}</button>
        );
      })}
    </div>
  );
}

function PriceTrendCard({ listingId, basePrice }: { listingId: string; basePrice: number }) {
  const points = (() => {
    const months = ['12 ay önce','11','10','9','8','7','6','5','4','3','2','1 ay önce'];
    let p = basePrice * 0.78;
    // deterministic per listing
    const seed = parseInt(listingId.replace(/[^0-9]/g, ''), 10) || 1;
    return months.map((m, i) => {
      const noise = ((seed * (i + 1)) % 100) / 100 - 0.5;
      p = p * (1 + 0.025 + noise * 0.02);
      return { month: m, price: Math.round(p / 10000) * 10000 };
    });
  })();
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium inline-flex items-center gap-2"><Sparkle size={16} weight="fill" className="text-brand-500" /> Bölge fiyat trendi (12 ay)</h3>
        <span className="text-xs text-fg-3">+%23 (yıllık)</span>
      </div>
      <div className="h-44">
        <PriceTrendChart data={points} />
      </div>
      <p className="text-xs text-fg-3 mt-2">AI değerleme: bölgede ortalama ₺/m² geçen yıl %23 arttı. Önümüzdeki 12 ay tahmin: +%12 (orta güven).</p>
    </Card>
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
