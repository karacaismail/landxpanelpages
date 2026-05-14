import React from 'react';
import { Warning, ArrowClockwise, Sparkle } from '@phosphor-icons/react';
import { Button } from './Button';

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // mock-only logger
    // eslint-disable-next-line no-console
    console.error('[LandX] React error:', error, info);
  }

  reset = () => { this.setState({ hasError: false, error: undefined }); window.location.hash = '#/'; };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60dvh] grid place-items-center p-6">
          <div className="max-w-md text-center">
            <Warning size={48} weight="duotone" className="mx-auto text-rose-500" />
            <h1 className="mt-3 text-2xl font-semibold">Bir şeyler ters gitti</h1>
            <p className="mt-1 text-fg-3 text-sm">Bu ekranda beklenmedik bir hata oluştu. Sayfayı yenileyin veya AI asistana sorun.</p>
            {this.state.error && <pre className="mt-3 text-xs text-left bg-slate-100 dark:bg-slate-800 p-3 rounded-r-2 max-h-32 overflow-auto">{this.state.error.message}</pre>}
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={this.reset} iconLeft={<ArrowClockwise size={16} />}>Anasayfaya dön</Button>
              <Button variant="outline" iconLeft={<Sparkle size={16} weight="fill" />} onClick={() => alert('AI: Hata bildirildi (mock).')}>AI'a bildir</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
