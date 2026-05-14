import { useMemo } from 'react';
import { Bell, X } from '@phosphor-icons/react';
import { useUi } from '@/store/ui';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { useTranslation } from 'react-i18next';
import { formatRelTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotificationsDrawer() {
  const ui = useUi();
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const open = ui.notifOpen;

  const mine = useMemo(() => {
    if (!auth.currentUserId) return [];
    return data.notifications.filter((n) => n.userId === auth.currentUserId);
  }, [auth.currentUserId, data.notifications]);

  const grouped = useMemo(() => ({
    now: mine.filter((n) => n.priority === 'now'),
    soon: mine.filter((n) => n.priority === 'soon'),
    later: mine.filter((n) => n.priority === 'later')
  }), [mine]);

  if (!open) return null;

  return (
    <>
      <button className="fixed inset-0 z-30 bg-black/30" aria-label="Kapat" onClick={() => ui.setNotif(false)} />
      <aside role="dialog" aria-label={t('nav.notifications')} className="fixed z-40 right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col safe-top safe-bottom">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Bell size={18} weight="fill" className="text-brand-500" />
          <div className="font-medium">{t('nav.notifications')}</div>
          <Button size="xs" variant="ghost" onClick={() => auth.currentUserId && data.markAllNotificationsRead(auth.currentUserId)} className="ml-auto">Tümünü okundu işaretle</Button>
          <button onClick={() => ui.setNotif(false)} className="p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t('actions.close')}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {(['now','soon','later'] as const).map((p) => grouped[p].length > 0 && (
            <Section key={p} title={t(`common.${p}`)}>
              <ul className="space-y-2">
                {grouped[p].slice(0, 20).map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => { data.markNotificationRead(n.id); if (n.actionUrl) { navigate(n.actionUrl); ui.setNotif(false); } }}
                      className={cls(
                        'w-full text-left p-3 rounded-r-3 border border-slate-200 dark:border-slate-800',
                        !n.read && 'bg-brand-50/50 dark:bg-brand-900/20'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium">{n.title}</div>
                        {!n.read && <span className="w-2 h-2 mt-1.5 rounded-full bg-brand-500" />}
                      </div>
                      <div className="text-xs text-fg-3 mt-0.5">{n.body}</div>
                      <div className="text-[11px] text-fg-4 mt-1">{formatRelTime(n.createdAt, i18n.language as 'tr' | 'en')}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          ))}
          {mine.length === 0 && <div className="text-sm text-fg-3 text-center py-8">{t('empty.notifications')}</div>}
          <Button variant="outline" block onClick={() => { ui.setNotif(false); navigate('/notifications'); }}>Tümünü göster</Button>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}
