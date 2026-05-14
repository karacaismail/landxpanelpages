// K02 DocType Engine (Schema Runtime) — declarative schema → DB/REST/UI/MCP otomatik
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { SortableList } from '@/components/ui/SortableList';
import {
  Stack, Sparkle, Database, Code, Globe, Eye, Plus, X, Pencil, Trash, FloppyDisk,
  CheckCircle, Sigma, Lightning, ArrowsClockwise, Robot
} from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

type FieldType = 'string' | 'text' | 'int' | 'decimal' | 'boolean' | 'datetime' | 'enum' | 'uuid' | 'jsonb' | 'vector' | 'foreign' | 'file';

interface DocField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  indexed: boolean;
  ai: boolean;
  mcp: boolean;
  description?: string;
  defaultValue?: string;
  enumValues?: string[];
  refDocType?: string;
}

interface DocType {
  id: string;
  name: string;
  slug: string;
  namespace: string;
  displayName: string;
  description: string;
  fields: DocField[];
  isSubmittable: boolean;
  isSingleton: boolean;
  publicRead: boolean;
  createdAt: string;
  status: 'draft' | 'live' | 'deprecated';
}

const SAMPLE_DOCTYPES: DocType[] = [
  {
    id: 'dt-listing', name: 'Listing', slug: 'listing', namespace: 'landx.core', displayName: 'İlan', description: 'Arsa ilanı çekirdek modeli', isSubmittable: true, isSingleton: false, publicRead: true, status: 'live', createdAt: '2025-09-01',
    fields: [
      { id: 'f1', name: 'id', type: 'uuid', required: true, unique: true, indexed: true, ai: false, mcp: true },
      { id: 'f2', name: 'title', type: 'string', required: true, unique: false, indexed: true, ai: true, mcp: true, description: 'SEO uyumlu başlık' },
      { id: 'f3', name: 'description', type: 'text', required: false, unique: false, indexed: false, ai: true, mcp: false },
      { id: 'f4', name: 'price', type: 'decimal', required: true, unique: false, indexed: true, ai: true, mcp: true },
      { id: 'f5', name: 'city', type: 'string', required: true, unique: false, indexed: true, ai: false, mcp: true },
      { id: 'f6', name: 'area_sqm', type: 'decimal', required: true, unique: false, indexed: false, ai: false, mcp: true },
      { id: 'f7', name: 'tkgm_status', type: 'enum', required: true, unique: false, indexed: false, ai: false, mcp: true, enumValues: ['temiz', 'ipotekli', 'serh', 'tedbir'] },
      { id: 'f8', name: 'imar_type', type: 'enum', required: false, unique: false, indexed: true, ai: false, mcp: true, enumValues: ['konut', 'ticari', 'sanayi', 'tarim', 'zeytinlik', 'turizm'] },
      { id: 'f9', name: 'owner_id', type: 'foreign', required: true, unique: false, indexed: true, ai: false, mcp: true, refDocType: 'User' },
      { id: 'f10', name: 'embedding', type: 'vector', required: false, unique: false, indexed: true, ai: true, mcp: false, description: '1536-dim semantic vector' }
    ]
  },
  {
    id: 'dt-user', name: 'User', slug: 'user', namespace: 'landx.identity', displayName: 'Kullanıcı', description: 'Bireysel/kurumsal/agent', isSubmittable: false, isSingleton: false, publicRead: false, status: 'live', createdAt: '2025-09-01',
    fields: [
      { id: 'f1', name: 'id', type: 'uuid', required: true, unique: true, indexed: true, ai: false, mcp: true },
      { id: 'f2', name: 'email', type: 'string', required: true, unique: true, indexed: true, ai: false, mcp: true },
      { id: 'f3', name: 'roles', type: 'jsonb', required: true, unique: false, indexed: false, ai: false, mcp: true },
      { id: 'f4', name: 'kyc_level', type: 'enum', required: true, unique: false, indexed: true, ai: false, mcp: true, enumValues: ['none', 'phone', 'address', 'full'] }
    ]
  },
  {
    id: 'dt-offer', name: 'Offer', slug: 'offer', namespace: 'landx.core', displayName: 'Teklif', description: 'Alıcı tarafından gönderilen teklif', isSubmittable: true, isSingleton: false, publicRead: false, status: 'live', createdAt: '2025-10-12',
    fields: [
      { id: 'f1', name: 'id', type: 'uuid', required: true, unique: true, indexed: true, ai: false, mcp: true },
      { id: 'f2', name: 'listing_id', type: 'foreign', required: true, unique: false, indexed: true, ai: false, mcp: true, refDocType: 'Listing' },
      { id: 'f3', name: 'buyer_id', type: 'foreign', required: true, unique: false, indexed: true, ai: false, mcp: true, refDocType: 'User' },
      { id: 'f4', name: 'amount', type: 'decimal', required: true, unique: false, indexed: false, ai: true, mcp: true },
      { id: 'f5', name: 'status', type: 'enum', required: true, unique: false, indexed: true, ai: false, mcp: true, enumValues: ['pending', 'counter', 'accepted', 'rejected', 'withdrawn', 'expired'] }
    ]
  },
  {
    id: 'dt-property-history', name: 'PropertyHistory', slug: 'property_history', namespace: 'landx.history', displayName: 'Mülk Geçmişi', description: 'Yeni — TKGM tarihsel kayıtlar', isSubmittable: false, isSingleton: false, publicRead: false, status: 'draft', createdAt: '2026-05-13',
    fields: [
      { id: 'f1', name: 'id', type: 'uuid', required: true, unique: true, indexed: true, ai: false, mcp: false },
      { id: 'f2', name: 'parcel_id', type: 'string', required: true, unique: false, indexed: true, ai: false, mcp: true }
    ]
  }
];

