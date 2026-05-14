import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Stat } from '@/components/ui/Stat';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ListingCard } from '@/components/data/ListingCard';
import { MapPin, Briefcase, Eye, ChartLineUp, Sparkle, ArrowRight, ChatCircle, Calendar, Plus } from '@phosphor-icons/react';

export default function SellerHomePage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();

  const mine = useMemo(() => data.listings.filter((l) => l.ownerId === auth.currentUserId), [data.listings, auth.currentUserId]);
  const drafts = mine.filter((l) => l.status === 'draft').length;
  const live = mine.filter((l) => l.status === 'live').length;
  const totalViews = mine.reduce((s, l) => s + l.views, 0);
  const offers = data.offers.filter((o) => o.sellerId === auth.currentUserId);

  return (
    <div>
      <SectionHeading
        title="Satıcı Paneli"
        description="İlanlarınızın özeti ve hızlı eylemler"
        actions={<Link to="/seller/listings/new"><Button>+ Yeni İlan</Button></Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Yayında" value={live} icon={<MapPin size={20} weight="fill" />} />
        <Stat label="Taslak" value={drafts} icon={<MapPin size={20} weight="duotone" />} />
        <Stat label="Görüntülenme" value={totalViews} icon={<Eye size={20} weight="fill" />} />
        <Stat label="Bekleyen teklif" value={offers.filter((o) => o.status === 'pending').length} icon={<Briefcase size={20} weight="fill" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
          <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI önerileri</span></div>
          <ul className="text-sm text-fg-2 space-y-1">
            {drafts > 0 && <li>• {drafts} taslak ilanınız var. AI ile başlık ve açıklamayı zenginleştirelim mi?</li>}
            {offers.filter((o) => o.status === 'pending').length > 0 && <li>• {offers.filter((o) => o.status === 'pending').length} bekleyen teklif var. Liste fiyatınızın %90 üzerindekilere otomatik kabul kuralı önerebilirim.</li>}
            <li>• Yayındaki ilanlarınızın ortalama görüntülenmesi: {Math.round(totalViews / Math.max(1, live))}. Hedef: 800+.</li>
            {mine.some((l) => l.images.length < 3) && <li>• {mine.filter((l) => l.images.length < 3).length} ilanın görsel sayısı 3'ün altında. Fotoğraf ekleyerek görüntülenmeyi +%40 artırın.</li>}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="font-medium">Son etkileşimler</span></div>
          <ul className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
            {offers.slice(0, 4).map((o) => {
              const listing = mine.find((l) => l.id === o.listingId);
              return (
                <li key={o.id} className="py-1.5 flex items-center gap-2">
                  <span className="text-xs text-fg-3 shrink-0">teklif</span>
                  <span className="flex-1 truncate text-fg-2">{listing?.title || o.listingId}</span>
                  <span className="text-xs font-medium">{o.amount.toLocaleString('tr-TR')} ₺</span>
                </li>
              );
            })}
            {offers.length === 0 && <li className="py-2 text-xs text-fg-3">Henüz teklif yok.</li>}
          </ul>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {[
          { to: '/seller/listings', label: 'İlanlarım', desc: `${mine.length} kayıt`, Icon: MapPin },
          { to: '/seller/listings/new', label: 'Yeni İlan', desc: '6 adımlı sihirbaz', Icon: Plus },
          { to: '/seller/offers', label: 'Teklifler', desc: `${offers.filter((o) => o.status === 'pending').length} bekliyor`, Icon: Briefcase },
          { to: '/seller/messages', label: 'Mesajlar', desc: 'Alıcı sohbetleri', Icon: ChatCircle },
          { to: '/seller/performance', label: 'Performans', desc: 'KPI + grafik', Icon: ChartLineUp },
          { to: '/account/viewings', label: 'Randevular', desc: 'Görme talepleri', Icon: Calendar }
        ].map((it) => (
          <Link key={it.to} to={it.to}>
            <Card interactive className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-r-2 bg-brand-50 dark:bg-brand-900/30 grid place-items-center text-brand-600"><it.Icon size={20} weight="duotone" /></span>
              <div className="flex-1">
                <div className="font-medium">{it.label}</div>
                <div className="text-xs text-fg-3">{it.desc}</div>
              </div>
              <ArrowRight size={16} className="text-fg-3" />
            </Card>
          </Link>
        ))}
      </div>

      <SectionHeading title="Son ilanlarınız" level={3} actions={<Link className="text-sm text-brand-700 dark:text-brand-300 inline-flex items-center gap-1 hover:underline" to="/seller/listings">Tümü <ArrowRight size={14} /></Link>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mine.slice(0, 8).map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  );
}
