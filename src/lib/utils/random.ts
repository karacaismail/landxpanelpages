// Seedable RNG (Mulberry32) — deterministik demo data için.

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function pickMany<T>(arr: readonly T[], min: number, max: number, rand: () => number): T[] {
  const n = min + Math.floor(rand() * (max - min + 1));
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function range(n: number, mapFn: (i: number) => number): number[] {
  return Array.from({ length: n }, (_, i) => mapFn(i));
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function gaussian(rand: () => number, mean = 0, std = 1): number {
  // Box-Muller
  const u1 = rand() || 1e-9;
  const u2 = rand() || 1e-9;
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * std + mean;
}
