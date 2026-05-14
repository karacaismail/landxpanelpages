import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  House, MagnifyingGlass, Heart, ChatCircle, User, ListChecks,
  CheckSquare, FlowArrow, ChartBar, MapPin, Briefcase
} from '@phosphor-icons/react';
import { useAuth } from '@/store/auth';
import { cls } from '@/lib/utils/cls';

interface Props { variant?: 'public' | 'seller' | 'admin'; }

export function BottomNav({ variant = 'public' }: Props) {
  const { t } = useTranslation();
  const auth = useAuth();
  const loc = useLocation();

  let items: Array<{ to: string; label: string; Icon: typeof House }> = [];

  if (variant === 'admin') {
    items = [
      { to: '/admin', label: 'overview', Icon: House },
      { to: '/admin/approvals', label: 'approvals', Icon: CheckSquare },
      { to: '/admin/rules', label: 'rules', Icon: FlowArrow },
      { to: '/admin/reports', label: 'reports', Icon: ChartBar }
    ];
  } else if (variant === 'seller') {
    items = [
      { to: '/seller', label: 'overview', Icon: House },
      { to: '/seller/listings', label: 'myListings', Icon: MapPin },
      { to: '/seller/listings/new', label: 'newListing', Icon: ListChecks },
      { to: '/seller/offers', label: 'offers', Icon: Briefcase }
    ];
  } else {
    items = [
      { to: '/', label: 'home', Icon: House },
      { to: '/listings', label: 'discover', Icon: MagnifyingGlass },
      { to: '/account/favorites', label: 'favorites', Icon: Heart },
      { to: '/account/messages', label: 'messages', Icon: ChatCircle },
      { to: auth.role === 'guest' ? '/auth' : '/account', label: auth.role === 'guest' ? 'auth' : 'account', Icon: User }
    ];
  }

  // Hide on listing detail to give the floating action room (mobile UX)
  if (loc.pathname.startsWith('/listings/') && loc.pathname.length > '/listings/'.length) {
    return null;
  }

  return (
    <nav
      aria-label="Alt gezinme"
      className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 safe-bottom"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/' || to === '/admin' || to === '/seller'}
              className={({ isActive }) =>
                cls(
                  'flex flex-col items-center justify-center gap-0.5 py-1.5 xxs:py-2 min-h-[52px] xxs:min-h-[56px] text-[10px] xxs:text-xs',
                  isActive ? 'text-brand-600 dark:text-brand-300' : 'text-fg-3'
                )
              }
            >
              <Icon size={18} className="xxs:!w-5 xxs:!h-5" weight="duotone" />
              <span className="truncate max-w-full px-1">{t(`nav.${label}`)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
