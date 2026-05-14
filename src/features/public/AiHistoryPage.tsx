import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, MagnifyingGlass, ChatCircleText, ArrowRight } from '@phosphor-icons/react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAi } from '@/store/ai';
import { useUi } from '@/store/ui';
import { formatRelTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';

// Mock conversation buckets (A11)
const MOCK_HISTORY = [
  { id: 'c-001', title: 'Beykoz tarla araması', startedAt: '2026-05-12T14:22:00Z', msgCount: 18, summary: 'İstanbul Beykoz, 5000 m² imarlı, 2.5M altı; 4 ilan favoriye eklendi.' },
  { id: 'c-002', title: 'Risk açıklaması — L0042', startedAt: '2026-05-11T10:08:00Z', msgCount: 6, summary: 'TKGM şerh sebepleri ve yatırım uygunluğu.' },
  { id: 'c-003', title: 'Fiyat trendi sorgusu', startedAt: '2026-05-10T18:40:00Z', msgCount: 9, summary: 'Çanakkale Bozcaada 12 aylık fiyat artışı.' },
  { id: 'c-004', title: 'Yeni ilan taslağı', startedAt: '2026-05-09T09:15:00Z', msgCount: 22, summary: 'Bursa İznik 3000 m² için başlık + açıklama önerileri.' },
  { id: 'c-005', title: 'TKGM hata kodları', startedAt: '2026-05-07T16:55:00Z', msgCount: 5, summary: 'E001 vs E002 farkı.' }
];

export default function AiHistoryPage() {
  const ai = useAi();
  const ui = useUi();
  const [q, setQ] = useState('');
  const liveTurns = useMemo(() => {
    if (!q.trim()) return MOCK_HISTORY;
    const nq = q.toLocaleLowerCase('tr-TR');
    return MOCK_HISTORY.filter((h) => (h.title + ' ' + h.summary).toLocaleLowerCase('tr-TR').includes(nq));
  }, [q]);

  return (
    <div className="max-w-3xl mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title="AI Konuşma Geçmişi (A11)" description="Yardımcıyla geçmiş sohbetleriniz" actions={
        <Button onClick={() => ui.setAssistant(true)} iconLeft={<Sparkle size={16} weight="fill" />}>Yeni sohbet</Button>
      } />

      <div className="relative max-w-sm mb-4">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Konuşma ara"
          className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm min-h-[40px]" />
      </div>

      {liveTurns.length === 0 ? (
        <EmptyState title="Sonuç yok" description="Farklı bir anahtar deneyin." />
      ) : (
        <ul className="space-y-2">
          {liveTurns.map((c) => (
            <li key={c.id}>
              <Card padding="sm" className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-r-2 bg-brand-50 dark:bg-brand-900/30 grid place-items-center text-brand-600 shrink-0"><ChatCircleText size={20} weight="duotone" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => ui.setAssistant(true)} className="font-medium hover:text-brand-600 text-left truncate">{c.title}</button>
                    <span className="text-xs text-fg-3 shrink-0">{formatRelTime(c.startedAt)}</span>
                  </div>
                  <div className="text-xs text-fg-3 mt-0.5 truncate">{c.summary}</div>
                  <div className="text-[11px] text-fg-4 mt-1">{c.msgCount} mesaj</div>
                </div>
                <ArrowRight size={14} className="text-fg-3 mt-3" />
              </Card>
            </li>
          ))}
        </ul>
      )}

      {ai.history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Sparkle size={14} weight="fill" className="text-brand-500" /> Aktif oturum</h3>
          <Card>
            <ul className="space-y-1 text-sm">
              {ai.history.slice(-5).map((m) => (
                <li key={m.id} className={cls('truncate', m.role === 'user' ? 'text-fg-1' : 'text-fg-3')}>
                  <strong className="mr-1">{m.role === 'user' ? '→' : '←'}</strong>{m.content}
                </li>
              ))}
            </ul>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => ai.reset()}>Oturum geçmişini temizle</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
