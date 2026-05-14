# Bileşen Mimarisi

Bileşen hiyerarşisi, props ve state davranış kuralları. ASCII wireframe yok — sözel.

## Üst düzey ağaç

```
<App>
 ├ <I18nProvider>
 ├ <ThemeProvider>            // data-theme attr + system preference
 ├ <QueryProvider>            // TanStack Query
 ├ <ToastHost>
 └ <RouterProvider>           // createHashRouter
     ├ <PublicLayout>          // header + footer + content
     │   ├ HomePage
     │   ├ DiscoverPage
     │   ├ ListingDetailPage
     │   ├ ComparePage
     │   ├ AuthPage(s)
     │   ├ AccountLayout
     │   │   └ AccountTabPages
     │   ├ LegalPages
     │   └ SellPage             // C2C ilan yayınla wizard
     └ <PanelLayout>            // sidebar + top + bottom + assistant
         ├ <SellerSection>      // /seller/*
         └ <AdminSection>       // /admin/*
```

## Ortak bileşenler

### AppShell prop interface
```ts
interface AppShellProps {
  variant: 'public' | 'seller' | 'admin';
  role: Role;
  user: User | null;
  onCommand(cmd: Command): void;
  children: ReactNode;
}
```

### Sidebar
- Props: `items[]`, `collapsed`, `onCollapse()`, `activeKey`
- State: kontrol edilen (top-level layout'tan)
- Davranış: mobil drawer, desktop icon-only, xl full

### TopBar
- Props: `brand`, `commandBar`, `actions[]`, `user`
- Sticky top + safe-area

### BottomNav
- Props: `items[]` (4-5)
- Sadece mobil

### CommandPalette
- Props: `commands[]`, `onSelect`, `query`
- Açma: global Cmd+K (Zustand `useCommandPaletteOpen`)
- Sonuç sıralaması: AI mock (basit string match + ekran-aware boost)

### AiAssistantDrawer
- Props: `mode` (chat|suggest|automation), `context` (mevcut sayfa+seçimler)
- 3 sekme: Sohbet / Öneriler / Otomasyonlar

### DataTable
- Props: `<T>`, `columns: ColumnDef<T>[]`, `data`, `onRowClick`, `bulkActions`, `searchable`, `pagination`
- Built-in: filter, sort, bulk select, "AI öner" button, savedView dropdown, exportMenu
- Mobil: kart görünüm; lg+: tam tablo

### FilterBar / FilterDrawer
- Props: `schema` (alan tanımları), `value`, `onChange`
- AI parse: doğal dil → değerler

### FormField
- Props: `name`, `label`, `description`, `type`, `validation`, `helpTooltip`, `aiSuggest`
- AI Suggest: tıkla → öneri kart popover

### RiskBadge
- Props: `score: 0-100`, `reasons: string[]`
- Renkler: 0-30 yeşil, 31-60 sarı, 61-100 kırmızı
- Click → explain popover

### StatusBadge
- Props: `status` (union)
- Renk eşlemesi + ikon

### ListingCard
- Props: `listing`, `variant: 'grid'|'list'|'compact'`, `actions: {fav, compare, share, viewing}`
- Sticky alt aksiyon bar mobil

### MapView
- Props: `points[]`, `selectedId`, `onSelect`
- Leaflet + OSM tile

### WizardStep
- Props: `step`, `total`, `title`, `description`, `onNext`, `onBack`, `valid`
- Autosave: 1sn debounce

## State haritası (Zustand slice'lar)

| Slice | Ne saklar |
|---|---|
| `auth` | currentUser, role, login/logout |
| `ui` | theme, sidebarCollapsed, assistantOpen, commandPaletteOpen |
| `ai` | history, suggestions cache |
| `notifications` | listesi, unreadCount |
| `compare` | listingIds (max 4) |
| `favorites` | listingIds (Set) |
| `savedSearches` | id list |
| `eca` | rules, history |
| `audit` | son N olay (preview) |
| `tkgm` | son sorgular |

## Davranış invariant'ları

- `theme` değişimi `<html data-theme>` ve Tailwind `dark` class'ını eşit zamanlı değiştirir
- `assistantOpen` Cmd+J ile toggle
- `sidebarCollapsed` Cmd+B
- `commandPaletteOpen` Cmd+K (yakalama: dev tools'a izin verme; sayfa içi açar)
- `favorites` LocalStorage'a persist olur (`landx:favorites`)
- `compare` URL hash'inde değil ama LocalStorage'da
- Theme: system preference ilk yüklemede; sonradan kullanıcı tercihi LS'te (`landx:theme`)

## Lazy loading

- Tüm `/admin/*` lazy chunks
- Map components lazy
- ECA editor lazy
- Charts lazy

## Hata sınırı

- Top-level `<ErrorBoundary>` — kullanıcı dostu hata sayfası + "AI'a sor" CTA + "Geri dön"
