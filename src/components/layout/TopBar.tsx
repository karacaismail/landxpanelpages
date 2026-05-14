import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Globe, List, MagnifyingGlass, MapTrifold, Moon, SignIn, Sun, UserCircle, X, Sparkle } from '@phosphor-icons/react';
import { useUi } from '@/store/ui';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { setLocale } from '@/i18n';
import { cls } from '@/lib/utils/cls';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface Props {
  variant?: 'public' | 'panel';
  onOpenSidebar?: () => void;
}

export function TopBar({ variant = 'public', onOpenSidebar }: Props) {
  const { t, i18n } = useTranslation();
  const ui = useUi();
  const auth = useAuth();
  const navigate = useNavigate();
  const data = useData();
  const [q, setQ] = useState('');
  const unread = data.notifications.filter((n) => n.userId === auth.currentUserId && !n.read).length;

  const me = auth.currentUserId ? data.users.find((u) => u.id === auth.currentUserId) : null;

  function go(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/listings${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setQ('');
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/85 backdrop-blur border-b border-slate-200 dark:border-slate-800 safe-top">
      <div className="flex items-center gap-3 h-14 lg:h-16 px-3 lg:px-6 max-w-[1600px] mx-auto">
        {/* Sidebar/menu toggle (panel + mobile-only public) */}
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="lg:hidden inline-flex items-center justify-center min-w-11 min-h-11 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Menüyü aç"
          >
            <List size={22} />
          </button>
        )}

        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2 font-semibold text-fg-1 hover:text-brand-600 transition-colors">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-r-2 bg-brand-500 text-white">
            <MapTrifold weight="fill" size={18} />
          </span>
          <span className="text-base">LandX</span>
        </Link>

        {/* AI komut çubuğu (orta) */}
        <form onSubmit={go} className="flex-1 hidden md:flex max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => ui.togglePalette()}
            className="flex-1 inline-flex items-center gap-2 px-3 py-2 rounded-r-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-fg-3 text-sm text-left"
            aria-label="AI komut paletini aç"
          >
            <Sparkle size={16} weight="fill" className="text-brand-500" />
            <span className="truncate">{t('command.placeholder')}</span>
            <kbd className="ml-auto hidden lg:inline-flex items-center gap-0.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </form>

        <div className="flex-1 md:hidden">
          <button
            onClick={() => ui.togglePalette()}
            className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-r-2 bg-slate-100 dark:bg-slate-900 text-fg-3 text-sm"
            aria-label="Arama / AI"
          >
            <MagnifyingGlass size={16} />
            <span className="truncate">Ara veya AI'a sor…</span>
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Lang */}
          <button
            onClick={() => setLocale(i18n.language === 'tr' ? 'en' : 'tr')}
            className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Dili değiştir"
            title={i18n.language === 'tr' ? 'English' : 'Türkçe'}
          >
            <Globe size={20} />
          </button>

          {/* Theme */}
          <button
            onClick={() => ui.setTheme(ui.theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Temayı değiştir"
          >
            {ui.theme === 'dark' ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
          </button>

          {/* Notifications */}
          {auth.role !== 'guest' && (
            <button
              onClick={() => ui.setNotif(!ui.notifOpen)}
              className="relative inline-flex items-center justify-center min-w-11 min-h-11 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Bildirimler"
            >
              <Bell size={20} weight={unread ? 'fill' : 'regular'} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center text-[10px] font-bold bg-rose-600 text-white rounded-full min-w-[18px] h-[18px] px-1">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </button>
          )}

          {/* AI Assistant */}
          {auth.role !== 'guest' && (
            <button
              onClick={() => ui.toggleAssistant()}
              className={cls(
                'inline-flex items-center justify-center min-w-11 min-h-11 rounded-r-2',
                'hover:bg-brand-50 dark:hover:bg-brand-900/40',
                ui.assistantOpen && 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300'
              )}
              aria-label={t('ai.open')}
              title={t('ai.open')}
            >
              <Sparkle size={20} weight="fill" />
            </button>
          )}

          {/* Auth */}
          {auth.role === 'guest' ? (
            <Button size="sm" iconLeft={<SignIn size={16} />} onClick={() => navigate('/auth')}>{t('nav.auth')}</Button>
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const auth = useAuth();
  const data = useData();
  const me = data.users.find((u) => u.id === auth.currentUserId);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!me) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-2 py-1 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img src={me.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-slate-200" />
        <span className="hidden md:inline text-sm font-medium">{me.displayName.split(' ')[0]}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-r-2 border border-slate-200 dark:border-slate-800 shadow-lg py-1 z-30">
          <MenuItem onClick={() => { setOpen(false); navigate('/account'); }}>{t('nav.account')}</MenuItem>
          {auth.role === 'seller' && <MenuItem onClick={() => { setOpen(false); navigate('/seller'); }}>{t('nav.seller')}</MenuItem>}
          {auth.role === 'admin' && <MenuItem onClick={() => { setOpen(false); navigate('/admin'); }}>{t('nav.admin')}</MenuItem>}
          <MenuItem onClick={() => { setOpen(false); navigate('/account/favorites'); }}>{t('nav.favorites')}</MenuItem>
          <MenuItem onClick={() => { setOpen(false); navigate('/account/messages'); }}>{t('nav.messages')}</MenuItem>
          <MenuItem onClick={() => { setOpen(false); navigate('/account/profile'); }}>{t('nav.profile')}</MenuItem>
          <div className="border-t border-slate-200 dark:border-slate-800 my-1" />
          <MenuItem onClick={() => { setOpen(false); auth.logout(); navigate('/'); }}>{t('nav.logout')}</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
    >{children}</button>
  );
}
