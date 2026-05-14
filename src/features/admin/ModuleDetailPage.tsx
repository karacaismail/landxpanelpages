import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkle, MagnifyingGlass, ArrowSquareOut } from '@phosphor-icons/react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { AiBadge } from '@/components/ui/AiBadge';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { EmptyState } from '@/components/ui/EmptyState';
import { MODULES_CATALOG } from '@/data/fixtures/modules-catalog';
import { MODULE_DETAILS, type ModuleField } from '@/data/fixtures/modules-detail';
import { cls } from '@/lib/utils/cls';

const TYPE_COLOR: Record<string, string> = {
  uuid: 'text-violet-700 dark:text-violet-300',
  string: 'text-emerald-700 dark:text-emerald-300',
  int: 'text-sky-700 dark:text-sky-300',
  decimal: 'text-sky-700 dark:text-sky-300',
  boolean: 'text-amber-700 dark:text-amber-300',
  datetime: 'text-rose-700 dark:text-rose-300',
  enum: 'text-fuchsia-700 dark:text-fuchsia-300',
  jsonb: 'text-cyan-700 dark:text-cyan-300',
  json_schema: 'text-cyan-700 dark:text-cyan-300',
  vector: 'text-indigo-700 dark:text-indigo-300',
  semver: 'text-zinc-700 dark:text-zinc-300'
};

function typeColor(t: string): string {
  const base = t.split('(')[0].toLowerCase();
  return TYPE_COLOR[base] || 'text-fg-2';
}

