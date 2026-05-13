# LandX — AI-first Arsa Pazaryeri (Frontend)

Vanilla HTML + CSS + JS ile inşa edilmiş, mobile-first, dark/light tema destekli SaaS panel demosu. Tek sayfa uygulama (SPA); hash router, in-memory state, framework yok.

## Roller ve ekranlar

**Alıcı:** Keşfet (AI doğal dil arama + filtre chip'leri), Listing Detail (AI değerleme bandı + spec grid + Mesaj/Teklif CTA), Favoriler, Mesajlar (thread liste + chat + AI hızlı yanıt şablonu).

**Satıcı / Emlakçı:** İlanlarım (status badge'li kart), Yeni İlan Wizard (Konum → Detaylar → Fiyat AI önerisi → Yayınla), Gelen Teklifler (kabul/red 1-tık), Performans (KPI + SVG sparkline).

**Yönetici:** Onay Kuyruğu (AI risk skoru + 1-tık onay/red), Kullanıcılar (rol filtre), Raporlar (KPI + grafik + en çok ilgi gören ilanlar).

## AI özellikleri (sahte/simüle)

- Doğal dil arama parser (`İstanbul konut 5M altı temiz tapu` → otomatik filtre).
- Fiyat tahmini (`il × imar × emsal` çarpan modeli) ve 1-tık uygulama.
- Açıklama yazıcı (template tabanlı).
- Risk skoru (low/medium/high + sebep) onay kuyruğunda.
- Mesajlarda rol bazlı hızlı yanıt şablonları.

## Stack

- HTML5 + CSS3 (custom design system, ~850 satır) + Vanilla JS (~1250 satır).
- Phosphor Icons (CDN), Outfit font (Google Fonts).
- Build adımı yok — `index.html` doğrudan açılabilir veya statik host edilebilir.

## Yerel geliştirme

```bash
# herhangi bir statik server
python3 -m http.server 8000
# veya
npx serve .
```

Sonra `http://localhost:8000` adresinde aç.

## Yayın

Bu repo GitHub Pages üzerinde yayınlanır:
https://karacaismail.github.io/landxpanelpages/

## Klasör yapısı

```
index.html         # app shell (header, sidebar, bottom-nav, sheet/toast host)
css/style.css      # mobile-first design system + 11 ekranın bileşenleri
js/data.js         # USERS, LISTINGS, MESSAGES, OFFERS, AI yardımcıları, in-memory State
js/app.js          # router, view renderer'ları, event delegation
```

## Mobile-first kurallar

- Base styles 375px telefon için.
- `@media (min-width: 768px)` tablet, `@media (min-width: 1024px)` desktop.
- Touch target min 48px, `100dvh` + `safe-area-inset` desteği.
- Mobile bottom nav, desktop sidebar (rol bazlı 3-4 öğe).
