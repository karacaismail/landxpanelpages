import { useTranslation } from 'react-i18next';
import { Funnel, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IMAR_LABELS, TKGM_LABELS, TAPU_LABELS } from '@/data/fixtures/imar-types';
import { TR_CITIES } from '@/data/fixtures/turkish-cities';
import type { ImarType, TkgmStatus, TapuType, SavedSearchFilters } from '@/types/domain';
import { cls } from '@/lib/utils/cls';

interface Props {
  value: SavedSearchFilters;
  onChange: (v: SavedSearchFilters) => void;
  onClear: () => void;
  compact?: boolean;
}

export function FilterBar({ value, onChange, onClear, compact }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const activeCount = Object.entries(value).filter(([k, v]) => k !== 'query' && (v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))).length;

  return (
    <>
      <Button
        size="sm" variant="outline"
        iconLeft={<Funnel size={16} />}
        onClick={() => setOpen(true)}
        aria-label="Filtreleri aç"
      >
        {t('discover.filters')}{activeCount > 0 ? ` (${activeCount})` : ''}
      </Button>

      {open && (
        <>
          <button className="fixed inset-0 z-40 bg-black/40" aria-label="Kapat" onClick={() => setOpen(false)} />
          <aside role="dialog" aria-label={t('discover.filters')} className="fixed z-50 right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col safe-top safe-bottom">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <Funnel size={18} />
              <div className="font-medium">{t('discover.filters')}</div>
              <button onClick={() => setOpen(false)} className="ml-auto p-2 rounded-r-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={t('actions.close')}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <Group label="Şehir">
                <select
                  value={value.city || ''}
                  onChange={(e) => onChange({ ...value, city: e.target.value || undefined, district: undefined })}
                  className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]"
                >
                  <option value="">Tümü</option>
                  {TR_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </Group>
              {value.city && (
                <Group label="İlçe">
                  <select
                    value={value.district || ''}
                    onChange={(e) => onChange({ ...value, district: e.target.value || undefined })}
                    className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]"
                  >
                    <option value="">Tümü</option>
                    {(TR_CITIES.find((c) => c.name === value.city)?.districts || []).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Group>
              )}
              <Group label="Fiyat aralığı (₺)">
                <div className="grid grid-cols-2 gap-2">
                  <NumInput placeholder="Min" v={value.minPrice} on={(n) => onChange({ ...value, minPrice: n })} />
                  <NumInput placeholder="Max" v={value.maxPrice} on={(n) => onChange({ ...value, maxPrice: n })} />
                </div>
              </Group>
              <Group label="Alan (m²)">
                <div className="grid grid-cols-2 gap-2">
                  <NumInput placeholder="Min" v={value.minArea} on={(n) => onChange({ ...value, minArea: n })} />
                  <NumInput placeholder="Max" v={value.maxArea} on={(n) => onChange({ ...value, maxArea: n })} />
                </div>
              </Group>
              <Group label="İmar">
                <ChipSelect<ImarType>
                  options={Object.entries(IMAR_LABELS).map(([v, l]) => ({ value: v as ImarType, label: l.tr }))}
                  value={value.imarType}
                  onChange={(v) => onChange({ ...value, imarType: v })}
                />
              </Group>
              <Group label="Tapu">
                <ChipSelect<TapuType>
                  options={Object.entries(TAPU_LABELS).map(([v, l]) => ({ value: v as TapuType, label: l.tr }))}
                  value={value.tapuType}
                  onChange={(v) => onChange({ ...value, tapuType: v })}
                />
              </Group>
              <Group label="TKGM">
                <ChipSelect<TkgmStatus>
                  options={Object.entries(TKGM_LABELS).map(([v, l]) => ({ value: v as TkgmStatus, label: l.tr }))}
                  value={value.tkgmStatus}
                  onChange={(v) => onChange({ ...value, tkgmStatus: v })}
                />
              </Group>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex gap-2">
              <Button variant="outline" block onClick={() => { onClear(); }}>{t('discover.clearFilters')}</Button>
              <Button block onClick={() => setOpen(false)}>{t('actions.submit')}</Button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-fg-3 mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function ChipSelect<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T | undefined; onChange: (v: T | undefined) => void; }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(value === o.value ? undefined : o.value)}
          className={cls(
            'rounded-full px-3 py-1 text-xs border min-h-[32px]',
            value === o.value
              ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200'
              : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NumInput({ v, on, placeholder }: { v: number | undefined; on: (n: number | undefined) => void; placeholder: string }) {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={v ?? ''}
      onChange={(e) => on(e.target.value ? Number(e.target.value) : undefined)}
      className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]"
    />
  );
}
