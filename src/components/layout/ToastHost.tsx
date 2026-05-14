import { useToast, type ToastTone } from '@/store/toast';
import { CheckCircle, Info, Warning, XCircle, Sparkle, X } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

const TONE: Record<ToastTone, { Icon: typeof Info; cls: string }> = {
  info:    { Icon: Info, cls: 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-900/40 dark:text-sky-100 dark:border-sky-800' },
  success: { Icon: CheckCircle, cls: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-800' },
  warning: { Icon: Warning, cls: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800' },
  danger:  { Icon: XCircle, cls: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-900/40 dark:text-rose-100 dark:border-rose-800' },
  ai:      { Icon: Sparkle, cls: 'bg-gradient-to-br from-brand-50 to-accent-50 text-brand-900 border-brand-200 dark:from-brand-900/40 dark:to-accent-900/40 dark:text-brand-100 dark:border-brand-700' }
};

export function ToastHost() {
  const items = useToast((s) => s.items);
  const dismiss = useToast((s) => s.dismiss);
  if (items.length === 0) return null;
  return (
    <div className="fixed z-50 top-16 right-3 sm:top-4 sm:right-4 flex flex-col gap-2 w-[calc(100%-1.5rem)] sm:w-80 pointer-events-none">
      {items.map((t) => {
        const meta = TONE[t.tone];
        return (
          <div key={t.id} role="status" aria-live="polite" className={cls('pointer-events-auto rounded-r-3 border p-3 shadow-lg animate-[slide-in_200ms_ease-out]', meta.cls)}>
            <div className="flex items-start gap-2">
              <meta.Icon size={18} weight={t.tone === 'ai' ? 'fill' : 'duotone'} className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{t.title}</div>
                {t.body && <div className="text-xs opacity-90 mt-0.5">{t.body}</div>}
                {t.action && (
                  <button onClick={() => { t.action!.onRun(); dismiss(t.id); }} className="mt-1 text-xs font-medium underline-offset-2 hover:underline">{t.action.label}</button>
                )}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Kapat" className="p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0">
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