export default function ModuleDetailPage() {
  const { id } = useParams();
  const catalog = MODULES_CATALOG.find((m) => m.id === id);
  const detail = id ? MODULE_DETAILS[id] : undefined;
  const [q, setQ] = useState('');
  const [capFilter, setCapFilter] = useState<string>('all');

  const fields = useMemo(() => {
    if (!detail) return [];
    return detail.fields.filter((f) => {
      if (capFilter !== 'all' && f.cap !== capFilter) return false;
      if (!q.trim()) return true;
      const nq = q.toLocaleLowerCase('tr-TR');
      return [f.name, f.op, f.desc, f.type, f.cap].some((s) => (s || '').toLocaleLowerCase('tr-TR').includes(nq));
    });
  }, [detail, q, capFilter]);

  if (!catalog) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState title="Modül bulunamadı" description={`'${id}' kodlu modül kataloglu değil.`} cta={<Link to="/admin/modules"><Button>Modül kataloğuna dön</Button></Link>} />
      </div>
    );
  }

  const requiredCount = detail?.fields.filter((f) => f.required).length || 0;
  const aiCount = detail?.fields.filter((f) => f.ai).length || 0;
  const mcpCount = detail?.fields.filter((f) => f.mcp).length || 0;

  return (
    <div>
      <Link to="/admin/modules" className="inline-flex items-center gap-1 text-sm text-fg-3 hover:text-fg-1 mb-2">
        <ArrowLeft size={14} /> Modül kataloğu
      </Link>
      <SectionHeading
        title={`${catalog.id} · ${catalog.name}`}
        description={catalog.description}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {catalog.ai && <AiBadge>AI</AiBadge>}
            {catalog.mcp && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent-50 dark:bg-accent-900/40 text-accent-700 dark:text-accent-200">MCP</span>}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-fg-2">{catalog.layer}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-fg-2">{catalog.faz}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200">{catalog.priority}</span>
          </div>
        }
      />

      <Card className="mb-4 bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30">
        <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1">KPI Hedefler</div>
        <p className="text-sm text-fg-1">{catalog.kpis}</p>
        <div className="text-xs text-fg-3 mt-2">Sahip squad: <strong className="text-fg-2">{catalog.squad}</strong></div>
        {catalog.uiRoute && (
          <Link to={catalog.uiRoute} className="text-xs text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1 mt-1">UI'a git <ArrowSquareOut size={12} /></Link>
        )}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat label="Yetenek" value={detail?.capabilities.length || 0} icon={<Sparkle size={20} weight="fill" />} />
        <Stat label="Alan" value={detail?.fields.length || 0} icon={<ShieldCheck size={20} weight="fill" />} />
        <Stat label="Zorunlu" value={requiredCount} />
        <Stat label="AI / MCP" value={`${aiCount} / ${mcpCount}`} />
      </div>

      {detail && detail.capabilities.length > 0 && (
        <Card className="mb-4">
          <h3 className="font-medium mb-2">Yetenekler ({detail.capabilities.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setCapFilter('all')} className={cls('rounded-full px-3 py-1 text-xs border', capFilter === 'all' ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 text-fg-2 hover:bg-slate-50 dark:hover:bg-slate-800')}>Tümü ({detail.fields.length})</button>
            {detail.capabilities.map((c) => {
              const count = detail.fields.filter((f) => f.cap === c).length;
              return (
                <button key={c} onClick={() => setCapFilter(c)} className={cls('rounded-full px-3 py-1 text-xs border', capFilter === c ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 text-fg-2 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                  {c} <span className="text-fg-3 ml-1">({count})</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {detail && detail.fields.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="font-medium">Alanlar ({fields.length} / {detail.fields.length})</h3>
            <div className="relative max-w-xs">
              <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Alan / tür / açıklama ara"
                className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-sm min-h-[36px]"
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                  <th className="text-left px-3 py-2 font-medium">Alan</th>
                  <th className="text-left px-3 py-2 font-medium">Tür</th>
                  <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Yetenek</th>
                  <th className="text-left px-3 py-2 font-medium hidden lg:table-cell">İşlem</th>
                  <th className="text-center px-3 py-2 font-medium">!</th>
                  <th className="text-center px-3 py-2 font-medium">AI</th>
                  <th className="text-center px-3 py-2 font-medium hidden sm:table-cell">MCP</th>
                  <th className="text-left px-3 py-2 font-medium hidden xl:table-cell">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => <FieldRow key={i} f={f} />)}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center mt-6">
        {(() => {
          const idx = MODULES_CATALOG.findIndex((m) => m.id === catalog.id);
          const prev = MODULES_CATALOG[idx - 1];
          const next = MODULES_CATALOG[idx + 1];
          return (
            <>
              {prev ? <Link to={`/admin/modules/${prev.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 dark:text-brand-300 hover:underline"><ArrowLeft size={14} /> {prev.id} {prev.name}</Link> : <span />}
              {next ? <Link to={`/admin/modules/${next.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 dark:text-brand-300 hover:underline">{next.id} {next.name} <ArrowRight size={14} /></Link> : <span />}
            </>
          );
        })()}
      </div>
    </div>
  );
}

function FieldRow({ f }: { f: ModuleField }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0 align-top">
      <td className="px-3 py-2"><code className="text-xs font-medium">{f.name}</code></td>
      <td className={cls('px-3 py-2 text-xs font-mono', typeColor(f.type))}>{f.type || '—'}</td>
      <td className="px-3 py-2 text-xs hidden md:table-cell">{f.cap || '—'}</td>
      <td className="px-3 py-2 text-xs hidden lg:table-cell text-fg-3">{f.op || '—'}</td>
      <td className="px-3 py-2 text-center">{f.required && <span className="text-rose-600 font-bold" title="Zorunlu">!</span>}</td>
      <td className="px-3 py-2 text-center">{f.ai && <Sparkle size={12} weight="fill" className="text-brand-500 inline" />}</td>
      <td className="px-3 py-2 text-center hidden sm:table-cell">{f.mcp && <span className="inline-block w-2 h-2 rounded-full bg-accent-500" />}</td>
      <td className="px-3 py-2 text-xs text-fg-3 hidden xl:table-cell max-w-md">{f.desc || '—'}</td>
    </tr>
  );
}
