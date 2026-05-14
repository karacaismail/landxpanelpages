import { useState, useRef, useEffect } from 'react';
import { ShieldWarning, ShieldCheck, Shield } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

interface Props {
  score: number;
  reasons?: string[];
  size?: 'sm' | 'md';
}

export function RiskBadge({ score, reasons = [], size = 'md' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const level = score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';
  const palette: Record<typeof level, { bg: string; fg: string; Icon: typeof Shield; label: string }> = {
    low: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', fg: 'text-emerald-800 dark:text-emerald-200', Icon: ShieldCheck, label: 'Düşük risk' },
    medium: { bg: 'bg-amber-100 dark:bg-amber-900/40', fg: 'text-amber-800 dark:text-amber-200', Icon: Shield, label: 'Orta risk' },
    high: { bg: 'bg-rose-100 dark:bg-rose-900/40', fg: 'text-rose-800 dark:text-rose-200', Icon: ShieldWarning, label: 'Yüksek risk' }
  };
  const p = palette[level];

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    if (open) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        className={cls(
          'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
          p.bg, p.fg
        )}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Risk: ${p.label} (${score}/100)`}
      >
        <p.Icon size={size === 'sm' ? 12 : 14} weight="fill" />
        <span>{p.label} · {score}</span>
      </button>
      {open && (
        <div role="dialog" className="absolute z-30 mt-2 left-0 w-72 rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-3">
          <div className="text-sm font-medium mb-2">Neden bu skor?</div>
          {reasons.length === 0 ? (
            <div className="text-sm text-fg-3">Belirgin risk bulunamadı.</div>
          ) : (
            <ul className="text-sm space-y-1.5">
              {reasons.map((r, i) => <li key={i} className="text-fg-2 flex gap-2">• <span>{r}</span></li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
