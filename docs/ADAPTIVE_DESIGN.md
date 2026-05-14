# Adaptive Design — Cihaz Matrisi

Responsive değil, **adaptive**. Her breakpoint'te bileşenin **yapısı** değişir, sadece ölçek değil.

## Breakpoint Tablosu

| Cihaz | min-width | max-width | Orientation | Notlar |
|---|---|---|---|---|
| `xxs` Küçük telefon | 320px | 374px | portrait/landscape | iPhone 4/5, eski Android. Ultra-compact mod. |
| `xs` Telefon | 375px | 479px | portrait/landscape | iPhone SE/12/13/14/15/16, Galaxy S |
| `sm` Büyük telefon / phablet | 480px | 599px | portrait | Pixel XL, Note dikey |
| `md` Küçük tablet | 600px | 767px | portrait/landscape | Nexus 7, küçük Android tab |
| `lg` Tablet | 768px | 1023px | portrait/landscape | iPad, iPad Pro dikey |
| `xl` Küçük laptop | 1024px | 1365px | landscape | 13" MacBook, eski monitör |
| `2xl` Laptop | 1366px | 1599px | landscape | 15–16" laptop |
| `3xl` Desktop | 1600px | 2559px | landscape | Standart monitör |
| `tv` 10-foot UI | 2560px | — | landscape | 4K/8K TV, ultra-wide |

## Tipografi (clamp ölçeği)

Roboto, min 1rem (16px) — asla aşağı inme.

```scss
$fs-body:  clamp(1rem, 0.95rem + 0.2vw, 1.0625rem);
$fs-small: clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem); // küçük etiketler (alt sınır 14px)
$fs-h1:    clamp(1.5rem, 1.25rem + 1.5vw, 2.5rem);
$fs-h2:    clamp(1.25rem, 1.05rem + 1.2vw, 2rem);
$fs-h3:    clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
$fs-tv:    clamp(1.25rem, 1.05rem + 0.4vw, 1.5rem); // TV body
```

TV'de body büyütülür, focus halkası kalınlaşır.

## Container

| BP | max-width |
|---|---|
| xxs–sm | 100% (16-20px gutter) |
| md | 100% (24px gutter) |
| lg | 720px |
| xl | 1024px |
| 2xl | 1200px |
| 3xl | 1440px |
| tv | 1920px |

## Grid

- xxs/xs: 1 sütun (single column)
- sm: 1 (form), 2 (kart)
- md: 2 sütun
- lg: 2–3 sütun
- xl: 3–4 sütun
- 2xl: 4 sütun + side panels
- 3xl: 4 sütun + side panels + secondary rail
- tv: 3–4 sütun büyük + minimal kromat

## Sidebar Davranışı

| BP | Birincil sidebar | İkincil sidebar |
|---|---|---|
| xxs–xs | drawer (off-canvas) | bottom-sheet (yan sekme) |
| sm | drawer | bottom-sheet |
| md | icon-only (60px) | inline drop |
| lg | icon-only (60px) | side drawer (320px) |
| xl | full (240px) | side drawer |
| 2xl | full (240px) | pinned right (320px) |
| 3xl | full (240px) | pinned right (360px) |
| tv | full (320px) — büyük font | pinned right (400px) |

## Header Davranışı

| BP | Yapı |
|---|---|
| xxs | compact: hamburger + marka + 1 ikon |
| xs | compact: hamburger + marka + 2 ikon + AI çubuk pin alt |
| sm | compact + AI çubuk pin alt |
| md | standart: marka + AI çubuk + 3 ikon |
| lg+ | extended: marka + AI çubuk (geniş) + tüm aksiyonlar |
| tv | büyük marka + büyük AI çubuk + büyük ikonlar |

## Footer / Status Bar

| BP | Davranış |
|---|---|
| xxs–sm | gizli (info ikonuyla aç) |
| md | scroll-revealed (aşağı kayınca gizle) |
| lg+ | sticky (alt) |
| tv | minimal — sürüm + AI durumu |

## Tablo Davranışı

| BP | Format |
|---|---|
| xxs–xs | **Kart görünüm** — her satır vertical kart |
| sm | Kart görünüm |
| md | Yatay scroll + sticky ilk sütun |
| lg | Yatay scroll + sticky 2 sütun |
| xl+ | Tam tablo |
| tv | Tam tablo + büyük satır yüksekliği |

