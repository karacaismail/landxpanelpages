import type { EcaRule } from '@/types/domain';

export function buildSeedEcaRules(adminId: string): EcaRule[] {
  const now = new Date('2026-05-12T10:00:00Z').toISOString();
  const base = {
    enabled: true,
    ownerId: adminId,
    history: [],
    createdAt: now,
    updatedAt: now
  };
  const rules: EcaRule[] = [
    {
      ...base, id: 'r-001',
      name: 'TKGM ipotekli → review',
      description: 'TKGM durumu "İpotekli" olan yeni ilanları admin onayına yönlendir.',
      event: 'listing.created',
      conditions: [{ field: 'tkgmStatus', op: 'eq', value: 'ipotekli' }],
      actions: [
        { type: 'flag.review', params: { reason: 'TKGM ipotekli' } },
        { type: 'notify.role', params: { role: 'admin', title: 'İpotekli ilan kuyruğa alındı', body: 'Review gerekli', priority: 'now' } }
      ]
    },
    {
      ...base, id: 'r-002',
      name: 'Draft 7 gündür açık — satıcıya hatırlatma',
      description: '7 günden uzun süredir draft olan ilanlar için satıcıya AI hatırlatma gönder.',
      event: 'system.cron.daily',
      conditions: [{ field: 'status', op: 'eq', value: 'draft' }, { field: 'daysInStatus', op: 'gte', value: 7 }],
      actions: [
        { type: 'notify.user', params: { title: 'İlanınızı yayınlamayı tamamlayın', body: 'AI taslak hazır', priority: 'later' } },
        { type: 'ai.summarize', params: { field: 'description' } }
      ]
    },
    {
      ...base, id: 'r-003',
      name: 'Fiyat anomalisi tespit',
      description: 'Fiyat %20\'den fazla değişen ilanlara "anomali" etiketi ekle ve admin\'i bilgilendir.',
      event: 'listing.price_changed',
      conditions: [{ field: 'priceChangePct', op: 'gt', value: 20 }],
      actions: [
        { type: 'tag.add', params: { tag: 'fiyat-anomali' } },
        { type: 'notify.role', params: { role: 'admin', title: 'Fiyat anomalisi tespit edildi', body: 'İnceleme gerekebilir', priority: 'soon' } }
      ]
    },
    {
      ...base, id: 'r-004',
      name: 'İyi teklif — satıcıya öneri',
      description: 'Liste fiyatının %90 üzerindeki teklifleri satıcıya 1-tık kabul önerisiyle sun.',
      event: 'offer.received',
      conditions: [{ field: 'offerToListRatio', op: 'gte', value: 0.9 }],
      actions: [
        { type: 'notify.user', params: { title: 'İyi teklif aldınız', body: 'Listenize %90+ teklif geldi. Kabul önerilir.', priority: 'now' } }
      ]
    },
    {
      ...base, id: 'r-005',
      name: 'Yavaş yanıt — AI taslak yanıt hazırla',
      description: '24 saatten uzun yanıt bekleyen mesajlar için AI taslak yanıt oluştur.',
      event: 'message.received',
      conditions: [{ field: 'responseLatencyHours', op: 'gt', value: 24 }],
      actions: [
        { type: 'notify.user', params: { title: 'AI taslak yanıt hazır', body: 'Yanıt önerinizi inceleyin', priority: 'soon' } },
        { type: 'ai.summarize', params: { field: 'thread' } }
      ]
    },
    {
      ...base, id: 'r-006',
      name: 'KYC hatırlatma',
      description: 'KYC bekleyen kullanıcılara 48 saat sonra hatırlatma gönder.',
      event: 'user.kyc_status_changed',
      conditions: [{ field: 'newStatus', op: 'eq', value: 'pending' }, { field: 'ageHours', op: 'gt', value: 48 }],
      actions: [
        { type: 'notify.user', params: { title: 'Kimlik doğrulama bekliyor', body: 'Adımları tamamlayın', priority: 'soon' } },
        { type: 'email.mock', params: { template: 'kyc-reminder' } }
      ]
    },
    {
      ...base, id: 'r-007',
      name: 'Popüler ilan — satıcıya rozet',
      description: 'Aynı ilanda günde 3+ görme randevusu olduğunda "popüler" rozeti ekle.',
      event: 'viewing.requested',
      conditions: [{ field: 'count24h', op: 'gte', value: 3 }],
      actions: [
        { type: 'tag.add', params: { tag: 'popüler' } },
        { type: 'notify.user', params: { title: 'İlanınız popüler', body: 'Bugün 3+ görme talebi geldi', priority: 'soon' } }
      ]
    },
    {
      ...base, id: 'r-008',
      name: 'Sıcak alıcı tespit',
      description: 'Aynı alıcı 24 saatte aynı ilana 5+ baktıysa "sıcak alıcı" etiketi.',
      event: 'listing.viewed',
      conditions: [{ field: 'byUser24h', op: 'gte', value: 5 }],
      actions: [
        { type: 'tag.add', params: { tag: 'sıcak-alıcı' } }
      ]
    },
    {
      ...base, id: 'r-009',
      name: 'Şerh uyarısı favorilemiş alıcılara',
      description: 'TKGM\'de şerh kayda geçtiğinde, ilanı favorilemiş alıcılara uyarı gönder.',
      event: 'tkgm.flag_changed',
      conditions: [{ field: 'newFlag', op: 'eq', value: 'serh' }],
      actions: [
        { type: 'notify.user', params: { title: 'TKGM uyarısı', body: 'Favori ilanınızda şerh kaydı oluştu', priority: 'now' } }
      ]
    },
    {
      ...base, id: 'r-010',
      name: 'Yenileme önerisi (cron)',
      description: 'Sona ermesine 7 gün kalan ilanlar için satıcıya yenileme önerisi gönder.',
      event: 'system.cron.daily',
      conditions: [{ field: 'daysToExpire', op: 'lte', value: 7 }],
      actions: [
        { type: 'notify.user', params: { title: 'İlanınız yakında sona eriyor', body: 'Yenileme önerilir', priority: 'soon' } },
        { type: 'email.mock', params: { template: 'expire-soon' } }
      ]
    },
    {
      ...base, id: 'r-011',
      name: 'Yeni satıcı karşılama',
      description: 'Satıcı rolü olan yeni kayıtlara rehber ve örnek ilan formu gönder.',
      event: 'user.signed_up',
      conditions: [{ field: 'roles', op: 'contains', value: 'seller' }],
      actions: [
        { type: 'notify.user', params: { title: 'Hoş geldiniz', body: 'İlk ilanınızı 5 dakikada oluşturun', priority: 'later' } }
      ]
    },
    {
      ...base, id: 'r-012',
      name: 'Hisseli tapu uyarısı',
      description: 'Hisseli tapulu ilanlara otomatik etiket + AI özet.',
      event: 'listing.created',
      conditions: [{ field: 'tapuType', op: 'eq', value: 'hisseli' }],
      actions: [
        { type: 'tag.add', params: { tag: 'hisseli' } },
        { type: 'ai.summarize', params: { field: 'description' } }
      ]
    },
    {
      ...base, id: 'r-013',
      name: 'Düşük fiyat alarmı abone bildirimi',
      description: 'Fiyatı %10\'dan fazla düşen ilanları kayıtlı arama eşleştirenlere bildir.',
      event: 'listing.price_changed',
      conditions: [{ field: 'priceChangePct', op: 'lt', value: -10 }],
      actions: [
        { type: 'notify.user', params: { title: 'Fiyat düştü', body: 'Aramanıza uyan bir ilanda fiyat indirildi', priority: 'now' } }
      ]
    },
    {
      ...base, id: 'r-014',
      name: 'Eksik görsel uyarısı',
      description: '3\'ten az görselli ilanlara yayın öncesi öneri gönder.',
      event: 'listing.created',
      conditions: [{ field: 'imageCount', op: 'lt', value: 3 }],
      actions: [
        { type: 'notify.user', params: { title: 'Daha fazla foto ekleyin', body: 'İlgilenen alıcı sayısını artırır', priority: 'later' } }
      ]
    },
    {
      ...base, id: 'r-015',
      name: 'Spam mesaj tespit',
      description: 'Aynı karakteri 5+ kez tekrarlayan mesajları moderasyon kuyruğuna at.',
      event: 'message.received',
      conditions: [{ field: 'body', op: 'regex', value: '(.)\\1{4,}' }],
      actions: [
        { type: 'flag.review', params: { reason: 'spam-pattern' } },
        { type: 'notify.role', params: { role: 'moderator', title: 'Spam mesaj kuyruğa alındı', body: '', priority: 'soon' } }
      ]
    },
    {
      ...base, id: 'r-016', enabled: false,
      name: 'Yüksek riskli ilan — review',
      description: 'AI risk skoru 70+ olan ilanları otomatik review.',
      event: 'listing.created',
      conditions: [{ field: 'aiRiskScore', op: 'gt', value: 70 }],
      actions: [
        { type: 'flag.review', params: { reason: 'yüksek risk' } }
      ]
    },
    {
      ...base, id: 'r-017',
      name: 'İlk mesajda AI taslak',
      description: 'Bir thread\'in ilk mesajı geldiğinde satıcıya AI taslak yanıt önerisi sun.',
      event: 'message.received',
      conditions: [{ field: 'isFirstInThread', op: 'eq', value: true }],
      actions: [
        { type: 'notify.user', params: { title: 'AI taslak yanıt hazır', body: 'Hızlı yanıt önerisi', priority: 'soon' } }
      ]
    },
    {
      ...base, id: 'r-018', enabled: false,
      name: 'Premium alıcı önerisi',
      description: 'KYC seviyesi "full" olan yeni alıcılara VIP avantaj bildir.',
      event: 'user.signed_up',
      conditions: [{ field: 'kycLevel', op: 'eq', value: 'full' }],
      actions: [
        { type: 'notify.user', params: { title: 'Premium avantajlar', body: 'Kimliği doğrulanmış alıcılar için özel ilanlar', priority: 'later' } }
      ]
    },
    {
      ...base, id: 'r-019',
      name: 'Deniz manzaralı ilan abonelerine',
      description: 'Yeni "deniz manzaralı" ilanları, bu özellikli aramayı kaydedenlere bildir.',
      event: 'listing.created',
      conditions: [{ field: 'features', op: 'contains', value: 'Deniz manzaralı' }],
      actions: [
        { type: 'notify.role', params: { role: 'buyer', title: 'Yeni deniz manzaralı ilan', body: 'Kaydettiğiniz aramaya uyuyor', priority: 'soon' } }
      ]
    },
    {
      ...base, id: 'r-020', enabled: false,
      name: 'Çok teklif alan ilan — admin\'e ihbar',
      description: '24 saat içinde 10+ teklif alan ilanları admin\'e bildir.',
      event: 'offer.received',
      conditions: [{ field: 'offerCount24h', op: 'gte', value: 10 }],
      actions: [
        { type: 'notify.role', params: { role: 'admin', title: 'Yoğun teklif', body: 'Olağandışı talep', priority: 'soon' } }
      ]
    },
    {
      ...base, id: 'r-021',
      name: 'Tarım/zeytinlik etiketleme',
      description: 'Tarım veya zeytinlik imarlı ilanlara otomatik etiket + AI özet.',
      event: 'listing.created',
      conditions: [{ field: 'imarType', op: 'in', value: ['tarim', 'zeytinlik'] }],
      actions: [
        { type: 'tag.add', params: { tag: 'tarımsal' } },
        { type: 'ai.summarize', params: { field: 'description' } }
      ]
    },
    {
      ...base, id: 'r-022', enabled: false,
      name: 'Tekrarlanan ret eskalasyonu',
      description: 'Aynı satıcı 3+ kez teklif reddetti — moderasyona ihbar.',
      event: 'offer.status_changed',
      conditions: [{ field: 'newStatus', op: 'eq', value: 'rejected' }, { field: 'rejectsLast30d', op: 'gte', value: 3 }],
      actions: [
        { type: 'notify.role', params: { role: 'moderator', title: 'Yüksek red oranı', body: 'İncelemenizi öneririz', priority: 'later' } }
      ]
    },
    {
      ...base, id: 'r-023',
      name: 'Bozuk görsel tespit (mock)',
      description: 'Yüklenen görsellerden biri yüklenemiyorsa kaydı review\'a at.',
      event: 'listing.updated',
      conditions: [{ field: 'hasBrokenImage', op: 'eq', value: true }],
      actions: [
        { type: 'flag.review', params: { reason: 'bozuk görsel' } }
      ]
    },
    {
      ...base, id: 'r-024', enabled: false,
      name: 'Demo cron — günlük rapor',
      description: 'Her gün admin\'e günlük özet bildirim.',
      event: 'system.cron.daily',
      conditions: [],
      actions: [
        { type: 'notify.role', params: { role: 'admin', title: 'Günlük özet hazır', body: 'Raporlara göz atın', priority: 'later' } }
      ]
    }
  ];
  return rules;
}
