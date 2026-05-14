// ECA demo runner — periyodik mock olay üretip ECA engine ile değerlendirir,
// eşleşen kuralın aksiyonlarını notification olarak işler. Admin panelinde aktif.

import { nanoid } from 'nanoid';
import type { EcaEvent, EcaAction, Notification, NotifPriority } from '@/types/domain';
import { evaluate } from './engine';

interface RuntimeData {
  ecaRules: import('@/types/domain').EcaRule[];
  addNotification: (n: Notification) => void;
  upsertRule: (r: import('@/types/domain').EcaRule) => void;
}

interface MockEvent { event: EcaEvent; payload: Record<string, unknown>; describe: string; }

const MOCK_EVENTS: MockEvent[] = [
  { event: 'listing.created', payload: { tkgmStatus: 'ipotekli', tapuType: 'mustakil', imarType: 'konut', aiRiskScore: 65 }, describe: 'Yeni ilan — TKGM ipotekli' },
  { event: 'listing.price_changed', payload: { priceChangePct: 24 }, describe: 'Fiyat anomalisi — %24 değişim' },
  { event: 'offer.received', payload: { offerToListRatio: 0.93 }, describe: 'İyi teklif — liste fiyatının %93' },
  { event: 'message.received', payload: { responseLatencyHours: 27, isFirstInThread: true, body: 'Merhaba' }, describe: 'Yanıtsız mesaj — 27 saat' },
  { event: 'tkgm.flag_changed', payload: { newFlag: 'serh' }, describe: 'TKGM şerh — flag değişti' },
  { event: 'viewing.requested', payload: { count24h: 4 }, describe: 'Popüler ilan — günde 4 randevu' },
  { event: 'user.signed_up', payload: { roles: ['seller'], kycLevel: 'phone' }, describe: 'Yeni satıcı kaydı' },
  { event: 'listing.created', payload: { imarType: 'zeytinlik', tkgmStatus: 'temiz', tapuType: 'mustakil', features: ['Deniz manzaralı'], imageCount: 5 }, describe: 'Zeytinlik + deniz manzaralı yeni ilan' }
];

let timer: ReturnType<typeof setInterval> | null = null;

export function startDemoRunner(
  getRuntime: () => RuntimeData,
  recipientUserId: string,
  intervalMs = 30_000
): () => void {
  if (timer) clearInterval(timer);
  // İlk çalıştırmayı 6sn sonra yap, tarayıcının ısınması için
  const kick = setTimeout(() => tick(getRuntime, recipientUserId), 6000);
  timer = setInterval(() => tick(getRuntime, recipientUserId), intervalMs);
  return () => { clearTimeout(kick); if (timer) { clearInterval(timer); timer = null; } };
}

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function tick(getRuntime: () => RuntimeData, recipientUserId: string) {
  const rt = getRuntime();
  const ev = pickRandom(MOCK_EVENTS);
  const res = evaluate(ev.event, ev.payload, rt.ecaRules);
  if (res.matched.length === 0) return;
  for (const m of res.matched) {
    const notif = buildNotification(recipientUserId, m.ruleName, ev.describe, m.actions);
    rt.addNotification(notif);
    // history update
    const rule = rt.ecaRules.find((r) => r.id === m.ruleId);
    if (rule) {
      const updated = {
        ...rule,
        history: [
          { at: new Date().toISOString(), payload: ev.payload, matched: true, actionsRun: m.actions.map((a) => a.type) },
          ...rule.history.slice(0, 99)
        ]
      };
      rt.upsertRule(updated);
    }
  }
}

function buildNotification(userId: string, ruleName: string, describe: string, actions: EcaAction[]): Notification {
  const hasNow = actions.some((a) => (a.params as { priority?: NotifPriority }).priority === 'now') || /now|şimdi|acil/i.test(describe);
  return {
    id: `n-eca-${nanoid(6)}`,
    userId,
    channel: 'in_app',
    priority: hasNow ? 'now' : 'soon',
    title: `Kural tetiklendi: ${ruleName}`,
    body: `${describe} → ${actions.map((a) => a.type).join(', ')}`,
    icon: 'ph-flow-arrow',
    groupKey: 'eca-fired',
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/admin/rules'
  };
}
