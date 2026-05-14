import { ReactNode } from 'react';
import { cls } from '@/lib/utils/cls';

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export function SectionHeading({ title, description, actions, level = 2, className }: Props) {
  const T = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
  return (
    <div className={cls('flex flex-wrap items-end justify-between gap-3 mb-4', className)}>
      <div className="min-w-0">
        <T className={cls('font-semibold tracking-tight', level === 1 ? 'text-2xl lg:text-3xl' : level === 2 ? 'text-xl lg:text-2xl' : 'text-lg')}>{title}</T>
        {description && <p className="text-sm text-fg-3 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
