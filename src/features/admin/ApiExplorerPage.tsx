// API Explorer — S01 Auto REST API Engine
// Excel module: S01 — DocType'tan otomatik üretilen REST endpoint kataloğu + try-it
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { Code, Play, Copy, Globe, Lock, Sparkle, ShieldCheck, Lightning, ListNumbers } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  doctype: string;
  desc: string;
  auth: 'public' | 'tenant' | 'admin';
  rateLimit: string;
  exampleResponse?: unknown;
  exampleBody?: unknown;
  ai: boolean;
}

const ENDPOINTS: Endpoint[] = [
  // Listings (S01 auto-generated from Listing DocType)
  { id: 'e-1', method: 'GET', path: '/api/v1/listings', doctype: 'Listing', desc: 'Tüm ilanları listele (sayfalı + filtreli)', auth: 'public', rateLimit: '120/dk', ai: false,
    exampleResponse: { data: [{ id: 'L-0024', title: 'Beykoz Riva 5 dönüm', price: 4250000 }], meta: { total: 220, page: 1 } } },
  { id: 'e-2', method: 'GET', path: '/api/v1/listings/:id', doctype: 'Listing', desc: 'Tek ilan detay', auth: 'public', rateLimit: '300/dk', ai: false,
    exampleResponse: { id: 'L-0024', title: 'Beykoz Riva 5 dönüm', price: 4250000, areaSqm: 5000, imarType: 'tarim' } },
  { id: 'e-3', method: 'POST', path: '/api/v1/listings', doctype: 'Listing', desc: 'Yeni ilan oluştur (draft)', auth: 'tenant', rateLimit: '10/dk', ai: true,
    exampleBody: { title: '...', city: 'İstanbul', district: 'Beykoz', areaSqm: 5000, price: 4250000 },
    exampleResponse: { id: 'L-XXXX', status: 'draft', aiSuggestions: { titleScore: 0.87, priceBand: { min: 3800000, max: 4500000 } } } },
  { id: 'e-4', method: 'PATCH', path: '/api/v1/listings/:id', doctype: 'Listing', desc: 'İlan güncelle (partial)', auth: 'tenant', rateLimit: '30/dk', ai: false,
    exampleBody: { price: 4400000 }, exampleResponse: { id: 'L-0024', updatedAt: '2026-05-14T...' } },
  { id: 'e-5', method: 'DELETE', path: '/api/v1/listings/:id', doctype: 'Listing', desc: 'İlan sil (soft delete)', auth: 'tenant', rateLimit: '5/dk', ai: false,
    exampleResponse: { id: 'L-0024', deletedAt: '...' } },
  { id: 'e-6', method: 'POST', path: '/api/v1/listings/:id/ai-suggest', doctype: 'Listing', desc: 'AI başlık + fiyat önerisi', auth: 'tenant', rateLimit: '20/dk', ai: true,
    exampleResponse: { titles: ['...'], priceBand: { lo: 0, mid: 0, hi: 0 }, confidence: 0.84 } },
  // Offers
  { id: 'e-7', method: 'POST', path: '/api/v1/offers', doctype: 'Offer', desc: 'Teklif gönder', auth: 'tenant', rateLimit: '10/dk', ai: false,
    exampleBody: { listingId: 'L-0024', amount: 4100000, validUntil: '...' } },
  { id: 'e-8', method: 'GET', path: '/api/v1/offers', doctype: 'Offer', desc: 'Teklifleri listele', auth: 'tenant', rateLimit: '120/dk', ai: false },
  // Messages
  { id: 'e-9', method: 'POST', path: '/api/v1/messages', doctype: 'Message', desc: 'Mesaj gönder', auth: 'tenant', rateLimit: '60/dk', ai: false },
  { id: 'e-10', method: 'GET', path: '/api/v1/threads', doctype: 'Thread', desc: 'Konuşma listesi', auth: 'tenant', rateLimit: '120/dk', ai: false },
  // ECA
  { id: 'e-11', method: 'GET', path: '/api/v1/eca/rules', doctype: 'EcaRule', desc: 'ECA kurallarını listele', auth: 'admin', rateLimit: '60/dk', ai: false },
  { id: 'e-12', method: 'POST', path: '/api/v1/eca/rules', doctype: 'EcaRule', desc: 'Yeni ECA kuralı', auth: 'admin', rateLimit: '20/dk', ai: false },
  { id: 'e-13', method: 'POST', path: '/api/v1/eca/dry-run', doctype: 'EcaRule', desc: 'Kuralı örnek payload ile test et', auth: 'admin', rateLimit: '30/dk', ai: false },
  // TKGM
  { id: 'e-14', method: 'GET', path: '/api/v1/tkgm/verify', doctype: 'TkgmRecord', desc: 'Ada/parsel doğrulama (3rd-party mock)', auth: 'tenant', rateLimit: '50/gün', ai: false },
  // Users / Admin
  { id: 'e-15', method: 'GET', path: '/api/v1/users', doctype: 'User', desc: 'Kullanıcıları listele', auth: 'admin', rateLimit: '60/dk', ai: false },
  { id: 'e-16', method: 'POST', path: '/api/v1/users/:id/impersonate', doctype: 'User', desc: 'Admin impersonate (audit log\'lu)', auth: 'admin', rateLimit: '5/dk', ai: false },
  // AI
  { id: 'e-17', method: 'POST', path: '/api/v1/ai/value-estimate', doctype: 'Valuation', desc: 'AI emsal değerleme', auth: 'tenant', rateLimit: '30/dk', ai: true },
  { id: 'e-18', method: 'POST', path: '/api/v1/ai/risk-score', doctype: 'RiskScore', desc: 'AI risk skoru + açıklama', auth: 'tenant', rateLimit: '60/dk', ai: true },
  // Reports
  { id: 'e-19', method: 'GET', path: '/api/v1/reports/overview', doctype: 'Report', desc: 'Platform KPI özet', auth: 'admin', rateLimit: '30/dk', ai: false },
  // Audit
  { id: 'e-20', method: 'GET', path: '/api/v1/audit', doctype: 'AuditEvent', desc: 'Audit log (hash-chain doğrulamalı)', auth: 'admin', rateLimit: '60/dk', ai: false }
];

