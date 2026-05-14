import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkle, X, ChatCircleText, MagicWand, FlowArrow, PaperPlaneRight,
  Lightning, ArrowRight, CheckCircle, Warning, ChartLineUp, Bookmark, Eye,
  Robot, BellSimple, Sliders, Brain
} from '@phosphor-icons/react';
import { useUi } from '@/store/ui';
import { useAi } from '@/store/ai';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { chat } from '@/lib/ai/mock-llm';
import { cls } from '@/lib/utils/cls';
import { Button } from '@/components/ui/Button';
import { toast } from '@/store/toast';

type Tab = 'chat' | 'suggest' | 'automation';

interface QuickAction {
  id: string;
  title: string;
  desc?: string;
  Icon: typeof Sparkle;
  tone?: 'brand' | 'warning' | 'success' | 'info';
  run: () => void;
}

export function AssistantDrawer() {
  const ui = useUi();
  const { t } = useTranslation();
  const ai = useAi();
  const auth = useAuth();
  const data = useData();
  const loc = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('chat');
  const [input, setInput] = useState('');
  const open = ui.assistantOpen;
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        listRef.current?.scrollTo({ top: 1e6 });
        inputRef.current?.focus();
      }, 50);
    }
  }, [open, ai.history]);

  // Esc kapatır
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') ui.setAssistant(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, ui]);

  async function send(text?: string) {
    const t0 = (text ?? input).trim();
    if (!t0) return;
    setInput('');
    ai.appendUser(t0);
    ai.setThinking(true);
    const reply = await chat({ user: t0, context: { route: loc.pathname, role: auth.role } });
    ai.setThinking(false);
    ai.appendAssistant(reply.text);
  }

  const quickActions = useMemo<QuickAction[]>(() => routeQuickActions({
    pathname: loc.pathname, data, auth, navigate, closeDrawer: () => ui.setAssistant(false)
  }), [loc.pathname, data, auth, navigate, ui]);

  const quickPrompts = useMemo(() => routeQuickPrompts(loc.pathname, auth.role), [loc.pathname, auth.role]);
  const insights = useMemo(() => routeInsights({ pathname: loc.pathname, data, auth }), [loc.pathname, data, auth]);

  if (!open) return null;

  return (
    <>
      <button className="fixed inset-0 z-30 bg-black/40 lg:bg-black/30" aria-label="Yardımcıyı kapat" onClick={() => ui.setAssistant(false)} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('ai.title')}
        className={cls(
          'fixed z-40 right-0 top-0 bottom-0 w-full sm:w-[460px] lg:w-[520px] bg-white dark:bg-slate-900',
          'border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col safe-top safe-bottom'
        )}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-50/60 via-transparent to-transparent dark:from-brand-900/30">
          <div className="w-9 h-9 rounded-r-2 bg-brand-100 dark:bg-brand-900/50 grid place-items-center text-brand-600 shrink-0">
            <Sparkle size={18} weight="fill" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm">AI Yardımcı</div>
            <div className="text-[11px] text-fg-3 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Hazır</span>
              <span className="text-fg-3">·</span>
              <span>Claude Sonnet 4.6</span>
              <span className="text-fg-3 hidden sm:inline">·</span>
              <code className="hidden sm:inline text-[10px] text-fg-3 truncate">{loc.pathname}</code>
            </div>
          </div>
          <button onClick={() => ui.setAssistant(false)} className="p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <TabBtn active={tab === 'chat'} Icon={ChatCircleText} onClick={() => setTab('chat')} count={ai.history.length || undefined}>Sohbet</TabBtn>
          <TabBtn active={tab === 'suggest'} Icon={MagicWand} onClick={() => setTab('suggest')} count={quickActions.length}>Aksiyonlar</TabBtn>
          <TabBtn active={tab === 'automation'} Icon={FlowArrow} onClick={() => setTab('automation')} count={data.ecaRules.filter((r) => r.enabled).length}>Otomasyon</TabBtn>
        </div>

        {tab === 'chat' && (
          <>
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {ai.history.length === 0 ? (
                <ChatEmptyState
                  quickActions={quickActions.slice(0, 4)}
                  quickPrompts={quickPrompts}
                  insights={insights}
                  onPrompt={(p) => send(p)}
                  role={auth.role}
                />
              ) : (
                <>
                  {ai.history.map((m) => (
                    <div key={m.id} className={cls('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                      <div className={cls(
                        'max-w-[85%] rounded-r-3 px-3 py-2 text-sm whitespace-pre-line shadow-sm',
                        m.role === 'user'
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-fg-1'
                      )}>{m.content}</div>
                    </div>
                  ))}
                  {ai.thinking && (
                    <div className="flex justify-start">
                      <div className="rounded-r-3 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-fg-3 inline-flex items-center gap-2">
                        <Sparkle size={14} weight="fill" className="text-brand-500 animate-pulse" /> Düşünüyorum…
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {ai.history.length > 0 && quickPrompts.length > 0 && (
              <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5 overflow-x-auto">
                {quickPrompts.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-brand-900/40 text-fg-2 whitespace-nowrap"
                  >{p}</button>
                ))}
              </div>
            )}

            <form className="p-2.5 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-end" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                rows={1}
                placeholder="Bir şey sor, niyetini yaz, '/' ile komut başlat…"
                className="flex-1 resize-none rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px] max-h-32"
                aria-label="AI ile konuş"
              />
              <Button type="submit" iconLeft={<PaperPlaneRight size={16} />} className="shrink-0">Gönder</Button>
            </form>
          </>
        )}

        {tab === 'suggest' && (
          <SuggestTab
            quickActions={quickActions}
            insights={insights}
          />
        )}

        {tab === 'automation' && (
          <AutomationTab onNavigate={(h) => { ui.setAssistant(false); navigate(h); }} />
        )}
      </aside>
    </>
  );
}

