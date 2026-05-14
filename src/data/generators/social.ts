import { faker } from '@faker-js/faker/locale/tr';
import type { Offer, OfferStatus, Thread, Message, Viewing, Favorite, SavedSearch, Notification, NotifPriority, User, Listing } from '@/types/domain';
import { pick, pickMany } from '@/lib/utils/random';

export function generateOffers(rand: () => number, listings: Listing[], users: User[], count = 120): Offer[] {
  const out: Offer[] = [];
  const liveListings = listings.filter((l) => l.status === 'live' || l.status === 'sold');
  const buyers = users.filter((u) => u.roles.includes('buyer'));
  for (let i = 0; i < count; i++) {
    const listing = pick(liveListings, rand);
    const buyer = pick(buyers, rand);
    const status: OfferStatus = pick(['pending', 'pending', 'pending', 'countered', 'accepted', 'rejected', 'expired'] as const, rand);
    const amount = Math.round(listing.price * (0.7 + rand() * 0.35) / 10000) * 10000;
    const createdAt = faker.date.between({ from: '2025-12-01', to: '2026-05-10' }).toISOString();
    out.push({
      id: `o-${i.toString().padStart(4, '0')}`,
      listingId: listing.id,
      buyerId: buyer.id,
      sellerId: listing.ownerId,
      amount,
      message: rand() > 0.4 ? pick([
        'Pazarlık payı var mı?',
        'Hemen alabilirim, taşınma sürelerine bakar mısınız?',
        'Tapu masrafları paylaşılırsa kabul ederim.',
        'Bu fiyatı 30 gün içinde nakit yapabilirim.'
      ], rand) : undefined,
      status,
      validUntil: faker.date.future({ years: 0.1, refDate: createdAt }).toISOString(),
      createdAt,
      updatedAt: createdAt,
      history: [
        { at: createdAt, by: buyer.id, amount, status: 'pending', note: 'İlk teklif' }
      ]
    });
  }
  return out;
}

export function generateThreadsAndMessages(rand: () => number, listings: Listing[], users: User[]): { threads: Thread[]; messages: Message[] } {
  const threads: Thread[] = [];
  const messages: Message[] = [];
  const buyers = users.filter((u) => u.roles.includes('buyer'));
  const liveListings = listings.filter((l) => l.status === 'live').slice(0, 100);

  for (let i = 0; i < 40; i++) {
    const listing = pick(liveListings, rand);
    const buyer = pick(buyers, rand);
    const threadId = `th-${i.toString().padStart(3, '0')}`;
    const msgCount = 3 + Math.floor(rand() * 10);
    const baseTime = faker.date.between({ from: '2026-01-01', to: '2026-05-10' }).getTime();

    const sample = [
      { from: buyer.id, body: 'Merhaba, ilan hâlâ aktif mi?' },
      { from: listing.ownerId, body: 'Merhaba, evet aktif. Hangi konuda bilgi almak istersiniz?' },
      { from: buyer.id, body: 'Tapu durumu nedir? TKGM kaydı temiz mi?' },
      { from: listing.ownerId, body: 'Tapu tarafı tamamen temiz. Belgeleri paylaşabilirim.' },
      { from: buyer.id, body: 'Pazarlık payı var mı?' },
      { from: listing.ownerId, body: 'Sınırlı pazarlık payımız var. Net teklifinizi yazabilir misiniz?' },
      { from: buyer.id, body: 'Hafta sonu görme randevusu mümkün mü?' },
      { from: listing.ownerId, body: 'Cumartesi 11:00 uygun. Konum paylaşıyorum.' },
      { from: buyer.id, body: 'Teşekkürler, görüşmek üzere.' },
      { from: listing.ownerId, body: 'Bekliyorum, iyi günler.' }
    ];

    for (let m = 0; m < msgCount && m < sample.length; m++) {
      const at = new Date(baseTime + m * 1000 * 60 * (10 + rand() * 60)).toISOString();
      messages.push({
        id: `msg-${i.toString().padStart(3,'0')}-${m}`,
        threadId,
        senderId: sample[m].from,
        body: sample[m].body,
        createdAt: at,
        readBy: [sample[m].from],
        aiSuggestedReplies: m === msgCount - 1 ? [
          'Hayırlı olsun, görüşürüz.',
          'Bir sorum daha olacaktı.',
          'Tapu masraflarını paylaşalım mı?'
        ] : undefined
      });
    }
    threads.push({
      id: threadId,
      participantIds: [buyer.id, listing.ownerId],
      listingId: listing.id,
      lastMessageAt: messages[messages.length - 1].createdAt,
      unreadCount: { [buyer.id]: 0, [listing.ownerId]: rand() > 0.7 ? 1 : 0 },
      topic: listing.title
    });
  }
  return { threads, messages };
}

