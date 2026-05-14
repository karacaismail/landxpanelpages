import { useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { CheckCircle, CircleHalf, XCircle, ShieldCheck, FileText, Clock, Download, Sparkle, FileLock, MapPin } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

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

      <VerbisRegistry />
    </div>
  );
}

// D03 — VERBİS Article 30 records: Processing Activity Record
interface ProcessingActivity {
  id: string;
  name: string;
  controller: string;
  purpose: string;
  legalBasis: string;
  dataCategories: string[];
  recipients: string[];
  thirdCountry: string;
  retention: string;
  techMeasures: string[];
  lastReviewed: string;
}

const VERBIS_RECORDS: ProcessingActivity[] = [
  {
    id: 'verbis-001',
    name: 'Kullanıcı Kayıt ve Kimlik Doğrulama',
    controller: 'LandX Bilişim A.Ş.',
    purpose: 'Hizmet sunumu, kimlik doğrulama, hesap güvenliği',
    legalBasis: 'KVKK m.5/2(c) sözleşmenin kurulması, m.5/2(f) meşru menfaat',
    dataCategories: ['kimlik', 'iletişim', 'işlem güvenliği', 'görsel kayıt (KYC)'],
    recipients: ['Cloud sağlayıcısı (AWS Frankfurt)', 'KYC servisi (e-Devlet mock)', 'SMS sağlayıcı (Twilio TR)'],
    thirdCountry: 'AB (yeterlilik kararı kapsamında)',
    retention: 'Hesap kapanmasından sonra 10 yıl (TTK m.82 + 6502)',
    techMeasures: ['TLS 1.3', 'AES-256 at rest', 'MFA', 'audit log'],
    lastReviewed: '2026-05-08'
  },
  {
    id: 'verbis-002',
    name: 'İlan Yayınlama ve Görüntüleme',
    controller: 'LandX Bilişim A.Ş.',
    purpose: 'Arsa satıcı/alıcı buluşturma, ilan barındırma, fiyat keşfi',
    legalBasis: 'KVKK m.5/2(c) sözleşmenin ifası, m.5/2(f) meşru menfaat',
    dataCategories: ['kimlik', 'iletişim', 'konum verisi', 'finansal'],
    recipients: ['Cloud sağlayıcısı', 'CDN (Cloudflare TR)', 'TKGM API (resmi entegrasyon)'],
    thirdCountry: 'AB',
    retention: 'İlan kaldırıldıktan sonra 1 yıl, audit log 7 yıl',
    techMeasures: ['Field-level encryption (precise location)', 'Row-level security', 'PII masking'],
    lastReviewed: '2026-05-10'
  },
  {
    id: 'verbis-003',
    name: 'Mesajlaşma ve Müzakere',
    controller: 'LandX Bilişim A.Ş.',
    purpose: 'Alıcı-satıcı iletişimi, teklif müzakeresi',
    legalBasis: 'KVKK m.5/2(c) sözleşmenin ifası',
    dataCategories: ['iletişim içeriği', 'meta-veri'],
    recipients: ['Cloud sağlayıcısı', 'AI ajan (PII redaction sonrası, Anthropic Enterprise SLA)'],
    thirdCountry: 'AB / ABD (Anthropic — yeterlilik kararı + SCC)',
    retention: '3 yıl',
    techMeasures: ['E2E olmayan ama transport+at-rest şifreli', 'AI redaction pre-LLM', 'Pre-LLM PII scrubbing'],
    lastReviewed: '2026-05-12'
  },
  {
    id: 'verbis-004',
    name: 'AI Tabanlı Değerleme ve Risk Skoru',
    controller: 'LandX Bilişim A.Ş.',
    purpose: 'Otomatik fiyat tahmini, risk uyarısı, alıcı korunması',
    legalBasis: 'KVKK m.5/2(f) meşru menfaat, m.6/2(e) bilimsel araştırma analojisi',
    dataCategories: ['ilan meta-verisi', 'tapu kayıtları (TKGM)', 'piyasa emsalleri'],
    recipients: ['LLM sağlayıcı (Anthropic — PII\'siz veri)', 'Vector store (kendi altyapı)'],
    thirdCountry: 'AB / ABD',
    retention: 'İlan ömrü boyunca + 90 gün',
    techMeasures: ['PII pre-LLM redaction', 'Differential privacy', 'Anonymized inference'],
    lastReviewed: '2026-05-11'
  },
  {
    id: 'verbis-005',
    name: 'Pazarlama ve Bildirim',
    controller: 'LandX Bilişim A.Ş.',
    purpose: 'Kayıtlı arama bildirimi, dönem kampanyaları (opt-in)',
    legalBasis: 'KVKK m.5/1 açık rıza (opt-in)',
    dataCategories: ['iletişim', 'tercih verisi', 'davranış izi (cookie)'],
    recipients: ['E-posta sağlayıcı (SendGrid TR)', 'SMS sağlayıcı (Twilio)'],
    thirdCountry: 'AB',
    retention: 'Rıza geri çekilene kadar veya 2 yıl',
    techMeasures: ['Opt-out one-click', 'Suppression list', 'Frequency capping'],
    lastReviewed: '2026-05-05'
  }
];

