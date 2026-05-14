# Mock Veri Şeması

Tüm tipler `src/types/domain.ts`'te Zod schema + TS tipi olarak yer alır. Mock store TanStack Query üzerinden, MSW handler'lar arkada.

## Diyagram (ER)

```
User ────< Listing  >── Image
  │           │           
  │           ├──< Offer ──> User (buyer)
  │           ├──< Message ──> User (other)
  │           ├──< Viewing
  │           └──< Favorite (composite)
  │
  ├──< Notification
  ├──< AuditEvent
  ├──< SavedSearch
  └──< Role(many-to-many)
  
EcaRule (standalone)
TkgmQuery (standalone, ilişki opsiyonel)
```

## Tipler

### User
```ts
type Role = 'buyer' | 'seller' | 'admin' | 'moderator';
type KycLevel = 'none' | 'phone' | 'email' | 'identity' | 'full';
type PrincipalType = 'individual' | 'org' | 'agent' | 'system';

interface User {
  id: string;
  principalType: PrincipalType;
  displayName: string;
  email: string;
  phone: string;
  fullName: string;
  avatarUrl: string;
  locale: 'tr' | 'en';
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
  };
  rating?: number; // 0-5
  vipScore?: number; // AI-derived 0-100
}
```

### Listing
```ts
type ListingStatus = 'draft' | 'review' | 'live' | 'sold' | 'rejected' | 'expired';
type TapuType = 'mustakil' | 'hisseli' | 'kat_irtifaki' | 'arsa_tapulu' | 'tarla_tapulu';
type TkgmStatus = 'temiz' | 'ipotekli' | 'serh' | 'tedbir' | 'bilinmiyor';
type ImarType = 'konut' | 'tarim' | 'ticari' | 'sanayi' | 'turizm' | 'zeytinlik' | 'imarsiz' | 'karma';

interface ListingImage { id: string; url: string; thumbUrl: string; alt: string; order: number; }

interface Listing {
  id: string;
  ownerId: string; // User id
  title: string;
  description: string;
  status: ListingStatus;
  city: string;       // İl
  district: string;   // İlçe
  neighborhood: string;
  ada?: string; parsel?: string; pafta?: string;
  lat: number; lng: number;
  area: number;       // m²
  price: number;      // ₺
  currency: 'TRY';
  pricePerM2: number;
  tapuType: TapuType;
  tkgmStatus: TkgmStatus;
  imarType: ImarType;
  hisseRatio?: number; // 0-100 (hisseli ise)
  utilities: { road: boolean; electricity: boolean; water: boolean; gas: boolean; internet: boolean };
  features: string[]; // ['deniz manzarali','yola sifir','koseparseli','agacli','kuyusu var',...]
  images: ListingImage[];
  videoUrl?: string;
  publishedAt?: string;
  expiresAt?: string;
  views: number;
  messageCount: number;
  offerCount: number;
  favoriteCount: number;
  aiSummary?: string;     // AI-üretilmiş özet
  aiTags?: string[];      // AI-üretilmiş etiket
  aiRiskScore: number;    // 0-100
  aiRiskReasons: string[];
  aiValuation: { low: number; mid: number; high: number; confidence: number };
  createdAt: string;
  updatedAt: string;
}
```

### Offer
```ts
type OfferStatus = 'pending' | 'countered' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
interface Offer {
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
  history: Array<{ at: string; by: string; amount: number; note?: string; status: OfferStatus }>;
}
```

### Message / Thread
```ts
interface Thread {
  id: string;
  participantIds: string[]; // 2 user
  listingId?: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
}
interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  aiTone?: 'neutral' | 'friendly' | 'firm' | 'apologetic';
  aiSuggestedReplies?: string[];
  attachments?: Array<{ id: string; url: string; type: 'image'|'doc' }>;
  createdAt: string;
  readBy: string[];
}
```

