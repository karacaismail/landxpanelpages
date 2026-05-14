import { useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { CheckCircle, CircleHalf, XCircle, ShieldCheck, FileText, Clock, Download, Sparkle } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

type Status = 'green' | 'amber' | 'red';

interface Control {
  id: string;
  framework: 'KVKK' | 'VERBİS' | 'GDPR' | 'SOC2' | 'ISO27001';
  label: string;
  status: Status;
  evidence: string;
  evidenceDate: string;
  owner: string;
}

const CONTROLS: Control[] = [
  { id: 'KVKK-7',      framework: 'KVKK',     label: 'Madde 7 — Silme/yok etme hakkı',          status: 'green', evidence: 'Otomatik DSAR akışı (Profil>Hesap silme)', evidenceDate: '2026-05-10', owner: 'Compliance' },
  { id: 'KVKK-11',     framework: 'KVKK',     label: 'Madde 11 — Erişim hakkı',                 status: 'green', evidence: 'Verilerimi dışa aktar (json)',           evidenceDate: '2026-05-10', owner: 'Compliance' },
  { id: 'KVKK-12',     framework: 'KVKK',     label: 'Madde 12 — Veri güvenliği',               status: 'green', evidence: 'AES-256 at rest, TLS 1.3 in flight',     evidenceDate: '2026-05-08', owner: 'Security' },
  { id: 'VERBİS-1',    framework: 'VERBİS',   label: 'VERBİS kayıt güncellemesi',               status: 'amber', evidence: 'Q2 güncellemesi onay bekliyor',          evidenceDate: '2026-04-22', owner: 'Compliance' },
  { id: 'GDPR-30',     framework: 'GDPR',     label: 'Article 30 — Records of processing',      status: 'green', evidence: 'docs/data-schema.md',                    evidenceDate: '2026-05-12', owner: 'Compliance' },
  { id: 'GDPR-33',     framework: 'GDPR',     label: 'Article 33 — Breach notification',        status: 'green', evidence: 'On-call runbook',                        evidenceDate: '2026-04-30', owner: 'Security' },
  { id: 'GDPR-35',     framework: 'GDPR',     label: 'Article 35 — DPIA',                       status: 'amber', evidence: 'AI feature DPIA taslakta',                evidenceDate: '2026-05-05', owner: 'Compliance' },
  { id: 'SOC2-CC1',    framework: 'SOC2',     label: 'CC1 — Control environment',               status: 'green', evidence: 'Org chart + policies',                   evidenceDate: '2026-04-28', owner: 'Operations' },
  { id: 'SOC2-CC6',    framework: 'SOC2',     label: 'CC6 — Logical access controls',           status: 'amber', evidence: 'I04 enforcement test eksik',             evidenceDate: '2026-04-15', owner: 'Engineering' },
  { id: 'SOC2-CC7',    framework: 'SOC2',     label: 'CC7 — System operations & monitoring',    status: 'green', evidence: 'O01 dashboard + alerts',                 evidenceDate: '2026-05-11', owner: 'Operations' },
  { id: 'SOC2-CC8',    framework: 'SOC2',     label: 'CC8 — Change management',                 status: 'green', evidence: 'CI/CD + PR review',                       evidenceDate: '2026-05-11', owner: 'Engineering' },
  { id: 'ISO27001-A8', framework: 'ISO27001', label: 'A.8.16 — Monitoring activities',          status: 'amber', evidence: 'SIEM yapılandırma kısmi',                 evidenceDate: '2026-04-20', owner: 'Security' },
  { id: 'PEN-TEST',    framework: 'ISO27001', label: 'Yıllık pentest',                          status: 'red',   evidence: 'Planlanmadı',                            evidenceDate: '—',          owner: 'Security' }
];

const DSARS = [
  { id: 'd-001', user: 'rosekaraca@…', type: 'erişim', received: '2026-05-11', deadline: '2026-08-09', status: 'işleniyor' },
  { id: 'd-002', user: 'mehmet@…',     type: 'silme',  received: '2026-05-08', deadline: '2026-08-06', status: 'tamamlandı' },
  { id: 'd-003', user: 'ayse@…',       type: 'silme',  received: '2026-05-05', deadline: '2026-08-03', status: 'işleniyor' }
];

export default function CompliancePage() {
  const [framework, setFramework] = useState<'all' | Control['framework']>('all');
  const list = CONTROLS.filter((c) => framework === 'all' || c.framework === framework);
  const score = Math.round((list.filter((c) => c.status === 'green').length / list.length) * 100);
  const greenCount = CONTROLS.filter((c) => c.status === 'green').length;
  const amberCount = CONTROLS.filter((c) => c.status === 'amber').length;
  const redCount   = CONTROLS.filter((c) => c.status === 'red').length;
  const frameworks: Array<'all' | Control['framework']> = ['all', 'KVKK', 'VERBİS', 'GDPR', 'SOC2', 'ISO27001'];

  return (
    <div>
      <SectionHeading title="Uyumluluk Çerçevesi (D03)" description="KVKK · VERBİS · GDPR · SOC2 · ISO27001 — kontrol matrisi + DSAR + kanıt zinciri" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Posture skoru" value={`${score}/100`} icon={<ShieldCheck size={20} weight="fill" />} hint={framework === 'all' ? 'Tüm framework' : framework} />
        <Stat label="Kontroller" value={`${greenCount}✓ ${amberCount}⚠ ${redCount}✗`} icon={<FileText size={20} weight="fill" />} />
        <Stat label="DSAR — açık" value={DSARS.filter((d) => d.status === 'işleniyor').length} icon={<Clock size={20} weight="fill" />} hint="Yasal süre 90 gün" />
        <Stat label="Kanıt tazeliği" value="22 gün" icon={<Sparkle size={20} weight="fill" />} hint="Ortalama" />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {frameworks.map((f) => (
          <button key={f} onClick={() => setFramework(f)} className={cls('rounded-full px-3 py-1 text-xs border', framework === f ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2')}>
            {f === 'all' ? 'Tümü' : f} {f !== 'all' && <span className="text-fg-3 ml-0.5">({CONTROLS.filter((c) => c.framework === f).length})</span>}
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <h3 className="font-medium mb-3">Kontrol matrisi ({list.length})</h3>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {list.map((c) => (
            <li key={c.id} className="py-2 flex items-center gap-3">
              {c.status === 'green' && <CheckCircle weight="fill" size={20} className="text-emerald-500 shrink-0" />}
              {c.status === 'amber' && <CircleHalf weight="fill" size={20} className="text-amber-500 shrink-0" />}
              {c.status === 'red' && <XCircle weight="fill" size={20} className="text-rose-500 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm flex items-center gap-2">
                  <code className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-fg-3">{c.framework}</code>
                  <span className="truncate">{c.label}</span>
                </div>
                <div className="text-xs text-fg-3 mt-0.5">{c.evidence}</div>
              </div>
              <span className="text-xs text-fg-3 hidden md:inline">{c.owner}</span>
              <span className="text-xs text-fg-3 hidden lg:inline">{c.evidenceDate}</span>
              <code className="text-[10px] text-fg-3 shrink-0">{c.id}</code>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium inline-flex items-center gap-2"><Clock size={16} weight="duotone" /> DSAR (Data Subject Access Requests)</h3>
          <Button size="xs" variant="outline" iconLeft={<Download size={12} />}>Yıllık raporu dışa aktar</Button>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {DSARS.map((d) => (
            <li key={d.id} className="py-2 flex items-center gap-3">
              <code className="text-xs text-fg-3 shrink-0">{d.id}</code>
              <span className="flex-1 truncate">{d.user}</span>
              <span className="text-xs text-fg-3">{d.type}</span>
              <span className="text-xs text-fg-3 hidden md:inline">alındı {d.received}</span>
              <span className="text-xs text-fg-3 hidden md:inline">son tarih {d.deadline}</span>
              <span className={cls('text-xs px-2 py-0.5 rounded-full font-medium', d.status === 'tamamlandı' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200')}>{d.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
