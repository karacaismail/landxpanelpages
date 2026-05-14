import { ReactNode } from 'react';
import { cls } from '@/lib/utils/cls';
import { Card } from './Card';

interface Props {
  label: string;
  value: ReactNode;
  delta?: { value: number; positive?: boolean } | null;
  icon?: ReactNode;
  hint?: string;
  className?: string;
}

export function Stat({ label, value, delta, icon, hint, className }: Props) {
  return (
    <Card padding="md" className={cls('flex items-start gap-3', className)}>
      {icon && <div className="text-brand-500">{icon}</div>}
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-fg-3 font-medium">{label}</div>
        <div className="text-2xl font-semibold text-fg-1 leading-tight mt-1">{value}</div>
        {delta && (
          <div className={cls('text-xs mt-1', (delta.positive ?? delta.value > 0) ? 'text-emerald-600' : 'text-rose-600')}>
            {(delta.positive ?? delta.value > 0) ? '▲' : '▼'} {Math.abs(delta.value).toFixed(1)}%
          </div>
        )}
        {hint && <div className="text-xs text-fg-3 mt-1">{hint}</div>}
      </div>
    </Card>
  );
}
