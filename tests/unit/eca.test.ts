import { describe, expect, it } from 'vitest';
import { evaluate } from '@/lib/eca/engine';
import { buildSeedEcaRules } from '@/data/generators/eca-rules';

describe('ECA engine', () => {
  const rules = buildSeedEcaRules('u-admin');

  it('matches TKGM ipotekli rule on listing.created', () => {
    const res = evaluate('listing.created', { tkgmStatus: 'ipotekli' }, rules);
    expect(res.matched.length).toBeGreaterThan(0);
    expect(res.emitted.some((a) => a.type === 'flag.review')).toBe(true);
  });

  it('does not match on different event', () => {
    const res = evaluate('listing.viewed', { tkgmStatus: 'ipotekli' }, rules);
    // Should not trigger TKGM rule (it's for listing.created)
    const tkgmRule = res.matched.find((m) => m.ruleName.includes('TKGM ipotekli'));
    expect(tkgmRule).toBeUndefined();
  });

  it('respects enabled=false', () => {
    const turnedOff = rules.map((r) => ({ ...r, enabled: false }));
    const res = evaluate('listing.created', { tkgmStatus: 'ipotekli' }, turnedOff);
    expect(res.matched.length).toBe(0);
  });

  it('evaluates numeric gt condition', () => {
    const res = evaluate('listing.price_changed', { priceChangePct: 25 }, rules);
    expect(res.matched.some((m) => m.ruleName.includes('Fiyat anomalisi'))).toBe(true);
  });
});
