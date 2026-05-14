import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { Stat } from '@/components/ui/Stat';
import { MODULES_CATALOG } from '@/data/fixtures/modules-catalog';
import { MODULE_DETAILS } from '@/data/fixtures/modules-detail';
import type { ModuleCatalogEntry } from '@/types/domain';
import { cls } from '@/lib/utils/cls';
import { Link } from 'react-router-dom';
import { Stack, Sparkle, MagnifyingGlass, ShieldCheck } from '@phosphor-icons/react';

const LAYER_LABELS: Record<string, string> = {
  L0: 'L0 · Kernel', L1: 'L1 · Identity', L2: 'L2 · AI Runtime', L3: 'L3 · Application', L4: 'L4 · Data & Compliance', L5: 'L5 · Operations'
};

export default function ModulesPage() {
  const [layer, setLayer] = useState<string>('all');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    let list = layer === 'all' ? MODULES_CATALOG : MODULES_CATALOG.filter((m) => m.layer === layer);
    if (q.trim()) {
      const nq = q.toLocaleLowerCase('tr-TR');
      list = list.filter((m) => (m.id + ' ' + m.name + ' ' + m.description).toLocaleLowerCase('tr-TR').includes(nq));
    }
    return list;
  }, [layer, q]);

  const totals = useMemo(() => {
    const fields = Object.values(MODULE_DETAILS).reduce((s, m) => s + m.fields.length, 0);
    const caps = Object.values(MODULE_DETAILS).reduce((s, m) => s + m.capabilities.length, 0);
    const ai = MODULES_CATALOG.filter((m) => m.ai).length;
    const mcp = MODULES_CATALOG.filter((m) => m.mcp).length;
    return { fields, caps, ai, mcp };
  }, []);

  return (
    <div>
      <SectionHeading title="Modül Kataloğu" description={`Excel master kaynaklı — ${MODULES_CATALOG.length} modül, 6 katman`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat label="Modül" value={MODULES_CATALOG.length} icon={<Stack size={20} weight="fill" />} />
        <Stat label="Yetenek" value={totals.caps} icon={<Sparkle size={20} weight="fill" />} />
        <Stat label="Toplam Alan" value={totals.fields.toLocaleString('tr-TR')} icon={<ShieldCheck size={20} weight="fill" />} />
        <Stat label="AI / MCP" value={`${totals.ai} / ${totals.mcp}`} icon={<Sparkle size={20} weight="fill" />} />
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-stretch mb-4">
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Modül ara (id, ad, açıklama)"
            className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm min-h-[40px]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip on={layer === 'all'} onClick={() => setLayer('all')}>Tümü ({MODULES_CATALOG.length})</Chip>
          {Object.entries(LAYER_LABELS).map(([k, v]) => {
            const count = MODULES_CATALOG.filter((m) => m.layer === k).length;
            return <Chip key={k} on={layer === k} onClick={() => setLayer(k)}>{v} ({count})</Chip>;
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => <ModuleCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cls('rounded-full px-3 py-1 text-xs border', on ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2')}>{children}</button>
  );
}

function ModuleCard({ m }: { m: ModuleCatalogEntry }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <code className="text-xs text-fg-3 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{m.id} · {m.layer}</code>
        <div className="flex gap-1">
          {m.ai && <AiBadge>AI</AiBadge>}
          {m.mcp && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent-50 dark:bg-accent-900/40 text-accent-700 dark:text-accent-200">MCP</span>}
        </div>
      </div>
      <Link to={`/admin/modules/${m.id}`} className="hover:underline">
        <h3 className="font-medium leading-snug">{m.name}</h3>
      </Link>
      <p className="text-sm text-fg-3 mt-1 flex-1">{m.description}</p>
      {(() => {
        const d = MODULE_DETAILS[m.id];
        if (!d) return null;
        return <div className="text-[11px] text-fg-3 mt-2 flex gap-3">
          <span><strong>{d.capabilities.length}</strong> yetenek</span>
          <span><strong>{d.fields.length}</strong> alan</span>
        </div>;
      })()}
      <div className="text-[11px] text-fg-3 mt-1"><strong>KPI:</strong> {m.kpis}</div>
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-fg-3">{m.faz} · {m.priority} · {m.squad}</div>
        <div className="flex gap-1">
          <Link to={`/admin/modules/${m.id}`}><Button size="xs" variant="outline">Detay</Button></Link>
          {m.uiRoute && <Link to={m.uiRoute}><Button size="xs" variant="ghost">UI ›</Button></Link>}
        </div>
      </div>
    </Card>
  );
}
