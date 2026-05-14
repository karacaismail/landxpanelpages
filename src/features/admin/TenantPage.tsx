import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Buildings, Users, ShieldCheck, Pulse, Sparkle, Hourglass, CheckCircle, Archive, X, ArrowRight, ArrowLeft, Warning } from '@phosphor-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

type TenantStatus = 'active' | 'suspended' | 'archived' | 'provisioning';

interface TenantRow {
  id: string;
  name: string;
  domain: string;
  status: TenantStatus;
  plan: 'demo' | 'starter' | 'pro' | 'enterprise';
  users: number;
  listings: number;
  storageGb: number;
  createdAt: string;
}

const TENANTS: TenantRow[] = [
  { id: 't-001', name: 'LandX Demo',            domain: 'demo.landx.test',        status: 'active',       plan: 'demo',       users: 60,  listings: 220, storageGb: 1.4, createdAt: '2025-09-01' },
  { id: 't-002', name: 'Kıyı Emlak Grubu',      domain: 'kiyiemlak.landx.test',   status: 'active',       plan: 'pro',        users: 24,  listings: 142, storageGb: 6.2, createdAt: '2026-01-12' },
  { id: 't-003', name: 'Anadolu Yatırım',       domain: 'anadolu.landx.test',     status: 'active',       plan: 'enterprise', users: 78,  listings: 412, storageGb: 18.7, createdAt: '2025-11-04' },
  { id: 't-004', name: 'Test Kurum 1',          domain: 'test1.landx.test',       status: 'suspended',    plan: 'starter',    users: 4,   listings: 8,   storageGb: 0.2, createdAt: '2026-03-22' },
  { id: 't-005', name: 'Bodrum Mülk',           domain: 'bodrum.landx.test',      status: 'provisioning', plan: 'pro',        users: 0,   listings: 0,   storageGb: 0,   createdAt: '2026-05-12' },
  { id: 't-006', name: 'Eski Müşteri',          domain: 'eski.landx.test',        status: 'archived',     plan: 'starter',    users: 0,   listings: 0,   storageGb: 0.05, createdAt: '2024-08-19' }
];

const PLAN_QUOTAS: Record<TenantRow['plan'], { listings: number; users: number; storage: number; price: string }> = {
  demo:        { listings: 1000, users: 100, storage: 5,   price: 'ücretsiz' },
  starter:     { listings: 50,   users: 10,  storage: 1,   price: '₺990/ay' },
  pro:         { listings: 500,  users: 50,  storage: 10,  price: '₺4.900/ay' },
  enterprise:  { listings: 5000, users: 500, storage: 100, price: 'özel' }
};

