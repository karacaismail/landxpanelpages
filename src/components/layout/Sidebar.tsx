import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useUi } from '@/store/ui';
import { cls } from '@/lib/utils/cls';
import {
  ChartBar, CheckSquare, Clock, FlowArrow, House, IdentificationCard, MapPin,
  Buildings, Gear, Users, ShieldCheck, BellSimple, PuzzlePiece, X,
  PresentationChart, Stack, Briefcase, FileText
} from '@phosphor-icons/react';

interface Item {
  to: string;
  label: string;
  Icon: typeof House;
  end?: boolean;
}

const SELLER_ITEMS: Item[] = [
  { to: '/seller', label: 'overview', Icon: House, end: true },
  { to: '/seller/listings', label: 'myListings', Icon: MapPin },
  { to: '/seller/listings/new', label: 'newListing', Icon: PuzzlePiece },
  { to: '/seller/offers', label: 'offers', Icon: Briefcase },
  { to: '/seller/messages', label: 'messages', Icon: BellSimple },
  { to: '/seller/performance', label: 'performance', Icon: ChartBar }
];

const ADMIN_ITEMS: Item[] = [
  { to: '/admin', label: 'overview', Icon: House, end: true },
  { to: '/admin/approvals', label: 'approvals', Icon: CheckSquare },
  { to: '/admin/users', label: 'users', Icon: Users },
  { to: '/admin/roles', label: 'roles', Icon: ShieldCheck },
  { to: '/admin/rules', label: 'rules', Icon: FlowArrow },
  { to: '/admin/agent-tasks', label: 'agentTasks', Icon: PuzzlePiece },
  { to: '/admin/audit', label: 'audit', Icon: Clock },
  { to: '/admin/reports', label: 'reports', Icon: PresentationChart },
  { to: '/admin/tkgm', label: 'tkgm', Icon: Buildings },
  { to: '/admin/modules', label: 'modules', Icon: Stack },
  { to: '/admin/notifications-templates', label: 'notifications', Icon: BellSimple },
  { to: '/admin/compliance', label: 'compliance', Icon: FileText },
  { to: '/admin/plugins', label: 'plugins', Icon: PuzzlePiece },
  { to: '/admin/settings', label: 'settings', Icon: Gear }
];

interface Props { variant: 'seller' | 'admin'; }

export function Sidebar({ variant }: Props) {
  const { t } = useTranslation();
  const ui = useUi();
  const items = variant === 'seller' ? SELLER_ITEMS : ADMIN_ITEMS;
  const open = ui.mobileNavOpen;
  const collapsed = ui.sidebarCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          aria-label="Menü kapat"
          onClick={() => ui.setMobileNav(false)}
        />
      )}

      <aside
        className={cls(
          'fixed lg:sticky top-0 lg:top-14 z-40 lg:z-10',
          'h-dvh lg:h-[calc(100dvh-3.5rem)]',
          'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
          'transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'lg:w-16' : 'lg:w-60'
        )}
        aria-label="Birincil gezinme"
      >
        {/* mobile close */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <span className="font-medium">{variant === 'admin' ? t('nav.admin') : t('nav.seller')}</span>
          <button onClick={() => ui.setMobileNav(false)} className="p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Kapat">
            <X size={20} />
          </button>
        </div>
        <nav className="px-2 py-3 space-y-0.5 overflow-y-auto h-[calc(100%-3rem)] lg:h-full">
          {items.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => ui.setMobileNav(false)}
              className={({ isActive }) =>
                cls(
                  'group flex items-center gap-3 px-3 py-2 rounded-r-2 text-sm font-medium',
                  'transition-colors min-h-[44px]',
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-200'
                    : 'text-fg-2 hover:bg-slate-100 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon size={18} weight="duotone" />
              <span className={cls(collapsed ? 'lg:hidden' : '')}>{t(`nav.${label}`)}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => ui.toggleSidebar()}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-2 text-fg-3 hover:text-fg-1"
          aria-label="Sidebar daralt/genişlet"
          title="Cmd+B"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>
    </>
  );
}
