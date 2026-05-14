import { create } from 'zustand';
import type { AiMessage } from '@/types/domain';
import { nanoid } from 'nanoid';

interface AiState {
  history: AiMessage[];
  thinking: boolean;
  appendUser: (text: string, context?: string) => string;
  appendAssistant: (text: string, context?: string) => string;
  setThinking: (v: boolean) => void;
  reset: () => void;
}

export const useAi = create<AiState>((set) => ({
  history: [],
  thinking: false,
  appendUser: (text, context) => {
    const id = nanoid(8);
    set((s) => ({ history: [...s.history, { id, role: 'user', content: text, createdAt: new Date().toISOString(), context }] }));
    return id;
  },
  appendAssistant: (text, context) => {
    const id = nanoid(8);
    set((s) => ({ history: [...s.history, { id, role: 'assistant', content: text, createdAt: new Date().toISOString(), context }] }));
    return id;
  },
  setThinking: (v) => set({ thinking: v }),
  reset: () => set({ history: [] })
}));
