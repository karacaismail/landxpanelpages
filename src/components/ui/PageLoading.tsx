import { Spinner } from '@/components/ui/Spinner';

export function PageLoading() {
  return (
    <div role="status" aria-live="polite" className="min-h-[60dvh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-fg-3">
        <Spinner />
        <span className="text-sm">Yükleniyor…</span>
      </div>
    </div>
  );
}
