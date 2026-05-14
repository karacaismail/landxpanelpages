import { useState } from 'react';
import { Robot, CheckCircle, Clock, Hourglass, Stop, Sparkle, ArrowRight, PauseCircle, PlayCircle } from '@phosphor-icons/react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { cls } from '@/lib/utils/cls';

type TaskStatus = 'queued' | 'running' | 'awaiting_approval' | 'completed' | 'failed' | 'paused';
type StepStatus = 'pending' | 'running' | 'done' | 'approve' | 'failed';

interface Step {
  id: string;
  title: string;
  desc: string;
  status: StepStatus;
  durationMs?: number;
  cost?: number;
  hitl?: boolean;
}

interface AgentTask {
  id: string;
  title: string;
  agent: string;
  user: string;
  status: TaskStatus;
  startedAt: string;
  totalCost: number;
  totalTokens: number;
  steps: Step[];
}

const TASKS: AgentTask[] = [
  {
    id: 'at-001', title: 'Toplu onay — düşük riskli 8 ilan',
    agent: 'approval-runner-v1', user: 'admin-1', status: 'awaiting_approval',
    startedAt: '2026-05-12T16:22:00Z', totalCost: 0.024, totalTokens: 8200,
    steps: [
      { id: 's1', title: 'Planla', desc: '8 ilanın AI risk skorlarını topla, eşik altı olanları seç', status: 'done', durationMs: 1200 },
      { id: 's2', title: 'Filtrele', desc: 'Risk <30 + TKGM temiz + KYC tam → 6 ilan kaldı', status: 'done', durationMs: 800 },
      { id: 's3', title: 'AI özet üret', desc: 'Her ilanın gerekçeli özetini çıkar', status: 'done', durationMs: 4200, cost: 0.018 },
      { id: 's4', title: 'Onay noktası', desc: '6 ilanın toplu onaylanması için yöneticiden onay bekleniyor', status: 'approve', hitl: true },
      { id: 's5', title: 'Yayına al', desc: 'status = live, audit kaydet', status: 'pending' },
      { id: 's6', title: 'Rapor', desc: 'Sonuçları admin\'e bildir', status: 'pending' }
    ]
  },
  {
    id: 'at-002', title: 'Fiyat anomalisi tarama',
    agent: 'anomaly-scanner-v2', user: 'system', status: 'running',
    startedAt: '2026-05-12T17:01:00Z', totalCost: 0.011, totalTokens: 3700,
    steps: [
      { id: 's1', title: 'Aktif 184 ilanı tara', desc: 'Son 7 günde fiyat değiştiren ilanlar', status: 'done', durationMs: 2400 },
      { id: 's2', title: 'Z-skor hesapla', desc: 'Bölge ortalamasından >2.5 sapanlar', status: 'done', durationMs: 1100 },
      { id: 's3', title: 'AI gerekçe üret', desc: 'Her anomaliye sebep önerisi', status: 'running', durationMs: 3200, cost: 0.011 },
      { id: 's4', title: 'Tag ekle', desc: '"fiyat-anomali" tag\'i', status: 'pending' },
      { id: 's5', title: 'Admin bildir', desc: 'Bildirim merkezi + e-posta', status: 'pending' }
    ]
  },
  {
    id: 'at-003', title: 'Saved-search günlük bülten',
    agent: 'digest-builder-v1', user: 'system', status: 'completed',
    startedAt: '2026-05-12T08:00:00Z', totalCost: 0.078, totalTokens: 26500,
    steps: [
      { id: 's1', title: 'Kullanıcı listesi', desc: '22 kayıtlı arama, alarmı açık 11', status: 'done', durationMs: 320 },
      { id: 's2', title: 'Yeni eşleşme tara', desc: 'Son 24 saatte 19 yeni eşleşme', status: 'done', durationMs: 1700 },
      { id: 's3', title: 'AI bülten üret', desc: 'Her kullanıcı için kişisel özet', status: 'done', durationMs: 8200, cost: 0.078 },
      { id: 's4', title: 'E-posta gönder', desc: '11 outbox kaydı', status: 'done', durationMs: 540 },
      { id: 's5', title: 'Audit', desc: 'Hash chain güncellendi', status: 'done', durationMs: 90 }
    ]
  },
  {
    id: 'at-004', title: 'KYC hatırlatma akışı',
    agent: 'kyc-reminder-v1', user: 'system', status: 'paused',
    startedAt: '2026-05-11T22:10:00Z', totalCost: 0.003, totalTokens: 1100,
    steps: [
      { id: 's1', title: 'Bekleyen KYC bul', desc: '7 kullanıcı 48h+ pending', status: 'done', durationMs: 210 },
      { id: 's2', title: 'AI mektup taslağı', desc: 'Kişisel ton + step önerisi', status: 'done', durationMs: 2700, cost: 0.003 },
      { id: 's3', title: 'Yönetici inceleme', desc: 'İçerik onay bekliyor — duraklatıldı', status: 'approve', hitl: true },
      { id: 's4', title: 'Gönder', desc: 'In-app + e-posta', status: 'pending' }
    ]
  }
];

