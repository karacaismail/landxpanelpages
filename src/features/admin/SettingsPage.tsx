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
    case 'ai-providers':
      return (
        <div className="space-y-3">
          {['Anthropic Claude', 'OpenAI GPT', 'Azure OpenAI', 'AWS Bedrock', 'Ollama (lokal)'].map((p) => (
            <div key={p} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
              <div>
                <div className="text-sm font-medium">{p}</div>
                <div className="text-xs text-fg-3">Modeller: 3 · Routing: cost-optimal</div>
              </div>
              <Button size="xs" variant="outline">Düzenle</Button>
            </div>
          ))}
        </div>
      );
    case 'ai-prompts':
      return (
        <div className="space-y-2">
          {['listing.summary', 'listing.title-improve', 'risk.explain', 'message.reply-draft', 'price.suggest'].map((p) => (
            <div key={p} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
              <code className="text-sm">{p}</code>
              <div className="text-xs text-fg-3">v3.2 · A/B: %62 win</div>
            </div>
          ))}
        </div>
      );
    case 'ai-search':
      return <div className="text-sm text-fg-3">pgvector tabanlı hybrid search (mock). Embedding modeli: text-embedding-3-small (1536 boyut). Index boyutu: 220 doc.</div>;
    case 'ai-tools':
      return (
        <div className="space-y-2">
          {['search_listing', 'create_listing', 'send_message', 'accept_offer', 'verify_tkgm', 'summarize_thread'].map((p) => (
            <div key={p} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
              <code className="text-sm">{p}</code>
              <div className="text-xs text-fg-3">MCP · idempotent · read-only={p.startsWith('search') ? 'true' : 'false'}</div>
            </div>
          ))}
        </div>
      );
    case 'pii':
      return (
        <div className="space-y-2 text-sm">
          <p className="text-fg-3">Alan bazlı sınıflandırma. Otomatik keşif %98+ recall (mock).</p>
          {[['email', 'confidential'], ['phone', 'confidential'], ['address', 'internal'], ['kimlikNo', 'restricted'], ['ipAddress', 'internal']].map(([f, c]) => (
            <div key={f} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
              <code>{f}</code>
              <span className="text-xs">{c}</span>
            </div>
          ))}
        </div>
      );
    case 'schema':
      return <div className="text-sm text-fg-3">DocType engine — mevcut: Listing, Offer, Thread, Message, EcaRule, User, AuditEvent, TkgmQuery (mock).</div>;
    case 'tenant':
      return (
        <div className="space-y-2">
          <Input label="Tenant adı" defaultValue="LandX Demo" block />
          <Input label="Domain" defaultValue="demo.landx.test" block />
          <Input label="Kota: ilan/ay" type="number" defaultValue={1000} block />
        </div>
      );
    default:
      return (
        <div className="space-y-3">
          <Input label="Platform adı" defaultValue="LandX" block />
          <Input label="Destek e-posta" defaultValue="support@landx.test" block />
          <Input label="KVKK e-posta" defaultValue="kvkk@landx.test" block />
          <Button>Kaydet</Button>
        </div>
      );
  }
}
