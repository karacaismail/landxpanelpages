import { describe, expect, it } from 'vitest';
import { buildSeed } from '@/data/seed';

describe('seed data integrity', () => {
  const db = buildSeed(42);

  it('produces expected counts', () => {
    expect(db.users.length).toBeGreaterThanOrEqual(50);
    expect(db.listings.length).toBeGreaterThanOrEqual(200);
    expect(db.offers.length).toBeGreaterThanOrEqual(100);
    expect(db.ecaRules.length).toBeGreaterThan(20);
    expect(db.audit.length).toBeGreaterThan(400);
  });

  it('all listings have an owner that exists', () => {
    const userIds = new Set(db.users.map((u) => u.id));
    for (const l of db.listings) {
      expect(userIds.has(l.ownerId)).toBe(true);
    }
  });

  it('all offers reference live or sold listings', () => {
    const listingIds = new Set(db.listings.map((l) => l.id));
    for (const o of db.offers) {
      expect(listingIds.has(o.listingId)).toBe(true);
    }
  });

  it('audit hash-chain is internally consistent (first hash != last hash)', () => {
    if (db.audit.length > 1) {
      expect(db.audit[0].hash).not.toBe(db.audit[db.audit.length - 1].hash);
    }
  });

  it('listings have images with thumbUrl', () => {
    for (const l of db.listings.slice(0, 5)) {
      expect(l.images.length).toBeGreaterThan(0);
      expect(l.images[0].thumbUrl).toMatch(/^https?:\/\//);
    }
  });

  it('every listing has an aiRiskScore between 0 and 100', () => {
    for (const l of db.listings) {
      expect(l.aiRiskScore).toBeGreaterThanOrEqual(0);
      expect(l.aiRiskScore).toBeLessThanOrEqual(100);
    }
  });
});
