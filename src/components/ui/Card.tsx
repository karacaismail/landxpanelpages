import { ReactNode } from 'react';
import { cls } from '@/lib/utils/cls';

interface Props {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export function Card({ children, className, as: As = 'div', padding = 'md', interactive }: Props) {
  return (
    <As
      className={cls(
        'rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
        'shadow-sm',
        interactive && 'transition-all hover:shadow-md hover:-translate-y-0.5 focus-within:shadow-md cursor-pointer',
        padding === 'sm' && 'p-3',
        padding === 'md' && 'p-4',
        padding === 'lg' && 'p-6',
        className
      )}
    >
      {children}
    </As>
  );
}