function VerbisRegistry() {
  const [selected, setSelected] = useState<ProcessingActivity>(VERBIS_RECORDS[0]);
  return (
    <Card className="mt-4">
      <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
        <div>
          <h3 className="font-medium inline-flex items-center gap-2"><FileLock size={16} weight="duotone" /> VERBİS Veri İşleme Faaliyet Kayıtları (Article 30)</h3>
          <p className="text-sm text-fg-3 mt-1">KVKK madde 16 — Veri Sorumluları Sicili / GDPR Article 30 — Records of Processing</p>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" iconLeft={<Download size={14} />} onClick={() => toast('success', 'VERBİS PDF', 'Resmi formatta sicil dökümü hazırlandı.')}>VERBİS PDF</Button>
          <Button size="sm" iconLeft={<Sparkle size={14} weight="fill" />} onClick={() => toast('ai', 'AI denetim', 'Mock: 0 eksik kategori, 0 hukuki dayanak boşluğu.')}>AI denetim</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <div className="lg:col-span-1 space-y-1.5">
          {VERBIS_RECORDS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={cls(
                'w-full text-left p-2 rounded-r-2 border transition-colors',
                selected.id === r.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <div className="font-medium text-sm">{r.name}</div>
              <code className="text-[11px] text-fg-3">{r.id}</code>
              <div className="text-[11px] text-fg-3 mt-0.5">Son inceleme: {r.lastReviewed}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <Card className="!p-3">
            <h4 className="font-medium mb-2">{selected.name}</h4>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Veri sorumlusu</dt><dd>{selected.controller}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Amaç</dt><dd>{selected.purpose}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Hukuki dayanak</dt><dd className="text-fg-2">{selected.legalBasis}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Veri kategorileri</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {selected.dataCategories.map((c) => <code key={c} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{c}</code>)}
                </dd>
              </div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Veri aktarılan alıcılar</dt>
                <dd className="text-fg-2 text-xs">
                  <ul className="list-disc list-inside space-y-0.5">
                    {selected.recipients.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </dd>
              </div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold inline-flex items-center gap-1"><MapPin size={10} /> Yurt dışı aktarım</dt><dd>{selected.thirdCountry}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Saklama süresi</dt><dd>{selected.retention}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Teknik/idari tedbirler</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {selected.techMeasures.map((m) => <code key={m} className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">{m}</code>)}
                </dd>
              </div>
              <div><dt className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">Son güncelleme</dt><dd className="text-fg-3">{selected.lastReviewed}</dd></div>
            </dl>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button size="xs" iconLeft={<FileText size={12} />} onClick={() => toast('info', 'Aktivite düzenle', 'Kayıt edit modu açıldı.')}>Düzenle</Button>
              <Button size="xs" variant="outline" iconLeft={<Download size={12} />} onClick={() => toast('success', 'Resmi belge hazır', 'verbis-' + selected.id + '.pdf')}>Resmi belge</Button>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}
