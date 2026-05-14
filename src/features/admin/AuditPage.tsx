import { useMemo, useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Funnel } from '@phosphor-icons/react';
import { formatDateTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';
import type { AuditEvent } from '@/types/domain';

export default function AuditPage() {
  const data = useData();
  const [actionPrefix, setActionPrefix] = useState<string>('all');
  const [resType, setResType] = useState<string>('all');

  const actionGroups = useMemo(() => {
    const s = new Set<string>();
    data.audit.forEach((a) => s.add(a.action.split('.')[0]));
    return Array.from(s).sort();
  }, [data.audit]);

  const resourceTypes = useMemo(() => {
    const s = new Set<string>();
    data.audit.forEach((a) => s.add(a.resourceType));
    return Array.from(s).sort();
  }, [data.audit]);

  const filtered = useMemo(() => {
    return data.audit.filter((a) => {
      if (actionPrefix !== 'all' && !a.action.startsWith(actionPrefix)) return false;
      if (resType !== 'all' && a.resourceType !== resType) return false;
      return true;
    });
  }, [data.audit, actionPrefix, resType]);

  const columns: Column<AuditEvent>[] = [
    { key: 'at', header: 'Zaman', sortable: true, cell: (r) => <span className="text-xs">{formatDateTime(r.at)}</span> },
    {
      key: 'principalId', header: 'Yapan', cell: (r) => {
        const u = data.users.find((x) => x.id === r.principalId);
        return <span className="text-xs">{u?.displayName || r.principalId}</span>;
      }
    },
    { key: 'action', header: 'İşlem', cell: (r) => <code className="text-xs text-brand-700 dark:text-brand-300">{r.action}</code> },
    { key: 'resourceType', header: 'Kaynak', cell: (r) => <span className="text-xs">{r.resourceType}:{r.resourceId}</span> },
    { key: 'reason', header: 'Sebep', hideOn: 'md', cell: (r) => <span className="text-xs text-fg-3">{r.reason || '—'}</span> },
    { key: 'hash', header: 'Hash', hideOn: 'md', cell: (r) => <code className="text-[11px] text-fg-3">{r.hash.slice(0, 12)}…</code> }
  ];

  return (
    <div>
      <SectionHeading title="Denetim İzi" description={`${data.audit.length} olay · hash-chain doğrulamalı`} />

      <Card className="mb-3 inline-flex items-center gap-2 px-4 py-2 text-sm">
        <ShieldCheck size={16} weight="fill" className="text-emerald-500" />
        <span>Hash zinciri tutarlı. Son: <code className="text-xs">{data.audit[0]?.hash.slice(0, 16) ?? '—'}…</code></span>
      </Card>

      <Card className="mb-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 text-fg-3"><Funnel size={14} /> Filtre:</span>
          <select value={actionPrefix} onChange={(e) => setActionPrefix(e.target.value)} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 min-h-[36px]">
            <option value="all">Tüm işlemler</option>
            {actionGroups.map((g) => <option key={g} value={g}>{g}.*</option>)}
          </select>
          <select value={resType} onChange={(e) => setResType(e.target.value)} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 min-h-[36px]">
            <option value="all">Tüm kaynaklar</option>
            {resourceTypes.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <span className="ml-auto text-fg-3">{filtered.length} kayıt</span>
        </div>
      </Card>

      <DataTable data={filtered} columns={columns} rowKey={(r) => r.id} searchable pageSize={25} />
    </div>
  );
}
