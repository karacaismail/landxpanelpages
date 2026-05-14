import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/data/DataTable';
import { SortableList } from '@/components/ui/SortableList';
import { Pencil, Plus, FlowArrow, Sparkle, Play, Pulse, X, FloppyDisk } from '@phosphor-icons/react';
import type { EcaRule, EcaEvent } from '@/types/domain';
import { evaluate } from '@/lib/eca/engine';
import { toast } from '@/store/toast';

const EVENTS: EcaEvent[] = [
  'listing.created', 'listing.updated', 'listing.status_changed', 'listing.price_changed',
  'offer.received', 'offer.status_changed', 'message.received', 'viewing.requested',
  'tkgm.flag_changed', 'user.signed_up', 'user.kyc_status_changed',
  'system.cron.daily', 'system.cron.hourly'
];

type Cond = EcaRule['conditions'][number];
type Act = EcaRule['actions'][number];
type CondItem = Cond & { id: string };
type ActItem = Act & { id: string };

export default function RulesPage() {
  const data = useData();
  const [selectedId, setSelectedId] = useState<string | null>(data.ecaRules[0]?.id || null);
  const selected = useMemo(() => data.ecaRules.find((r) => r.id === selectedId) || null, [data.ecaRules, selectedId]);
  const setSelected = (r: EcaRule | null) => setSelectedId(r?.id || null);
  const [dryRunResult, setDryRunResult] = useState<string>('');

  // Local editable copy of conditions/actions while reordering — saved on commit
  const [draftConds, setDraftConds] = useState<CondItem[]>([]);
  const [draftActs, setDraftActs] = useState<ActItem[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!selected) { setDraftConds([]); setDraftActs([]); setDirty(false); return; }
    setDraftConds(selected.conditions.map((c, i) => ({ ...c, id: `c-${i}` })));
    setDraftActs(selected.actions.map((a, i) => ({ ...a, id: `a-${i}` })));
    setDirty(false);
  }, [selectedId, selected]);

  function saveOrder() {
    if (!selected) return;
    const next: EcaRule = {
      ...selected,
      conditions: draftConds.map(({ id: _id, ...rest }) => rest as Cond),
      actions: draftActs.map(({ id: _id, ...rest }) => rest as Act),
      updatedAt: new Date().toISOString()
    };
    data.upsertRule(next);
    setDirty(false);
    toast('success', 'Sıra kaydedildi', `${selected.name} koşul/aksiyon sırası güncellendi.`);
  }
  function resetOrder() {
    if (!selected) return;
    setDraftConds(selected.conditions.map((c, i) => ({ ...c, id: `c-${i}` })));
    setDraftActs(selected.actions.map((a, i) => ({ ...a, id: `a-${i}` })));
    setDirty(false);
  }
  function removeCond(id: string) {
    setDraftConds((prev) => prev.filter((c) => c.id !== id));
    setDirty(true);
  }
  function removeAct(id: string) {
    setDraftActs((prev) => prev.filter((a) => a.id !== id));
    setDirty(true);
  }

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

  const [newOpen, setNewOpen] = useState(false);

  function createRule(input: { name: string; description: string; event: EcaEvent; conditions: string; actionType: string }) {
    const id = `r-new-${Date.now().toString(36)}`;
    const conditions = input.conditions.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const m = line.match(/^(\S+)\s+(eq|ne|gt|lt|gte|lte|contains|in|nin|regex|between)\s+(.+)$/);
      if (!m) return null;
      let value: unknown = m[3];
      try { value = JSON.parse(m[3]); } catch { /* keep string */ }
      return { field: m[1], op: m[2] as EcaRule['conditions'][number]['op'], value };
    }).filter(Boolean) as EcaRule['conditions'];
    const rule: EcaRule = {
      id, name: input.name, description: input.description, event: input.event,
      conditions, actions: [{ type: input.actionType as EcaRule['actions'][number]['type'], params: {} }],
      enabled: false, ownerId: 'admin', history: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    data.upsertRule(rule);
    setSelected(rule);
    setNewOpen(false);
  }

  function aiSuggestRule() {
    const suggestions = [
      { name: 'AI: Yeni satıcı 24h içinde tek ilan yayınlamadıysa hatırlat', event: 'system.cron.daily' as EcaEvent, conditions: 'roles contains "seller"\ndaysSinceSignup gt 1\nlistings.count eq 0', action: 'notify.user' },
      { name: 'AI: 100+ favori alan ilan satıcısına "öne çıkar" önerisi', event: 'listing.viewed' as EcaEvent, conditions: 'favoriteCount gte 100', action: 'notify.user' },
      { name: 'AI: KYC tam olmayan kullanıcıyı 7. günde uyar', event: 'system.cron.daily' as EcaEvent, conditions: 'kycLevel ne "full"\ndaysSinceSignup eq 7', action: 'email.mock' }
    ];
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    createRule({ name: pick.name, description: 'AI tarafından önerilen kural taslağı', event: pick.event, conditions: pick.conditions, actionType: pick.action });
  }

  return (
    <div>
      <SectionHeading title="ECA Kuralları" description="Event ▸ Condition ▸ Action" actions={
        <div className="flex gap-2">
          <Button variant="outline" iconLeft={<Sparkle size={16} weight="fill" />} onClick={aiSuggestRule}>AI ile öner</Button>
          <Button iconLeft={<Plus size={16} />} onClick={() => setNewOpen(true)}>Yeni kural</Button>
        </div>
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
          <DataTable data={data.ecaRules} columns={columns} rowKey={(r) => r.id} searchable searchPlaceholder="Kural ara..." storageKey="admin-rules" />
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
                    <Block label={`Conditions (${draftConds.length}) — sürükle-bırak ile sırala`}>
                      {draftConds.length === 0 ? <em className="text-xs text-fg-3">— (her zaman)</em> : (
                        <SortableList
                          items={draftConds}
                          ariaLabel="Koşullar sıralı liste"
                          onReorder={(next) => { setDraftConds(next); setDirty(true); }}
                          renderItem={(c) => (
                            <div className="flex items-center gap-2 text-xs">
                              <code className="font-mono">{c.field}</code>
                              <strong className="text-brand-700 dark:text-brand-300">{c.op}</strong>
                              <code className="font-mono truncate flex-1">{JSON.stringify(c.value)}</code>
                              <button onClick={() => removeCond(c.id)} className="text-fg-3 hover:text-danger" aria-label="Koşulu sil"><X size={12} /></button>
                            </div>
                          )}
                        />
                      )}
                    </Block>
                    <Block label={`Actions (${draftActs.length}) — sürükle-bırak ile sırala`}>
                      {draftActs.length === 0 ? <em className="text-xs text-fg-3">— (aksiyon yok)</em> : (
                        <SortableList
                          items={draftActs}
                          ariaLabel="Aksiyonlar sıralı liste"
                          onReorder={(next) => { setDraftActs(next); setDirty(true); }}
                          renderItem={(a) => (
                            <div className="flex items-center gap-2 text-xs">
                              <code className="font-mono text-brand-700 dark:text-brand-300 whitespace-nowrap">{a.type}</code>
                              <span className="text-fg-3 truncate flex-1">{JSON.stringify(a.params).slice(0, 60)}</span>
                              <button onClick={() => removeAct(a.id)} className="text-fg-3 hover:text-danger" aria-label="Aksiyonu sil"><X size={12} /></button>
                            </div>
                          )}
                        />
                      )}
                    </Block>
                  </div>
                  {dirty && (
                    <div className="mt-3 flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-r-2 px-3 py-2">
                      <span className="text-xs text-amber-700 dark:text-amber-300 flex-1">Kaydedilmemiş değişiklikler</span>
                      <Button size="xs" variant="ghost" onClick={resetOrder}>Geri al</Button>
                      <Button size="xs" iconLeft={<FloppyDisk size={12} />} onClick={saveOrder}>Kaydet</Button>
                    </div>
                  )}
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

      <SagaOutboxSection />

      {newOpen && <NewRuleModal events={EVENTS} onCreate={createRule} onClose={() => setNewOpen(false)} />}
    </div>
  );
}

