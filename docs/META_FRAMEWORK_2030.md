# META FRAMEWORK 2030 — Admin Paneli Vibecoding Rehberi

Bu doküman, **admin tarafının** (panel, yönetim, operasyon) 2030 vizyonunu ve bunu **bugün** nasıl somutlaştıracağımızı tarif eder. Her bileşen bu çerçeveye uyar.

## 1. 2030 Vizyonu (gerçekçi, fütürist değil)

- **Agentic UI**: Kullanıcı niyet bildirir, AI alt görevleri yürütür, kullanıcı sadece karar noktalarında onaylar.
- **Sürekli bağlamlı asistan**: Ekranda ne olduğunu görür; sayfa değiştirebilir, alanı doldurabilir.
- **Çoklu modalite**: Sesli, görsel, dokunma. Klavye/mouse temel kalır.
- **Proaktif öneri**: Kullanıcı sormadan, AI "şu önemli" diye uyarır.
- **Gizlilik korumalı kişisel model**: Kullanıcı tercihleri yerelde, opt-in dış model.

Sonuç: **Form doldurma yerine niyet bildirme**, **tablo tarama yerine sonuç isteme**, **ayar değiştirme yerine tercih belirtme**.

## 2. CRUD/Form/Table 2030'da nasıl?

### Klasik CRUD ölmez — **katmanlanır**
- Altta veri katmanı (yine CRUD).
- Üstte niyet/akış katmanı (AI).
- Aynı kaydı **3 yoldan** düzenleyebilirsin: klasik form, AI sohbet, doğal dil parse.

### AI-first CRUD
- Niyet komutu → "İlan onay kuyruğundan tüm İstanbul Beykoz'lu olanları onaylayalım"
- Önizleme → "12 kayıt eşleşti, riski yüksek 1 var; bu hariç 11'i onaylanacak"
- Onay (HITL) → tek tık
- Güvenli undo → 5 sn içinde geri al; sonra undo-stack'te kalır
- Denetim izi → audit log otomatik

### AI-first Form
```
┌─────────────────────────────────────────┐
│ Doğal dil giriş (tek alan)             │
│ "Beykoz tarla 5000m2 imarlı 2.5M"      │
│                          [parse et]    │
├─────────────────────────────────────────┤
│ AI taslağı (önizleme, düzenlenebilir): │
│ • İl: İstanbul                          │
│ • İlçe: Beykoz                          │
│ • m²: 5000                              │
│ • İmar: Konut imarlı                    │
│ • Fiyat: 2.500.000 ₺                    │
│ ...                                     │
│  [Düzenle]  [Onayla]                    │
└─────────────────────────────────────────┘
```
+ klasik form altında her zaman erişilebilir.

### AI-first Table
- **Sorgu çubuğu** = arama + filtre + aggregation + grafik tek alanda
- "İl bazında toplam ilan değeri" → toplam tablosu + grafik
- "Onay bekleyen ilanları risk skoruna göre sırala" → tablo otomatik dönüşür
- Group-by AI önerisi: "Veriniz **şu sütunla gruplandığında** anlamlı oluyor"
- Sütun teleskobu: AI "şu sütunu da göster"
- Satır gözlem paneli: tek tık → sağda yan panel açık (detay + AI özet + 1-tık aksiyonlar)

## 3. Meta Framework — 7 Katman

### A. Niyet Katmanı (Intent Layer)
- Tek **komut çubuğu** (Cmd+K) tüm modülleri görür.
- Sesli komut (mock — Web Speech API placeholder).
- Eylem önerisi: ekran-aware.

### B. Akış Katmanı (Flow Layer)
- Çok adımlı görev → AI ilerletir, kullanıcı karar noktalarında onaylar (HITL).
- Görev cards: "Bu hafta 12 ilan onayı, 3 KYC, 2 dispute" → AI tek tık ile akışı başlatır.

### C. Veri Katmanı (Data Layer)
- CRUD aşağıda, ama her şey "kayıt" değil **olay/karar/akış** olarak modellenir.
- Event sourcing → audit log.
- ECA kuralları üst katmanda.

### D. Görüntü Katmanı (View Layer)
- Aynı veri farklı görünümlerde: Tablo, Kart, Liste, Zaman çizgisi, Harita, Kanban, Galeri.
- AI veriye en uygun görünümü önerir; kullanıcı tek tık geçer.

### E. Asistan Katmanı (Assistant Layer)
- Her sayfada bağlam tabanlı yan panel.
- Ekranda gördüğünü görür; ekranı değiştirebilir.
- 3 mod: **Sohbet** / **Öneri** / **Otomasyon**.

### F. Bellek Katmanı (Memory Layer)
- Kullanıcı tercihleri, sık sorgular, kişisel kestirmeler.
- Yerelde (LocalStorage / IndexedDB) ve sunucuda (opt-in).
- "Bunu tekrar gösterme" — gerçekten saklı kalır.

### G. Güven Katmanı (Trust Layer)
- Her AI eylemi **açıklanabilir, geri alınabilir, denetim izli**.
- "Neden bunu önerdin?" → AI gerekçe + veri kaynağı.
- Risk seviyesi: yüksek riskli aksiyonlar 2x onay (mock 2FA tetikleyici).

## 4. Header (admin)

```
[Logo+Tenant]  [AI Komut Çubuğu — mod: ara/yarat/akış]  [Rol•Admin] [Bildirim•12] [Avatar▾]
```

- Tenant adı (multi-tenant rozet).
- Komut çubuğu mod toggle: `Ara` / `Yarat` / `Akış başlat`.
- Bildirim: AI ile gruplanmış (önem sırası).

