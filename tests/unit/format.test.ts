import { describe, expect, it } from 'vitest';
import { formatPrice, formatArea, formatNumber, compactNumber, slug, formatRelTime } from '@/lib/utils/format';

describe('format utilities', () => {
  it('formatPrice TR uses ₺ symbol', () => {
    const out = formatPrice(1_234_567, 'tr');
    expect(out).toMatch(/₺/);
    // Türkçe binlik ayırıcı nokta
    expect(out).toContain('1.234.567');
  });

  it('formatPrice EN uses $', () => {
    expect(formatPrice(1000, 'en')).toMatch(/\$/);
  });

  it('formatArea adds m² suffix', () => {
    expect(formatArea(2500, 'tr')).toBe('2.500 m²');
  });

  it('formatNumber uses TR locale', () => {
    expect(formatNumber(1234567, 'tr')).toBe('1.234.567');
  });

  it('compactNumber yields short form', () => {
    expect(compactNumber(1_500_000, 'tr')).toMatch(/Mn|M/);
  });

  it('slug converts Turkish chars and lowercases', () => {
    expect(slug('İstanbul Beykoz Çamlık')).toBe('istanbul-beykoz-camlik');
  });

  it('slug strips non-alnum and trims hyphens', () => {
    expect(slug('  Hello, World!  ')).toBe('hello-world');
  });

  it('formatRelTime returns human-readable string', () => {
    const now = new Date().toISOString();
    const result = formatRelTime(now, 'tr');
    // "şimdi" or similar — just confirm it returns a non-empty string
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});
