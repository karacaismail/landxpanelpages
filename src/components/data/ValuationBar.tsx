import { useTranslation } from 'react-i18next';
import { Sparkle } from '@phosphor-icons/react';
import type { ListingValuation } from '@/types/domain';
import { formatPrice, compactNumber } from '@/lib/utils/format';

interface Props {
  valuation: ListingValuation;
  currentPrice: number;
}

export function ValuationBar({ valuation, currentPrice }: Props) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const span = Math.max(1, valuation.high - valuation.low);
  const percent = Math.max(0, Math.min(100, ((currentPrice - valuation.low) / span) * 100));
  const verdict = currentPrice <= valuation.low ? 'Pazarlık üstü iyi'
                : currentPrice <= valuation.mid ? 'Bölge ortalamasına yakın'
                : currentPrice <= valuation.high ? 'Üst banda yakın'
                : 'Banttan yüksek';
  return (
    <div className="rounded-r-3 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30 dark:to-transparent p-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-medium">
          <Sparkle size={16} weight="fill" className="text-brand-500" />
          {t('listing.valuation')}
        </div>
        <div className="text-xs text-fg-3">{t('listing.confidence')}: %{Math.round(valuation.confidence * 100)}</div>
      </div>
      <div className="mt-3 relative">
        <div className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-300" />
        <div
          className="absolute -top-1 w-3 h-4 rounded-sm bg-fg-1 shadow"
          style={{ left: `calc(${percent}% - 6px)` }}
          aria-label={`Geçerli fiyat: ${formatPrice(currentPrice, locale)}`}
          title={formatPrice(currentPrice, locale)}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-fg-3">
        <div>
          <div>{t('listing.low')}</div>
          <div className="font-medium text-fg-1">{compactNumber(valuation.low, locale)} ₺</div>
        </div>
        <div className="text-center">
          <div>{t('listing.mid')}</div>
          <div className="font-medium text-fg-1">{compactNumber(valuation.mid, locale)} ₺</div>
        </div>
        <div className="text-right">
          <div>{t('listing.high')}</div>
          <div className="font-medium text-fg-1">{compactNumber(valuation.high, locale)} ₺</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-brand-700 dark:text-brand-300">{verdict}</div>
    </div>
  );
}
