import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import type { ComponentType } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PanelLayout } from '@/components/layout/PanelLayout';
import { RouteGate } from '@/components/layout/RouteGate';
import { PageLoading } from '@/components/ui/PageLoading';

// Retry-aware lazy: chunk hash mismatch (yeni deploy sonrası) yaşandığında 1x bekleyip yeniden dener, hâlâ başarısızsa sayfayı yeniler.
function lazyRetry<T extends ComponentType<unknown>>(importer: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (err) {
      const msg = err instanceof Error ? err.message + ' ' + err.name : String(err);
      if (/Loading chunk|ChunkLoadError|module script failed|dynamically imported module|Failed to import/i.test(msg)) {
        await new Promise((r) => setTimeout(r, 300));
        try { return await importer(); } catch (err2) {
          if (!sessionStorage.getItem('landx:reload-attempt')) {
            sessionStorage.setItem('landx:reload-attempt', String(Date.now()));
            window.location.reload();
          }
          throw err2;
        }
      }
      throw err;
    }
  });
}

const lazy_ = lazyRetry;

const HomePage           = lazy_(() => import('@/features/public/HomePage'));
const DiscoverPage       = lazy_(() => import('@/features/public/DiscoverPage'));
const ListingDetailPage  = lazy_(() => import('@/features/public/ListingDetailPage'));
const ComparePage        = lazy_(() => import('@/features/public/ComparePage'));
const AuthPage           = lazy_(() => import('@/features/auth/AuthPage'));
const RegisterPage       = lazy_(() => import('@/features/auth/RegisterPage'));
const SellPage           = lazy_(() => import('@/features/public/SellPage'));
const AccountPage        = lazy_(() => import('@/features/public/AccountPage'));
const FavoritesPage      = lazy_(() => import('@/features/public/FavoritesPage'));
const FavoriteTrendsPage = lazy_(() => import('@/features/public/FavoriteTrendsPage'));
const SavedSearchesPage  = lazy_(() => import('@/features/public/SavedSearchesPage'));
const MessagesPage       = lazy_(() => import('@/features/public/MessagesPage'));
const OffersPage         = lazy_(() => import('@/features/public/OffersPage'));
const ViewingsPage       = lazy_(() => import('@/features/public/ViewingsPage'));
const ProfilePage        = lazy_(() => import('@/features/public/ProfilePage'));
const AiHistoryPage      = lazy_(() => import('@/features/public/AiHistoryPage'));
const NotificationsPage  = lazy_(() => import('@/features/public/NotificationsPage'));
const LegalPage          = lazy_(() => import('@/features/public/LegalPage'));
const HelpPage           = lazy_(() => import('@/features/public/HelpPage'));

// Seller
const SellerHome         = lazy_(() => import('@/features/seller/SellerHomePage'));
const MyListingsPage     = lazy_(() => import('@/features/seller/MyListingsPage'));
const ListingWizardPage  = lazy_(() => import('@/features/seller/ListingWizardPage'));
const SellerOffersPage   = lazy_(() => import('@/features/seller/SellerOffersPage'));
const PerformancePage    = lazy_(() => import('@/features/seller/PerformancePage'));

// Admin
const AdminHome          = lazy_(() => import('@/features/admin/AdminHomePage'));
const ApprovalsPage      = lazy_(() => import('@/features/admin/ApprovalsPage'));
const UsersPage          = lazy_(() => import('@/features/admin/UsersPage'));
const RolesPage          = lazy_(() => import('@/features/admin/RolesPage'));
const RulesPage          = lazy_(() => import('@/features/admin/RulesPage'));
const AuditPage          = lazy_(() => import('@/features/admin/AuditPage'));
const ReportsPage        = lazy_(() => import('@/features/admin/ReportsPage'));
const AdminTkgmPage      = lazy_(() => import('@/features/admin/TkgmPage'));
const ModulesPage        = lazy_(() => import('@/features/admin/ModulesPage'));
const ModuleDetailPage   = lazy_(() => import('@/features/admin/ModuleDetailPage'));
const AgentTasksPage     = lazy_(() => import('@/features/admin/AgentTasksPage'));
const TenantPage         = lazy_(() => import('@/features/admin/TenantPage'));
const AdminNotifsPage    = lazy_(() => import('@/features/admin/NotificationsAdminPage'));
const SettingsPage       = lazy_(() => import('@/features/admin/SettingsPage'));
const CompliancePage     = lazy_(() => import('@/features/admin/CompliancePage'));
const PluginsPage        = lazy_(() => import('@/features/admin/PluginsPage'));
const AiOpsPage          = lazy_(() => import('@/features/admin/AiOpsPage'));
const AgentRegistryPage  = lazy_(() => import('@/features/admin/AgentRegistryPage'));
const ApiExplorerPage    = lazy_(() => import('@/features/admin/ApiExplorerPage'));