const STATUS_LABEL: Record<TenantStatus, { tr: string; color: string; Icon: typeof Buildings }> = {
  active: { tr: 'Aktif', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200', Icon: CheckCircle },
  suspended: { tr: 'Askıda', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', Icon: ShieldCheck },
  archived: { tr: 'Arşivli', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', Icon: Archive },
  provisioning: { tr: 'Provisioning', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200', Icon: Hourglass }
};

const USAGE_30D = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  listings: Math.round(165 + Math.sin(i / 4) * 12 + i * 1.3),
  apiCalls: Math.round(28000 + Math.cos(i / 5) * 5000 + i * 240)
}));

export default function TenantPage() {
  const [tenants, setTenants] = useState<TenantRow[]>(TENANTS);
  const [selected, setSelected] = useState<TenantRow>(TENANTS[0]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setWizardOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function addTenant(input: { name: string; domain: string; plan: TenantRow['plan']; region: string }) {
    const id = `t-${String(tenants.length + 1).padStart(3, '0')}`;
    const newTenant: TenantRow = {
      id,
      name: input.name,
      domain: input.domain,
      status: 'provisioning',
      plan: input.plan,
      users: 0,
      listings: 0,
      storageGb: 0,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setTenants((prev) => [...prev, newTenant]);
    setSelected(newTenant);
    setWizardOpen(false);
    toast('success', 'Tenant provisioning başladı', `${input.name} (${input.domain}) — schema oluşturuluyor (mock).`);
    setTimeout(() => {
      setTenants((prev) => prev.map((t) => t.id === id ? { ...t, status: 'active' as TenantStatus } : t));
      setSelected((cur) => cur.id === id ? { ...cur, status: 'active' as TenantStatus } : cur);
      toast('success', 'Provisioning tamam', `${input.name} aktif. Demo seed atandı.`);
    }, 4000);
  }

  return (
    <div>
      <SectionHeading title="Tenant Lifecycle (I01)" description="Multi-tenant provisioning · kota · izolasyon · arşivleme" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Tenant" value={tenants.length} icon={<Buildings size={20} weight="fill" />} />
        <Stat label="Aktif" value={tenants.filter((t) => t.status === 'active').length} icon={<CheckCircle size={20} weight="fill" />} />
        <Stat label="Toplam kullanıcı" value={tenants.reduce((s, t) => s + t.users, 0)} icon={<Users size={20} weight="fill" />} />
        <Stat label="İzolasyon ihlali" value={0} icon={<ShieldCheck size={20} weight="fill" />} hint="I05 enforcement" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Tenant list */}
        <div className="lg:col-span-1 space-y-2">
          {tenants.map((t) => {
            const s = STATUS_LABEL[t.status];
            const active = selected.id === t.id;
            return (
              <button key={t.id} onClick={() => setSelected(t)} className={cls('w-full text-left p-3 rounded-r-3 border transition-colors', active ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-r-2 bg-brand-50 dark:bg-brand-900/40 grid place-items-center text-brand-600 shrink-0"><Buildings size={16} weight="duotone" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-fg-3 truncate">{t.domain}</div>
                  </div>
                  <span className={cls('text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5', s.color)}>
                    <s.Icon size={10} weight="fill" /> {s.tr}
                  </span>
                </div>
              </button>
            );
          })}
          <Button block variant="outline" onClick={() => setWizardOpen(true)} iconLeft={<Sparkle size={14} weight="fill" />}>+ Yeni tenant (provisioning)</Button>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-medium text-lg">{selected.name}</h3>
                <code className="text-xs text-fg-3">{selected.domain} · oluşturuldu {selected.createdAt}</code>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.status === 'active' && <Button size="sm" variant="outline">Askıya al</Button>}
                {selected.status === 'suspended' && <Button size="sm" variant="success">Aktive et</Button>}
                {selected.status !== 'archived' && <Button size="sm" variant="ghost">Arşivle</Button>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-fg-3">Plan</div>
                <div className="font-medium mt-1 capitalize">{selected.plan}</div>
                <div className="text-xs text-fg-3">{PLAN_QUOTAS[selected.plan].price}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-fg-3">Schema</div>
                <code className="block mt-1 text-xs">tenant_{selected.id.slice(2)}</code>
                <div className="text-xs text-fg-3">izolasyon: schema-per-tenant</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-fg-3">Bölge</div>
                <div className="font-medium mt-1">eu-west-1</div>
                <div className="text-xs text-fg-3">KVKK uyumlu</div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-medium mb-3">Kota kullanımı</h3>
            <Usage label="İlanlar" value={selected.listings} max={PLAN_QUOTAS[selected.plan].listings} unit="" />
            <Usage label="Kullanıcılar" value={selected.users} max={PLAN_QUOTAS[selected.plan].users} unit="" />
            <Usage label="Depolama" value={selected.storageGb} max={PLAN_QUOTAS[selected.plan].storage} unit="GB" decimals={1} />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium inline-flex items-center gap-2"><Pulse size={16} weight="fill" /> Son 30 gün aktivitesi</h3>
              <span className="text-xs text-fg-3">İlan + API çağrısı</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer>
                <AreaChart data={USAGE_30D}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="listings" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                  <Area yAxisId="right" type="monotone" dataKey="apiCalls" stroke="#c97f1d" fill="rgba(201,127,29,0.18)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <IsolationSimulator tenantName={selected.name} schemaId={selected.id} />
          <Card>
            <h3 className="font-medium mb-2">İzolasyon kontrolü (I05) — sürekli izleme</h3>
            <ul className="text-sm space-y-1">
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Cross-tenant query saldırısı (30 gün): <strong>0</strong></li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Schema switch overhead: P99 1.8ms</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Tenant context propagation hata: %0.00</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Agent çağrılarında tenant context korunuyor</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Row-Level Security policy: <code className="text-xs">tenant_isolation</code> aktif</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-medium mb-2">Tenant ayarları</h3>
            <div className="space-y-2">
              <Input label="Tenant adı" defaultValue={selected.name} block />
              <Input label="Domain" defaultValue={selected.domain} block />
              <Input label="Plan" defaultValue={selected.plan} block />
              <Button size="sm">Kaydet</Button>
            </div>
          </Card>
        </div>
      </div>
      {wizardOpen && <NewTenantWizard onClose={() => setWizardOpen(false)} onCreate={addTenant} />}
    </div>
  );
}

function NewTenantWizard({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { name: string; domain: string; plan: TenantRow['plan']; region: string }) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState<TenantRow['plan']>('pro');
  const [region, setRegion] = useState('eu-west-1');
  const [aiSeed, setAiSeed] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !provisioning) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, provisioning]);

  const slug = name.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);
  useEffect(() => {
    if (slug && !domain) setDomain(`${slug}.landx.test`);
  }, [slug, domain]);

  const PROVISIONING_STEPS = [
    'Şema oluşturuluyor (tenant_xxx)',
    'Veritabanı izolasyonu kuruluyor',
    'Varsayılan roller ve izinler tanımlanıyor',
    'AI ajan kapsamları bağlanıyor',
    'Demo seed verileri yerleştiriliyor',
    'Bildirim şablonları senkronlanıyor',
    'KVKK politikaları aktive ediliyor'
  ];

  function startProvisioning() {
    setProvisioning(true);
    setStep(4);
    let i = 0;
    const tick = () => {
      i++;
      setProgress(i);
      if (i < PROVISIONING_STEPS.length) {
        setTimeout(tick, 400 + Math.random() * 350);
      } else {
        setTimeout(() => onCreate({ name, domain, plan, region }), 400);
      }
    };
    setTimeout(tick, 300);
  }

  const canNext1 = name.trim().length >= 3;
  const canNext2 = /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain.toLowerCase());

  return (
    <div role="dialog" aria-modal="true" aria-label="Yeni tenant" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={() => !provisioning && onClose()}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-50/60 to-transparent dark:from-brand-900/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-r-2 bg-brand-100 dark:bg-brand-900/50 grid place-items-center text-brand-600"><Sparkle size={16} weight="fill" /></div>
            <div>
              <div className="font-medium text-sm">Yeni tenant provisioning</div>
              <div className="text-[11px] text-fg-3">{step}/4 — AI yardımcı yanınızda</div>
            </div>
          </div>
          {!provisioning && (
            <button onClick={onClose} className="p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Kapat"><X size={18} /></button>
          )}
        </div>

        <div className="px-4 pt-3">
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={cls('flex-1 h-1 rounded-full transition-colors', step >= s ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700')} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {step === 1 && (
            <>
              <h3 className="font-medium">1. Tenant adı</h3>
              <p className="text-sm text-fg-3">Müşteri / şirket adı. En az 3 karakter.</p>
              <Input label="Tenant adı" value={name} onChange={(e) => setName(e.target.value)} placeholder="örn. Çukurova Mülk Grubu" block />
              {slug && (
                <div className="text-xs text-fg-3">
                  Slug: <code className="text-fg-1">{slug}</code>
                </div>
              )}
              <div className="bg-brand-50 dark:bg-brand-900/30 rounded-r-2 p-3 text-sm">
                <div className="flex items-center gap-1.5 mb-1"><Sparkle size={14} weight="fill" className="text-brand-500" /> <strong>AI önerisi:</strong></div>
                <p className="text-fg-2">Tenant adı 3-32 karakter arasında, Türkçe karakter desteklenir. Domain otomatik üretilir, sonraki adımda düzenleyebilirsiniz.</p>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h3 className="font-medium">2. Domain & Plan</h3>
              <Input label="Subdomain (custom domain sonradan eklenir)" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="cukurova.landx.test" block />
              {domain && !canNext2 && <div className="text-xs text-rose-600">Geçersiz domain formatı (örn: ad.landx.test).</div>}

              <div className="grid grid-cols-2 gap-2 mt-3">
                {(['starter', 'pro', 'enterprise', 'demo'] as TenantRow['plan'][]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={cls('text-left p-3 rounded-r-2 border-2 transition-colors', plan === p ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800')}
                  >
                    <div className="font-medium capitalize text-sm">{p}</div>
                    <div className="text-xs text-fg-3">{PLAN_QUOTAS[p].price}</div>
                    <div className="text-[11px] text-fg-3 mt-1">
                      {PLAN_QUOTAS[p].listings.toLocaleString('tr-TR')} ilan · {PLAN_QUOTAS[p].users} kullanıcı · {PLAN_QUOTAS[p].storage} GB
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium block mt-2">Bölge</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
                  <option value="eu-west-1">eu-west-1 (Frankfurt) — KVKK uyumlu</option>
                  <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                  <option value="tr-1">tr-1 (İstanbul) — özel bölge</option>
                </select>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="font-medium">3. Özet & Onay</h3>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-r-2 p-3">
                <dt className="text-fg-3">Ad</dt><dd className="font-medium">{name}</dd>
                <dt className="text-fg-3">Domain</dt><dd className="font-medium"><code>{domain}</code></dd>
                <dt className="text-fg-3">Plan</dt><dd className="font-medium capitalize">{plan}</dd>
                <dt className="text-fg-3">Bölge</dt><dd>{region}</dd>
                <dt className="text-fg-3">Schema</dt><dd><code>tenant_{slug.slice(0, 8)}</code></dd>
                <dt className="text-fg-3">İzolasyon</dt><dd>schema-per-tenant</dd>
              </dl>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={aiSeed} onChange={(e) => setAiSeed(e.target.checked)} className="mt-1" />
                <span className="text-sm">
                  <strong>AI demo seed</strong> ile başlat
                  <span className="block text-xs text-fg-3">10 örnek ilan, 5 kullanıcı, 3 ECA kuralı otomatik yüklenir.</span>
                </span>
              </label>
              <div className="text-xs text-fg-3 mt-2">
                Onayladıktan sonra DB schema, izinler, ajan kapsamları ve KVKK politikaları otomatik kurulur. Tahmini süre: 25-40 saniye.
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h3 className="font-medium inline-flex items-center gap-2">
                <Sparkle size={16} weight="fill" className="text-brand-500 animate-pulse" /> Provisioning sürüyor...
              </h3>
              <div className="space-y-2 mt-2">
                {PROVISIONING_STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {i < progress
                      ? <CheckCircle size={16} weight="fill" className="text-emerald-500" />
                      : i === progress
                        ? <Hourglass size={16} weight="fill" className="text-brand-500 animate-pulse" />
                        : <span className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700" />}
                    <span className={cls(i < progress ? 'text-fg-1' : 'text-fg-3')}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${(progress / PROVISIONING_STEPS.length) * 100}%` }} />
              </div>
            </>
          )}
        </div>

        {!provisioning && (
          <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between gap-2">
            <Button variant="ghost" onClick={() => step === 1 ? onClose() : setStep((s) => s - 1)} iconLeft={<ArrowLeft size={14} />}>
              {step === 1 ? 'İptal' : 'Geri'}
            </Button>
            {step < 3 && (
              <Button onClick={() => setStep((s) => s + 1)} disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)} iconRight={<ArrowRight size={14} />}>
                Devam
              </Button>
            )}
            {step === 3 && (
              <Button onClick={startProvisioning} iconRight={<Sparkle size={14} weight="fill" />}>
                Provisioning başlat
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IsolationSimulator({ tenantName, schemaId }: { tenantName: string; schemaId: string }) {
  const [test, setTest] = useState<string>('select.cross');
  const [result, setResult] = useState<{ ok: boolean; logs: string[]; verdict: string } | null>(null);
  const [running, setRunning] = useState(false);

  const TESTS: { id: string; label: string; query: string; desc: string }[] = [
    { id: 'select.cross', label: 'Cross-tenant SELECT', query: `SELECT * FROM landx_core_listing WHERE tenant_id = 'OTHER_TENANT'`, desc: 'Diğer tenant verilerini okumaya çalış' },
    { id: 'update.bypass', label: 'tenant_id\'siz UPDATE', query: `UPDATE landx_core_listing SET status='live' WHERE id='L-OTHER'`, desc: 'WHERE\'da tenant_id yokken update' },
    { id: 'union.injection', label: 'UNION enjeksiyon', query: `SELECT id FROM landx_core_listing UNION SELECT email FROM landx_identity_user`, desc: 'Tip mismatch + RLS bypass denemesi' },
    { id: 'agent.escape', label: 'Agent context escape', query: `SET app.tenant_id = 'OTHER_TENANT'; SELECT * FROM landx_core_listing`, desc: 'AI agent\'ın session\'ında tenant değiştirme' },
    { id: 'jdbc.direct', label: 'Doğrudan DB bağlantı', query: `psql "host=db user=app dbname=landx" -c "SELECT * FROM landx_core_listing"`, desc: 'Uygulama katmanını atlayarak DB erişimi' }
  ];

  function runTest() {
    const t = TESTS.find((x) => x.id === test)!;
    setRunning(true);
    setResult(null);
    const logs: string[] = [
      `[${new Date().toLocaleTimeString('tr-TR')}] Test başlıyor: ${t.label}`,
      `[${new Date().toLocaleTimeString('tr-TR')}] Tenant context: app.tenant_id='${schemaId}'`,
      `[${new Date().toLocaleTimeString('tr-TR')}] Query: ${t.query}`
    ];
    setTimeout(() => {
      const verdicts: Record<string, { ok: boolean; logs: string[]; verdict: string }> = {
        'select.cross': {
          ok: true,
          logs: [...logs,
            `[${new Date().toLocaleTimeString('tr-TR')}] RLS policy 'tenant_isolation' kontrol ediyor...`,
            `[${new Date().toLocaleTimeString('tr-TR')}] Policy: tenant_id = current_setting('app.tenant_id')`,
            `[${new Date().toLocaleTimeString('tr-TR')}] ✓ 0 satır döndü — diğer tenant satırları filtrelendi`
          ],
          verdict: 'GÜVENLİ — Row-Level Security policy diğer tenant verilerini gizledi.'
        },
        'update.bypass': {
          ok: true,
          logs: [...logs,
            `[${new Date().toLocaleTimeString('tr-TR')}] RLS policy USING + WITH CHECK çalıştı`,
            `[${new Date().toLocaleTimeString('tr-TR')}] ✓ 0 satır etkilendi — bu tenant'a ait olmayan kayıt güncellenmedi`
          ],
          verdict: 'GÜVENLİ — UPDATE de SELECT gibi RLS\'ye tabi, WITH CHECK koşulu sağlandı.'
        },
        'union.injection': {
          ok: true,
          logs: [...logs,
            `[${new Date().toLocaleTimeString('tr-TR')}] Parametre escaping aktif (PostgreSQL prepared statements)`,
            `[${new Date().toLocaleTimeString('tr-TR')}] Tip mismatch tespit edildi: uuid vs text`,
            `[${new Date().toLocaleTimeString('tr-TR')}] ✓ Query parser tarafından reddedildi`
          ],
          verdict: 'GÜVENLİ — Prepared statements + tip kontrolü enjeksiyonu engelliyor.'
        },
        'agent.escape': {
          ok: true,
          logs: [...logs,
            `[${new Date().toLocaleTimeString('tr-TR')}] A03 Agent Identity & Scopes kontrolü`,
            `[${new Date().toLocaleTimeString('tr-TR')}] Agent capability 'tenant.switch' verilmemiş`,
            `[${new Date().toLocaleTimeString('tr-TR')}] ✗ SET app.tenant_id komutu reddedildi (PermissionDenied)`,
            `[${new Date().toLocaleTimeString('tr-TR')}] ✓ D01 audit log\'a şüpheli işlem yazıldı`
          ],
          verdict: 'GÜVENLİ — Agent kapsamı tenant değişikliğine izin vermiyor, ihlal denemesi loglandı.'
        },
        'jdbc.direct': {
          ok: false,
          logs: [...logs,
            `[${new Date().toLocaleTimeString('tr-TR')}] ⚠ Doğrudan DB bağlantısı — uygulama RBAC bypass edilmiş!`,
            `[${new Date().toLocaleTimeString('tr-TR')}] Ancak: DB user 'app' default rolünde RLS hâlâ aktif`,
            `[${new Date().toLocaleTimeString('tr-TR')}] SET app.tenant_id yapılmamış → tüm sorgular 0 satır döndürür`,
            `[${new Date().toLocaleTimeString('tr-TR')}] ✓ Kısmi güvenli — fakat öneri: connection-level tenant_id zorunlu`
          ],
          verdict: 'KISMİ — DB user\'ın bypass yetkisi varsa risk var. Connection pool level enforcement önerilir.'
        }
      };
      setResult(verdicts[test]);
      setRunning(false);
    }, 1200);
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
        <h3 className="font-medium inline-flex items-center gap-2"><ShieldCheck size={16} weight="fill" className="text-emerald-500" /> İzolasyon Saldırı Simülatörü (I05)</h3>
        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">QA / pen-test</span>
      </div>
      <p className="text-sm text-fg-3 mb-3">Tenant <strong>{tenantName}</strong> bağlamında diğer tenant verilerine erişim denemelerini test edin. Tüm denemeler audit'e (D01) düşer.</p>
      <div className="grid sm:grid-cols-2 gap-2 mb-3">
        {TESTS.map((tt) => (
          <button
            key={tt.id}
            onClick={() => setTest(tt.id)}
            className={cls(
              'text-left p-2 rounded-r-2 border text-xs',
              test === tt.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/30' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            <div className="font-medium">{tt.label}</div>
            <div className="text-fg-3 text-[10px] mt-0.5 line-clamp-1">{tt.desc}</div>
          </button>
        ))}
      </div>
      <Button size="sm" onClick={runTest} disabled={running} iconLeft={running ? <Hourglass size={14} className="animate-pulse" /> : <CheckCircle size={14} />}>
        {running ? 'Test çalışıyor...' : 'Saldırıyı simüle et'}
      </Button>
      {result && (
        <div className="mt-3 space-y-2">
          <div className={cls('rounded-r-2 p-2 text-sm font-medium', result.ok ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200')}>
            {result.ok ? <CheckCircle size={14} weight="fill" className="inline mr-1" /> : <Warning size={14} weight="fill" className="inline mr-1" />}
            {result.verdict}
          </div>
          <pre className="text-[11px] bg-slate-900 text-emerald-300 rounded-r-2 p-3 overflow-x-auto font-mono leading-relaxed">{result.logs.join('\n')}</pre>
        </div>
      )}
    </Card>
  );
}

function Usage({ label, value, max, unit, decimals = 0 }: { label: string; value: number; max: number; unit: string; decimals?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-brand-500';
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-fg-3">{value.toFixed(decimals)} / {max.toFixed(decimals)} {unit} · %{pct}</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cls('h-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
