const fmtTRY = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const fmtNum = new Intl.NumberFormat('tr-TR');
const fmtNumEn = new Intl.NumberFormat('en-US');
const fmtUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function formatPrice(amount: number, locale: 'tr' | 'en' = 'tr'): string {
  return locale === 'tr' ? fmtTRY.format(amount) : fmtUsd.format(amount);
}

export function formatNumber(n: number, locale: 'tr' | 'en' = 'tr'): string {
  return locale === 'tr' ? fmtNum.format(n) : fmtNumEn.format(n);
}

export function formatArea(m2: number, locale: 'tr' | 'en' = 'tr'): string {
  return `${formatNumber(m2, locale)} m²`;
}

export function formatRelTime(iso: string, locale: 'tr' | 'en' = 'tr'): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.round((t - now) / 1000);
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (abs < 60) return rtf.format(diff, 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), 'month');
  return rtf.format(Math.round(diff / (86400 * 365)), 'year');
}

export function formatDate(iso: string, locale: 'tr' | 'en' = 'tr'): string {
  return new Date(iso).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function formatDateTime(iso: string, locale: 'tr' | 'en' = 'tr'): string {
  return new Date(iso).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function slug(s: string): string {
  return s.toLocaleLowerCase('tr-TR')
    .replaceAll('ç', 'c').replaceAll('ğ', 'g').replaceAll('ı', 'i')
    .replaceAll('ö', 'o').replaceAll('ş', 's').replaceAll('ü', 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function compactNumber(n: number, locale: 'tr' | 'en' = 'tr'): string {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { notation: 'compact' }).format(n);
}
