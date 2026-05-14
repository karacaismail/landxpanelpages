import { useMemo, useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Pencil, Plus, FlowArrow, Sparkle, Play, Pulse } from '@phosphor-icons/react';
import type { EcaRule, EcaEvent } from '@/types/domain';
import { evaluate } from '@/lib/eca/engine';

const EVENTS: EcaEvent[] = [
  'listing.created', 'listing.updated', 'listing.status_changed', 'listing.price_changed',
  'offer.received', 'offer.status_changed', 'message.received', 'viewing.requested',
  'tkgm.flag_changed', 'user.signed_up', 'user.kyc_status_changed',
  'system.cron.daily', 'system.cron.hourly'
];

export default function RulesPage() {
  const data = useData();
  const [selected, setSelected] = useState<EcaRule | null>(data.ecaRules[0] || null);
  const [dryRunResult, setDryRunResult] = useState<string>('');

  const columns: Column<EcaRule>[] = [
    {
      key: 'name', header: 'Kural', sortable: true,
      cell: (r) => (
        <div>
          <button onClick={() => setSelected(r)} className="font-medium hover:text-brand-600 text-sm text-left">{r.name}</button>
          <div className="text-xs text-fg-3 line-clamp-1">{r.description}</div>
        </div>
      )
    },
    { key: 'event', header: 'Olay', cell: (r) => <code className="text-xs text-brand-700 dark:text-brand-300">{r.event}</code> },
    { key: 'conditions', header: 'Koşul', hideOn: 'sm', cell: (r) => <span className="text-xs text-fg-3">{r.conditions.length}</span> },
    { key: 'actions', header: 'Aksiyon', hideOn: 'sm', cell: (r) => <span className="text-xs text-fg-3">{r.actions.length}</span> },
    {
      key: 'enabled', header: 'Etkin',
      cell: (r) => (
        <button
          onClick={() => data.toggleRule(r.id)}
          aria-pressed={r.enabled}
          className={`w-10 h-6 rounded-full transition-colors ${r.enabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${r.enabled ? 'translate-x-4' : 'translate-x-0.5'} translate-y-0.5`} />
        </button>
      )
    },
    { key: 'historyCount', header: 'Tetiklenme', hideOn: 'md', accessor: (r) => r.history.length },
    {
      key: 'edit', header: '', align: 'right',
      cell: (r) => <Button size="xs" variant="ghost" iconLeft={<Pencil size={12} />} onClick={() => setSelected(r)}>Aç</Button>
    }
  ];

  function dryRun() {
    if (!selected) return;
    const payload = {
      tkgmStatus: 'ipotekli', priceChangePct: 22, status: 'draft', daysInStatus: 9,
      offerToListRatio: 0.92, responseLatencyHours: 30, newStatus: 'pending', ageHours: 60,
      count24h: 4, byUser24h: 6, newFlag: 'serh', daysToExpire: 5, imageCount: 2,
      body: 'çoooook teşekkürler', aiRiskScore: 80, isFirstInThread: true,
      tapuType: 'hisseli', features: ['Deniz manzaralı'], imarType: 'tarim',
      offerCount24h: 12, rejectsLast30d: 4, hasBrokenImage: true
    };
    const res = evaluate(selected.event, payload, [selected]);
    setDryRunResult(res.matched.length ? `Eşleşti. Çalışan aksiyonlar: ${res.emitted.map((a) => a.type).join(', ')}` : 'Eşleşmedi.');
  }

  return (
    <div>
      <SectionHeading title="ECA Kuralları" description="Event ▸ Condition ▸ Action" actions={
        <Button iconLeft={<Plus size={16} />}>Yeni kural</Button>
      } />

      <Card className="mb-4 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI özet</span></div>
        <ul className="text-sm text-fg-2 space-y-1">
          <li>• {data.ecaRules.filter((r) => r.enabled).length} aktif, {data.ecaRules.filter((r) => !r.enabled).length} taslak.</li>
          <li>• En çok kullanılan event: <code>listing.created</code> ({data.ecaRules.filter((r) => r.event === 'listing.created').length} kural).</li>
          <li>• Son 24 saatte 14 kural tetiklenmesi (mock).</li>
        </ul>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DataTable data={data.ecaRules} columns={columns} rowKey={(r) => r.id} searchable searchPlaceholder="Kural ara..." />
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-3">
            {selected ? (
              <>
                <Card>
                  <h3 className="font-medium mb-2 inline-flex items-center gap-2"><FlowArrow size={16} weight="fill" className="text-brand-500" /> {selected.name}</h3>
                  <p className="text-sm text-fg-3">{selected.description}</p>
                  <div className="mt-3 space-y-2">
                    <Block label="Event"><code className="text-xs">{selected.event}</code></Block>
                    <Block label="Conditions">
                      {selected.conditions.length === 0 ? <em className="text-xs text-fg-3">— (her zaman)</em> : (
                        <ul className="space-y-1 text-xs">
                          {selected.conditions.map((c, i) => (
                            <li key={i} className="font-mono"><code>{c.field}</code> <strong>{c.op}</strong> <code>{JSON.stringify(c.value)}</code></li>
                          ))}
                        </ul>
                      )}
                    </Block>
                    <Block label="Actions">
                      <ul className="space-y-1 text-xs">
                        {selected.actions.map((a, i) => (
                          <li key={i} className="font-mono"><code className="text-brand-700 dark:text-brand-300">{a.type}</code> {JSON.stringify(a.params).slice(0, 80)}</li>
                        ))}
                      </ul>
                    </Block>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" iconLeft={<Play size={14} />} onClick={dryRun}>Dry-run</Button>
                    <Button size="sm" variant={selected.enabled ? 'danger' : 'success'} onClick={() => data.toggleRule(selected.id)}>{selected.enabled ? 'Devre dışı bırak' : 'Etkinleştir'}</Button>
                  </div>
                  {dryRunResult && <div className="mt-2 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">{dryRunResult}</div>}
                </Card>
                <Card>
                  <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Pulse size={16} weight="fill" /> Son tetiklenmeler</h3>
                  {selected.history.length === 0 ? <div className="text-sm text-fg-3">Henüz tetiklenme yok.</div> : (
                    <ul className="text-xs space-y-1">
                      {selected.history.slice(0, 8).map((h, i) => <li key={i}>{new Date(h.at).toLocaleString('tr-TR')} — {h.matched ? '✓ eşleşti' : '✗ eşleşmedi'}</li>)}
                    </ul>
                  )}
                </Card>
              </>
            ) : (
              <div className="text-sm text-fg-3 text-center py-6">Kural seçin</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
