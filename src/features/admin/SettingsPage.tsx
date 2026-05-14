import { useParams, Link } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Gear, Cube, Sparkle, ShieldCheck, Cpu, MagnifyingGlass, Code, Tag, Buildings, Users } from '@phosphor-icons/react';

const SECTIONS = [
  { id: 'general', label: 'Genel', Icon: Gear },
  { id: 'tenant', label: 'Kiracılık', Icon: Buildings },
  { id: 'ai-providers', label: 'LLM Sağlayıcılar', Icon: Cpu },
  { id: 'ai-prompts', label: 'Prompt Kütüphanesi', Icon: Code },
  { id: 'ai-search', label: 'Vector Search', Icon: MagnifyingGlass },
  { id: 'ai-tools', label: 'AI Tool Registry', Icon: Sparkle },
  { id: 'pii', label: 'PII Yönetimi', Icon: ShieldCheck },
  { id: 'schema', label: 'Schema (DocType)', Icon: Tag },
  { id: 'schema-history', label: 'Schema Geçmişi', Icon: Cube }
];

export default function SettingsPage() {
  const { section } = useParams();
  const current = SECTIONS.find((s) => s.id === section) || SECTIONS[0];

  return (
    <div>
      <SectionHeading title="Platform Ayarları" description="Sistem geneli yapılandırma" />
      <div className="grid lg:grid-cols-4 gap-4">
        <nav className="lg:col-span-1">
          <Card className="!p-2">
            {SECTIONS.map((s) => (
              <Link key={s.id} to={`/admin/settings/${s.id}`} className={`flex items-center gap-2 rounded-r-2 px-3 py-2 text-sm ${current.id === s.id ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200' : 'text-fg-2 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <s.Icon size={16} weight="duotone" />
                {s.label}
              </Link>
            ))}
          </Card>
        </nav>
        <div className="lg:col-span-3 space-y-3">
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><current.Icon size={18} /> {current.label}</h3>
            <SectionBody id={current.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionBody({ id }: { id: string }) {
  switch (id) {
    case 'ai-providers': return <AiProvidersSection />;
    case 'ai-prompts': return <AiPromptsSection />;
    case 'ai-tools': return <AiToolsSection />;
    case 'ai-search': return <AiSearchSection />;
    case 'pii': return <PiiSection />;
    case 'schema': return <SchemaSection />;
    case 'schema-history': return <SchemaHistorySection />;
    case 'tenant':
      return (
        <div className="space-y-2">
          <Input label="Tenant adı" defaultValue="LandX Demo" block />
          <Input label="Domain" defaultValue="demo.landx.test" block />
          <Input label="Kota: ilan/ay" type="number" defaultValue={1000} block />
          <Input label="Kullanıcı limiti" type="number" defaultValue={500} block />
          <div className="text-xs text-fg-3">Multi-tenant izolasyon: schema-per-tenant. Cross-tenant breach 0.</div>
          <Button>Kaydet</Button>
        </div>
      );
    default:
      return (
        <div className="space-y-3">
          <Input label="Platform adı" defaultValue="LandX" block />
          <Input label="Destek e-posta" defaultValue="support@landx.test" block />
          <Input label="KVKK e-posta" defaultValue="kvkk@landx.test" block />
          <Input label="VERBİS kayıt no" defaultValue="VRBS-2024-0142" block />
          <Button>Kaydet</Button>
        </div>
      );
  }
}

interface ProviderRow { name: string; status: 'aktif' | 'devre dışı'; share: number; models: string[]; p95: number; costPer1k: number; }
const PROVIDERS: ProviderRow[] = [
  { name: 'Anthropic Claude', status: 'aktif', share: 62, models: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5'], p95: 720, costPer1k: 0.003 },
  { name: 'OpenAI GPT', status: 'aktif', share: 24, models: ['gpt-4.1', 'gpt-4o-mini', 'text-embedding-3-small'], p95: 840, costPer1k: 0.0025 },
  { name: 'Azure OpenAI', status: 'aktif', share: 8, models: ['gpt-4.1-azure-tr', 'gpt-4o-azure'], p95: 910, costPer1k: 0.0028 },
  { name: 'AWS Bedrock', status: 'devre dışı', share: 0, models: ['claude-sonnet-bedrock'], p95: 0, costPer1k: 0.0029 },
  { name: 'Ollama (lokal)', status: 'aktif', share: 6, models: ['llama-3.1-70b', 'mistral-large'], p95: 1620, costPer1k: 0 }
];

function AiProvidersSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-3">A07 modülü altında 5 sağlayıcı. Routing: <strong>cost-optimal</strong> · Failover: <strong>2sn</strong> · Circuit breaker aktif.</p>
      <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left px-3 py-2">Sağlayıcı</th>
              <th className="text-left px-3 py-2">Durum</th>
              <th className="text-right px-3 py-2">Pay</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">Modeller</th>
              <th className="text-right px-3 py-2 hidden lg:table-cell">P95 (ms)</th>
              <th className="text-right px-3 py-2 hidden lg:table-cell">$/1K token</th>
            </tr>
          </thead>
          <tbody>
            {PROVIDERS.map((p) => (
              <tr key={p.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'aktif' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{p.status}</span></td>
                <td className="px-3 py-2 text-right text-xs">{p.share}%</td>
                <td className="px-3 py-2 hidden md:table-cell text-xs text-fg-3">{p.models.join(', ')}</td>
                <td className="px-3 py-2 text-right hidden lg:table-cell text-xs">{p.p95 || '—'}</td>
                <td className="px-3 py-2 text-right hidden lg:table-cell text-xs">{p.costPer1k ? `$${p.costPer1k.toFixed(4)}` : 'lokal'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button size="sm" variant="outline">+ Yeni sağlayıcı ekle</Button>
    </div>
  );
}

interface PromptRow { id: string; version: string; latency: number; coverage: number; ab: number; lastDeploy: string; }
const PROMPTS: PromptRow[] = [
  { id: 'listing.summary',       version: 'v3.2', latency: 480, coverage: 92, ab: 62, lastDeploy: '2 gün önce' },
  { id: 'listing.title-improve', version: 'v2.0', latency: 320, coverage: 88, ab: 71, lastDeploy: '5 gün önce' },
  { id: 'risk.explain',          version: 'v4.1', latency: 540, coverage: 95, ab: 58, lastDeploy: '1 gün önce' },
  { id: 'message.reply-draft',   version: 'v1.5', latency: 380, coverage: 78, ab: 54, lastDeploy: '3 gün önce' },
  { id: 'price.suggest',         version: 'v2.3', latency: 290, coverage: 84, ab: 66, lastDeploy: '4 gün önce' },
  { id: 'eca.rule-suggest',      version: 'v0.4', latency: 620, coverage: 65, ab: 48, lastDeploy: '6 gün önce' },
  { id: 'tkgm.parse-doc',        version: 'v1.0', latency: 1200, coverage: 90, ab: 60, lastDeploy: '7 gün önce' }
];

function AiPromptsSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-3">A06 modülü. {PROMPTS.length} prompt versiyonlu. Eval coverage hedefi &gt;80%. Drift detection aktif.</p>
      <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left px-3 py-2">Prompt ID</th>
              <th className="text-left px-3 py-2">Sürüm</th>
              <th className="text-right px-3 py-2 hidden md:table-cell">P95 (ms)</th>
              <th className="text-right px-3 py-2 hidden md:table-cell">Eval coverage</th>
              <th className="text-right px-3 py-2">A/B win</th>
              <th className="text-left px-3 py-2 hidden lg:table-cell">Son deploy</th>
            </tr>
          </thead>
          <tbody>
            {PROMPTS.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-3 py-2"><code className="text-xs text-brand-700 dark:text-brand-300">{p.id}</code></td>
                <td className="px-3 py-2 text-xs">{p.version}</td>
                <td className="px-3 py-2 text-right hidden md:table-cell text-xs">{p.latency}</td>
                <td className="px-3 py-2 text-right hidden md:table-cell text-xs">%{p.coverage}</td>
                <td className="px-3 py-2 text-right text-xs">%{p.ab}</td>
                <td className="px-3 py-2 text-xs text-fg-3 hidden lg:table-cell">{p.lastDeploy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button size="sm" variant="outline">+ Yeni prompt</Button>
    </div>
  );
}

interface ToolRow { name: string; plugin: string; readOnly: boolean; idempotent: boolean; latency: number; }
const TOOLS: ToolRow[] = [
  { name: 'search_listing', plugin: 'landx.core', readOnly: true,  idempotent: true,  latency: 240 },
  { name: 'create_listing', plugin: 'landx.core', readOnly: false, idempotent: true,  latency: 510 },
  { name: 'send_message',   plugin: 'landx.core', readOnly: false, idempotent: false, latency: 180 },
  { name: 'accept_offer',   plugin: 'landx.core', readOnly: false, idempotent: true,  latency: 320 },
  { name: 'verify_tkgm',    plugin: 'landx.tkgm', readOnly: true,  idempotent: true,  latency: 2400 },
  { name: 'summarize_thread', plugin: 'landx.ai', readOnly: true,  idempotent: true,  latency: 720 },
  { name: 'value_estimate', plugin: 'landx.ai',  readOnly: true,  idempotent: true,  latency: 410 },
  { name: 'risk_score',     plugin: 'landx.ai',  readOnly: true,  idempotent: true,  latency: 290 },
  { name: 'export_audit',   plugin: 'landx.core', readOnly: true,  idempotent: true,  latency: 880 }
];

function AiToolsSection() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-3">A02 modülü. {TOOLS.length} kayıtlı tool, hepsi MCP üzerinden expose. AI tool-selection accuracy &gt;%90.</p>
      <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left px-3 py-2">Tool</th>
              <th className="text-left px-3 py-2 hidden sm:table-cell">Plugin</th>
              <th className="text-center px-3 py-2">Read-only</th>
              <th className="text-center px-3 py-2 hidden md:table-cell">Idempotent</th>
              <th className="text-right px-3 py-2 hidden md:table-cell">P95 ms</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((t) => (
              <tr key={t.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-3 py-2"><code className="text-xs text-brand-700 dark:text-brand-300">{t.name}</code></td>
                <td className="px-3 py-2 hidden sm:table-cell text-xs">{t.plugin}</td>
                <td className="px-3 py-2 text-center text-xs">{t.readOnly ? '✓' : '×'}</td>
                <td className="px-3 py-2 text-center hidden md:table-cell text-xs">{t.idempotent ? '✓' : '×'}</td>
                <td className="px-3 py-2 text-right hidden md:table-cell text-xs">{t.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AiSearchSection() {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-fg-3">A05 modülü. pgvector tabanlı hybrid search (BM25 + vector + temporal).</p>
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
          <div className="text-xs uppercase tracking-wider text-fg-3">Embedding modeli</div>
          <div className="font-medium mt-1">text-embedding-3-small</div>
          <div className="text-xs text-fg-3">1536 boyut · 220 indexed doc</div>
        </div>
        <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
          <div className="text-xs uppercase tracking-wider text-fg-3">NDCG@10</div>
          <div className="font-medium mt-1 text-emerald-600">0.78</div>
          <div className="text-xs text-fg-3">Hedef &gt;0.75</div>
        </div>
        <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
          <div className="text-xs uppercase tracking-wider text-fg-3">Sorgu P95</div>
          <div className="font-medium mt-1">210ms</div>
          <div className="text-xs text-fg-3">Hedef &lt;250ms</div>
        </div>
        <div className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
          <div className="text-xs uppercase tracking-wider text-fg-3">Reindex throughput</div>
          <div className="font-medium mt-1">1.2K/dk</div>
          <div className="text-xs text-fg-3">Hedef &gt;1K/dk</div>
        </div>
      </div>
      <Button size="sm" variant="outline">Reindex tetikle</Button>
    </div>
  );
}

interface PiiRow { field: string; classification: 'public' | 'internal' | 'confidential' | 'restricted'; encryption: 'kapalı' | 'AES-256' | 'envelope'; retentionDays: number; redactInLogs: boolean; }
const PII: PiiRow[] = [
  { field: 'email', classification: 'confidential', encryption: 'AES-256', retentionDays: 2555, redactInLogs: true },
  { field: 'phone', classification: 'confidential', encryption: 'AES-256', retentionDays: 2555, redactInLogs: true },
  { field: 'address', classification: 'internal', encryption: 'kapalı', retentionDays: 1825, redactInLogs: false },
  { field: 'kimlikNo', classification: 'restricted', encryption: 'envelope', retentionDays: 3650, redactInLogs: true },
  { field: 'ipAddress', classification: 'internal', encryption: 'kapalı', retentionDays: 90, redactInLogs: true },
  { field: 'birthDate', classification: 'confidential', encryption: 'AES-256', retentionDays: 2555, redactInLogs: true },
  { field: 'tapuSenediNo', classification: 'restricted', encryption: 'envelope', retentionDays: 3650, redactInLogs: true },
  { field: 'iban', classification: 'restricted', encryption: 'envelope', retentionDays: 730, redactInLogs: true }
];

function PiiSection() {
  const CLS_COLOR: Record<PiiRow['classification'], string> = {
    public: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    internal: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    confidential: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    restricted: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-3">D02 modülü. Otomatik PII keşfi recall &gt;%98. KVKK m.7 (silme) + m.11 (erişim) DSAR &lt;72sa.</p>
      <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left px-3 py-2">Alan</th>
              <th className="text-left px-3 py-2">Sınıf</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">Şifreleme</th>
              <th className="text-right px-3 py-2 hidden md:table-cell">Saklama (gün)</th>
              <th className="text-center px-3 py-2 hidden sm:table-cell">Log'da maskele</th>
            </tr>
          </thead>
          <tbody>
            {PII.map((p) => (
              <tr key={p.field} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-3 py-2"><code className="text-xs">{p.field}</code></td>
                <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded-full ${CLS_COLOR[p.classification]}`}>{p.classification}</span></td>
                <td className="px-3 py-2 text-xs hidden md:table-cell">{p.encryption}</td>
                <td className="px-3 py-2 text-right text-xs hidden md:table-cell">{p.retentionDays}</td>
                <td className="px-3 py-2 text-center hidden sm:table-cell text-xs">{p.redactInLogs ? '✓' : '×'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SchemaSection() {
  const docTypes = [
    { name: 'Listing', fields: 28, indexed: 9, mcp: true },
    { name: 'Offer', fields: 12, indexed: 4, mcp: true },
    { name: 'Thread', fields: 7, indexed: 3, mcp: false },
    { name: 'Message', fields: 9, indexed: 2, mcp: false },
    { name: 'User', fields: 22, indexed: 6, mcp: true },
    { name: 'EcaRule', fields: 11, indexed: 3, mcp: false },
    { name: 'AuditEvent', fields: 10, indexed: 4, mcp: false },
    { name: 'TkgmQuery', fields: 8, indexed: 2, mcp: false },
    { name: 'Notification', fields: 9, indexed: 3, mcp: false }
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-3">K02 modülü. DocType definition → çalışır API &lt;60sn. Mevcut {docTypes.length} DocType.</p>
      <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
              <th className="text-left px-3 py-2">DocType</th>
              <th className="text-right px-3 py-2">Alan</th>
              <th className="text-right px-3 py-2 hidden sm:table-cell">Index</th>
              <th className="text-center px-3 py-2 hidden md:table-cell">MCP tool</th>
            </tr>
          </thead>
          <tbody>
            {docTypes.map((d) => (
              <tr key={d.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-3 py-2 font-medium">{d.name}</td>
                <td className="px-3 py-2 text-right text-xs">{d.fields}</td>
                <td className="px-3 py-2 text-right hidden sm:table-cell text-xs">{d.indexed}</td>
                <td className="px-3 py-2 text-center hidden md:table-cell text-xs">{d.mcp ? '✓' : '×'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SchemaHistorySection() {
  const migs = [
    { v: 'v1.4.2', at: '2026-05-12', name: 'Listing.aiTags index', rollback: 'rollback OK' },
    { v: 'v1.4.1', at: '2026-05-09', name: 'User.vipScore column', rollback: 'rollback OK' },
    { v: 'v1.4.0', at: '2026-05-01', name: 'Offer.history JSONB', rollback: 'rollback OK' },
    { v: 'v1.3.9', at: '2026-04-22', name: 'EcaRule.event enum widen', rollback: 'rollback OK' },
    { v: 'v1.3.8', at: '2026-04-14', name: 'AuditEvent.hashPrev', rollback: 'rollback OK' }
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-fg-3">K03 modülü. Son 30 günde {migs.length} migration. Hepsi rollback OK.</p>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
        {migs.map((m) => (
          <li key={m.v} className="py-2 flex items-center gap-3">
            <code className="text-xs text-brand-700 dark:text-brand-300 shrink-0">{m.v}</code>
            <span className="flex-1">{m.name}</span>
            <span className="text-xs text-fg-3">{m.at}</span>
            <span className="text-xs text-emerald-600">{m.rollback}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
