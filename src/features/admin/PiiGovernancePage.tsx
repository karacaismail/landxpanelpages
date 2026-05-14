// D02 PII Governance & Data Classification — DSAR, masking, classification
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FileText, ShieldCheck, Eye, EyeSlash, Warning, CheckCircle, Sparkle, MagnifyingGlass,
  User, Lock, X, Download, Clock, Brain, ArrowsClockwise, DownloadSimple, Trash, FileLock
} from '@phosphor-icons/react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

type PiiClass = 'public' | 'internal' | 'pii' | 'sensitive-pii' | 'special';

interface PiiField {
  table: string;
  field: string;
  klass: PiiClass;
  mask: string;
  examples: string;
  retention: string;
  legalBasis: string;
  aiAccess: boolean;
}

const FIELDS: PiiField[] = [
  { table: 'users', field: 'email', klass: 'pii', mask: 'a***@d***.com', examples: '4280 satır', retention: '5 yıl post-account-close', legalBasis: 'KVKK m.5/2c (sözleşme)', aiAccess: false },
  { table: 'users', field: 'phone', klass: 'pii', mask: '+90 5** *** ** 42', examples: '3840 satır', retention: '5 yıl', legalBasis: 'KVKK m.5/2c', aiAccess: false },
  { table: 'users', field: 'tckn', klass: 'sensitive-pii', mask: '*********', examples: '2120 satır (KYC tam)', retention: '10 yıl (vergi yükümlülüğü)', legalBasis: 'KVKK m.6/2 + 5651', aiAccess: false },
  { table: 'users', field: 'birth_date', klass: 'pii', mask: '****-**-**', examples: '2120 satır', retention: '5 yıl', legalBasis: 'KVKK m.5/2c', aiAccess: false },
  { table: 'users', field: 'address', klass: 'pii', mask: '… mah. **, *', examples: '1840 satır', retention: '5 yıl', legalBasis: 'KVKK m.5/2c', aiAccess: false },
  { table: 'users', field: 'health_data', klass: 'special', mask: '[GİZLİ]', examples: '0 satır (toplanmıyor)', retention: 'N/A', legalBasis: 'KVKK m.6/2 (toplanmaz)', aiAccess: false },
  { table: 'users', field: 'display_name', klass: 'internal', mask: '—', examples: '4280 satır', retention: 'kalıcı', legalBasis: 'KVKK m.5/2c', aiAccess: true },
  { table: 'listings', field: 'title', klass: 'public', mask: '—', examples: '220 satır', retention: 'kalıcı', legalBasis: '—', aiAccess: true },
  { table: 'listings', field: 'description', klass: 'public', mask: '—', examples: '220 satır', retention: 'kalıcı', legalBasis: '—', aiAccess: true },
  { table: 'listings', field: 'owner_id', klass: 'internal', mask: 'u-****', examples: '220 satır', retention: 'kalıcı (foreign)', legalBasis: '—', aiAccess: true },
  { table: 'listings', field: 'precise_location', klass: 'pii', mask: 'sadece il/ilçe gösterilir', examples: '220 satır', retention: 'kalıcı', legalBasis: 'KVKK m.5/2c', aiAccess: false },
  { table: 'messages', field: 'body', klass: 'pii', mask: '—', examples: '12,420 satır', retention: '3 yıl', legalBasis: 'KVKK m.5/2c', aiAccess: true },
  { table: 'audit', field: 'changes', klass: 'sensitive-pii', mask: '—', examples: 'orjinal değer JSONB', retention: '7 yıl', legalBasis: '5651 + KVKK', aiAccess: false },
  { table: 'payments', field: 'card_pan', klass: 'sensitive-pii', mask: '**** **** **** 1234', examples: '0 satır (tokenize)', retention: 'tokenize only', legalBasis: 'PCI-DSS', aiAccess: false }
];

interface DsarRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'access' | 'erase' | 'rectify' | 'portability' | 'object';
  state: 'received' | 'verified' | 'processing' | 'awaiting_legal' | 'completed' | 'rejected';
  receivedAt: string;
  deadline: string;
  daysLeft: number;
  scopeTables: string[];
}

