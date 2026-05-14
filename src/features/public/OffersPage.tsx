import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase, Check, X as XIcon } from '@phosphor-icons/react';
import { formatPrice, formatRelTime } from '@/lib/utils/format';
import type { Offer } from '@/types/domain';

export default function OffersPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const mine = useMemo(() => data.offers.filter((o) => o.buyerId === auth.currentUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [data.offers, auth.currentUserId]);

  function withdraw(o: Offer) {
    data.upsertOffer({ ...o, status: 'withdrawn', updatedAt: new Date().toISOString(), history: [...o.history, { at: new Date().toISOString(), by: o.buyerId, amount: o.amount, status: 'withdrawn', note: 'Geri çekildi' }] });
  }

  const columns: Column<Offer>[] = [
    {
      key: 'listingId', header: 'İlan',
      cell: (r) => {
        const l = data.listings.find((x) => x.id === r.listingId);
        return l ? <Link to={`/listings/${l.id}`} className="font-medium hover:text-brand-600 text-sm">{l.title}</Link> : '—';
      }
    },
    { key: 'amount', header: 'Teklif', sortable: true, cell: (r) => <span className="font-medium">{formatPrice(r.amount, locale)}</span> },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: 'validUntil', header: 'Geçerlilik', hideOn: 'md', cell: (r) => <span className="text-xs text-fg-3">{formatRelTime(r.validUntil, locale)}</span> },
    {
      key: 'actions', header: 'Aksiyon', align: 'right',
      cell: (r) => (
        <div className="inline-flex gap-1">
          {r.status === 'pending' && <Button size="xs" variant="outline" iconLeft={<XIcon size={12} />} onClick={() => withdraw(r)}>Geri çek</Button>}
        </div>
      )
    }
  ];

  if (mine.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState icon={<Briefcase size={48} weight="duotone" />} title={t('empty.offers')} description="İlan detayında 'Teklif yap' butonuyla teklif gönderebilirsiniz." aiHint="Beğendiğiniz ilanlara AI önerisiyle teklif verir misiniz?" cta={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>} />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title={t('nav.offers')} description={`${mine.length} teklif`} />
      <DataTable
        data={mine}
        columns={columns}
        rowKey={(r) => r.id}
        searchable
        searchPlaceholder="Teklif veya ilan ara"
        aiSuggestions={[
          { label: 'Süresi dolan teklifleri yenile', onRun: () => alert('AI: 0 teklif yenilemek üzere bekliyor.') }
        ]}
      />
    </div>
  );
}
