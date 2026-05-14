// O01 Observability & SLO Monitoring — traces, logs, metrics, SLO error budget
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import {
  Pulse, ChartLineUp, Warning, CheckCircle, Lightning, Code, MagnifyingGlass,
  Clock, GitBranch, Sparkle, ListBullets, X, Heartbeat
} from '@phosphor-icons/react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, AreaChart, Area, Legend } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface Slo {
  id: string;
  name: string;
  target: number;
  current: number;
  windowDays: 30;
  errorBudget: number;
  burnRate: number;
  status: 'healthy' | 'warning' | 'breach';
  description: string;
}

const SLOS: Slo[] = [
  { id: 'slo-1', name: 'API Latency P95', target: 99.5, current: 99.74, windowDays: 30, errorBudget: 60, burnRate: 0.4, status: 'healthy', description: 'P95 < 250ms' },
  { id: 'slo-2', name: 'Login Success Rate', target: 99.9, current: 99.96, windowDays: 30, errorBudget: 80, burnRate: 0.1, status: 'healthy', description: '5dk pencere' },
  { id: 'slo-3', name: 'AI Response Time', target: 95.0, current: 96.2, windowDays: 30, errorBudget: 45, burnRate: 1.2, status: 'warning', description: 'P95 < 3s' },
  { id: 'slo-4', name: 'TKGM API Availability', target: 99.0, current: 98.2, windowDays: 30, errorBudget: -20, burnRate: 3.4, status: 'breach', description: 'Upstream sorun' },
  { id: 'slo-5', name: 'Hash Chain Integrity', target: 100, current: 100, windowDays: 30, errorBudget: 100, burnRate: 0, status: 'healthy', description: 'D01 audit zincir bozulmaz' },
  { id: 'slo-6', name: 'MCP Tool Discovery', target: 99.9, current: 99.97, windowDays: 30, errorBudget: 95, burnRate: 0.05, status: 'healthy', description: 'P95 <100ms' },
  { id: 'slo-7', name: 'DSAR < 30 gün', target: 100, current: 98.4, windowDays: 30, errorBudget: -1, burnRate: 2.1, status: 'warning', description: 'KVKK m.11' }
];

interface Trace {
  id: string;
  name: string;
  duration: number;
  spans: number;
  service: string;
  status: 'ok' | 'error' | 'slow';
  startedAt: string;
  user?: string;
}

const TRACES: Trace[] = [
  { id: 't-001', name: 'POST /api/v1/listings', duration: 142, spans: 12, service: 'api-gateway', status: 'ok', startedAt: '14:22:18' },
  { id: 't-002', name: 'POST /api/v1/ai/value-estimate', duration: 2840, spans: 28, service: 'ai-runtime', status: 'slow', startedAt: '14:22:14', user: 'u-1842' },
  { id: 't-003', name: 'GET /api/v1/tkgm/verify', duration: 5240, spans: 6, service: 'tkgm-integration', status: 'error', startedAt: '14:22:08' },
  { id: 't-004', name: 'POST /api/v1/listings/L-0142/submit', duration: 318, spans: 18, service: 'workflow', status: 'ok', startedAt: '14:22:02', user: 'u-2014' },
  { id: 't-005', name: 'GET /api/v1/listings (filtered)', duration: 82, spans: 8, service: 'api-gateway', status: 'ok', startedAt: '14:21:58' },
  { id: 't-006', name: 'POST /api/v1/eca/dry-run', duration: 240, spans: 14, service: 'eca-engine', status: 'ok', startedAt: '14:21:54', user: 'admin' },
  { id: 't-007', name: 'mcp.tools/call landx.ai.risk_score', duration: 1840, spans: 22, service: 'mcp-server', status: 'ok', startedAt: '14:21:50' }
];

const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
type LogLevel = typeof LOG_LEVELS[number];

interface LogEntry {
  at: string;
  level: LogLevel;
  service: string;
  message: string;
  traceId?: string;
}