const NotFoundPage       = lazy_(() => import('@/features/public/NotFoundPage'));

function withSuspense(node: JSX.Element) {
  return <Suspense fallback={<PageLoading />}>{node}</Suspense>;
}

export const router = createHashRouter([
  // Public
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/listings', element: withSuspense(<DiscoverPage />) },
      { path: '/listings/:id', element: withSuspense(<ListingDetailPage />) },
      { path: '/compare', element: withSuspense(<ComparePage />) },
      { path: '/auth', element: withSuspense(<AuthPage />) },
      { path: '/auth/register', element: withSuspense(<RegisterPage />) },
      { path: '/sell', element: <RouteGate>{withSuspense(<SellPage />)}</RouteGate> },
      { path: '/help', element: withSuspense(<HelpPage />) },
      { path: '/legal/:slug', element: withSuspense(<LegalPage />) },
      {
        path: '/account', element: <RouteGate>{<Outlet />}</RouteGate>,
        children: [
          { index: true, element: withSuspense(<AccountPage />) },
          { path: 'favorites', element: withSuspense(<FavoritesPage />) },
          { path: 'favorites/trends', element: withSuspense(<FavoriteTrendsPage />) },
          { path: 'searches', element: withSuspense(<SavedSearchesPage />) },
          { path: 'messages', element: withSuspense(<MessagesPage />) },
          { path: 'offers', element: withSuspense(<OffersPage />) },
          { path: 'viewings', element: withSuspense(<ViewingsPage />) },
          { path: 'profile', element: withSuspense(<ProfilePage />) },
          { path: 'ai-history', element: withSuspense(<AiHistoryPage />) }
        ]
      },
      { path: '/notifications', element: <RouteGate>{withSuspense(<NotificationsPage />)}</RouteGate> }
    ]
  },
  // Seller panel
  {
    path: '/seller',
    element: <RouteGate role="seller"><PanelLayout variant="seller" /></RouteGate>,
    children: [
      { index: true, element: withSuspense(<SellerHome />) },
      { path: 'listings', element: withSuspense(<MyListingsPage />) },
      { path: 'listings/new', element: withSuspense(<ListingWizardPage />) },
      { path: 'listings/:id/edit', element: withSuspense(<ListingWizardPage />) },
      { path: 'offers', element: withSuspense(<SellerOffersPage />) },
      { path: 'performance', element: withSuspense(<PerformancePage />) },
      { path: 'messages', element: withSuspense(<MessagesPage />) }
    ]
  },
  // Admin panel
  {
    path: '/admin',
    element: <RouteGate role="admin"><PanelLayout variant="admin" /></RouteGate>,
    children: [
      { index: true, element: withSuspense(<AdminHome />) },
      { path: 'approvals', element: withSuspense(<ApprovalsPage />) },
      { path: 'users', element: withSuspense(<UsersPage />) },
      { path: 'roles', element: withSuspense(<RolesPage />) },
      { path: 'rules', element: withSuspense(<RulesPage />) },
      { path: 'audit', element: withSuspense(<AuditPage />) },
      { path: 'reports', element: withSuspense(<ReportsPage />) },
      { path: 'reports/:section', element: withSuspense(<ReportsPage />) },
      { path: 'tkgm', element: withSuspense(<AdminTkgmPage />) },
      { path: 'modules', element: withSuspense(<ModulesPage />) },
      { path: 'modules/:id', element: withSuspense(<ModuleDetailPage />) },
      { path: 'agent-tasks', element: withSuspense(<AgentTasksPage />) },
      { path: 'tenant', element: withSuspense(<TenantPage />) },
      { path: 'notifications-templates', element: withSuspense(<AdminNotifsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: 'settings/:section', element: withSuspense(<SettingsPage />) },
      { path: 'compliance', element: withSuspense(<CompliancePage />) },
      { path: 'plugins', element: withSuspense(<PluginsPage />) },
      { path: 'plugins/:section', element: withSuspense(<PluginsPage />) },
      { path: 'ai-ops', element: withSuspense(<AiOpsPage />) },
      { path: 'ai-ops/:section', element: withSuspense(<AiOpsPage />) },
      { path: 'agent-registry', element: withSuspense(<AgentRegistryPage />) },
      { path: 'agent-registry/:section', element: withSuspense(<AgentRegistryPage />) },
      { path: 'api-explorer', element: withSuspense(<ApiExplorerPage />) }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);
