# LandX Modül Kataloğu (kısa)

LandX, agent-native bir SaaS meta-framework üzerine kurulu bir arsa pazaryeri. Excel'deki 33 modül, **mimari altyapı katmanları** (K/I/A/S/D/O); UI yüzeyi ise **üç rolün gerçek user journey'leri**: alıcı, satıcı/emlakçı, yönetici.

Bu doküman 33 modülün hangi UI ekranına denk düştüğünü özetler.

## Katmanlar

| Kod | Ad | Modül sayısı |
|---|---|---|
| L0 | Kernel | 5 (K01–K05) |
| L1 | Identity | 5 (I01–I05) |
| L2 | Agent Runtime | 11 (A01–A11) |
| L3 | Application | 6 (S01–S06) |
| L4 | Data & Compliance | 3 (D01–D03) |
| L5 | Operations | 3 (O01–O03) |

## Modül → UI Eşlemesi

### L0 Kernel
- **K01 Plugin Lifecycle** → Admin/Settings/Plugins (mock pazaryeri)
- **K02 DocType Engine** → AI ile form üretimi (UI: Admin/Settings/SchemaInspect)
- **K03 Migration & Versioning** → Admin/Settings/SchemaHistory
- **K04 Hook & Event Bus** → ECA motoru (görünür)
- **K05 Service Container & Config** → Admin/Settings/PlatformConfig

### L1 Identity
- **I01 Tenant Lifecycle** → Admin/Settings/Tenant (multi-tenant kart)
- **I02 User & Identity Core** → Admin/Users + Profil
- **I03 Authentication & Sessions** → /auth (login/register/2fa/passkey)
- **I04 Permission Framework** → Admin/Roles (RBAC + ABAC editör)
- **I05 Multi-Tenant Isolation** → görsel rozet (admin'de)

### L2 Agent Runtime
- **A01 MCP Server Framework** → AI Asistan Drawer (sürekli yan panel)
- **A02 Tool Registry & Discovery** → Admin/Settings/AiTools
- **A03 Agent Identity & Scopes** → Admin/Roles içinde "agent scope" sekmesi
- **A04 Agent Memory** → Profil/Tercihler (kişisel bellek)
- **A05 Vector Store & Embedding** → Admin/Settings/AiSearch
- **A06 Prompt Library** → Admin/Settings/AiPrompts
- **A07 LLM Provider Abstraction** → Admin/Settings/AiProviders
- **A08 LLM Observability & Cost** → Admin/Reports/AiUsage
- **A09 Agent Orchestration** → AI Asistan akışları (HITL onay noktaları)
- **A10 Streaming & SSE** → mesaj akışı (typewriter)
- **A11 Conversation & Session** → AI Drawer geçmişi + sohbet

### L3 Application
- **S01 Auto REST API Engine** → görünmez (mock'lar arkada)
- **S02 Auto Admin UI Engine** → tüm admin tabloları
- **S03 Form & Validation** → tüm formlar
- **S04 Workflow & State Machine** → ilan/teklif/randevu statü akışları
- **S05 Notification Center** → /notifications + drawer
- **S06 Search & Discovery** → /discover + Cmd+K + global arama

### L4 Data & Compliance
- **D01 Audit Log & Event Sourcing** → Admin/Audit (immutable log, hash chain)
- **D02 PII Governance** → Profil/Gizlilik + Admin/Settings/PII
- **D03 Compliance Framework** → Admin/Compliance (KVKK/VERBİS/GDPR posture)

### L5 Operations
- **O01 Observability & SLO** → Admin/Reports/Health
- **O02 Plugin Marketplace** → Admin/Settings/PluginMarketplace
- **O03 Plugin Security Review** → Admin/Settings/PluginSecurity

## Rol → Modül Erişimi (özet)

| Rol | Birincil modüller | İkincil |
|---|---|---|
| Alıcı (Buyer) | S06, S03, S05, A01, A04, A09, A11, D02 | I02, I03 |
| Satıcı (Seller) | S02, S03, S04, S05, S06, A01, A09, A11 | I02, I03, D02 |
| Yönetici (Admin) | Hepsi | — |

## Detay tablolar

Tüm hücre seviyesinde alan listeleri için `EXCEL_AUDIT.md` referans. UI ekran haritası için `excel-mapping.md`.
