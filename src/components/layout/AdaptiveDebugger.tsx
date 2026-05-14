// Adaptive viewport indicator — geliştirme/QA için. localStorage('landx:adaptive-debug') == '1' veya ?adaptive=1 ile aktif olur.
import { useEffect, useState } from 'react';
import { useAdaptive } from '@/lib/utils/useAdaptive';
import { DeviceMobile, DeviceTablet, Desktop, Television, X, Sliders } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

const STORAGE_KEY = 'landx:adaptive-debug';

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (new URLSearchParams(window.location.search).get('adaptive') === '1') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch { return false; }
}

export function AdaptiveDebugger() {
  const a = useAdaptive();
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { setShow(shouldShow()); }, []);

  if (!show) return null;

  const DeviceIcon = a.cls === 'tv' ? Television
    : a.isDesktop ? Desktop
    : a.isTablet || a.cls === 'small-tablet' || a.cls === 'tablet' ? DeviceTablet
    : DeviceMobile;

  return (
    <div className={cls(
      'fixed bottom-3 left-3 z-[60] rounded-r-3 border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-lg text-xs',
      expanded ? 'p-3 min-w-[240px]' : 'px-2.5 py-1.5'
    )}>
      <div className="flex items-center gap-2">
        <DeviceIcon size={14} weight="fill" className="text-brand-500" />
        <code className="font-mono tabular-nums">{a.width}×{a.height}</code>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white uppercase">{a.size}</span>
        <span className="text-[10px] text-fg-3">{a.orientation === 'portrait' ? '⊥' : '⊢'}</span>
        <button onClick={() => setExpanded((v) => !v)} className="text-fg-3 hover:text-fg-1" aria-label="Detay">
          <Sliders size={12} />
        </button>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setShow(false); }} className="text-fg-3 hover:text-fg-1" aria-label="Kapat">
          <X size={12} />
        </button>
      </div>
      {expanded && (
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
          <dt className="text-fg-3">Sınıf</dt><dd className="font-medium">{a.cls}</dd>
          <dt className="text-fg-3">Dokunmatik</dt><dd>{a.isTouch ? 'evet' : 'hayır'}</dd>
          <dt className="text-fg-3">Mobile</dt><dd>{a.isMobile ? '✓' : '—'}</dd>
          <dt className="text-fg-3">Tablet</dt><dd>{a.isTablet ? '✓' : '—'}</dd>
          <dt className="text-fg-3">Desktop</dt><dd>{a.isDesktop ? '✓' : '—'}</dd>
          <dt className="text-fg-3">≥ lg (768)</dt><dd>{a.isAtLeast('lg') ? '✓' : '—'}</dd>
          <dt className="text-fg-3">≥ xl (1024)</dt><dd>{a.isAtLeast('xl') ? '✓' : '—'}</dd>
          <dt className="text-fg-3">≥ 2xl (1366)</dt><dd>{a.isAtLeast('2xl') ? '✓' : '—'}</dd>
        </dl>
      )}
    </div>
  );
}