function TabBtn({ active, children, onClick, Icon, count }: { active: boolean; children: React.ReactNode; onClick: () => void; Icon: typeof ChatCircleText; count?: number; }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        'flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors',
        active ? 'border-brand-500 text-brand-700 dark:text-brand-200' : 'border-transparent text-fg-3 hover:text-fg-1'
      )}
    >
      <Icon size={16} weight={active ? 'fill' : 'regular'} />
      <span>{children}</span>
      {count !== undefined && count > 0 && (
        <span className={cls('text-[10px] px-1.5 py-0.5 rounded-full tabular-nums', active ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-fg-3')}>{count}</span>
      )}
    </button>
  );
}

function ChatEmptyState({ quickActions, quickPrompts, insights, onPrompt, role }: { quickActions: QuickAction[]; quickPrompts: string[]; insights: Insight[]; onPrompt: (p: string) => void; role: string; }) {
  return (
    <div className="space-y-4">
      {insights.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5 inline-flex items-center gap-1.5"><Brain size={12} weight="fill" className="text-brand-500" /> Bu sayfa için içgörü</div>
          <div className="space-y-1.5">
            {insights.slice(0, 3).map((it) => <InsightRow key={it.id} insight={it} />)}
          </div>
        </section>
      )}

      {quickActions.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5 inline-flex items-center gap-1.5"><Lightning size={12} weight="fill" className="text-amber-500" /> Tek tıkla aksiyon</div>
          <div className="grid gap-2">
            {quickActions.map((a) => <ActionCard key={a.id} action={a} />)}
          </div>
        </section>
      )}

      {quickPrompts.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5 inline-flex items-center gap-1.5"><MagicWand size={12} weight="fill" className="text-fuchsia-500" /> Hızlı komutlar</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => onPrompt(p)}
                className="text-xs px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-brand-900/40 hover:text-brand-700 dark:hover:text-brand-200 text-fg-2 transition-colors"
              >{p}</button>
            ))}
          </div>
        </section>
      )}

      <section className="text-[11px] text-fg-3 space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="font-semibold uppercase tracking-wider mb-1">Rolünüz: <span className="text-fg-2 normal-case">{role}</span></div>
        <div>· Enter ile gönder · Shift+Enter satır atla</div>
        <div>· Cmd/Ctrl+K komut paleti · Esc kapat</div>
      </section>
    </div>
  );
}

