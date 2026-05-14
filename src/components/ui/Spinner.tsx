import { cls } from '@/lib/utils/cls';

interface Props {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: Props) {
  return (
    <svg
      className={cls('animate-spin text-brand-500', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="Yükleniyor"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
