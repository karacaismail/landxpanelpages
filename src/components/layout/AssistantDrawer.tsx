import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkle, X, ChatCircleText, MagicWand, FlowArrow, PaperPlaneRight } from '@phosphor-icons/react';
import { useUi } from '@/store/ui';
import { useAi } from '@/store/ai';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { chat } from '@/lib/ai/mock-llm';
import { cls } from '@/lib/utils/cls';
import { Button } from '@/components/ui/Button';

type Tab = 'chat' | 'suggest' | 'automation';

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

  useEffect(() => {
    if (open) setTimeout(() => listRef.current?.scrollTo({ top: 1e6 }), 50);
  }, [open, ai.history]);

  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    ai.appendUser(text);
    ai.setThinking(true);
    const reply = await chat({ user: text, context: { route: loc.pathname, role: auth.role } });
    ai.setThinking(false);
    ai.appendAssistant(reply.text);
  }

  function useSuggestion(s: { label: string; commandId?: string; href?: string }) {
    if (s.href) { navigate(s.href.replace('#', '')); ui.setAssistant(false); }
    else if (s.commandId === 'palette.open') { ui.setPalette(true); }
  }

  if (!open) return null;

  return (
    <>
      <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" aria-label="Yardımcıyı kapat" onClick={() => ui.setAssistant(false)} />
      <aside
        role="dialog"
        aria-label={t('ai.title')}
        className={cls(
          'fixed z-40 right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-slate-900',
          'border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col safe-top safe-bottom'
        )}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Sparkle size={20} weight="fill" className="text-brand-500" />
          <div>
            <div className="font-medium">{t('ai.title')}</div>
            <div className="text-xs text-fg-3">{t('ai.subtitle')}</div>
          </div>
          <button onClick={() => ui.setAssistant(false)} className="ml-auto p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t('ai.close')}>
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <TabBtn active={tab === 'chat'} Icon={ChatCircleText} onClick={() => setTab('chat')}>{t('ai.tabChat')}</TabBtn>
          <TabBtn active={tab === 'suggest'} Icon={MagicWand} onClick={() => setTab('suggest')}>{t('ai.tabSuggest')}</TabBtn>
          <TabBtn active={tab === 'automation'} Icon={FlowArrow} onClick={() => setTab('automation')}>{t('ai.tabAutomations')}</TabBtn>
        </div>

        {tab === 'chat' && (
          <>
            <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {ai.history.length === 0 && (
                <div className="text-sm text-fg-3 px-2 py-4">{t('ai.emptyChat')}</div>
              )}
              {ai.history.map((m) => (
                <div key={m.id} className={cls('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cls(
                    'max-w-[85%] rounded-r-3 px-3 py-2 text-sm whitespace-pre-line',
                    m.role === 'user'
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-fg-1'
                  )}>{m.content}</div>
                </div>
              ))}
              {ai.thinking && (
                <div className="flex justify-start">
                  <div className="rounded-r-3 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-fg-3 inline-flex items-center gap-2">
                    <Sparkle size={14} weight="fill" className="text-brand-500 animate-pulse" /> {t('ai.thinking')}
                  </div>
                </div>
              )}
            </div>
            <form className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('ai.placeholder')}
                className="flex-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                aria-label={t('ai.placeholder')}
              />
              <Button type="submit" iconLeft={<PaperPlaneRight size={16} />}>{t('ai.send')}</Button>
            </form>
          </>
        )}

        {tab === 'suggest' && (
          <ContextualSuggestions
            pathname={loc.pathname}
            onClose={() => ui.setAssistant(false)}
            onNavigate={(href) => { ui.setAssistant(false); navigate(href); }}
          />
        )}

        {tab === 'automation' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {data.ecaRules.filter((r) => r.enabled).slice(0, 12).map((r) => (
              <button
                key={r.id}
                onClick={() => { ui.setAssistant(false); navigate('/admin/rules'); }}
                className="w-full text-left p-3 rounded-r-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-fg-3 mt-0.5">{r.description}</div>
              </button>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}

function TabBtn({ active, children, onClick, Icon }: { active: boolean; children: React.ReactNode; onClick: () => void; Icon: typeof ChatCircleText; }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        'flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2',
        active ? 'border-brand-500 text-brand-700 dark:text-brand-200' : 'border-transparent text-fg-3 hover:text-fg-1'
      )}
    >
      <Icon size={16} weight={active ? 'fill' : 'regular'} />
      {children}
    </button>
  );
}

function SuggestionCard({ title, desc, onClick }: { title: string; desc: string; onClick?: () => void; }) {
  return (
    <div onClick={onClick} className={cls('p-3 rounded-r-3 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-900/20', onClick && 'cursor-pointer hover:shadow-sm')}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-fg-3 mt-0.5">{desc}</div>
    </div>
  );
}

