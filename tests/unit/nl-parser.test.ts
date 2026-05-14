import { describe, expect, it } from 'vitest';
import { parseQuery } from '@/lib/ai/nl-parser';

describe('nl-parser', () => {
  it('parses city and imar', () => {
    const p = parseQuery('İstanbul Beykoz konut imarlı');
    expect(p.city).toBe('İstanbul');
    expect(p.district).toBe('Beykoz');
    expect(p.imarType).toBe('konut');
  });

  it('parses million price', () => {
    const p = parseQuery('5 milyon altı');
    expect(p.maxPrice).toBe(5_000_000);
  });

  it('parses area', () => {
    const p = parseQuery('5000 m² arsa');
    expect(p.minArea).toBeGreaterThan(0);
  });

  it('detects feature deniz manzaralı', () => {
    const p = parseQuery('Çanakkale deniz manzaralı tarla');
    expect(p.features).toContain('Deniz manzaralı');
  });
});
