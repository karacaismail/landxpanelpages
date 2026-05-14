import { useTranslation } from 'react-i18next';
import { cls } from '@/lib/utils/cls';
import type { ListingStatus, OfferStatus, ViewingStatus } from '@/types/domain';

type Status = ListingStatus | OfferStatus | ViewingStatus | string;

const COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  review: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  live: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  sold: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  expired: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  countered: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  accepted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  withdrawn: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  requested: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  rescheduled: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  cancelled: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  suspended: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
};

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const { t } = useTranslation();
  const key = String(status);
  const cls1 = COLORS[key] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  return (
    <span
      className={cls(
        'inline-flex items-center rounded-full font-medium tracking-tight',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        cls1
      )}
    >
      {t(`common.${key}`, { defaultValue: key })}
    </span>
  );
}
