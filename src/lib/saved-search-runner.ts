// Saved-search alert demo: kullanıcı oturum açtığında 60-90 saniyede bir
// "yeni eşleşme" toast'u atar (mock). Toggle: localStorage'da disable.

import { toast } from '@/store/toast';
import type { SavedSearch } from '@/types/domain';

let timer: ReturnType<typeof setInterval> | null = null;
const SETTINGS_KEY = 'landx:savedSearchAlerts';

export function setSavedSearchAlerts(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEY, enabled ? '1' : '0');
}
export function getSavedSearchAlertsEnabled(): boolean {
  return localStorage.getItem(SETTINGS_KEY) !== '0';
}

interface Args {
  userId: string;
  searches: SavedSearch[];
  navigate: (href: string) => void;
}

export function startSavedSearchRunner({ userId, searches, navigate }: Args): () => void {
  if (timer) clearInterval(timer);
  if (!getSavedSearchAlertsEnabled()) return () => {};
  const mine = searches.filter((s) => s.userId === userId && s.alertEnabled);
  if (mine.length === 0) return () => {};

  // İlk toast 25-40sn sonra; sonra 80sn aralıklarla
  const firstId = setTimeout(() => tick(mine, navigate), 25000 + Math.random() * 15000);
  timer = setInterval(() => {
    if (!getSavedSearchAlertsEnabled()) return;
    tick(mine, navigate);
  }, 80000);
  return () => { clearTimeout(firstId); if (timer) { clearInterval(timer); timer = null; } };
}

function tick(searches: SavedSearch[], navigate: (href: string) => void): void {
  const s = searches[Math.floor(Math.random() * searches.length)];
  const newMatches = 1 + Math.floor(Math.random() * 4);
  toast(
    'ai',
    `Aramanıza ${newMatches} yeni eşleşme`,
    `"${s.name}" — son 1 saatte yeni ilan(lar) yayınlandı.`,
    { label: 'Aç', onRun: () => navigate('/account/searches') }
  );
}
