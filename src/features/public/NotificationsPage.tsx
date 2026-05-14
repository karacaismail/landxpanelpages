import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BellRinging } from '@phosphor-icons/react';
import { formatRelTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const mine = useMemo(() => data.notifications.filter((n) => n.userId === auth.currentUserId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [data.notifications, auth.currentUserId]);

  if (mine.length === 0) {
    return <div className="max-w-3xl mx-auto p-6"><EmptyState icon={<BellRinging size={48} weight="duotone" />} title={t('empty.notifications')} /></div>;
  }

  const groups: Record<'now'|'soon'|'later', typeof mine> = { now: [], soon: [], later: [] };
  mine.forEach((n) => groups[n.priority].push(n));

  return (
    <div className="max-w-3xl mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading
        title={t('nav.notifications')}
        description={`${mine.length} bildirim`}
        actions={<Button variant="outline" onClick={() => auth.currentUserId && data.markAllNotificationsRead(auth.currentUserId)}>Tümünü okundu işaretle</Button>}
      />
      {(['now','soon','later'] as const).map((p) => groups[p].length > 0 && (
        <section key={p} className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">{t(`common.${p}`)}</h3>
          <div className="space-y-2">
            {groups[p].map((n) => (
              <Card key={n.id} padding="sm" className={cls('flex items-start gap-3', !n.read && 'bg-brand-50/30 dark:bg-brand-900/20')}>
                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600 shrink-0">●</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{n.title}</div>
                    <div className="text-xs text-fg-3">{formatRelTime(n.createdAt, locale)}</div>
                  </div>
                  <div className="text-sm text-fg-2 mt-0.5">{n.body}</div>
                </div>
                {!n.read && <Button size="xs" variant="ghost" onClick={() => data.markNotificationRead(n.id)}>İşaretle</Button>}
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
