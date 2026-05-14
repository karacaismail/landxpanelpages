# Excel → UI Eşlemesi

Bu doküman Excel'deki 33 modülün hangi UI route / bileşeniyle gerçekleşeceğini gösterir.

| Modül | Route | Bileşen | Not |
|---|---|---|---|
| K01 Plugin Lifecycle | `/admin/plugins` | PluginsPage | Marketplace + install mock |
| K02 DocType Engine | `/admin/settings/schema` | SchemaInspector | Tabloların inspect modu |
| K03 Migration & Versioning | `/admin/settings/schema-history` | SchemaHistoryPage | Timeline view |
| K04 Hook & Event Bus | `/admin/rules` | EcaListPage | ECA editor üzerinden görünür |
| K05 Service Container & Config | `/admin/settings` | PlatformSettings | Yapılandırma sayfası |
| I01 Tenant Lifecycle | `/admin/settings/tenant` | TenantPage | Multi-tenant rozet |
| I02 User & Identity Core | `/admin/users` + `/account/profile` | UsersTable + ProfilePage | |
| I03 Auth & Sessions | `/auth/*` | LoginPage / Register / Forgot / Passkey | Mock passkey + magic link |
| I04 Permission Framework | `/admin/roles` | RolesPage | RBAC + ABAC editor |
| I05 Multi-Tenant Isolation | inline rozet | TenantBadge | Header'da gösterilir |
| A01 MCP Server | `AiAssistantDrawer` | Drawer | Tüm sayfalarda |
| A02 Tool Registry | `/admin/settings/ai-tools` | AiToolsPage | |
| A03 Agent Identity & Scopes | `/admin/roles` (agent tab) | AgentScopesTab | |
| A04 Agent Memory | `/account/preferences` | PreferencesPage | Kişisel tercih |
| A05 Vector Store | `/admin/settings/ai-search` | AiSearchPage | |
| A06 Prompt Library | `/admin/settings/ai-prompts` | AiPromptsPage | Liste + diff |
| A07 LLM Providers | `/admin/settings/ai-providers` | AiProvidersPage | |
| A08 LLM Observability | `/admin/reports/ai-usage` | AiUsageReport | Chart + table |
| A09 Agent Orchestration | `AiAssistantDrawer` (Flow sekmesi) | HitlFlowPanel | HITL onay noktaları |
| A10 Streaming & SSE | inline | TypewriterText | Mesaj akışı animasyonu |
| A11 Conversation Mgmt | `AiAssistantDrawer` (Sohbet sekmesi) | ChatHistory | Çoklu konuşma |
| S01 Auto REST API | invisible | (msw handlers) | Mock backend |
| S02 Auto Admin UI | tüm `/admin/*` | DataTable + form | |
| S03 Form & Validation | tüm formlar | FormField + RHF | |
| S04 Workflow & State | inline | StatusBadge + transition | İlan/teklif/randevu |
| S05 Notification Center | `/notifications` | NotificationsCenterPage + Drawer | |
| S06 Search & Discovery | `/discover` + Cmd+K | DiscoverPage + CommandPalette | |
| D01 Audit Log | `/admin/audit` | AuditLogPage | Hash chain göstergesi |
| D02 PII Governance | `/account/privacy` + `/admin/settings/pii` | PrivacyPage + PiiPage | |
| D03 Compliance | `/admin/compliance` | CompliancePage | KVKK/VERBİS posture |
| O01 Observability & SLO | `/admin/reports/health` | HealthPage | |
| O02 Plugin Marketplace | `/admin/plugins/marketplace` | MarketplacePage | |
| O03 Plugin Security | `/admin/plugins/security` | PluginSecurityPage | |