const DSAR: DsarRequest[] = [
  { id: 'dsar-001', userId: 'u-1842', userName: 'Mehmet Y***', type: 'access', state: 'completed', receivedAt: '2026-05-08', deadline: '2026-06-07', daysLeft: 24, scopeTables: ['users', 'listings', 'offers', 'messages'] },
  { id: 'dsar-002', userId: 'u-2014', userName: 'Ayşe K***', type: 'erase', state: 'processing', receivedAt: '2026-05-10', deadline: '2026-06-09', daysLeft: 26, scopeTables: ['users', 'listings', 'audit'] },
  { id: 'dsar-003', userId: 'u-3201', userName: 'Cem Ö***', type: 'portability', state: 'verified', receivedAt: '2026-05-12', deadline: '2026-06-11', daysLeft: 28, scopeTables: ['users', 'favorites', 'offers'] },
  { id: 'dsar-004', userId: 'u-0942', userName: 'Zeynep B***', type: 'rectify', state: 'awaiting_legal', receivedAt: '2026-05-13', deadline: '2026-06-12', daysLeft: 29, scopeTables: ['users'] },
  { id: 'dsar-005', userId: 'u-4120', userName: 'Hasan A***', type: 'access', state: 'received', receivedAt: '2026-05-14', deadline: '2026-06-13', daysLeft: 30, scopeTables: ['users'] }
];

const CLASS_LABEL: Record<PiiClass, { tr: string; cls: string; severity: number }> = {
  public: { tr: 'Herkese açık', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', severity: 0 },
  internal: { tr: 'İç kullanım', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300', severity: 1 },
  pii: { tr: 'Kişisel veri', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', severity: 2 },
  'sensitive-pii': { tr: 'Hassas kişisel', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300', severity: 3 },
  special: { tr: 'Özel nitelikli', cls: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300', severity: 4 }
};

const DSAR_TYPE: Record<DsarRequest['type'], string> = {
  access: 'Erişim talebi (KVKK m.11/1b)',
  erase: 'Silme talebi (m.11/1f)',
  rectify: 'Düzeltme (m.11/1d)',
  portability: 'Veri taşınabilirliği',
  object: 'İşleme itirazı'
};

export default function PiiGovernancePage() {
  const [tab, setTab] = useState<'classification' | 'dsar' | 'masking' | 'discovery'>('classification');

  return (
    <div>
      <SectionHeading
        title="PII Governance (D02)"
        description="Kişisel veri keşfi, sınıflandırma, KVKK m.11 hakları (DSAR), maskeleme politikaları"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel D02</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<Brain size={14} />} onClick={() => toast('ai', 'AI keşfi başlatıldı', 'Tüm tablolardaki potansiyel PII alanları taranıyor.')}>AI ile yeniden keşif</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Sınıflanmış alan" value={FIELDS.length} icon={<FileText size={20} weight="fill" />} />
        <Stat label="PII alan" value={FIELDS.filter((f) => f.klass === 'pii' || f.klass === 'sensitive-pii').length} icon={<Lock size={20} weight="fill" />} hint="Maskeleme aktif" />
        <Stat label="Aktif DSAR" value={DSAR.filter((d) => d.state !== 'completed' && d.state !== 'rejected').length} icon={<User size={20} weight="fill" />} hint="Yasal 30g" />
        <Stat label="DSAR < 7g" value={DSAR.filter((d) => d.daysLeft < 7 && d.state !== 'completed').length} icon={<Warning size={20} weight="fill" />} hint="Risk" />
        <Stat label="Discovery recall" value="98.4%" icon={<Brain size={20} weight="fill" />} hint="Hedef >98%" />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'classification' as const, label: 'Sınıflandırma', Icon: FileText },
          { id: 'dsar' as const, label: 'DSAR Talepleri', Icon: User },
          { id: 'masking' as const, label: 'Maskeleme', Icon: EyeSlash },
          { id: 'discovery' as const, label: 'AI Discovery', Icon: Brain }
        ].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cls(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
            tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
          )}>
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'classification' && <ClassificationTab />}
      {tab === 'dsar' && <DsarTab />}
      {tab === 'masking' && <MaskingTab />}
      {tab === 'discovery' && <DiscoveryTab />}
    </div>
  );
}

