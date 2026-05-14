import { Sparkle } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function AiBadge({ children, className }: Props) {
  return (
    <span className={cls(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      'bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-900/40 dark:to-accent-900/40',
      'text-brand-700 dark:text-brand-200 border border-brand-200/60 dark:border-brand-700/40',
      className
    )}>
      <Sparkle size={12} weight="fill" />
      {children}
    </span>
  );
}
