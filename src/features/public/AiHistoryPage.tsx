// A11 Conversation & Session Management — multi-turn, branching, fork, resume
import { useMemo, useState } from 'react';
import { Sparkle, MagnifyingGlass, ChatCircleText, ArrowRight, GitBranch, Copy, Trash, Star, Tag, Funnel, Robot, ArrowsLeftRight, Clock, Lightning, FileText, X, Share } from '@phosphor-icons/react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { Stat } from '@/components/ui/Stat';
import { useAi } from '@/store/ai';
import { useUi } from '@/store/ui';
import { formatRelTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface Branch {
  id: string;
  parentMsgId: string;
  branchPoint: number;
  title: string;
  msgCount: number;
  divergence: string;
}

interface Conversation {
  id: string;
  title: string;
  startedAt: string;
  lastAt: string;
  msgCount: number;
  summary: string;
  tags: string[];
  starred: boolean;
  agent: 'general' | 'buyer-helper' | 'seller-assist' | 'admin-ops' | 'message-helper';
  tokens: number;
  cost: number;
  branches: Branch[];
}

const MOCK_HISTORY: Conversation[] = [
  {
    id: 'c-001', title: 'Beykoz tarla araması', startedAt: '2026-05-12T14:22:00Z', lastAt: '2026-05-13T09:14:00Z', msgCount: 18,
    summary: 'İstanbul Beykoz, 5000 m² imarlı, 2.5M altı; 4 ilan favoriye eklendi.', tags: ['arama', 'favoriler'], starred: true, agent: 'buyer-helper', tokens: 4280, cost: 0.018,
    branches: [
      { id: 'b-001a', parentMsgId: 'm-12', branchPoint: 12, title: '...ama 4M\'a kadar', msgCount: 6, divergence: 'Bütçe limitini artırınca' },
      { id: 'b-001b', parentMsgId: 'm-8', branchPoint: 8, title: '...Riva yerine Maslak', msgCount: 4, divergence: 'Bölge alternatifi' }
    ]
  },
  {
    id: 'c-002', title: 'Risk açıklaması — L0042', startedAt: '2026-05-11T10:08:00Z', lastAt: '2026-05-11T10:42:00Z', msgCount: 6,
    summary: 'TKGM şerh sebepleri ve yatırım uygunluğu.', tags: ['risk', 'TKGM'], starred: false, agent: 'general', tokens: 1240, cost: 0.005, branches: []
  },
  {
    id: 'c-003', title: 'Fiyat trendi sorgusu', startedAt: '2026-05-10T18:40:00Z', lastAt: '2026-05-10T19:02:00Z', msgCount: 9,
    summary: 'Çanakkale Bozcaada 12 aylık fiyat artışı.', tags: ['analiz', 'trend'], starred: false, agent: 'general', tokens: 2120, cost: 0.009,
    branches: [{ id: 'b-003a', parentMsgId: 'm-5', branchPoint: 5, title: '...İzmir karşılaştırma', msgCount: 8, divergence: 'Farklı şehir' }]
  },
  {
    id: 'c-004', title: 'Yeni ilan taslağı', startedAt: '2026-05-09T09:15:00Z', lastAt: '2026-05-09T11:48:00Z', msgCount: 22,
    summary: 'Bursa İznik 3000 m² için başlık + açıklama önerileri.', tags: ['ilan-oluştur', 'AI-yazım'], starred: true, agent: 'seller-assist', tokens: 6840, cost: 0.028, branches: []
  },
  {
    id: 'c-005', title: 'TKGM hata kodları', startedAt: '2026-05-07T16:55:00Z', lastAt: '2026-05-07T17:08:00Z', msgCount: 5,
    summary: 'E001 vs E002 farkı.', tags: ['TKGM', 'destek'], starred: false, agent: 'admin-ops', tokens: 820, cost: 0.003, branches: []
  },
  {
    id: 'c-006', title: 'Pazarlık mesajı taslağı', startedAt: '2026-05-06T13:30:00Z', lastAt: '2026-05-06T13:46:00Z', msgCount: 8,
    summary: 'L0091 ilanı için %12 indirim önerisi mesajı.', tags: ['pazarlık', 'mesaj'], starred: false, agent: 'message-helper', tokens: 1640, cost: 0.007, branches: []
  }
];

const AGENT_LABEL: Record<Conversation['agent'], { tr: string; color: string }> = {
  'general': { tr: 'Genel', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  'buyer-helper': { tr: 'Alıcı yardımcısı', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  'seller-assist': { tr: 'Satıcı asistanı', color: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300' },
  'admin-ops': { tr: 'Admin Ops', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  'message-helper': { tr: 'Mesaj yardımcısı', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' }
};

export default function AiHistoryPage() {
  const ai = useAi();
  const ui = useUi();
  const [q, setQ] = useState('');
  const [agentFilter, setAgentFilter] = useState<'all' | Conversation['agent']>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [starredOnly, setStarredOnly] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_HISTORY);
  const [selected, setSelected] = useState<Conversation | null>(MOCK_HISTORY[0]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    conversations.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [conversations]);

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (starredOnly && !c.starred) return false;
      if (agentFilter !== 'all' && c.agent !== agentFilter) return false;
      if (tagFilter !== 'all' && !c.tags.includes(tagFilter)) return false;
      if (q.trim()) {
        const nq = q.toLocaleLowerCase('tr-TR');
        if (!((c.title + ' ' + c.summary + ' ' + c.tags.join(' ')).toLocaleLowerCase('tr-TR').includes(nq))) return false;
      }
      return true;
    });
  }, [conversations, q, agentFilter, tagFilter, starredOnly]);

  function toggleStar(id: string) {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, starred: !c.starred } : c));
    if (selected?.id === id) setSelected((s) => s ? { ...s, starred: !s.starred } : s);
  }
  function fork(c: Conversation, branchPoint: number) {
    const newId = `c-fork-${Date.now().toString(36)}`;
    const newC: Conversation = {
      ...c, id: newId, title: c.title + ' (fork)', startedAt: new Date().toISOString(), lastAt: new Date().toISOString(),
      msgCount: branchPoint, summary: 'Fork edildi — ' + c.summary,
      branches: []
    };
    setConversations((prev) => [newC, ...prev]);
    toast('success', 'Fork edildi', `${branchPoint} mesajdan sonra yeni dal başlatıldı.`);
  }
  function resume(c: Conversation) {
    ui.setAssistant(true);
    toast('info', 'Oturum devam ediyor', `${c.title} — ${c.msgCount} mesajdan devam ediyor (mock).`);
  }
  function shareConv(c: Conversation) {
    navigator.clipboard?.writeText(`landx://share/conv/${c.id}`);
    toast('success', 'Bağlantı kopyalandı', 'Read-only paylaşım linki panoya kopyalandı.');
  }
  function deleteConv(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
    toast('warning', 'Konuşma silindi', 'KVKK uyumlu: 30 gün soft-delete.');
  }

  const totalTokens = conversations.reduce((s, c) => s + c.tokens, 0);
  const totalCost = conversations.reduce((s, c) => s + c.cost, 0);
  const totalBranches = conversations.reduce((s, c) => s + c.branches.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading
        title="AI Konuşma Yöneticisi (A11)"
        description="Multi-turn context, branching, fork, paylaşım"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel A11</AiBadge>
            <Button onClick={() => ui.setAssistant(true)} iconLeft={<Sparkle size={16} weight="fill" />}>Yeni sohbet</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
        <Stat label="Konuşma" value={conversations.length} icon={<ChatCircleText size={16} weight="fill" />} />
        <Stat label="Toplam mesaj" value={conversations.reduce((s, c) => s + c.msgCount, 0)} icon={<ChatCircleText size={16} weight="fill" />} />
        <Stat label="Branch" value={totalBranches} icon={<GitBranch size={16} weight="fill" />} hint="Fork edilmiş" />
        <Stat label="Token (toplam)" value={`${(totalTokens / 1000).toFixed(1)}K`} icon={<Lightning size={16} weight="fill" />} />
        <Stat label="Maliyet" value={`$${totalCost.toFixed(3)}`} icon={<Sparkle size={16} weight="fill" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <aside className="lg:col-span-1 space-y-3">
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Konuşma ara"
              className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm min-h-[40px]" />
          </div>

          <div className="flex flex-wrap gap-1">
            <button onClick={() => setStarredOnly((v) => !v)} className={cls('text-[11px] px-2 py-1 rounded-full border inline-flex items-center gap-1', starredOnly ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300' : 'border-slate-300 dark:border-slate-700')}>
              <Star size={10} weight={starredOnly ? 'fill' : 'regular'} /> Yıldızlı
            </button>
          </div>

          <Card className="!p-2">
            <div className="text-[10px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5 inline-flex items-center gap-1"><Robot size={10} /> Agent</div>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setAgentFilter('all')} className={cls('text-[10px] px-2 py-0.5 rounded-full', agentFilter === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-fg-3')}>Tümü</button>
              {(Object.keys(AGENT_LABEL) as Conversation['agent'][]).map((a) => {
                const c = conversations.filter((x) => x.agent === a).length;
                if (c === 0) return null;
                return (
                  <button key={a} onClick={() => setAgentFilter(a)} className={cls('text-[10px] px-2 py-0.5 rounded-full', agentFilter === a ? AGENT_LABEL[a].color + ' ring-2 ring-current' : AGENT_LABEL[a].color)}>
                    {AGENT_LABEL[a].tr} ({c})
                  </button>
                );
              })}
            </div>
          </Card>

          {allTags.length > 0 && (
            <Card className="!p-2">
              <div className="text-[10px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5 inline-flex items-center gap-1"><Tag size={10} /> Etiket</div>
              <div className="flex flex-wrap gap-1">
                <button onClick={() => setTagFilter('all')} className={cls('text-[10px] px-2 py-0.5 rounded-full', tagFilter === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-fg-3')}>Tümü</button>
                {allTags.map((t) => (
                  <button key={t} onClick={() => setTagFilter(t)} className={cls('text-[10px] px-2 py-0.5 rounded-full', tagFilter === t ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-fg-3')}>
                    #{t}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {filtered.length === 0 ? (
            <EmptyState title="Sonuç yok" description="Farklı filtre deneyin." />
          ) : (
            <ul className="space-y-1.5">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c)}
                    className={cls(
                      'w-full text-left p-2 rounded-r-3 border transition-colors',
                      selected?.id === c.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <ChatCircleText size={16} weight="duotone" className="text-brand-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {c.starred && <Star size={10} weight="fill" className="text-amber-500" />}
                          <div className="font-medium text-sm truncate">{c.title}</div>
                        </div>
                        <div className="text-[11px] text-fg-3 mt-0.5">{c.msgCount} mesaj · {formatRelTime(c.lastAt)}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className={cls('text-[9px] px-1 rounded-full', AGENT_LABEL[c.agent].color)}>{AGENT_LABEL[c.agent].tr}</span>
                          {c.branches.length > 0 && <span className="text-[9px] px-1 rounded-full bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 inline-flex items-center gap-0.5"><GitBranch size={8} /> {c.branches.length}</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="lg:col-span-2">
          {selected ? <ConversationDetail conv={selected} onStar={() => toggleStar(selected.id)} onFork={(p) => fork(selected, p)} onResume={() => resume(selected)} onShare={() => shareConv(selected)} onDelete={() => deleteConv(selected.id)} /> : (
            <Card className="text-center py-12 text-fg-3">Konuşma seçin</Card>
          )}
        </div>
      </div>

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

function ConversationDetail({ conv, onStar, onFork, onResume, onShare, onDelete }: {
  conv: Conversation;
  onStar: () => void;
  onFork: (point: number) => void;
  onResume: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  const [forkOpen, setForkOpen] = useState(false);
  const [forkPoint, setForkPoint] = useState(Math.max(1, conv.msgCount - 4));
  return (
    <Card>
      <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold">{conv.title}</h3>
            <button onClick={onStar} className={cls('p-1 rounded', conv.starred ? 'text-amber-500' : 'text-fg-3 hover:text-amber-500')}>
              <Star size={16} weight={conv.starred ? 'fill' : 'regular'} />
            </button>
          </div>
          <p className="text-sm text-fg-3 mt-1">{conv.summary}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className={cls('text-[10px] px-1.5 py-0.5 rounded-full', AGENT_LABEL[conv.agent].color)}>
              <Robot size={10} weight="fill" className="inline mr-0.5" /> {AGENT_LABEL[conv.agent].tr}
            </span>
            {conv.tags.map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-fg-3">#{t}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <Button size="xs" iconLeft={<ArrowsLeftRight size={12} />} onClick={onResume}>Devam et</Button>
          <Button size="xs" variant="outline" iconLeft={<GitBranch size={12} />} onClick={() => setForkOpen(true)}>Fork</Button>
          <Button size="xs" variant="outline" iconLeft={<Share size={12} />} onClick={onShare}>Paylaş</Button>
          <Button size="xs" variant="ghost" iconLeft={<Trash size={12} />} onClick={onDelete}>Sil</Button>
        </div>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2 text-xs mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div><dt className="text-fg-3 uppercase tracking-wider">Başlangıç</dt><dd className="font-medium">{formatRelTime(conv.startedAt)}</dd></div>
        <div><dt className="text-fg-3 uppercase tracking-wider">Son aktivite</dt><dd className="font-medium">{formatRelTime(conv.lastAt)}</dd></div>
        <div><dt className="text-fg-3 uppercase tracking-wider">Token</dt><dd className="font-medium tabular-nums">{conv.tokens.toLocaleString('tr-TR')}</dd></div>
        <div><dt className="text-fg-3 uppercase tracking-wider">Maliyet</dt><dd className="font-medium tabular-nums">${conv.cost.toFixed(3)}</dd></div>
      </dl>

      {conv.branches.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2 inline-flex items-center gap-2"><GitBranch size={14} weight="fill" className="text-fuchsia-500" /> Dallar ({conv.branches.length})</h4>
          <div className="space-y-2">
            {/* Tree visualization */}
            <div className="relative pl-6 space-y-2">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="relative">
                <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
                <div className="text-xs font-medium">Ana dal · {conv.msgCount} mesaj</div>
                <div className="text-[11px] text-fg-3">{conv.title}</div>
              </div>
              {conv.branches.map((b) => (
                <div key={b.id} className="relative">
                  <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-fuchsia-500 ring-2 ring-white dark:ring-slate-900" />
                  <div className="absolute -left-4 top-1 w-4 h-4 border-l-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-bl" style={{ left: '-1rem', top: '-0.25rem' }} />
                  <div className="text-xs font-medium">{b.title}</div>
                  <div className="text-[11px] text-fg-3">
                    {b.msgCount} mesaj · {b.branchPoint}. mesajdan ayrıldı · <em>{b.divergence}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2 inline-flex items-center gap-2"><Clock size={14} /> Mesaj akışı (özet)</h4>
        <div className="space-y-1.5 text-sm">
          {Array.from({ length: Math.min(8, conv.msgCount) }, (_, i) => {
            const isUser = i % 2 === 0;
            return (
              <div key={i} className={cls('flex gap-2', isUser ? 'flex-row' : 'flex-row-reverse')}>
                <span className={cls('text-[10px] uppercase font-bold w-12 shrink-0 mt-1', isUser ? 'text-fg-3' : 'text-brand-600 dark:text-brand-400')}>
                  {isUser ? 'Siz' : 'AI'}
                </span>
                <div className={cls('flex-1 rounded-r-2 px-3 py-1.5 text-xs', isUser ? 'bg-slate-100 dark:bg-slate-800' : 'bg-brand-50 dark:bg-brand-900/30')}>
                  <em className="text-fg-3">[Mesaj {i + 1} — özet preview]</em>
                </div>
              </div>
            );
          })}
          {conv.msgCount > 8 && (
            <div className="text-center text-[11px] text-fg-3 py-1">
              ... {conv.msgCount - 8} mesaj daha. <button onClick={onResume} className="text-brand-600 hover:underline">Tümünü gör →</button>
            </div>
          )}
        </div>
      </div>

      {forkOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={() => setForkOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium inline-flex items-center gap-2"><GitBranch size={16} weight="fill" className="text-fuchsia-500" /> Fork: yeni dal başlat</h3>
              <button onClick={() => setForkOpen(false)}><X size={16} /></button>
            </div>
            <p className="text-sm text-fg-3">
              Bu konuşmanın ilk <strong>{forkPoint}</strong> mesajını koru, sonrası farklı şekilde devam etsin.
              Hipotezleri test etmek veya alternatif yolları denemek için idealdir.
            </p>
            <input
              type="range"
              min={1}
              max={Math.max(1, conv.msgCount - 1)}
              value={forkPoint}
              onChange={(e) => setForkPoint(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm">
              <strong>{forkPoint}</strong> / {conv.msgCount} mesaja kadar
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setForkOpen(false)}>İptal</Button>
              <Button size="sm" onClick={() => { onFork(forkPoint); setForkOpen(false); }}>Fork başlat</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
