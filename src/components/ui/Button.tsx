import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cls } from '@/lib/utils/cls';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-400',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  ghost:     'bg-transparent text-fg-2 hover:bg-slate-100 dark:hover:bg-slate-800',
  outline:   'bg-transparent border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800',
  danger:    'bg-rose-600 text-white hover:bg-rose-700',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700'
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs gap-1 rounded-r-2 min-h-[28px]',
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-r-2 min-h-[36px]',
  md: 'px-4 py-2 text-sm gap-2 rounded-r-2 min-h-[40px]',
  lg: 'px-5 py-2.5 text-base gap-2 rounded-r-3 min-h-[48px]'
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, iconLeft, iconRight, block, className, children, disabled, ...rest }, ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cls(
        'inline-flex items-center justify-center font-medium transition-colors select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        block && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? <Spinner size={16} className="text-current" /> : iconLeft}
      {children && <span>{children}</span>}
      {iconRight}
    </button>
  );
});
