// A09 Agent Orchestration & Workflow — plan-execute-reflect, HITL (human-in-the-loop)
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import {
  Robot, FlowArrow, CheckCircle, Warning, Clock, Sparkle, Play, Pause, ArrowsClockwise,
  GitBranch, Eye, ThumbsUp, ThumbsDown, X, Lightning, Brain, Hourglass, ListNumbers
} from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

type StepStatus = 'pending' | 'planning' | 'executing' | 'awaiting_human' | 'completed' | 'failed' | 'skipped';

interface AgentStep {
  id: string;
  num: number;
  type: 'plan' | 'tool_call' | 'human_approval' | 'reflect' | 'finalize';
  description: string;
  status: StepStatus;
  toolName?: string;
  input?: Record<string, unknown>;
  output?: string;
  durationMs?: number;
  startedAt?: string;
  humanNote?: string;
}

interface AgentRun {
  id: string;
  goal: string;
  agent: string;
  triggeredBy: string;
  startedAt: string;
  status: 'running' | 'paused' | 'awaiting_human' | 'completed' | 'failed';
  steps: AgentStep[];
  tokensUsed: number;
  costUsd: number;
}

const RUNS: AgentRun[] = [
  {
    id: 'run-001',
    goal: 'Beykoz bölgesindeki yeni ilanları tara, risk skorunu hesapla, yüksek riskli olanları admin onayına gönder',
    agent: 'admin-ops',
    triggeredBy: 'system.cron.daily',
    startedAt: '2026-05-14 09:00',
    status: 'awaiting_human',
    tokensUsed: 4280,
    costUsd: 0.0182,
    steps: [
      { id: 's1', num: 1, type: 'plan', description: '5 adımlı plan oluşturuldu', status: 'completed', durationMs: 820, output: '1) listing.search → 2) ai.risk_score (her biri için) → 3) filter risk>60 → 4) flag.for_review → 5) notify.admin' },
      { id: 's2', num: 2, type: 'tool_call', toolName: 'landx.listing.search', description: 'Beykoz ilanlarını ara', status: 'completed', input: { city: 'İstanbul', district: 'Beykoz', age: '24h' }, output: '14 ilan bulundu', durationMs: 240 },
      { id: 's3', num: 3, type: 'tool_call', toolName: 'landx.ai.risk_score', description: '14 ilanın risk skoru', status: 'completed', output: 'avg 32, max 78 (L-0142)', durationMs: 4820 },
      { id: 's4', num: 4, type: 'reflect', description: 'Plan kontrolü: 2 ilan yüksek risk', status: 'completed', output: 'L-0142 (78), L-0098 (66) — admin review gerekli' },
      { id: 's5', num: 5, type: 'human_approval', description: 'Admin: L-0142 review için manuel onay', status: 'awaiting_human', humanNote: 'TKGM şerh sebebi ipotek mi tedbir mi?' },
      { id: 's6', num: 6, type: 'tool_call', toolName: 'landx.notify.user', description: 'Admin\'e bildirim gönder', status: 'pending' },
      { id: 's7', num: 7, type: 'finalize', description: 'Özet rapor oluştur', status: 'pending' }
    ]
  },
  {
    id: 'run-002',
    goal: 'Bu hafta düşük performans gösteren ilanların satıcılarına özelleştirilmiş tavsiye gönder',
    agent: 'seller-assist',
    triggeredBy: 'admin@landx',
    startedAt: '2026-05-14 08:30',
    status: 'completed',
    tokensUsed: 8420,
    costUsd: 0.034,
    steps: [
      { id: 's1', num: 1, type: 'plan', description: 'Performance + suggestion plan', status: 'completed', durationMs: 920 },
      { id: 's2', num: 2, type: 'tool_call', toolName: 'landx.listing.performance', description: 'CTR < 2% ilanlar', status: 'completed', output: '12 ilan' },
      { id: 's3', num: 3, type: 'tool_call', toolName: 'landx.ai.suggestion', description: 'Her ilan için 3 öneri', status: 'completed', durationMs: 6240 },
      { id: 's4', num: 4, type: 'tool_call', toolName: 'landx.notify.user', description: '12 satıcıya gönder', status: 'completed' },
      { id: 's5', num: 5, type: 'finalize', description: 'Tamamlandı', status: 'completed' }
    ]
  },
  {
    id: 'run-003',
    goal: 'Şu anda Maslak\'ta arsa arıyorum, bütçem 8M-12M, 3 dönüm üzeri, yatırımlık. AI öneri üret.',
    agent: 'buyer-helper',
    triggeredBy: 'user@buyer',
    startedAt: '2026-05-14 14:22',
    status: 'running',
    tokensUsed: 1840,
    costUsd: 0.008,
    steps: [
      { id: 's1', num: 1, type: 'plan', description: '4 adımlı plan', status: 'completed', durationMs: 640 },
      { id: 's2', num: 2, type: 'tool_call', toolName: 'landx.listing.search', description: 'Filtreli arama', status: 'completed' },
      { id: 's3', num: 3, type: 'tool_call', toolName: 'landx.ai.value_estimate', description: '8 ilan için emsal', status: 'executing' },
      { id: 's4', num: 4, type: 'reflect', description: 'En iyi 3\'ü seç', status: 'pending' },
      { id: 's5', num: 5, type: 'finalize', description: 'Kullanıcıya sun', status: 'pending' }
    ]
  }
];

