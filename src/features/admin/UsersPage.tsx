import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types/domain';
import { formatRelTime } from '@/lib/utils/format';
import { useAuth } from '@/store/auth';

export default function UsersPage() {
  const data = useData();
  const auth = useAuth();

  function impersonate(u: User) {
    const role = u.roles.includes('admin') ? 'admin' : u.roles.includes('seller') ? 'seller' : 'buyer';
    auth.setUser(u.id, role);
    location.hash = role === 'admin' ? '#/admin' : role === 'seller' ? '#/seller' : '#/';
  }

  const columns: Column<User>[] = [
    {
      key: 'displayName', header: 'Kullanıcı', sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2">
          <img src={r.avatarUrl} className="w-8 h-8 rounded-full object-cover bg-slate-200" alt="" />
          <div className="text-sm">
            <div className="font-medium">{r.displayName}</div>
            <div className="text-xs text-fg-3">{r.email}</div>
          </div>
        </div>
      )
    },
    { key: 'roles', header: 'Roller', cell: (r) => <div className="text-xs">{r.roles.join(', ')}</div> },
    { key: 'kycLevel', header: 'KYC', hideOn: 'sm', cell: (r) => <StatusBadge status={r.kycLevel} size="sm" /> },
    { key: 'principalType', header: 'Tip', hideOn: 'sm' },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: 'lastSeenAt', header: 'Son görülme', hideOn: 'md', cell: (r) => <span className="text-xs text-fg-3">{formatRelTime(r.lastSeenAt)}</span> },
    {
      key: 'actions', header: 'Aksiyon', align: 'right',
      cell: (r) => <Button size="xs" variant="outline" onClick={() => impersonate(r)}>Impersonate</Button>
    }
  ];

  return (
    <div>
      <SectionHeading title="Kullanıcılar" description={`${data.users.length} kayıt`} />
      <DataTable data={data.users} columns={columns} rowKey={(r) => r.id} searchable searchPlaceholder="Ad, email ile ara..." aiSuggestions={[
        { label: 'KYC bekleyenleri filtrele', onRun: () => alert('AI: 7 kullanıcı KYC bekliyor (mock).') },
        { label: 'Şüpheli aktiviteleri tara', onRun: () => alert('AI: Olağandışı login örüntüsü saptanmadı (mock).') }
      ]} bulkActions={[
        { label: 'E-posta gönder', onRun: (rows) => alert(`${rows.length} kullanıcıya e-posta gönderilecek (mock).`) }
      ]} />
    </div>
  );
}
