# AI-First UX/UI Kuralları (implementasyon referansı)

Bu doküman, **her sayfa ve bileşenin** uyması gereken davranış kurallarıdır.

## 1. Global Prensipler

1. **AI-first**: Her ekranda en az bir AI dokunuş noktası (öneri, doldur, özetle, açıkla, çevir).
2. **Mobile-first**: Önce 360w tasarla, sonra büyüt.
3. **1-tık aksiyon**: En sık 3 işlem her satırın `hover` veya `swipe`'ında doğrudan; 3 tık değil 1 tık.
4. **Klavye-dostu**: Tüm aksiyonlar `Tab`/`Enter`/`Esc`/`/`/`?`/`Cmd+K` ile erişilebilir.
5. **Açıklanabilir AI**: Her AI önerisi "neden bu?" tıklanabilir (LIME-vari).
6. **Geri al**: Tüm AI eylemleri `Cmd+Z` ile geri alınır (state stack).
7. **Boş durum AI'lı**: "Sonuç yok" değil — "AI önerir: filtreyi gevşet, X'i dene".
8. **Hata AI'lı**: "Bir şeyler ters gitti" değil — AI "şu olabilir, şu adımı dene" sunar.
9. **Loading**: skeleton placeholder + AI mesajı ("ilanları topluyorum, 1.2sn").

## 2. Header

```
[Logo]   [AI Komut Çubuğu — niyet/ara/komut tek alan]   [Dil/Tema] [Bildirim•] [Rol] [Avatar]
```

- **AI Komut Çubuğu** (orta) = arama + komut + niyet tek alanda. Placeholder rotation: "İstanbul'da 5M altı imarlı arsa…", "Yeni ECA kuralı ekle…", "Onay kuyruğunu özetle…"
- Mobilde: hamburger sol, marka orta, AI çubuk pin alt (klavye üstü).
- Tema/dil toggle ikon (Phosphor `sun`, `globe`).
- Bildirim: badge sayı + drawer.
- Rol değiştirici: dev modunda göründü; prod'da gerçek auth.
- Avatar: dropdown (profil, tercihler, KVKK, çıkış).

## 3. Footer / Status Bar

Sadece desktop+:

```
[AI•Bağlı]   [Son senkron: 3sn]   [Ortam: Demo]   [v0.1.0]   [Kısayollar ?]   [Yardım]
```

- AI nokta: yeşil bağlı, sarı yavaş, gri kapalı.
- Mobilde gizli; gerekirse "ℹ" ikonuyla açılır.

## 4. Layout / Rails

### Rail 1 (sol — birincil sidebar)
- Daraltılabilir (`Cmd+B`).
- Phosphor ikon + label (`md+`).
- Aktif item highlight + sol kenar bar.
- Mobilde drawer.

### Rail 2 (sağ — AI yardımcısı)
- Sürekli açık veya pinli.
- 3 sekme: **Sohbet** / **Öneriler** / **Otomasyonlar (ECA)**.
- Ekranı görür: aktif rota + seçili kayıt + son işlem.
- Mobilde FAB (`ph-sparkle`) → bottom-sheet.

### Breadcrumb
- `>` ayraçlı, tıklanabilir.
- AI özet ikonu sonda: tıkla → bu sayfanın 2 satırlık özeti.

### Empty/Loading/Error
- Boş: "henüz X yok. AI öneri: …"
- Loading: skeleton + AI "topluyorum" mesajı + bar.
- Error: kart + "şu olabilir:" listesi + "tekrar dene" + "AI'a sor".

## 5. Page-Level

- **Hero/üst bant**: niyet bildirimi (büyük input) veya AI öneri çubuğu (Top 3).
- **Sağ panel**: AI özeti — sayfanın 3-5 maddelik özetlemesi (ör. tablo özetleri, performans göstergeleri).
- **Sol panel**: bağlamsal filtre / kategori.
- **Alt**: ana içerik (tablo, liste, kart).
- **Floating action**: birincil aksiyon `bottom-right` (mobile-first prensip).

## 6. Field-Level (her form alanı)

Her alan için zorunlu davranışlar:

1. **AI Auto-fill**: Form üstünde "AI ile doldur" — bir tıkla mantıklı varsayılan.
2. **Inline validasyon**: Tuş üstünde 250ms debounce ile.
3. **Akıllı varsayılan**: Geçmiş kayıtlardan (mock) çıkarım.
4. **Doğal dilden parse**: "İstanbul Beykoz 5000 m² imarlı 2.5 milyon" → tüm alanlar.
5. **AI tooltip**: `ⓘ` ikonu — tıkla → AI bu alanı neden ister + örnek değer.
6. **Sürükle-bırak**: Görsel ve dosya alanları.
7. **OCR**: Tapu/belge alanları → mock OCR → form'a dolar.
8. **Erişilebilirlik**: `label`, `aria-describedby`, `aria-invalid`.

## 7. Tablo / Liste 1-Tık Kuralları

- Her satır hover'da en sık 3 aksiyon görünür (ikon-only desktop, swipe mobil).
- Tek tıkla durum geçişi (örn. "yayına al", "reddet").
- Bulk select → "akıllı toplu aksiyon" düğmesi — AI uygun aksiyonu önerir ("seçili 12'sinin 9'u onaylanabilir, kalan 3'üne not gerek").
- Sütun teleskobu: AI "şu sütunu da ekle" önerir (örn. risk skoru).
- Saved view: kişisel preset (ad ver, sticky).
- Export: tek tık (csv/xlsx/json — bilgi+sürüm).