const STATUS_LABEL: Record<StepStatus, { tr: string; cls: string; Icon: typeof Clock }> = {
  pending: { tr: 'Bekliyor', cls: 'text-fg-3', Icon: Clock },
  planning: { tr: 'Planlanıyor', cls: 'text-sky-600', Icon: Brain },
  executing: { tr: 'Çalışıyor', cls: 'text-amber-600', Icon: Hourglass },
  awaiting_human: { tr: 'Onay bekleniyor', cls: 'text-rose-600', Icon: ThumbsUp },
  completed: { tr: 'Tamamlandı', cls: 'text-emerald-600', Icon: CheckCircle },
  failed: { tr: 'Hata', cls: 'text-rose-600', Icon: Warning },
  skipped: { tr: 'Atlandı', cls: 'text-fg-3', Icon: X }
};

const TYPE_ICON: Record<AgentStep['type'], { Icon: typeof Brain; color: string }> = {
  plan: { Icon: Brain, color: 'text-violet-600' },
  tool_call: { Icon: Lightning, color: 'text-amber-600' },
  human_approval: { Icon: ThumbsUp, color: 'text-rose-600' },
  reflect: { Icon: Sparkle, color: 'text-brand-600' },
  finalize: { Icon: CheckCircle, color: 'text-emerald-600' }
};

