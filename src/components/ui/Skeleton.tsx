import { cls } from '@/lib/utils/cls';

interface Props {
  className?: string;
  rounded?: 'r-1' | 'r-2' | 'r-3' | 'r-4' | 'full';
}

export function Skeleton({ className, rounded = 'r-2' }: Props) {
  return (
    <div
      aria-hidden
      className={cls(
        'animate-pulse bg-slate-200 dark:bg-slate-800',
        rounded === 'full' ? 'rounded-full' : `rounded-${rounded}`,
        className
      )}
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="rounded-r-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <Skeleton className="w-full aspect-[4/3]" rounded="r-1" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
