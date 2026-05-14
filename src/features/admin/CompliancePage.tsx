import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { CheckCircle, CircleHalf, XCircle, ShieldCheck } from '@phosphor-icons/react';

const CONTROLS = [
  { id: 'kvkk-7', label: 'KVKK m.7 — Silme/yok etme', status: 'green', evidence: 'Otomatik DSAR akışı' },
  { id: 'kvkk-11', label: 'KVKK m.11 — Erişim hakkı', status: 'green', evidence: 'Profil > Verilerimi dışa aktar' },
  { id: 'verbis', label: 'VERBİS bildirim', status: 'amber', evidence: 'Manuel onay bekliyor' },
  { id: 'gdpr-30', label: 'GDPR Article 30 records', status: 'green', evidence: 'data-schema.md' },
  { id: 'soc2-cc6', label: 'SOC2 CC6 — Logical access', status: 'amber', evidence: 'I04 enforcement test edilmedi' },
  { id: 'soc2-cc7', label: 'SOC2 CC7 — System operations', status: 'green', evidence: 'O01 dashboard' },
  { id: 'pen-test', label: 'Yıllık pentest', status: 'red', evidence: 'Planlanmadı' }
];

export default function CompliancePage() {
  const score = Math.round((CONTROLS.filter((c) => c.status === 'green').length / CONTROLS.length) * 100);
  return (
    <div>
      <SectionHeading title="Uyumluluk Çerçevesi" description="KVKK · VERBİS · GDPR · SOC2 — kontrol matrisi" />
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Card className="lg:col-span-1">
          <div className="text-xs uppercase tracking-wider text-fg-3">Posture Skoru</div>
          <div className="text-3xl font-semibold mt-1 text-brand-700 dark:text-brand-300">{score}/100</div>
          <div className="text-xs text-fg-3 mt-1 inline-flex items-center gap-1"><ShieldCheck size={12} weight="fill" className="text-emerald-500" /> Kanıt tazeliği: 22 gün</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-fg-3">Açık aksiyonlar</div>
          <div className="text-3xl font-semibold mt-1">{CONTROLS.filter((c) => c.status !== 'green').length}</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-fg-3">Hazırlık süresi</div>
          <div className="text-3xl font-semibold mt-1">~4 gün</div>
        </Card>
      </div>
      <Card>
        <h3 className="font-medium mb-3">Kontrol matrisi</h3>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {CONTROLS.map((c) => (
            <li key={c.id} className="py-2 flex items-center gap-3">
              {c.status === 'green' && <CheckCircle weight="fill" size={20} className="text-emerald-500" />}
              {c.status === 'amber' && <CircleHalf weight="fill" size={20} className="text-amber-500" />}
              {c.status === 'red' && <XCircle weight="fill" size={20} className="text-rose-500" />}
              <div className="flex-1">
                <div className="font-medium text-sm">{c.label}</div>
                <div className="text-xs text-fg-3">{c.evidence}</div>
              </div>
              <code className="text-xs text-fg-3">{c.id}</code>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
