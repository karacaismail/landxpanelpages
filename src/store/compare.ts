import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => { const ids = get().ids; if (ids.includes(id) || ids.length >= 4) return; set({ ids: [...ids, id] }); },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id)
    }),
    { name: 'landx:compare' }
  )
);