// K04 Hook & Event Bus — Pattern: Outbox & Saga (Saga Orchestration + Transactional Outbox)
function SagaOutboxSection() {
  const SAGA_STEPS = [
    { step: 1, name: 'PaymentInitiated', service: 'payments', status: 'completed', compensation: 'PaymentRefund' },
    { step: 2, name: 'ListingReserved', service: 'listings', status: 'completed', compensation: 'UnreserveListing' },
    { step: 3, name: 'OfferAccepted', service: 'offers', status: 'completed', compensation: 'RevokeAcceptance' },
    { step: 4, name: 'TkgmTransferRecord', service: 'tkgm', status: 'running', compensation: 'CancelTkgmRecord' },
    { step: 5, name: 'NotifyParties', service: 'notifications', status: 'pending', compensation: '— (idempotent)' }
  ];
  const OUTBOX = [
    { id: 'obx-001', event: 'OfferAccepted', aggregate: 'offer:O-0142', publishedAt: '14:22:18', destinations: ['eca-engine', 'notifications', 'audit'], status: 'delivered' },
    { id: 'obx-002', event: 'ListingStatusChanged', aggregate: 'listing:L-0024', publishedAt: '14:22:14', destinations: ['eca-engine', 'search-index', 'audit'], status: 'delivered' },
    { id: 'obx-003', event: 'TkgmFlagChanged', aggregate: 'tkgm:1234/56', publishedAt: '14:22:02', destinations: ['eca-engine', 'audit'], status: 'delivered' },
    { id: 'obx-004', event: 'UserKycCompleted', aggregate: 'user:u-1842', publishedAt: '14:21:48', destinations: ['notifications', 'badges', 'audit'], status: 'delivered' },
    { id: 'obx-005', event: 'PriceChanged', aggregate: 'listing:L-0091', publishedAt: '14:21:20', destinations: ['eca-engine', 'subscribers (12)', 'audit'], status: 'retry' },
    { id: 'obx-006', event: 'OfferReceived', aggregate: 'offer:O-0143', publishedAt: '14:20:42', destinations: ['eca-engine', 'seller-push', 'audit'], status: 'delivered' }
  ];

  return (
    <Card className="mt-4">
      <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
        <div>
          <h3 className="font-medium inline-flex items-center gap-2"><Pulse size={14} weight="fill" className="text-amber-500" /> K04 Pattern Library — Saga & Outbox</h3>
          <p className="text-sm text-fg-3">Distributed transaction patterns: çok-servisli işlemler için kompansasyon zinciri ve transactional outbox.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Saga Orchestration — "Arsa satış kapanışı"</h4>
          <ul className="relative space-y-2 pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-300 dark:bg-slate-700" />
            {SAGA_STEPS.map((s) => (
              <li key={s.step} className="relative">
                <div className={`absolute -left-8 top-0 w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-900 ${
                  s.status === 'completed' ? 'bg-emerald-500' : s.status === 'running' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                }`}>
                  {s.step}
                </div>
                <div className={`p-2 rounded-r-2 border ${
                  s.status === 'completed' ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10' :
                  s.status === 'running' ? 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10' :
                  'border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs font-medium">{s.name}</code>
                    <code className="text-[10px] text-fg-3">{s.service}</code>
                  </div>
                  <div className="text-[11px] text-fg-3 mt-0.5">Compensate: <code>{s.compensation}</code></div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-fg-3 mt-2">Forward chain: 1→2→3→4→5. Herhangi bir adım fail olursa reverse compensation chain çalışır.</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-fg-3 font-semibold mb-2">Transactional Outbox — son olaylar</h4>
          <ul className="space-y-1.5">
            {OUTBOX.map((o) => (
              <li key={o.id} className="text-xs p-2 rounded-r-2 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-fg-3 tabular-nums">{o.publishedAt}</code>
                  <code className="text-brand-700 dark:text-brand-300 font-medium">{o.event}</code>
                  <span className={`ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>{o.status}</span>
                </div>
                <code className="text-[10px] text-fg-3">{o.aggregate}</code>
                <div className="text-[10px] text-fg-3 mt-0.5">→ {o.destinations.join(', ')}</div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-fg-3 mt-2">Outbox table tek aggregate ile aynı transaction'da yazılır; relay job dispatcher event bus'a aktarır. At-least-once delivery, idempotent consumer.</p>
        </div>
      </div>
    </Card>
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

function NewRuleModal({ events, onCreate, onClose }: { events: EcaEvent[]; onCreate: (input: { name: string; description: string; event: EcaEvent; conditions: string; actionType: string }) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [event, setEvent] = useState<EcaEvent>(events[0]);
  const [conditions, setConditions] = useState('');
  const [actionType, setActionType] = useState('notify.user');
  return (
    <div role="dialog" aria-label="Yeni kural" className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-r-4 p-4 lg:p-6 shadow-2xl space-y-3">
        <h3 className="text-lg font-semibold">Yeni ECA kuralı</h3>
        <div>
          <label className="text-sm font-medium">Ad</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]" />
        </div>
        <div>
          <label className="text-sm font-medium">Açıklama</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Event</label>
          <select value={event} onChange={(e) => setEvent(e.target.value as EcaEvent)} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
            {events.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Koşullar (her satır: <code className="text-xs">field op value</code>)</label>
          <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={3} placeholder={'tkgmStatus eq "ipotekli"\npriceChangePct gt 20'} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="text-sm font-medium">Aksiyon tipi</label>
          <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
            {['notify.user','notify.role','email.mock','webhook.mock','assign.to','set.field','tag.add','flag.review','ai.summarize'].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" block onClick={onClose}>İptal</Button>
          <Button block disabled={!name.trim()} onClick={() => onCreate({ name, description, event, conditions, actionType })}>Oluştur</Button>
        </div>
      </div>
    </div>
  );
}
