import { describe, expect, it } from 'vitest';
import { mulberry32, pick, pickMany, range, clamp, gaussian } from '@/lib/utils/random';

describe('random utilities', () => {
  it('mulberry32 is deterministic for same seed', () => {
    const r1 = mulberry32(42);
    const r2 = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      expect(r1()).toBe(r2());
    }
  });

  it('different seeds produce different sequences', () => {
    const r1 = mulberry32(1);
    const r2 = mulberry32(2);
    const seq1 = Array.from({ length: 10 }, () => r1());
    const seq2 = Array.from({ length: 10 }, () => r2());
    expect(seq1).not.toEqual(seq2);
  });

  it('pick returns an element from array', () => {
    const r = mulberry32(42);
    const arr = ['a', 'b', 'c'];
    const v = pick(arr, r);
    expect(arr).toContain(v);
  });

  it('pickMany returns at most max items, no duplicates', () => {
    const r = mulberry32(42);
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const out = pickMany(arr, 2, 3, r);
    expect(out.length).toBeGreaterThanOrEqual(2);
    expect(out.length).toBeLessThanOrEqual(3);
    expect(new Set(out).size).toBe(out.length);
  });

  it('clamp constrains value', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('range produces correct length', () => {
    expect(range(5, (i) => i * 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it('gaussian returns a finite number', () => {
    const r = mulberry32(42);
    const v = gaussian(r);
    expect(Number.isFinite(v)).toBe(true);
  });
});
