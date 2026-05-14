# FRONTPAGES META FRAMEWORK 2030 — Public/Storefront Vibecoding Rehberi

LandX'in **son kullanıcıya bakan** tarafının (home, listings, detail, checkout, auth, account) 2030 vizyonu ve implementasyon rehberi. B2C + B2B + C2C uyumlu.

## 1. 2030 Vizyonu (gerçekçi)

- Müşteri yolculuğu: **aramak yerine niyet bildirmek**, gezinmek yerine öneri kabul etmek, karşılaştırmak yerine AI'a sormak.
- Sayfa yapısı: SPA değil **"conversational + content" hibrit**. Sayfa sayısı azalır, durum sayısı artar.
- AI: çok modlu (sesli, görsel, dokunma), proaktif öneri, kişiselleştirme privacy-by-default.

## 2. Sayfa Türleri 2030'da

### Home
- **Conversational hero**: büyük niyet çubuğu ("ne arıyorsun?")
- Aşağıda: **size özel kürasyon** (AI) + **kategori grid** (klasik yedek)
- 4 şerit: Sizin için / Popüler / Yakınınızda / Kategori
- Footer: minimal ama bilgi yoğun

### Listings (Discover)
- Üstte: niyet çubuğu + filter chip'leri
- AI sıralı kart akışı (sebep etiketi: "TKGM temiz", "yakın çevre", "iyi fiyat")
- Sol rail: facets (gizlenebilir; mobilde alt sheet)
- Sağ rail: AI yardımcı ("şu 3 ilan dikkat çekici, baksak mı?")
- Harita modu toggle

### Listing Detail
- **AI özet üstte**: 3-5 madde + uygunluk skoru
- Galeri (sticky mobile)
- Spec/şartlar (sekme: Genel / TKGM / İmar / Çevre / Tarih)
- Sağ panel: seller card + CTA (mesaj/teklif/randevu/karşılaştır/kaydet)
- Aşağı: benzer ilanlar + AI değerleme bandı

### Compare (4'e kadar)
- Yatay scroll grid, sticky ilk sütun
- AI farkları özetler (en başta)

### Checkout / İşlem (mock)
- Tek ekran adımlı (one-page)
- AI auto-fill + akıllı varsayılan
- Risk açıklaması ("neden bu kargo?")

### Auth
- Passkey / Magic link / Sosyal / OTP — biometric mock
- Şifre yedek seçenek
- "Tek tık devam et" Google/Apple mock

### Account (kullanıcı paneli — public taraf)
- AI özet: "geçmişin / aktivilerin / önerilerin"
- Sekme: Profil / Favoriler / Aramalarım / Mesajlar / Randevular / Tekliflerim / Ayarlar / KVKK

## 3. Meta Framework — 7 Katman (frontpages)

A. **Niyet** — hero komut alanı + sayfa başı niyet çubuğu
B. **Keşif** — AI kürasyonu + facets (yedek)
C. **Karşılaştırma** — tek tık compare; AI farkları
D. **Karar** — ilan sayfasında "bana göre" puanı + açıklama
E. **Etkileşim** — mesaj/randevu/teklif/sohbet/kaydet — 1-tık
F. **Onay / İşlem** — tek ekran, AI doldurma, açıklanabilir
G. **Hesap / Kimlik** — passkey/magic link + AI özet

## 4. Header (frontpages)

```
[Logo]  [AI Niyet Çubuğu]  [Dil/Para] [Favoriler•] [Teklifler•] [Hesap▾]
```

- Sticky-kayıp: scroll down gizle, up göster.
- Mobilde: tek satır, niyet çubuğu klavye üstüne pin.

## 5. Footer (frontpages)

- Linkler: Hakkında / KVKK / Çerez / Erişilebilirlik / İletişim
- AI uyumluluk paneli (link)
- Dil / tema toggle
- Mobilde accordion

## 6. Rail 1 (sol) — Facets

Sadece listing/keşif sayfalarında:
- İl/ilçe, fiyat aralığı, m², imar, tapu, TKGM, altyapı, çevre özellikler
- Tek-tıkla apply (debounce 200ms)
- "Filtreyi sıfırla" görünür yer
- Gizlenebilir (toggle button)
- Mobilde: bottom-sheet

## 7. Rail 2 (sağ) — AI Yardımcısı

- Sürekli — "soru sor, karşılaştır, kaydet, randevu al"
- Mobilde: FAB

## 8. Profile / Notifications

### Profil dropdown
- Bana özel
- Öneriler
- Favoriler / Kaydedilenler
- Aramalarım (alert açık/kapalı)
- Randevularım
- Tekliflerim
- Mesajlarım
- Ayarlar
- Çıkış

### Bildirimler
- AI gruplama + öncelik
- "Fiyatı düştü", "yeni ilan uygun", "randevu hatırlatma"
- Proaktif uyarılar

