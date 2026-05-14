import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Hash } from '@phosphor-icons/react';
import { formatDateTime } from '@/lib/utils/format';
import type { AuditEvent } from '@/types/domain';

export default function AuditPage() {
  const data = useData();
  const columns: Column<AuditEvent>[] = [
    { key: 'at', header: 'Zaman', sortable: true, cell: (r) => <span className="text-xs">{formatDateTime(r.at)}</span> },
    { key: 'principalId', header: 'Yapan', cell: (r) => {
      const u = data.users.find((x) => x.id === r.principalId);
      return <span className="text-xs">{u?.displayName || r.principalId}</span>;
    } },
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
      <DataTable data={data.audit} columns={columns} rowKey={(r) => r.id} searchable pageSize={25} />
    </div>
  );
}
