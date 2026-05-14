import { mulberry32 } from '@/lib/utils/random';
import { generateUsers } from './generators/users';
import { generateListings } from './generators/listings';
import {
  generateOffers, generateThreadsAndMessages, generateViewings,
  generateFavorites, generateSavedSearches, generateNotifications
} from './generators/social';
import { buildSeedEcaRules } from './generators/eca-rules';
import { generateAudit } from './generators/audit';
import { generateTkgmQueries } from './generators/tkgm';
import type {
  User, Listing, Offer, Thread, Message, Viewing, Favorite,
  SavedSearch, Notification, EcaRule, AuditEvent, TkgmQuery
} from '@/types/domain';

export interface SeededDB {
  users: User[];
  listings: Listing[];
  offers: Offer[];
  threads: Thread[];
  messages: Message[];
  viewings: Viewing[];
  favorites: Favorite[];
  savedSearches: SavedSearch[];
  notifications: Notification[];
  ecaRules: EcaRule[];
  audit: AuditEvent[];
  tkgmQueries: TkgmQuery[];
}

let cached: SeededDB | null = null;

export function buildSeed(seed = 42): SeededDB {
  if (cached) return cached;
  const rand = mulberry32(seed);

  const users = generateUsers(seed, rand, 60);
  const listings = generateListings(rand, users, 220);
  const offers = generateOffers(rand, listings, users, 120);
  const { threads, messages } = generateThreadsAndMessages(rand, listings, users);
  const viewings = generateViewings(rand, listings, users, 35);
  const favorites = generateFavorites(rand, listings, users, 80);
  const savedSearches = generateSavedSearches(rand, users, 22);
  const notifications = generateNotifications(rand, users, 140);
  const ecaRules = buildSeedEcaRules(users.find((u) => u.roles.includes('admin'))?.id || users[0].id);
  const audit = generateAudit(rand, users, listings, 500);
  const tkgmQueries = generateTkgmQueries(rand, users, listings, 60);

  cached = {
    users, listings, offers, threads, messages, viewings, favorites,
    savedSearches, notifications, ecaRules, audit, tkgmQueries
  };
  return cached;
}