export default function AgentOrchestrationPage() {
  const [runs, setRuns] = useState<AgentRun[]>(RUNS);
  const [selected, setSelected] = useState<AgentRun | null>(RUNS[0]);

  function approveStep(runId: string, stepId: string) {
    setRuns((prev) => prev.map((r) => {
      if (r.id !== runId) return r;
      return {
        ...r,
        status: 'running',
        steps: r.steps.map((s) => s.id === stepId ? { ...s, status: 'completed' as StepStatus, humanNote: 'Onaylandı' } : s)
      };
    }));
    setSelected((s) => s && s.id === runId ? { ...s, status: 'running', steps: s.steps.map((x) => x.id === stepId ? { ...x, status: 'completed' as StepStatus } : x) } : s);
    toast('success', 'Onaylandı', 'Adım onaylandı, agent devam ediyor.');
  }
  function rejectStep(runId: string, stepId: string) {
    setRuns((prev) => prev.map((r) => r.id !== runId ? r : { ...r, status: 'failed', steps: r.steps.map((s) => s.id === stepId ? { ...s, status: 'failed' as StepStatus } : s) }));
    toast('warning', 'Reddedildi', 'Adım reddedildi, run iptal edildi.');
  }
  function pauseRun(runId: string) {
    setRuns((prev) => prev.map((r) => r.id !== runId ? r : { ...r, status: 'paused' }));
    toast('info', 'Duraklatıldı', 'Run duraklatıldı. İstediğinizde devam edebilirsiniz.');
  }
  function resumeRun(runId: string) {
    setRuns((prev) => prev.map((r) => r.id !== runId ? r : { ...r, status: 'running' }));
  }

  const running = runs.filter((r) => r.status === 'running').length;
  const awaiting = runs.filter((r) => r.status === 'awaiting_human').length;
  const completed = runs.filter((r) => r.status === 'completed').length;

  return (
    <div>
      <SectionHeading
        title="Agent Orchestration (A09)"
        description="Plan-Execute-Reflect döngüsü · Human-in-the-loop · Multi-step execution"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel A09</AiBadge>
            <Button size="sm" iconLeft={<Sparkle size={14} weight="fill" />} onClick={() => toast('ai', 'AI plan üretiyor', 'Mock: hedef girilince agent için 5 adımlı plan oluşturulur.')}>Yeni run</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Çalışıyor" value={running} icon={<Lightning size={20} weight="fill" />} />
        <Stat label="HITL bekliyor" value={awaiting} icon={<ThumbsUp size={20} weight="fill" />} hint="Onay gerekli" />
        <Stat label="Tamamlandı (24sa)" value={completed} icon={<CheckCircle size={20} weight="fill" />} />
        <Stat label="Multi-step başarı" value="78%" icon={<FlowArrow size={20} weight="fill" />} hint="Hedef >75%" />
        <Stat label="Avg adım sayısı" value="5.4" icon={<ListNumbers size={20} weight="fill" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <aside className="lg:col-span-1 space-y-2">
          {runs.map((r) => (
            <button key={r.id} onClick={() => setSelected(r)} className={cls(
              'w-full text-left p-3 rounded-r-3 border transition-colors',
              selected?.id === r.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}>
              <div className="flex items-center gap-2 mb-1">
                <Robot size={14} weight="duotone" className="text-brand-500 shrink-0" />
                <code className="text-[11px] text-fg-3 truncate flex-1">{r.agent}</code>
                <RunStatusDot status={r.status} />
              </div>
              <div className="text-sm font-medium line-clamp-2 mb-1">{r.goal}</div>
              <div className="text-[11px] text-fg-3 flex items-center gap-2">
                <span>{r.steps.filter((s) => s.status === 'completed').length}/{r.steps.length} adım</span>
                <span>·</span>
                <span>{r.tokensUsed.toLocaleString('tr-TR')} token</span>
              </div>
            </button>
          ))}
        </aside>

        <div className="lg:col-span-2">
          {selected && (
            <RunDetail
              run={selected}
              onApprove={(stepId) => approveStep(selected.id, stepId)}
              onReject={(stepId) => rejectStep(selected.id, stepId)}
              onPause={() => pauseRun(selected.id)}
              onResume={() => resumeRun(selected.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function RunStatusDot({ status }: { status: AgentRun['status'] }) {
  const map = {
    running: 'bg-emerald-500 animate-pulse',
    paused: 'bg-amber-500',
    awaiting_human: 'bg-rose-500 animate-pulse',
    completed: 'bg-emerald-600',
    failed: 'bg-rose-600'
  };
  return <span className={cls('w-2 h-2 rounded-full shrink-0', map[status])} title={status} />;
}

function RunDetail({ run, onApprove, onReject, onPause, onResume }: {
  run: AgentRun;
  onApprove: (stepId: string) => void;
  onReject: (stepId: string) => void;
  onPause: () => void;
  onResume: () => void;
}) {
  return (
    <Card>
      <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-2 mb-2">
          <Robot size={20} weight="duotone" className="text-brand-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium">{run.goal}</h3>
            <div className="text-xs text-fg-3 mt-1 flex flex-wrap items-center gap-2">
              <span>Agent: <code>{run.agent}</code></span>
              <span>·</span>
              <span>Tetikleyici: <code>{run.triggeredBy}</code></span>
              <span>·</span>
              <span>{run.startedAt}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {run.status === 'running' && <Button size="xs" variant="outline" iconLeft={<Pause size={12} />} onClick={onPause}>Duraklat</Button>}
            {run.status === 'paused' && <Button size="xs" iconLeft={<Play size={12} />} onClick={onResume}>Devam</Button>}
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-xs">
          <div><dt className="text-fg-3 uppercase tracking-wider">Token</dt><dd className="font-medium tabular-nums">{run.tokensUsed.toLocaleString('tr-TR')}</dd></div>
          <div><dt className="text-fg-3 uppercase tracking-wider">Maliyet</dt><dd className="font-medium tabular-nums">${run.costUsd.toFixed(4)}</dd></div>
          <div><dt className="text-fg-3 uppercase tracking-wider">İlerleme</dt><dd className="font-medium">{run.steps.filter((s) => s.status === 'completed').length}/{run.steps.length}</dd></div>
        </dl>
      </div>

      <ol className="relative space-y-2">
        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" aria-hidden />
        {run.steps.map((step) => <StepRow key={step.id} step={step} runId={run.id} onApprove={onApprove} onReject={onReject} />)}
      </ol>
    </Card>
  );
}

function StepRow({ step, runId, onApprove, onReject }: { step: AgentStep; runId: string; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const t = TYPE_ICON[step.type];
  const TypeIcon = t.Icon;
  const s = STATUS_LABEL[step.status];
  const StatusIcon = s.Icon;
  return (
    <li className="relative pl-9">
      <div className={cls('absolute left-0 top-0 w-7 h-7 rounded-full grid place-items-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900',
        step.status === 'completed' ? 'bg-emerald-500' :
          step.status === 'awaiting_human' ? 'bg-rose-500 animate-pulse' :
            step.status === 'executing' ? 'bg-amber-500 animate-pulse' :
              step.status === 'failed' ? 'bg-rose-600' :
                'bg-slate-400'
      )}>
        {step.num}
      </div>
      <div className={cls(
        'rounded-r-2 border p-2.5',
        step.status === 'awaiting_human' ? 'border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/20' :
          step.status === 'completed' ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' :
            'border-slate-200 dark:border-slate-800'
      )}>
        <div className="flex items-start gap-2">
          <TypeIcon size={14} weight="duotone" className={cls('shrink-0 mt-0.5', t.color)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{step.description}</span>
              <span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded', s.cls === 'text-fg-3' ? 'bg-slate-100 dark:bg-slate-800 text-fg-3' : `bg-current/10 ${s.cls}`)}>
                <StatusIcon size={10} weight="fill" className="inline mr-0.5" /> {s.tr}
              </span>
              {step.durationMs !== undefined && <span className="text-[10px] text-fg-3 tabular-nums">{step.durationMs}ms</span>}
            </div>
            {step.toolName && <code className="text-[11px] text-brand-700 dark:text-brand-300 block mt-1">tool: {step.toolName}</code>}
            {step.input && <pre className="text-[10px] text-fg-3 mt-1 bg-slate-100 dark:bg-slate-800 rounded p-1.5 overflow-x-auto">input: {JSON.stringify(step.input)}</pre>}
            {step.output && <div className="text-xs text-fg-2 mt-1 italic">→ {step.output}</div>}
            {step.humanNote && (
              <div className="mt-2 p-2 bg-rose-100 dark:bg-rose-900/30 rounded text-xs text-rose-900 dark:text-rose-200">
                <strong>Human input gerekli:</strong> {step.humanNote}
              </div>
            )}
            {step.status === 'awaiting_human' && (
              <div className="flex gap-1.5 mt-2">
                <Button size="xs" iconLeft={<ThumbsUp size={12} />} onClick={() => onApprove(step.id)}>Onayla & Devam</Button>
                <Button size="xs" variant="outline" iconLeft={<ThumbsDown size={12} />} onClick={() => onReject(step.id)}>Reddet</Button>
                <Button size="xs" variant="ghost" iconLeft={<GitBranch size={12} />} onClick={() => toast('info', 'Modify edildi', 'Mock — plan revize ediliyor.')}>Plan değiştir</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