interface CtxProps { pathname: string; onClose: () => void; onNavigate: (href: string) => void; }
function ContextualSuggestions({ pathname, onClose, onNavigate }: CtxProps) {
  const data = useData();
  const auth = useAuth();
  const me = data.users.find((u) => u.id === auth.currentUserId);

  // Route-aware suggestion sets
  let suggestions: { title: string; desc: string; href?: string }[] = [];

  if (pathname.startsWith('/admin/approvals')) {
    const queue = data.listings.filter((l) => l.status === 'review');
    suggestions = [
      { title: `${queue.length} ilan onay bekliyor`, desc: 'Risk dağılımı: yüksek ' + queue.filter((q) => q.aiRiskScore >= 60).length + ', orta ' + queue.filter((q) => q.aiRiskScore >= 30 && q.aiRiskScore < 60).length + ', düşük ' + queue.filter((q) => q.aiRiskScore < 30).length },
      { title: 'Düşük riskli olanları topluca onayla', desc: 'AI önerisi: 1-tık ile gerçek değer.' },
      { title: 'AI red mektubu taslağı hazır', desc: 'TKGM uyumsuzluğu olanlar için.' }
    ];
  } else if (pathname.startsWith('/admin/rules')) {
    suggestions = [
      { title: `${data.ecaRules.filter((r) => r.enabled).length} kural etkin`, desc: 'Son 24h\'de en çok tetiklenen: listing.created' },
      { title: 'Yeni kural taslağı', desc: 'Fiyat -10% düşüş → favori kullanıcılara bildir.' },
      { title: 'Kural performansı raporu', desc: 'Etkili 3, az tetiklenen 5 kural.' }
    ];
  } else if (pathname.startsWith('/admin/reports/ai-usage')) {
    suggestions = [
      { title: 'Maliyeti %22 azaltma fırsatı', desc: 'Bazı promptlar daha küçük modele yönlendirilebilir.' },
      { title: 'Yüksek latency tespiti', desc: 'P95 saat 14-16 arası %35 yüksek.' },
      { title: 'Halüsinasyon trendi', desc: 'Risk açıklama promptu yenilenebilir.' }
    ];
  } else if (pathname.startsWith('/admin')) {
    const pending = data.listings.filter((l) => l.status === 'review').length;
    suggestions = [
      { title: `${pending} ilan onay bekliyor`, desc: 'AI risk dağılımı + 1-tık aksiyonlar.', href: '/admin/approvals' },
      { title: 'Bu hafta 7 yeni satıcı kaydı', desc: '3\'ü KYC bekliyor.', href: '/admin/users' },
      { title: 'Fiyat anomalisi: L0042', desc: '%32 değişim.', href: '/listings/L0042' },
      { title: 'AI kullanım: 1.45M token (30g)', desc: 'Maliyet ₺1.35.', href: '/admin/reports/ai-usage' }
    ];
  } else if (pathname.startsWith('/seller/listings/new')) {
    suggestions = [
      { title: 'AI ile başlık önerisi', desc: 'Yatırımlık + Şehir + İlçe formülü +%12 tıklama.' },
      { title: 'TKGM doğrulama eksik', desc: 'Konum adımında parsel sorgusu yapılabilir.' },
      { title: 'Fiyatı bölge ortalamasına çek', desc: 'AI değerleme önerisi 2.5M ₺.' }
    ];
  } else if (pathname.startsWith('/seller')) {
    const mine = data.listings.filter((l) => l.ownerId === auth.currentUserId);
    suggestions = [
      { title: `${mine.length} ilanınızı yönetiyorsunuz`, desc: 'Yayında ' + mine.filter((l) => l.status === 'live').length + ', taslak ' + mine.filter((l) => l.status === 'draft').length, href: '/seller/listings' },
      { title: 'Bekleyen teklif: ' + data.offers.filter((o) => o.sellerId === auth.currentUserId && o.status === 'pending').length, desc: 'Otomatik yanıt için ECA kuralı kurabilirsiniz.', href: '/seller/offers' },
      { title: 'Performans özeti', desc: 'Görüntülenmeler +%12 (son 7g).', href: '/seller/performance' }
    ];
  } else if (pathname.startsWith('/listings/')) {
    suggestions = [
      { title: 'Bu ilanı favorilere ekle', desc: 'Fiyat değişikliklerinde bildirim alın.' },
      { title: 'Benzer ilanları getir', desc: 'AI öneri: aynı bölgede 6 ilan daha.' },
      { title: 'Pazarlık önerisi', desc: '%8 indirim öner ve teklif gönder.' }
    ];
  } else if (pathname === '/listings' || pathname.startsWith('/listings?')) {
    suggestions = [
      { title: 'Niyetinizi yazın', desc: '"İstanbul Beykoz 5000 m² imarlı 2.5M altı" gibi.' },
      { title: 'Aramayı kaydet + alarm', desc: 'Yeni eşleşenler için bildirim.' },
      { title: 'Harita modunda incele', desc: 'Bölgesel yoğunluğu görün.' }
    ];
  } else if (pathname === '/') {
    suggestions = [
      { title: 'Hızlı başlangıç', desc: 'Niyet çubuğuna bir bölge yazın.', href: '/listings' },
      { title: 'Satıcı olarak ilan ekle', desc: 'AI 6 adımlık sihirbazda yanınızda.', href: '/sell' },
      { title: 'Rol seçerek demo', desc: 'Buyer / Seller / Admin paneli.', href: '/auth' }
    ];
  } else if (pathname.startsWith('/account')) {
    suggestions = [
      { title: 'Profil tamamlanma %' + (me?.kycLevel === 'full' ? 100 : 60), desc: 'KYC seviyesini yükseltin.', href: '/account/profile' },
      { title: data.favorites.filter((f) => f.userId === auth.currentUserId).length + ' favori ilan', desc: 'AI benzer 5 ilan önerir.', href: '/account/favorites' },
      { title: 'Kaydedilmiş aramalar', desc: 'Alarm açık olanlardan günlük özet gelir.', href: '/account/searches' }
    ];
  } else {
    suggestions = [
      { title: 'Komut paletini açın', desc: 'Cmd+K ile niyet/komut tek alanda.' },
      { title: 'Tema ve dili tercih', desc: 'Header sağ üst köşeden.' }
    ];
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      <div className="text-[11px] uppercase tracking-wider text-fg-3 font-semibold mb-1">Bu sayfa için</div>
      {suggestions.map((s, i) => (
        <SuggestionCard key={i} title={s.title} desc={s.desc} onClick={s.href ? () => onNavigate(s.href!) : undefined} />
      ))}
    </div>
  );
}
