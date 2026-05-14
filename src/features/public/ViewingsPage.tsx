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
import { Calendar } from '@phosphor-icons/react';
import { formatDateTime } from '@/lib/utils/format';
import type { Viewing } from '@/types/domain';

export default function ViewingsPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const mine = useMemo(() => data.viewings.filter((v) => v.visitorId === auth.currentUserId).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)), [data.viewings, auth.currentUserId]);

  const columns: Column<Viewing>[] = [
    { key: 'listingId', header: 'İlan', cell: (r) => {
      const l = data.listings.find((x) => x.id === r.listingId);
      return l ? <Link to={`/listings/${l.id}`} className="font-medium hover:text-brand-600 text-sm">{l.title}</Link> : '—';
    } },
    { key: 'scheduledAt', header: 'Tarih', sortable: true, cell: (r) => formatDateTime(r.scheduledAt, locale) },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: 'note', header: 'Not', hideOn: 'sm' }
  ];

  if (mine.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState icon={<Calendar size={48} weight="duotone" />} title={t('empty.viewings')} description="İlan detayında 'Görme randevusu' butonuyla randevu önerebilirsiniz." cta={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>} />
      </div>
    );
  }
  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title={t('nav.viewings')} description={`${mine.length} randevu`} />
      <DataTable data={mine} columns={columns} rowKey={(r) => r.id} searchable />
    </div>
  );
}
