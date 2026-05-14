import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger' | 'ai';

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  body?: string;
  action?: { label: string; onRun: () => void };
  durationMs?: number;
  createdAt: number;
}

interface ToastState {
  items: Toast[];
  show: (t: Omit<Toast, 'id' | 'createdAt'>) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useToast = create<ToastState>((set, get) => ({
  items: [],
  show: (t) => {
    const id = nanoid(8);
    const toast: Toast = { ...t, id, createdAt: Date.now(), durationMs: t.durationMs ?? 4500 };
    set((s) => ({ items: [...s.items, toast] }));
    if (toast.durationMs && toast.durationMs > 0) {
      setTimeout(() => get().dismiss(id), toast.durationMs);
    }
    return id;
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
  clear: () => set({ items: [] })
}));

// Helper shortcut
export function toast(tone: ToastTone, title: string, body?: string, action?: Toast['action']): string {
  return useToast.getState().show({ tone, title, body, action });
}