## 5. Footer / Status Bar (admin)

```
[AI•Bağlı]  [Senkron: 3sn]  [Demo Veri]  [v0.1.0]  [Kısayollar?]  [Geri Bildirim]
```

## 6. Rail 1 — Birincil Sidebar (admin)

Phosphor ikon + label. Daraltma `Cmd+B`.

- Genel Bakış (`ph-house`)
- Onaylar (`ph-check-square`) — badge sayı
- İlanlar (`ph-map-pin`) — tüm sistem
- Kullanıcılar (`ph-users`)
- Roller & İzinler (`ph-shield-check`)
- ECA Kuralları (`ph-flow-arrow`)
- Denetim İzi (`ph-clock-counter-clockwise`)
- Raporlar (`ph-chart-bar`)
- TKGM (`ph-buildings`)
- Modüller (`ph-puzzle-piece`)
- Bildirim Şablonları (`ph-bell-simple`)
- Ayarlar (`ph-gear`)
- Geri (`ph-arrow-left-circle`) → public site

Aktif item: sol kenar bar + arka plan.

## 7. Rail 2 — İkincil Sidebar (admin)

Bağlamsal: aktif modülün alt bölümleri + son baktıkların + AI önerisi.

Örnek (Onaylar sayfasında):
- Bekleyen (143)
- Onaylanan (1.2k)
- Reddedilen (89)
- **AI önerisi**: "Bu 7 ilan acil bakım gerektiriyor"

## 8. Asistan Paneli (sağ)

3 sekme:

1. **Sohbet** — serbest soru/cevap.
2. **Öneriler** — AI'ın bu sayfada önerdiği 3-5 aksiyon.
3. **Otomasyonlar (Akıllar)** — ECA kuralları arasından bu sayfa ile alakalı olanlar.

Mobilde FAB → bottom-sheet.

## 9. Bildirimler (admin)

- Ham bildirim yığını yok.
- AI **gruplama** + **önceliklendirme** + **zaman ölçeği**:
  - **Şimdi** — acil eylem
  - **Yarın** — planlanmış
  - **Sonra** — bilgi
- Yan panel + bildirim merkezi (full sayfa).
- Her bildirim 1-tık aksiyon içerir.

## 10. Ayarlar

- Klasik ayar sayfası **alt seçenek** olarak kalır.
- Üstte: "Tercih bildir" alanı — "AI sadece İstanbul Anadolu yakası göstersin" → AI ilgili ayarları yapar + audit log'a yazar.

## 11. User Journeys

### İlan Veren (Emlakçı / Birey)
> "İstanbul Beykoz'da 5000 m² imarlı tarlamı satışa koymak istiyorum"

1. Niyet → niyet çubuğuna yaz veya "Yeni ilan" tıkla
2. AI form taslağı (doğal dil parse) → düzenle
3. Tapu numarası iste → TKGM doğrulama (mock)
4. AI fiyat önerisi (alt/üst/önerilen)
5. Görseller yükle (drag-drop) — AI sıralama
6. Önizle → yayınla
7. Sonra: gelen mesaj/teklif/randevu — tek panelde

### Alıcı
> "1-1.5 M TL bütçeli, İstanbul, denize 30 km, imarlı, 5 yılda değer kazanır"

1. AI niyet çubuğuna yaz
2. AI öneri listesi (Top 10) + uygunluk skoru
3. Karşılaştır (4'e kadar)
4. Detay → AI özeti + risk + değerleme bandı
5. Mesaj / teklif / randevu — 1-tık

### Yönetici
> "Bu hafta hangi ilanları riskli görüyorsun?"

1. AI sohbet → rapor üretir (tablo + grafik)
2. Tek tık aksiyonlar: incele / onay / red / uyarı
3. Bulk select → akıllı toplu aksiyon
4. Audit log otomatik

## 12. Mobile-First AI-First Prensipler

- Tek elle ulaşılabilir alt aksiyon bar (FAB)
- AI komut çubuğu klavye üstüne pinli
- Sesli giriş ana giriş yöntemi (mock)
- Her ekran 3 saniyede 1 anlamlı aksiyon önerir
- Çevrimdışı taslaklar (LocalStorage)
- Düşük veri modu (görseller compress; placeholder ile)

## 13. Başarı Metrikleri (mock dashboard'da göster)

- **Tık başına aksiyon**: 1.2 (hedef <1.5)
- **Task completion time**: medyan 38 sn
- **Tek-tık başarı oranı**: %72
- **AI öneri kabul oranı**: %58
- **Kullanıcı tatmin skoru**: 4.6 / 5

## 14. Anti-Patternler

- Derin menü
- Çok adımlı sihirbaz (≥ 6 adım büyük kötülük; biz 6'da kapatıyoruz)
- Modal içinde modal
- Devasa form (1 sayfada ≥ 30 alan)
- 20+ sütunlu tablo (toggle ile gizle)
- Ayar enflasyonu (50+ ayar)
- Bildirim spam'i (AI gruplaması zorunlu)
- AI "bilmiyorum" yerine uydurma (mock LLM eğitim verisi sadece bilinen şeyleri yanıtlar)

## 15. Vibecoding rehberi (her bileşen yazılırken)

- Her bileşen önce "niyet" sorusu sorar
- Her form 1 alanlı doğal dil + parse edilen önizleme yapısıyla başlar
- Her tablo üzerinde komut çubuğu vardır
- Her boş durum AI önerisi içerir
- Her hata "ne yapayım?" AI öneri sunar
- Hiçbir aksiyon onay olmadan kalıcı değildir (5 sn undo)
- Hiçbir yıkıcı aksiyon (delete, force-push) tek tık değildir
