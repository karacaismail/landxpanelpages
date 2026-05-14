import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Check, X as XIcon } from '@phosphor-icons/react';
import { formatPrice, formatRelTime } from '@/lib/utils/format';
import type { Offer } from '@/types/domain';

export default function SellerOffersPage() {
  const { i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const mine = useMemo(() => data.offers.filter((o) => o.sellerId === auth.currentUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [data.offers, auth.currentUserId]);

  function transition(o: Offer, status: Offer['status']) {
    data.upsertOffer({ ...o, status, updatedAt: new Date().toISOString(), history: [...o.history, { at: new Date().toISOString(), by: o.sellerId, amount: o.amount, status }] });
  }

  const columns: Column<Offer>[] = [
    {
      key: 'listingId', header: 'İlan',
      cell: (r) => {
        const l = data.listings.find((x) => x.id === r.listingId);
        return l ? <Link to={`/listings/${l.id}`} className="font-medium hover:text-brand-600 text-sm">{l.title}</Link> : '—';
      }
    },
    {
      key: 'buyer', header: 'Alıcı', hideOn: 'sm',
      cell: (r) => {
        const u = data.users.find((x) => x.id === r.buyerId);
        return u ? <span className="text-sm">{u.displayName}</span> : '—';
      }
    },
    { key: 'amount', header: 'Tutar', sortable: true, align: 'right', cell: (r) => formatPrice(r.amount, locale) },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: 'createdAt', header: 'Tarih', hideOn: 'md', cell: (r) => <span className="text-xs text-fg-3">{formatRelTime(r.createdAt, locale)}</span> },
    {
      key: 'actions', header: 'Aksiyon', align: 'right',
      cell: (r) => r.status === 'pending' ? (
        <div className="inline-flex gap-1">
          <Button size="xs" variant="success" iconLeft={<Check size={12} />} onClick={() => transition(r, 'accepted')}>Kabul</Button>
          <Button size="xs" variant="danger" iconLeft={<XIcon size={12} />} onClick={() => transition(r, 'rejected')}>Red</Button>
        </div>
      ) : null
    }
  ];

  return (
    <div>
      <SectionHeading title="Gelen Teklifler" description={`${mine.length} teklif`} />
      <DataTable
        data={mine}
        columns={columns}
        rowKey={(r) => r.id}
        searchable
        aiSuggestions={[
          { label: '%90+ teklifleri otomatik kabul önerisi', onRun: () => alert('AI: 3 teklif %90+ kategoride. Kabul önerilir (mock).') },
          { label: 'Karşı teklif şablonu üret', onRun: () => alert('AI: Pazarlık penceresi listenizin %5 altında öneriliyor (mock).') }
        ]}
        bulkActions={[
          { label: 'Toplu reddet', onRun: (rows) => rows.forEach((r) => transition(r, 'rejected')), tone: 'danger' }
        ]}
      />
    </div>
  );
}
