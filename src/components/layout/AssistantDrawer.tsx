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
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <SuggestionCard title="Onaylanmamış 12 ilan bekliyor" desc="AI risk skorları: 3 yüksek, 5 orta, 4 düşük. Düşük olanları toplu onaylayalım mı?" onClick={() => { ui.setAssistant(false); navigate('/admin/approvals'); }} />
            <SuggestionCard title="Bu hafta 7 yeni satıcı kaydı" desc="3'ü KYC bekliyor. Otomatik hatırlatma kuralı aktif." />
            <SuggestionCard title="Fiyat anomalisi tespit edildi" desc="L0042 ilanında +%32 değişim. Görüntüle?" onClick={() => { ui.setAssistant(false); navigate('/listings/L0042'); }} />
            <SuggestionCard title="Demo data üretildi" desc={`${data.listings.length} ilan, ${data.users.length} kullanıcı, ${data.ecaRules.length} ECA kuralı yüklendi.`} />
          </div>
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
