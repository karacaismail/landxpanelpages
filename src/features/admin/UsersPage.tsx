import { useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { User, Role, KycLevel } from '@/types/domain';
import { formatRelTime } from '@/lib/utils/format';
import { useAuth } from '@/store/auth';
import { PencilSimple, Plus } from '@phosphor-icons/react';
import { nanoid } from 'nanoid';

function emptyUser(): User {
  const id = `u-new-${nanoid(4)}`;
  return {
    id, principalType: 'individual', displayName: '', email: '', phone: '+90', fullName: '',
    avatarUrl: `https://i.pravatar.cc/240?u=${id}`, locale: 'tr', timezone: 'Europe/Istanbul',
    kycLevel: 'none', status: 'active', roles: ['buyer'],
    createdAt: new Date().toISOString(), lastSeenAt: new Date().toISOString(),
    preferences: { notifyEmail: true, notifySms: false, notifyPush: true, aiAssistantDefault: 'auto', theme: 'system', locale: 'tr' },
    rating: 0, vipScore: 0
  };
}

const ROLES: Role[] = ['buyer', 'seller', 'moderator', 'admin'];
const KYCS: KycLevel[] = ['none', 'phone', 'email', 'identity', 'full'];

export default function UsersPage() {
  const data = useData();
  const auth = useAuth();
  const [edit, setEdit] = useState<User | null>(null);

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
      cell: (r) => (
        <div className="inline-flex gap-1">
          <Button size="xs" variant="ghost" iconLeft={<PencilSimple size={12} />} onClick={() => setEdit(r)}>Düzenle</Button>
          <Button size="xs" variant="outline" onClick={() => impersonate(r)}>Impersonate</Button>
        </div>
      )
    }
  ];

  function save(u: User) {
    data.upsertUser(u);
    setEdit(null);
  }

  return (
    <div>
      <SectionHeading title="Kullanıcılar" description={`${data.users.length} kayıt`} actions={
        <Button iconLeft={<Plus size={14} />} onClick={() => setEdit(emptyUser())}>Yeni kullanıcı</Button>
      } />
      <DataTable
        data={data.users}
        columns={columns}
        rowKey={(r) => r.id}
        searchable
        searchPlaceholder="Ad, email ile ara..."
        storageKey="admin-users"
        aiSuggestions={[
          { label: 'KYC bekleyenleri filtrele', onRun: () => alert('AI: 7 kullanıcı KYC bekliyor (mock).') },
          { label: 'Şüpheli aktiviteleri tara', onRun: () => alert('AI: Olağandışı login örüntüsü saptanmadı (mock).') }
        ]}
        bulkActions={[
          { label: 'E-posta gönder', onRun: (rows) => alert(`${rows.length} kullanıcıya e-posta gönderilecek (mock).`) }
        ]}
      />

      {edit && <UserEditModal user={edit} onSave={save} onClose={() => setEdit(null)} />}
    </div>
  );
}

function UserEditModal({ user, onSave, onClose }: { user: User; onSave: (u: User) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<User>(user);
  return (
    <div role="dialog" aria-label="Kullanıcı düzenle" className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-r-4 p-4 lg:p-6 shadow-2xl">
        <h3 className="text-lg font-semibold mb-3">Kullanıcı düzenle</h3>
        <div className="space-y-2">
          <Input label="Ad Soyad" value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value, displayName: e.target.value })} block />
          <Input label="E-posta" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} block />
          <Input label="Telefon" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} block />
          <div>
            <label className="text-sm font-medium text-fg-2">Roller</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ROLES.map((r) => {
                const on = draft.roles.includes(r);
                return <button key={r} type="button" onClick={() => setDraft({ ...draft, roles: on ? draft.roles.filter((x) => x !== r) : [...draft.roles, r] })} className={`rounded-full px-3 py-1 text-xs border ${on ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700'}`}>{r}</button>;
              })}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-fg-2">KYC seviyesi</label>
            <select value={draft.kycLevel} onChange={(e) => setDraft({ ...draft, kycLevel: e.target.value as KycLevel })} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
              {KYCS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-fg-2">Durum</label>
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as User['status'] })} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
              <option value="active">active</option>
              <option value="suspended">suspended</option>
              <option value="archived">archived</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" block onClick={onClose}>İptal</Button>
          <Button block onClick={() => onSave(draft)}>Kaydet</Button>
        </div>
      </div>
    </div>
  );
}