const LOGS: LogEntry[] = [
  { at: '14:22:18.842', level: 'info', service: 'api-gateway', message: 'POST /listings 201 142ms user=u-1842', traceId: 't-001' },
  { at: '14:22:14.220', level: 'warn', service: 'ai-runtime', message: 'Claude API latency 2840ms (threshold 2500ms)', traceId: 't-002' },
  { at: '14:22:08.001', level: 'error', service: 'tkgm-integration', message: 'Upstream timeout: TKGM /verify after 5000ms', traceId: 't-003' },
  { at: '14:22:02.640', level: 'info', service: 'workflow', message: 'Listing L-0142 transitioned draft→review', traceId: 't-004' },
  { at: '14:21:58.180', level: 'info', service: 'api-gateway', message: 'GET /listings filtered=city:Beykoz hits=12', traceId: 't-005' },
  { at: '14:21:54.420', level: 'info', service: 'eca-engine', message: 'Rule "fiyat-anomalisi" dry-run matched (offerCount=12)', traceId: 't-006' },
  { at: '14:21:50.142', level: 'info', service: 'mcp-server', message: 'Tool call landx.ai.risk_score (client=c-003)', traceId: 't-007' },
  { at: '14:21:44.018', level: 'debug', service: 'cache', message: 'Redis hit ratio 94.2% last 60s' },
  { at: '14:21:42.120', level: 'warn', service: 'audit', message: 'Hash chain check passed (12,840 events scanned)' },
  { at: '14:21:38.840', level: 'info', service: 'notifications', message: 'Email batch sent: 24 recipients' }
];

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: 'text-fg-3',
  info: 'text-sky-600',
  warn: 'text-amber-600',
  error: 'text-rose-600',
  fatal: 'text-rose-700 font-bold'
};

export default function ObservabilityPage() {
  const [tab, setTab] = useState<'slo' | 'traces' | 'logs' | 'metrics' | 'incidents'>('slo');
  const [logLevel, setLogLevel] = useState<'all' | LogLevel>('all');
  const [logSearch, setLogSearch] = useState('');

  const filteredLogs = useMemo(() => LOGS.filter((l) => {
    if (logLevel !== 'all' && l.level !== logLevel) return false;
    if (logSearch.trim() && !l.message.toLocaleLowerCase('tr-TR').includes(logSearch.toLocaleLowerCase('tr-TR'))) return false;
    return true;
  }), [logLevel, logSearch]);

  const healthy = SLOS.filter((s) => s.status === 'healthy').length;
  const warning = SLOS.filter((s) => s.status === 'warning').length;
  const breach = SLOS.filter((s) => s.status === 'breach').length;

  return (
    <div>
      <SectionHeading
        title="Observability & SLO (O01)"
        description="Logs, metrics, traces, error budget, SLO breach alerts — OpenTelemetry uyumlu"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel O01</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<Sparkle size={14} />} onClick={() => toast('ai', 'AI anomali tarama', 'Mock: 0 anomali tespit edildi son 1 saatte.')}>AI anomali</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Sağlıklı SLO" value={healthy} icon={<CheckCircle size={20} weight="fill" />} hint={`${SLOS.length} toplam`} />
        <Stat label="Uyarı" value={warning} icon={<Warning size={20} weight="fill" />} />
        <Stat label="İhlal" value={breach} icon={<X size={20} weight="fill" />} hint="Acil aksiyon" />
        <Stat label="P99 (1sa)" value="312ms" icon={<Lightning size={20} weight="fill" />} hint="Hedef <500ms" />
        <Stat label="MTTR (avg)" value="28dk" icon={<Clock size={20} weight="fill" />} delta={{ value: -12.4 }} />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'slo' as const, label: 'SLO', Icon: ChartLineUp },
          { id: 'traces' as const, label: 'Traces', Icon: GitBranch },
          { id: 'logs' as const, label: 'Logs', Icon: ListBullets },
          { id: 'metrics' as const, label: 'Metrics', Icon: Heartbeat },
          { id: 'incidents' as const, label: 'Incidents', Icon: Warning }
        ].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cls(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
            tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
          )}>
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'slo' && <SloTab />}
      {tab === 'traces' && <TracesTab />}
      {tab === 'logs' && <LogsTab logs={filteredLogs} level={logLevel} setLevel={setLogLevel} search={logSearch} setSearch={setLogSearch} />}
      {tab === 'metrics' && <MetricsTab />}
      {tab === 'incidents' && <IncidentsTab />}
    </div>
  );
}

function SloTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      {SLOS.map((slo) => <SloCard key={slo.id} slo={slo} />)}
    </div>
  );
}