## Form Düzeni

| BP | Düzen |
|---|---|
| xxs–sm | 1 sütun, step wizard öncelikli |
| md | 1 sütun (geniş), 2 küçük alan inline |
| lg+ | 2 sütun (label sola) veya 1 sütun (label üstte) seçilebilir |
| tv | 1 sütun büyük tipografi |

## Modal / Dialog

| BP | Davranış |
|---|---|
| xxs–sm | bottom-sheet (alttan açılır, swipe ile kapatılır) |
| md | center modal (margin) |
| lg+ | center modal (kompakt) veya side-drawer (geniş) |
| tv | fullscreen yumuşak (TV uzaktan kumanda dostu) |

## AI Yardımcı Paneli

| BP | Yer |
|---|---|
| xxs–sm | FAB sağ alt → bottom-sheet |
| md | FAB → side-drawer |
| lg | side-drawer (sağ) — açıp kapanabilir |
| xl+ | pinned-right kalıcı (320–400px) |
| tv | pinned-right büyük (400px) |

## Touch Target

| Bağlam | Min |
|---|---|
| Mobile (touch) | 44×44px (Apple HIG) |
| Tablet | 40×40px |
| Desktop (mouse) | 32×32px |
| TV (remote) | 64×64px + 3px focus ring |

## Klavye / İşaretçi / Dokunmatik

- Touch: tap, swipe, long-press, pinch (harita)
- Mouse: click, hover, scroll, drag
- Klavye: Tab, Enter, Esc, arrow keys, Cmd+K
- TV remote: arrow + OK + Back + voice (mock)

## Image Density

- Mobile: 1x (small), responsive `srcset` 2x/3x
- Tablet/laptop: 2x
- Desktop: 2x–3x
- TV: 3x büyük; lazy load eşik 200px viewport öncesi

## Safe Area (iOS)

- Tüm sticky bar'lar `env(safe-area-inset-*)` saygısı.
- `viewport-fit=cover` `index.html`'de.

## Orientation

Portrait vs Landscape:
- Phone landscape: header compact + min tipografi + dual column kart (small)
- Tablet landscape: 2 sütun + side rail
- TV: sadece landscape

## SCSS Yapısı

```
src/styles/
├─ tokens/
│  ├─ _breakpoints.scss   // $bp-map + @mixin bp($key, $orientation: null)
│  ├─ _typography.scss    // clamp ölçeği
│  ├─ _spacing.scss
│  ├─ _colors.scss        // light + dark
│  ├─ _radii.scss
│  ├─ _shadows.scss
│  └─ _motion.scss
├─ adaptive/
│  ├─ _xxs.scss
│  ├─ _xs.scss
│  ├─ _sm.scss
│  ├─ _md.scss
│  ├─ _lg.scss
│  ├─ _xl.scss
│  ├─ _2xl.scss
│  ├─ _3xl.scss
│  └─ _tv.scss
├─ mixins/
│  ├─ _a11y.scss          // focus-visible, sr-only
│  └─ _layout.scss        // container, stack, grid
└─ globals.scss           // root, reset, theme vars
```

## Örnek `bp()` mixin

```scss
$bp-map: (
  xxs: 320px, xs: 375px, sm: 480px, md: 600px,
  lg: 768px, xl: 1024px, 2xl: 1366px, 3xl: 1600px, tv: 2560px
);

@mixin bp($key, $orientation: null) {
  $min: map-get($bp-map, $key);
  @if $orientation {
    @media (min-width: $min) and (orientation: $orientation) { @content; }
  } @else {
    @media (min-width: $min) { @content; }
  }
}

// Kullanım
.card {
  padding: 12px;
  @include bp(md)  { padding: 16px; }
  @include bp(xl)  { padding: 20px; }
  @include bp(tv)  { padding: 32px; }
}
```

## Test edilecek viewport'lar (E2E)

- 320×480 (iPhone 4 dikey)
- 375×667 (iPhone SE dikey)
- 390×844 (iPhone 14 dikey)
- 428×926 (iPhone 16 Pro Max dikey)
- 768×1024 (iPad dikey)
- 1024×1366 (iPad Pro dikey)
- 1366×768 (laptop)
- 1920×1080 (desktop)
- 2560×1440 (TV / 4K — büyütülmüş)

Her smoke testte 3 viewport: xs (375×667), md (768×1024), 2xl (1366×768).
