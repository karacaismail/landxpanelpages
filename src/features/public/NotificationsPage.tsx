import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BellRinging, Sparkle, CaretDown, CaretUp } from '@phosphor-icons/react';
import { useState } from 'react';
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
      <Card className="mb-4 bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-1"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI gruplama</span></div>
        <p className="text-sm text-fg-2">Bildirimler önce <strong>zaman önceliğine</strong>, sonra <strong>tip benzerliğine</strong> göre AI tarafından gruplandırıldı. Aynı tipten 3+ bildirim varsa katlanır.</p>
      </Card>
      {(['now','soon','later'] as const).map((p) => groups[p].length > 0 && (
        <PrioritySection key={p} label={t(`common.${p}`)} items={groups[p]} locale={locale} onRead={(id) => data.markNotificationRead(id)} />
      ))}
    </div>
  );
}

function PrioritySection({ label, items, locale, onRead }: { label: string; items: Array<{ id: string; title: string; body: string; createdAt: string; read: boolean; groupKey?: string }>; locale: 'tr' | 'en'; onRead: (id: string) => void; }) {
  // Group by groupKey (or title fallback)
  const groupMap = new Map<string, typeof items>();
  items.forEach((n) => {
    const k = n.groupKey || n.title;
    const arr = groupMap.get(k) || [];
    arr.push(n);
    groupMap.set(k, arr);
  });
  return (
    <section className="mb-6">
      <h3 className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">{label}</h3>
      <div className="space-y-2">
        {Array.from(groupMap.entries()).map(([k, arr]) => (
          arr.length >= 3 ? <CollapseGroup key={k} title={arr[0].title} items={arr} locale={locale} onRead={onRead} /> : (
            arr.map((n) => <NotifCard key={n.id} n={n} locale={locale} onRead={onRead} />)
          )
        ))}
      </div>
    </section>
  );
}

function CollapseGroup({ title, items, locale, onRead }: { title: string; items: Array<{ id: string; title: string; body: string; createdAt: string; read: boolean }>; locale: 'tr' | 'en'; onRead: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-r-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-3 p-3 text-left">
        <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600 shrink-0">{items.length}</div>
        <div className="flex-1">
          <div className="font-medium inline-flex items-center gap-1.5"><Sparkle size={12} weight="fill" className="text-brand-500" />{title}</div>
          <div className="text-xs text-fg-3 mt-0.5">{items.length} benzer bildirim · son: {formatRelTime(items[0].createdAt, locale)}</div>
        </div>
        {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {items.map((n) => <NotifCard key={n.id} n={n} locale={locale} onRead={onRead} compact />)}
        </div>
      )}
    </div>
  );
}

function NotifCard({ n, locale, onRead, compact }: { n: { id: string; title: string; body: string; createdAt: string; read: boolean }; locale: 'tr' | 'en'; onRead: (id: string) => void; compact?: boolean }) {
  return (
    <Card padding="sm" className={cls('flex items-start gap-3', !n.read && 'bg-brand-50/30 dark:bg-brand-900/20', compact && '!shadow-none')}>
      {!compact && <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600 shrink-0">●</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium">{n.title}</div>
          <div className="text-xs text-fg-3">{formatRelTime(n.createdAt, locale)}</div>
        </div>
        <div className="text-sm text-fg-2 mt-0.5">{n.body}</div>
      </div>
      {!n.read && <Button size="xs" variant="ghost" onClick={() => onRead(n.id)}>İşaretle</Button>}
    </Card>
  );
}
