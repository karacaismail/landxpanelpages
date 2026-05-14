import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChatCircle, PaperPlaneRight, Sparkle } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { formatRelTime } from '@/lib/utils/format';
import { nanoid } from 'nanoid';
import type { Message } from '@/types/domain';

const MOCK_REPLIES_TR = [
  'Teşekkürler, en kısa sürede dönüyorum.',
  'Bu konuda ek bilgi gönderebilir misiniz?',
  'Görüşme için hangi saat uygun?',
  'Fotoğrafları paylaşabilirim, ister misiniz?',
  'TKGM evraklarını gözden geçireyim.',
  'Teklifinizi değerlendiriyorum, kısa süre içinde yanıt vereceğim.',
  'Anladım, ailem ile görüşüp dönüş yapacağım.'
];
const MOCK_REPLIES_EN = [
  'Thanks, I will get back to you shortly.',
  'Could you send more details?',
  'What time works best for a call?',
  'I can share the photos if you like.',
  'Let me review the title deed documents.',
  'I am evaluating your offer, will respond soon.',
  'Understood, I will discuss with my family and reply.'
];

function dayLabel(iso: string, locale: 'tr' | 'en'): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yest = new Date(now.getTime() - 86400_000);
  const sameYest = d.toDateString() === yest.toDateString();
  if (sameDay) return locale === 'tr' ? 'Bugün' : 'Today';
  if (sameYest) return locale === 'tr' ? 'Dün' : 'Yesterday';
  return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MessagesPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const me = data.users.find((u) => u.id === auth.currentUserId);

  const myThreads = useMemo(() => (
    me ? data.threads.filter((th) => th.participantIds.includes(me.id)).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)) : []
  ), [me, data.threads]);

  const [activeId, setActiveId] = useState<string | null>(myThreads[0]?.id || null);
  const [draft, setDraft] = useState('');
  const [typingBy, setTypingBy] = useState<Record<string, string>>({});
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = myThreads.find((th) => th.id === activeId) || null;
  const messages = active ? data.messages.filter((m) => m.threadId === active.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : [];

  // Mock typing + auto-reply: rastgele aralıklarla "diğer taraf yazıyor" sonra otomatik yanıt
  useEffect(() => {
    if (!me || myThreads.length === 0) return;
    let cancelled = false;

    const scheduleNext = (delay: number) => {
      tickRef.current = setTimeout(() => {
        if (cancelled) return;
        const candidates = myThreads.filter((th) => {
          const last = data.messages.filter((m) => m.threadId === th.id).slice(-1)[0];
          return last && last.senderId === me.id;
        });
        if (candidates.length === 0) {
          scheduleNext(20_000 + Math.random() * 25_000);
          return;
        }
        const th = candidates[Math.floor(Math.random() * candidates.length)];
        const other = th.participantIds.find((id) => id !== me.id);
        if (!other) {
          scheduleNext(25_000);
          return;
        }
        setTypingBy((prev) => ({ ...prev, [th.id]: other }));
        const typingDuration = 2500 + Math.random() * 2500;
        setTimeout(() => {
          if (cancelled) return;
          setTypingBy((prev) => {
            const next = { ...prev };
            delete next[th.id];
            return next;
          });
          const pool = locale === 'en' ? MOCK_REPLIES_EN : MOCK_REPLIES_TR;
          const body = pool[Math.floor(Math.random() * pool.length)];
          data.addMessage({
            id: `m-${nanoid(6)}`,
            threadId: th.id,
            senderId: other,
            body,
            createdAt: new Date().toISOString(),
            readBy: [other]
          });
          scheduleNext(25_000 + Math.random() * 30_000);
        }, typingDuration);
      }, delay);
    };

    scheduleNext(15_000 + Math.random() * 10_000);
    return () => {
      cancelled = true;
      if (tickRef.current) clearTimeout(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id, myThreads.length]);

  function send() {
    if (!me || !active || !draft.trim()) return;
    const msg: Message = {
      id: `m-${nanoid(6)}`,
      threadId: active.id,
      senderId: me.id,
      body: draft.trim(),
      createdAt: new Date().toISOString(),
      readBy: [me.id]
    };
    data.addMessage(msg);
    setDraft('');
  }

  if (!me || myThreads.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState icon={<ChatCircle size={48} weight="duotone" />} title={t('empty.messages')} description="İlan detay sayfasından satıcıya mesaj gönderebilirsiniz." aiHint="Hızlı 3 yanıt taslağı hazır." />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title={t('nav.messages')} description={`${myThreads.length} konuşma`} />
      <div className="grid lg:grid-cols-3 gap-3 h-[70dvh]">
        {/* Thread list */}
        <Card className="lg:col-span-1 !p-0 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            {myThreads.map((th) => {
              const other = th.participantIds.find((id) => id !== me.id);
              const otherUser = data.users.find((u) => u.id === other);
              const lastMsg = data.messages.filter((m) => m.threadId === th.id).slice(-1)[0];
              const unread = th.unreadCount[me.id] || 0;
              return (
                <button
                  key={th.id}
                  onClick={() => setActiveId(th.id)}
                  className={cls(
                    'w-full text-left flex gap-3 p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800',
                    activeId === th.id && 'bg-brand-50 dark:bg-brand-900/30'
                  )}
                >
                  <img src={otherUser?.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{otherUser?.displayName}</span>
                      <span className="text-[11px] text-fg-3 ml-auto shrink-0">{formatRelTime(th.lastMessageAt, locale)}</span>
                    </div>
                    <div className="text-xs text-fg-3 truncate mt-0.5">
                      {typingBy[th.id]
                        ? <span className="text-brand-600 dark:text-brand-400 italic">{locale === 'en' ? 'typing…' : 'yazıyor…'}</span>
                        : lastMsg?.body}
                    </div>
                    {th.topic && <div className="text-[11px] text-brand-700 dark:text-brand-300 truncate mt-0.5">{th.topic}</div>}
                  </div>
                  {unread > 0 && <span className="self-start mt-1 inline-flex items-center justify-center text-[10px] font-bold bg-brand-500 text-white rounded-full min-w-[18px] h-[18px] px-1">{unread}</span>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Thread detail */}
        <Card className="lg:col-span-2 !p-0 flex flex-col">
          {active ? (
            <>
              <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="font-medium">{active.topic || 'Konuşma'}</div>
                <div className="text-xs text-fg-3">{active.participantIds.map((id) => data.users.find((u) => u.id === id)?.displayName).join(' · ')}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {(() => {
                  // Tarih grubu ayraçları
                  const result: React.ReactNode[] = [];
                  let lastDay = '';
                  for (const m of messages) {
                    const d = dayLabel(m.createdAt, locale);
                    if (d !== lastDay) {
                      result.push(
                        <div key={`sep-${m.id}`} className="text-center my-2">
                          <span className="inline-block text-[11px] text-fg-3 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5">{d}</span>
                        </div>
                      );
                      lastDay = d;
                    }
                    result.push(
                      <div key={m.id} className={cls('flex', m.senderId === me.id ? 'justify-end' : 'justify-start')}>
                        <div className={cls(
                          'max-w-[80%] rounded-r-3 px-3 py-2 text-sm',
                          m.senderId === me.id ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-fg-1'
                        )}>
                          {m.body}
                          <div className={cls('text-[10px] mt-1', m.senderId === me.id ? 'text-white/70' : 'text-fg-3')}>
                            {formatRelTime(m.createdAt, locale)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return result;
                })()}
                {active && typingBy[active.id] && (() => {
                  const typer = data.users.find((u) => u.id === typingBy[active.id]);
                  return (
                    <div className="flex justify-start" aria-live="polite">
                      <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-fg-3 text-xs px-3 py-2 rounded-r-3">
                        <span className="font-medium">{typer?.displayName}</span>
                        <span>{locale === 'en' ? 'is typing' : 'yazıyor'}</span>
                        <span className="inline-flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-fg-3 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 rounded-full bg-fg-3 animate-bounce" style={{ animationDelay: '120ms' }} />
                          <span className="w-1 h-1 rounded-full bg-fg-3 animate-bounce" style={{ animationDelay: '240ms' }} />
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* AI taslak yanıtlar */}
              {messages.slice(-1)[0]?.aiSuggestedReplies && (
                <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-fg-3 mr-1"><Sparkle size={12} weight="fill" className="text-brand-500" /> AI taslak:</span>
                  {messages.slice(-1)[0].aiSuggestedReplies!.map((s) => (
                    <button key={s} onClick={() => setDraft(s)} className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">{s}</button>
                  ))}
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Mesaj yazın…" className="flex-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]" aria-label="Mesaj" />
                <Button type="submit" iconLeft={<PaperPlaneRight size={16} />}>Gönder</Button>
              </form>
            </>
          ) : (
            <div className="grid place-items-center h-full text-fg-3 text-sm">Konuşma seçin</div>
          )}
        </Card>
      </div>
    </div>
  );
}