function ActionCard({ action }: { action: QuickAction }) {
  const tone = action.tone || 'brand';
  const Icon = action.Icon;
  const toneCls: Record<string, string> = {
    brand: 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    info: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
  };
  return (
    <button
      onClick={action.run}
      className={cls(
        'w-full text-left p-2.5 rounded-r-3 border flex items-start gap-2.5 transition-all hover:shadow-sm hover:-translate-y-0.5',
        toneCls[tone]
      )}
    >
      <div className="shrink-0 w-8 h-8 rounded-r-2 bg-white/60 dark:bg-slate-900/60 grid place-items-center">
        <Icon size={16} weight="duotone" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{action.title}</div>
        {action.desc && <div className="text-[11px] opacity-80 mt-0.5 line-clamp-2">{action.desc}</div>}
      </div>
      <ArrowRight size={14} className="opacity-60 shrink-0 mt-1" />
    </button>
  );
}

interface Insight { id: string; title: string; value: string; trend?: 'up' | 'down' | 'flat'; tone?: 'good' | 'bad' | 'neutral'; }

function InsightRow({ insight }: { insight: Insight }) {
  const toneCls = insight.tone === 'good' ? 'text-emerald-600 dark:text-emerald-400'
    : insight.tone === 'bad' ? 'text-rose-600 dark:text-rose-400'
    : 'text-fg-2';
  const arrow = insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : insight.trend === 'flat' ? '→' : '';
  return (
    <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-r-2 bg-slate-50 dark:bg-slate-800/50">
      <span className="text-xs text-fg-2 truncate">{insight.title}</span>
      <span className={cls('text-sm font-medium tabular-nums whitespace-nowrap', toneCls)}>{insight.value} {arrow}</span>
    </div>
  );
}

function SuggestTab({ quickActions, insights }: { quickActions: QuickAction[]; insights: Insight[]; }) {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      {insights.length > 0 && (
        <section>
          <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5">İçgörü ({insights.length})</div>
          <div className="space-y-1.5">
            {insights.map((it) => <InsightRow key={it.id} insight={it} />)}
          </div>
        </section>
      )}
      <section>
        <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5">Aksiyonlar ({quickActions.length})</div>
        <div className="grid gap-2">
          {quickActions.map((a) => <ActionCard key={a.id} action={a} />)}
        </div>
        {quickActions.length === 0 && <div className="text-sm text-fg-3 italic">Bu sayfa için özel aksiyon yok.</div>}
      </section>
    </div>
  );
}

