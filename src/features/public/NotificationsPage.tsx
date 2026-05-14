// S05 Notification Center — enterprise edition
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { Link } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  BellRinging, Sparkle, CaretDown, CaretUp, MagnifyingGlass, Funnel, Clock,
  BellSlash, EnvelopeSimple, ChatCircle, DeviceMobile, Globe, X, CheckCircle,
  Warning, TrendUp, FlowArrow, ListChecks, Sliders, Archive, Trash
} from '@phosphor-icons/react';
import { formatRelTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';
import type { Notification, NotifChannel, NotifPriority } from '@/types/domain';

type ViewMode = 'all' | 'unread' | 'starred' | 'snoozed' | 'archive';

const CHANNEL_ICON: Record<NotifChannel, typeof EnvelopeSimple> = {
  in_app: BellRinging,
  email: EnvelopeSimple,
  sms: ChatCircle,
  push: DeviceMobile
};

const PRIORITY_CONFIG: Record<NotifPriority, { tr: string; cls: string; dot: string }> = {
  now: { tr: 'Şimdi', cls: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
  soon: { tr: 'Yakında', cls: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  later: { tr: 'Daha sonra', cls: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' }
};

// Categorize notification by groupKey or title keywords
function categorize(n: Notification): { type: string; Icon: typeof BellRinging; tone: string } {
  const k = (n.groupKey || n.title).toLowerCase();
  if (/eca|kural|rule/i.test(k)) return { type: 'ECA Kural', Icon: FlowArrow, tone: 'text-fuchsia-500' };
  if (/teklif|offer/i.test(k)) return { type: 'Teklif', Icon: TrendUp, tone: 'text-amber-500' };
  if (/mesaj|message/i.test(k)) return { type: 'Mesaj', Icon: ChatCircle, tone: 'text-sky-500' };
  if (/kayıt|search/i.test(k)) return { type: 'Arama Alarmı', Icon: MagnifyingGlass, tone: 'text-emerald-500' };
  if (/onay|approval|risk/i.test(k)) return { type: 'Onay', Icon: CheckCircle, tone: 'text-brand-500' };
  if (/uyarı|warning|hata/i.test(k)) return { type: 'Uyarı', Icon: Warning, tone: 'text-orange-500' };
  return { type: 'Bildirim', Icon: BellRinging, tone: 'text-fg-3' };
}

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const [view, setView] = useState<ViewMode>('all');
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<NotifChannel | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showPrefs, setShowPrefs] = useState(false);
  const [snoozed, setSnoozed] = useState<Record<string, number>>({});
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [archived, setArchived] = useState<Set<string>>(new Set());

  const mine = useMemo(() => (
    data.notifications
      .filter((n) => n.userId === auth.currentUserId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  ), [data.notifications, auth.currentUserId]);

  // Auto-clean snoozed
  const now = Date.now();
  const liveSnoozed = Object.fromEntries(Object.entries(snoozed).filter(([_id, until]) => until > now));

  const filtered = useMemo(() => {
    return mine.filter((n) => {
      if (view === 'unread' && n.read) return false;
      if (view === 'starred' && !starred.has(n.id)) return false;
      if (view === 'snoozed' && !liveSnoozed[n.id]) return false;
      if (view === 'archive' && !archived.has(n.id)) return false;
      if (view === 'all' && (archived.has(n.id) || liveSnoozed[n.id])) return false;
      if (channelFilter !== 'all' && n.channel !== channelFilter) return false;
      if (typeFilter !== 'all' && categorize(n).type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLocaleLowerCase('tr-TR');
        if (!(n.title + ' ' + n.body).toLocaleLowerCase('tr-TR').includes(q)) return false;
      }
      return true;
    });
  }, [mine, view, channelFilter, typeFilter, search, starred, liveSnoozed, archived]);

  const counts = useMemo(() => ({
    all: mine.filter((n) => !archived.has(n.id) && !liveSnoozed[n.id]).length,
    unread: mine.filter((n) => !n.read).length,
    starred: starred.size,
    snoozed: Object.keys(liveSnoozed).length,
    archive: archived.size
  }), [mine, starred, liveSnoozed, archived]);

  const types = useMemo(() => {
    const m = new Set<string>();
    mine.forEach((n) => m.add(categorize(n).type));
    return Array.from(m);
  }, [mine]);

  function toggleStar(id: string) {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function snooze(id: string, hours: number) {
    setSnoozed((prev) => ({ ...prev, [id]: Date.now() + hours * 3600_000 }));
    toast('success', 'Bildirim ertelendi', `${hours} saat sonra tekrar gösterilecek.`);
  }
  function archive(id: string) {
    setArchived((prev) => new Set(prev).add(id));
    toast('info', 'Arşivlendi', 'Bildirim arşiv klasörüne taşındı.');
  }
  function unarchive(id: string) {
    setArchived((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }
  function bulkMarkRead() {
    if (!auth.currentUserId) return;
    data.markAllNotificationsRead(auth.currentUserId);
    toast('success', 'Tümü okundu', `${counts.unread} bildirim okundu olarak işaretlendi.`);
  }

  if (mine.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState icon={<BellRinging size={48} weight="duotone" />} title={t('empty.notifications')} description="Yeni etkinlikler burada görünecek." />
      </div>
    );
  }

  // AI digest summary
  const todayCount = mine.filter((n) => Date.now() - new Date(n.createdAt).getTime() < 86400_000).length;
  const nowCount = mine.filter((n) => n.priority === 'now' && !n.read).length;
  const topType = (() => {
    const tm = new Map<string, number>();
    mine.forEach((n) => { const t = categorize(n).type; tm.set(t, (tm.get(t) || 0) + 1); });
    return Array.from(tm.entries()).sort((a, b) => b[1] - a[1])[0];
  })();

  return (
    <div className="max-w-6xl mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading
        title="Bildirim Merkezi"
        description={`${mine.length} bildirim · ${counts.unread} okunmamış`}
        actions={
          <div className="flex flex-wrap gap-1.5">
            <AiBadge>AI digest</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<Sliders size={14} />} onClick={() => setShowPrefs((v) => !v)}>
              {showPrefs ? 'Tercihleri kapat' : 'Tercihler'}
            </Button>
            <Button size="sm" variant="outline" iconLeft={<ListChecks size={14} />} onClick={bulkMarkRead}>Tümünü oku</Button>
          </div>
        }
      />

      {/* AI Digest banner */}
      <Card className="mb-4 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-r-2 bg-brand-100 dark:bg-brand-900/50 grid place-items-center text-brand-600 shrink-0">
            <Sparkle size={18} weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium inline-flex items-center gap-2">AI günlük özet</h3>
            <p className="text-sm text-fg-2 mt-1">
              Bugün <strong>{todayCount}</strong> yeni bildirim aldınız.
              {nowCount > 0 && <> <strong className="text-rose-600 dark:text-rose-400">{nowCount} acil</strong> bildiriminize henüz bakmadınız.</>}
              {topType && <> En yoğun kategori: <strong>{topType[0]}</strong> ({topType[1]} bildirim).</>}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button onClick={() => setView('unread')} className="text-xs px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/40">{counts.unread} okunmamış</button>
              <button onClick={() => { setView('all'); setTypeFilter(topType?.[0] || 'all'); }} className="text-xs px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/40">{topType?.[0]} kategorisi</button>
            </div>
          </div>
        </div>
      </Card>

      {/* Prefs panel */}
      {showPrefs && <PrefsPanel onClose={() => setShowPrefs(false)} />}

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        <Stat label="Bu hafta" value={mine.filter((n) => Date.now() - new Date(n.createdAt).getTime() < 7 * 86400_000).length} icon={<Clock size={16} weight="fill" />} />
        <Stat label="Acil" value={mine.filter((n) => n.priority === 'now').length} icon={<Warning size={16} weight="fill" />} />
        <Stat label="Okunma %" value={`${Math.round((1 - counts.unread / mine.length) * 100)}%`} icon={<CheckCircle size={16} weight="fill" />} />
        <Stat label="En aktif kanal" value="in-app" icon={<BellRinging size={16} weight="fill" />} hint={`${mine.filter((n) => n.channel === 'in_app').length} bildirim`} />
        <Stat label="Yıldızlı" value={starred.size} icon={<Sparkle size={16} weight="fill" />} />
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-3">
          <Card className="!p-0 overflow-hidden">
            <nav>
              {([
                { id: 'all', label: 'Tümü', Icon: BellRinging, count: counts.all },
                { id: 'unread', label: 'Okunmamış', Icon: CheckCircle, count: counts.unread },
                { id: 'starred', label: 'Yıldızlı', Icon: Sparkle, count: counts.starred },
                { id: 'snoozed', label: 'Ertelenmiş', Icon: BellSlash, count: counts.snoozed },
                { id: 'archive', label: 'Arşiv', Icon: Archive, count: counts.archive }
              ] as { id: ViewMode; label: string; Icon: typeof BellRinging; count: number }[]).map(({ id, label, Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={cls(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm border-b border-slate-100 dark:border-slate-800 last:border-0',
                    view === id ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon size={14} weight={view === id ? 'fill' : 'regular'} />
                  <span className="flex-1 text-left">{label}</span>
                  <span className="text-[10px] tabular-nums text-fg-3">{count}</span>
                </button>
              ))}
            </nav>
          </Card>

          <Card>
            <h3 className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Kanallar</h3>
            <div className="space-y-1">
              <button onClick={() => setChannelFilter('all')} className={cls('w-full text-left text-sm px-2 py-1 rounded', channelFilter === 'all' && 'bg-brand-50 dark:bg-brand-900/30')}>
                Tüm kanallar ({mine.length})
              </button>
              {(['in_app', 'email', 'sms', 'push'] as NotifChannel[]).map((ch) => {
                const Ic = CHANNEL_ICON[ch];
                const c = mine.filter((n) => n.channel === ch).length;
                if (c === 0) return null;
                return (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={cls('w-full text-left text-sm px-2 py-1 rounded inline-flex items-center gap-2', channelFilter === ch && 'bg-brand-50 dark:bg-brand-900/30')}
                  >
                    <Ic size={12} weight="fill" />
                    <span className="flex-1">{ch}</span>
                    <span className="text-[10px] text-fg-3 tabular-nums">{c}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {types.length > 1 && (
            <Card>
              <h3 className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Tür</h3>
              <div className="space-y-1">
                <button onClick={() => setTypeFilter('all')} className={cls('w-full text-left text-sm px-2 py-1 rounded', typeFilter === 'all' && 'bg-brand-50 dark:bg-brand-900/30')}>
                  Tüm türler
                </button>
                {types.map((tt) => {
                  const c = mine.filter((n) => categorize(n).type === tt).length;
                  return (
                    <button
                      key={tt}
                      onClick={() => setTypeFilter(tt)}
                      className={cls('w-full text-left text-sm px-2 py-1 rounded inline-flex items-center justify-between gap-2', typeFilter === tt && 'bg-brand-50 dark:bg-brand-900/30')}
                    >
                      <span>{tt}</span>
                      <span className="text-[10px] text-fg-3 tabular-nums">{c}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}
        </aside>

        {/* List */}
        <div className="lg:col-span-3">
          <div className="mb-3 relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Bildirimler içinde ara..."
              className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm min-h-[40px]"
            />
          </div>

          {filtered.length === 0 ? (
            <Card className="text-center py-8 text-sm text-fg-3">
              <Funnel size={32} weight="duotone" className="mx-auto mb-2 text-fg-3" />
              Bu filtreyle eşleşen bildirim yok.
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => (
                <NotifRow
                  key={n.id}
                  n={n}
                  locale={locale}
                  starred={starred.has(n.id)}
                  isArchived={archived.has(n.id)}
                  onStar={() => toggleStar(n.id)}
                  onRead={() => data.markNotificationRead(n.id)}
                  onSnooze={(h) => snooze(n.id, h)}
                  onArchive={() => archived.has(n.id) ? unarchive(n.id) : archive(n.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotifRow({ n, locale, starred, isArchived, onStar, onRead, onSnooze, onArchive }: {
  n: Notification;
  locale: 'tr' | 'en';
  starred: boolean;
  isArchived: boolean;
  onStar: () => void;
  onRead: () => void;
  onSnooze: (h: number) => void;
  onArchive: () => void;
}) {
  const cat = categorize(n);
  const Icon = cat.Icon;
  const ChIcon = CHANNEL_ICON[n.channel];
  const pri = PRIORITY_CONFIG[n.priority];
  const [snoozeOpen, setSnoozeOpen] = useState(false);

  return (
    <Card padding="sm" className={cls('flex items-start gap-3 transition-colors', !n.read && 'ring-1 ring-brand-300 dark:ring-brand-800')}>
      <div className={cls('shrink-0 w-10 h-10 rounded-r-2 grid place-items-center', !n.read ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-slate-100 dark:bg-slate-800')}>
        <Icon size={18} weight={!n.read ? 'fill' : 'regular'} className={cat.tone} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h4 className={cls('text-sm', !n.read ? 'font-semibold' : 'font-medium')}>{n.title}</h4>
            {!n.read && <span className={cls('w-2 h-2 rounded-full', pri.dot)} />}
            <span className={cls('text-[10px] uppercase rounded-full px-1.5 py-0.5 font-medium border', pri.cls)}>{pri.tr}</span>
            <span className="text-[10px] text-fg-3 inline-flex items-center gap-0.5"><ChIcon size={10} /> {n.channel}</span>
            <span className="text-[10px] text-fg-3">{cat.type}</span>
          </div>
          <div className="text-xs text-fg-3 whitespace-nowrap">{formatRelTime(n.createdAt, locale)}</div>
        </div>
        <p className="text-sm text-fg-2 mt-1">{n.body}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {n.actionUrl && !isArchived && (
            <Link to={n.actionUrl} className="text-xs text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1">
              Detayı aç →
            </Link>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            <button onClick={onStar} className={cls('p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800', starred ? 'text-amber-500' : 'text-fg-3')} aria-label={starred ? 'Yıldızı kaldır' : 'Yıldızla'}>
              <Sparkle size={14} weight={starred ? 'fill' : 'regular'} />
            </button>
            <div className="relative">
              <button onClick={() => setSnoozeOpen((v) => !v)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-fg-3" aria-label="Ertele">
                <BellSlash size={14} />
              </button>
              {snoozeOpen && (
                <div className="absolute right-0 top-full mt-1 z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-2 shadow-lg p-1 min-w-[140px]">
                  {[1, 4, 8, 24, 72].map((h) => (
                    <button key={h} onClick={() => { setSnoozeOpen(false); onSnooze(h); }} className="block w-full text-left text-xs px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                      {h < 24 ? `${h} saat` : `${h / 24} gün`} sonra
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!n.read && (
              <button onClick={onRead} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-fg-3" aria-label="Okundu işaretle">
                <CheckCircle size={14} />
              </button>
            )}
            <button onClick={onArchive} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-fg-3" aria-label={isArchived ? 'Arşivden çıkar' : 'Arşivle'}>
              {isArchived ? <Trash size={14} /> : <Archive size={14} />}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PrefsPanel({ onClose }: { onClose: () => void }) {
  const [channels, setChannels] = useState<Record<NotifChannel, boolean>>({ in_app: true, email: true, sms: false, push: true });
  const [digest, setDigest] = useState<'realtime' | 'hourly' | 'daily' | 'weekly'>('realtime');
  const [quietHours, setQuietHours] = useState({ from: '22:00', to: '08:00' });
  const [muted, setMuted] = useState<Set<string>>(new Set(['Sistem testleri']));
  return (
    <Card className="mb-4 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-800/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium inline-flex items-center gap-2"><Sliders size={16} weight="fill" /> Bildirim tercihleri</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"><X size={16} /></button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Kanallar</div>
          <div className="space-y-1.5">
            {(Object.keys(channels) as NotifChannel[]).map((ch) => {
              const Ic = CHANNEL_ICON[ch];
              return (
                <label key={ch} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={channels[ch]} onChange={(e) => setChannels((p) => ({ ...p, [ch]: e.target.checked }))} />
                  <Ic size={14} className="text-fg-3" />
                  <span className="capitalize">{ch.replace('_', ' ')}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Digest sıklığı</div>
          <div className="space-y-1.5">
            {(['realtime', 'hourly', 'daily', 'weekly'] as const).map((d) => (
              <label key={d} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="digest" checked={digest === d} onChange={() => setDigest(d)} />
                <span className="capitalize">{d === 'realtime' ? 'Anlık' : d === 'hourly' ? 'Saatlik özet' : d === 'daily' ? 'Günlük özet (08:00)' : 'Haftalık özet (Pazartesi)'}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Sessiz saatler</div>
          <div className="flex items-center gap-2 text-sm">
            <input type="time" value={quietHours.from} onChange={(e) => setQuietHours((p) => ({ ...p, from: e.target.value }))} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1" />
            <span className="text-fg-3">→</span>
            <input type="time" value={quietHours.to} onChange={(e) => setQuietHours((p) => ({ ...p, to: e.target.value }))} className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1" />
          </div>
          <p className="text-[11px] text-fg-3 mt-1">Bu aralıkta sadece "Şimdi" öncelikli bildirimler ulaşır.</p>

          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mt-3 mb-2">Susturulan kelimeler</div>
          <div className="flex flex-wrap gap-1">
            {Array.from(muted).map((m) => (
              <span key={m} className="inline-flex items-center gap-1 text-[11px] bg-slate-200 dark:bg-slate-700 rounded-full px-2 py-0.5">
                {m}
                <button onClick={() => setMuted((p) => { const n = new Set(p); n.delete(m); return n; })}><X size={10} /></button>
              </span>
            ))}
            <button onClick={() => {
              const w = prompt('Susturulacak kelime');
              if (w) setMuted((p) => new Set(p).add(w.trim()));
            }} className="text-[11px] text-brand-700 dark:text-brand-300 hover:underline">+ ekle</button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <Button size="sm" onClick={() => { toast('success', 'Tercihler kaydedildi', 'Bildirim ayarları güncellendi.'); onClose(); }}>Kaydet</Button>
      </div>
    </Card>
  );
}
