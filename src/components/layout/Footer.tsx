import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUi } from '@/store/ui';
import { Sparkle, CircleDashed } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

interface Props { compact?: boolean; }

export function Footer({ compact }: Props) {
  const { t } = useTranslation();
  const ui = useUi();
  return (
    <footer className={cls('border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 mt-8', compact && 'mt-4')}>
      <div className={cls('max-w-[1600px] mx-auto px-4 lg:px-6 py-6 lg:py-10 grid gap-6', compact ? 'lg:py-4' : 'lg:grid-cols-4')}>
        {!compact && (
          <>
            <div>
              <div className="font-semibold text-fg-1 mb-2">LandX</div>
              <p className="text-sm text-fg-3">AI-first arsa pazaryeri. TKGM doğrulamalı, risk skoru ile şeffaf.</p>
            </div>
            <FooterCol title="Keşfet">
              <FLink to="/listings">{t('nav.discover')}</FLink>
              <FLink to="/compare">{t('nav.compare')}</FLink>
              <FLink to="/sell">{t('nav.sell')}</FLink>
            </FooterCol>
            <FooterCol title="Hesap">
              <FLink to="/auth">{t('nav.auth')}</FLink>
              <FLink to="/account">{t('nav.account')}</FLink>
              <FLink to="/help">{t('nav.help')}</FLink>
            </FooterCol>
            <FooterCol title="Yasal">
              <FLink to="/legal/kvkk">{t('footer.kvkk')}</FLink>
              <FLink to="/legal/terms">{t('footer.terms')}</FLink>
              <FLink to="/legal/cookies">{t('footer.cookies')}</FLink>
              <FLink to="/legal/accessibility">{t('footer.accessibility')}</FLink>
              <FLink to="/legal/ai">{t('footer.ai')}</FLink>
            </FooterCol>
          </>
        )}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center gap-3 text-xs text-fg-3">
          <span className="inline-flex items-center gap-1">
            <Sparkle size={12} weight="fill" className="text-brand-500" />
            AI bağlı
          </span>
          <span className="inline-flex items-center gap-1">
            <CircleDashed size={12} weight="bold" />
            Son senkron: az önce
          </span>
          <span>Ortam: Demo · v0.1.0</span>
          <a href="https://github.com/karacaismail/landxpanelpages" target="_blank" rel="noopener noreferrer" className="hover:text-fg-1 underline-offset-2 hover:underline">GitHub</a>
          <span className="ml-auto">© {new Date().getFullYear()} LandX. {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-fg-2 uppercase tracking-wider mb-2">{title}</div>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link className="text-sm text-fg-3 hover:text-fg-1 transition-colors" to={to}>{children}</Link>
    </li>
  );
}