function AutomationTab({ onNavigate }: { onNavigate: (h: string) => void; }) {
  const data = useData();
  const enabled = data.ecaRules.filter((r) => r.enabled);
  const disabled = data.ecaRules.filter((r) => !r.enabled);
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-r-2 bg-emerald-50 dark:bg-emerald-900/30">
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">{enabled.length}</div>
          <div className="text-[10px] text-fg-3 uppercase">Aktif</div>
        </div>
        <div className="text-center p-2 rounded-r-2 bg-slate-100 dark:bg-slate-800">
          <div className="text-lg font-bold text-fg-1 tabular-nums">{disabled.length}</div>
          <div className="text-[10px] text-fg-3 uppercase">Pasif</div>
        </div>
        <div className="text-center p-2 rounded-r-2 bg-brand-50 dark:bg-brand-900/30">
          <div className="text-lg font-bold text-brand-700 dark:text-brand-300 tabular-nums">{enabled.reduce((s, r) => s + r.history.length, 0)}</div>
          <div className="text-[10px] text-fg-3 uppercase">Tetiklenme</div>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1.5">Aktif kurallar</div>
        <div className="space-y-1.5">
          {enabled.slice(0, 12).map((r) => (
            <button
              key={r.id}
              onClick={() => onNavigate('/admin/rules')}
              className="w-full text-left p-2.5 rounded-r-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <FlowArrow size={14} weight="duotone" className="text-brand-500 shrink-0" />
                <div className="text-sm font-medium truncate flex-1">{r.name}</div>
                <span className="text-[10px] text-fg-3 tabular-nums">{r.history.length}×</span>
              </div>
              <div className="text-xs text-fg-3 mt-0.5 line-clamp-1 ml-6">{r.description}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNavigate('/admin/rules')}
        className="w-full text-center text-xs text-brand-700 dark:text-brand-300 hover:underline py-2"
      >Tüm kuralları yönet →</button>
    </div>
  );
}

// ─── Route-aware action / prompt / insight registry ────────────────────────

type DataStore = ReturnType<typeof useData.getState>;
type AuthStore = ReturnType<typeof useAuth.getState>;

interface BuildCtx {
  pathname: string;
  data: DataStore;
  auth: AuthStore;
  navigate: ReturnType<typeof useNavigate>;
  closeDrawer: () => void;
}

function routeQuickActions(ctx: BuildCtx): QuickAction[] {
  const { pathname, data, auth, navigate, closeDrawer } = ctx;
  const go = (h: string) => { closeDrawer(); navigate(h); };

  if (pathname.startsWith('/admin/approvals')) {
    const queue = data.listings.filter((l) => l.status === 'review');
    const lowRisk = queue.filter((q) => q.aiRiskScore < 30);
    return [
      { id: 'a1', title: `${lowRisk.length} düşük-riskli ilanı topluca onayla`, desc: 'AI risk skoru < 30, hızlı yayın', Icon: CheckCircle, tone: 'success', run: () => { toast('success', 'Toplu onay tetiklendi', `${lowRisk.length} ilan canlıya alındı (mock).`); go('/admin/approvals'); } },
      { id: 'a2', title: 'Yüksek riskli ilanları filtrele', desc: `${queue.filter((q) => q.aiRiskScore >= 60).length} ilan dikkat gerektiriyor`, Icon: Warning, tone: 'warning', run: () => go('/admin/approvals?risk=high') },
      { id: 'a3', title: 'AI red mektubu taslakla', desc: 'TKGM uyumsuzluğu olanlar için tek seferde', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'Mektup taslakları hazır', 'Mock: 4 red mektubu /admin/notifications-templates altında.') },
      { id: 'a4', title: 'Onay kuyruğu raporunu indir', desc: 'CSV — son 30 gün', Icon: ChartLineUp, tone: 'info', run: () => toast('success', 'Rapor hazırlandı', 'approval-queue-2026-05.csv indirilebilir (mock).') }
    ];
  }
  if (pathname.startsWith('/admin/rules')) {
    return [
      { id: 'a1', title: 'AI ile yeni kural öner', desc: 'Son trendlere göre 3 taslak hazırla', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'AI kural önerileri', '3 taslak kural önerildi (mock).') },
      { id: 'a2', title: 'En çok tetiklenen kuralı analiz et', desc: 'Performans + öneri', Icon: ChartLineUp, tone: 'info', run: () => toast('info', 'Analiz', 'Mock: listing.created en sık etkinleştiriyor.') },
      { id: 'a3', title: 'Devre dışı kuralları temizle', desc: '90 gündür hiç tetiklenmeyenler', Icon: Warning, tone: 'warning', run: () => toast('warning', 'Arşivleme önerisi', '6 kural pasif duruyor.') }
    ];
  }
  if (pathname.startsWith('/admin/audit')) {
    return [
      { id: 'a1', title: 'Hash chain bütünlüğünü doğrula', desc: 'Son 30 gün eventleri', Icon: CheckCircle, tone: 'success', run: () => toast('success', 'Bütünlük OK', 'Mock: tüm hash\'ler doğrulandı, manipülasyon yok.') },
      { id: 'a2', title: 'Anomali tespiti', desc: 'AI ile sıra dışı erişim örüntüsü', Icon: Brain, tone: 'brand', run: () => toast('ai', 'AI anomali tarama', 'Mock: 2 şüpheli admin login bulundu.') },
      { id: 'a3', title: 'KVKK/SOC2 raporu', desc: 'Son 90 gün audit log dökümü', Icon: ChartLineUp, tone: 'info', run: () => toast('info', 'Rapor hazırlandı', 'compliance-audit.pdf indirilebilir (mock).') }
    ];
  }
  if (pathname.startsWith('/admin/reports')) {
    return [
      { id: 'a1', title: 'PDF rapor üret', desc: 'Şu anki görünüm', Icon: ChartLineUp, tone: 'brand', run: () => toast('success', 'PDF hazır', 'reports-2026-05.pdf (mock).') },
      { id: 'a2', title: 'Bütçe alarmı kur', desc: 'AI kullanım > $600/gün uyarı', Icon: BellSimple, tone: 'warning', run: () => toast('success', 'Alarm kuruldu', 'Eşik aşılırsa Slack + email.') },
      { id: 'a3', title: 'AI ile özet çıkar', desc: 'Yöneticiye tek paragraf brief', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'AI özeti', 'Mock: Bu ay onay süresi -%18, KYC dönüşümü +%12.') }
    ];
  }
  if (pathname.startsWith('/admin/tenant')) {
    return [
      { id: 'a1', title: 'Yeni tenant provisioning', desc: 'AI ile 30sn\'de kurulum', Icon: Sparkle, tone: 'brand', run: () => go('/admin/tenant?new=1') },
      { id: 'a2', title: 'Kota kullanımını analiz et', desc: 'Hangi tenant bütçesini aşıyor?', Icon: ChartLineUp, tone: 'info', run: () => toast('info', 'Kota analizi', 'Mock: Bodrum Mülk %92 quota kullanımında.') },
      { id: 'a3', title: 'Arşivlenebilecek tenant\'lar', desc: '30+ gündür inaktif', Icon: Warning, tone: 'warning', run: () => toast('warning', 'Arşiv adayları', 'Mock: 2 tenant arşivlenebilir.') }
    ];
  }
  if (pathname.startsWith('/admin/notifications-templates')) {
    return [
      { id: 'a1', title: 'AI ile yeni şablon yaz', desc: 'Anlamlı 3 varyant öner', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'Şablon taslakları', '3 varyant oluşturuldu (mock).') },
      { id: 'a2', title: 'Düşük performanslı şablonu güncelle', desc: 'Tıklama oranı < %2', Icon: Warning, tone: 'warning', run: () => toast('warning', 'Şablon önerisi', '2 şablon revize edilmeli.') }
    ];
  }
  if (pathname.startsWith('/admin')) {
    const pending = data.listings.filter((l) => l.status === 'review').length;
    return [
      { id: 'a1', title: `${pending} ilanı onay kuyruğunda incele`, desc: 'Risk dağılımı + AI önerisi', Icon: CheckCircle, tone: 'warning', run: () => go('/admin/approvals') },
      { id: 'a2', title: 'Bu hafta yeni satıcı raporu', desc: '7 kullanıcı kaydı, 3 KYC bekliyor', Icon: ChartLineUp, tone: 'info', run: () => go('/admin/users') },
      { id: 'a3', title: 'AI maliyet özeti', desc: 'Aylık $14.7K (-%4 hedef)', Icon: Sparkle, tone: 'brand', run: () => go('/admin/ai-ops/observability') },
      { id: 'a4', title: 'Audit log son 24sa', desc: '142 event, 0 anomali', Icon: Eye, tone: 'success', run: () => go('/admin/audit') }
    ];
  }
  if (pathname.startsWith('/seller/listings/new')) {
    return [
      { id: 'a1', title: 'AI ile formu doldur', desc: '%70 alan otomatik dolar', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'AI auto-fill', 'Mock: TKGM\'den + benzer ilanlardan alanlar dolduruluyor.') },
      { id: 'a2', title: 'Bölge emsal raporu', desc: 'Son 6 ay 12 emsal', Icon: ChartLineUp, tone: 'info', run: () => toast('info', 'Emsal raporu', 'Mock: 4.1M ortalama, 22 gün medyan satış.') },
      { id: 'a3', title: 'AI başlık önerisi', desc: '3 SEO uyumlu varyant', Icon: MagicWand, tone: 'brand', run: () => toast('ai', 'Başlık önerileri', '3 varyant taslakta.') }
    ];
  }
  if (pathname.startsWith('/seller')) {
    const mine = data.listings.filter((l) => l.ownerId === auth.currentUserId);
    const pending = data.offers.filter((o) => o.sellerId === auth.currentUserId && o.status === 'pending').length;
    return [
      { id: 'a1', title: `${pending} bekleyen teklif`, desc: 'AI ile cevap taslağı hazırla', Icon: PaperPlaneRight, tone: 'warning', run: () => go('/seller/offers') },
      { id: 'a2', title: 'İlanlarınızın performansı', desc: 'Görüntülenmeler +%12 (7g)', Icon: ChartLineUp, tone: 'info', run: () => go('/seller/performance') },
      { id: 'a3', title: 'Düşük performans uyarısı', desc: `${mine.filter((l) => l.status === 'live').length} canlı ilanın 2\'si zayıf`, Icon: Warning, tone: 'warning', run: () => toast('warning', 'Önerim', 'Fotoğraf çek, fiyatı %5 düşür.') },
      { id: 'a4', title: 'Yeni ilan oluştur', desc: 'AI 6 adım sihirbazda', Icon: Sparkle, tone: 'brand', run: () => go('/seller/listings/new') }
    ];
  }
  if (pathname.startsWith('/listings/')) {
    const id = pathname.split('/').pop();
    return [
      { id: 'a1', title: 'Bu ilanı favorile', desc: 'Fiyat alarmı kur', Icon: Bookmark, tone: 'brand', run: () => toast('success', 'Favoriye eklendi', 'Fiyat değişimlerinde haber alacaksın.') },
      { id: 'a2', title: '%8 indirim önererek teklif gönder', desc: 'AI pazarlık asistanı', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'Teklif taslağı hazır', 'Mock: 3.86M TL teklif gönderiliyor.') },
      { id: 'a3', title: 'Benzer 6 ilan', desc: 'Aynı bölge, ±20% fiyat', Icon: ChartLineUp, tone: 'info', run: () => go('/listings') },
      { id: 'a4', title: 'TKGM doğrulamayı incele', desc: `İlan ${id} kayıtları`, Icon: CheckCircle, tone: 'info', run: () => toast('info', 'TKGM raporu', 'Mock: müstakil tapu, şerh yok.') }
    ];
  }
  if (pathname === '/listings' || pathname.startsWith('/listings?')) {
    return [
      { id: 'a1', title: 'Aramayı kaydet + alarm', desc: 'Yeni eşleşenler için bildirim', Icon: BellSimple, tone: 'brand', run: () => toast('success', 'Arama kaydedildi', 'Yeni ilanlarda bildirim alırsın.') },
      { id: 'a2', title: 'Harita modunda incele', desc: 'Yoğunluk + fiyat', Icon: Eye, tone: 'info', run: () => go('/listings?view=map') },
      { id: 'a3', title: 'AI önerisi: bana göre 5 ilan', desc: 'Profilinize göre seçim', Icon: Sparkle, tone: 'brand', run: () => toast('ai', 'AI önerileri', 'Mock: 5 ilan favoriler üstünde.') }
    ];
  }
  if (pathname === '/') {
    return [
      { id: 'a1', title: 'AI ile arsa keşfi', desc: '"Beykoz 2.5M altı imarlı" yazın', Icon: Sparkle, tone: 'brand', run: () => go('/listings') },
      { id: 'a2', title: 'Satıcı olarak başla', desc: '5 dakikada ilk ilan', Icon: ArrowRight, tone: 'success', run: () => go('/sell') },
      { id: 'a3', title: 'Rol seç + demo', desc: 'Buyer/Seller/Admin paneller', Icon: Robot, tone: 'info', run: () => go('/auth') }
    ];
  }
  if (pathname.startsWith('/account')) {
    return [
      { id: 'a1', title: 'KYC seviyesini tamamla', desc: 'Doğrulanmış rozet kazan', Icon: CheckCircle, tone: 'warning', run: () => go('/account/profile') },
      { id: 'a2', title: 'Favorilerimi analiz et', desc: 'AI 5 benzer ilan önerir', Icon: Sparkle, tone: 'brand', run: () => go('/account/favorites/trends') },
      { id: 'a3', title: 'Bildirim tercihlerimi ayarla', desc: 'Kanallar + sıklık', Icon: Sliders, tone: 'info', run: () => go('/account/profile') }
    ];
  }
  return [
    { id: 'a1', title: 'Komut paletini aç', desc: 'Cmd+K — niyet/komut tek alanda', Icon: MagicWand, tone: 'brand', run: () => { closeDrawer(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })); } },
    { id: 'a2', title: 'Anasayfaya dön', desc: 'Hızlı keşif', Icon: ArrowRight, tone: 'info', run: () => go('/') }
  ];
}

