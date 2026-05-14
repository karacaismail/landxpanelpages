import '@testing-library/jest-dom/vitest';

// Mock localStorage for environments that don't have it
if (!('localStorage' in globalThis)) {
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = String(v); },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
    }
  });
}
