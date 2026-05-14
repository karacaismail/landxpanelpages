import { describe, expect, it } from 'vitest';
import { estimateValue } from '@/lib/ai/value-estimator';
import { scoreRisk } from '@/lib/ai/risk-scorer';

describe('value estimator', () => {
  it('produces ordered low<mid<high band', () => {
    const v = estimateValue({ area: 1000, imarType: 'konut', city: 'İstanbul' });
    expect(v.low).toBeLessThan(v.mid);
    expect(v.mid).toBeLessThan(v.high);
  });

  it('confidence is between 0 and 1', () => {
    const v = estimateValue({ area: 1000, imarType: 'konut', city: 'İstanbul' });
    expect(v.confidence).toBeGreaterThan(0);
    expect(v.confidence).toBeLessThan(1.01);
  });

  it('city multiplier raises price', () => {
    const a = estimateValue({ area: 1000, imarType: 'konut', city: 'İstanbul' });
    const b = estimateValue({ area: 1000, imarType: 'konut', city: 'Çanakkale' });
    expect(a.mid).toBeGreaterThan(b.mid);
  });
});

describe('risk scorer', () => {
  it('marks ipotekli as high risk', () => {
    const r = scoreRisk({ tkgmStatus: 'ipotekli', tapuType: 'mustakil', imarType: 'konut' });
    expect(r.score).toBeGreaterThanOrEqual(40);
    expect(r.reasons.length).toBeGreaterThan(0);
  });
  it('marks temiz mustakil as low risk', () => {
    const r = scoreRisk({ tkgmStatus: 'temiz', tapuType: 'mustakil', imarType: 'konut' });
    expect(r.score).toBeLessThan(30);
  });
});
