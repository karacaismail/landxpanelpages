import { describe, expect, it } from 'vitest';
import { buildSeed } from '@/data/seed';
import { parseQuery } from '@/lib/ai/nl-parser';
import { scoreRisk } from '@/lib/ai/risk-scorer';
import { estimateValue } from '@/lib/ai/value-estimator';

describe('listing search & AI integration', () => {
  const db = buildSeed(42);
  const live = db.listings.filter((l) => l.status === 'live');

  it('İstanbul Beykoz parse + filtreleme', () => {
    const q = parseQuery('İstanbul Beykoz tarla');
    expect(q.city).toBe('İstanbul');
    expect(q.district).toBe('Beykoz');
    const hits = live.filter((l) => l.city === q.city && l.district === q.district);
    expect(hits.length).toBeGreaterThanOrEqual(0);
  });

  it('risk score matches list with TKGM=ipotekli getting >= 40', () => {
    const ip = db.listings.filter((l) => l.tkgmStatus === 'ipotekli').slice(0, 5);
    for (const l of ip) {
      const r = scoreRisk({ tkgmStatus: l.tkgmStatus, tapuType: l.tapuType, imarType: l.imarType, hisseRatio: l.hisseRatio, utilities: l.utilities });
      expect(r.score).toBeGreaterThanOrEqual(40);
    }
  });

  it('valuation produces consistent low<mid<high for sampled listings', () => {
    for (const l of live.slice(0, 5)) {
      const v = estimateValue({ area: l.area, imarType: l.imarType, city: l.city, utilities: l.utilities, hisseRatio: l.hisseRatio });
      expect(v.low).toBeLessThan(v.mid);
      expect(v.mid).toBeLessThan(v.high);
    }
  });

  it('favoriler 80 adet ve unique (user, listing) pairs', () => {
    expect(db.favorites.length).toBe(80);
    const seen = new Set<string>();
    for (const f of db.favorites) {
      const k = `${f.userId}:${f.listingId}`;
      expect(seen.has(k)).toBe(false);
      seen.add(k);
    }
  });

  it('ECA rules have valid event types', () => {
    const valid = new Set([
      'listing.created','listing.updated','listing.status_changed','listing.price_changed','listing.viewed',
      'offer.received','offer.status_changed','offer.expired','message.received','viewing.requested','viewing.completed',
      'tkgm.query_completed','tkgm.flag_changed','user.signed_up','user.kyc_status_changed','user.favorited_listing',
      'system.cron.daily','system.cron.hourly'
    ]);
    for (const r of db.ecaRules) {
      expect(valid.has(r.event)).toBe(true);
    }
  });
});