const METHOD_COLORS: Record<Endpoint['method'], string> = {
  GET: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  PUT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  PATCH: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  DELETE: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
};

const AUTH_LABELS: Record<Endpoint['auth'], { label: string; cls: string; Icon: typeof Globe }> = {
  public: { label: 'public', cls: 'text-emerald-600', Icon: Globe },
  tenant: { label: 'tenant', cls: 'text-amber-600', Icon: Lock },
  admin: { label: 'admin', cls: 'text-rose-600', Icon: ShieldCheck }
};

export default function ApiExplorerPage() {
  const [q, setQ] = useState('');
  const [authFilter, setAuthFilter] = useState<'all' | Endpoint['auth']>('all');
  const [selected, setSelected] = useState<Endpoint | null>(ENDPOINTS[0]);

  const filtered = useMemo(() => ENDPOINTS.filter((e) => {
    if (authFilter !== 'all' && e.auth !== authFilter) return false;
    if (!q.trim()) return true;
    const qq = q.toLowerCase();
    return e.path.toLowerCase().includes(qq) || e.doctype.toLowerCase().includes(qq) || e.desc.toLowerCase().includes(qq);
  }), [q, authFilter]);

  return (
    <div>
      <SectionHeading
        title="API Explorer"
        description="S01 Auto REST API Engine — DocType'tan otomatik üretilen endpoint kataloğu"
        actions={<AiBadge>Excel S01</AiBadge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Endpoint" value={ENDPOINTS.length} icon={<Code size={20} weight="fill" />} hint={`${ENDPOINTS.filter((e) => e.ai).length} AI-augmented`} />
        <Stat label="DocType" value={new Set(ENDPOINTS.map((e) => e.doctype)).size} icon={<ListNumbers size={20} weight="fill" />} hint="Auto-generated" />
        <Stat label="Public" value={ENDPOINTS.filter((e) => e.auth === 'public').length} icon={<Globe size={20} weight="fill" />} hint="No auth" />
        <Stat label="Avg p95" value="142ms" icon={<Lightning size={20} weight="fill" />} hint="Tüm endpointler" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Endpoint ara..."
            className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            aria-label="Endpoint arama"
          />
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'public', 'tenant', 'admin'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setAuthFilter(f)}
                className={cls('text-xs px-2 py-1 rounded-full border', authFilter === f ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 dark:border-slate-700')}
              >{f}</button>
            ))}
          </div>
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filtered.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => setSelected(e)}
                  className={cls(
                    'w-full text-left flex items-center gap-2 p-2 rounded-r-2',
                    selected?.id === e.id ? 'bg-brand-50 dark:bg-brand-900/30 ring-1 ring-brand-300 dark:ring-brand-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <span className={cls('text-[10px] font-bold uppercase rounded px-1.5 py-0.5 shrink-0', METHOD_COLORS[e.method])}>{e.method}</span>
                  <code className="text-xs flex-1 truncate">{e.path}</code>
                  {e.ai && <Sparkle size={12} weight="fill" className="text-brand-500 shrink-0" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="text-xs text-fg-3 px-2 py-3">Eşleşme yok.</li>}
          </ul>
        </div>

        <div className="lg:col-span-2">
          {selected && <EndpointDetail endpoint={selected} />}
        </div>
      </div>
    </div>
  );
}