function ClassificationTab() {
  const classDist = useMemo(() => {
    const m = new Map<PiiClass, number>();
    FIELDS.forEach((f) => m.set(f.klass, (m.get(f.klass) || 0) + 1));
    return Array.from(m.entries()).map(([k, v]) => ({ name: CLASS_LABEL[k].tr, value: v, color: classColor(k) }));
  }, []);
  return (
    <>
      <div className="grid lg:grid-cols-3 gap-3 mb-4">
        <Card className="lg:col-span-2">
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><FileText size={14} /> Tüm sınıflandırılmış alanlar ({FIELDS.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                  <th className="text-left py-2">Tablo.Alan</th>
                  <th className="text-left py-2">Sınıf</th>
                  <th className="text-left py-2 hidden sm:table-cell">Maske</th>
                  <th className="text-left py-2 hidden md:table-cell">Saklama</th>
                  <th className="text-center py-2 hidden lg:table-cell">AI</th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((f) => (
                  <tr key={`${f.table}.${f.field}`} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-2"><code className="text-xs">{f.table}.{f.field}</code></td>
                    <td className="py-2"><span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded', CLASS_LABEL[f.klass].cls)}>{CLASS_LABEL[f.klass].tr}</span></td>
                    <td className="py-2 hidden sm:table-cell"><code className="text-[11px] text-fg-3">{f.mask}</code></td>
                    <td className="py-2 hidden md:table-cell text-xs text-fg-3">{f.retention}</td>
                    <td className="py-2 hidden lg:table-cell text-center">{f.aiAccess ? <CheckCircle size={14} weight="fill" className="inline text-emerald-500" /> : <EyeSlash size={14} className="inline text-rose-500" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Sınıf dağılımı</h3>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={classDist} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                  {classDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}

function classColor(k: PiiClass): string {
  return { public: '#94a3b8', internal: '#0ea5e9', pii: '#f59e0b', 'sensitive-pii': '#e11d48', special: '#a21caf' }[k];
}

function DsarTab() {
  const [selected, setSelected] = useState<DsarRequest | null>(DSAR[0]);
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 space-y-2">
        <Card className="bg-amber-50 dark:bg-amber-900/30">
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1">KVKK m.11 — 30 gün limit</div>
          <p className="text-sm text-fg-2">Aşılırsa: ₺50K-₺1M idari para cezası riski.</p>
        </Card>
        {DSAR.map((d) => (
          <button key={d.id} onClick={() => setSelected(d)} className={cls(
            'w-full text-left p-2.5 rounded-r-2 border',
            selected?.id === d.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <User size={12} className="text-fg-3" />
              <code className="text-[11px] text-fg-3">{d.id}</code>
              <span className={cls('ml-auto text-[10px] uppercase font-bold px-1 py-0.5 rounded', d.daysLeft < 7 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40' : d.daysLeft < 14 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40')}>
                {d.daysLeft}g
              </span>
            </div>
            <div className="text-sm font-medium">{d.userName}</div>
            <div className="text-[11px] text-fg-3 mt-0.5">{DSAR_TYPE[d.type]}</div>
            <div className="text-[10px] mt-1">
              <StatusBadge status={d.state === 'completed' ? 'live' : d.state === 'rejected' ? 'rejected' : 'review'} size="sm" />
            </div>
          </button>
        ))}
      </div>
      <div className="lg:col-span-2">
        {selected && <DsarDetail dsar={selected} />}
      </div>
    </div>
  );
}

function DsarDetail({ dsar }: { dsar: DsarRequest }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-lg font-medium">{dsar.userName}</h3>
          <code className="text-xs text-fg-3">{dsar.id} · {dsar.userId}</code>
          <p className="text-sm text-fg-2 mt-1">{DSAR_TYPE[dsar.type]}</p>
        </div>
        <div className="text-right">
          <div className={cls('text-2xl font-bold tabular-nums', dsar.daysLeft < 7 ? 'text-rose-600' : 'text-fg-1')}>{dsar.daysLeft}g</div>
          <div className="text-[10px] text-fg-3 uppercase">Son tarih: {dsar.deadline}</div>
        </div>
      </div>

      <div className="mb-3 flex gap-1.5 flex-wrap">
        <Button size="sm" iconLeft={<DownloadSimple size={14} />} onClick={() => toast('success', 'Veri paketi hazırlandı', 'KVKK uyumlu JSON+PDF rapor: dsar-' + dsar.id + '.zip')}>
          Veri paketi indir
        </Button>
        {dsar.type === 'erase' && (
          <Button size="sm" variant="danger" iconLeft={<Trash size={14} />} onClick={() => toast('warning', 'Silme uygulandı', 'Hard-delete K03 migration ile uygulandı. Audit log\'da tombstone kayıt.')}>
            Silme talebini uygula
          </Button>
        )}
        <Button size="sm" variant="outline" iconLeft={<Sparkle size={14} />} onClick={() => toast('ai', 'AI cevap taslağı', 'Kullanıcıya gönderilecek yanıt mektubu hazırlandı.')}>AI cevap taslağı</Button>
      </div>

      <div className="space-y-3">
        <Card className="!p-3 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1">Talep kapsamındaki tablolar</div>
          <div className="flex flex-wrap gap-1">
            {dsar.scopeTables.map((t) => (
              <code key={t} className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{t}</code>
            ))}
          </div>
        </Card>

        <Card className="!p-3">
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Zaman çizelgesi</div>
          <ol className="space-y-1 text-sm">
            <li className="flex items-center gap-2"><CheckCircle size={12} weight="fill" className="text-emerald-500" /> Alındı — {dsar.receivedAt}</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} weight="fill" className={cls(['verified', 'processing', 'awaiting_legal', 'completed'].includes(dsar.state) ? 'text-emerald-500' : 'text-fg-3')} /> Kimlik doğrulandı</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} weight="fill" className={cls(['processing', 'awaiting_legal', 'completed'].includes(dsar.state) ? 'text-emerald-500' : 'text-fg-3')} /> İşleme alındı</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} weight="fill" className={cls(['awaiting_legal', 'completed'].includes(dsar.state) ? 'text-emerald-500' : 'text-fg-3')} /> Hukuk değerlendirmesi</li>
            <li className="flex items-center gap-2"><CheckCircle size={12} weight="fill" className={cls(dsar.state === 'completed' ? 'text-emerald-500' : 'text-fg-3')} /> Tamamlandı / Yanıt gönderildi</li>
          </ol>
        </Card>

        <Card className="!p-3 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
          <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1 inline-flex items-center gap-1.5">
            <Sparkle size={12} weight="fill" className="text-brand-500" /> AI öneri
          </div>
          <p className="text-sm text-fg-2">
            {dsar.type === 'access' && 'Standart erişim talebi. AI tarafından oluşturulan veri paketi PDF + makine-okuyabilir JSON içerir.'}
            {dsar.type === 'erase' && 'Silme talebi: foreign key referansları için tombstone strateji öneriliyor. Audit log\'lar 5651 gereği saklanmalı.'}
            {dsar.type === 'rectify' && 'Düzeltme: yeni değer kullanıcı tarafından onaylanmalı. Audit\'e değişiklik kaydı düşer.'}
            {dsar.type === 'portability' && 'Veri taşınabilirliği: GDPR uyumlu JSON-LD formatı tercih edilmeli.'}
            {dsar.type === 'object' && 'İşleme itirazı: meşru menfaat değerlendirmesi gerekiyor. Hukuk birimi ile koordine olun.'}
          </p>
        </Card>
      </div>
    </Card>
  );
}

function MaskingTab() {
  const masked = FIELDS.filter((f) => f.mask !== '—');
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">Production veriler hiçbir admin ekranına ham olarak gönderilmez — bu kurallarla maskelenir.</p>
      <ul className="space-y-2">
        {masked.map((f) => (
          <li key={`${f.table}.${f.field}`} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-2">
            <FileLock size={16} className="text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <code className="text-xs">{f.table}.{f.field}</code>
              <div className="text-[11px] text-fg-3">{f.legalBasis}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono">{f.mask}</div>
              <span className={cls('text-[10px] uppercase font-bold px-1 py-0.5 rounded inline-block mt-0.5', CLASS_LABEL[f.klass].cls)}>{CLASS_LABEL[f.klass].tr}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DiscoveryTab() {
  return (
    <div className="space-y-3">
      <Card className="bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-start gap-3">
          <Brain size={24} weight="fill" className="text-brand-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">AI Keşif — Son tarama</h3>
            <p className="text-sm text-fg-2 mt-1">
              <strong>2026-05-13 03:00</strong> tarihinde tüm 33 tabloda PII tarama yapıldı.
              <strong> 14 alan</strong> sınıflandırıldı. <strong>2 yeni PII adayı</strong> bulundu (henüz onaylanmadı).
            </p>
            <p className="text-xs text-fg-3 mt-2">Recall: %98.4 · Precision: %94.2 · ROC-AUC: 0.96</p>
            <div className="flex gap-1.5 mt-2">
              <Button size="xs" iconLeft={<ArrowsClockwise size={12} />} onClick={() => toast('ai', 'AI taraması başladı', 'Mock: tüm tablolar yeniden taranıyor.')}>Yeniden tara</Button>
              <Button size="xs" variant="outline" iconLeft={<Download size={12} />} onClick={() => toast('success', 'Rapor hazır', 'pii-discovery-report.pdf')}>Rapor</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-2">Yeni keşfedilen PII adayları</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-r-2">
            <Warning size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <code className="text-xs">listings.contact_phone</code>
              <p className="text-xs text-fg-2 mt-0.5">Telefon numarası örüntüsü tespit edildi (+90 5xx xxx xx xx). Sınıflandırma önerisi: PII.</p>
              <div className="flex gap-1 mt-1.5">
                <Button size="xs" onClick={() => toast('success', 'Onaylandı', 'PII sınıfı atandı, maskeleme aktif.')}>PII olarak işaretle</Button>
                <Button size="xs" variant="ghost" onClick={() => toast('info', 'Reddedildi', 'AI önerisi geri bildirimi kaydedildi.')}>Reddet</Button>
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-r-2">
            <Warning size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <code className="text-xs">messages.body</code>
              <p className="text-xs text-fg-2 mt-0.5">Bazı mesaj gövdelerinde TC kimlik no örüntüsü tespit edildi (mock: 4 mesaj). İçerik filtreleme önerilir.</p>
              <div className="flex gap-1 mt-1.5">
                <Button size="xs" onClick={() => toast('success', 'Filtre kuruldu', 'Yeni mesajlarda TCKN regex bloklanacak.')}>Filtre kur</Button>
                <Button size="xs" variant="ghost">İncele</Button>
              </div>
            </div>
          </li>
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium mb-2">Veri akış haritası</h3>
        <ul className="text-xs text-fg-3 space-y-1">
          <li>• <code>users.email</code> → SendGrid (SOC2 sertifikalı, EU bölge)</li>
          <li>• <code>users.phone</code> → Twilio (TR data center)</li>
          <li>• <code>messages.body</code> → AI ajan (Anthropic Claude — Enterprise SLA, PII redaction sonrası)</li>
          <li>• <code>audit.changes</code> → İç sistem, hiçbir dış servis</li>
          <li>• <code>listings.precise_location</code> → Sadece il/ilçe API'den döner, koordinat gizli</li>
        </ul>
      </Card>
    </div>
  );
}
