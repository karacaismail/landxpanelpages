import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';
import { AssistantDrawer } from './AssistantDrawer';
import { NotificationsDrawer } from './NotificationsDrawer';
import { ScrollToTop } from './ScrollToTop';
import { GlobalShortcuts } from './GlobalShortcuts';

export function PublicLayout() {
  const loc = useLocation();
  return (
    <div className="min-h-dvh flex flex-col bg-bg-2">
      <ScrollToTop />
      <GlobalShortcuts />
      <TopBar variant="public" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Outlet key={loc.pathname} />
      </main>
      <Footer />
      <CommandPalette />
      <AssistantDrawer />
      <NotificationsDrawer />
    </div>
  );
}