export function generateViewings(rand: () => number, listings: Listing[], users: User[], count = 35): Viewing[] {
  const out: Viewing[] = [];
  const buyers = users.filter((u) => u.roles.includes('buyer'));
  const liveListings = listings.filter((l) => l.status === 'live');
  for (let i = 0; i < count; i++) {
    const listing = pick(liveListings, rand);
    const buyer = pick(buyers, rand);
    const future = rand() > 0.4;
    const scheduledAt = future ? faker.date.soon({ days: 30 }) : faker.date.recent({ days: 30 });
    out.push({
      id: `v-${i.toString().padStart(3, '0')}`,
      listingId: listing.id,
      visitorId: buyer.id,
      sellerId: listing.ownerId,
      scheduledAt: scheduledAt.toISOString(),
      status: future ? pick(['requested', 'confirmed', 'rescheduled'] as const, rand) : pick(['completed', 'cancelled'] as const, rand),
      note: rand() > 0.6 ? pick(['Konum paylaşılacak', 'Sahibinden anahtar var', 'Yağmurda iptal'], rand) : undefined
    });
  }
  return out;
}

export function generateFavorites(rand: () => number, listings: Listing[], users: User[], count = 80): Favorite[] {
  const out: Favorite[] = [];
  const buyers = users.filter((u) => u.roles.includes('buyer'));
  const seen = new Set<string>();
  while (out.length < count) {
    const buyer = pick(buyers, rand);
    const listing = pick(listings, rand);
    const key = `${buyer.id}:${listing.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ userId: buyer.id, listingId: listing.id, createdAt: faker.date.recent({ days: 90 }).toISOString() });
  }
  return out;
}

export function generateSavedSearches(rand: () => number, users: User[], count = 22): SavedSearch[] {
  const buyers = users.filter((u) => u.roles.includes('buyer'));
  const out: SavedSearch[] = [];
  for (let i = 0; i < count; i++) {
    const user = pick(buyers, rand);
    out.push({
      id: `ss-${i.toString().padStart(3, '0')}`,
      userId: user.id,
      name: pick(['İstanbul Beykoz arsa', 'Çanakkale deniz manzarası', 'İzmir Urla zeytinlik', 'Yalova yatırım', 'Mugla Bodrum', 'Antalya Kaş', 'Bursa İznik'], rand),
      filters: {
        city: pick(['İstanbul', 'İzmir', 'Antalya', 'Muğla', 'Çanakkale'], rand),
        minPrice: Math.floor(rand() * 5_000_000),
        maxPrice: 5_000_000 + Math.floor(rand() * 20_000_000),
        minArea: 500, maxArea: 50_000,
        imarType: pick(['konut', 'tarim', 'turizm'] as const, rand),
        tkgmStatus: 'temiz'
      },
      alertEnabled: rand() > 0.5,
      matchCount: Math.floor(rand() * 30),
      createdAt: faker.date.recent({ days: 60 }).toISOString()
    });
  }
  return out;
}

export function generateNotifications(rand: () => number, users: User[], count = 140): Notification[] {
  const out: Notification[] = [];
  const templates: Array<{ title: string; body: string; priority: NotifPriority; icon: string }> = [
    { title: 'Yeni teklif aldınız', body: 'L0023 nolu ilana 2.350.000 ₺ teklif geldi.', priority: 'now', icon: 'ph-coin' },
    { title: 'Fiyat alarmı', body: 'Kaydedilen aramanızda 3 yeni ilan eşleşti.', priority: 'soon', icon: 'ph-bell-ringing' },
    { title: 'TKGM uyarısı', body: 'L0114 nolu ilanın TKGM kaydında değişiklik var.', priority: 'now', icon: 'ph-shield-warning' },
    { title: 'Mesajınız var', body: 'Mehmet Yılmaz size yazdı.', priority: 'soon', icon: 'ph-chat-circle' },
    { title: 'Randevu hatırlatma', body: 'Yarın 14:00\'te görme randevunuz var.', priority: 'soon', icon: 'ph-calendar' },
    { title: 'KYC tamamlama', body: 'Kimlik doğrulama adımınız bekliyor.', priority: 'later', icon: 'ph-identification-card' },
    { title: 'İlanınız onaylandı', body: 'L0098 nolu ilan yayında.', priority: 'soon', icon: 'ph-check-circle' },
    { title: 'AI önerisi', body: '7 gündür taslakta olan ilanınızı yayınlayabilirsiniz.', priority: 'later', icon: 'ph-sparkle' }
  ];
  for (let i = 0; i < count; i++) {
    const u = pick(users, rand);
    const t = pick(templates, rand);
    out.push({
      id: `n-${i.toString().padStart(4, '0')}`,
      userId: u.id,
      channel: pick(['in_app', 'in_app', 'in_app', 'email', 'sms', 'push'] as const, rand),
      priority: t.priority,
      title: t.title,
      body: t.body,
      icon: t.icon,
      groupKey: `${t.priority}-${t.title}`,
      read: rand() > 0.4,
      createdAt: faker.date.recent({ days: 30 }).toISOString()
    });
  }
  return out;
}
