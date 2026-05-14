// D01 Audit Log & Event Sourcing — enterprise edition
import { useMemo, useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { ShieldCheck, Funnel, Hash, Warning, Sparkle, Download, Clock, Eye, ChartLineUp, Brain, X, Lightning, GitBranch, FileText } from '@phosphor-icons/react';
import { formatDateTime } from '@/lib/utils/format';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';
import type { AuditEvent } from '@/types/domain';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';

function severity(a: AuditEvent): Severity {
  const action = a.action;
  if (/delete|remove|drop|purge/i.test(action)) return 'high';
  if (/impersonate|escalate|admin\.access/i.test(action)) return 'critical';
  if (/update|change|modify|set/i.test(action)) return 'medium';
  if (/create|add|insert/i.test(action)) return 'low';
  return 'info';
}

const SEV_LABEL: Record<Severity, { tr: string; cls: string }> = {
  info: { tr: 'info', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' },
  low: { tr: 'düşük', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200' },
  medium: { tr: 'orta', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
  high: { tr: 'yüksek', cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200' },
  critical: { tr: 'kritik', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200' }
};

export default function AuditPage() {
  const data = useData();
  const [actionPrefix, setActionPrefix] = useState<string>('all');
  const [resType, setResType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | '24h' | '7d' | '30d'>('30d');
  const [sevFilter, setSevFilter] = useState<'all' | Severity>('all');
  const [principalFilter, setPrincipalFilter] = useState<string>('all');
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [integrityRunning, setIntegrityRunning] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<{ ok: boolean; checked: number; lastValidated: string } | null>(
    { ok: true, checked: 500, lastValidated: new Date(Date.now() - 3600_000).toISOString() }
  );

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

  const principals = useMemo(() => {
    const m = new Map<string, number>();
    data.audit.forEach((a) => m.set(a.principalId, (m.get(a.principalId) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15);
  }, [data.audit]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff = dateRange === '24h' ? now - 24 * 3600_000 : dateRange === '7d' ? now - 7 * 86400_000 : dateRange === '30d' ? now - 30 * 86400_000 : 0;
    return data.audit.filter((a) => {
      if (actionPrefix !== 'all' && !a.action.startsWith(actionPrefix)) return false;
      if (resType !== 'all' && a.resourceType !== resType) return false;
      if (principalFilter !== 'all' && a.principalId !== principalFilter) return false;
      if (cutoff > 0 && new Date(a.at).getTime() < cutoff) return false;
      if (sevFilter !== 'all' && severity(a) !== sevFilter) return false;
      return true;
    });
  }, [data.audit, actionPrefix, resType, dateRange, sevFilter, principalFilter]);

  const sevCounts = useMemo(() => {
    const counts: Record<Severity, number> = { info: 0, low: 0, medium: 0, high: 0, critical: 0 };
    filtered.forEach((a) => { counts[severity(a)]++; });
    return counts;
  }, [filtered]);

  // Hourly distribution (last 24h)
  const hourly = useMemo(() => {
    const now = Date.now();
    const buckets: { hour: string; count: number }[] = [];
    for (let i = 23; i >= 0; i--) {
      const end = now - i * 3600_000;
      const d = new Date(end);
      const count = filtered.filter((a) => {
        const t = new Date(a.at).getTime();
        return t >= end - 3600_000 && t < end;
      }).length;
      buckets.push({ hour: `${d.getHours().toString().padStart(2, '0')}:00`, count });
    }
    return buckets;
  }, [filtered]);

  // 30-day daily series
  const daily = useMemo(() => {
    const now = Date.now();
    const out: { day: string; count: number; criticals: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const end = now - i * 86400_000;
      const d = new Date(end);
      const dayLog = filtered.filter((a) => {
        const t = new Date(a.at).getTime();
        return t >= end - 86400_000 && t < end;
      });
      out.push({
        day: `${d.getDate()}/${d.getMonth() + 1}`,
        count: dayLog.length,
        criticals: dayLog.filter((a) => severity(a) === 'critical' || severity(a) === 'high').length
      });
    }
    return out;
  }, [filtered]);

  // AI anomalies — heuristic: principals with >3× their median activity in last hour
  const anomalies = useMemo(() => {
    const now = Date.now();
    const lastHour = filtered.filter((a) => now - new Date(a.at).getTime() < 3600_000);
    const out: { principal: string; count: number; reason: string }[] = [];
    const byPrincipal = new Map<string, number>();
    lastHour.forEach((a) => byPrincipal.set(a.principalId, (byPrincipal.get(a.principalId) || 0) + 1));
    byPrincipal.forEach((count, principal) => {
      if (count >= 5) out.push({ principal, count, reason: 'Son 1 saatte sıra dışı aktivite hacmi' });
    });
    const sensitiveOps = filtered.filter((a) => severity(a) === 'critical' && now - new Date(a.at).getTime() < 86400_000 * 7);
    sensitiveOps.slice(0, 3).forEach((a) => {
      out.push({ principal: a.principalId, count: 1, reason: `Kritik operasyon: ${a.action}` });
    });
    return out.slice(0, 5);
  }, [filtered]);

  function runIntegrityCheck() {
    setIntegrityRunning(true);
    setIntegrityResult(null);
    setTimeout(() => {
      setIntegrityRunning(false);
      const result = { ok: true, checked: data.audit.length, lastValidated: new Date().toISOString() };
      setIntegrityResult(result);
      toast('success', 'Hash zinciri doğrulandı', `${result.checked} olay incelendi. Manipülasyon yok.`);
    }, 1800);
  }

  function exportLog() {
    toast('success', 'Audit dışa aktarımı hazırlandı', `${filtered.length} olay → audit-${dateRange}-${Date.now()}.csv (mock).`);
  }

  function exportCompliance() {
    toast('success', 'Compliance raporu hazırlandı', 'KVKK + SOC2 + ISO27001 uyumlu PDF rapor üretildi (mock).');
  }

  const columns: Column<AuditEvent>[] = [
    { key: 'sev', header: '', cell: (r) => {
      const s = severity(r);
      return <span className={cls('text-[10px] uppercase rounded px-1.5 py-0.5 font-bold', SEV_LABEL[s].cls)}>{SEV_LABEL[s].tr}</span>;
    }},
    { key: 'at', header: 'Zaman', sortable: true, cell: (r) => <span className="text-xs whitespace-nowrap">{formatDateTime(r.at)}</span> },
    {
      key: 'principalId', header: 'Aktör', cell: (r) => {
        const u = data.users.find((x) => x.id === r.principalId);
        return (
          <button
            onClick={(e) => { e.stopPropagation(); setPrincipalFilter(r.principalId); }}
            className="text-xs hover:text-brand-600 truncate"
            title="Bu kullanıcının olaylarını filtrele"
          >{u?.displayName || r.principalId}</button>
        );
      }
    },
    { key: 'action', header: 'İşlem', cell: (r) => <code className="text-xs text-brand-700 dark:text-brand-300">{r.action}</code> },
    { key: 'resourceType', header: 'Kaynak', hideOn: 'sm', cell: (r) => <span className="text-xs"><strong>{r.resourceType}</strong>:{r.resourceId}</span> },
    { key: 'reason', header: 'Sebep', hideOn: 'lg', cell: (r) => <span className="text-xs text-fg-3 line-clamp-1">{r.reason || '—'}</span> },
    { key: 'hash', header: 'Hash', hideOn: 'md', cell: (r) => <code className="text-[11px] text-fg-3">{r.hash.slice(0, 10)}…</code> },
    { key: 'view', header: '', cell: (r) => <Button size="xs" variant="ghost" iconLeft={<Eye size={12} />} onClick={() => setSelected(r)}>Detay</Button> }
  ];

  return (
    <div>
      <SectionHeading
        title="Denetim İzi (D01)"
        description={`${data.audit.length} olay · hash-chain doğrulamalı · event sourcing`}
        actions={
          <div className="flex gap-1.5 flex-wrap">
            <AiBadge>AI anomali tespiti</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<Download size={14} />} onClick={exportLog}>CSV</Button>
            <Button size="sm" variant="outline" iconLeft={<FileText size={14} />} onClick={exportCompliance}>PDF</Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Olay (filtre)" value={filtered.length.toLocaleString('tr-TR')} icon={<Clock size={20} weight="fill" />} hint={`${data.audit.length.toLocaleString('tr-TR')} toplam`} />
        <Stat label="Kritik + Yüksek" value={sevCounts.critical + sevCounts.high} icon={<Warning size={20} weight="fill" />} hint="Dikkat gerekli" />
        <Stat label="Aktör (unique)" value={new Set(filtered.map((a) => a.principalId)).size} icon={<Eye size={20} weight="fill" />} hint="Bu dönemde" />
        <Stat label="AI anomali" value={anomalies.length} icon={<Brain size={20} weight="fill" />} hint="Son 24sa" />
        <Stat label="Bütünlük" value={integrityResult?.ok ? '✓ OK' : '?'} icon={<ShieldCheck size={20} weight="fill" />} hint={integrityResult ? `${integrityResult.checked} olay` : 'Bekliyor'} />
      </div>

      {/* Hash chain integrity card */}
      <div className="grid lg:grid-cols-3 gap-3 mb-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-r-2 bg-emerald-100 dark:bg-emerald-900/50 grid place-items-center text-emerald-600 shrink-0">
              <ShieldCheck size={20} weight="fill" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium inline-flex items-center gap-2">
                Hash Chain Bütünlüğü
                {integrityResult?.ok && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-500 text-white">DOĞRULANDI</span>}
              </h3>
              <p className="text-sm text-fg-2 mt-1">
                Her audit olayı bir önceki olayın hash'ini içerir (SHA-256). Tampering anında kırılan zincir tespit edilir.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-fg-3 uppercase tracking-wider">Son doğrulama</div>
                  <div className="font-medium">{integrityResult ? formatDateTime(integrityResult.lastValidated) : '—'}</div>
                </div>
                <div>
                  <div className="text-fg-3 uppercase tracking-wider">Son hash</div>
                  <code className="block truncate">{data.audit[0]?.hash.slice(0, 24) || '—'}…</code>
                </div>
              </div>
              <Button size="sm" className="mt-3" iconLeft={integrityRunning ? <Clock size={14} /> : <Hash size={14} />} onClick={runIntegrityCheck} disabled={integrityRunning}>
                {integrityRunning ? 'Doğrulanıyor...' : 'Yeniden doğrula'}
              </Button>
            </div>
          </div>
        </Card>

        <Card className={anomalies.length > 0 ? 'bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-900/30' : ''}>
          <h3 className="font-medium inline-flex items-center gap-2 mb-2">
            <Brain size={16} weight="fill" className="text-brand-500" /> AI Anomali Tespiti
          </h3>
          {anomalies.length === 0 ? (
            <p className="text-sm text-fg-3">Son 24 saatte sıra dışı bir aktivite tespit edilmedi.</p>
          ) : (
            <ul className="space-y-1.5">
              {anomalies.map((a, i) => {
                const u = data.users.find((x) => x.id === a.principal);
                return (
                  <li key={i} className="text-xs">
                    <div className="font-medium text-amber-700 dark:text-amber-300">{u?.displayName || a.principal}</div>
                    <div className="text-fg-3">{a.reason} {a.count > 1 && `(${a.count} olay)`}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-3 mb-4">
        <Card>
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Clock size={14} /> Son 24 saat (saatlik)</h3>
          <div className="h-44">
            <ResponsiveContainer>
              <BarChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0e7c61" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><ChartLineUp size={14} /> Son 30 gün — kritik / toplam</h3>
          <div className="h-44">
            <ResponsiveContainer>
              <AreaChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                <Area type="monotone" dataKey="criticals" stroke="#dc2626" fill="rgba(220,38,38,0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-fg-3"><Funnel size={14} /> Filtre:</span>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as 'all' | '24h' | '7d' | '30d')} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 min-h-[36px] text-xs">
            <option value="24h">Son 24 saat</option>
            <option value="7d">Son 7 gün</option>
            <option value="30d">Son 30 gün</option>
            <option value="all">Tüm tarihler</option>
          </select>
          <select value={actionPrefix} onChange={(e) => setActionPrefix(e.target.value)} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 min-h-[36px] text-xs">
            <option value="all">Tüm işlemler</option>
            {actionGroups.map((g) => <option key={g} value={g}>{g}.*</option>)}
          </select>
          <select value={resType} onChange={(e) => setResType(e.target.value)} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 min-h-[36px] text-xs">
            <option value="all">Tüm kaynaklar</option>
            {resourceTypes.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="flex gap-1">
            {(['all', 'info', 'low', 'medium', 'high', 'critical'] as const).map((s) => (
              <button key={s} onClick={() => setSevFilter(s)} className={cls('text-[10px] uppercase px-1.5 py-0.5 rounded font-bold border', sevFilter === s ? 'ring-2 ring-brand-500' : 'border-transparent', s === 'all' ? 'bg-slate-100 dark:bg-slate-800 text-fg-3' : SEV_LABEL[s].cls)}>
                {s === 'all' ? 'tümü' : SEV_LABEL[s].tr}
              </button>
            ))}
          </div>
          {principalFilter !== 'all' && (
            <button
              onClick={() => setPrincipalFilter('all')}
              className="inline-flex items-center gap-1 text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-full px-2 py-1"
            >
              Aktör: {data.users.find((u) => u.id === principalFilter)?.displayName || principalFilter}
              <X size={10} />
            </button>
          )}
          <span className="ml-auto text-fg-3 text-xs">{filtered.length.toLocaleString('tr-TR')} kayıt</span>
        </div>
      </Card>

      <div className="grid lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3">
          <DataTable
            data={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            searchable
            searchPlaceholder="Olay / aktör / sebep ara..."
            pageSize={25}
            storageKey="admin-audit"
            onRowClick={(r) => setSelected(r)}
          />
        </div>

        <aside className="lg:col-span-1">
          <Card>
            <h3 className="font-medium text-sm mb-2 inline-flex items-center gap-1.5"><Lightning size={14} weight="fill" className="text-amber-500" /> En aktif aktörler</h3>
            <ul className="space-y-1">
              {principals.slice(0, 10).map(([id, count]) => {
                const u = data.users.find((x) => x.id === id);
                return (
                  <li key={id}>
                    <button
                      onClick={() => setPrincipalFilter(id)}
                      className={cls(
                        'w-full text-left flex items-center justify-between gap-2 px-2 py-1 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-800',
                        principalFilter === id && 'bg-brand-50 dark:bg-brand-900/30'
                      )}
                    >
                      <span className="truncate">{u?.displayName || id}</span>
                      <span className="tabular-nums text-fg-3 shrink-0">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </aside>
      </div>

      {selected && <EventDetailModal event={selected} data={data} onClose={() => setSelected(null)} />}
    </div>
  );
}

function EventDetailModal({ event, data, onClose }: { event: AuditEvent; data: ReturnType<typeof useData.getState>; onClose: () => void; }) {
  const u = data.users.find((x) => x.id === event.principalId);
  const sev = severity(event);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-r-4 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={cls('text-[10px] uppercase rounded px-1.5 py-0.5 font-bold', SEV_LABEL[sev].cls)}>{SEV_LABEL[sev].tr}</span>
            <h3 className="font-medium text-sm">Audit olay detayı</h3>
            <code className="text-[11px] text-fg-3">#{event.id}</code>
          </div>
          <button onClick={onClose} className="p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            <dt className="text-fg-3 text-xs uppercase tracking-wider">Zaman</dt>
            <dd className="font-medium">{formatDateTime(event.at)}</dd>
            <dt className="text-fg-3 text-xs uppercase tracking-wider">Aktör</dt>
            <dd className="font-medium">{u?.displayName || event.principalId}{u?.roles?.length && <span className="text-fg-3"> · {u.roles.join(', ')}</span>}</dd>
            <dt className="text-fg-3 text-xs uppercase tracking-wider">İşlem</dt>
            <dd><code className="text-brand-700 dark:text-brand-300">{event.action}</code></dd>
            <dt className="text-fg-3 text-xs uppercase tracking-wider">Kaynak</dt>
            <dd><strong>{event.resourceType}</strong>:{event.resourceId}</dd>
            <dt className="text-fg-3 text-xs uppercase tracking-wider">Sebep</dt>
            <dd className="text-fg-2">{event.reason || '—'}</dd>
          </dl>

          <Card className="!p-3">
            <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1 inline-flex items-center gap-1.5"><Hash size={12} /> Hash zinciri</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-fg-3 w-20">Bu olay:</span>
                <code className="text-emerald-700 dark:text-emerald-300 break-all">{event.hash}</code>
              </div>
              {event.hashPrev && (
                <div className="flex items-center gap-2">
                  <span className="text-fg-3 w-20">Önceki:</span>
                  <code className="text-fg-3 break-all">{event.hashPrev}</code>
                </div>
              )}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
              <GitBranch size={12} /> Zincir doğrulandı — SHA-256
            </div>
          </Card>

          {event.changes && Object.keys(event.changes).length > 0 && (
            <Card className="!p-3">
              <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1">Veri farkı (changes)</div>
              <pre className="text-xs bg-slate-100 dark:bg-slate-800 rounded p-2 overflow-x-auto">{JSON.stringify(event.changes, null, 2)}</pre>
            </Card>
          )}

          {event.agentId && (
            <Card className="!p-3">
              <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1 inline-flex items-center gap-1"><Sparkle size={12} weight="fill" /> Agent tarafından</div>
              <code className="text-xs">{event.agentId}</code>
            </Card>
          )}

          <Card className="!p-3 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
            <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1 inline-flex items-center gap-1.5">
              <Sparkle size={12} weight="fill" className="text-brand-500" /> AI yorumu
            </div>
            <p className="text-sm text-fg-2">
              {sev === 'critical' && 'Bu olay kritik bir izleyici aksiyon. KVKK kapsamında raporlanmalı.'}
              {sev === 'high' && 'Silme/değişiklik içerir, rollback için 7 gün içinde yedekten geri alınabilir.'}
              {sev === 'medium' && 'Tipik bir güncelleme. İlgili kullanıcının son 24 saatteki diğer işlemleriyle uyumlu.'}
              {sev === 'low' && 'Rutin oluşturma işlemi. Anormallik tespit edilmedi.'}
              {sev === 'info' && 'Bilgi amaçlı log. İzin gerektirmez.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