## 9. B2C / B2B / C2C Variant Sistemi

Aynı bileşenler, farklı varyantlar (variant prop).

| Mod | Özellik |
|---|---|
| B2C | Hızlı keşif, tek kullanıcı, ödeme odaklı, ısrarlı kart |
| B2B | Çoklu kullanıcı, onay zinciri, teklif/kontrat akışı, fatura odaklı, hesap yönetimi panosu |
| C2C | İlan veren + alıcı, mesaj odaklı, güven göstergeleri (rating, KYC), uyuşmazlık akışı |

LandX **C2C ağırlıklı** + admin **B2B**.

## 10. User Journeys

### B2C/Alıcı yolculuğu
1. Hero'ya "İstanbul Beykoz tarla" yaz
2. Listeleme — AI öneri sıralaması
3. Ürün sayfası: AI özeti + uygunluk skoru
4. Randevu/teklif 1-tık
5. Mesajlaşma kanalı açık

### B2B/Kurumsal yolculuk
1. Kurumsal hesap → çoklu kullanıcı görünümü
2. Toplu teklif (10+ ilan)
3. Onay zinciri (manager → finance → CEO)
4. Sözleşme + fatura (mock e-imza)

### C2C/İlan veren yolculuğu
1. "İlanımı yayınla" → AI form taslağı
2. TKGM doğrulama (mock)
3. Fiyat önerisi (AI)
4. Yayınla
5. Gelen ilgi/teklif/mesaj — tek panelde

## 11. Mobile-First AI-First Prensipler (frontpages)

- Niyet çubuğu klavye üstünde pinli (kalıcı focus)
- Sesli arama tek tık (mock Web Speech)
- Görsel arama: kameradan arsa fotoğrafı → benzer ilan (mock)
- Konum izni "yakınımdakiler" için
- Tek elle ulaşılabilir alt aksiyon barı (fav/karşılaştır/randevu/teklif/paylaş)
- Düşük veri / çevrimdışı (kayıtlı ilanlar)

## 12. Adaptive & Device Matrix

`ADAPTIVE_DESIGN.md` ile aynı breakpoint'ler. TV/10-foot UI özellikle harita + galeri + büyük tipografi.

## 13. Performans & SEO 2030

- INP < 200ms
- LCP < 2.5s
- CLS < 0.1
- Statik HTML + JS hydration (Vite + lazy)
- SSR/SSG yok (Next.js yasak) → Vite SPA + manuel meta tag güncelleme
- JSON-LD yapılandırılmış veri (ilan: `Product` + `Place`)
- Sitemap.xml + hreflang (TR/EN)

## 14. Güven, Gizlilik, Açıklanabilirlik

- KVKK + GDPR uyum
- AI öneri kartlarında "neden gösteriliyor?" linki
- "AI'ya verdiğin veriler nereye gidiyor?" şeffaf panel
- Cookie tercihi minimal, açık dilli (3 düzey: Zorunlu / Performans / Pazarlama)

## 15. Anti-Patternler (frontpages)

- Devasa hero + 30 carousel
- Onlarca facets ile başlangıç (max 8 görünür)
- Çok adımlı checkout (1 ekran hedef)
- Modal içinde modal
- Aramada 0 sonuç + öneri yok
- AI olmayan boş durumlar
- "Profilini doldur %0/100" şişirme

## 16. Başarı Metrikleri

- Time-to-first-meaningful-action: medyan 12 sn (hedef <15)
- Niyet çubuğu kullanım oranı: %38
- AI öneri kabul oranı: %42
- 1-tık aksiyon başarı oranı: %68
- Conversion: B2C %4.2, B2B %1.8, C2C %12 (yayınla)

## 17. Vibecoding Rehberi

Her sayfa:
- Niyet çubuğu üstte
- AI önerisi ortada
- Klasik içerik altta
- Sağda AI yardımcı (desktop+)

Her kart:
- Hızlı aksiyon barı
- AI puanı/etiket

Her form:
- Doğal dil giriş + AI taslak parse
- Klasik alan altında

Her boş durum:
- AI önerisi var

Her hata:
- AI "şunu dene" sunar

Her CTA:
- Açık dilli, "neden / sonuç" bağlamı

## 18. Public Rota Listesi (Vite + HashRouter)

- `/` Home
- `/listings` Discover (B2C/C2C alıcı)
- `/listings/:id` İlan detayı
- `/compare` Karşılaştırma
- `/auth` Login / Register / Forgot / Passkey
- `/account` Hesap (sekmeli)
- `/account/favorites`
- `/account/searches`
- `/account/messages`
- `/account/viewings`
- `/account/offers`
- `/account/profile`
- `/account/security`
- `/account/privacy`
- `/sell` İlan yayınla (C2C)
- `/about`
- `/legal/kvkk`
- `/legal/terms`
- `/legal/cookies`
- `/help`

Admin tarafı `/admin/*` altında.
