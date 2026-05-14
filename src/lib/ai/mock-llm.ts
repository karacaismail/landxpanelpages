// Scripted mock LLM — gerçek API'a benzer akış, tutarlı yanıtlar.

import { parseQuery } from './nl-parser';

export interface ChatContext {
  route?: string;
  role?: string;
  selection?: { type: string; id: string; data?: unknown };
}

interface ChatTurn {
  user: string;
  context?: ChatContext;
}

export interface ChatResult {
  text: string;
  suggestions?: Array<{ label: string; commandId?: string; href?: string }>;
  source?: 'scripted' | 'fallback';
}

const SCRIPTS: Array<{ match: RegExp; respond: (q: string, ctx?: ChatContext) => ChatResult }> = [
  {
    match: /(merhaba|selam|hello|hi)\b/i,
    respond: () => ({ text: 'Merhaba. Bugün hangi konuda yardımcı olayım? Niyetinizi yazın, alanları doldurayım veya öneriler getireyim.', source: 'scripted' })
  },
  {
    match: /\b(yardım|help)\b/i,
    respond: () => ({
      text: 'Şu konularda yardımcı olabilirim:\n• Arsa ara: "İstanbul Beykoz 5000 m² imarlı 2,5M altı"\n• Yeni ilan oluştur\n• ECA kuralı ekle\n• Risk skorunu açıkla\n• Onay kuyruğunu özetle',
      suggestions: [
        { label: 'Keşfet sayfasına git', href: '#/listings' },
        { label: 'Komut paletini aç', commandId: 'palette.open' }
      ],
      source: 'scripted'
    })
  },
  {
    match: /onay (kuyruğu|listesi)|review queue/i,
    respond: () => ({
      text: 'Onay kuyruğunda 12 bekleyen ilan, 7 KYC ve 2 itiraz var. AI risk skoruna göre 3 ilan yüksek riskte. Detaya gidelim mi?',
      suggestions: [
        { label: 'Onaylar sayfasına git', href: '#/admin/approvals' }
      ],
      source: 'scripted'
    })
  },
  {
    match: /risk/i,
    respond: () => ({
      text: 'Risk skoru TKGM durumu, tapu tipi, imar ve altyapı verilerine göre hesaplanır. Detaylı açıklama için ilan kartındaki risk rozetine tıklayın.',
      source: 'scripted'
    })
  },
  {
    match: /değerleme|valuation/i,
    respond: () => ({
      text: 'AI değerleme: il × imar × m² × emsal formülü ve altyapı katsayılarıyla hesaplanır. Alt/önerilen/üst aralık ve güven oranı verilir.',
      source: 'scripted'
    })
  },
  {
    match: /(yeni ilan|ilan oluştur|sat[ıi][şs])/i,
    respond: () => ({
      text: 'Yeni ilan yardımcısı: 6 adımlı sihirbaz (Konum → Detay → Görsel → Fiyat → Açıklama → Önizleme). Her adımda AI öneri sunar.',
      suggestions: [{ label: 'İlan oluştur', href: '#/sell' }],
      source: 'scripted'
    })
  },
  {
    match: /(kural|eca|automation)/i,
    respond: () => ({
      text: 'ECA kuralları olay-koşul-aksiyon yapısında. Pre-built 24 kuraldan 15\'i etkin. Yeni kural eklemek için /admin/rules sayfasına gidin.',
      suggestions: [{ label: 'Kurallara git', href: '#/admin/rules' }],
      source: 'scripted'
    })
  }
];

export async function chat(turn: ChatTurn): Promise<ChatResult> {
  // Simüle gecikme — daha gerçekçi his
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

  // Niyet parse
  const parsed = parseQuery(turn.user);
  if (parsed.city || parsed.imarType || parsed.maxPrice) {
    const parts: string[] = [];
    if (parsed.city) parts.push(parsed.city);
    if (parsed.district) parts.push(parsed.district);
    if (parsed.imarType) parts.push(parsed.imarType);
    if (parsed.maxPrice) parts.push(`max ${(parsed.maxPrice / 1_000_000).toFixed(1)}M ₺`);
    if (parsed.tkgmStatus) parts.push(`TKGM: ${parsed.tkgmStatus}`);
    return {
      text: `Niyetinizi anladım: ${parts.join(' · ')}. Keşfet sayfasına bu filtrelerle yönlendireyim mi?`,
      suggestions: [
        { label: 'Filtreyle keşfet', href: `#/listings?q=${encodeURIComponent(turn.user)}` },
        { label: 'Aramayı kaydet', commandId: 'search.save' }
      ],
      source: 'scripted'
    };
  }

  for (const s of SCRIPTS) {
    if (s.match.test(turn.user)) return s.respond(turn.user, turn.context);
  }

  return {
    text: 'Bu konuyu öğreniyorum. Şimdilik kesin bir cevabım yok — komut paletinden (Cmd+K) ilgili sayfaya gidebilirsiniz veya niyetinizi yeniden yazın.',
    suggestions: [
      { label: 'Komut paletini aç', commandId: 'palette.open' },
      { label: 'Keşfet', href: '#/listings' }
    ],
    source: 'fallback'
  };
}

export async function suggestForListing(listingTitle: string, status?: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 400));
  if (status === 'draft') {
    return [
      'Açıklamayı 2-3 cümle ile zenginleştir.',
      '3+ görsel ekle (alıcı ilgisi %40 artar).',
      'Fiyatı bölge ortalamasına göre %5 düşür.',
      'Yayın için TKGM doğrulamasını tamamla.'
    ];
  }
  return [
    'Başlığa "yatırımlık" eklemek tıklamayı %12 artırır.',
    'En çok görüntülenen 3 fotoğrafı başa al.',
    'Fiyatı 7 günlük emsal ortalamasıyla karşılaştır.'
  ];
}

export async function draftReply(threadTopic: string, lastMessage: string, role: 'buyer' | 'seller'): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (role === 'seller') {
    return [
      'Merhaba, ilgilendiğiniz için teşekkürler. Detayları paylaşabilirim.',
      'Tapu belgelerimiz tamam. Hangi konuda ek bilgi istersiniz?',
      'Hafta sonu görme randevusu için uygun saatler şunlar: ...'
    ];
  }
  return [
    'TKGM kaydını paylaşabilir misiniz?',
    'Hafta sonu görme randevusu mümkün mü?',
    'Pazarlık payı var mı? Net teklif önereyim.'
  ];
}
