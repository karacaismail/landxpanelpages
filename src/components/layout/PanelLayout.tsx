import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { CommandPalette } from './CommandPalette';
import { AssistantDrawer } from './AssistantDrawer';
import { NotificationsDrawer } from './NotificationsDrawer';
import { ScrollToTop } from './ScrollToTop';
import { GlobalShortcuts } from './GlobalShortcuts';
import { useUi } from '@/store/ui';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { cls } from '@/lib/utils/cls';
import { Footer } from './Footer';
import { startDemoRunner } from '@/lib/eca/demo-runner';
import { Breadcrumb } from './Breadcrumb';
import { LiveRegions } from './LiveRegions';
import { ToastHost } from './ToastHost';
import { AdaptiveDebugger } from './AdaptiveDebugger';

interface Props { variant: 'seller' | 'admin'; }

export function PanelLayout({ variant }: Props) {
  const ui = useUi();
  const auth = useAuth();
  const data = useData();

  // ECA demo runner (sadece admin)
  useEffect(() => {
    if (variant !== 'admin' || !auth.currentUserId) return;
    const stop = startDemoRunner(
      () => ({ ecaRules: data.ecaRules, addNotification: data.addNotification, upsertRule: data.upsertRule }),
      auth.currentUserId,
      45_000
    );
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, auth.currentUserId]);
  return (
    <div className="min-h-dvh bg-bg-2">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand-500 focus:text-white focus:px-3 focus:py-2 focus:rounded-r-2">Ana içeriğe atla</a>
      <ScrollToTop />
      <GlobalShortcuts />
      <TopBar variant="panel" onOpenSidebar={() => ui.setMobileNav(true)} />
      <div className="flex">
        <Sidebar variant={variant} />
        <div className={cls('flex-1 min-w-0 transition-[padding]')}>
          <main id="main" tabIndex={-1} className="px-3 lg:px-6 py-4 lg:py-6 max-w-[1600px] mx-auto">
            <Breadcrumb />
            <Outlet />
          </main>
          <Footer compact />
        </div>
      </div>
      <BottomNav variant={variant} />
      <CommandPalette />
      <AssistantDrawer />
      <NotificationsDrawer />
      <LiveRegions />
      <ToastHost />
      <AdaptiveDebugger />
    </div>
  );
}
