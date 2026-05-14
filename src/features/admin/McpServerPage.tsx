// A01 MCP Server Framework — Model Context Protocol native server
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Robot, Plugs, Lightning, ShieldCheck, Code, Globe, Eye, Copy, Sparkle, X, Pulse,
  Toolbox, ChatCircleText, ArrowsClockwise, Warning, CheckCircle, Clock
} from '@phosphor-icons/react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface McpClient {
  id: string;
  name: string;
  version: string;
  type: 'claude-desktop' | 'cursor' | 'cline' | 'custom-agent' | 'web-app' | 'cli';
  connected: boolean;
  lastSeen: string;
  toolsUsed: number;
  capabilities: string[];
  authMethod: 'api-key' | 'oauth' | 'agent-token' | 'mtls';
}

const CLIENTS: McpClient[] = [
  { id: 'c-001', name: 'Claude Desktop (admin)', version: '1.4.2', type: 'claude-desktop', connected: true, lastSeen: '5sn önce', toolsUsed: 142, capabilities: ['tools', 'resources', 'prompts'], authMethod: 'oauth' },
  { id: 'c-002', name: 'Cursor IDE (geliştirici)', version: '0.38.1', type: 'cursor', connected: true, lastSeen: '12sn önce', toolsUsed: 218, capabilities: ['tools', 'resources'], authMethod: 'api-key' },
  { id: 'c-003', name: 'LandX Buyer Agent', version: '2.1.0', type: 'custom-agent', connected: true, lastSeen: 'şimdi', toolsUsed: 8420, capabilities: ['tools', 'sampling', 'roots'], authMethod: 'agent-token' },
  { id: 'c-004', name: 'LandX Seller Assist', version: '2.1.0', type: 'custom-agent', connected: true, lastSeen: '1dk önce', toolsUsed: 3240, capabilities: ['tools', 'sampling'], authMethod: 'agent-token' },
  { id: 'c-005', name: 'Cline (VSCode)', version: '2.1.4', type: 'cline', connected: false, lastSeen: '2sa önce', toolsUsed: 64, capabilities: ['tools'], authMethod: 'api-key' },
  { id: 'c-006', name: 'LandX Web (admin paneli)', version: '0.1.0', type: 'web-app', connected: true, lastSeen: '8sn önce', toolsUsed: 1240, capabilities: ['tools', 'resources', 'prompts'], authMethod: 'oauth' },
  { id: 'c-007', name: 'CLI mcp-client', version: '0.9.2', type: 'cli', connected: false, lastSeen: '1g önce', toolsUsed: 32, capabilities: ['tools'], authMethod: 'mtls' }
];

const RESOURCES = [
  { uri: 'landx://listings', mime: 'application/json', desc: 'Tüm aktif ilanlar (filtrelenebilir)' },
  { uri: 'landx://users/{id}', mime: 'application/json', desc: 'Kullanıcı profili' },
  { uri: 'landx://docs/kvkk', mime: 'text/markdown', desc: 'KVKK politika metni' },
  { uri: 'landx://schema/listing', mime: 'application/json+schema', desc: 'Listing DocType şeması' },
  { uri: 'landx://reports/monthly-board', mime: 'application/pdf', desc: 'Aylık board raporu' },
  { uri: 'landx://images/{listing}/{idx}', mime: 'image/jpeg', desc: 'İlan görselleri' }
];

const PROMPTS = [
  { name: 'list_search', args: ['query', 'filters'], desc: 'NL ile ilan arama promptu' },
  { name: 'valuation_explain', args: ['listingId'], desc: 'Değerleme bandı açıklama promptu' },
  { name: 'message_draft', args: ['threadId', 'tone'], desc: 'Mesaj taslağı promptu' },
  { name: 'offer_negotiate', args: ['offerId'], desc: 'Pazarlık önerisi promptu' },
  { name: 'risk_summary', args: ['listingId'], desc: 'Risk analizi promptu' }
];

const CLIENT_ICON: Record<McpClient['type'], string> = {
  'claude-desktop': '🤖', 'cursor': '⌨️', 'cline': '🔌', 'custom-agent': '🎯', 'web-app': '🌐', 'cli': '⚡'
};

