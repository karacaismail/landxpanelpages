import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PanelLayout } from '@/components/layout/PanelLayout';
import { RouteGate } from '@/components/layout/RouteGate';
import { PageLoading } from '@/components/ui/PageLoading';

const HomePage           = lazy(() => import('@/features/public/HomePage'));
const DiscoverPage       = lazy(() => import('@/features/public/DiscoverPage'));
const ListingDetailPage  = lazy(() => import('@/features/public/ListingDetailPage'));
const ComparePage        = lazy(() => import('@/features/public/ComparePage'));
const AuthPage           = lazy(() => import('@/features/auth/AuthPage'));
const RegisterPage       = lazy(() => import('@/features/auth/RegisterPage'));
const SellPage           = lazy(() => import('@/features/public/SellPage'));
const AccountPage        = lazy(() => import('@/features/public/AccountPage'));
const FavoritesPage      = lazy(() => import('@/features/public/FavoritesPage'));
const SavedSearchesPage  = lazy(() => import('@/features/public/SavedSearchesPage'));
const MessagesPage       = lazy(() => import('@/features/public/MessagesPage'));
const OffersPage         = lazy(() => import('@/features/public/OffersPage'));
const ViewingsPage       = lazy(() => import('@/features/public/ViewingsPage'));
const ProfilePage        = lazy(() => import('@/features/public/ProfilePage'));
const NotificationsPage  = lazy(() => import('@/features/public/NotificationsPage'));
const LegalPage          = lazy(() => import('@/features/public/LegalPage'));
const HelpPage           = lazy(() => import('@/features/public/HelpPage'));

// Seller
const SellerHome         = lazy(() => import('@/features/seller/SellerHomePage'));
const MyListingsPage     = lazy(() => import('@/features/seller/MyListingsPage'));
const ListingWizardPage  = lazy(() => import('@/features/seller/ListingWizardPage'));
const SellerOffersPage   = lazy(() => import('@/features/seller/SellerOffersPage'));
const PerformancePage    = lazy(() => import('@/features/seller/PerformancePage'));

// Admin
const AdminHome          = lazy(() => import('@/features/admin/AdminHomePage'));
const ApprovalsPage      = lazy(() => import('@/features/admin/ApprovalsPage'));
const UsersPage          = lazy(() => import('@/features/admin/UsersPage'));
const RolesPage          = lazy(() => import('@/features/admin/RolesPage'));
const RulesPage          = lazy(() => import('@/features/admin/RulesPage'));
const AuditPage          = lazy(() => import('@/features/admin/AuditPage'));
const ReportsPage        = lazy(() => import('@/features/admin/ReportsPage'));
const AdminTkgmPage      = lazy(() => import('@/features/admin/TkgmPage'));
const ModulesPage        = lazy(() => import('@/features/admin/ModulesPage'));
const AdminNotifsPage    = lazy(() => import('@/features/admin/NotificationsAdminPage'));
const SettingsPage       = lazy(() => import('@/features/admin/SettingsPage'));
const CompliancePage     = lazy(() => import('@/features/admin/CompliancePage'));
const PluginsPage        = lazy(() => import('@/features/admin/PluginsPage'));

const NotFoundPage       = lazy(() => import('@/features/public/NotFoundPage'));

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
          { path: 'searches', element: withSuspense(<SavedSearchesPage />) },
          { path: 'messages', element: withSuspense(<MessagesPage />) },
          { path: 'offers', element: withSuspense(<OffersPage />) },
          { path: 'viewings', element: withSuspense(<ViewingsPage />) },
          { path: 'profile', element: withSuspense(<ProfilePage />) }
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
      { path: 'notifications-templates', element: withSuspense(<AdminNotifsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: 'settings/:section', element: withSuspense(<SettingsPage />) },
      { path: 'compliance', element: withSuspense(<CompliancePage />) },
      { path: 'plugins', element: withSuspense(<PluginsPage />) },
      { path: 'plugins/:section', element: withSuspense(<PluginsPage />) }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);
