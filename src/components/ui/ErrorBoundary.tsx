import React from 'react';
import { Warning, ArrowClockwise, Sparkle } from '@phosphor-icons/react';
import { Button } from './Button';

interface State { hasError: boolean; error?: Error; }

const RELOAD_KEY = 'landx:reload-attempt';

function isChunkError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? `${err.message} ${err.name}` : String(err);
  return /(Loading chunk|ChunkLoadError|Importing a module script failed|Failed to fetch dynamically imported module|Failed to import)/i.test(msg);
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (isChunkError(error)) {
      // Auto-recover once per session: stale asset hashes after deploy.
      const tried = sessionStorage.getItem(RELOAD_KEY);
      if (!tried) {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        // Hard reload to fetch fresh index.html + chunks
        window.location.reload();
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.error('[LandX] React error:', error, info);
  }

  reset = () => {
    sessionStorage.removeItem(RELOAD_KEY);
    this.setState({ hasError: false, error: undefined });
    window.location.hash = '#/';
  };

  hardReload = () => {
    sessionStorage.removeItem(RELOAD_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const chunk = isChunkError(this.state.error);
      return (
        <div className="min-h-[60dvh] grid place-items-center p-6">
          <div className="max-w-md text-center">
            <Warning size={48} weight="duotone" className="mx-auto text-rose-500" />
            <h1 className="mt-3 text-2xl font-semibold">{chunk ? 'Yeni sürüm yüklendi' : 'Bir şeyler ters gitti'}</h1>
            <p className="mt-1 text-fg-3 text-sm">
              {chunk
                ? 'Bu sayfa açıkken yeni bir sürüm yayınlanmış. Sayfayı yenileyin, son sürümü yükleyelim.'
                : 'Bu ekranda beklenmedik bir hata oluştu. Sayfayı yenileyin veya AI asistana sorun.'}
            </p>
            {this.state.error && (
              <pre className="mt-3 text-xs text-left bg-slate-100 dark:bg-slate-800 p-3 rounded-r-2 max-h-32 overflow-auto">{this.state.error.message}</pre>
            )}
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={this.hardReload} iconLeft={<ArrowClockwise size={16} />}>Sayfayı yenile</Button>
              <Button variant="outline" onClick={this.reset}>Anasayfaya dön</Button>
              {!chunk && (
                <Button variant="ghost" iconLeft={<Sparkle size={16} weight="fill" />} onClick={() => alert('AI: Hata bildirildi (mock).')}>AI'a bildir</Button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