function routeQuickPrompts(pathname: string, role: string): string[] {
  if (pathname.startsWith('/admin')) {
    return ['Bu hafta neyi öncelemeliyim?', 'En çok red sebebim ne?', 'Onay süresini nasıl hızlandırırım?', 'AI maliyetini nasıl düşürürüm?'];
  }
  if (pathname.startsWith('/seller')) {
    return ['Hangi ilanım zayıf performans gösteriyor?', 'Fiyatı düşürmeli miyim?', 'En iyi teklifi nasıl tanırım?', 'Satışı hızlandıracak 3 öneri'];
  }
  if (pathname.startsWith('/listings/')) {
    return ['Bu fiyat uygun mu?', 'Yakındaki emsaller', 'TKGM riskleri', 'Pazarlık önerisi'];
  }
  if (pathname.startsWith('/listings')) {
    return ['İstanbul Beykoz 5dn imarlı', 'Bodrum deniz manzara 10M altı', '2M altı yatırımlık', 'Şehir merkezine 30dk'];
  }
  return role === 'guest'
    ? ['Nasıl başlarım?', 'Satıcı olmak', 'AI nasıl yardım eder?']
    : ['Bugün ne yapmalıyım?', 'Önerilerini göster', 'Son aktiviteler'];
}

function routeInsights({ pathname, data, auth }: { pathname: string; data: DataStore; auth: AuthStore; }): Insight[] {
  if (pathname.startsWith('/admin/approvals')) {
    const queue = data.listings.filter((l) => l.status === 'review');
    return [
      { id: 'i1', title: 'Onay kuyruğu', value: String(queue.length), tone: queue.length > 10 ? 'bad' : 'neutral' },
      { id: 'i2', title: 'Yüksek risk', value: String(queue.filter((q) => q.aiRiskScore >= 60).length), tone: 'bad' },
      { id: 'i3', title: 'Ortalama onay süresi', value: '4.2sa', trend: 'down', tone: 'good' }
    ];
  }
  if (pathname.startsWith('/admin/audit')) {
    return [
      { id: 'i1', title: 'Son 24sa olay', value: '142', trend: 'flat', tone: 'neutral' },
      { id: 'i2', title: 'Şüpheli erişim', value: '0', tone: 'good' },
      { id: 'i3', title: 'Hash chain bütünlüğü', value: '✓ OK', tone: 'good' }
    ];
  }
  if (pathname.startsWith('/admin/reports')) {
    return [
      { id: 'i1', title: 'Aylık aktif kullanıcı', value: '1.8K', trend: 'up', tone: 'good' },
      { id: 'i2', title: 'Onay süresi (avg)', value: '4.2sa', trend: 'down', tone: 'good' },
      { id: 'i3', title: 'AI çağrı maliyeti', value: '$14.7K', trend: 'up', tone: 'bad' }
    ];
  }
  if (pathname.startsWith('/admin')) {
    const pending = data.listings.filter((l) => l.status === 'review').length;
    return [
      { id: 'i1', title: 'Bekleyen onay', value: String(pending), tone: pending > 10 ? 'bad' : 'neutral' },
      { id: 'i2', title: 'Bugün audit event', value: '142', trend: 'flat', tone: 'neutral' },
      { id: 'i3', title: 'Aktif ECA kuralı', value: String(data.ecaRules.filter((r) => r.enabled).length), tone: 'good' }
    ];
  }
  if (pathname.startsWith('/seller')) {
    const mine = data.listings.filter((l) => l.ownerId === auth.currentUserId);
    return [
      { id: 'i1', title: 'Yayında ilan', value: String(mine.filter((l) => l.status === 'live').length), trend: 'up', tone: 'good' },
      { id: 'i2', title: 'Bekleyen teklif', value: String(data.offers.filter((o) => o.sellerId === auth.currentUserId && o.status === 'pending').length), tone: 'neutral' },
      { id: 'i3', title: 'Görüntülenme (7g)', value: '+%12', trend: 'up', tone: 'good' }
    ];
  }
  if (pathname.startsWith('/listings/')) {
    return [
      { id: 'i1', title: 'Bölge fiyat ortalaması', value: '4.1M', tone: 'neutral' },
      { id: 'i2', title: 'AI değerleme', value: '3.8-4.5M', tone: 'good' },
      { id: 'i3', title: 'Risk skoru', value: '18/100', tone: 'good' }
    ];
  }
  return [];
}
