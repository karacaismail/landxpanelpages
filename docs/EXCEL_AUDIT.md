# LandX Excel Master — Eksiksiz Denetim (EXCEL_AUDIT)
Kaynak dosya: `LLandX_Modülleri.xlsx`

**Toplam sheet sayısı:** 34

## Sheet Listesi

1. **Ozet** — 46 satır × 13 sütun
2. **K01 Plugin Lifecycle Manager** — 61 satır × 13 sütun
3. **K02 DocType Engine (Schema Runt** — 47 satır × 13 sütun
4. **K03 Migration & Versioning Engi** — 38 satır × 13 sütun
5. **K04 Hook & Event Bus** — 40 satır × 13 sütun
6. **K05 Service Container & Configu** — 44 satır × 13 sütun
7. **I01 Tenant Lifecycle Management** — 47 satır × 13 sütun
8. **I02 User & Identity Core** — 53 satır × 13 sütun
9. **I03 Authentication & Sessions** — 57 satır × 13 sütun
10. **I04 Permission Framework** — 49 satır × 13 sütun
11. **I05 Multi-Tenant Isolation** — 43 satır × 13 sütun
12. **A01 MCP Server Framework** — 47 satır × 13 sütun
13. **A02 Tool Registry & Discovery** — 50 satır × 13 sütun
14. **A03 Agent Identity & Capability** — 55 satır × 13 sütun
15. **A04 Agent Memory Layer** — 54 satır × 13 sütun
16. **A05 Vector Store & Embedding Pi** — 54 satır × 13 sütun
17. **A06 Prompt Library & Versioning** — 59 satır × 13 sütun
18. **A07 LLM Provider Abstraction** — 49 satır × 13 sütun
19. **A08 LLM Observability & Cost Tr** — 65 satır × 13 sütun
20. **A09 Agent Orchestration & Workf** — 55 satır × 13 sütun
21. **A10 Streaming & SSE Primitives** — 36 satır × 13 sütun
22. **A11 Conversation & Session Mana** — 43 satır × 13 sütun
23. **S01 Auto REST API Engine** — 38 satır × 13 sütun
24. **S02 Auto Admin UI Engine** — 42 satır × 13 sütun
25. **S03 Form & Validation Framework** — 33 satır × 13 sütun
26. **S04 Workflow & State Machine** — 43 satır × 13 sütun
27. **S05 Notification Center** — 39 satır × 13 sütun
28. **S06 Search & Discovery** — 35 satır × 13 sütun
29. **D01 Audit Log & Event Sourcing** — 52 satır × 13 sütun
30. **D02 PII Governance & Data Class** — 49 satır × 13 sütun
31. **D03 Compliance Framework (KVKK ** — 40 satır × 13 sütun
32. **O01 Observability & SLO Monitor** — 45 satır × 13 sütun
33. **O02 Plugin Marketplace** — 54 satır × 13 sütun
34. **O03 Plugin Security Review & Sa** — 47 satır × 13 sütun

---

## Sheet: Ozet

**Boyut:** 46 satır × 13 sütun

### İlk 5 satır (metadata)

```
LandX — Agent-Native Meta-Framework Modül Kataloğu |  |  |  |  |  |  |  |  |  |  |  | 
FastAPI + PostgreSQL + React Router v7 + Flowbite  |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
Katmanlar |  |  |  |  |  |  |  |  |  |  |  | 
L0 | Çekirdek | Kernel | Plugin yaşam döngüsü, declarative schema motoru, h |  |  |  |  |  |  |  |  | 
```

### Veri (header satır 1)

| LandX — Agent-Native Meta-Framework Modül Kataloğu |  |  |  |  |  |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FastAPI + PostgreSQL + React Router v7 + Flowbite altyapısında, AI-first agent e |  |  |  |  |  |  |  |  |  |  |  |  |
| Katmanlar |  |  |  |  |  |  |  |  |  |  |  |  |
| L0 | Çekirdek | Kernel | Plugin yaşam döngüsü, declarative schema motoru, hook bus, service container — t |  |  |  |  |  |  |  |  |  |
| L1 | Kimlik ve Kiracılık | Identity | Multi-tenant izolasyon, kullanıcı + agent kimliği, yetkilendirme, kimlik doğrula |  |  |  |  |  |  |  |  |  |
| L2 | Agent Çalışma Zamanı | Agent Runtime | MCP-native tool registry, prompt library, vector store, memory layer, LLM observ |  |  |  |  |  |  |  |  |  |
| L3 | Uygulama Yüzeyi | Application | Auto-generated REST API, admin UI engine, form/validation, workflow, search, med |  |  |  |  |  |  |  |  |  |
| L4 | Veri, Uyumluluk ve Güvenlik | Data & Compliance | Audit log, PII governance, encryption, KVKK/GDPR uyumluluk framework'ü, secrets  |  |  |  |  |  |  |  |  |  |
| L5 | Operasyon ve Marketplace | Operations | Observability, SLO monitoring, plugin marketplace, plugin güvenlik denetimi, dep |  |  |  |  |  |  |  |  |  |
| ID | Layer | Modül | Faz | Öncelik | Sahip Squad | Yetenek | İşlem | Alan | Zorunlu | AI | MCP | Açıklama / KPI |
| K01 | L0 | Plugin Lifecycle Manager | Faz 1 | P0 | Kernel Squad | 4.0 | 10.0 | 56.0 | 23.0 | 5.0 | 3.0 | Plugin keşfi, manifest doğrulama, install/upgrade/uninstall, dependency resoluti |
| K02 | L0 | DocType Engine (Schema Runtime) | Faz 1 | P0 | Kernel Squad | 4.0 | 7.0 | 42.0 | 19.0 | 2.0 | 4.0 | Deklaratif DocType tanımı → runtime'da DB tablosu, REST endpoint, validation, ad |
| K03 | L0 | Migration & Versioning Engine | Faz 2 | P0 | Kernel Squad | 4.0 | 5.0 | 33.0 | 12.0 | 5.0 | 0.0 | Plugin sürüm geçişlerinde DB schema migration, data migration, rollback. Frappe  |
| K04 | L0 | Hook & Event Bus | Faz 1 | P0 | Kernel Squad | 3.0 | 6.0 | 35.0 | 13.0 | 0.0 | 1.0 | Plugin'lerin birbirini bilmeden davranış genişletmesi için hook (sync) ve event  |
| K05 | L0 | Service Container & Configuration | Faz 2 | P1 | Kernel Squad | 4.0 | 7.0 | 39.0 | 13.0 | 1.0 | 3.0 | Dependency injection container, hierarchical configuration (global → tenant → us |
| I01 | L1 | Tenant Lifecycle Management | Faz 1 | P0 | Identity Squad | 4.0 | 7.0 | 42.0 | 19.0 | 2.0 | 2.0 | Tenant (müşteri organizasyon) provisioning, suspend, archive, kota yönetimi. Mul |
| I02 | L1 | User & Identity Core | Faz 1 | P0 | Identity Squad | 4.0 | 8.0 | 48.0 | 27.0 | 1.0 | 1.0 | Bireysel kullanıcı, kurumsal kullanıcı, agent kullanıcı, system kullanıcı — heps |
| I03 | L1 | Authentication & Sessions | Faz 1 | P0 | Identity Squad | 4.0 | 9.0 | 52.0 | 21.0 | 4.0 | 2.0 | Password, OAuth, OIDC, magic link, passkey, API key, agent token — tek auth katm |
| I04 | L1 | Permission Framework | Faz 1 | P0 | Identity Squad | 4.0 | 8.0 | 44.0 | 23.0 | 1.0 | 2.0 | RBAC + ABAC + agent capability scopes. Agent kullanıcı adına çalışırken user'ın  |
| I05 | L1 | Multi-Tenant Isolation | Faz 2 | P0 | Identity Squad + Security Squad | 4.0 | 7.0 | 38.0 | 13.0 | 2.0 | 1.0 | Schema-per-tenant izolasyon, query interception, cross-tenant erişim tespiti, te |
| A01 | L2 | MCP Server Framework | Faz 1 | P0 | Agent Runtime Squad | 5.0 | 9.0 | 42.0 | 14.0 | 0.0 | 2.0 | Model Context Protocol native server. Plugin'lerin tanımladığı tool'lar otomatik |
| A02 | L2 | Tool Registry & Discovery | Faz 1 | P0 | Agent Runtime Squad | 5.0 | 7.0 | 45.0 | 21.0 | 4.0 | 5.0 | Plugin'lerin tanımladığı tool'ların merkezi kataloğu. Her tool: input/output sch |
| A03 | L2 | Agent Identity & Capability Scopes | Faz 1 | P0 | Agent Runtime Squad + Security Squad | 5.0 | 8.0 | 50.0 | 17.0 | 2.0 | 2.0 | Agent kimliği, capability scope binding, session-bound limit, blast-radius kontr |
| A04 | L2 | Agent Memory Layer | Faz 2 | P0 | Agent Runtime Squad | 5.0 | 7.0 | 49.0 | 10.0 | 7.0 | 2.0 | Short-term (conversation buffer), long-term (semantic), episodic (geçmiş etkileş |
| A05 | L2 | Vector Store & Embedding Pipeline | Faz 2 | P0 | Agent Runtime Squad + AI Squad | 5.0 | 7.0 | 49.0 | 15.0 | 2.0 | 4.0 | pgvector tabanlı vector storage, embedding job runner, model versioning, hybrid  |
| A06 | L2 | Prompt Library & Versioning | Faz 2 | P0 | AI Squad | 5.0 | 8.0 | 54.0 | 20.0 | 5.0 | 1.0 | Prompt'ların kod gibi versiyonlanması, A/B test, eval suite, drift detection, ro |
| A07 | L2 | LLM Provider Abstraction | Faz 1 | P0 | AI Squad | 4.0 | 7.0 | 44.0 | 9.0 | 2.0 | 1.0 | Anthropic, OpenAI, Azure OpenAI, Bedrock, lokal Ollama gibi sağlayıcıları tek so |
| A08 | L2 | LLM Observability & Cost Tracking | Faz 2 | P0 | AI Squad + Platform Ops Squad | 4.0 | 8.0 | 60.0 | 14.0 | 5.0 | 0.0 | Her LLM çağrısı: input/output, token count, latency, cost, trace, hallucination  |
| A09 | L2 | Agent Orchestration & Workflow | Faz 3 | P0 | Agent Runtime Squad + AI Squad | 5.0 | 8.0 | 50.0 | 22.0 | 2.0 | 2.0 | Çok-adımlı agent görevleri için workflow engine. Plan-execute-reflect döngüsü, a |
| A10 | L2 | Streaming & SSE Primitives | Faz 2 | P1 | Agent Runtime Squad | 4.0 | 7.0 | 31.0 | 13.0 | 0.0 | 0.0 | LLM token stream, tool execution progress stream, agent step stream için unified |
| A11 | L2 | Conversation & Session Management | Faz 2 | P0 | Agent Runtime Squad | 4.0 | 6.0 | 38.0 | 12.0 | 3.0 | 2.0 | Konuşma geçmişi, session state, multi-turn context, message threading, branching |
| S01 | L3 | Auto REST API Engine | Faz 1 | P0 | Application Squad | 5.0 | 6.0 | 33.0 | 11.0 | 0.0 | 0.0 | DocType tanımından otomatik REST endpoint üretimi (CRUD + filter + bulk). Aynı t |
| S02 | L3 | Auto Admin UI Engine | Faz 2 | P0 | Application Squad | 5.0 | 7.0 | 37.0 | 11.0 | 4.0 | 0.0 | DocType tanımından auto-generated admin UI: list view, detail view, form, bulk a |
| S03 | L3 | Form & Validation Framework | Faz 2 | P1 | Application Squad | 5.0 | 5.0 | 28.0 | 10.0 | 5.0 | 1.0 | Form lifecycle, server-side + client-side validation, conditional fields, wizard |
| S04 | L3 | Workflow & State Machine | Faz 3 | P1 | Application Squad | 4.0 | 6.0 | 38.0 | 17.0 | 1.0 | 0.0 | DocType yaşam döngüsü için deklaratif state machine. Her transition: guard, acti |
| S05 | L3 | Notification Center | Faz 3 | P1 | Application Squad | 5.0 | 5.0 | 34.0 | 10.0 | 2.0 | 1.0 | Multi-channel bildirim: in-app, email, SMS, push, webhook, agent ping. Template  |
| S06 | L3 | Search & Discovery | Faz 3 | P1 | Application Squad + AI Squad | 4.0 | 5.0 | 30.0 | 6.0 | 6.0 | 2.0 | DocType genel arama yüzeyi. Hybrid retrieval (BM25 + vector), faceted filter, qu |
| D01 | L4 | Audit Log & Event Sourcing | Faz 3 | P0 | Compliance Squad + Platform Ops Squad | 5.0 | 7.0 | 47.0 | 16.0 | 3.0 | 0.0 | Tüm değişikliklerin (kim, ne zaman, ne yaptı, neden) yazılı kaydı. Append-only e |
| D02 | L4 | PII Governance & Data Classification | Faz 3 | P0 | Compliance Squad + Security Squad | 5.0 | 8.0 | 44.0 | 15.0 | 5.0 | 0.0 | Otomatik PII keşfi, data classification (public/internal/confidential/restricted |
| D03 | L4 | Compliance Framework (KVKK / GDPR / SOC2) | Faz 4 | P1 | Compliance Squad | 4.0 | 5.0 | 35.0 | 11.0 | 3.0 | 0.0 | Uyumluluk kontrol matrisi, kanıt toplama otomasyonu, periyodik tarama, discrepan |
| O01 | L5 | Observability & SLO Monitoring | Faz 3 | P0 | Platform Ops Squad | 4.0 | 7.0 | 40.0 | 12.0 | 4.0 | 0.0 | Logs, metrics, traces — unified observability. SLO definition, error budget, ale |
| O02 | L5 | Plugin Marketplace | Faz 4 | P1 | Marketplace Squad | 5.0 | 8.0 | 49.0 | 15.0 | 5.0 | 1.0 | 3. parti plugin keşif, kurulum, lisans, ödeme, sürüm yönetimi. Plugin developer  |
| O03 | L5 | Plugin Security Review & Sandbox Certification | Faz 4 | P0 | Security Squad + Marketplace Squad | 5.0 | 7.0 | 42.0 | 18.0 | 3.0 | 0.0 | 3. parti plugin'lerin güvenlik denetimi, sandbox uygunluk testleri, imzalı bundl |

---

## Sheet: K01 Plugin Lifecycle Manager

**Boyut:** 61 satır × 13 sütun

### İlk 5 satır (metadata)

```
K01 — Plugin Lifecycle Manager |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Çekirdek (L0)    |    Faz: Faz 1    |    Ö |  |  |  |  |  |  |  |  |  |  |  | 
Plugin keşfi, manifest doğrulama, install/upgrade/ |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L0 | K01 | Plugin Manifest & Metadata | Plugin Listesi (Admin) | plugin_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | slug | string(60) | x |  |  |  | tenant | globally unique |
| 3.0 |  |  |  |  | name | string(120) | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | version | semver | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | author | string | x |  |  |  | tenant |  |
| 6.0 |  |  |  |  | license | enum |  |  |  |  | tenant | MIT/Apache-2.0/Proprietary/Commercial |
| 7.0 |  |  |  |  | status | enum | x |  |  |  | tenant | installed/active/disabled/error/upgrading |
| 8.0 |  |  |  |  | installed_at | datetime | x |  |  |  | tenant | audit log'a düşer |
| 9.0 |  |  |  | Manifest Doğrulama | manifest_path | string | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | schema_version | semver | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | checksum | string(64) | x |  |  |  | tenant | SHA-256 manifest hash |
| 12.0 |  |  |  |  | signed | boolean | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | signature_authority | string |  |  |  |  | tenant | kim imzaladı |
| 14.0 |  |  |  |  | validation_errors | jsonb |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | compatibility_matrix | jsonb | x |  |  |  | tenant | kernel sürüm aralığı |
| 16.0 |  |  |  | Plugin Capability Beyanı | declared_doctypes | list<string> |  |  |  |  | tenant | plugin'in eklediği DocType'lar |
| 17.0 |  |  |  |  | declared_hooks | list<string> |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | declared_tools | list<string> |  |  | x |  | tenant | MCP tool'ları |
| 19.0 |  |  |  |  | declared_routes | list<string> |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | required_capabilities | list<string> |  |  |  |  | tenant | başka plugin'lerden ihtiyaç |
| 21.0 |  |  |  |  | optional_capabilities | list<string> |  |  |  |  | tenant |  |
| 22.0 | L0 | K01 | Install / Upgrade / Uninstall | Install Workflow | install_id | uuid | x |  | x | x | tenant |  |
| 23.0 |  |  |  |  | plugin_slug | string | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | target_version | semver | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | strategy | enum | x |  |  |  | tenant | atomic/staged/canary |
| 26.0 |  |  |  |  | dry_run | boolean |  |  |  |  | tenant | gerçekten install etme, plan üret |
| 27.0 |  |  |  |  | install_log | text |  |  |  |  | tenant | stream edilir |
| 28.0 |  |  |  |  | rollback_token | string |  |  |  |  | tenant | başarısızlıkta geri alma anahtarı |
| 29.0 |  |  |  | Upgrade & Migration | from_version | semver | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | to_version | semver | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | migration_plan | jsonb | x | AI |  |  | tenant |  |
| 32.0 |  |  |  |  | breaking_changes | list<string> |  | AI |  |  | tenant |  |
| 33.0 |  |  |  |  | downtime_estimate_sec | int |  | AI |  |  | tenant |  |
| 34.0 |  |  |  |  | upgrade_status | enum |  |  |  |  | tenant | pending/running/succeeded/failed/rolled_back |
| 35.0 |  |  |  | Uninstall | retain_data | boolean | x |  |  |  | tenant | DB tabloları korunsun mu |
| 36.0 |  |  |  |  | cascade_dependents | boolean |  |  |  |  | tenant | bağımlı plugin'leri de kaldır |
| 37.0 |  |  |  |  | uninstall_log | text |  |  |  |  | tenant | stream edilir |
| 38.0 | L0 | K01 | Dependency Resolution | Dependency Graph | plugin_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | depends_on | list<uuid> | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | dependents | list<uuid> |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | resolution_strategy | enum |  |  |  |  | tenant | strict/optimistic/forced |
| 42.0 |  |  |  |  | cycle_detected | boolean |  |  |  |  | tenant |  |
| 43.0 |  |  |  |  | resolution_plan_explanation | text |  | AI |  |  | tenant | AI açıklaması |
| 44.0 |  |  |  | Conflict Detection | conflict_type | enum |  |  |  |  | tenant | version_clash/incompatible_api/circular |
| 45.0 |  |  |  |  | conflicting_plugins | list<uuid> |  |  |  |  | tenant |  |
| 46.0 |  |  |  |  | auto_resolution_suggestion | text |  | AI |  |  | tenant |  |
| 47.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 48.0 | L0 | K01 | Plugin Registry | Local Registry | registry_url | string |  |  |  |  | tenant |  |
| 49.0 |  |  |  |  | last_synced_at | datetime |  |  |  |  | tenant |  |
| 50.0 |  |  |  |  | trusted_publishers | list<string> |  |  |  |  | tenant |  |
| 51.0 |  |  |  |  | verification_policy | enum |  |  |  |  | tenant | any/signed/trusted_only |
| 52.0 |  |  |  | Health Probe | plugin_id | uuid | x |  |  |  | tenant |  |
| 53.0 |  |  |  |  | liveness | boolean |  |  |  |  | tenant |  |
| 54.0 |  |  |  |  | readiness | boolean |  |  |  |  | tenant |  |
| 55.0 |  |  |  |  | last_probe_at | datetime |  |  |  |  | tenant |  |
| 56.0 |  |  |  |  | error_rate_5m | decimal |  |  |  |  | tenant |  |

---

## Sheet: K02 DocType Engine (Schema Runt

**Boyut:** 47 satır × 13 sütun

### İlk 5 satır (metadata)

```
K02 — DocType Engine (Schema Runtime) |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Çekirdek (L0)    |    Faz: Faz 1    |    Ö |  |  |  |  |  |  |  |  |  |  |  | 
Deklaratif DocType tanımı → runtime'da DB tablosu, |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L0 | K02 | DocType Definition | DocType Listesi | doctype_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | name | string(80) | x |  |  |  | tenant | snake_case unique |
| 4.0 |  |  |  |  | display_name | string | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | namespace | string | x |  |  |  | tenant | plugin_slug.doctype |
| 6.0 |  |  |  |  | is_singleton | boolean |  |  |  |  | tenant | tek satır ise true |
| 7.0 |  |  |  |  | is_submittable | boolean |  |  |  |  | tenant | Frappe submit/cancel yaşam döngüsü |
| 8.0 |  |  |  |  | created_at | datetime | x |  |  |  | tenant |  |
| 9.0 |  |  |  | Field Definition | field_id | uuid | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | type | enum | x |  |  |  | tenant | string/text/int/decimal/boolean/datetime/date/uuid/enum/jsonb/relation/vector/ts |
| 13.0 |  |  |  |  | required | boolean |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | unique | boolean |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | indexed | boolean |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | default_value | jsonb |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | validation_rule | string |  |  |  |  | tenant | regex veya cel expression |
| 18.0 |  |  |  |  | ai_description | text |  | AI | x |  | tenant | LLM tool param açıklaması |
| 19.0 | L0 | K02 | Runtime Schema Operations | Schema Introspection | doctype_id | uuid | x |  | x |  | tenant |  |
| 20.0 |  |  |  |  | introspection_format | enum |  |  |  |  | tenant | json_schema/openapi/mcp_tool_spec/graphql |
| 21.0 |  |  |  |  | include_relations | boolean |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | include_permissions | boolean |  |  |  |  | tenant |  |
| 23.0 |  |  |  | Auto-API Generation | doctype_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | generated_endpoints | list<string> |  |  |  |  | tenant | GET/POST/PATCH/DELETE list |
| 25.0 |  |  |  |  | openapi_path | string |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | mcp_tool_path | string |  |  | x |  | tenant |  |
| 27.0 |  |  |  | Validation Engine | validation_id | uuid |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 29.0 |  |  |  |  | rule_type | enum |  |  |  |  | tenant | field/cross_field/business_rule/ai_check |
| 30.0 |  |  |  |  | expression | text | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | error_message_template | string |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | ai_explanation | text |  | AI |  |  | tenant |  |
| 33.0 | L0 | K02 | Relations & Foreign Keys | Relation Definition | relation_id | uuid | x |  |  |  | tenant |  |
| 34.0 |  |  |  |  | from_doctype | uuid | x |  |  |  | tenant |  |
| 35.0 |  |  |  |  | to_doctype | uuid | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | relation_type | enum | x |  |  |  | tenant | one_to_one/one_to_many/many_to_many |
| 37.0 |  |  |  |  | on_delete | enum |  |  |  |  | tenant | cascade/restrict/set_null/no_action |
| 38.0 |  |  |  |  | inverse_field_name | string |  |  |  |  | tenant |  |
| 39.0 | L0 | K02 | Soft Delete & Versioning | Versioning Policy | doctype_id | uuid | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | versioning_strategy | enum |  |  |  |  | tenant | none/snapshot/event_sourced |
| 41.0 |  |  |  |  | retention_days | int |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | audit_field_changes | boolean |  |  |  |  | tenant |  |

---

## Sheet: K03 Migration & Versioning Engi

**Boyut:** 38 satır × 13 sütun

### İlk 5 satır (metadata)

```
K03 — Migration & Versioning Engine |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Çekirdek (L0)    |    Faz: Faz 2    |    Ö |  |  |  |  |  |  |  |  |  |  |  | 
Plugin sürüm geçişlerinde DB schema migration, dat |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L0 | K03 | Migration Plan | Plan Üretimi | migration_id | uuid | x |  |  | x | tenant |  |
| 2.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | from_version | semver | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | to_version | semver | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | plan_type | enum |  |  |  |  | tenant | schema/data/hybrid |
| 6.0 |  |  |  |  | ai_generated | boolean |  | AI |  |  | tenant |  |
| 7.0 |  |  |  |  | human_reviewed | boolean | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | estimated_duration_sec | int |  | AI |  |  | tenant |  |
| 9.0 |  |  |  |  | destructive_operations | list<string> |  |  |  |  | tenant | audit log'a düşer |
| 10.0 | L0 | K03 | Migration Execution | Run Migration | run_id | uuid | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | migration_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | started_at | datetime | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | status | enum |  |  |  |  | tenant | pending/running/succeeded/failed/rolled_back |
| 14.0 |  |  |  |  | progress_percent | decimal |  |  |  |  | tenant | stream edilir |
| 15.0 |  |  |  |  | error_log | text |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | rollback_available | boolean |  |  |  |  | tenant |  |
| 17.0 |  |  |  | Rollback | rollback_id | uuid | x |  |  | x | tenant |  |
| 18.0 |  |  |  |  | source_run_id | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | rollback_strategy | enum |  |  |  |  | tenant | snapshot_restore/inverse_migration |
| 20.0 |  |  |  |  | data_loss_assessment | text |  | AI |  |  | tenant | audit log'a düşer |
| 21.0 | L0 | K03 | Schema Diff | Diff Calculator | source_schema_hash | string(64) |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | target_schema_hash | string(64) |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | added_doctypes | list<string> |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | removed_doctypes | list<string> |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | changed_fields | jsonb |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | breaking_changes | list<string> |  | AI |  |  | tenant |  |
| 27.0 |  |  |  |  | compatibility_score | decimal |  | AI |  |  | tenant | 0-100 |
| 28.0 | L0 | K03 | Data Migration | ETL Step | step_id | uuid | x |  |  |  | tenant |  |
| 29.0 |  |  |  |  | transform_expression | text | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | batch_size | int |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | rows_processed | int |  |  |  |  | tenant | stream edilir |
| 32.0 |  |  |  |  | rows_failed | int |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | dead_letter_table | string |  |  |  |  | tenant |  |

---

## Sheet: K04 Hook & Event Bus

**Boyut:** 40 satır × 13 sütun

### İlk 5 satır (metadata)

```
K04 — Hook & Event Bus |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Çekirdek (L0)    |    Faz: Faz 1    |    Ö |  |  |  |  |  |  |  |  |  |  |  | 
Plugin'lerin birbirini bilmeden davranış genişletm |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L0 | K04 | Hook Registry | Hook Tanımları | hook_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | hook_name | string | x |  |  |  | tenant | ör. before_save, after_create |
| 3.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | doctype_target | string |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | priority | int |  |  |  |  | tenant | çalışma sırası |
| 6.0 |  |  |  |  | blocking | boolean |  |  |  |  | tenant | sync mi async mi |
| 7.0 |  |  |  |  | max_runtime_ms | int |  |  |  |  | tenant |  |
| 8.0 |  |  |  | Hook Çalıştırma | invocation_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | hook_name | string | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | triggered_by | string |  |  |  |  | tenant | event/api/agent/cron |
| 11.0 |  |  |  |  | payload | jsonb |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | duration_ms | int |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | error | text |  |  |  |  | tenant |  |
| 14.0 | L0 | K04 | Event Bus | Event Yayını | event_id | uuid | x |  | x | x | tenant |  |
| 15.0 |  |  |  |  | topic | string | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | payload | jsonb | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | emitted_by | string |  |  |  |  | tenant | user_id/agent_id/system |
| 18.0 |  |  |  |  | emitted_at | datetime | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | trace_id | string |  |  |  |  | tenant | audit log'a düşer |
| 20.0 |  |  |  |  | delivery_mode | enum |  |  |  |  | tenant | at_least_once/at_most_once/exactly_once |
| 21.0 |  |  |  | Subscriber & Delivery | subscriber_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | topic_pattern | string | x |  |  |  | tenant | ilan.* gibi |
| 23.0 |  |  |  |  | delivery_status | enum |  |  |  |  | tenant | pending/delivered/failed/dead |
| 24.0 |  |  |  |  | retry_count | int |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | dead_letter_at | datetime |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | ack_at | datetime |  |  |  |  | tenant |  |
| 27.0 | L0 | K04 | Pattern: Outbox & Saga | Transactional Outbox | outbox_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | source_transaction_id | string |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | event_payload | jsonb |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | published_at | datetime |  |  |  |  | tenant |  |
| 31.0 |  |  |  | Saga Orchestration | saga_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | saga_type | string |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | step_count | int |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | compensation_log | jsonb |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | status | enum |  |  |  |  | tenant | running/compensating/succeeded/failed |

---

## Sheet: K05 Service Container & Configu

**Boyut:** 44 satır × 13 sütun

### İlk 5 satır (metadata)

```
K05 — Service Container & Configuration |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Çekirdek (L0)    |    Faz: Faz 2    |    Ö |  |  |  |  |  |  |  |  |  |  |  | 
Dependency injection container, hierarchical confi |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L0 | K05 | Service Registry | Service Tanımı | service_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | interface | string | x |  |  |  | tenant | protokol/abstract sınıf |
| 4.0 |  |  |  |  | implementation | string | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | scope | enum |  |  |  |  | tenant | singleton/transient/scoped/tenant_scoped |
| 6.0 |  |  |  |  | plugin_id | uuid |  |  |  |  | tenant |  |
| 7.0 |  |  |  | DI Resolution | resolution_request_id | uuid |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | requested_interface | string | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | resolved_implementation | string |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | resolution_path | list<string> |  |  |  |  | tenant | bağımlılık zinciri |
| 11.0 | L0 | K05 | Configuration Hierarchy | Config Key | key | string(120) | x |  | x |  | tenant |  |
| 12.0 |  |  |  |  | value | jsonb |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | scope | enum | x |  |  |  | tenant | global/tenant/user/agent/session |
| 14.0 |  |  |  |  | scope_id | uuid |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | type | enum |  |  |  |  | tenant | string/int/bool/json/secret |
| 16.0 |  |  |  |  | version | int |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | updated_at | datetime |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | updated_by | string |  |  |  |  | tenant |  |
| 19.0 |  |  |  | Hierarchical Lookup | key | string | x |  | x |  | tenant |  |
| 20.0 |  |  |  |  | requested_scope | string |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | effective_value | jsonb |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | source_scope | string |  |  |  |  | tenant | hangi katmandan geldi |
| 23.0 |  |  |  |  | cache_ttl_sec | int |  |  |  |  | tenant |  |
| 24.0 | L0 | K05 | Feature Flags | Flag Tanımı | flag_id | uuid | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | key | string | x |  | x |  | tenant |  |
| 26.0 |  |  |  |  | description | text |  | AI |  |  | tenant |  |
| 27.0 |  |  |  |  | rollout_strategy | enum |  |  |  |  | tenant | boolean/percentage/cohort/rule |
| 28.0 |  |  |  |  | rule_expression | text |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | default_value | boolean |  |  |  |  | tenant |  |
| 30.0 |  |  |  | Flag Evaluation | evaluation_id | uuid |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | flag_key | string | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | subject | string |  |  |  |  | tenant | user_id/tenant_id/agent_id |
| 33.0 |  |  |  |  | result | boolean |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | matched_rule | string |  |  |  |  | tenant |  |
| 35.0 | L0 | K05 | Secrets Resolution | Secret Reference | secret_ref_id | uuid | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | provider | enum |  |  |  |  | tenant | vault/aws_sm/gcp_sm/local |
| 37.0 |  |  |  |  | path | string | x |  |  |  | tenant |  |
| 38.0 |  |  |  |  | rotation_policy | string |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | last_rotated_at | datetime |  |  |  |  | tenant |  |

---

## Sheet: I01 Tenant Lifecycle Management

**Boyut:** 47 satır × 13 sütun

### İlk 5 satır (metadata)

```
I01 — Tenant Lifecycle Management |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Kimlik ve Kiracılık (L1)    |    Faz: Faz  |  |  |  |  |  |  |  |  |  |  |  | 
Tenant (müşteri organizasyon) provisioning, suspen |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L1 | I01 | Tenant Provisioning | Tenant Listesi | tenant_id | uuid | x |  | x |  | global |  |
| 2.0 |  |  |  |  | slug | string(60) | x |  |  |  | tenant | globally unique |
| 3.0 |  |  |  |  | display_name | string | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | isolation_strategy | enum | x |  |  |  | tenant | schema_per_tenant/row_level/db_per_tenant |
| 5.0 |  |  |  |  | schema_name | string |  |  |  |  | tenant | schema_per_tenant ise PG schema adı |
| 6.0 |  |  |  |  | status | enum | x |  |  |  | tenant | provisioning/active/suspended/archived/deleted |
| 7.0 |  |  |  |  | created_at | datetime | x |  |  |  | tenant | audit log'a düşer |
| 8.0 |  |  |  |  | activated_at | datetime |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | region | enum |  |  |  |  | tenant | eu-central/eu-west/us-east |
| 10.0 |  |  |  | Provisioning Workflow | provisioning_id | uuid | x |  | x | x | tenant |  |
| 11.0 |  |  |  |  | step | enum |  |  |  |  | tenant | reserve/create_schema/seed/finalize |
| 12.0 |  |  |  |  | ai_resource_estimate | jsonb |  | AI |  |  | tenant | öngörülen kaynak |
| 13.0 |  |  |  |  | rollback_token | string |  |  |  |  | tenant |  |
| 14.0 | L1 | I01 | Quota & Resource Limits | Kota Tanımı | quota_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | resource | enum | x |  |  |  | tenant | users/storage_gb/api_calls/llm_tokens/agents |
| 17.0 |  |  |  |  | hard_limit | int | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | soft_warning | int |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | renewal_period | enum |  |  |  |  | tenant | monthly/daily/hourly/never |
| 20.0 |  |  |  | Usage Tracking | tenant_id | uuid | x |  |  |  | tenant |  |
| 21.0 |  |  |  |  | resource | enum | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | current_usage | decimal |  |  |  |  | tenant | stream edilir |
| 23.0 |  |  |  |  | breach_count | int |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | last_alerted_at | datetime |  |  |  |  | tenant |  |
| 25.0 | L1 | I01 | Tenant Configuration Profile | Branding & Settings | tenant_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | brand_name | string |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | logo_url | string |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | primary_color | string |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | locale | enum |  |  |  |  | tenant | tr-TR/en-US/de-DE |
| 30.0 |  |  |  |  | timezone | string |  |  |  |  | tenant |  |
| 31.0 |  |  |  | Plugin Subscription | subscription_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 33.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 34.0 |  |  |  |  | plan | string |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | activated_at | datetime |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 37.0 | L1 | I01 | Suspension & Lifecycle | Suspend / Archive | action_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 38.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | reason | enum |  |  |  |  | tenant | payment_failed/abuse/customer_request/legal_hold |
| 40.0 |  |  |  |  | suspended_at | datetime |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | data_retention_until | datetime |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | ai_summary | text |  | AI |  |  | tenant |  |

---

## Sheet: I02 User & Identity Core

**Boyut:** 53 satır × 13 sütun

### İlk 5 satır (metadata)

```
I02 — User & Identity Core |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Kimlik ve Kiracılık (L1)    |    Faz: Faz  |  |  |  |  |  |  |  |  |  |  |  | 
Bireysel kullanıcı, kurumsal kullanıcı, agent kull |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L1 | I02 | Principal Model | Principal Listesi | principal_id | uuid | x |  | x |  | tenant | PII |
| 2.0 |  |  |  |  | principal_type | enum | x |  |  |  | tenant | user/agent/system/service_account |
| 3.0 |  |  |  |  | display_name | string | x |  |  |  | tenant | PII |
| 4.0 |  |  |  |  | status | enum | x |  |  |  | tenant | active/inactive/suspended/deleted |
| 5.0 |  |  |  |  | created_at | datetime | x |  |  |  | tenant | audit log'a düşer |
| 6.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 7.0 |  |  |  |  | external_idp_subject | string |  |  |  |  | tenant | OAuth/SSO subject id |
| 8.0 |  |  |  | Human User Profili | user_id | uuid | x |  |  |  | tenant | PII |
| 9.0 |  |  |  |  | email | email | x |  |  |  | tenant | PII · at-rest şifreli |
| 10.0 |  |  |  |  | phone | phone |  |  |  |  | tenant | PII · at-rest şifreli |
| 11.0 |  |  |  |  | full_name | string |  |  |  |  | tenant | PII |
| 12.0 |  |  |  |  | locale | string |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | timezone | string |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | avatar_url | string |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | kyc_level | enum |  |  |  |  | tenant | none/basic/full |
| 16.0 |  |  |  | Agent User Profili | agent_id | uuid | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | agent_kind | enum | x |  |  |  | tenant | conversational/workflow/cron/embedded |
| 18.0 |  |  |  |  | model_provider | enum |  |  |  |  | tenant | anthropic/openai/azure_openai/local |
| 19.0 |  |  |  |  | default_model | string |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | system_prompt_id | uuid |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | on_behalf_of_user_id | uuid |  |  |  |  | tenant | agent kimin adına çalışıyor |
| 22.0 |  |  |  |  | capability_set_id | uuid | x |  |  |  | tenant | agent yetki paketi |
| 23.0 | L1 | I02 | Identity Federation | External Identity Provider | idp_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | type | enum | x |  |  |  | tenant | oauth2/oidc/saml/azure_ad/google/apple |
| 25.0 |  |  |  |  | issuer | string | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | client_id | string | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | client_secret_ref | string |  |  |  |  | tenant | at-rest şifreli |
| 28.0 |  |  |  |  | scopes | list<string> |  |  |  |  | tenant |  |
| 29.0 |  |  |  | Identity Mapping | mapping_id | uuid | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | idp_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | external_subject | string | x |  |  |  | tenant |  |
| 33.0 |  |  |  |  | linked_at | datetime |  |  |  |  | tenant |  |
| 34.0 | L1 | I02 | Profile Merge & Split | Merge Operation | merge_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 35.0 |  |  |  |  | primary_principal_id | uuid | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | secondary_principal_id | uuid | x |  |  |  | tenant |  |
| 37.0 |  |  |  |  | conflict_resolution | enum |  |  |  |  | tenant | prefer_primary/prefer_secondary/manual |
| 38.0 |  |  |  |  | ai_conflict_summary | text |  | AI |  |  | tenant |  |
| 39.0 |  |  |  |  | merged_at | datetime |  |  |  |  | tenant |  |
| 40.0 | L1 | I02 | Group & Org Membership | Organization | org_id | uuid | x |  |  |  | tenant |  |
| 41.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 42.0 |  |  |  |  | type | enum |  |  |  |  | tenant | company/team/department |
| 43.0 |  |  |  |  | parent_org_id | uuid |  |  |  |  | tenant |  |
| 44.0 |  |  |  | Membership | membership_id | uuid | x |  |  |  | tenant |  |
| 45.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 46.0 |  |  |  |  | org_id | uuid | x |  |  |  | tenant |  |
| 47.0 |  |  |  |  | role_in_org | string |  |  |  |  | tenant |  |
| 48.0 |  |  |  |  | joined_at | datetime |  |  |  |  | tenant |  |

---

## Sheet: I03 Authentication & Sessions

**Boyut:** 57 satır × 13 sütun

### İlk 5 satır (metadata)

```
I03 — Authentication & Sessions |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Kimlik ve Kiracılık (L1)    |    Faz: Faz  |  |  |  |  |  |  |  |  |  |  |  | 
Password, OAuth, OIDC, magic link, passkey, API ke |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L1 | I03 | Credential Types | Password Credential | credential_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | password_hash | string | x |  |  |  | tenant | at-rest şifreli |
| 4.0 |  |  |  |  | hash_algorithm | enum |  |  |  |  | tenant | argon2id/bcrypt |
| 5.0 |  |  |  |  | must_change | boolean |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | last_changed_at | datetime |  |  |  |  | tenant | audit log'a düşer |
| 7.0 |  |  |  | Passkey / WebAuthn | passkey_id | uuid | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | credential_id_b64 | string | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | public_key_b64 | string | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | aaguid | string |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | device_label | string |  |  |  |  | tenant |  |
| 13.0 |  |  |  | API Key | api_key_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | prefix | string(8) |  |  |  |  | tenant | visible prefix |
| 17.0 |  |  |  |  | hash | string |  |  |  |  | tenant | at-rest şifreli |
| 18.0 |  |  |  |  | scopes | list<string> |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | last_used_at | datetime |  |  |  |  | tenant |  |
| 21.0 |  |  |  | Agent Token | agent_token_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 22.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 23.0 |  |  |  |  | on_behalf_of_user_id | uuid |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | capability_scope_ids | list<uuid> | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | ttl_seconds | int | x |  |  |  | tenant | agent token kısa ömürlü |
| 26.0 |  |  |  |  | max_tool_calls | int |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | revoked_at | datetime |  |  |  |  | tenant |  |
| 28.0 | L1 | I03 | Session Management | Session Listesi | session_id | uuid | x |  | x |  | tenant |  |
| 29.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | session_type | enum |  |  |  |  | tenant | human/agent/api/oauth |
| 31.0 |  |  |  |  | started_at | datetime | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | last_activity_at | datetime |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | ip_address | inet |  |  |  |  | tenant | PII |
| 34.0 |  |  |  |  | user_agent | string |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | revoked | boolean |  |  |  |  | tenant |  |
| 36.0 |  |  |  | Session Revoke | revocation_id | uuid | x |  | x | x | tenant | audit log'a düşer |
| 37.0 |  |  |  |  | session_id | uuid | x |  |  |  | tenant |  |
| 38.0 |  |  |  |  | reason | enum |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | revoked_by | uuid |  |  |  |  | tenant |  |
| 40.0 | L1 | I03 | MFA / Step-up | MFA Method | method_id | uuid | x |  |  |  | tenant |  |
| 41.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 42.0 |  |  |  |  | method | enum |  |  |  |  | tenant | totp/sms/email/passkey/backup_code |
| 43.0 |  |  |  |  | verified | boolean |  |  |  |  | tenant |  |
| 44.0 |  |  |  | Step-up Challenge | challenge_id | uuid | x |  |  |  | tenant |  |
| 45.0 |  |  |  |  | triggered_by_action | string |  |  |  |  | tenant | hangi işlem yüzünden |
| 46.0 |  |  |  |  | required_factor | enum |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 48.0 | L1 | I03 | Risk-based Auth | Auth Risk Score | risk_score | decimal |  | AI |  |  | tenant |  |
| 49.0 |  |  |  |  | device_fingerprint | string |  |  |  |  | tenant |  |
| 50.0 |  |  |  |  | geo_anomaly | boolean |  | AI |  |  | tenant |  |
| 51.0 |  |  |  |  | velocity_anomaly | boolean |  | AI |  |  | tenant |  |
| 52.0 |  |  |  |  | recommended_action | enum |  | AI |  |  | tenant | allow/step_up/block |

---

## Sheet: I04 Permission Framework

**Boyut:** 49 satır × 13 sütun

### İlk 5 satır (metadata)

```
I04 — Permission Framework |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Kimlik ve Kiracılık (L1)    |    Faz: Faz  |  |  |  |  |  |  |  |  |  |  |  | 
RBAC + ABAC + agent capability scopes. Agent kulla |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L1 | I04 | Roles & Permissions | Role Tanımı | role_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | scope | enum |  |  |  |  | tenant | global/tenant/org |
| 4.0 |  |  |  |  | inherits_from | list<uuid> |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | description | text |  |  |  |  | tenant |  |
| 6.0 |  |  |  | Permission | permission_id | uuid | x |  |  |  | tenant |  |
| 7.0 |  |  |  |  | name | string | x |  |  |  | tenant | ör. listing.create |
| 8.0 |  |  |  |  | resource_type | string | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | action | enum | x |  |  |  | tenant | create/read/update/delete/submit/cancel/execute |
| 10.0 |  |  |  |  | constraint_expression | text |  |  |  |  | tenant | ABAC için |
| 11.0 |  |  |  | Role-Permission Binding | binding_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | role_id | uuid | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | permission_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | granted_by | uuid |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | granted_at | datetime |  |  |  |  | tenant |  |
| 16.0 | L1 | I04 | Agent Capability Scopes | Capability Scope Tanımı | scope_id | uuid | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | description | text |  | AI | x |  | tenant |  |
| 19.0 |  |  |  |  | allowed_tools | list<string> | x |  | x |  | tenant |  |
| 20.0 |  |  |  |  | allowed_resources | list<string> |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | max_invocations_per_session | int |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | max_token_cost_usd | decimal |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | blast_radius | enum |  |  |  |  | tenant | read_only/single_record/tenant_wide/global |
| 24.0 |  |  |  | Effective Scope Resolution | resolution_id | uuid |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | on_behalf_of_user_id | uuid |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | intersection_result | list<string> |  |  |  |  | tenant | user perms ∩ agent scope |
| 28.0 |  |  |  |  | denied_tools | list<string> |  |  |  |  | tenant | audit log'a düşer |
| 29.0 | L1 | I04 | Field-level & Row-level Security | Field Mask Policy | policy_id | uuid | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | field_name | string | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | mask_rule | enum |  |  |  |  | tenant | redact/partial/hash/encrypt |
| 33.0 |  |  |  |  | applies_to_principal_types | list<string> |  |  |  |  | tenant |  |
| 34.0 |  |  |  | Row-level Filter | filter_id | uuid | x |  |  |  | tenant |  |
| 35.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | filter_expression | text | x |  |  |  | tenant | kim hangi satıra erişebilir |
| 37.0 |  |  |  |  | evaluation_engine | enum |  |  |  |  | tenant | cel/jsonlogic/python_sandbox |
| 38.0 | L1 | I04 | Permission Audit | Authorization Decision | decision_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 39.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | requested_action | string | x |  |  |  | tenant |  |
| 41.0 |  |  |  |  | resource | string | x |  |  |  | tenant |  |
| 42.0 |  |  |  |  | decision | enum |  |  |  |  | tenant | allow/deny |
| 43.0 |  |  |  |  | matched_policy | string |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | evaluated_in_ms | int |  |  |  |  | tenant |  |

---

## Sheet: I05 Multi-Tenant Isolation

**Boyut:** 43 satır × 13 sütun

### İlk 5 satır (metadata)

```
I05 — Multi-Tenant Isolation |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Kimlik ve Kiracılık (L1)    |    Faz: Faz  |  |  |  |  |  |  |  |  |  |  |  | 
Schema-per-tenant izolasyon, query interception, c |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L1 | I05 | Tenant Context Propagation | Request Context | request_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 2.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | principal_id | uuid |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | agent_id | uuid |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | trace_id | string |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | entry_point | enum |  |  |  |  | tenant | http/mcp/cron/event/agent_tool |
| 7.0 |  |  |  | Context Sealing | seal_id | uuid | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | sealed_at | datetime |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | signature | string |  |  |  |  | tenant | at-rest şifreli |
| 11.0 | L1 | I05 | Query Interception | Query Rewrite | rewrite_id | uuid |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | original_query | text |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | tenant_filter_added | boolean |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | rewritten_query | text |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | intercepted_at | datetime |  |  |  |  | tenant |  |
| 16.0 |  |  |  | Cross-Tenant Detection | incident_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 17.0 |  |  |  |  | source_tenant | uuid | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | attempted_resource_tenant | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | blocked | boolean |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | ai_classification | text |  | AI |  |  | tenant |  |
| 22.0 | L1 | I05 | Schema Routing | Schema Resolver | resolver_id | uuid |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | pg_schema | string | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | connection_pool | string |  |  |  |  | tenant |  |
| 26.0 | L1 | I05 | Tenant Data Export & Deletion | Data Export Job | export_job_id | uuid | x |  | x |  | tenant | audit log'a düşer |
| 27.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | format | enum |  |  |  |  | tenant | json/parquet/sql_dump |
| 29.0 |  |  |  |  | scope | enum |  |  |  |  | tenant | full/pii_only/audit_only |
| 30.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | download_url | string |  |  |  |  | tenant | at-rest şifreli |
| 32.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 33.0 |  |  |  | Tenant Deletion (KVKK madde 7) | deletion_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 34.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 35.0 |  |  |  |  | retention_grace_days | int |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | legal_hold_check | boolean | x |  |  |  | tenant |  |
| 37.0 |  |  |  |  | ai_review_recommendation | text |  | AI |  |  | tenant |  |
| 38.0 |  |  |  |  | executed_at | datetime |  |  |  |  | tenant |  |

---

## Sheet: A01 MCP Server Framework

**Boyut:** 47 satır × 13 sütun

### İlk 5 satır (metadata)

```
A01 — MCP Server Framework |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Model Context Protocol native server. Plugin'lerin |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A01 | MCP Endpoint Management | MCP Server Listesi | server_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | transport | enum | x |  |  |  | tenant | stdio/sse/streaming_http |
| 4.0 |  |  |  |  | endpoint_url | string |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | auth_method | enum |  |  |  |  | tenant | none/bearer/oauth_dcr/api_key |
| 6.0 |  |  |  |  | status | enum |  |  |  |  | tenant | online/offline/degraded |
| 7.0 |  |  |  |  | protocol_version | string | x |  |  |  | tenant |  |
| 8.0 |  |  |  | Server Capability Beyanı | server_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | supports_tools | boolean |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | supports_resources | boolean |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | supports_prompts | boolean |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | supports_sampling | boolean |  |  |  |  | tenant | server LLM çağırabilir mi |
| 13.0 |  |  |  |  | supports_subscription | boolean |  |  |  |  | tenant |  |
| 14.0 | L2 | A01 | Initialize Handshake | Client Initialize | session_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 15.0 |  |  |  |  | client_id | string | x |  |  |  | tenant | agent_id veya app id |
| 16.0 |  |  |  |  | client_protocol_version | string | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | negotiated_capabilities | jsonb |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | server_info | jsonb |  |  |  |  | tenant |  |
| 19.0 | L2 | A01 | Discovery Endpoints | List Tools | request_id | string |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | tool_count | int |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | filtered_by_capability_scope | boolean |  |  |  |  | tenant | agent scope'una göre kısıtlı |
| 22.0 |  |  |  |  | response_size_bytes | int |  |  |  |  | tenant |  |
| 23.0 |  |  |  | List Resources | resource_count | int |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | paginated | boolean |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | cursor | string |  |  |  |  | tenant |  |
| 26.0 |  |  |  | List Prompts | prompt_count | int |  |  |  |  | tenant |  |
| 27.0 | L2 | A01 | Tool Invocation Protocol | Tool Call Request | call_id | uuid | x |  |  | x | tenant | audit log'a düşer |
| 28.0 |  |  |  |  | tool_name | string | x |  | x |  | tenant |  |
| 29.0 |  |  |  |  | arguments | jsonb | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | agent_session_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | budget_token_cost | int |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | timeout_ms | int |  |  |  |  | tenant |  |
| 33.0 |  |  |  | Tool Call Response | call_id | uuid | x |  |  |  | tenant |  |
| 34.0 |  |  |  |  | result | jsonb |  |  |  |  | tenant | stream edilir |
| 35.0 |  |  |  |  | is_error | boolean |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | error_code | string |  |  |  |  | tenant |  |
| 37.0 |  |  |  |  | duration_ms | int |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | token_cost_actual | int |  |  |  |  | tenant |  |
| 39.0 | L2 | A01 | Streaming Responses | Stream Chunk | call_id | uuid | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | chunk_index | int |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | delta | text |  |  |  |  | tenant | stream edilir |
| 42.0 |  |  |  |  | done | boolean |  |  |  |  | tenant |  |

---

## Sheet: A02 Tool Registry & Discovery

**Boyut:** 50 satır × 13 sütun

### İlk 5 satır (metadata)

```
A02 — Tool Registry & Discovery |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Plugin'lerin tanımladığı tool'ların merkezi katalo |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A02 | Tool Definition | Tool Listesi | tool_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | name | string(80) | x |  |  |  | tenant | snake_case unique |
| 4.0 |  |  |  |  | namespace | string | x |  |  |  | tenant | plugin.tool |
| 5.0 |  |  |  |  | display_name | string | x |  |  |  | tenant |  |
| 6.0 |  |  |  |  | status | enum | x |  |  |  | tenant | draft/active/deprecated/retired |
| 7.0 |  |  |  |  | created_at | datetime | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | introspection_uri | string |  |  |  |  | tenant |  |
| 9.0 |  |  |  | Tool Schema | tool_id | uuid | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | input_schema | json_schema | x | AI | x |  | tenant |  |
| 11.0 |  |  |  |  | output_schema | json_schema | x |  | x |  | tenant |  |
| 12.0 |  |  |  |  | description_for_llm | text | x | AI | x |  | tenant | LLM tool-selection için optimize |
| 13.0 |  |  |  |  | examples | list<jsonb> |  | AI |  |  | tenant | few-shot örnekler |
| 14.0 |  |  |  |  | deprecation_notice | text |  |  |  |  | tenant |  |
| 15.0 | L2 | A02 | Side-Effect & Safety Annotations | Effect Profile | tool_id | uuid | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | read_only | boolean | x |  |  |  | tenant | hiç yazma yok |
| 17.0 |  |  |  |  | idempotent | boolean | x |  |  | x | tenant |  |
| 18.0 |  |  |  |  | destructive | boolean |  |  |  |  | tenant | silme/iptal |
| 19.0 |  |  |  |  | requires_confirmation | boolean |  |  |  |  | tenant | kullanıcı onayı zorunlu |
| 20.0 |  |  |  |  | blast_radius | enum | x |  |  |  | tenant | self/single_record/tenant/global |
| 21.0 |  |  |  |  | network_calls | boolean |  |  |  |  | tenant | dış servise gidiyor mu |
| 22.0 |  |  |  |  | cost_class | enum |  |  |  |  | tenant | free/cheap/normal/expensive |
| 23.0 |  |  |  | Confirmation Policy | policy_id | uuid |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | tool_id | uuid | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | confirmation_required_above_threshold | decimal |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | confirmation_template | text |  | AI |  |  | tenant |  |
| 27.0 |  |  |  |  | auto_approve_for_capability_scopes | list<uuid> |  |  |  |  | tenant |  |
| 28.0 | L2 | A02 | Tool Versioning | Version History | version_id | uuid | x |  |  |  | tenant |  |
| 29.0 |  |  |  |  | tool_id | uuid | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | version | semver | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | breaking_change | boolean |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | changelog | text |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | supersedes | uuid |  |  |  |  | tenant |  |
| 34.0 | L2 | A02 | Search & Recommendation | Semantic Tool Search | search_id | uuid |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | query | string | x |  | x |  | tenant |  |
| 36.0 |  |  |  |  | query_embedding | vector(1536) |  |  |  |  | tenant | embedding |
| 37.0 |  |  |  |  | top_k | int |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | results | list<uuid> |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | relevance_scores | list<decimal> |  |  |  |  | tenant |  |
| 40.0 | L2 | A02 | Usage Analytics | Tool Usage Stats | tool_id | uuid | x |  |  |  | tenant |  |
| 41.0 |  |  |  |  | call_count_24h | int |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | error_rate_24h | decimal |  |  |  |  | tenant |  |
| 43.0 |  |  |  |  | avg_latency_ms | int |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | p95_latency_ms | int |  |  |  |  | tenant |  |
| 45.0 |  |  |  |  | avg_tokens_consumed | int |  |  |  |  | tenant |  |

---

## Sheet: A03 Agent Identity & Capability

**Boyut:** 55 satır × 13 sütun

### İlk 5 satır (metadata)

```
A03 — Agent Identity & Capability Scopes |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Agent kimliği, capability scope binding, session-b |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A03 | Capability Pack Definition | Capability Pack | pack_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | intended_persona | string |  |  |  |  | tenant | ör. customer_support_agent |
| 4.0 |  |  |  |  | included_tools | list<string> | x |  | x |  | tenant |  |
| 5.0 |  |  |  |  | excluded_tools | list<string> |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | max_token_budget | int |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | max_runtime_sec | int |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | approved_by_human | boolean | x |  |  |  | tenant | audit log'a düşer |
| 9.0 | L2 | A03 | Agent-User Binding | On-Behalf-Of Relationship | binding_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 10.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | authorization_token | string |  |  |  |  | tenant | at-rest şifreli |
| 13.0 |  |  |  |  | delegation_expires_at | datetime |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | revoked_at | datetime |  |  |  |  | tenant |  |
| 15.0 |  |  |  | Effective Permission Calculation | calc_id | uuid |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | intersected_permissions | list<string> |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | dropped_permissions | list<string> |  |  |  |  | tenant | audit log'a düşer |
| 20.0 |  |  |  |  | calc_duration_ms | int |  |  |  |  | tenant |  |
| 21.0 | L2 | A03 | Session Limits & Throttling | Per-Session Budget | session_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | token_budget_remaining | int |  |  |  |  | tenant | stream edilir |
| 23.0 |  |  |  |  | tool_calls_remaining | int |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | usd_cost_accumulated | decimal |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | hard_limit_breached | boolean |  |  |  |  | tenant | audit log'a düşer |
| 26.0 |  |  |  | Rate Limit | rate_limit_id | uuid |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | window_seconds | int |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | max_calls_in_window | int |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | current_count | int |  |  |  |  | tenant | stream edilir |
| 31.0 | L2 | A03 | Tool Execution Sandbox | Sandbox Policy | policy_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | isolation_level | enum | x |  |  |  | tenant | none/process/container/firecracker |
| 33.0 |  |  |  |  | network_egress_allowlist | list<string> |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | filesystem_readonly | boolean |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | max_memory_mb | int |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | max_cpu_seconds | int |  |  |  |  | tenant |  |
| 37.0 |  |  |  | Sandbox Execution Trace | execution_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 38.0 |  |  |  |  | call_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | syscalls_blocked | int |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | network_attempts | int |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | policy_violations | list<string> |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | ai_anomaly_summary | text |  | AI |  |  | tenant |  |
| 43.0 | L2 | A03 | Violation & Incident | Scope Violation | violation_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 44.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 45.0 |  |  |  |  | attempted_tool | string |  |  |  |  | tenant |  |
| 46.0 |  |  |  |  | attempted_resource | string |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | violation_type | enum |  |  |  |  | tenant | out_of_scope/budget_exceeded/blast_radius/sandbox_breach |
| 48.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 49.0 |  |  |  |  | auto_revoked | boolean |  |  |  |  | tenant |  |
| 50.0 |  |  |  |  | ai_threat_assessment | text |  | AI |  |  | tenant |  |

---

## Sheet: A04 Agent Memory Layer

**Boyut:** 54 satır × 13 sütun

### İlk 5 satır (metadata)

```
A04 — Agent Memory Layer |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Short-term (conversation buffer), long-term (seman |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A04 | Short-term Memory | Conversation Buffer | buffer_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | session_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | messages | list<jsonb> |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | token_count | int |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | max_token_budget | int |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | compaction_strategy | enum |  |  |  |  | tenant | none/summarize/window/hierarchical |
| 7.0 |  |  |  |  | ai_summary | text |  | AI |  |  | tenant |  |
| 8.0 | L2 | A04 | Long-term Semantic Memory | Memory Item | memory_id | uuid | x |  | x |  | tenant |  |
| 9.0 |  |  |  |  | principal_id | uuid | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | agent_id | uuid |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | content | text | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | embedding | vector(1536) | x |  |  |  | tenant | embedding |
| 13.0 |  |  |  |  | memory_kind | enum |  |  |  |  | tenant | fact/preference/rule/skill/observation |
| 14.0 |  |  |  |  | source | string |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | created_at | datetime | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | last_accessed_at | datetime |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | access_count | int |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | ttl_seconds | int |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | decay_factor | decimal |  |  |  |  | tenant |  |
| 20.0 |  |  |  | Memory Retrieval | retrieval_id | uuid |  |  | x |  | tenant |  |
| 21.0 |  |  |  |  | query_text | string |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | query_embedding | vector(1536) |  |  |  |  | tenant | embedding |
| 23.0 |  |  |  |  | filters | jsonb |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | top_k | int |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | rerank_strategy | enum |  |  |  |  | tenant | none/cross_encoder/temporal/hybrid |
| 26.0 |  |  |  |  | results | list<uuid> |  |  |  |  | tenant |  |
| 27.0 | L2 | A04 | Episodic Memory | Episode Record | episode_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | session_id | uuid | x |  |  |  | tenant |  |
| 29.0 |  |  |  |  | summary | text |  | AI |  |  | tenant |  |
| 30.0 |  |  |  |  | emotion_tone | enum |  | AI |  |  | tenant | positive/neutral/negative |
| 31.0 |  |  |  |  | key_actions | list<string> |  | AI |  |  | tenant |  |
| 32.0 |  |  |  |  | outcome | enum |  |  |  |  | tenant | success/partial/failed/abandoned |
| 33.0 |  |  |  |  | embedding | vector(1536) |  |  |  |  | tenant | embedding |
| 34.0 | L2 | A04 | Procedural Memory | Learned Procedure | procedure_id | uuid | x |  |  |  | tenant |  |
| 35.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | trigger_pattern | text |  | AI |  |  | tenant |  |
| 37.0 |  |  |  |  | steps | list<jsonb> |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | success_rate | decimal |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | execution_count | int |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | approved_by_human | boolean |  |  |  |  | tenant | audit log'a düşer |
| 41.0 | L2 | A04 | Memory Hygiene | Forgetting & Pruning | hygiene_run_id | uuid |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | pruned_count | int |  |  |  |  | tenant |  |
| 43.0 |  |  |  |  | decay_applied_count | int |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | kept_count | int |  |  |  |  | tenant |  |
| 45.0 |  |  |  |  | ai_pruning_rationale | text |  | AI |  |  | tenant |  |
| 46.0 |  |  |  | PII Scrubbing in Memory | scrub_run_id | uuid |  |  |  |  | tenant | audit log'a düşer |
| 47.0 |  |  |  |  | entries_scanned | int |  |  |  |  | tenant |  |
| 48.0 |  |  |  |  | entries_redacted | int |  |  |  |  | tenant |  |
| 49.0 |  |  |  |  | ai_redaction_classifier_score | decimal |  | AI |  |  | tenant |  |

---

## Sheet: A05 Vector Store & Embedding Pi

**Boyut:** 54 satır × 13 sütun

### İlk 5 satır (metadata)

```
A05 — Vector Store & Embedding Pipeline |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
pgvector tabanlı vector storage, embedding job run |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A05 | Embedding Model Registry | Embedding Model | model_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | provider | enum |  |  |  |  | tenant | anthropic/openai/cohere/local/voyage |
| 4.0 |  |  |  |  | dimension | int | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | max_input_tokens | int |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | cost_per_million_tokens | decimal |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | normalized | boolean |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | status | enum |  |  |  |  | tenant | active/deprecated/retired |
| 9.0 | L2 | A05 | Embedding Generation | Embed Job | job_id | uuid | x |  | x | x | tenant |  |
| 10.0 |  |  |  |  | source_doctype | string | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | source_field | string | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | model_id | uuid | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | status | enum |  |  |  |  | tenant | queued/running/completed/failed |
| 14.0 |  |  |  |  | rows_total | int |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | rows_done | int |  |  |  |  | tenant | stream edilir |
| 16.0 |  |  |  |  | retry_count | int |  |  |  |  | tenant |  |
| 17.0 |  |  |  | Embedding Storage | embedding_id | uuid | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | source_id | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | model_id | uuid | x |  |  |  | tenant |  |
| 20.0 |  |  |  |  | vector | vector | x |  |  |  | tenant | embedding |
| 21.0 |  |  |  |  | created_at | datetime |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | checksum | string |  |  |  |  | tenant | içerik değişti mi |
| 23.0 | L2 | A05 | Hybrid Search | Search Query | search_id | uuid |  |  | x |  | tenant |  |
| 24.0 |  |  |  |  | query_text | string | x |  | x |  | tenant |  |
| 25.0 |  |  |  |  | vector_weight | decimal |  |  |  |  | tenant | 0-1 |
| 26.0 |  |  |  |  | bm25_weight | decimal |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | filters | jsonb |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | top_k | int |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | rerank_with_model_id | uuid |  |  |  |  | tenant |  |
| 30.0 |  |  |  | Search Result | result_id | uuid |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | source_id | uuid |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | score_vector | decimal |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | score_bm25 | decimal |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | score_combined | decimal |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | score_rerank | decimal |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | explanation | text |  | AI |  |  | tenant |  |
| 37.0 | L2 | A05 | Reindex & Migration | Reindex Job | job_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 38.0 |  |  |  |  | from_model_id | uuid |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | to_model_id | uuid | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | strategy | enum |  |  |  |  | tenant | dual_write/blue_green/in_place |
| 41.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | ai_migration_plan_explanation | text |  | AI |  |  | tenant |  |
| 43.0 | L2 | A05 | Index Statistics | Index Health | doctype | string | x |  |  |  | tenant |  |
| 44.0 |  |  |  |  | vector_count | int |  |  |  |  | tenant |  |
| 45.0 |  |  |  |  | avg_query_latency_ms | int |  |  |  |  | tenant |  |
| 46.0 |  |  |  |  | hnsw_m_param | int |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | ef_construction | int |  |  |  |  | tenant |  |
| 48.0 |  |  |  |  | ef_search | int |  |  |  |  | tenant |  |
| 49.0 |  |  |  |  | recall_at_k | decimal |  |  |  |  | tenant |  |

---

## Sheet: A06 Prompt Library & Versioning

**Boyut:** 59 satır × 13 sütun

### İlk 5 satır (metadata)

```
A06 — Prompt Library & Versioning |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Prompt'ların kod gibi versiyonlanması, A/B test, e |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A06 | Prompt Definition | Prompt Listesi | prompt_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | category | enum |  |  |  |  | tenant | extraction/classification/generation/agent_system/tool_call |
| 4.0 |  |  |  |  | status | enum |  |  |  |  | tenant | draft/staging/production/deprecated |
| 5.0 |  |  |  |  | created_by | uuid |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | created_at | datetime |  |  |  |  | tenant |  |
| 7.0 |  |  |  | Prompt Version | version_id | uuid | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | prompt_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | version | int | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | system_template | text |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | user_template | text | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | variables_schema | json_schema | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | output_schema | json_schema |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | model_target | string |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | temperature_default | decimal |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | created_at | datetime |  |  |  |  | tenant |  |
| 17.0 | L2 | A06 | A/B Testing | Experiment | experiment_id | uuid | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | prompt_id | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | control_version_id | uuid | x |  |  |  | tenant |  |
| 20.0 |  |  |  |  | variant_version_ids | list<uuid> |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | traffic_split | jsonb |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | hypothesis | text |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | primary_metric | string |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 25.0 |  |  |  | Experiment Result | variant_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | samples | int |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | metric_mean | decimal |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | p_value | decimal |  | AI |  |  | tenant |  |
| 29.0 |  |  |  |  | winner_declared | boolean |  | AI |  |  | tenant |  |
| 30.0 |  |  |  |  | ai_analysis | text |  | AI |  |  | tenant |  |
| 31.0 | L2 | A06 | Eval Suite | Eval Case | case_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | prompt_id | uuid | x |  |  |  | tenant |  |
| 33.0 |  |  |  |  | input | jsonb | x |  |  |  | tenant |  |
| 34.0 |  |  |  |  | expected_output | jsonb |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | graders | list<string> |  |  |  |  | tenant | exact/llm_judge/regex/json_schema |
| 36.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 37.0 |  |  |  | Eval Run | run_id | uuid | x |  |  |  | tenant |  |
| 38.0 |  |  |  |  | prompt_version_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | pass_count | int |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | fail_count | int |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | regression_vs_baseline | boolean |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | ai_failure_summary | text |  | AI |  |  | tenant |  |
| 43.0 | L2 | A06 | Rollout & Rollback | Deployment | deployment_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 44.0 |  |  |  |  | prompt_id | uuid | x |  |  |  | tenant |  |
| 45.0 |  |  |  |  | version_id | uuid | x |  |  |  | tenant |  |
| 46.0 |  |  |  |  | rollout_percent | decimal |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | rolled_back_from | uuid |  |  |  |  | tenant |  |
| 48.0 |  |  |  |  | approved_by | uuid |  |  |  |  | tenant |  |
| 49.0 | L2 | A06 | Drift Detection | Drift Signal | signal_id | uuid |  |  |  |  | tenant |  |
| 50.0 |  |  |  |  | prompt_id | uuid | x |  |  |  | tenant |  |
| 51.0 |  |  |  |  | drift_type | enum |  |  |  |  | tenant | distribution/quality/cost/latency |
| 52.0 |  |  |  |  | magnitude | decimal |  |  |  |  | tenant |  |
| 53.0 |  |  |  |  | ai_root_cause | text |  | AI |  |  | tenant |  |
| 54.0 |  |  |  |  | alerted | boolean |  |  |  |  | tenant |  |

---

## Sheet: A07 LLM Provider Abstraction

**Boyut:** 49 satır × 13 sütun

### İlk 5 satır (metadata)

```
A07 — LLM Provider Abstraction |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Anthropic, OpenAI, Azure OpenAI, Bedrock, lokal Ol |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A07 | Provider Registry | Provider Listesi | provider_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | name | enum | x |  |  |  | tenant | anthropic/openai/azure_openai/bedrock/vertex/ollama |
| 3.0 |  |  |  |  | base_url | string |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | auth_secret_ref | string |  |  |  |  | tenant | at-rest şifreli |
| 5.0 |  |  |  |  | region | string |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | status | enum |  |  |  |  | tenant | active/degraded/disabled |
| 7.0 |  |  |  |  | supports_streaming | boolean |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | supports_tool_use | boolean |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | supports_vision | boolean |  |  |  |  | tenant |  |
| 10.0 |  |  |  | Model Catalog | model_id | uuid | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | provider_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | model_name | string | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | context_window | int |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | max_output_tokens | int |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | input_cost_per_million | decimal |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | output_cost_per_million | decimal |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | capability_tier | enum |  |  |  |  | tenant | haiku/sonnet/opus_class |
| 18.0 | L2 | A07 | Routing & Fallback | Routing Rule | rule_id | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | priority | int |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | match_expression | text |  |  |  |  | tenant | hangi durumda devreye girer |
| 22.0 |  |  |  |  | primary_model_id | uuid |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | fallback_chain | list<uuid> |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | ai_explanation | text |  | AI |  |  | tenant |  |
| 25.0 |  |  |  | Routing Decision | decision_id | uuid |  |  |  |  | tenant | audit log'a düşer |
| 26.0 |  |  |  |  | request_id | uuid | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | matched_rule_id | uuid |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | selected_model_id | uuid |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | fallback_used | boolean |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | rationale | text |  | AI |  |  | tenant |  |
| 31.0 | L2 | A07 | Retry & Circuit Breaker | Retry Policy | policy_id | uuid |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | provider_id | uuid | x |  |  |  | tenant |  |
| 33.0 |  |  |  |  | max_attempts | int |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | backoff_strategy | enum |  |  |  |  | tenant | exponential/fixed/jittered |
| 35.0 |  |  |  |  | retryable_status_codes | list<int> |  |  |  |  | tenant |  |
| 36.0 |  |  |  | Circuit Breaker State | provider_id | uuid | x |  |  |  | tenant |  |
| 37.0 |  |  |  |  | state | enum |  |  |  |  | tenant | closed/open/half_open |
| 38.0 |  |  |  |  | failure_count | int |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | last_failure_at | datetime |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | auto_recover_at | datetime |  |  |  |  | tenant |  |
| 41.0 | L2 | A07 | Streaming Adapter | Stream Bridge | bridge_id | uuid |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | upstream_format | enum |  |  |  |  | tenant | anthropic_sse/openai_sse/aws_event_stream |
| 43.0 |  |  |  |  | downstream_format | enum |  |  |  |  | tenant | mcp_stream/sse/websocket |
| 44.0 |  |  |  |  | backpressure_handled | boolean |  |  |  |  | tenant |  |

---

## Sheet: A08 LLM Observability & Cost Tr

**Boyut:** 65 satır × 13 sütun

### İlk 5 satır (metadata)

```
A08 — LLM Observability & Cost Tracking |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Her LLM çağrısı: input/output, token count, latenc |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A08 | LLM Trace | Trace Listesi | trace_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 2.0 |  |  |  |  | session_id | uuid |  |  |  |  | tenant |  |
| 3.0 |  |  |  |  | agent_id | uuid |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | user_id | uuid |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 6.0 |  |  |  |  | started_at | datetime | x |  |  |  | tenant |  |
| 7.0 |  |  |  |  | ended_at | datetime |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | total_duration_ms | int |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | total_token_input | int |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | total_token_output | int |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | total_cost_usd | decimal |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | status | enum |  |  |  |  | tenant | success/error/cancelled/partial |
| 13.0 |  |  |  | Span (LLM Call) | span_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | trace_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | provider_id | uuid |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | model | string |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | input_messages | jsonb |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | output_message | jsonb |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | input_tokens | int |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | output_tokens | int |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | first_token_latency_ms | int |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | total_latency_ms | int |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | temperature | decimal |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | error_code | string |  |  |  |  | tenant |  |
| 25.0 |  |  |  | Tool Call Span | span_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | trace_id | uuid | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | tool_name | string | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | arguments | jsonb |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | result_summary | text |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | duration_ms | int |  |  |  |  | tenant |  |
| 31.0 | L2 | A08 | Cost Attribution | Cost Breakdown | breakdown_id | uuid |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | dimension | enum |  |  |  |  | tenant | tenant/user/agent/feature/prompt |
| 33.0 |  |  |  |  | dimension_value | string |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | period | enum |  |  |  |  | tenant | hour/day/week/month |
| 35.0 |  |  |  |  | input_cost | decimal |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | output_cost | decimal |  |  |  |  | tenant |  |
| 37.0 |  |  |  |  | tool_cost | decimal |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | total_cost_usd | decimal |  |  |  |  | tenant |  |
| 39.0 |  |  |  | Budget Alert | alert_id | uuid | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | scope_type | enum |  |  |  |  | tenant | tenant/agent/feature |
| 41.0 |  |  |  |  | scope_id | string | x |  |  |  | tenant |  |
| 42.0 |  |  |  |  | threshold_usd | decimal |  |  |  |  | tenant |  |
| 43.0 |  |  |  |  | current_usd | decimal |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | triggered_at | datetime |  |  |  |  | tenant |  |
| 45.0 |  |  |  |  | ai_anomaly_check | text |  | AI |  |  | tenant |  |
| 46.0 | L2 | A08 | Quality Signals | Hallucination Detection | detection_id | uuid |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | span_id | uuid | x |  |  |  | tenant |  |
| 48.0 |  |  |  |  | hallucination_score | decimal |  | AI |  |  | tenant |  |
| 49.0 |  |  |  |  | evidence_match | boolean |  | AI |  |  | tenant |  |
| 50.0 |  |  |  |  | flagged_by | enum |  |  |  |  | tenant | llm_judge/rule/embedding_distance/user_feedback |
| 51.0 |  |  |  | User Feedback | feedback_id | uuid | x |  |  |  | tenant |  |
| 52.0 |  |  |  |  | trace_id | uuid | x |  |  |  | tenant |  |
| 53.0 |  |  |  |  | rating | enum |  |  |  |  | tenant | thumbs_up/thumbs_down |
| 54.0 |  |  |  |  | free_text | text |  |  |  |  | tenant |  |
| 55.0 |  |  |  |  | category | enum |  | AI |  |  | tenant | hallucination/inaccurate/refusal/unsafe/great |
| 56.0 | L2 | A08 | Replay & Debug | Trace Replay | replay_id | uuid |  |  |  |  | tenant | audit log'a düşer |
| 57.0 |  |  |  |  | source_trace_id | uuid | x |  |  |  | tenant |  |
| 58.0 |  |  |  |  | replay_with_model | string |  |  |  |  | tenant |  |
| 59.0 |  |  |  |  | replay_with_prompt_version | uuid |  |  |  |  | tenant |  |
| 60.0 |  |  |  |  | diff_summary | text |  | AI |  |  | tenant |  |

---

## Sheet: A09 Agent Orchestration & Workf

**Boyut:** 55 satır × 13 sütun

### İlk 5 satır (metadata)

```
A09 — Agent Orchestration & Workflow |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Çok-adımlı agent görevleri için workflow engine. P |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A09 | Workflow Definition | Agent Workflow | workflow_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | orchestration_pattern | enum | x |  |  |  | tenant | react/plan_execute/multi_agent/router/dag |
| 4.0 |  |  |  |  | max_iterations | int |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | system_prompt_id | uuid |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | tool_set_ids | list<uuid> |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | requires_human_approval | boolean |  |  |  |  | tenant |  |
| 8.0 | L2 | A09 | Execution Run | Run Listesi | run_id | uuid | x |  | x |  | tenant | audit log'a düşer |
| 9.0 |  |  |  |  | workflow_id | uuid | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | agent_id | uuid | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | trigger | enum |  |  |  |  | tenant | user/agent/cron/event |
| 12.0 |  |  |  |  | status | enum | x |  |  |  | tenant | pending/running/waiting_approval/succeeded/failed/cancelled |
| 13.0 |  |  |  |  | started_at | datetime |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | completed_at | datetime |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | iteration_count | int |  |  |  |  | tenant | stream edilir |
| 16.0 |  |  |  |  | total_cost_usd | decimal |  |  |  |  | tenant |  |
| 17.0 |  |  |  | Step / Iteration | step_id | uuid | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | run_id | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | step_index | int | x |  |  |  | tenant |  |
| 20.0 |  |  |  |  | step_type | enum |  |  |  |  | tenant | reason/tool_call/sub_agent/human_input/wait |
| 21.0 |  |  |  |  | input_state | jsonb |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | output_state | jsonb |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | duration_ms | int |  |  |  |  | tenant |  |
| 24.0 | L2 | A09 | Checkpoint & Resume | Checkpoint | checkpoint_id | uuid | x |  |  | x | tenant |  |
| 25.0 |  |  |  |  | run_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | step_index | int | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | state_snapshot | jsonb |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | created_at | datetime |  |  |  |  | tenant |  |
| 29.0 |  |  |  | Resume Operation | resume_id | uuid |  |  | x |  | tenant |  |
| 30.0 |  |  |  |  | from_checkpoint_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | override_state | jsonb |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | ai_resume_recommendation | text |  | AI |  |  | tenant |  |
| 33.0 | L2 | A09 | Human-in-the-Loop | Approval Request | approval_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 34.0 |  |  |  |  | run_id | uuid | x |  |  |  | tenant |  |
| 35.0 |  |  |  |  | step_id | uuid | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | question_for_human | text |  | AI |  |  | tenant |  |
| 37.0 |  |  |  |  | options | list<string> |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | timeout_at | datetime |  |  |  |  | tenant |  |
| 39.0 |  |  |  |  | response | string |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | responded_by | uuid |  |  |  |  | tenant |  |
| 41.0 |  |  |  | Interrupt | interrupt_id | uuid | x |  |  |  | tenant |  |
| 42.0 |  |  |  |  | run_id | uuid | x |  |  |  | tenant |  |
| 43.0 |  |  |  |  | requested_by | uuid |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | reason | string |  |  |  |  | tenant |  |
| 45.0 |  |  |  |  | interrupt_kind | enum |  |  |  |  | tenant | cancel/pause/inject_message |
| 46.0 | L2 | A09 | Multi-Agent Coordination | Sub-Agent Invocation | invocation_id | uuid | x |  |  |  | tenant |  |
| 47.0 |  |  |  |  | parent_run_id | uuid | x |  |  |  | tenant |  |
| 48.0 |  |  |  |  | child_agent_id | uuid | x |  |  |  | tenant |  |
| 49.0 |  |  |  |  | delegated_task | text |  |  |  |  | tenant |  |
| 50.0 |  |  |  |  | isolation_level | enum |  |  |  |  | tenant | shared_memory/isolated/sandboxed |

---

## Sheet: A10 Streaming & SSE Primitives

**Boyut:** 36 satır × 13 sütun

### İlk 5 satır (metadata)

```
A10 — Streaming & SSE Primitives |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
LLM token stream, tool execution progress stream,  |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A10 | Stream Channel | Channel Listesi | channel_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | kind | enum | x |  |  |  | tenant | llm_token/tool_progress/workflow_step/log |
| 3.0 |  |  |  |  | subscriber_count | int |  |  |  |  | tenant | stream edilir |
| 4.0 |  |  |  |  | created_at | datetime |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | closed_at | datetime |  |  |  |  | tenant |  |
| 6.0 |  |  |  | Stream Event | event_id | uuid | x |  |  |  | tenant |  |
| 7.0 |  |  |  |  | channel_id | uuid | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | sequence | int | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | event_type | string | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | payload | jsonb |  |  |  |  | tenant | stream edilir |
| 11.0 |  |  |  |  | emitted_at | datetime |  |  |  |  | tenant |  |
| 12.0 | L2 | A10 | Subscriber Lifecycle | Subscription | subscription_id | uuid | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | channel_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | subscriber_principal_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | last_seen_sequence | int |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | ack_mode | enum |  |  |  |  | tenant | auto/manual |
| 17.0 |  |  |  | Reconnect / Resume | reconnect_id | uuid |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | subscription_id | uuid | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | last_event_id | string |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | missed_events_replayed | int |  |  |  |  | tenant |  |
| 21.0 | L2 | A10 | Backpressure & Buffering | Buffer Stats | channel_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | buffered_event_count | int |  |  |  |  | tenant | stream edilir |
| 23.0 |  |  |  |  | buffer_high_watermark | int |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | dropped_event_count | int |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | backpressure_strategy | enum |  |  |  |  | tenant | drop_oldest/drop_newest/block/sample |
| 26.0 | L2 | A10 | Transport | SSE Endpoint | endpoint_path | string | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | auth_required | boolean |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | max_connections_per_principal | int |  |  |  |  | tenant |  |
| 29.0 |  |  |  | WebSocket Endpoint | endpoint_path | string | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | subprotocol | string |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | compression | enum |  |  |  |  | tenant |  |

---

## Sheet: A11 Conversation & Session Mana

**Boyut:** 43 satır × 13 sütun

### İlk 5 satır (metadata)

```
A11 — Conversation & Session Management |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Agent Çalışma Zamanı (L2)    |    Faz: Faz |  |  |  |  |  |  |  |  |  |  |  | 
Konuşma geçmişi, session state, multi-turn context |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L2 | A11 | Conversation | Conversation Listesi | conversation_id | uuid | x |  | x |  | tenant |  |
| 2.0 |  |  |  |  | title | string |  | AI |  |  | tenant | otomatik üretilir |
| 3.0 |  |  |  |  | primary_agent_id | uuid |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | primary_user_id | uuid |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | started_at | datetime | x |  |  |  | tenant |  |
| 6.0 |  |  |  |  | last_message_at | datetime |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | message_count | int |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | status | enum |  |  |  |  | tenant | active/archived/locked |
| 9.0 |  |  |  |  | ai_topic_classification | text |  | AI |  |  | tenant |  |
| 10.0 | L2 | A11 | Messages & Threading | Message | message_id | uuid | x |  | x |  | tenant |  |
| 11.0 |  |  |  |  | conversation_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | role | enum | x |  |  |  | tenant | system/user/assistant/tool/agent |
| 13.0 |  |  |  |  | sender_principal_id | uuid |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | parent_message_id | uuid |  |  |  |  | tenant | threading |
| 15.0 |  |  |  |  | content | jsonb | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | token_count | int |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | emitted_at | datetime | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | edited | boolean |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | redacted | boolean |  |  |  |  | tenant | audit log'a düşer |
| 20.0 |  |  |  | Branching / Fork | branch_id | uuid | x |  |  |  | tenant |  |
| 21.0 |  |  |  |  | from_message_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | alternative_response | text |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | selected_by_user | boolean |  |  |  |  | tenant |  |
| 24.0 | L2 | A11 | Context Window Management | Compaction Policy | policy_id | uuid |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | strategy | enum |  |  |  |  | tenant | head_truncate/tail_truncate/summarize/hierarchical |
| 26.0 |  |  |  |  | preserve_system | boolean |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | preserve_last_n | int |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | ai_summary_model | string |  |  |  |  | tenant |  |
| 29.0 |  |  |  | Compaction Run | run_id | uuid |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | conversation_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | tokens_before | int |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | tokens_after | int |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | ai_summary | text |  | AI |  |  | tenant |  |
| 34.0 | L2 | A11 | Conversation Sharing | Share Link | share_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 35.0 |  |  |  |  | conversation_id | uuid | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | visibility | enum |  |  |  |  | tenant | private/team/public/anyone_with_link |
| 37.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | redaction_applied | boolean |  |  |  |  | tenant |  |

---

## Sheet: S01 Auto REST API Engine

**Boyut:** 38 satır × 13 sütun

### İlk 5 satır (metadata)

```
S01 — Auto REST API Engine |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Uygulama Yüzeyi (L3)    |    Faz: Faz 1    |  |  |  |  |  |  |  |  |  |  |  | 
DocType tanımından otomatik REST endpoint üretimi  |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L3 | S01 | CRUD Endpoint Generation | Endpoint Listesi | endpoint_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | path | string | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | method | enum | x |  |  |  | tenant | GET/POST/PATCH/DELETE |
| 5.0 |  |  |  |  | operation_id | string | x |  |  |  | tenant |  |
| 6.0 |  |  |  |  | auth_required | boolean |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | required_permissions | list<string> |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | rate_limit_per_minute | int |  |  |  |  | tenant |  |
| 9.0 |  |  |  | Filter Grammar | filter_grammar_version | int |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | supported_operators | list<string> |  |  |  |  | tenant | eq/neq/gt/lt/in/contains/starts_with |
| 11.0 |  |  |  |  | supports_jsonb_path | boolean |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | supports_relation_traversal | boolean |  |  |  |  | tenant |  |
| 13.0 | L3 | S01 | OpenAPI Spec | Spec Versioning | spec_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | version | semver |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | openapi_version | string |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | path | string |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | checksum | string |  |  |  |  | tenant |  |
| 18.0 | L3 | S01 | Bulk & Batch Operations | Bulk Create / Upsert | bulk_request_id | uuid | x |  |  | x | tenant |  |
| 19.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 20.0 |  |  |  |  | rows | list<jsonb> |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | upsert_key | string |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | on_error | enum |  |  |  |  | tenant | abort/skip/dlq |
| 23.0 |  |  |  |  | processed_count | int |  |  |  |  | tenant | stream edilir |
| 24.0 |  |  |  |  | dlq_count | int |  |  |  |  | tenant |  |
| 25.0 | L3 | S01 | Pagination & Cursor | Cursor Definition | cursor_token | string |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | page_size | int |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | sort_keys | list<string> |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | stable_sort_field | string |  |  |  |  | tenant |  |
| 29.0 | L3 | S01 | Webhooks & Outgoing | Webhook Subscription | webhook_id | uuid | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | event_pattern | string | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | target_url | string | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | signing_secret | string |  |  |  |  | tenant | at-rest şifreli |
| 33.0 |  |  |  |  | retry_policy | string |  |  |  |  | tenant |  |

---

## Sheet: S02 Auto Admin UI Engine

**Boyut:** 42 satır × 13 sütun

### İlk 5 satır (metadata)

```
S02 — Auto Admin UI Engine |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Uygulama Yüzeyi (L3)    |    Faz: Faz 2    |  |  |  |  |  |  |  |  |  |  |  | 
DocType tanımından auto-generated admin UI: list v |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L3 | S02 | List View | List Configuration | config_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | default_columns | list<string> |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | default_sort | string |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | page_size | int |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | filter_panel_layout | enum |  |  |  |  | tenant | sidebar/top_bar/inline |
| 7.0 |  |  |  |  | supports_saved_views | boolean |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | ai_quick_filter | boolean |  | AI |  |  | tenant | doğal dil filtresi |
| 9.0 |  |  |  | Saved View | view_id | uuid | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | filter_state | jsonb |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | sort_state | jsonb |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | is_shared | boolean |  |  |  |  | tenant |  |
| 14.0 | L3 | S02 | Detail View & Form | Form Layout | layout_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | sections | list<jsonb> |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | conditional_visibility | jsonb |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | ai_help_per_field | boolean |  | AI |  |  | tenant |  |
| 19.0 |  |  |  | Field Component Registry | registry_id | uuid |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | field_type | string | x |  |  |  | tenant |  |
| 21.0 |  |  |  |  | component_name | string | x |  |  |  | tenant | Flowbite component slug |
| 22.0 |  |  |  |  | renderer_props_schema | json_schema |  |  |  |  | tenant |  |
| 23.0 | L3 | S02 | Bulk Actions | Bulk Action Definition | action_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | requires_confirmation | boolean |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | destructive | boolean |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | ai_suggestion_threshold | decimal |  | AI |  |  | tenant |  |
| 29.0 | L3 | S02 | AI Co-pilot Side-panel | Co-pilot Panel | panel_id | uuid | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | scope | enum |  |  |  |  | tenant | list/detail/form/global |
| 31.0 |  |  |  |  | default_capability_pack_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | suggested_prompts | list<string> |  | AI |  |  | tenant |  |
| 33.0 | L3 | S02 | Theming & Branding | Tenant Theme | theme_id | uuid |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | primary_color | string |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | logo_url | string |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | font_family | string |  |  |  |  | tenant |  |
| 37.0 |  |  |  |  | dark_mode_default | boolean |  |  |  |  | tenant |  |

---

## Sheet: S03 Form & Validation Framework

**Boyut:** 33 satır × 13 sütun

### İlk 5 satır (metadata)

```
S03 — Form & Validation Framework |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Uygulama Yüzeyi (L3)    |    Faz: Faz 2    |  |  |  |  |  |  |  |  |  |  |  | 
Form lifecycle, server-side + client-side validati |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L3 | S03 | Validation Rules | Rule Listesi | rule_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | rule_kind | enum |  |  |  |  | tenant | field/cross_field/business/ai |
| 4.0 |  |  |  |  | expression | text | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | error_message | string |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | ai_explanation | text |  | AI |  |  | tenant |  |
| 7.0 | L3 | S03 | Conditional Logic | Visibility Rule | rule_id | uuid |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | field_name | string | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | show_when | text |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | required_when | text |  |  |  |  | tenant |  |
| 11.0 | L3 | S03 | Wizard / Multi-step | Wizard Step | step_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | step_index | int |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | title | string |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | required_fields | list<string> |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | can_go_back | boolean |  |  |  |  | tenant |  |
| 17.0 | L3 | S03 | AI Auto-fill | Auto-fill Suggestion | suggestion_id | uuid |  | AI | x |  | tenant |  |
| 18.0 |  |  |  |  | field_name | string | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | suggested_value | jsonb |  | AI |  |  | tenant |  |
| 20.0 |  |  |  |  | confidence | decimal |  | AI |  |  | tenant |  |
| 21.0 |  |  |  |  | source_evidence | text |  | AI |  |  | tenant |  |
| 22.0 |  |  |  |  | accepted_by_user | boolean |  |  |  |  | tenant |  |
| 23.0 | L3 | S03 | Draft & Autosave | Draft Snapshot | draft_id | uuid | x |  |  | x | tenant |  |
| 24.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | payload | jsonb |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | version | int |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | autosaved_at | datetime |  |  |  |  | tenant |  |

---

## Sheet: S04 Workflow & State Machine

**Boyut:** 43 satır × 13 sütun

### İlk 5 satır (metadata)

```
S04 — Workflow & State Machine |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Uygulama Yüzeyi (L3)    |    Faz: Faz 3    |  |  |  |  |  |  |  |  |  |  |  | 
DocType yaşam döngüsü için deklaratif state machin |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L3 | S04 | Workflow Definition | State Machine | workflow_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | initial_state | string | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | terminal_states | list<string> |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | version | int |  |  |  |  | tenant |  |
| 7.0 |  |  |  | State | state_id | uuid | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | workflow_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | description | text |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | is_terminal | boolean |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | color | string |  |  |  |  | tenant |  |
| 13.0 |  |  |  | Transition | transition_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | workflow_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | from_state | string | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | to_state | string | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | event | string | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | guard_expression | text |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | required_permission | string |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | ai_explanation | text |  | AI |  |  | tenant |  |
| 21.0 | L3 | S04 | Transition Execution | Transition Log | log_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 22.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 23.0 |  |  |  |  | record_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | from_state | string |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | to_state | string |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | triggered_by_principal_id | uuid |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | triggered_via | enum |  |  |  |  | tenant | ui/api/agent/cron/event |
| 28.0 |  |  |  |  | comment | text |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | transitioned_at | datetime |  |  |  |  | tenant |  |
| 30.0 | L3 | S04 | Side Effects | Action on Transition | action_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | transition_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | action_kind | enum |  |  |  |  | tenant | emit_event/call_tool/send_notification/run_workflow |
| 33.0 |  |  |  |  | action_payload | jsonb |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | blocking | boolean |  |  |  |  | tenant |  |
| 35.0 | L3 | S04 | Visualization | State Diagram | diagram_id | uuid |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | workflow_id | uuid | x |  |  |  | tenant |  |
| 37.0 |  |  |  |  | format | enum |  |  |  |  | tenant | mermaid/dot/svg |
| 38.0 |  |  |  |  | rendered_content | text |  |  |  |  | tenant |  |

---

## Sheet: S05 Notification Center

**Boyut:** 39 satır × 13 sütun

### İlk 5 satır (metadata)

```
S05 — Notification Center |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Uygulama Yüzeyi (L3)    |    Faz: Faz 3    |  |  |  |  |  |  |  |  |  |  |  | 
Multi-channel bildirim: in-app, email, SMS, push,  |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L3 | S05 | Channel & Provider | Channel | channel_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | kind | enum | x |  |  |  | tenant | in_app/email/sms/push/webhook/agent |
| 3.0 |  |  |  |  | provider | string |  |  |  |  | tenant |  |
| 4.0 |  |  |  |  | config | jsonb |  |  |  |  | tenant | at-rest şifreli |
| 5.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 6.0 | L3 | S05 | Template | Notification Template | template_id | uuid | x |  |  |  | tenant |  |
| 7.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | channel_kind | enum |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | locale | enum |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | subject | string |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | body | text |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | variables | jsonb |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | ai_localization_status | enum |  | AI |  |  | tenant |  |
| 14.0 | L3 | S05 | User Preferences | Preference | preference_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | category | string | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | channel_in_app | boolean |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | channel_email | boolean |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | channel_sms | boolean |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | digest_frequency | enum |  |  |  |  | tenant | instant/hourly/daily/weekly/never |
| 21.0 | L3 | S05 | Delivery | Notification Send | send_id | uuid | x |  | x | x | tenant |  |
| 22.0 |  |  |  |  | template_id | uuid | x |  |  |  | tenant |  |
| 23.0 |  |  |  |  | recipient_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | variables | jsonb |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | priority | enum |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | scheduled_for | datetime |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 28.0 |  |  |  |  | provider_message_id | string |  |  |  |  | tenant |  |
| 29.0 | L3 | S05 | Digest | Digest Bundle | digest_id | uuid |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 31.0 |  |  |  |  | period | enum |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | item_count | int |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | ai_summary | text |  | AI |  |  | tenant |  |
| 34.0 |  |  |  |  | delivered_at | datetime |  |  |  |  | tenant |  |

---

## Sheet: S06 Search & Discovery

**Boyut:** 35 satır × 13 sütun

### İlk 5 satır (metadata)

```
S06 — Search & Discovery |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Uygulama Yüzeyi (L3)    |    Faz: Faz 3    |  |  |  |  |  |  |  |  |  |  |  | 
DocType genel arama yüzeyi. Hybrid retrieval (BM25 |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L3 | S06 | Search Query | Search Endpoint | query_id | uuid |  |  | x |  | tenant |  |
| 2.0 |  |  |  |  | query_text | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | query_embedding | vector(1536) |  |  |  |  | tenant | embedding |
| 4.0 |  |  |  |  | filters | jsonb |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | facets_requested | list<string> |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | page_size | int |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | offset | int |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | ai_query_intent | text |  | AI |  |  | tenant |  |
| 9.0 |  |  |  | Search Result | result_id | uuid |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | source_doctype | string |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | source_record_id | uuid |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | score | decimal |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | highlight | text |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | relevance_explanation | text |  | AI |  |  | tenant |  |
| 15.0 | L3 | S06 | Faceted Filtering | Facet Definition | facet_id | uuid |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | field_name | string | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | facet_kind | enum |  |  |  |  | tenant | enum/range/date_histogram/relation |
| 19.0 |  |  |  |  | display_order | int |  |  |  |  | tenant |  |
| 20.0 | L3 | S06 | Saved Searches & Alerts | Saved Search | search_id | uuid | x |  |  |  | tenant |  |
| 21.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | query_state | jsonb |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | alert_enabled | boolean |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | alert_frequency | enum |  |  |  |  | tenant |  |
| 26.0 | L3 | S06 | Query Understanding | NL → Structured | understanding_id | uuid |  | AI | x |  | tenant |  |
| 27.0 |  |  |  |  | input_text | string | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | structured_output | jsonb |  | AI |  |  | tenant |  |
| 29.0 |  |  |  |  | confidence | decimal |  | AI |  |  | tenant |  |
| 30.0 |  |  |  |  | ambiguity_clarification | text |  | AI |  |  | tenant |  |

---

## Sheet: D01 Audit Log & Event Sourcing

**Boyut:** 52 satır × 13 sütun

### İlk 5 satır (metadata)

```
D01 — Audit Log & Event Sourcing |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Veri, Uyumluluk ve Güvenlik (L4)    |    F |  |  |  |  |  |  |  |  |  |  |  | 
Tüm değişikliklerin (kim, ne zaman, ne yaptı, nede |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L4 | D01 | Audit Event | Event Listesi | event_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 2.0 |  |  |  |  | event_type | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | actor_principal_id | uuid | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | actor_kind | enum |  |  |  |  | tenant | user/agent/system |
| 5.0 |  |  |  |  | on_behalf_of_user_id | uuid |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | resource_doctype | string |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | resource_id | uuid |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | action | enum |  |  |  |  | tenant | create/update/delete/view/export/transition/auth |
| 9.0 |  |  |  |  | ip_address | inet |  |  |  |  | tenant | PII |
| 10.0 |  |  |  |  | user_agent | string |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | trace_id | string |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | emitted_at | datetime | x |  |  |  | tenant |  |
| 13.0 |  |  |  |  | hash_prev | string |  |  |  |  | tenant | hash chain |
| 14.0 |  |  |  |  | hash_self | string | x |  |  |  | tenant |  |
| 15.0 |  |  |  | Diff Snapshot | diff_id | uuid | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | event_id | uuid | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | before_value | jsonb |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | after_value | jsonb |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | changed_fields | list<string> |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | ai_change_summary | text |  | AI |  |  | tenant |  |
| 21.0 | L4 | D01 | Agent-specific Audit | Agent Action | action_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | agent_session_id | uuid | x |  |  |  | tenant |  |
| 23.0 |  |  |  |  | tool_name | string | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | tool_arguments | jsonb |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | tool_result_summary | text |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | rationale_from_llm | text |  | AI |  |  | tenant |  |
| 27.0 |  |  |  |  | scope_check_passed | boolean | x |  |  |  | tenant |  |
| 28.0 | L4 | D01 | Forensic Search | Forensic Query | query_id | uuid |  |  |  |  | tenant | audit log'a düşer |
| 29.0 |  |  |  |  | query_dsl | jsonb |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | time_range_start | datetime |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | time_range_end | datetime |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | result_count | int |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | exported_format | enum |  |  |  |  | tenant | csv/json/parquet |
| 34.0 | L4 | D01 | Retention & Legal Hold | Retention Policy | policy_id | uuid | x |  |  |  | tenant |  |
| 35.0 |  |  |  |  | event_type_pattern | string |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | retention_days | int | x |  |  |  | tenant |  |
| 37.0 |  |  |  |  | archive_destination | string |  |  |  |  | tenant |  |
| 38.0 |  |  |  | Legal Hold | hold_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 39.0 |  |  |  |  | reason | text | x |  |  |  | tenant |  |
| 40.0 |  |  |  |  | started_at | datetime |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | released_at | datetime |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | scope_query | jsonb |  |  |  |  | tenant |  |
| 43.0 | L4 | D01 | Tamper Detection | Integrity Check | check_id | uuid |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | checked_at | datetime |  |  |  |  | tenant |  |
| 45.0 |  |  |  |  | hash_chain_valid | boolean | x |  |  |  | tenant |  |
| 46.0 |  |  |  |  | anomalies_found | list<string> |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | ai_forensic_summary | text |  | AI |  |  | tenant |  |

---

## Sheet: D02 PII Governance & Data Class

**Boyut:** 49 satır × 13 sütun

### İlk 5 satır (metadata)

```
D02 — PII Governance & Data Classification |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Veri, Uyumluluk ve Güvenlik (L4)    |    F |  |  |  |  |  |  |  |  |  |  |  | 
Otomatik PII keşfi, data classification (public/in |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L4 | D02 | Data Classification | Classification Tag | tag_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | field_name | string | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | classification | enum | x |  |  |  | tenant | public/internal/confidential/restricted/pii_sensitive |
| 5.0 |  |  |  |  | ai_inferred | boolean |  | AI |  |  | tenant |  |
| 6.0 |  |  |  |  | human_confirmed | boolean |  |  |  |  | tenant |  |
| 7.0 |  |  |  | PII Discovery Run | run_id | uuid |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | doctype_scanned | string |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | pii_candidates_found | int |  | AI |  |  | tenant |  |
| 10.0 |  |  |  |  | auto_classified_count | int |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | requires_review_count | int |  |  |  |  | tenant |  |
| 12.0 | L4 | D02 | DSAR (Data Subject Rights) | Access Request | request_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 13.0 |  |  |  |  | data_subject_id | uuid | x |  |  |  | tenant |  |
| 14.0 |  |  |  |  | kind | enum | x |  |  |  | tenant | access/portability/rectification/erasure/restriction |
| 15.0 |  |  |  |  | submitted_at | datetime |  |  |  |  | tenant |  |
| 16.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | legal_review_required | boolean |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | export_url | string |  |  |  |  | tenant | at-rest şifreli |
| 19.0 |  |  |  |  | completed_at | datetime |  |  |  |  | tenant |  |
| 20.0 |  |  |  | Erasure Plan | plan_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 21.0 |  |  |  |  | data_subject_id | uuid | x |  |  |  | tenant |  |
| 22.0 |  |  |  |  | affected_doctypes | list<string> |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | affected_record_count | int |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | legal_hold_blocks | list<uuid> |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | ai_review_summary | text |  | AI |  |  | tenant |  |
| 26.0 |  |  |  |  | approved_by | uuid |  |  |  |  | tenant |  |
| 27.0 | L4 | D02 | Field-level Encryption | Encryption Policy | policy_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | doctype_id | uuid | x |  |  |  | tenant |  |
| 29.0 |  |  |  |  | field_name | string | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | algorithm | enum |  |  |  |  | tenant | aes_256_gcm/chacha20 |
| 31.0 |  |  |  |  | key_ref | string |  |  |  |  | tenant | at-rest şifreli |
| 32.0 |  |  |  |  | rotation_schedule | string |  |  |  |  | tenant |  |
| 33.0 | L4 | D02 | Log & LLM Redaction | Redaction Rule | rule_id | uuid |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | pattern | text | x |  |  |  | tenant | regex/ner_label |
| 35.0 |  |  |  |  | replacement_template | string |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | ai_classifier_threshold | decimal |  | AI |  |  | tenant |  |
| 37.0 |  |  |  | Pre-LLM Redaction | redaction_run_id | uuid |  |  |  |  | tenant | audit log'a düşer |
| 38.0 |  |  |  |  | trace_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | entities_redacted | list<string> |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | ai_classifier_score | decimal |  | AI |  |  | tenant |  |
| 41.0 | L4 | D02 | Cross-border Transfer | Data Residency | residency_rule_id | uuid |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | tenant_id | uuid | x |  |  |  | tenant |  |
| 43.0 |  |  |  |  | allowed_regions | list<string> |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | transfer_audit_required | boolean |  |  |  |  | tenant |  |

---

## Sheet: D03 Compliance Framework (KVKK 

**Boyut:** 40 satır × 13 sütun

### İlk 5 satır (metadata)

```
D03 — Compliance Framework (KVKK / GDPR / SOC2) |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Veri, Uyumluluk ve Güvenlik (L4)    |    F |  |  |  |  |  |  |  |  |  |  |  | 
Uyumluluk kontrol matrisi, kanıt toplama otomasyon |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L4 | D03 | Control Catalog | Control | control_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | framework | enum | x |  |  |  | tenant | kvkk/gdpr/soc2/iso27001/hipaa |
| 3.0 |  |  |  |  | reference | string | x |  |  |  | tenant | ör. SOC2-CC6.1 |
| 4.0 |  |  |  |  | description | text |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 6.0 |  |  |  |  | automated_check_available | boolean |  |  |  |  | tenant |  |
| 7.0 | L4 | D03 | Evidence Collection | Evidence Item | evidence_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 8.0 |  |  |  |  | control_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | collected_at | datetime |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | collector_kind | enum |  |  |  |  | tenant | automated/manual/agent |
| 11.0 |  |  |  |  | artifact_url | string |  |  |  |  | tenant | at-rest şifreli |
| 12.0 |  |  |  |  | ai_relevance_score | decimal |  | AI |  |  | tenant |  |
| 13.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 14.0 | L4 | D03 | Compliance Run & Score | Run | run_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | framework | enum | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | started_at | datetime |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | controls_checked | int |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | controls_passed | int |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | controls_failed | int |  |  |  |  | tenant |  |
| 20.0 |  |  |  |  | posture_score | decimal |  |  |  |  | tenant |  |
| 21.0 |  |  |  |  | ai_executive_summary | text |  | AI |  |  | tenant |  |
| 22.0 |  |  |  | Discrepancy Ticket | ticket_id | uuid | x |  |  |  | tenant |  |
| 23.0 |  |  |  |  | control_id | uuid | x |  |  |  | tenant |  |
| 24.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 25.0 |  |  |  |  | assigned_to | uuid |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | ai_remediation_plan | text |  | AI |  |  | tenant |  |
| 27.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 28.0 | L4 | D03 | VERBİS / Article 30 Records | Processing Activity Record | record_id | uuid | x |  |  |  | tenant |  |
| 29.0 |  |  |  |  | activity_name | string | x |  |  |  | tenant |  |
| 30.0 |  |  |  |  | legal_basis | enum |  |  |  |  | tenant | consent/contract/legal_obligation/legitimate_interest |
| 31.0 |  |  |  |  | data_categories | list<string> |  |  |  |  | tenant |  |
| 32.0 |  |  |  |  | data_subjects | list<string> |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | retention_period | string |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | recipients | list<string> |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | cross_border_transfer | boolean |  |  |  |  | tenant |  |

---

## Sheet: O01 Observability & SLO Monitor

**Boyut:** 45 satır × 13 sütun

### İlk 5 satır (metadata)

```
O01 — Observability & SLO Monitoring |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Operasyon ve Marketplace (L5)    |    Faz: |  |  |  |  |  |  |  |  |  |  |  | 
Logs, metrics, traces — unified observability. SLO |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L5 | O01 | Telemetry Pipeline | Log Stream | stream_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | source | string | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | log_level | enum |  |  |  |  | tenant | trace/debug/info/warn/error/fatal |
| 4.0 |  |  |  |  | retention_days | int |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | parser | string |  |  |  |  | tenant |  |
| 6.0 |  |  |  | Metric Series | metric_id | uuid | x |  |  |  | tenant |  |
| 7.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 8.0 |  |  |  |  | kind | enum |  |  |  |  | tenant | counter/gauge/histogram/summary |
| 9.0 |  |  |  |  | unit | string |  |  |  |  | tenant |  |
| 10.0 |  |  |  |  | labels | list<string> |  |  |  |  | tenant |  |
| 11.0 |  |  |  | Distributed Trace | trace_id | string | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | root_span_name | string |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | total_duration_ms | int |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | services_touched | list<string> |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | errors_present | boolean |  |  |  |  | tenant |  |
| 16.0 | L5 | O01 | SLO Definition | SLO | slo_id | uuid | x |  |  |  | tenant |  |
| 17.0 |  |  |  |  | name | string | x |  |  |  | tenant |  |
| 18.0 |  |  |  |  | target_percent | decimal | x |  |  |  | tenant |  |
| 19.0 |  |  |  |  | indicator_query | text | x |  |  |  | tenant |  |
| 20.0 |  |  |  |  | window | enum |  |  |  |  | tenant | rolling_7d/rolling_30d/calendar_month |
| 21.0 |  |  |  |  | error_budget_remaining | decimal |  |  |  |  | tenant | stream edilir |
| 22.0 | L5 | O01 | Alerting | Alert Rule | rule_id | uuid | x |  |  |  | tenant |  |
| 23.0 |  |  |  |  | name | string |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | condition | text | x |  |  |  | tenant |  |
| 25.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | notification_channels | list<uuid> |  |  |  |  | tenant |  |
| 27.0 |  |  |  |  | ai_runbook_link | string |  | AI |  |  | tenant |  |
| 28.0 |  |  |  | Incident | incident_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 29.0 |  |  |  |  | triggered_at | datetime |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 31.0 |  |  |  |  | status | enum |  |  |  |  | tenant | firing/acked/resolved |
| 32.0 |  |  |  |  | on_call_principal_id | uuid |  |  |  |  | tenant |  |
| 33.0 |  |  |  |  | ai_initial_diagnosis | text |  | AI |  |  | tenant |  |
| 34.0 |  |  |  |  | postmortem_url | string |  |  |  |  | tenant |  |
| 35.0 | L5 | O01 | Anomaly Detection | Anomaly Signal | signal_id | uuid |  |  |  |  | tenant |  |
| 36.0 |  |  |  |  | metric_id | uuid |  |  |  |  | tenant |  |
| 37.0 |  |  |  |  | detected_at | datetime |  |  |  |  | tenant |  |
| 38.0 |  |  |  |  | magnitude_z_score | decimal |  | AI |  |  | tenant |  |
| 39.0 |  |  |  |  | ai_root_cause_hypothesis | text |  | AI |  |  | tenant |  |
| 40.0 |  |  |  |  | suppressed | boolean |  |  |  |  | tenant |  |

---

## Sheet: O02 Plugin Marketplace

**Boyut:** 54 satır × 13 sütun

### İlk 5 satır (metadata)

```
O02 — Plugin Marketplace |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Operasyon ve Marketplace (L5)    |    Faz: |  |  |  |  |  |  |  |  |  |  |  | 
3. parti plugin keşif, kurulum, lisans, ödeme, sür |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L5 | O02 | Listing | Plugin Listing | listing_id | uuid | x |  |  |  | tenant |  |
| 2.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | title | string | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | short_description | string |  |  |  |  | tenant |  |
| 5.0 |  |  |  |  | long_description | text |  | AI |  |  | tenant | AI optimized |
| 6.0 |  |  |  |  | category | string |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | tags | list<string> |  |  |  |  | tenant |  |
| 8.0 |  |  |  |  | screenshots | list<string> |  |  |  |  | tenant |  |
| 9.0 |  |  |  |  | status | enum |  |  |  |  | tenant | draft/submitted/approved/rejected/published/delisted |
| 10.0 |  |  |  | Pricing Plan | plan_id | uuid | x |  |  |  | tenant |  |
| 11.0 |  |  |  |  | listing_id | uuid | x |  |  |  | tenant |  |
| 12.0 |  |  |  |  | model | enum |  |  |  |  | tenant | free/one_time/subscription/usage |
| 13.0 |  |  |  |  | price_per_month_usd | decimal |  |  |  |  | tenant |  |
| 14.0 |  |  |  |  | trial_days | int |  |  |  |  | tenant |  |
| 15.0 |  |  |  |  | revenue_share_percent | decimal |  |  |  |  | tenant |  |
| 16.0 | L5 | O02 | Discovery | Marketplace Search | search_id | uuid |  |  | x |  | tenant |  |
| 17.0 |  |  |  |  | query | string |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | category_filter | string |  |  |  |  | tenant |  |
| 19.0 |  |  |  |  | ai_personalized_ranking | boolean |  | AI |  |  | tenant |  |
| 20.0 |  |  |  | Recommendation | rec_id | uuid |  | AI |  |  | tenant |  |
| 21.0 |  |  |  |  | user_id | uuid |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | recommended_plugins | list<uuid> |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | recommendation_basis | text |  | AI |  |  | tenant |  |
| 24.0 | L5 | O02 | Purchase & Licensing | Purchase | purchase_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 25.0 |  |  |  |  | buyer_tenant_id | uuid | x |  |  |  | tenant |  |
| 26.0 |  |  |  |  | listing_id | uuid | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | plan_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | amount_usd | decimal |  |  |  |  | tenant |  |
| 29.0 |  |  |  |  | status | enum |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | purchased_at | datetime |  |  |  |  | tenant |  |
| 31.0 |  |  |  | License Key | license_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | purchase_id | uuid | x |  |  |  | tenant |  |
| 33.0 |  |  |  |  | license_key_hash | string |  |  |  |  | tenant | at-rest şifreli |
| 34.0 |  |  |  |  | activated_at | datetime |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | expires_at | datetime |  |  |  |  | tenant |  |
| 36.0 | L5 | O02 | Reviews & Rating | Review | review_id | uuid | x |  |  |  | tenant |  |
| 37.0 |  |  |  |  | listing_id | uuid | x |  |  |  | tenant |  |
| 38.0 |  |  |  |  | user_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | rating | int |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | body | text |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | ai_sentiment | enum |  | AI |  |  | tenant |  |
| 42.0 |  |  |  |  | verified_purchase | boolean |  |  |  |  | tenant |  |
| 43.0 | L5 | O02 | Developer Dashboard | Revenue Dashboard | snapshot_id | uuid |  |  |  |  | tenant |  |
| 44.0 |  |  |  |  | developer_id | uuid | x |  |  |  | tenant |  |
| 45.0 |  |  |  |  | period | enum |  |  |  |  | tenant |  |
| 46.0 |  |  |  |  | gross_revenue_usd | decimal |  |  |  |  | tenant |  |
| 47.0 |  |  |  |  | payout_usd | decimal |  |  |  |  | tenant |  |
| 48.0 |  |  |  |  | install_count | int |  |  |  |  | tenant |  |
| 49.0 |  |  |  |  | active_user_count | int |  |  |  |  | tenant |  |

---

## Sheet: O03 Plugin Security Review & Sa

**Boyut:** 47 satır × 13 sütun

### İlk 5 satır (metadata)

```
O03 — Plugin Security Review & Sandbox Certificati |  |  |  |  |  |  |  |  |  |  |  | 
Katman: Operasyon ve Marketplace (L5)    |    Faz: |  |  |  |  |  |  |  |  |  |  |  | 
3. parti plugin'lerin güvenlik denetimi, sandbox u |  |  |  |  |  |  |  |  |  |  |  | 
 |  |  |  |  |  |  |  |  |  |  |  | 
# | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama
```

### Veri (header satır 5)

| # | Layer | Modül | Yetenek | İşlem | Alan | Tür | Zorunlu | AI | MCP-Tool | Idempotent | Tenancy | Açıklama |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.0 | L5 | O03 | Submission Pipeline | Submission | submission_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 2.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 3.0 |  |  |  |  | version | semver | x |  |  |  | tenant |  |
| 4.0 |  |  |  |  | bundle_url | string | x |  |  |  | tenant |  |
| 5.0 |  |  |  |  | signature | string | x |  |  |  | tenant | at-rest şifreli |
| 6.0 |  |  |  |  | submitted_at | datetime |  |  |  |  | tenant |  |
| 7.0 |  |  |  |  | status | enum |  |  |  |  | tenant | queued/scanning/manual_review/approved/rejected |
| 8.0 | L5 | O03 | Automated Scanning | SAST Scan | scan_id | uuid | x |  |  |  | tenant |  |
| 9.0 |  |  |  |  | submission_id | uuid | x |  |  |  | tenant |  |
| 10.0 |  |  |  |  | findings_critical | int |  |  |  |  | tenant |  |
| 11.0 |  |  |  |  | findings_high | int |  |  |  |  | tenant |  |
| 12.0 |  |  |  |  | findings_medium | int |  |  |  |  | tenant |  |
| 13.0 |  |  |  |  | ai_triage_summary | text |  | AI |  |  | tenant |  |
| 14.0 |  |  |  | Dependency Scan | scan_id | uuid | x |  |  |  | tenant |  |
| 15.0 |  |  |  |  | submission_id | uuid | x |  |  |  | tenant |  |
| 16.0 |  |  |  |  | vulnerable_deps_count | int |  |  |  |  | tenant |  |
| 17.0 |  |  |  |  | license_violations | list<string> |  |  |  |  | tenant |  |
| 18.0 |  |  |  |  | sbom_url | string |  |  |  |  | tenant |  |
| 19.0 |  |  |  | Sandbox Compliance Test | test_id | uuid | x |  |  |  | tenant |  |
| 20.0 |  |  |  |  | submission_id | uuid | x |  |  |  | tenant |  |
| 21.0 |  |  |  |  | egress_attempts | int |  |  |  |  | tenant |  |
| 22.0 |  |  |  |  | syscall_violations | int |  |  |  |  | tenant |  |
| 23.0 |  |  |  |  | resource_exceedances | int |  |  |  |  | tenant |  |
| 24.0 |  |  |  |  | verdict | enum |  |  |  |  | tenant |  |
| 25.0 | L5 | O03 | Manual Review | Reviewer Assignment | assignment_id | uuid |  |  |  |  | tenant |  |
| 26.0 |  |  |  |  | submission_id | uuid | x |  |  |  | tenant |  |
| 27.0 |  |  |  |  | reviewer_id | uuid | x |  |  |  | tenant |  |
| 28.0 |  |  |  |  | ai_pre_review_brief | text |  | AI |  |  | tenant |  |
| 29.0 |  |  |  |  | reviewer_notes | text |  |  |  |  | tenant |  |
| 30.0 |  |  |  |  | decision | enum |  |  |  |  | tenant |  |
| 31.0 | L5 | O03 | Signing & Distribution | Signed Artifact | artifact_id | uuid | x |  |  |  | tenant |  |
| 32.0 |  |  |  |  | submission_id | uuid | x |  |  |  | tenant |  |
| 33.0 |  |  |  |  | signed_at | datetime |  |  |  |  | tenant |  |
| 34.0 |  |  |  |  | signing_authority | string |  |  |  |  | tenant |  |
| 35.0 |  |  |  |  | checksum | string | x |  |  |  | tenant |  |
| 36.0 |  |  |  |  | distribution_cdn_url | string |  |  |  |  | tenant |  |
| 37.0 | L5 | O03 | Post-publish Monitoring | Vulnerability Disclosure | disclosure_id | uuid | x |  |  |  | tenant | audit log'a düşer |
| 38.0 |  |  |  |  | plugin_id | uuid | x |  |  |  | tenant |  |
| 39.0 |  |  |  |  | severity | enum |  |  |  |  | tenant |  |
| 40.0 |  |  |  |  | affected_versions | list<semver> |  |  |  |  | tenant |  |
| 41.0 |  |  |  |  | forced_uninstall | boolean |  |  |  |  | tenant |  |
| 42.0 |  |  |  |  | ai_blast_radius_estimate | text |  | AI |  |  | tenant |  |

---

