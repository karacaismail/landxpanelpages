/* LandX Domain Types — tek kaynak, tüm modüller buna referans verir. */

export type Role = 'guest' | 'buyer' | 'seller' | 'admin' | 'moderator';
export type PrincipalType = 'individual' | 'org' | 'agent' | 'system';
export type KycLevel = 'none' | 'phone' | 'email' | 'identity' | 'full';
export type Locale = 'tr' | 'en';

export interface User {
  id: string;
  principalType: PrincipalType;
  displayName: string;
  email: string;
  phone: string;
  fullName: string;
  avatarUrl: string;
  locale: Locale;
  timezone: string;
  kycLevel: KycLevel;
  status: 'active' | 'suspended' | 'archived';
  roles: Role[];
  organization?: { id: string; name: string };
  createdAt: string;
  lastSeenAt: string;
  preferences: {
    notifyEmail: boolean;
    notifySms: boolean;
    notifyPush: boolean;
    aiAssistantDefault: 'auto' | 'minimal' | 'off';
    theme: 'light' | 'dark' | 'system';
    locale: Locale;
  };
  rating: number;
  vipScore: number;
  city?: string;
  bio?: string;
}

export type ListingStatus = 'draft' | 'review' | 'live' | 'sold' | 'rejected' | 'expired';
export type TapuType = 'mustakil' | 'hisseli' | 'kat_irtifaki' | 'arsa_tapulu' | 'tarla_tapulu';
export type TkgmStatus = 'temiz' | 'ipotekli' | 'serh' | 'tedbir' | 'bilinmiyor';
export type ImarType = 'konut' | 'tarim' | 'ticari' | 'sanayi' | 'turizm' | 'zeytinlik' | 'imarsiz' | 'karma';

export interface ListingImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  order: number;
}

export interface ListingValuation {
  low: number;
  mid: number;
  high: number;
  confidence: number;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  status: ListingStatus;
  city: string;
  district: string;
  neighborhood: string;
  ada?: string;
  parsel?: string;
  pafta?: string;
  lat: number;
  lng: number;
  area: number;
  price: number;
  currency: 'TRY';
  pricePerM2: number;
  tapuType: TapuType;
  tkgmStatus: TkgmStatus;
  imarType: ImarType;
  hisseRatio?: number;
  utilities: {
    road: boolean;
    electricity: boolean;
    water: boolean;
    gas: boolean;
    internet: boolean;
  };
  features: string[];
  images: ListingImage[];
  videoUrl?: string;
  publishedAt?: string;
  expiresAt?: string;
  views: number;
  messageCount: number;
  offerCount: number;
  favoriteCount: number;
  aiSummary: string;
  aiTags: string[];
  aiRiskScore: number;
  aiRiskReasons: string[];
  aiValuation: ListingValuation;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus = 'pending' | 'countered' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

export interface OfferHistoryEntry {
  at: string;
  by: string;
  amount: number;
  note?: string;
  status: OfferStatus;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  message?: string;
  status: OfferStatus;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  history: OfferHistoryEntry[];
}

export interface Thread {
  id: string;
  participantIds: string[];
  listingId?: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
  topic?: string;
}

export type AiTone = 'neutral' | 'friendly' | 'firm' | 'apologetic';

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  aiTone?: AiTone;
  aiSuggestedReplies?: string[];
  attachments?: Array<{ id: string; url: string; type: 'image' | 'doc' }>;
  createdAt: string;
  readBy: string[];
}

export type ViewingStatus = 'requested' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface Viewing {
  id: string;
  listingId: string;
  visitorId: string;
  sellerId: string;
  scheduledAt: string;
  status: ViewingStatus;
  note?: string;
}

export interface Favorite {
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface SavedSearchFilters {
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  imarType?: ImarType;
  tkgmStatus?: TkgmStatus;
  tapuType?: TapuType;
  features?: string[];
  query?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SavedSearchFilters;
  alertEnabled: boolean;
  matchCount: number;
  createdAt: string;
}

export type NotifChannel = 'in_app' | 'email' | 'sms' | 'push';
export type NotifPriority = 'now' | 'soon' | 'later';

export interface Notification {
  id: string;
  userId: string;
  channel: NotifChannel;
  priority: NotifPriority;
  title: string;
  body: string;
  actionUrl?: string;
  groupKey?: string;
  read: boolean;
  createdAt: string;
  icon?: string;
}

export type EcaEvent =
  | 'listing.created'
  | 'listing.updated'
  | 'listing.status_changed'
  | 'listing.price_changed'
  | 'listing.viewed'
  | 'offer.received'
  | 'offer.status_changed'
  | 'offer.expired'
  | 'message.received'
  | 'viewing.requested'
  | 'viewing.completed'
  | 'tkgm.query_completed'
  | 'tkgm.flag_changed'
  | 'user.signed_up'
  | 'user.kyc_status_changed'
  | 'user.favorited_listing'
  | 'system.cron.daily'
  | 'system.cron.hourly';

export type EcaActionType =
  | 'notify.user'
  | 'notify.role'
  | 'email.mock'
  | 'webhook.mock'
  | 'assign.to'
  | 'set.field'
  | 'tag.add'
  | 'flag.review'
  | 'ai.summarize';

export type EcaOp =
  | 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte'
  | 'in' | 'nin' | 'contains' | 'between' | 'regex';

export interface EcaCondition {
  field: string;
  op: EcaOp;
  value: unknown;
}

export interface EcaAction {
  type: EcaActionType;
  params: Record<string, unknown>;
}

export interface EcaHistoryEntry {
  at: string;
  payload: unknown;
  matched: boolean;
  actionsRun: string[];
}

export interface EcaRule {
  id: string;
  name: string;
  description: string;
  event: EcaEvent;
  conditions: EcaCondition[];
  actions: EcaAction[];
  enabled: boolean;
  ownerId: string;
  history: EcaHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  principalId: string;
  principalType: PrincipalType;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  reason?: string;
  agentId?: string;
  hashPrev: string;
  hash: string;
}

export type TkgmCode = 'OK' | 'E001' | 'E002' | 'E003' | 'E099';

export interface TkgmQuery {
  id: string;
  by: string;
  input: { il: string; ilce: string; ada: string; parsel: string };
  status: TkgmCode;
  latencyMs: number;
  result?: {
    il: string;
    ilce: string;
    mahalle: string;
    ada: string;
    parsel: string;
    yuzolcumu: number;
    cinsi: string;
    hisse?: string;
  };
  createdAt: string;
}

export type ImplStatus = 'full' | 'partial' | 'planned';

export interface ModuleCatalogEntry {
  id: string;
  layer: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  name: string;
  faz: 'Faz 1' | 'Faz 2' | 'Faz 3' | 'Faz 4';
  priority: 'P0' | 'P1' | 'P2';
  squad: string;
  ai: boolean;
  mcp: boolean;
  description: string;
  kpis: string;
  uiRoute?: string;
  implStatus?: ImplStatus;
}

export interface AiSuggestion {
  id: string;
  title: string;
  body: string;
  action?: { label: string; href?: string; commandId?: string };
  reason?: string;
  confidence: number;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  context?: string;
}

export interface AppCommand {
  id: string;
  title: string;
  hint?: string;
  keywords?: string[];
  group: 'navigate' | 'create' | 'theme' | 'role' | 'ai' | 'help' | 'admin';
  iconKey?: string;
  shortcut?: string;
  scope?: Role[];
  run: () => void | Promise<void>;
}
