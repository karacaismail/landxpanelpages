// S04 Workflow & State Machine — DocType lifecycle transitions, visual editor
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FlowArrow, Plus, Pencil, Trash, X, ArrowRight, CheckCircle, Warning, Clock, Sparkle,
  Eye, ShieldCheck, Lightning, GitBranch, FloppyDisk
} from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface State {
  id: string;
  name: string;
  label: string;
  type: 'initial' | 'normal' | 'final';
  color: string;
  description?: string;
}

interface Transition {
  id: string;
  from: string;
  to: string;
  trigger: string;
  guard?: string;
  action?: string;
  roles: string[];
  ai?: boolean;
}

interface Workflow {
  id: string;
  name: string;
  doctype: string;
  description: string;
  states: State[];
  transitions: Transition[];
  enabled: boolean;
  version: string;
}

const SAMPLE_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-listing', name: 'İlan Yaşam Döngüsü', doctype: 'Listing', version: '1.4',
    description: 'İlanın taslaktan satışa kadar olan tüm durumları', enabled: true,
    states: [
      { id: 's-draft', name: 'draft', label: 'Taslak', type: 'initial', color: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' },
      { id: 's-review', name: 'review', label: 'İncelemede', type: 'normal', color: 'bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200' },
      { id: 's-live', name: 'live', label: 'Yayında', type: 'normal', color: 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200' },
      { id: 's-sold', name: 'sold', label: 'Satıldı', type: 'final', color: 'bg-brand-200 dark:bg-brand-900/50 text-brand-900 dark:text-brand-200' },
      { id: 's-rejected', name: 'rejected', label: 'Reddedildi', type: 'final', color: 'bg-rose-200 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200' },
      { id: 's-paused', name: 'paused', label: 'Beklemede', type: 'normal', color: 'bg-sky-200 dark:bg-sky-900/50 text-sky-900 dark:text-sky-200' }
    ],
    transitions: [
      { id: 't1', from: 's-draft', to: 's-review', trigger: 'submit', roles: ['seller'], action: 'notify.admin' },
      { id: 't2', from: 's-review', to: 's-live', trigger: 'approve', roles: ['admin'], guard: 'aiRiskScore<60', ai: true, action: 'notify.seller + index.search' },
      { id: 't3', from: 's-review', to: 's-rejected', trigger: 'reject', roles: ['admin'], action: 'ai.draft_rejection_letter' },
      { id: 't4', from: 's-review', to: 's-draft', trigger: 'request_changes', roles: ['admin'] },
      { id: 't5', from: 's-live', to: 's-paused', trigger: 'pause', roles: ['seller', 'admin'] },
      { id: 't6', from: 's-paused', to: 's-live', trigger: 'resume', roles: ['seller', 'admin'] },
      { id: 't7', from: 's-live', to: 's-sold', trigger: 'mark_sold', roles: ['seller'], action: 'remove.index + notify.followers' },
      { id: 't8', from: 's-live', to: 's-rejected', trigger: 'admin_takedown', roles: ['admin'], guard: 'kvkk_violation', ai: true }
    ]
  },
  {
    id: 'wf-offer', name: 'Teklif Yaşam Döngüsü', doctype: 'Offer', version: '1.1',
    description: 'Teklif gönderildikten kapatma/red\'e kadar', enabled: true,
    states: [
      { id: 's-pending', name: 'pending', label: 'Bekliyor', type: 'initial', color: 'bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200' },
      { id: 's-counter', name: 'counter', label: 'Karşı teklif', type: 'normal', color: 'bg-sky-200 dark:bg-sky-900/50 text-sky-900 dark:text-sky-200' },
      { id: 's-accepted', name: 'accepted', label: 'Kabul edildi', type: 'final', color: 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200' },
      { id: 's-rejected', name: 'rejected', label: 'Red edildi', type: 'final', color: 'bg-rose-200 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200' },
      { id: 's-expired', name: 'expired', label: 'Süresi doldu', type: 'final', color: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' },
      { id: 's-withdrawn', name: 'withdrawn', label: 'Geri çekildi', type: 'final', color: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' }
    ],
    transitions: [
      { id: 't1', from: 's-pending', to: 's-accepted', trigger: 'accept', roles: ['seller'], action: 'notify.buyer + reserve.listing' },
      { id: 't2', from: 's-pending', to: 's-rejected', trigger: 'reject', roles: ['seller'], action: 'ai.suggest_counter' },
      { id: 't3', from: 's-pending', to: 's-counter', trigger: 'counter_offer', roles: ['seller'] },
      { id: 't4', from: 's-counter', to: 's-accepted', trigger: 'buyer_accept', roles: ['buyer'] },
      { id: 't5', from: 's-counter', to: 's-rejected', trigger: 'buyer_reject', roles: ['buyer'] },
      { id: 't6', from: 's-pending', to: 's-withdrawn', trigger: 'withdraw', roles: ['buyer'] },
      { id: 't7', from: 's-pending', to: 's-expired', trigger: 'system.expire', roles: ['system'], ai: false }
    ]
  },
  {
    id: 'wf-kyc', name: 'KYC Doğrulama', doctype: 'User', version: '2.0',
    description: 'Kullanıcı kimlik doğrulama akışı', enabled: true,
    states: [
      { id: 's-none', name: 'none', label: 'Yok', type: 'initial', color: 'bg-slate-200 dark:bg-slate-700' },
      { id: 's-phone', name: 'phone', label: 'Telefon ✓', type: 'normal', color: 'bg-sky-200 dark:bg-sky-900/50 text-sky-900 dark:text-sky-200' },
      { id: 's-address', name: 'address', label: 'Adres ✓', type: 'normal', color: 'bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200' },
      { id: 's-full', name: 'full', label: 'Tam ✓', type: 'final', color: 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200' }
    ],
    transitions: [
      { id: 't1', from: 's-none', to: 's-phone', trigger: 'verify_phone', roles: ['user'], action: 'sms.send_otp' },
      { id: 't2', from: 's-phone', to: 's-address', trigger: 'verify_address', roles: ['user'], action: 'address.validate' },
      { id: 't3', from: 's-address', to: 's-full', trigger: 'verify_identity', roles: ['user'], guard: 'edevlet_match', ai: false, action: 'badge.grant_verified' }
    ]
  }
];

export default function WorkflowDesignerPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(SAMPLE_WORKFLOWS);
  const [selected, setSelected] = useState<Workflow | null>(SAMPLE_WORKFLOWS[0]);
  const [editTr, setEditTr] = useState<Transition | null>(null);
  const [simulator, setSimulator] = useState<{ open: boolean; currentState: string }>({ open: false, currentState: '' });

  function updateWorkflow(w: Workflow) {
    setWorkflows((prev) => prev.map((x) => x.id === w.id ? w : x));
    setSelected(w);
  }

  function saveTransition(t: Transition) {
    if (!selected) return;
    const idx = selected.transitions.findIndex((x) => x.id === t.id);
    const nextTr = idx >= 0
      ? selected.transitions.map((x) => x.id === t.id ? t : x)
      : [...selected.transitions, t];
    updateWorkflow({ ...selected, transitions: nextTr });
    setEditTr(null);
    toast('success', 'Geçiş kaydedildi', `${t.trigger}: ${t.from}→${t.to}`);
  }

  function deleteTransition(id: string) {
    if (!selected) return;
    updateWorkflow({ ...selected, transitions: selected.transitions.filter((x) => x.id !== id) });
  }

  function addTransition() {
    if (!selected || selected.states.length < 2) return;
    setEditTr({
      id: `t-${Date.now().toString(36)}`,
      from: selected.states[0].id,
      to: selected.states[1].id,
      trigger: 'new_event',
      roles: []
    });
  }

  return (
    <div>
      <SectionHeading
        title="Workflow Designer (S04)"
        description="DocType yaşam döngüsü — durumlar, geçişler, guards, AI tetikleyiciler"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel S04</AiBadge>
            {selected && (
              <Button size="sm" variant="outline" iconLeft={<Eye size={14} />} onClick={() => setSimulator({ open: true, currentState: selected.states[0].id })}>
                Simüle et
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Workflow" value={workflows.length} icon={<FlowArrow size={20} weight="fill" />} hint={`${workflows.filter((w) => w.enabled).length} aktif`} />
        <Stat label="Toplam durum" value={workflows.reduce((s, w) => s + w.states.length, 0)} icon={<GitBranch size={20} weight="fill" />} />
        <Stat label="Geçiş kuralı" value={workflows.reduce((s, w) => s + w.transitions.length, 0)} icon={<ArrowRight size={20} weight="fill" />} />
        <Stat label="AI guarded" value={workflows.reduce((s, w) => s + w.transitions.filter((t) => t.ai).length, 0)} icon={<Sparkle size={20} weight="fill" />} />
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1 space-y-2">
          {workflows.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelected(w)}
              className={cls(
                'w-full text-left p-3 rounded-r-3 border transition-colors',
                selected?.id === w.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <div className="flex items-center gap-2">
                <FlowArrow size={16} weight="duotone" className="text-brand-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{w.name}</div>
                  <code className="text-[11px] text-fg-3">{w.doctype} · v{w.version}</code>
                </div>
                <span className={cls('w-1.5 h-1.5 rounded-full', w.enabled ? 'bg-emerald-500' : 'bg-slate-400')} />
              </div>
              <div className="text-[11px] text-fg-3 mt-1">{w.states.length} durum · {w.transitions.length} geçiş</div>
            </button>
          ))}
        </aside>

        {selected && (
          <div className="lg:col-span-3 space-y-3">
            <Card>
              <h3 className="font-medium mb-3 inline-flex items-center gap-2"><GitBranch size={14} /> Durum diyagramı</h3>
              <StateDiagram workflow={selected} />
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Geçişler ({selected.transitions.length})</h3>
                <Button size="xs" iconLeft={<Plus size={12} />} onClick={addTransition}>Geçiş ekle</Button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                    <th className="text-left py-2">Tetikleyici</th>
                    <th className="text-left py-2">Akış</th>
                    <th className="text-left py-2 hidden md:table-cell">Guard</th>
                    <th className="text-left py-2 hidden lg:table-cell">Aksiyon</th>
                    <th className="text-left py-2 hidden sm:table-cell">Roller</th>
                    <th className="text-right py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selected.transitions.map((t) => {
                    const fs = selected.states.find((s) => s.id === t.from);
                    const ts = selected.states.find((s) => s.id === t.to);
                    return (
                      <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <td className="py-2 font-mono text-xs">
                          {t.ai && <Sparkle size={10} weight="fill" className="inline text-brand-500 mr-0.5" />}
                          {t.trigger}
                        </td>
                        <td className="py-2 text-xs">
                          <span className={cls('inline-block px-1.5 py-0.5 rounded font-medium', fs?.color)}>{fs?.label}</span>
                          <ArrowRight size={10} className="inline mx-1 text-fg-3" />
                          <span className={cls('inline-block px-1.5 py-0.5 rounded font-medium', ts?.color)}>{ts?.label}</span>
                        </td>
                        <td className="py-2 text-xs text-fg-3 hidden md:table-cell"><code>{t.guard || '—'}</code></td>
                        <td className="py-2 text-xs text-fg-3 hidden lg:table-cell"><code>{t.action || '—'}</code></td>
                        <td className="py-2 text-xs hidden sm:table-cell">{t.roles.join(', ') || '—'}</td>
                        <td className="py-2 text-right">
                          <button onClick={() => setEditTr(t)} className="p-1 text-fg-3 hover:text-brand-600" aria-label="Düzenle"><Pencil size={12} /></button>
                          <button onClick={() => deleteTransition(t.id)} className="p-1 text-fg-3 hover:text-rose-600" aria-label="Sil"><Trash size={12} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>

            <Card>
              <h3 className="font-medium mb-2 inline-flex items-center gap-2"><ShieldCheck size={14} /> Doğrulama</h3>
              <ul className="text-sm space-y-1">
                <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> {selected.states.filter((s) => s.type === 'initial').length} başlangıç durumu</li>
                <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> {selected.states.filter((s) => s.type === 'final').length} terminal durum</li>
                <li className="inline-flex items-center gap-2">
                  {findOrphanStates(selected).length === 0
                    ? <><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Ulaşılamayan durum yok</>
                    : <><Warning size={14} weight="fill" className="text-amber-500" /> {findOrphanStates(selected).length} ulaşılamayan durum</>}
                </li>
                <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> ECA Hook & Event Bus (K04) bağlantısı aktif</li>
                <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> D01 Audit log her geçişte otomatik</li>
              </ul>
            </Card>
          </div>
        )}
      </div>

      {editTr && selected && <TransitionEditor transition={editTr} states={selected.states} onSave={saveTransition} onClose={() => setEditTr(null)} />}
      {simulator.open && selected && <Simulator workflow={selected} initialState={simulator.currentState} onClose={() => setSimulator({ open: false, currentState: '' })} />}
    </div>
  );
}

function findOrphanStates(w: Workflow): State[] {
  const reachable = new Set<string>(w.states.filter((s) => s.type === 'initial').map((s) => s.id));
  let changed = true;
  while (changed) {
    changed = false;
    w.transitions.forEach((t) => {
      if (reachable.has(t.from) && !reachable.has(t.to)) {
        reachable.add(t.to);
        changed = true;
      }
    });
  }
  return w.states.filter((s) => !reachable.has(s.id));
}

function StateDiagram({ workflow }: { workflow: Workflow }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-3 min-w-fit">
        {workflow.states.map((s, i) => {
          const outgoing = workflow.transitions.filter((t) => t.from === s.id);
          return (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center">
                <div className={cls(
                  'px-3 py-2 rounded-r-3 font-medium text-sm shadow-sm whitespace-nowrap',
                  s.color,
                  s.type === 'initial' && 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900',
                  s.type === 'final' && 'ring-2 ring-slate-500 ring-offset-2 dark:ring-offset-slate-900'
                )}>
                  {s.type === 'initial' && '▶ '}
                  {s.label}
                  {s.type === 'final' && ' ●'}
                </div>
                <code className="text-[10px] text-fg-3 mt-1">{s.name}</code>
                <div className="text-[10px] text-fg-3">{outgoing.length} çıkış</div>
              </div>
              {i < workflow.states.length - 1 && (
                <ArrowRight size={20} className="text-fg-3 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-fg-3 mt-3">▶ başlangıç · ● terminal · 3-noktalı kenar geçiş sayısını gösterir</p>
    </div>
  );
}

function TransitionEditor({ transition, states, onSave, onClose }: { transition: Transition; states: State[]; onSave: (t: Transition) => void; onClose: () => void }) {
  const [t, setT] = useState<Transition>(transition);
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium">Geçiş düzenle</h3>
          <button onClick={onClose}><X size={16} /></button>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Tetikleyici (event/trigger)</label>
          <input value={t.trigger} onChange={(e) => setT({ ...t, trigger: e.target.value })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Kaynak</label>
            <select value={t.from} onChange={(e) => setT({ ...t, from: e.target.value })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
              {states.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Hedef</label>
            <select value={t.to} onChange={(e) => setT({ ...t, to: e.target.value })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
              {states.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Guard (koşul, opsiyonel)</label>
          <input value={t.guard || ''} onChange={(e) => setT({ ...t, guard: e.target.value })} placeholder="aiRiskScore<60" className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Aksiyon (opsiyonel)</label>
          <input value={t.action || ''} onChange={(e) => setT({ ...t, action: e.target.value })} placeholder="notify.user + index.search" className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Roller (virgülle)</label>
          <input value={t.roles.join(', ')} onChange={(e) => setT({ ...t, roles: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} placeholder="admin, seller" className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={t.ai || false} onChange={(e) => setT({ ...t, ai: e.target.checked })} />
          <Sparkle size={12} weight="fill" className="text-brand-500" />
          AI tarafından otomatik tetiklenebilir
        </label>
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button size="sm" variant="ghost" onClick={onClose}>İptal</Button>
          <Button size="sm" iconLeft={<FloppyDisk size={14} />} onClick={() => onSave(t)}>Kaydet</Button>
        </div>
      </div>
    </div>
  );
}

function Simulator({ workflow, initialState, onClose }: { workflow: Workflow; initialState: string; onClose: () => void }) {
  const [current, setCurrent] = useState<string>(initialState);
  const [history, setHistory] = useState<{ at: string; from: string; to: string; trigger: string }[]>([]);
  const outgoing = useMemo(() => workflow.transitions.filter((t) => t.from === current), [current, workflow]);
  const currentState = workflow.states.find((s) => s.id === current);

  function fire(t: Transition) {
    setHistory((h) => [{ at: new Date().toLocaleTimeString('tr-TR'), from: t.from, to: t.to, trigger: t.trigger }, ...h]);
    setCurrent(t.to);
    if (t.action) toast('info', 'Aksiyon tetiklendi', t.action);
  }
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-medium inline-flex items-center gap-2"><Lightning size={16} weight="fill" className="text-amber-500" /> Workflow simülatörü — {workflow.name}</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <Card>
            <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Mevcut durum</div>
            <div className={cls('inline-block px-4 py-2 rounded-r-3 font-semibold text-lg', currentState?.color)}>
              {currentState?.label}
            </div>
            <div className="text-xs text-fg-3 mt-1">{currentState?.type === 'final' ? 'Terminal — geçiş yok' : `${outgoing.length} olası geçiş`}</div>
          </Card>

          <div>
            <h4 className="text-sm font-medium mb-2">Tetikleyiciler</h4>
            <div className="grid grid-cols-2 gap-2">
              {outgoing.length === 0 ? <div className="col-span-2 text-sm text-fg-3 italic">Bu terminal durumda hiç geçiş yok.</div> : outgoing.map((t) => {
                const ts = workflow.states.find((s) => s.id === t.to);
                return (
                  <button key={t.id} onClick={() => fire(t)} className="text-left p-2.5 rounded-r-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="font-mono text-sm font-medium inline-flex items-center gap-1.5">
                      {t.ai && <Sparkle size={12} weight="fill" className="text-brand-500" />}
                      {t.trigger}
                    </div>
                    <div className="text-xs text-fg-3 mt-0.5">→ {ts?.label}</div>
                    {t.guard && <div className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5">guard: {t.guard}</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {history.length > 0 && (
            <Card>
              <h4 className="text-sm font-medium mb-2 inline-flex items-center gap-2"><Clock size={14} /> Geçmiş ({history.length})</h4>
              <ul className="text-xs space-y-1">
                {history.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-fg-3 tabular-nums w-16">{h.at}</span>
                    <code className="text-brand-700 dark:text-brand-300">{h.trigger}</code>
                    <span className="text-fg-3">
                      {workflow.states.find((s) => s.id === h.from)?.label} → {workflow.states.find((s) => s.id === h.to)?.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-between">
          <Button size="sm" variant="ghost" onClick={() => { setCurrent(initialState); setHistory([]); }}>Sıfırla</Button>
          <Button size="sm" onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
}
