import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';
import { AssistantDrawer } from './AssistantDrawer';
import { NotificationsDrawer } from './NotificationsDrawer';
import { ScrollToTop } from './ScrollToTop';
import { GlobalShortcuts } from './GlobalShortcuts';
import { OnboardingBanner } from '@/components/ui/OnboardingBanner';
import { CompareBar } from './CompareBar';
import { Breadcrumb } from './Breadcrumb';
import { LiveRegions } from './LiveRegions';
import { ToastHost } from './ToastHost';

export function PublicLayout() {
  const loc = useLocation();
  return (
    <div className="min-h-dvh flex flex-col bg-bg-2">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand-500 focus:text-white focus:px-3 focus:py-2 focus:rounded-r-2">Ana içeriğe atla</a>
      <ScrollToTop />
      <GlobalShortcuts />
      <OnboardingBanner />
      <TopBar variant="public" />
      <main id="main" tabIndex={-1} className="flex-1">
        {loc.pathname !== '/' && (
          <div className="max-w-[1600px] mx-auto px-3 lg:px-6 pt-3">
            <Breadcrumb />
          </div>
        )}
        <Outlet key={loc.pathname} />
      </main>
      <Footer />
      <CommandPalette />
      <AssistantDrawer />
      <NotificationsDrawer />
      <CompareBar />
      <LiveRegions />
      <ToastHost />
    </div>
  );
}
