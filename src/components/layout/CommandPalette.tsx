import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass, ArrowRight, House, Heart, ChatCircle, Briefcase, Calendar,
  ChartBar, CheckSquare, FlowArrow, MapPin, Users, ShieldCheck, Gear, BellSimple,
  Buildings, Stack, Sparkle, Sun, Moon
} from '@phosphor-icons/react';
import { useUi } from '@/store/ui';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { cls } from '@/lib/utils/cls';

interface Cmd {
  id: string;
  label: string;
  hint?: string;
  group: string;
  Icon: typeof House;
  scope?: Array<'guest' | 'buyer' | 'seller' | 'admin'>;
  run: () => void;
}

export function CommandPalette() {
  const ui = useUi();
  const open = ui.paletteOpen;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const cmds: Cmd[] = useMemo(() => {
    const list: Cmd[] = [
      // Navigate
      { id: 'go.home', label: t('nav.home'), group: 'navigate', Icon: House, run: () => navigate('/') },
      { id: 'go.discover', label: t('nav.discover'), group: 'navigate', Icon: MagnifyingGlass, run: () => navigate('/listings') },
      { id: 'go.compare', label: t('nav.compare'), group: 'navigate', Icon: Stack, run: () => navigate('/compare') },
      { id: 'go.sell', label: t('nav.sell'), group: 'navigate', Icon: MapPin, scope: ['seller','admin','buyer'], run: () => navigate('/sell') },
      { id: 'go.favorites', label: t('nav.favorites'), group: 'navigate', Icon: Heart, scope: ['buyer','seller','admin'], run: () => navigate('/account/favorites') },
      { id: 'go.messages', label: t('nav.messages'), group: 'navigate', Icon: ChatCircle, scope: ['buyer','seller','admin'], run: () => navigate('/account/messages') },
      { id: 'go.offers', label: t('nav.offers'), group: 'navigate', Icon: Briefcase, scope: ['buyer','seller','admin'], run: () => navigate('/account/offers') },
      { id: 'go.viewings', label: t('nav.viewings'), group: 'navigate', Icon: Calendar, scope: ['buyer','seller','admin'], run: () => navigate('/account/viewings') },
      { id: 'go.notifications', label: t('nav.notifications'), group: 'navigate', Icon: BellSimple, scope: ['buyer','seller','admin'], run: () => navigate('/notifications') },
      { id: 'go.account', label: t('nav.account'), group: 'navigate', Icon: ShieldCheck, scope: ['buyer','seller','admin'], run: () => navigate('/account') },
      // Seller
      { id: 'go.seller', label: t('nav.seller'), group: 'navigate', Icon: MapPin, scope: ['seller','admin'], run: () => navigate('/seller') },
      { id: 'go.myListings', label: t('nav.myListings'), group: 'navigate', Icon: MapPin, scope: ['seller','admin'], run: () => navigate('/seller/listings') },
      { id: 'go.newListing', label: t('nav.newListing'), group: 'create', Icon: MapPin, scope: ['seller','admin'], run: () => navigate('/seller/listings/new') },
      { id: 'go.performance', label: t('nav.performance'), group: 'navigate', Icon: ChartBar, scope: ['seller','admin'], run: () => navigate('/seller/performance') },
      // Admin
      { id: 'go.admin', label: t('nav.admin'), group: 'navigate', Icon: ShieldCheck, scope: ['admin'], run: () => navigate('/admin') },
      { id: 'go.approvals', label: t('nav.approvals'), group: 'navigate', Icon: CheckSquare, scope: ['admin'], run: () => navigate('/admin/approvals') },
      { id: 'go.users', label: t('nav.users'), group: 'navigate', Icon: Users, scope: ['admin'], run: () => navigate('/admin/users') },
      { id: 'go.roles', label: t('nav.roles'), group: 'navigate', Icon: ShieldCheck, scope: ['admin'], run: () => navigate('/admin/roles') },
      { id: 'go.rules', label: t('nav.rules'), group: 'navigate', Icon: FlowArrow, scope: ['admin'], run: () => navigate('/admin/rules') },
      { id: 'go.audit', label: t('nav.audit'), group: 'navigate', Icon: ShieldCheck, scope: ['admin'], run: () => navigate('/admin/audit') },
      { id: 'go.reports', label: t('nav.reports'), group: 'navigate', Icon: ChartBar, scope: ['admin'], run: () => navigate('/admin/reports') },
      { id: 'go.tkgm', label: t('nav.tkgm'), group: 'navigate', Icon: Buildings, scope: ['admin'], run: () => navigate('/admin/tkgm') },
      { id: 'go.modules', label: t('nav.modules'), group: 'navigate', Icon: Stack, scope: ['admin'], run: () => navigate('/admin/modules') },
      { id: 'go.settings', label: t('nav.settings'), group: 'navigate', Icon: Gear, scope: ['admin'], run: () => navigate('/admin/settings') },
      { id: 'go.compliance', label: t('nav.compliance'), group: 'navigate', Icon: ShieldCheck, scope: ['admin'], run: () => navigate('/admin/compliance') },
      // Theme / role
      { id: 'theme.light', label: 'Açık temaya geç', group: 'theme', Icon: Sun, run: () => ui.setTheme('light') },
      { id: 'theme.dark', label: 'Koyu temaya geç', group: 'theme', Icon: Moon, run: () => ui.setTheme('dark') },
      // Role demo switcher
      { id: 'role.buyer', label: 'Rol: Alıcı', group: 'role', Icon: Sparkle, run: () => { const u = data.users.find(u => u.roles.includes('buyer')); if (u) auth.setUser(u.id, 'buyer'); ui.setPalette(false); navigate('/'); }},
      { id: 'role.seller', label: 'Rol: Satıcı', group: 'role', Icon: Sparkle, run: () => { const u = data.users.find(u => u.roles.includes('seller')); if (u) auth.setUser(u.id, 'seller'); ui.setPalette(false); navigate('/seller'); }},
      { id: 'role.admin', label: 'Rol: Yönetici', group: 'role', Icon: Sparkle, run: () => { const u = data.users.find(u => u.roles.includes('admin')); if (u) auth.setUser(u.id, 'admin'); ui.setPalette(false); navigate('/admin'); }}
    ];
    return list.filter((c) => !c.scope || c.scope.includes(auth.role as never));
  }, [auth.role, navigate, t, data.users, auth, ui]);

  const filtered = useMemo(() => {
    if (!q.trim()) {
      // Son komutları önde göster (LocalStorage)
      const recentIds: string[] = JSON.parse(localStorage.getItem('landx:cmd:recent') || '[]') as string[];
      const recentCmds = recentIds.map((id) => cmds.find((c) => c.id === id)).filter(Boolean) as typeof cmds;
      const rest = cmds.filter((c) => !recentIds.includes(c.id));
      return [...recentCmds, ...rest];
    }
    const nq = q.toLocaleLowerCase('tr-TR');
    return cmds.filter((c) => c.label.toLocaleLowerCase('tr-TR').includes(nq) || c.id.includes(nq));
  }, [cmds, q]);

  function recordRecent(id: string) {
    const recent: string[] = JSON.parse(localStorage.getItem('landx:cmd:recent') || '[]') as string[];
    const next = [id, ...recent.filter((x) => x !== id)].slice(0, 5);
    localStorage.setItem('landx:cmd:recent', JSON.stringify(next));
  }

  // Listing arama önerisi
  const listingHit = useMemo(() => {
    if (q.length < 2) return null;
    const nq = q.toLocaleLowerCase('tr-TR');
    return data.listings
      .filter((l) => l.status === 'live' && (
        l.title.toLocaleLowerCase('tr-TR').includes(nq) ||
        l.city.toLocaleLowerCase('tr-TR').includes(nq) ||
        l.district.toLocaleLowerCase('tr-TR').includes(nq)
      ))
      .slice(0, 5);
  }, [q, data.listings]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1 + (listingHit?.length || 0), a + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const all = [
          ...filtered.map((c) => () => { recordRecent(c.id); c.run(); ui.setPalette(false); }),
          ...(listingHit || []).map((l) => () => { navigate(`/listings/${l.id}`); ui.setPalette(false); })
        ];
        all[active]?.();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, listingHit, active, navigate, ui]);

  if (!open) return null;
  return (
    <div role="dialog" aria-label="Komut paleti" className="fixed inset-0 z-50 flex items-start justify-center p-4 lg:p-12 bg-black/40" onClick={() => ui.setPalette(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Sparkle size={18} weight="fill" className="text-brand-500" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            placeholder={t('command.placeholder')}
            className="flex-1 bg-transparent outline-none text-base placeholder:text-fg-3"
            aria-label="Komut ara"
          />
          <kbd className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Esc</kbd>
        </div>
        <div className="max-h-[60dvh] overflow-y-auto">
          {filtered.length === 0 && !listingHit?.length ? (
            <div className="p-6 text-center text-fg-3 text-sm">Sonuç yok. Niyet yazabilirsiniz (örn. "Beykoz 5M altı").</div>
          ) : (
            <div className="py-2">
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => { recordRecent(c.id); c.run(); ui.setPalette(false); }}
                  className={cls(
                    'w-full text-left flex items-center gap-3 px-4 py-2 text-sm',
                    i === active ? 'bg-brand-50 dark:bg-brand-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <c.Icon size={16} weight="duotone" />
                  <span className="flex-1">{c.label}</span>
                  <span className="text-xs text-fg-3">{c.group}</span>
                </button>
              ))}
              {listingHit && listingHit.length > 0 && (
                <>
                  <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-fg-3 font-semibold">İlanlar</div>
                  {listingHit.map((l, i) => {
                    const idx = filtered.length + i;
                    return (
                      <button
                        key={l.id}
                        onClick={() => { navigate(`/listings/${l.id}`); ui.setPalette(false); }}
                        className={cls(
                          'w-full text-left flex items-center gap-3 px-4 py-2 text-sm',
                          idx === active ? 'bg-brand-50 dark:bg-brand-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                      >
                        <MapPin size={16} weight="duotone" className="text-brand-500" />
                        <span className="flex-1 truncate">{l.title}</span>
                        <span className="text-xs text-fg-3">{l.city}</span>
                        <ArrowRight size={14} className="text-fg-3" />
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-xs text-fg-3 flex items-center gap-3">
          <span>↑↓ gezin</span>
          <span>↵ seç</span>
          <span>Esc kapat</span>
          <span className="ml-auto inline-flex items-center gap-1"><Sparkle size={12} weight="fill" className="text-brand-500" />AI komut çubuğu</span>
        </div>
      </div>
    </div>
  );
}