## 8. ECA — Pre-built Örnek Kurallar (10'u yetiyor)

| # | Tetikleyici | Koşul | Aksiyon |
|---|---|---|---|
| 1 | `listing.created` | `tkgm = İpotekli` | `flag.review` + admin'e bildir |
| 2 | `listing.status_changed` | yeni status `Draft` & 7 gün geçti | satıcıya AI hatırlatma + öneri |
| 3 | `price.changed` | `|Δ| > %20` | "fiyat anomalisi" rozeti |
| 4 | `offer.received` | teklif > liste fiyatı × 0.9 | satıcıya 1-tık kabul önerisi |
| 5 | `message.received` | yanıt süresi > 24h | otomatik AI taslak yanıt |
| 6 | `user.kyc_status_changed` | KYC `Pending` & 48h | hatırlatma + adım listesi |
| 7 | `viewing.requested` | aynı ilan günde 3+ randevu | satıcıya "popüler" rozeti |
| 8 | `listing.viewed` | 24h içinde aynı user 5+ kez | "sıcak alıcı" tag |
| 9 | `tkgm.flag_changed` | yeni flag `Şerh` | yatırımcıya uyarı |
| 10 | `system.cron` (günlük) | `expires_at < +7d` ilanlar | satıcıya yenileme önerisi |

(20+'sini implementasyon zamanı `data/seed.ts`'te üreteceğiz.)

## 9. Erişilebilirlik (WCAG AA)

- Renk kontrastı **≥ 4.5:1** (büyük metin ≥ 3:1).
- Tüm interaktif elementlerde `focus-visible` halkası (2px, primary).
- Klavye sırası mantıklı; `Tab` trap yok modal hariç.
- ARIA: `role="dialog"`, `role="alert"`, `role="status"`, `aria-live="polite"`.
- `prefers-reduced-motion` saygısı (animasyonu kapat).
- Ekran okuyucu metni: her ikon-only buton için `aria-label`.

### Klavye kısayolları
- `Cmd/Ctrl+K` — Komut paleti
- `/` — Arama focus
- `?` — Kısayollar listesi
- `g d` — Discover, `g m` — Mesajlar, `g s` — Ayarlar, `g i` — İlanlarım, `g u` — Kullanıcılar (admin)
- `Cmd+B` — Sidebar toggle
- `Cmd+J` — AI drawer toggle
- `Cmd+/` — Sayfa içi yardım
- `Esc` — Modal/drawer kapat
- `n` — Yeni (sayfa-bağımlı: ilan, kural, kullanıcı)

## 10. Stil Tokenları

### Renk (HSL temelli, dark/light paralel)
- `--primary` #0e7c61 (toprak yeşili)
- `--accent` #c97f1d (sıcak toprak)
- `--success` #16a34a
- `--warning` #d97706
- `--danger` #dc2626
- `--info` #2563eb
- Surface: `--bg-1..3` (hierarchy), `--fg-1..3` (text hiyerarşi)
- Dark theme: aynı tokenlar, koyu zemin

### Spacing (4-base)
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80

### Radius
- `--r-1` 4px (chip)
- `--r-2` 8px (input, button)
- `--r-3` 12px (card)
- `--r-4` 16px (modal)
- `--r-pill` 999px

### Shadow
- `--sh-1` küçük çevre
- `--sh-2` kart
- `--sh-3` modal/popover

### Tipografi (Roboto)
- Body: `1rem` / `1.5` line-height / weight 400
- Small: `0.875rem` (yine min 14px ekranda ≥ 1rem isteği için body'i yükselt; ama küçük etiketler için izin verilebilir; alt sınır 14px = 0.875rem)
- H1: `clamp(1.5rem, 4vw, 2.25rem)`, weight 600
- H2: `clamp(1.25rem, 3vw, 1.75rem)`, weight 600
- H3: `clamp(1.125rem, 2.5vw, 1.375rem)`, weight 500
- Weight: 300/400/500/700 (min 300)
- Mono: ui-monospace (kodlar için)

### Motion
- `--m-fast` 120ms ease-out (hover)
- `--m-med` 200ms ease-out (state change)
- `--m-slow` 400ms ease-out (modal/drawer)
- `prefers-reduced-motion: reduce` → tümü 0ms

## 11. Boş / Hata / Yükleniyor Durumları

| Durum | Yapı |
|---|---|
| Boş | İkon (`ph-magnifying-glass`) + başlık + 2 satır açıklama + AI öneri kartı + birincil CTA |
| Yükleniyor | Skeleton + bar + "AI veriyi topluyor" metni |
| Hata | Kırmızı banner + sebep + AI "şu olabilir" listesi + "tekrar dene" + "AI'a sor" |
| Yetkisiz | 403 kart + "rolünüzde değil" + "yöneticiye sor" CTA |

## 12. Uygulama (her bileşen yazılırken kontrol)

- [ ] AI Suggest button var
- [ ] AI Fill button (form ise)
- [ ] Klavye odak akışı tam
- [ ] Mobil ve dark mode test edildi
- [ ] i18n key'leri TR/EN
- [ ] Boş/yüklenirken/hata durumları
- [ ] A11y attribute'lar
- [ ] Komut paletinde komut(lar) açık