const TYPE_COLOR: Record<FieldType, string> = {
  uuid: 'text-violet-600 dark:text-violet-400',
  string: 'text-emerald-600 dark:text-emerald-400',
  text: 'text-emerald-700 dark:text-emerald-300',
  int: 'text-sky-600 dark:text-sky-400',
  decimal: 'text-sky-700 dark:text-sky-300',
  boolean: 'text-amber-600 dark:text-amber-400',
  datetime: 'text-rose-600 dark:text-rose-400',
  enum: 'text-fuchsia-600 dark:text-fuchsia-400',
  jsonb: 'text-cyan-600 dark:text-cyan-400',
  vector: 'text-indigo-600 dark:text-indigo-400',
  foreign: 'text-orange-600 dark:text-orange-400',
  file: 'text-pink-600 dark:text-pink-400'
};

export default function DocTypeStudioPage() {
  const [doctypes, setDoctypes] = useState<DocType[]>(SAMPLE_DOCTYPES);
  const [selected, setSelected] = useState<DocType | null>(SAMPLE_DOCTYPES[0]);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<'fields' | 'sql' | 'api' | 'admin' | 'mcp'>('fields');

  function upsertDocType(d: DocType) {
    setDoctypes((prev) => {
      const idx = prev.findIndex((x) => x.id === d.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = d; return copy; }
      return [...prev, d];
    });
    setSelected(d);
    toast('success', 'DocType kaydedildi', `${d.displayName} (${d.fields.length} alan)`);
  }

  function deployDocType() {
    if (!selected) return;
    upsertDocType({ ...selected, status: 'live' });
    toast('success', 'Deploy başarılı', `${selected.name}.* endpoint'leri aktif, admin UI hazır.`);
  }

  return (
    <div>
      <SectionHeading
        title="DocType Studio (K02)"
        description="Declarative schema → DB tablo + REST API + Admin UI + MCP tool spec otomatik üretim"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel K02</AiBadge>
            <Button size="sm" iconLeft={<Plus size={14} />} onClick={() => setCreating(true)}>Yeni DocType</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="DocType" value={doctypes.length} icon={<Stack size={20} weight="fill" />} hint={`${doctypes.filter((d) => d.status === 'live').length} canlı`} />
        <Stat label="Toplam alan" value={doctypes.reduce((s, d) => s + d.fields.length, 0)} icon={<Database size={20} weight="fill" />} />
        <Stat label="AI augmented" value={doctypes.reduce((s, d) => s + d.fields.filter((f) => f.ai).length, 0)} icon={<Sparkle size={20} weight="fill" />} hint="Alanlar" />
        <Stat label="MCP exposure" value={doctypes.reduce((s, d) => s + d.fields.filter((f) => f.mcp).length, 0)} icon={<Robot size={20} weight="fill" />} hint="Tool inputs" />
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1 space-y-2">
          <Card className="!p-0 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-fg-3 font-semibold">DocType listesi</div>
            <ul>
              {doctypes.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setSelected(d)}
                    className={cls(
                      'w-full text-left px-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0',
                      selected?.id === d.id ? 'bg-brand-50 dark:bg-brand-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm">{d.displayName}</div>
                      <span className={cls(
                        'ml-auto text-[10px] uppercase px-1 py-0.5 rounded font-bold',
                        d.status === 'live' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : d.status === 'draft' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      )}>{d.status}</span>
                    </div>
                    <code className="text-[11px] text-fg-3">{d.namespace}.{d.slug}</code>
                    <div className="text-[11px] text-fg-3 mt-0.5">{d.fields.length} alan</div>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          {selected ? <DocTypeEditor doctype={selected} onChange={upsertDocType} preview={preview} setPreview={setPreview} onDeploy={deployDocType} /> : <Card className="text-center py-8 text-fg-3">DocType seçin</Card>}
        </div>
      </div>

      {creating && <NewDocTypeWizard onClose={() => setCreating(false)} onCreate={(d) => { upsertDocType(d); setCreating(false); }} />}
    </div>
  );
}

function DocTypeEditor({ doctype, onChange, preview, setPreview, onDeploy }: {
  doctype: DocType;
  onChange: (d: DocType) => void;
  preview: 'fields' | 'sql' | 'api' | 'admin' | 'mcp';
  setPreview: (p: 'fields' | 'sql' | 'api' | 'admin' | 'mcp') => void;
  onDeploy: () => void;
}) {
  const [fieldEditor, setFieldEditor] = useState<DocField | null>(null);

  function addField() {
    const newF: DocField = {
      id: `f-${Date.now().toString(36)}`,
      name: 'new_field', type: 'string', required: false, unique: false, indexed: false, ai: false, mcp: false
    };
    setFieldEditor(newF);
  }
  function saveField(f: DocField) {
    const idx = doctype.fields.findIndex((x) => x.id === f.id);
    const next = idx >= 0
      ? { ...doctype, fields: doctype.fields.map((x) => x.id === f.id ? f : x) }
      : { ...doctype, fields: [...doctype.fields, f] };
    onChange(next);
    setFieldEditor(null);
  }
  function deleteField(id: string) {
    onChange({ ...doctype, fields: doctype.fields.filter((x) => x.id !== id) });
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">{doctype.displayName}</h3>
          <code className="text-xs text-fg-3">{doctype.namespace}.{doctype.slug} · v1</code>
          <p className="text-sm text-fg-3 mt-1">{doctype.description}</p>
        </div>
        <div className="flex gap-2">
          {doctype.status === 'draft'
            ? <Button size="sm" onClick={onDeploy} iconLeft={<Lightning size={14} />}>Deploy</Button>
            : <Button size="sm" variant="outline" iconLeft={<ArrowsClockwise size={14} />} onClick={() => toast('info', 'Migration üretildi', 'AI tarafından K03 ile uygulanmaya hazır.')}>Sürüm güncelle</Button>}
        </div>
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-3 overflow-x-auto">
        {[
          { id: 'fields' as const, label: 'Alanlar', Icon: Database },
          { id: 'sql' as const, label: 'SQL', Icon: Code },
          { id: 'api' as const, label: 'REST API', Icon: Globe },
          { id: 'admin' as const, label: 'Admin UI', Icon: Eye },
          { id: 'mcp' as const, label: 'MCP Tool', Icon: Robot }
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setPreview(id)}
            className={cls(
              'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
              preview === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
            )}
          >
            <Icon size={14} weight={preview === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {preview === 'fields' && (
        <FieldsPanel doctype={doctype} onChange={onChange} onAdd={addField} onEdit={setFieldEditor} onDelete={deleteField} />
      )}
      {preview === 'sql' && <SqlPanel doctype={doctype} />}
      {preview === 'api' && <ApiPanel doctype={doctype} />}
      {preview === 'admin' && <AdminUiPanel doctype={doctype} />}
      {preview === 'mcp' && <McpPanel doctype={doctype} />}

      {fieldEditor && <FieldEditorModal field={fieldEditor} onSave={saveField} onClose={() => setFieldEditor(null)} />}
    </Card>
  );
}

function FieldsPanel({ doctype, onChange, onAdd, onEdit, onDelete }: {
  doctype: DocType;
  onChange: (d: DocType) => void;
  onAdd: () => void;
  onEdit: (f: DocField) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Alanlar ({doctype.fields.length}) — sürükle-bırak ile sırala</h4>
        <Button size="xs" iconLeft={<Plus size={12} />} onClick={onAdd}>Alan ekle</Button>
      </div>
      <SortableList
        items={doctype.fields}
        ariaLabel="Alanlar"
        onReorder={(next) => onChange({ ...doctype, fields: next })}
        renderItem={(f) => (
          <div className="flex items-center gap-2 text-sm w-full">
            <code className="font-mono font-medium">{f.name}</code>
            <span className={cls('text-xs font-mono', TYPE_COLOR[f.type])}>{f.type}</span>
            {f.required && <span className="text-[10px] text-rose-600 font-bold" title="Zorunlu">!</span>}
            {f.unique && <span className="text-[10px] uppercase px-1 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">unique</span>}
            {f.indexed && <span className="text-[10px] uppercase px-1 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">idx</span>}
            {f.ai && <span className="inline-flex items-center gap-0.5 text-[10px] text-brand-700 dark:text-brand-300"><Sparkle size={10} weight="fill" /> AI</span>}
            {f.mcp && <span className="text-[10px] uppercase px-1 rounded bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">MCP</span>}
            {f.refDocType && <span className="text-[10px] text-orange-700 dark:text-orange-300">→ {f.refDocType}</span>}
            <span className="text-xs text-fg-3 ml-2 truncate flex-1">{f.description}</span>
            <button onClick={() => onEdit(f)} className="p-1 text-fg-3 hover:text-fg-1" aria-label="Düzenle"><Pencil size={12} /></button>
            <button onClick={() => onDelete(f.id)} className="p-1 text-fg-3 hover:text-rose-600" aria-label="Sil"><Trash size={12} /></button>
          </div>
        )}
      />
    </>
  );
}

function SqlPanel({ doctype }: { doctype: DocType }) {
  const tableName = `${doctype.namespace.replace('.', '_')}_${doctype.slug}`;
  const sql = `-- Auto-generated from DocType "${doctype.name}" (K02)
-- Tenant izolasyon: schema-per-tenant (I05)

CREATE TABLE IF NOT EXISTS ${tableName} (
${doctype.fields.map((f) => `  ${f.name.padEnd(20)} ${sqlType(f).padEnd(18)}${f.required ? ' NOT NULL' : ''}${f.unique ? ' UNIQUE' : ''}`).join(',\n')},
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

${doctype.fields.filter((f) => f.indexed && f.name !== 'id').map((f) => `CREATE INDEX idx_${tableName}_${f.name} ON ${tableName} (${f.name});`).join('\n') || '-- no extra indexes'}

${doctype.fields.filter((f) => f.type === 'vector').map((f) => `CREATE INDEX idx_${tableName}_${f.name}_vec ON ${tableName} USING ivfflat (${f.name} vector_cosine_ops);`).join('\n') || '-- no vector indexes'}

-- Row-Level Security (I05 multi-tenant)
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON ${tableName} USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Audit trigger (D01)
CREATE TRIGGER ${tableName}_audit AFTER INSERT OR UPDATE OR DELETE ON ${tableName} FOR EACH ROW EXECUTE FUNCTION audit_log();
`;
  return (
    <div>
      <div className="text-xs text-fg-3 mb-2 inline-flex items-center gap-1.5"><CheckCircle size={12} weight="fill" className="text-emerald-500" /> Migration K03 ile otomatik uygulanır</div>
      <pre className="text-[11px] bg-slate-900 text-emerald-300 rounded-r-2 p-3 overflow-x-auto font-mono leading-relaxed">{sql}</pre>
    </div>
  );
}

function sqlType(f: DocField): string {
  switch (f.type) {
    case 'uuid': return 'uuid';
    case 'string': return 'varchar(255)';
    case 'text': return 'text';
    case 'int': return 'bigint';
    case 'decimal': return 'numeric(18,4)';
    case 'boolean': return 'boolean';
    case 'datetime': return 'timestamptz';
    case 'enum': return `varchar(40) CHECK (${f.name} IN (${(f.enumValues || []).map((v) => `'${v}'`).join(', ')}))`;
    case 'jsonb': return 'jsonb';
    case 'vector': return 'vector(1536)';
    case 'foreign': return `uuid REFERENCES ${f.refDocType?.toLowerCase()}s(id)`;
    case 'file': return 'varchar(512)';
  }
}

function ApiPanel({ doctype }: { doctype: DocType }) {
  const base = `/api/v1/${doctype.slug}`;
  const endpoints = [
    { method: 'GET', path: `${base}`, desc: 'Liste (sayfalı + filtre)' },
    { method: 'GET', path: `${base}/:id`, desc: 'Tek kayıt' },
    { method: 'POST', path: `${base}`, desc: 'Yeni kayıt oluştur' },
    { method: 'PATCH', path: `${base}/:id`, desc: 'Kısmi güncelle' },
    { method: 'DELETE', path: `${base}/:id`, desc: 'Sil (soft)' },
    ...(doctype.fields.some((f) => f.type === 'vector') ? [{ method: 'POST', path: `${base}/semantic-search`, desc: 'Vector similarity search (A05)' }] : []),
    ...(doctype.fields.some((f) => f.ai) ? [{ method: 'POST', path: `${base}/:id/ai-augment`, desc: 'AI alanlarını yeniden hesapla' }] : [])
  ];
  const COL: Record<string, string> = {
    GET: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    PATCH: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    DELETE: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
  };
  return (
    <div>
      <div className="text-xs text-fg-3 mb-2 inline-flex items-center gap-1.5"><CheckCircle size={12} weight="fill" className="text-emerald-500" /> S01 Auto REST API tarafından otomatik üretildi · OpenAPI 3.1 schema dahil</div>
      <ul className="space-y-1.5">
        {endpoints.map((e, i) => (
          <li key={i} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-2">
            <span className={cls('text-[10px] font-bold uppercase rounded px-1.5 py-0.5', COL[e.method])}>{e.method}</span>
            <code className="text-xs flex-1 truncate">{e.path}</code>
            <span className="text-[11px] text-fg-3">{e.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminUiPanel({ doctype }: { doctype: DocType }) {
  return (
    <div>
      <div className="text-xs text-fg-3 mb-2 inline-flex items-center gap-1.5"><CheckCircle size={12} weight="fill" className="text-emerald-500" /> S02 Auto Admin UI tarafından otomatik üretildi</div>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-r-3 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{doctype.displayName} · Liste sayfası</h4>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">Filtre ▾</span>
            <span className="text-xs px-2 py-1 rounded bg-brand-500 text-white">+ Yeni</span>
          </div>
        </div>
        <table className="w-full text-xs bg-white dark:bg-slate-900 rounded-r-2">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {doctype.fields.slice(0, 5).map((f) => (
                <th key={f.id} className="text-left px-2 py-1.5 font-medium text-fg-3">{f.name}</th>
              ))}
              <th className="text-right px-2 py-1.5 font-medium text-fg-3">›</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                {doctype.fields.slice(0, 5).map((f) => (
                  <td key={f.id} className="px-2 py-1.5 text-fg-3">[{f.name}]</td>
                ))}
                <td className="text-right text-fg-3">→</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-[11px] text-fg-3">Inline edit, bulk action, AI önerileri, CSV export — tümü otomatik.</div>
      </div>
    </div>
  );
}

function McpPanel({ doctype }: { doctype: DocType }) {
  const mcpFields = doctype.fields.filter((f) => f.mcp);
  const tool = {
    name: `landx.${doctype.slug}.list`,
    description: `${doctype.displayName} kayıtlarını listele`,
    input_schema: {
      type: 'object',
      properties: Object.fromEntries(mcpFields.map((f) => [f.name, { type: jsonType(f.type), description: f.description || '' }])),
      required: mcpFields.filter((f) => f.required && f.name !== 'id').map((f) => f.name)
    }
  };
  return (
    <div>
      <div className="text-xs text-fg-3 mb-2 inline-flex items-center gap-1.5"><CheckCircle size={12} weight="fill" className="text-emerald-500" /> A02 Tool Registry'e otomatik kayıt</div>
      <pre className="text-[11px] bg-slate-900 text-amber-300 rounded-r-2 p-3 overflow-x-auto font-mono leading-relaxed">{JSON.stringify(tool, null, 2)}</pre>
      <p className="text-xs text-fg-3 mt-2">AI ajanları bu tool'u kullanarak <code>landx.{doctype.slug}.list</code> + diğer CRUD operasyonlarını çağırabilir.</p>
    </div>
  );
}

function jsonType(t: FieldType): string {
  if (t === 'int' || t === 'decimal') return 'number';
  if (t === 'boolean') return 'boolean';
  if (t === 'jsonb') return 'object';
  return 'string';
}

function FieldEditorModal({ field, onSave, onClose }: { field: DocField; onSave: (f: DocField) => void; onClose: () => void }) {
  const [f, setF] = useState<DocField>(field);
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium">Alan düzenle</h3>
          <button onClick={onClose}><X size={16} /></button>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Alan adı (snake_case)</label>
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Tür</label>
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as FieldType })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
            {(['uuid', 'string', 'text', 'int', 'decimal', 'boolean', 'datetime', 'enum', 'jsonb', 'vector', 'foreign', 'file'] as FieldType[]).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {f.type === 'enum' && (
          <div>
            <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Enum değerleri (virgülle)</label>
            <input value={(f.enumValues || []).join(', ')} onChange={(e) => setF({ ...f, enumValues: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
          </div>
        )}
        {f.type === 'foreign' && (
          <div>
            <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Referans DocType</label>
            <input value={f.refDocType || ''} onChange={(e) => setF({ ...f, refDocType: e.target.value })} placeholder="User, Listing..." className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Açıklama</label>
          <input value={f.description || ''} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.required} onChange={(e) => setF({ ...f, required: e.target.checked })} /> Zorunlu</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.unique} onChange={(e) => setF({ ...f, unique: e.target.checked })} /> Tekil</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.indexed} onChange={(e) => setF({ ...f, indexed: e.target.checked })} /> Index</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.ai} onChange={(e) => setF({ ...f, ai: e.target.checked })} /> AI augmented</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.mcp} onChange={(e) => setF({ ...f, mcp: e.target.checked })} /> MCP exposure</label>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button size="sm" variant="ghost" onClick={onClose}>İptal</Button>
          <Button size="sm" iconLeft={<FloppyDisk size={14} />} onClick={() => onSave(f)} disabled={!f.name.trim()}>Kaydet</Button>
        </div>
      </div>
    </div>
  );
}

function NewDocTypeWizard({ onClose, onCreate }: { onClose: () => void; onCreate: (d: DocType) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [namespace, setNamespace] = useState('landx.custom');
  const [aiGenerating, setAiGenerating] = useState(false);

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  function aiGenerateFields(): DocField[] {
    return [
      { id: 'f1', name: 'id', type: 'uuid', required: true, unique: true, indexed: true, ai: false, mcp: true },
      { id: 'f2', name: 'name', type: 'string', required: true, unique: false, indexed: true, ai: false, mcp: true },
      { id: 'f3', name: 'description', type: 'text', required: false, unique: false, indexed: false, ai: true, mcp: false },
      { id: 'f4', name: 'created_at', type: 'datetime', required: true, unique: false, indexed: true, ai: false, mcp: true }
    ];
  }

  async function aiAssistCreate() {
    setAiGenerating(true);
    setTimeout(() => {
      const fields = aiGenerateFields();
      onCreate({
        id: `dt-${slug}`, name: name.charAt(0).toUpperCase() + name.slice(1), slug, namespace, displayName: displayName || name, description: description || `AI tarafından önerilen ${name} şeması`, fields, isSubmittable: false, isSingleton: false, publicRead: false, status: 'draft', createdAt: new Date().toISOString().slice(0, 10)
      });
      setAiGenerating(false);
    }, 1400);
  }

  function createEmpty() {
    onCreate({
      id: `dt-${slug}`, name: name.charAt(0).toUpperCase() + name.slice(1), slug, namespace, displayName: displayName || name, description, fields: [
        { id: 'f1', name: 'id', type: 'uuid', required: true, unique: true, indexed: true, ai: false, mcp: true }
      ], isSubmittable: false, isSingleton: false, publicRead: false, status: 'draft', createdAt: new Date().toISOString().slice(0, 10)
    });
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2">
            <Stack size={16} weight="fill" className="text-brand-500" />
            <h3 className="font-medium">Yeni DocType {step}/2</h3>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          {step === 1 && (
            <>
              <div>
                <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Şema adı (snake_case)</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="property_history" className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Görüntü adı</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Mülk Geçmişi" className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Açıklama</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-fg-3 font-semibold">Namespace</label>
                <input value={namespace} onChange={(e) => setNamespace(e.target.value)} className="mt-1 w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <Card className="bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
                <div className="inline-flex items-center gap-2 mb-1"><Sparkle size={14} weight="fill" className="text-brand-500" /><span className="font-medium text-sm">AI önerisi</span></div>
                <p className="text-sm text-fg-2">"{displayName || name}" için yaygın alanları ben hazırlayayım mı? id, name, description, created_at gibi tipik alanları otomatik eklerim. Sonra istediğiniz alanları sürükle-bırak ile düzenlersiniz.</p>
              </Card>
              <Button block onClick={aiAssistCreate} disabled={aiGenerating} iconLeft={<Sparkle size={14} weight="fill" />}>
                {aiGenerating ? 'AI alanları üretiyor...' : 'AI ile başlat (önerilen)'}
              </Button>
              <Button block variant="outline" onClick={createEmpty} disabled={aiGenerating}>
                Boş şema ile başla
              </Button>
            </>
          )}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between">
          <Button variant="ghost" onClick={() => step === 1 ? onClose() : setStep(1)}>{step === 1 ? 'İptal' : 'Geri'}</Button>
          {step === 1 && <Button onClick={() => setStep(2)} disabled={!name.trim()}>Devam</Button>}
        </div>
      </div>
    </div>
  );
}
