# Test Planı

## Strateji
- **Birim**: Vitest — saf fonksiyonlar (ECA, value-estimator, validators, AI mock router)
- **Bileşen**: Testing Library + Vitest — UI invariants (sidebar açılır, dark toggle, command palette)
- **E2E**: Playwright — 3 rol smoke (chromium + mobil viewport)

## Birim — Kapsam

| Modül | Test |
|---|---|
| `lib/eca/engine` | event → matching rule → action emission |
| `lib/ai/value-estimator` | il × imar × m² × emsal formülü çıktı aralığı |
| `lib/ai/risk-scorer` | TKGM/imar/borç → skor 0-100 |
| `lib/ai/mock-llm` | komut → uygun scripted yanıt |
| `lib/tkgm/mock-api` | parsel sorgu → simüle yanıt + hata kodları |
| `lib/permissions/rbac` | rol × kaynak × eylem → izin kararı |
| `data/generators/*` | deterministik seed üretimi (aynı seed → aynı çıktı) |
| `mocks/handlers/*` | filter/sort/pagination doğru |
| `utils/format` | TR locale para, m², tarih |

Hedef: 80%+ critical path coverage.

## Bileşen — Kapsam

- `<AppShell>` Sidebar açılır/kapanır, BottomNav görünür xs, header sticky
- `<CommandPalette>` Cmd+K açar, arama filtreler, Enter çalıştırır
- `<AiAssistantDrawer>` 3 sekme, mesaj gönder mock
- `<DataTable>` filter, sort, bulk select, export
- `<ListingCard>` 1-tık fav/karşılaştır/randevu
- `<RiskBadge>` skor → renk + explain popover
- `<ListingWizard>` 6 adım navigate + autosave

## E2E — 3 Rol Smoke

### Buyer
1. `/auth` → Login as buyer (mock)
2. `/discover` → niyet çubuğuna "istanbul beykoz 5m altı imarlı" yaz
3. Sonuç sayısı > 0 görmeli
4. İlk ilana tıkla → detay açılır
5. "Kaydet" tıkla → fav listesinde görünmeli
6. "Karşılaştır" 2 ilan ekle → `/compare` 2 sütun
7. Mesaj gönder mock → outbox'a düşer

### Seller
1. Login as seller
2. `/seller/listings` → "Yeni" tıkla
3. Wizard adım 1 konum → 6 önizle → yayınla
4. İlan "Pending" status'ta my-listings'te görünmeli
5. Gelen teklif → tek tık kabul → status değişir

### Admin
1. Login as admin
2. `/admin/approvals` → bekleyen listele
3. "AI özet" tıkla → risk skoru + neden görünür
4. Bulk select 3 ilan → onayla → audit log'a düşer
5. `/admin/rules` → yeni ECA kural oluştur (event, condition, action) → kaydet → liste

### Mobil viewport
- 375×667 her senaryoyu da çalıştır: bottom nav görünür, sidebar drawer açılır

## CI
- Vitest çalışır (`npm test`)
- Playwright manuel (ağır), CI'da sadece chromium 1280×800 ve 375×667

## Manuel kontrol checklist (her sayfa)
- Empty / loading / error
- Mobile 360w
- Dark mode
- Klavye Tab / Esc / Enter
- i18n EN'e geçişte taşma yok
- Phosphor + Roboto FOUC yok
