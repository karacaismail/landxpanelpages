import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { CheckCircle, XCircle, ShieldCheck, Robot } from '@phosphor-icons/react';
import { can, type Resource, type Action } from '@/lib/permissions/rbac';
import type { Role } from '@/types/domain';

const RESOURCES: Resource[] = ['listing', 'offer', 'message', 'viewing', 'user', 'role', 'rule', 'audit', 'tkgm', 'notification', 'settings', 'modules'];
const ROLES: Role[] = ['guest', 'buyer', 'seller', 'moderator', 'admin'];
const ACTIONS: Action[] = ['create', 'read', 'update', 'delete', 'manage'];

export default function RolesPage() {
  return (
    <div>
      <SectionHeading title="Roller & İzinler" description="RBAC + ABAC + agent capability scopes" />

      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-2"><ShieldCheck size={18} weight="fill" className="text-brand-500" /><h3 className="font-medium">İzin matrisi</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-3 py-2 font-medium text-fg-3">Kaynak / Rol</th>
                {ROLES.map((r) => <th key={r} className="px-3 py-2 font-medium text-fg-3 capitalize">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {RESOURCES.map((res) => (
                <tr key={res} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="px-3 py-2 text-fg-2">{res}</td>
                  {ROLES.map((role) => (
                    <td key={role} className="px-3 py-2 text-center">
                      {can(role, res, 'read') ? <CheckCircle size={16} weight="fill" className="text-emerald-500 inline" /> : <XCircle size={16} className="text-fg-4 inline" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-fg-3 mt-2">✓ = okuma yetkisi. Yazma ayrıntısı tıklanan satırın detayında.</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2"><Robot size={18} weight="fill" className="text-accent-500" /><h3 className="font-medium">Agent capability scopes (A03)</h3></div>
        <p className="text-sm text-fg-3 mb-3">Agent kullanıcı adına çalışırken: <strong className="text-fg-1">etkin_yetki = user_perms ∩ agent_scope ∩ session_limits</strong></p>
        <div className="grid sm:grid-cols-3 gap-2">
          {['auto-reply-agent', 'price-watcher-agent', 'lead-router-agent'].map((a) => (
            <div key={a} className="rounded-r-2 border border-slate-200 dark:border-slate-800 p-3">
              <div className="font-medium text-sm">{a}</div>
              <div className="text-xs text-fg-3 mt-1">tool: send_message, read_listing</div>
              <div className="text-xs text-fg-3">session: 30s · 500 token</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
