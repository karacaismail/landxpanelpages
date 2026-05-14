import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Button } from '@/components/ui/Button';
import { Plus, PencilSimple, Eye, Sparkle } from '@phosphor-icons/react';
import type { Listing } from '@/types/domain';
import { formatPrice, formatArea } from '@/lib/utils/format';

export default function MyListingsPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const mine = useMemo(() => data.listings.filter((l) => l.ownerId === auth.currentUserId), [data.listings, auth.currentUserId]);

  const columns: Column<Listing>[] = [
    {
      key: 'title', header: 'İlan', sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <img src={r.images[0]?.thumbUrl} alt="" className="w-14 h-12 rounded-r-2 object-cover bg-slate-200" />
          <div>
            <Link to={`/listings/${r.id}`} className="font-medium hover:text-brand-600 line-clamp-1">{r.title}</Link>
            <div className="text-xs text-fg-3">{r.city} · {r.district}</div>
          </div>
        </div>
      )
    },
    { key: 'price', header: 'Fiyat', sortable: true, align: 'right', cell: (r) => formatPrice(r.price, locale) },
    { key: 'area', header: 'Alan', sortable: true, align: 'right', hideOn: 'sm', cell: (r) => formatArea(r.area, locale) },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: 'risk', header: 'Risk', hideOn: 'md', cell: (r) => <RiskBadge size="sm" score={r.aiRiskScore} reasons={r.aiRiskReasons} /> },
    { key: 'views', header: 'Görüntülenme', hideOn: 'md', align: 'right', sortable: true },
    {
      key: 'actions', header: 'Aksiyon', align: 'right',
      cell: (r) => (
        <div className="inline-flex gap-1">
          <Button size="xs" variant="ghost" iconLeft={<Eye size={12} />} onClick={() => navigate(`/listings/${r.id}`)}>Aç</Button>
          <Button size="xs" variant="outline" iconLeft={<PencilSimple size={12} />} onClick={() => navigate(`/seller/listings/${r.id}/edit`)}>Düzenle</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <SectionHeading
        title={t('nav.myListings')}
        description={`${mine.length} ilanınız`}
        actions={<Button iconLeft={<Plus size={16} />} onClick={() => navigate('/seller/listings/new')}>{t('nav.newListing')}</Button>}
      />
      <DataTable
        data={mine}
        columns={columns}
        rowKey={(r) => r.id}
        searchable
        searchPlaceholder="Başlık, şehir, ilçe ile ara"
        storageKey="seller-listings"
        aiSuggestions={[
          { label: 'Taslakları yayına hazırlamamı ister misiniz?', onRun: () => alert('AI: 0 taslak ilanınız bulundu (mock).') },
          { label: 'Fiyat anomalisi olan ilanları bul', onRun: () => alert('AI: 1 ilanda emsalden +%22 sapma tespit edildi (mock).') }
        ]}
        bulkActions={[
          { label: 'Öne çıkar', onRun: (rows) => alert(`${rows.length} ilan öne çıkarılacak (mock).`) },
          { label: 'Yayından kaldır', onRun: (rows) => rows.forEach((r) => data.setListingStatus(r.id, 'draft')) },
          { label: 'Sil', onRun: (rows) => rows.forEach((r) => data.removeListing(r.id)), tone: 'danger' }
        ]}
      />
    </div>
  );
}
