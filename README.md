# LandX — AI-First Arsa Pazaryeri

Frontend-only, enterprise-ready SaaS (mock) for Türkiye land marketplace.  
Live: <https://karacaismail.github.io/landxpanelpages/>

## Yığın
- **Vite 5 + React 18 + TypeScript 5**
- **Tailwind CSS + SCSS tokens + Flowbite React + Phosphor Icons**
- **react-router-dom v6** (HashRouter for GH Pages)
- **Zustand** state, **TanStack Query** & **Table**, **React Hook Form + Zod**
- **i18next** (TR/EN), **date-fns**, **Recharts**, **Leaflet/react-leaflet**
- **@faker-js/faker (tr)** deterministik seed
- **Vitest + Testing Library** birim test

Frontend-only — gerçek backend yok. MSW veya doğrudan seed kullanılıyor.

## Hızlı Başlangıç

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:5173/landxpanelpages/
```

## Komutlar

- `npm run dev` — geliştirme
- `npm run build` — typecheck + üretim
- `npm run build:force` — sadece üretim (CI hızlı yol)
- `npm run preview` — dist önizleme
- `npm test` — Vitest
- `npm run typecheck` — TS tip kontrolü

## Klasör

```
src/
├─ types/           Domain types
├─ data/            Faker generators + seed
├─ store/           Zustand slices
├─ lib/
│   ├─ ai/          mock LLM + nl-parser + value-estimator + risk-scorer
│   ├─ eca/         engine
│   ├─ tkgm/        mock API
│   └─ permissions/ rbac
├─ i18n/            TR/EN
├─ styles/          tokens, mixins, globals (SCSS)
├─ components/      ui, layout, data
└─ features/
    ├─ auth/        Login/Register
    ├─ public/      Home/Discover/ListingDetail/Account/...
    ├─ seller/      MyListings/Wizard/Offers/Performance
    └─ admin/       Approvals/Users/Rules/Audit/Reports/TKGM/Modules/...
```

## Roller
- **Alıcı**: keşfet, favori, kaydedilmiş arama, karşılaştır, mesaj, teklif, randevu
- **Satıcı/Emlakçı**: ilan yayını (6 adım wizard + AI), teklif yönetimi, performans
- **Yönetici**: onay kuyruğu, kullanıcılar, ECA kuralları, denetim izi, raporlar, TKGM, modüller

## AI dokunuşları
- Cmd/Ctrl+K **AI komut paleti** — niyet/komut tek alanda
- **AI yardımcı drawer** (Cmd/Ctrl+J) — sohbet / öneriler / otomasyonlar
- Her tabloda **AI öneri** ve **akıllı toplu aksiyon**
- Her formda **AI ile doldur** + **doğal dilden parse**
- Risk Badge + LIME-vari açıklama
- AI Değerleme bandı (alt/önerilen/üst + güven %)
- ECA görsel kural seti (24 hazır kural)

## Klavye kısayolları
Detay için `/help` rotasını ziyaret edin.

## Belgeler

| Doküman | İçerik |
|---|---|
| `docs/EXCEL_AUDIT.md` | Excel master tüm sayfalar + alan dökümü |
| `docs/MODULES.md` | 33 modül özet kataloğu |
| `docs/AI_FIRST_RULES.md` | UX/UED kuralları (header/footer/field-level) |
| `docs/ADAPTIVE_DESIGN.md` | Cihaz matrisi (320–2560px) |
| `docs/META_FRAMEWORK_2030.md` | Admin paneli vibecoding rehberi |
| `docs/FRONTPAGES_META_FRAMEWORK_2030.md` | Public storefront vibecoding rehberi |
| `docs/data-schema.md` | Mock veri şeması |
| `docs/component-architecture.md` | Bileşen hiyerarşisi |
| `docs/excel-mapping.md` | Excel modülü → UI route eşlemesi |
| `docs/eca-rules.md` | ECA dilbilgisi + 24 örnek kural |
| `docs/test-plan.md` | Vitest + Playwright |
| `docs/deploy.md` | CI + Pages |

## Deploy

GitHub Actions ile otomatik:
1. `main` dalına push → `.github/workflows/deploy.yml` build edip `dist/`'i Pages artifact olarak yükler
2. **GitHub repo Settings → Pages → Source: GitHub Actions** olarak ayarlayın (manuel adım; bir kez)
3. URL: `https://karacaismail.github.io/landxpanelpages/`

Yerel build & preview:
```bash
npm run build:force
npm run preview     # http://localhost:4173/landxpanelpages/
```

## Demo data (deterministik, seed=42)
- 60 kullanıcı (alıcı/satıcı/admin/moderator)
- 220 ilan (81 il, 8 imar, 5 tapu, 5 TKGM durumu)
- 120 teklif · 40 thread · 300 mesaj · 35 randevu · 80 favori · 22 kayıtlı arama
- 24 ECA kuralı (15 etkin) · 140 bildirim · 500 denetim olayı · 60 TKGM sorgusu

## Lisans
Demo amaçlı.