export default function McpServerPage() {
  const [tab, setTab] = useState<'overview' | 'clients' | 'tools' | 'resources' | 'prompts' | 'protocol' | 'logs'>('overview');
  const [selected, setSelected] = useState<McpClient | null>(CLIENTS[0]);

  // Activity series
  const series = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      m: i,
      calls: Math.round(140 + Math.sin(i / 5) * 60 + Math.random() * 30),
      errors: Math.round(Math.random() * 3)
    }));
  }, []);

  const connectedCount = CLIENTS.filter((c) => c.connected).length;
  const totalToolUse = CLIENTS.reduce((s, c) => s + c.toolsUsed, 0);

  return (
    <div>
      <SectionHeading
        title="MCP Server (A01)"
        description="Model Context Protocol native — tools, resources, prompts, sampling"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel A01</AiBadge>
            <Button size="sm" variant="outline" iconLeft={<Copy size={14} />} onClick={() => { navigator.clipboard?.writeText('wss://mcp.landx.test/v1'); toast('success', 'Kopyalandı', 'MCP endpoint URL'); }}>
              MCP URL kopyala
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Bağlı client" value={connectedCount} icon={<Plugs size={20} weight="fill" />} hint={`${CLIENTS.length} kayıtlı`} />
        <Stat label="Tool çağrısı (1sa)" value={totalToolUse.toLocaleString('tr-TR')} icon={<Lightning size={20} weight="fill" />} delta={{ value: 12.4 }} />
        <Stat label="Avg discovery" value="62ms" icon={<Pulse size={20} weight="fill" />} hint="P95 <100ms" />
        <Stat label="Uptime (30g)" value="99.97%" icon={<ShieldCheck size={20} weight="fill" />} hint="SLO 99.95%" />
        <Stat label="Protocol ver." value="2024-11-05" icon={<Code size={20} weight="fill" />} hint="Latest MCP spec" />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Genel', Icon: Pulse },
          { id: 'clients' as const, label: 'Client\'lar', Icon: Plugs },
          { id: 'tools' as const, label: 'Tools', Icon: Toolbox },
          { id: 'resources' as const, label: 'Resources', Icon: Globe },
          { id: 'prompts' as const, label: 'Prompts', Icon: ChatCircleText },
          { id: 'protocol' as const, label: 'Protocol', Icon: Code },
          { id: 'logs' as const, label: 'Canlı log', Icon: Lightning }
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cls(
              'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
              tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
            )}
          >
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Lightning size={14} className="text-amber-500" /> Son 60 dk — tool çağrı oranı</h3>
            <div className="h-48">
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="m" tick={{ fontSize: 10 }} label={{ value: 'dk', fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="calls" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Warning size={14} className="text-rose-500" /> Hata oranı</h3>
            <div className="h-48">
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="errors" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Plugs size={14} /> Bağlı client'lar — anlık</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {CLIENTS.filter((c) => c.connected).map((c) => (
                <button key={c.id} onClick={() => { setSelected(c); setTab('clients'); }} className="text-left p-2 rounded-r-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden>{CLIENT_ICON[c.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-[11px] text-fg-3">{c.lastSeen}</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'clients' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-2">
            {CLIENTS.map((c) => (
              <button key={c.id} onClick={() => setSelected(c)} className={cls(
                'w-full text-left p-2.5 rounded-r-2 border transition-colors',
                selected?.id === c.id ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}>
                <div className="flex items-start gap-2">
                  <span className="text-xl shrink-0" aria-hidden>{CLIENT_ICON[c.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      {c.connected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <code className="text-[11px] text-fg-3">v{c.version}</code>
                    <div className="text-[11px] text-fg-3 mt-0.5">{c.lastSeen} · {c.toolsUsed.toLocaleString('tr-TR')} çağrı</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            {selected && <ClientDetail client={selected} />}
          </div>
        </div>
      )}

      {tab === 'tools' && <ToolsCatalog />}
      {tab === 'resources' && <ResourcesCatalog />}
      {tab === 'prompts' && <PromptsCatalog />}
      {tab === 'protocol' && <ProtocolView />}
      {tab === 'logs' && <LiveLogs />}
    </div>
  );
}

function ClientDetail({ client }: { client: McpClient }) {
  return (
    <Card>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{CLIENT_ICON[client.type]}</span>
        <div className="flex-1">
          <h3 className="text-lg font-medium inline-flex items-center gap-2">
            {client.name}
            <StatusBadge status={client.connected ? 'live' : 'review'} size="sm" />
          </h3>
          <code className="text-xs text-fg-3">{client.type} · v{client.version}</code>
        </div>
        <div className="flex gap-1">
          <Button size="xs" variant="outline" iconLeft={<ArrowsClockwise size={12} />} onClick={() => toast('info', 'Reconnect', `${client.name} bağlantısı yenilendi.`)}>Yeniden bağla</Button>
          {client.connected && <Button size="xs" variant="ghost" iconLeft={<X size={12} />} onClick={() => toast('warning', 'Disconnect', `${client.name} bağlantısı kesildi.`)}>Bağlantıyı kes</Button>}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm border-t border-slate-200 dark:border-slate-800 pt-3">
        <dt className="text-fg-3 text-xs uppercase tracking-wider">Auth</dt><dd><code className="text-xs">{client.authMethod}</code></dd>
        <dt className="text-fg-3 text-xs uppercase tracking-wider">Son aktivite</dt><dd>{client.lastSeen}</dd>
        <dt className="text-fg-3 text-xs uppercase tracking-wider">Tool çağrısı</dt><dd className="font-medium tabular-nums">{client.toolsUsed.toLocaleString('tr-TR')}</dd>
        <dt className="text-fg-3 text-xs uppercase tracking-wider">Capabilities</dt><dd className="flex flex-wrap gap-1">
          {client.capabilities.map((c) => <code key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{c}</code>)}
        </dd>
      </dl>
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Son 5 çağrı</div>
        <ul className="space-y-1 text-xs font-mono">
          {['listing.search', 'ai.value_estimate', 'tkgm.verify_parcel', 'notify.user', 'message.send'].map((t, i) => (
            <li key={i} className="flex items-center gap-2">
              <Clock size={10} className="text-fg-3 shrink-0" />
              <span className="text-fg-3 tabular-nums w-12">{(i + 1) * 12}sn</span>
              <code className="text-brand-700 dark:text-brand-300 truncate flex-1">{t}</code>
              <span className="text-emerald-600 text-[10px]">200 OK</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function ToolsCatalog() {
  const TOOLS = [
    { name: 'landx.listing.list', desc: 'İlan listesi', count: 8240 },
    { name: 'landx.listing.search', desc: 'NL arama (BM25 + vector)', count: 4180 },
    { name: 'landx.listing.create', desc: 'Yeni ilan oluştur', count: 142 },
    { name: 'landx.ai.value_estimate', desc: 'AI değerleme', count: 1820 },
    { name: 'landx.ai.risk_score', desc: 'AI risk skoru', count: 920 },
    { name: 'landx.tkgm.verify', desc: 'TKGM parsel doğrulama', count: 412 },
    { name: 'landx.eca.trigger', desc: 'ECA kural tetikleme', count: 1240 },
    { name: 'landx.notify.user', desc: 'Kullanıcıya bildirim', count: 5840 },
    { name: 'landx.audit.write', desc: 'Audit log yazma', count: 12420 },
    { name: 'landx.vector.search', desc: 'Semantic similarity', count: 612 }
  ];
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">A02 Tool Registry'e otomatik kayıtlı tools. Her tool MCP spec'i ile uyumlu input schema'ya sahip.</p>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
          <th className="text-left py-2">Tool</th>
          <th className="text-left py-2">Açıklama</th>
          <th className="text-right py-2">Çağrı (24sa)</th>
        </tr></thead>
        <tbody>
          {TOOLS.map((t) => (
            <tr key={t.name} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
              <td className="py-2"><code className="text-xs text-brand-700 dark:text-brand-300">{t.name}</code></td>
              <td className="py-2 text-xs text-fg-3">{t.desc}</td>
              <td className="py-2 text-right tabular-nums font-medium">{t.count.toLocaleString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ResourcesCatalog() {
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">MCP Resources — read-only context, AI ajanları erişebilir.</p>
      <ul className="space-y-1.5">
        {RESOURCES.map((r) => (
          <li key={r.uri} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-2">
            <Globe size={14} className="text-fg-3 shrink-0" />
            <code className="text-xs flex-1 truncate text-brand-700 dark:text-brand-300">{r.uri}</code>
            <code className="text-[10px] text-fg-3">{r.mime}</code>
            <span className="text-xs text-fg-3 hidden md:inline">{r.desc}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PromptsCatalog() {
  return (
    <Card>
      <p className="text-sm text-fg-3 mb-3">MCP Prompts — parametre alan promptlar, A06 Prompt Library ile senkron.</p>
      <ul className="space-y-1.5">
        {PROMPTS.map((p) => (
          <li key={p.name} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-2">
            <ChatCircleText size={14} className="text-brand-500 shrink-0" />
            <code className="text-xs font-medium">{p.name}</code>
            <span className="text-[11px] text-fg-3">({p.args.join(', ')})</span>
            <span className="text-xs text-fg-3 ml-auto hidden md:inline">{p.desc}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProtocolView() {
  const example = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'landx.listing.search',
      arguments: { query: 'Bodrum deniz manzara', filters: { priceMax: 10000000 } }
    },
    id: 42
  };
  return (
    <div className="space-y-3">
      <Card>
        <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Code size={14} /> Protocol Specs</h3>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <dt className="text-fg-3 text-xs uppercase tracking-wider">Sürüm</dt><dd><code>2024-11-05</code></dd>
          <dt className="text-fg-3 text-xs uppercase tracking-wider">Transport</dt><dd>WebSocket + HTTP/SSE</dd>
          <dt className="text-fg-3 text-xs uppercase tracking-wider">Endpoint</dt><dd><code>wss://mcp.landx.test/v1</code></dd>
          <dt className="text-fg-3 text-xs uppercase tracking-wider">Auth</dt><dd>OAuth 2.1 + agent-token + mTLS</dd>
          <dt className="text-fg-3 text-xs uppercase tracking-wider">Capabilities</dt><dd>tools, resources, prompts, sampling, roots, logging</dd>
        </dl>
      </Card>
      <Card>
        <h3 className="font-medium mb-2">Örnek JSON-RPC isteği</h3>
        <pre className="text-[11px] bg-slate-900 text-emerald-300 rounded-r-2 p-3 overflow-x-auto font-mono leading-relaxed">{JSON.stringify(example, null, 2)}</pre>
      </Card>
      <Card>
        <h3 className="font-medium mb-2">Methods</h3>
        <ul className="text-xs space-y-1 font-mono">
          {['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/read', 'resources/subscribe', 'prompts/list', 'prompts/get', 'sampling/createMessage', 'logging/setLevel', 'roots/list', 'ping'].map((m) => (
            <li key={m} className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              <code>{m}</code>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function LiveLogs() {
  // Mock streaming log
  const logs = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 20 }, (_, i) => {
      const t = new Date(now - i * (1200 + Math.random() * 3000));
      const types = ['tools/call', 'resources/read', 'prompts/get', 'tools/list'];
      const tools = ['landx.listing.search', 'landx.ai.value_estimate', 'landx.tkgm.verify', 'landx.audit.write'];
      return {
        at: t,
        client: CLIENTS[Math.floor(Math.random() * CLIENTS.length)].name,
        method: types[Math.floor(Math.random() * types.length)],
        tool: tools[Math.floor(Math.random() * tools.length)],
        latency: Math.round(20 + Math.random() * 180),
        ok: Math.random() > 0.05
      };
    });
  }, []);
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Lightning size={14} weight="fill" className="text-amber-500" />
        <span className="text-sm font-medium">Canlı protokol logu</span>
        <span className="inline-flex items-center gap-1 ml-auto text-[11px] text-fg-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Stream aktif
        </span>
      </div>
      <ul className="font-mono text-[11px] divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
        {logs.map((l, i) => (
          <li key={i} className="px-3 py-1.5 flex items-center gap-2">
            <span className="text-fg-3 tabular-nums w-16 shrink-0">{l.at.toLocaleTimeString('tr-TR')}</span>
            <span className="text-fg-3 truncate w-28 shrink-0">{l.client.split(' ')[0]}</span>
            <code className="text-brand-700 dark:text-brand-300 w-24 shrink-0">{l.method}</code>
            <code className="text-amber-700 dark:text-amber-300 flex-1 truncate">{l.tool}</code>
            <span className="text-fg-3 tabular-nums w-12 shrink-0">{l.latency}ms</span>
            <span className={cls('w-12 shrink-0 text-right', l.ok ? 'text-emerald-600' : 'text-rose-600')}>{l.ok ? '200 OK' : '500'}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