const STATUS_LABEL: Record<TaskStatus, { tr: string; color: string; Icon: typeof Clock }> = {
  queued: { tr: 'Sırada', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', Icon: Hourglass },
  running: { tr: 'Çalışıyor', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200', Icon: Clock },
  awaiting_approval: { tr: 'Onay bekliyor', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', Icon: PauseCircle },
  completed: { tr: 'Tamamlandı', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200', Icon: CheckCircle },
  failed: { tr: 'Başarısız', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200', Icon: Stop },
  paused: { tr: 'Duraklatıldı', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300', Icon: PauseCircle }
};

export default function AgentTasksPage() {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const list = TASKS.filter((t) => filter === 'all' || t.status === filter);
  const stats = {
    total: TASKS.length,
    running: TASKS.filter((t) => t.status === 'running').length,
    awaiting: TASKS.filter((t) => t.status === 'awaiting_approval').length,
    cost: TASKS.reduce((s, t) => s + t.totalCost, 0)
  };

  return (
    <div>
      <SectionHeading title="Agent Görevleri (A09)" description="Plan-execute-reflect döngüsü · multi-step · HITL onay" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Toplam" value={stats.total} icon={<Robot size={20} weight="fill" />} />
        <Stat label="Çalışıyor" value={stats.running} icon={<Clock size={20} weight="fill" />} />
        <Stat label="Onay bekliyor" value={stats.awaiting} icon={<PauseCircle size={20} weight="fill" />} />
        <Stat label="Maliyet (₺)" value={`$${stats.cost.toFixed(3)}`} icon={<Sparkle size={20} weight="fill" />} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Chip on={filter === 'all'} onClick={() => setFilter('all')}>Tümü ({TASKS.length})</Chip>
        {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => {
          const count = TASKS.filter((t) => t.status === s).length;
          return <Chip key={s} on={filter === s} onClick={() => setFilter(s)}>{STATUS_LABEL[s].tr} ({count})</Chip>;
        })}
      </div>

      <div className="space-y-3">
        {list.map((t) => <TaskCard key={t.id} task={t} />)}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cls('rounded-full px-3 py-1 text-xs border', on ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2')}>{children}</button>
  );
}

function TaskCard({ task }: { task: AgentTask }) {
  const s = STATUS_LABEL[task.status];
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-medium">{task.title}</h3>
          <div className="text-xs text-fg-3 mt-0.5">agent: <code>{task.agent}</code> · user: <code>{task.user}</code></div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={cls('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', s.color)}>
            <s.Icon size={12} weight="fill" /> {s.tr}
          </span>
          <span className="text-xs text-fg-3">{task.totalTokens.toLocaleString('tr-TR')} token · ${task.totalCost.toFixed(3)}</span>
        </div>
      </div>

      {/* Steps */}
      <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-2 mt-3 space-y-2 pl-4">
        {task.steps.map((step, i) => (
          <li key={step.id} className="relative">
            <span className={cls(
              'absolute -left-[22px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900',
              step.status === 'done' && 'bg-emerald-500',
              step.status === 'running' && 'bg-sky-500 animate-pulse',
              step.status === 'approve' && 'bg-amber-500',
              step.status === 'pending' && 'bg-slate-300 dark:bg-slate-700',
              step.status === 'failed' && 'bg-rose-500'
            )} />
            <div className="text-sm flex items-start justify-between gap-2">
              <div>
                <div className="font-medium inline-flex items-center gap-2">
                  {step.title}
                  {step.hitl && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">HITL</span>}
                </div>
                <div className="text-xs text-fg-3 mt-0.5">{step.desc}</div>
              </div>
              <div className="text-[11px] text-fg-3 shrink-0 text-right">
                {step.durationMs ? `${step.durationMs}ms` : '—'}
                {step.cost ? <div>${step.cost.toFixed(3)}</div> : null}
              </div>
            </div>
            {step.status === 'approve' && (
              <div className="mt-2 flex gap-2">
                <Button size="xs" variant="success">Onayla & devam</Button>
                <Button size="xs" variant="outline">Düzenle</Button>
                <Button size="xs" variant="danger">İptal</Button>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Footer actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        {task.status === 'running' && <Button size="xs" variant="outline" iconLeft={<PauseCircle size={12} />}>Duraklat</Button>}
        {task.status === 'paused' && <Button size="xs" variant="outline" iconLeft={<PlayCircle size={12} />}>Devam et</Button>}
        <Button size="xs" variant="ghost" iconLeft={<ArrowRight size={12} />}>Tam log</Button>
      </div>
    </Card>
  );
}
