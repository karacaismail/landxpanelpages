import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cls } from '@/lib/utils/cls';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, iconLeft, iconRight, block, className, id, ...rest }, ref
) {
  const inputId = id || rest.name || `f-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={cls('flex flex-col gap-1', block && 'w-full')}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-fg-2">{label}</label>}
      <div className="relative">
        {iconLeft && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3">{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={hint || error ? `${inputId}-desc` : undefined}
          className={cls(
            'w-full rounded-r-2 border bg-white dark:bg-slate-900 text-fg-1 min-h-[44px]',
            'px-3 py-2 text-base',
            iconLeft && 'pl-9',
            iconRight && 'pr-9',
            error
              ? 'border-rose-500 focus-visible:ring-rose-500'
              : 'border-slate-300 dark:border-slate-700 focus-visible:ring-brand-500',
            'focus-visible:outline-none focus-visible:ring-2',
            className
          )}
          {...rest}
        />
        {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-3">{iconRight}</span>}
      </div>
      {(hint || error) && (
        <span id={`${inputId}-desc`} className={cls('text-xs', error ? 'text-rose-600' : 'text-fg-3')}>
          {error || hint}
        </span>
      )}
    </div>
  );
});
