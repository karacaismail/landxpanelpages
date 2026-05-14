import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UiState {
  theme: Theme;
  sidebarCollapsed: boolean;
  assistantOpen: boolean;
  paletteOpen: boolean;
  notifOpen: boolean;
  mobileNavOpen: boolean;
  setTheme: (t: Theme) => void;
  toggleSidebar: () => void;
  toggleAssistant: () => void;
  setAssistant: (v: boolean) => void;
  setPalette: (v: boolean) => void;
  togglePalette: () => void;
  setNotif: (v: boolean) => void;
  setMobileNav: (v: boolean) => void;
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const sys = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const effective = theme === 'system' ? sys : theme;
  document.documentElement.setAttribute('data-theme', effective);
  document.documentElement.classList.toggle('dark', effective === 'dark');
}

export const useUi = create<UiState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarCollapsed: false,
      assistantOpen: false,
      paletteOpen: false,
      notifOpen: false,
      mobileNavOpen: false,
      setTheme: (theme) => { applyTheme(theme); set({ theme }); },
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      toggleAssistant: () => set({ assistantOpen: !get().assistantOpen }),
      setAssistant: (v) => set({ assistantOpen: v }),
      setPalette: (v) => set({ paletteOpen: v }),
      togglePalette: () => set({ paletteOpen: !get().paletteOpen }),
      setNotif: (v) => set({ notifOpen: v }),
      setMobileNav: (v) => set({ mobileNavOpen: v })
    }),
    { name: 'landx:ui' }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  const stored = JSON.parse(localStorage.getItem('landx:ui') || '{}');
  applyTheme(stored.state?.theme || 'system');
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useUi.getState().theme === 'system') applyTheme('system');
  });
}