### Viewing
```ts
type ViewingStatus = 'requested' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
interface Viewing {
  id: string;
  listingId: string;
  visitorId: string;
  sellerId: string;
  scheduledAt: string;
  status: ViewingStatus;
  note?: string;
}
```

### Favorite
```ts
interface Favorite {
  userId: string;
  listingId: string;
  createdAt: string;
}
```

### SavedSearch
```ts
interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: Partial<{ city: string; district: string; minPrice: number; maxPrice: number; minArea: number; maxArea: number; imarType: ImarType; tkgmStatus: TkgmStatus; tapuType: TapuType; features: string[] }>;
  alertEnabled: boolean;
  matchCount: number;
  createdAt: string;
}
```

### Notification
```ts
type NotifChannel = 'in_app' | 'email' | 'sms' | 'push';
type NotifPriority = 'now' | 'soon' | 'later';
interface Notification {
  id: string;
  userId: string;
  channel: NotifChannel;
  priority: NotifPriority;
  title: string;
  body: string;
  actionUrl?: string;
  groupKey?: string; // AI gruplama
  read: boolean;
  createdAt: string;
}
```

### EcaRule
```ts
type EcaEvent = 'listing.created' | 'listing.status_changed' | 'listing.price_changed' |
                'offer.received' | 'offer.status_changed' | 'message.received' |
                'viewing.requested' | 'tkgm.flag_changed' | 'user.kyc_status_changed' |
                'user.signed_up' | 'system.cron.daily' | 'listing.viewed';
type EcaActionType = 'notify.user' | 'notify.role' | 'email.mock' | 'webhook.mock' |
                    'assign.to' | 'set.field' | 'tag.add' | 'flag.review' | 'ai.summarize';
interface EcaCondition { field: string; op: 'eq'|'ne'|'gt'|'lt'|'gte'|'lte'|'in'|'nin'|'contains'|'between'|'regex'; value: unknown; }
interface EcaAction { type: EcaActionType; params: Record<string, unknown>; }
interface EcaRule {
  id: string;
  name: string;
  description: string;
  event: EcaEvent;
  conditions: EcaCondition[]; // AND
  actions: EcaAction[];
  enabled: boolean;
  ownerId: string;
  history: Array<{ at: string; payload: unknown; matched: boolean; actionsRun: string[] }>;
  createdAt: string;
  updatedAt: string;
}
```

### AuditEvent
```ts
interface AuditEvent {
  id: string;
  at: string;
  principalId: string;
  principalType: PrincipalType;
  action: string;        // 'listing.create' etc.
  resourceType: string;
  resourceId: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  reason?: string;
  agentId?: string;
  hashPrev: string;      // chain
  hash: string;
}
```

### TkgmQuery
```ts
type TkgmCode = 'OK' | 'E001' | 'E002' | 'E003' | 'E099';
interface TkgmQuery {
  id: string;
  by: string;            // userId
  input: { il: string; ilce: string; ada: string; parsel: string };
  status: TkgmCode;
  latencyMs: number;
  result?: {
    il: string; ilce: string; mahalle: string; ada: string; parsel: string;
    yuzolcumu: number; cinsi: string; hisse?: string;
  };
  createdAt: string;
}
```

## Demo data hacim

| Tip | Adet |
|---|---|
| User | 60 |
| Listing | 220 |
| Image | ~1300 (3-12/ilan) |
| Offer | 120 |
| Thread | 40 |
| Message | 300 |
| Viewing | 35 |
| Favorite | 80 |
| SavedSearch | 22 |
| Notification | 140 |
| EcaRule | 24 |
| AuditEvent | 500 |
| TkgmQuery | 60 |

## Görsel kaynakları
- Listing image: `https://picsum.photos/seed/landx-{id}/{w}/{h}` (deterministik) + Unsplash Source kategorik fallback
- Avatar: `https://i.pravatar.cc/200?u={id}` veya `https://picsum.photos/seed/avatar-{id}/200/200`
