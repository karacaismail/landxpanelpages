import { useMemo, useState, ReactNode } from 'react';
import { cls } from '@/lib/utils/cls';
import { Button } from '@/components/ui/Button';
import { CaretDown, CaretUp, MagnifyingGlass, DownloadSimple, Sparkle } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => unknown;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
  hideOn?: 'xs' | 'sm' | 'md' | 'lg';
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  bulkActions?: Array<{ label: string; onRun: (rows: T[]) => void; tone?: 'default' | 'danger' }>;
  aiSuggestions?: Array<{ label: string; onRun: () => void }>;
  pageSize?: number;
  empty?: ReactNode;
}

export function DataTable<T>({ data, columns, rowKey, onRowClick, searchable, searchPlaceholder, bulkActions, aiSuggestions, pageSize = 20, empty }: Props<T>) {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const nq = q.toLocaleLowerCase('tr-TR');
    return data.filter((row) => {
      return columns.some((c) => {
        const v = c.accessor ? c.accessor(row) : (row as Record<string, unknown>)[c.key as string];
        return String(v ?? '').toLocaleLowerCase('tr-TR').includes(nq);
      });
    });
  }, [data, q, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    const get = (row: T) => col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[sortKey as string];
    return [...filtered].sort((a, b) => {
      const va = get(a); const vb = get(b);
      if (va === vb) return 0;
      if (va == null) return 1; if (vb == null) return -1;
      const r = (va as number | string) < (vb as number | string) ? -1 : 1;
      return sortDir === 'asc' ? r : -r;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const slice = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  function toggle(key: string) {
    const s = new Set(selected);
    s.has(key) ? s.delete(key) : s.add(key);
    setSelected(s);
  }
  function toggleAll() {
    if (selected.size === slice.length) setSelected(new Set());
    else setSelected(new Set(slice.map(rowKey)));
  }

  const selectedRows = sorted.filter((r) => selected.has(rowKey(r)));

  function exportCsv() {
    const headers = columns.map((c) => c.header).join(',');
    const rows = sorted.map((r) => columns.map((c) => {
      const v = c.accessor ? c.accessor(r) : (r as Record<string, unknown>)[c.key as string];
      return `"${String(v ?? '').replaceAll('"', '""')}"`;
    }).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `landx-export-${Date.now()}.csv`; a.click();
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {searchable && (
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(0); }}
              placeholder={searchPlaceholder || t('actions.search')}
              className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm min-h-[40px]"
              aria-label={t('actions.search')}
            />
          </div>
        )}
        {aiSuggestions && aiSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {aiSuggestions.map((s, i) => (
              <Button key={i} size="sm" variant="outline" iconLeft={<Sparkle size={14} weight="fill" className="text-brand-500" />} onClick={s.onRun}>{s.label}</Button>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2 text-sm text-fg-3">
          <span>{sorted.length} kayıt</span>
          <Button size="sm" variant="outline" iconLeft={<DownloadSimple size={14} />} onClick={exportCsv}>{t('actions.export')}</Button>
        </div>
      </div>

      {/* Bulk action bar */}
      {bulkActions && selectedRows.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-r-3 p-2 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800">
          <span className="text-sm font-medium text-brand-800 dark:text-brand-200 px-2">{selectedRows.length} seçili</span>
          {bulkActions.map((a) => (
            <Button key={a.label} size="sm" variant={a.tone === 'danger' ? 'danger' : 'secondary'} onClick={() => a.onRun(selectedRows)}>{a.label}</Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>{t('actions.deselectAll')}</Button>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3">
              {bulkActions && (
                <th className="w-10 px-3 py-2">
                  <input type="checkbox" checked={selectedRows.length === slice.length && slice.length > 0} onChange={toggleAll} aria-label={t('actions.selectAll')} />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={cls('text-left px-3 py-2 font-medium', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center', c.hideOn && c.hideOn === 'lg' && 'hidden xl:table-cell', c.hideOn === 'md' && 'hidden lg:table-cell', c.hideOn === 'sm' && 'hidden md:table-cell')}
                >
                  <button
                    disabled={!c.sortable}
                    onClick={() => {
                      if (!c.sortable) return;
                      if (sortKey === c.key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                      else { setSortKey(String(c.key)); setSortDir('asc'); }
                    }}
                    className={cls('inline-flex items-center gap-1', c.sortable && 'hover:text-fg-1')}
                  >
                    {c.header}
                    {c.sortable && sortKey === c.key && (sortDir === 'asc' ? <CaretUp size={12} /> : <CaretDown size={12} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr><td colSpan={(bulkActions ? 1 : 0) + columns.length} className="text-center py-12 text-fg-3">{empty || 'Kayıt yok'}</td></tr>
            ) : (
              slice.map((r) => (
                <tr
                  key={rowKey(r)}
                  className={cls('border-b border-slate-100 dark:border-slate-800 last:border-0', onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800')}
                  onClick={onRowClick ? () => onRowClick(r) : undefined}
                >
                  {bulkActions && (
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.has(rowKey(r))} onChange={() => toggle(rowKey(r))} aria-label="Satır seç" />
                    </td>
                  )}
                  {columns.map((c) => {
                    const v = c.accessor ? c.accessor(r) : (r as Record<string, unknown>)[c.key as string];
                    return (
                      <td
                        key={String(c.key)}
                        className={cls('px-3 py-2 align-middle', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center', c.hideOn && c.hideOn === 'lg' && 'hidden xl:table-cell', c.hideOn === 'md' && 'hidden lg:table-cell', c.hideOn === 'sm' && 'hidden md:table-cell')}
                      >
                        {c.cell ? c.cell(r) : (v as ReactNode) ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {slice.length === 0 ? (
          <div className="text-center py-10 text-fg-3 text-sm">{empty || 'Kayıt yok'}</div>
        ) : (
          slice.map((r) => (
            <div key={rowKey(r)} onClick={() => onRowClick?.(r)} className={cls('rounded-r-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3', onRowClick && 'cursor-pointer hover:shadow-sm')}>
              {bulkActions && (
                <div className="flex items-center gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(rowKey(r))} onChange={() => toggle(rowKey(r))} />
                  <span className="text-xs text-fg-3">Seç</span>
                </div>
              )}
              {columns.map((c) => {
                const v = c.accessor ? c.accessor(r) : (r as Record<string, unknown>)[c.key as string];
                return (
                  <div key={String(c.key)} className="flex items-center justify-between gap-2 py-1 text-sm">
                    <span className="text-fg-3 text-xs uppercase tracking-wider">{c.header}</span>
                    <span className="text-right">{c.cell ? c.cell(r) : (v as ReactNode) ?? '—'}</span>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="text-fg-3">Sayfa {safePage + 1} / {totalPages}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>‹</Button>
            <Button size="sm" variant="outline" disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)}>›</Button>
          </div>
        </div>
      )}
    </div>
  );
}