function EndpointDetail({ endpoint }: { endpoint: Endpoint }) {
  const auth = AUTH_LABELS[endpoint.auth];
  const Auth = auth.Icon;
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function tryIt() {
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      setLoading(false);
      setResponse(JSON.stringify(endpoint.exampleResponse ?? { ok: true, mock: true, endpoint: endpoint.path }, null, 2));
      toast('success', 'Mock yanıt alındı', `${endpoint.method} ${endpoint.path} → 200 OK (mock 800ms)`);
    }, 800);
  }

  return (
    <Card>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={cls('text-xs font-bold uppercase rounded px-2 py-0.5', METHOD_COLORS[endpoint.method])}>{endpoint.method}</span>
        <code className="text-sm font-medium">{endpoint.path}</code>
        <button
          onClick={() => { navigator.clipboard?.writeText(endpoint.path); toast('success', 'Kopyalandı', endpoint.path); }}
          className="text-fg-3 hover:text-fg-1 p-1"
          aria-label="Yolu kopyala"
        ><Copy size={14} /></button>
      </div>
      <p className="text-sm text-fg-3 mb-3">{endpoint.desc}</p>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs mb-3">
        <div>
          <dt className="text-fg-3 uppercase tracking-wide">DocType</dt>
          <dd className="font-mono">{endpoint.doctype}</dd>
        </div>
        <div>
          <dt className="text-fg-3 uppercase tracking-wide">Auth</dt>
          <dd className={cls('inline-flex items-center gap-1 font-medium', auth.cls)}><Auth size={12} weight="fill" /> {auth.label}</dd>
        </div>
        <div>
          <dt className="text-fg-3 uppercase tracking-wide">Rate limit</dt>
          <dd>{endpoint.rateLimit}</dd>
        </div>
        <div>
          <dt className="text-fg-3 uppercase tracking-wide">AI augmented</dt>
          <dd>{endpoint.ai ? <span className="inline-flex items-center gap-1 text-brand-700 dark:text-brand-300"><Sparkle size={12} weight="fill" /> Evet</span> : 'Hayır'}</dd>
        </div>
      </dl>

      {endpoint.exampleBody !== undefined && (
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1">Request body örneği</div>
          <pre className="text-xs bg-slate-100 dark:bg-slate-800 rounded-r-2 p-3 overflow-x-auto">{JSON.stringify(endpoint.exampleBody, null, 2)}</pre>
        </div>
      )}

      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1">Response örneği</div>
        <pre className="text-xs bg-slate-100 dark:bg-slate-800 rounded-r-2 p-3 overflow-x-auto">{JSON.stringify(endpoint.exampleResponse ?? { ok: true }, null, 2)}</pre>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={tryIt} disabled={loading} iconLeft={<Play size={14} />}>
          {loading ? 'Çağrılıyor...' : 'Try it (mock)'}
        </Button>
        <Button variant="outline" iconLeft={<Code size={14} />} onClick={() => toast('info', 'OpenAPI', 'Mock: /api/v1/openapi.json indirilebilir.')}>OpenAPI</Button>
      </div>

      {response && (
        <div className="mt-3">
          <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1">Yanıt</div>
          <pre className="text-xs bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-r-2 p-3 overflow-x-auto">{response}</pre>
        </div>
      )}
    </Card>
  );
}
