import { create } from 'zustand';
import { buildSeed, type SeededDB } from '@/data/seed';
import type { Listing, EcaRule, Notification, Favorite, Offer, Thread, Message, Viewing, SavedSearch, TkgmQuery, AuditEvent } from '@/types/domain';

interface DataState extends SeededDB {
  ready: boolean;
  // CRUD (in-memory)
  upsertListing: (l: Listing) => void;
  removeListing: (id: string) => void;
  setListingStatus: (id: string, status: Listing['status']) => void;
  upsertOffer: (o: Offer) => void;
  addMessage: (m: Message) => void;
  toggleFavorite: (userId: string, listingId: string) => void;
  upsertSavedSearch: (s: SavedSearch) => void;
  removeSavedSearch: (id: string) => void;
  upsertViewing: (v: Viewing) => void;
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  upsertRule: (r: EcaRule) => void;
  toggleRule: (id: string) => void;
  removeRule: (id: string) => void;
  recordAudit: (e: AuditEvent) => void;
  recordTkgm: (q: TkgmQuery) => void;
}

const initial = buildSeed(42);

export const useData = create<DataState>((set, get) => ({
  ...initial,
  ready: true,

  upsertListing: (l) => set((s) => ({ listings: replaceOrAppend(s.listings, l) })),
  removeListing: (id) => set((s) => ({ listings: s.listings.filter((x) => x.id !== id) })),
  setListingStatus: (id, status) => set((s) => ({
    listings: s.listings.map((l) => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l)
  })),

  upsertOffer: (o) => set((s) => ({ offers: replaceOrAppend(s.offers, o) })),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),

  toggleFavorite: (userId, listingId) => set((s) => {
    const existing = s.favorites.find((f) => f.userId === userId && f.listingId === listingId);
    if (existing) return { favorites: s.favorites.filter((f) => !(f.userId === userId && f.listingId === listingId)) };
    return { favorites: [...s.favorites, { userId, listingId, createdAt: new Date().toISOString() }] };
  }),

  upsertSavedSearch: (search) => set((s) => ({ savedSearches: replaceOrAppend(s.savedSearches, search) })),
  removeSavedSearch: (id) => set((s) => ({ savedSearches: s.savedSearches.filter((x) => x.id !== id) })),

  upsertViewing: (v) => set((s) => ({ viewings: replaceOrAppend(s.viewings, v) })),

  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsRead: (userId) => set((s) => ({
    notifications: s.notifications.map((n) => n.userId === userId ? { ...n, read: true } : n)
  })),

  upsertRule: (r) => set((s) => ({ ecaRules: replaceOrAppend(s.ecaRules, r) })),
  toggleRule: (id) => set((s) => ({
    ecaRules: s.ecaRules.map((r) => r.id === id ? { ...r, enabled: !r.enabled, updatedAt: new Date().toISOString() } : r)
  })),
  removeRule: (id) => set((s) => ({ ecaRules: s.ecaRules.filter((r) => r.id !== id) })),

  recordAudit: (e) => set((s) => ({ audit: [e, ...s.audit] })),
  recordTkgm: (q) => set((s) => ({ tkgmQueries: [q, ...s.tkgmQueries] }))
}));

function replaceOrAppend<T extends { id: string }>(arr: T[], item: T): T[] {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i >= 0) { const copy = arr.slice(); copy[i] = item; return copy; }
  return [...arr, item];
}
