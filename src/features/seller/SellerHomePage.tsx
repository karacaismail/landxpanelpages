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
import { MapPin, Briefcase, Eye, ChartLineUp, Sparkle, ArrowRight } from '@phosphor-icons/react';

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

      <Card className="mb-6 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI önerileri</span></div>
        <ul className="text-sm text-fg-2 space-y-1">
          {drafts > 0 && <li>• {drafts} taslak ilanınız var. AI ile başlık ve açıklamayı zenginleştirelim mi?</li>}
          {offers.filter((o) => o.status === 'pending').length > 0 && <li>• {offers.filter((o) => o.status === 'pending').length} bekleyen teklif var. Liste fiyatınızın %90 üzerindekilere otomatik kabul kuralı önerebilirim.</li>}
          <li>• Yayındaki ilanlarınızın ortalama görüntülenmesi: {Math.round(totalViews / Math.max(1, live))}. Hedef: 800+.</li>
        </ul>
      </Card>

      <SectionHeading title="Son ilanlarınız" level={3} actions={<Link className="text-sm text-brand-700 dark:text-brand-300 inline-flex items-center gap-1 hover:underline" to="/seller/listings">Tümü <ArrowRight size={14} /></Link>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mine.slice(0, 8).map((l) => <ListingCard key={l.id} listing={l} />)}
      </div>
    </div>
  );
}