function SloCard({ slo }: { slo: Slo }) {
  const budgetPct = Math.max(-100, Math.min(100, slo.errorBudget));
  const cls_status = slo.status === 'healthy' ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/10'
    : slo.status === 'warning' ? 'border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10'
      : 'border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-900/10';
  const Icon = slo.status === 'healthy' ? CheckCircle : slo.status === 'warning' ? Warning : X;
  const iconCls = slo.status === 'healthy' ? 'text-emerald-500' : slo.status === 'warning' ? 'text-amber-500' : 'text-rose-500';
  return (
    <Card className={cls('border-2', cls_status)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-medium inline-flex items-center gap-2">
            <Icon size={16} weight="fill" className={iconCls} />
            {slo.name}
          </h4>
          <code className="text-xs text-fg-3">{slo.description}</code>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tabular-nums">{slo.current.toFixed(2)}%</div>
          <div className="text-[10px] text-fg-3">Hedef {slo.target}%</div>
        </div>
      </div>

      <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-1">Error Budget ({slo.windowDays}g)</div>
      <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cls('h-full', budgetPct >= 50 ? 'bg-emerald-500' : budgetPct >= 0 ? 'bg-amber-500' : 'bg-rose-500')}
          style={{ width: `${Math.abs(budgetPct)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-fg-3 mt-1">
        <span>{budgetPct >= 0 ? `%${budgetPct} kaldı` : `%${-budgetPct} aşıldı`}</span>
        <span>Burn rate: <strong className={cls(slo.burnRate > 2 ? 'text-rose-600' : slo.burnRate > 1 ? 'text-amber-600' : 'text-emerald-600')}>{slo.burnRate.toFixed(2)}×</strong></span>
      </div>
    </Card>
  );
}

function TracesTab() {
  const [selected, setSelected] = useState<Trace | null>(TRACES[0]);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        {TRACES.map((t) => {
          const cls_status = t.status === 'ok' ? 'border-emerald-200 dark:border-emerald-800' : t.status === 'slow' ? 'border-amber-300 dark:border-amber-700' : 'border-rose-300 dark:border-rose-700';
          return (
            <button key={t.id} onClick={() => setSelected(t)} className={cls(
              'w-full text-left p-2 rounded-r-2 border-l-4 transition-colors',
              selected?.id === t.id ? 'bg-brand-50/50 dark:bg-brand-900/20 ring-1 ring-brand-300' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800',
              cls_status
            )}>
              <div className="flex items-center justify-between mb-1">
                <code className="text-xs text-brand-700 dark:text-brand-300 truncate flex-1">{t.name}</code>
                <span className={cls('text-xs font-medium tabular-nums', t.duration > 1000 ? 'text-amber-600' : 'text-fg-1')}>{t.duration}ms</span>
              </div>
              <div className="text-[11px] text-fg-3 flex items-center gap-2">
                <code>{t.service}</code>
                <span>·</span>
                <span>{t.spans} spans</span>
                <span>·</span>
                <span>{t.startedAt}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div>{selected && <TraceDetail trace={selected} />}</div>
    </div>
  );
}

function TraceDetail({ trace }: { trace: Trace }) {
  const spans = useMemo(() => Array.from({ length: trace.spans }, (_, i) => ({
    name: ['http.request', 'auth.check', 'rbac.evaluate', 'db.query', 'cache.get', 'ai.invoke', 'response.serialize', 'audit.write'][i % 8],
    service: ['api-gateway', 'auth', 'rbac', 'db', 'cache', 'ai-runtime', 'api-gateway', 'audit'][i % 8],
    start: Math.round((i / trace.spans) * trace.duration),
    duration: Math.round(trace.duration / trace.spans + Math.random() * 50)
  })), [trace]);
  return (
    <Card>
      <h3 className="font-medium mb-1">{trace.name}</h3>
      <div className="text-xs text-fg-3 mb-3">trace_id: <code>{trace.id}</code> · {trace.duration}ms · {spans.length} spans</div>
      <div className="space-y-1">
        {spans.map((s, i) => {
          const pct = (s.start / trace.duration) * 100;
          const wpct = (s.duration / trace.duration) * 100;
          return (
            <div key={i} className="text-xs">
              <div className="flex items-center gap-2 mb-0.5">
                <code className="font-mono w-32 truncate text-fg-2">{s.name}</code>
                <code className="text-fg-3 w-24 truncate">{s.service}</code>
                <span className="ml-auto text-fg-3 tabular-nums">{s.duration}ms</span>
              </div>
              <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded">
                <div className="absolute h-full bg-brand-500 rounded" style={{ left: `${pct}%`, width: `${Math.max(2, wpct)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function LogsTab({ logs, level, setLevel, search, setSearch }: { logs: LogEntry[]; level: 'all' | LogLevel; setLevel: (l: 'all' | LogLevel) => void; search: string; setSearch: (s: string) => void }) {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
        <div className="relative max-w-xs flex-1 min-w-[200px]">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Log ara..." className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-xs min-h-[32px]" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setLevel('all')} className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded', level === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-fg-3')}>Tümü</button>
          {LOG_LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded', level === l ? 'bg-brand-500 text-white' : `${LEVEL_COLOR[l]} bg-slate-100 dark:bg-slate-800`)}>
              {l}
            </button>
          ))}
        </div>
        <div className="ml-auto inline-flex items-center gap-1 text-[11px] text-fg-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {logs.length} kayıt · stream aktif
        </div>
      </div>
      <ul className="font-mono text-[11px] divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto">
        {logs.map((l, i) => (
          <li key={i} className="px-3 py-1.5 flex items-start gap-2">
            <span className="text-fg-3 tabular-nums w-24 shrink-0">{l.at}</span>
            <span className={cls('uppercase font-bold w-12 shrink-0', LEVEL_COLOR[l.level])}>{l.level}</span>
            <code className="text-fg-3 w-32 shrink-0 truncate">{l.service}</code>
            <span className="flex-1">{l.message}</span>
            {l.traceId && <code className="text-brand-700 dark:text-brand-300 shrink-0">{l.traceId}</code>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MetricsTab() {
  const series = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    m: i,
    rps: Math.round(180 + Math.sin(i / 5) * 60 + Math.random() * 30),
    p50: Math.round(40 + Math.random() * 20),
    p95: Math.round(160 + Math.random() * 80),
    p99: Math.round(280 + Math.random() * 120)
  })), []);
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Lightning size={14} /> Requests / second</h3>
        <div className="h-48">
          <ResponsiveContainer>
            <AreaChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="m" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="rps" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Pulse size={14} /> Latency P50/P95/P99 (ms)</h3>
        <div className="h-48">
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="m" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="p50" stroke="#0ea5e9" dot={false} />
              <Line type="monotone" dataKey="p95" stroke="#f59e0b" dot={false} />
              <Line type="monotone" dataKey="p99" stroke="#dc2626" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Heartbeat size={14} /> Servis sağlık matrisi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'api-gateway', uptime: 99.97, lat: 42 },
            { name: 'ai-runtime', uptime: 99.84, lat: 820 },
            { name: 'auth', uptime: 99.99, lat: 18 },
            { name: 'tkgm-integration', uptime: 98.20, lat: 2840 },
            { name: 'mcp-server', uptime: 99.96, lat: 62 },
            { name: 'audit', uptime: 100.00, lat: 12 },
            { name: 'notifications', uptime: 99.92, lat: 140 },
            { name: 'workflow', uptime: 99.95, lat: 84 }
          ].map((s) => (
            <div key={s.name} className="p-2 rounded-r-2 border border-slate-200 dark:border-slate-800">
              <code className="text-xs">{s.name}</code>
              <div className="flex items-center justify-between mt-1">
                <span className={cls('text-xs font-medium tabular-nums', s.uptime >= 99.9 ? 'text-emerald-600' : s.uptime >= 99 ? 'text-amber-600' : 'text-rose-600')}>
                  {s.uptime.toFixed(2)}%
                </span>
                <span className="text-[10px] text-fg-3 tabular-nums">{s.lat}ms</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function IncidentsTab() {
  const incidents = [
    { id: 'inc-018', sev: 'P3', title: 'TKGM API yavaşlama', startedAt: '2026-05-13 14:22', resolvedAt: '2026-05-13 14:46', mttr: '24dk', impact: '142 kullanıcı etkilendi', status: 'çözüldü' },
    { id: 'inc-017', sev: 'P2', title: 'Cache invalidation gecikme', startedAt: '2026-05-10 08:14', resolvedAt: '2026-05-10 09:02', mttr: '48dk', impact: 'Eski veri gösterildi', status: 'çözüldü' },
    { id: 'inc-016', sev: 'P3', title: 'CDN bölgesel gecikme (EU)', startedAt: '2026-05-08 02:30', resolvedAt: '2026-05-08 02:42', mttr: '12dk', impact: 'P95 latency +%18', status: 'çözüldü' },
    { id: 'inc-015', sev: 'P1', title: 'DB connection pool exhaustion', startedAt: '2026-04-22 18:20', resolvedAt: '2026-04-22 19:14', mttr: '54dk', impact: '%3 trafik 5xx aldı', status: 'çözüldü' }
  ];
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">Son 30 günün olay kayıtları — postmortem dokümanlarıyla ilişkili.</p>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {incidents.map((i) => (
          <li key={i.id} className="py-3 flex items-start gap-3">
            <span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0',
              i.sev === 'P1' ? 'bg-rose-200 text-rose-900 dark:bg-rose-900/40 dark:text-rose-300' :
                i.sev === 'P2' ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300' :
                  'bg-sky-200 text-sky-900 dark:bg-sky-900/40 dark:text-sky-300'
            )}>{i.sev}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{i.title}</div>
              <div className="text-xs text-fg-3 mt-0.5">
                {i.startedAt} → {i.resolvedAt} · MTTR <strong>{i.mttr}</strong>
              </div>
              <div className="text-xs text-fg-2 mt-0.5">Etki: {i.impact}</div>
            </div>
            <span className="text-xs text-emerald-600 shrink-0">{i.status}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
