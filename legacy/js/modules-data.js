const MODULES = {
  K01: {
    id:'K01', layer:'L0', name:'Plugin Lifecycle Manager',
    faz:'Faz 1', priority:'P0', squad:'Kernel Squad',
    color:'#6366f1', icon:'ph-plug',
    desc:'Plugin keşfi, manifest doğrulama, install/upgrade/uninstall, dependency resolution, sürüm uyumluluğu. Tüm üst katmanlar buna bağlı.',
    kpis:["Plugin install p95 <30sn", "dependency conflict otomatik tespiti %100", "downtime-free upgrade oranı >%95"],
    capabilities:["Plugin Manifest & Metadata", "Install / Upgrade / Uninstall", "Dependency Resolution", "Plugin Registry"],
    fields:[{"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "slug", "type": "string(60)", "req": true, "ai": false}, {"name": "name", "type": "string(120)", "req": true, "ai": false}, {"name": "version", "type": "semver", "req": true, "ai": false}, {"name": "author", "type": "string", "req": true, "ai": false}, {"name": "license", "type": "enum", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": true, "ai": false}, {"name": "installed_at", "type": "datetime", "req": true, "ai": false}, {"name": "schema_version", "type": "semver", "req": true, "ai": false}, {"name": "checksum", "type": "string(64)", "req": true, "ai": false}, {"name": "signed", "type": "boolean", "req": true, "ai": false}, {"name": "signature_authority", "type": "string", "req": false, "ai": false}, {"name": "validation_errors", "type": "jsonb", "req": false, "ai": false}, {"name": "compatibility_matrix", "type": "jsonb", "req": true, "ai": false}],
    tools:["install_plugin", "uninstall_plugin", "list_plugins", "validate_manifest", "activate_plugin", "deactivate_plugin"]
  },
  K02: {
    id:'K02', layer:'L0', name:'DocType Engine (Schema Runtime)',
    faz:'Faz 1', priority:'P0', squad:'Kernel Squad',
    color:'#6366f1', icon:'ph-database',
    desc:'Deklaratif DocType tanımı → runtime\'da DB tablosu, REST endpoint, validation, admin UI ve MCP tool spec\'i otomatik üretilir. Frappe DocType\'ın AI-native eşdeğeri.',
    kpis:["DocType definition → çalışır API <60sn", "schema introspection LLM tool descriptionu için %100 kapsama", "declarative migration eşleşmesi >%99"],
    capabilities:["DocType Definition", "Runtime Schema Operations", "Relations & Foreign Keys", "Soft Delete & Versioning"],
    fields:[{"name": "doctype_id", "type": "uuid", "req": true, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string(80)", "req": true, "ai": false}, {"name": "display_name", "type": "string", "req": true, "ai": false}, {"name": "namespace", "type": "string", "req": true, "ai": false}, {"name": "is_singleton", "type": "boolean", "req": false, "ai": false}, {"name": "is_submittable", "type": "boolean", "req": false, "ai": false}, {"name": "created_at", "type": "datetime", "req": true, "ai": false}, {"name": "type", "type": "enum", "req": true, "ai": false}, {"name": "required", "type": "boolean", "req": false, "ai": false}, {"name": "unique", "type": "boolean", "req": false, "ai": false}, {"name": "indexed", "type": "boolean", "req": false, "ai": false}, {"name": "default_value", "type": "jsonb", "req": false, "ai": false}, {"name": "validation_rule", "type": "string", "req": false, "ai": false}],
    tools:["create_doctype", "update_schema", "introspect_doctype", "list_doctypes", "generate_api_schema"]
  },
  K03: {
    id:'K03', layer:'L0', name:'Migration & Versioning Engine',
    faz:'Faz 2', priority:'P0', squad:'Kernel Squad',
    color:'#6366f1', icon:'ph-git-branch',
    desc:'Plugin sürüm geçişlerinde DB schema migration, data migration, rollback. Frappe migrate\'in AI-augmented eşdeğeri.',
    kpis:["Migration generation accuracy >%95", "rollback success >%99", "AI-suggested migration plan acceptance rate >%80"],
    capabilities:["Migration Plan", "Migration Execution", "Schema Diff", "Data Migration"],
    fields:[{"name": "migration_id", "type": "uuid", "req": true, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "from_version", "type": "semver", "req": true, "ai": false}, {"name": "to_version", "type": "semver", "req": true, "ai": false}, {"name": "plan_type", "type": "enum", "req": false, "ai": false}, {"name": "ai_generated", "type": "boolean", "req": false, "ai": true}, {"name": "human_reviewed", "type": "boolean", "req": true, "ai": false}, {"name": "estimated_duration_sec", "type": "int", "req": false, "ai": true}, {"name": "destructive_operations", "type": "list<string>", "req": false, "ai": false}, {"name": "run_id", "type": "uuid", "req": true, "ai": false}, {"name": "started_at", "type": "datetime", "req": true, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "progress_percent", "type": "decimal", "req": false, "ai": false}, {"name": "error_log", "type": "text", "req": false, "ai": false}],
    tools:["generate_migration_plan", "execute_migration", "rollback_migration", "preview_migration", "list_migrations"]
  },
  K04: {
    id:'K04', layer:'L0', name:'Hook & Event Bus',
    faz:'Faz 1', priority:'P0', squad:'Kernel Squad',
    color:'#6366f1', icon:'ph-broadcast',
    desc:'Plugin\'lerin birbirini bilmeden davranış genişletmesi için hook (sync) ve event (async) sistemi. Drupal hook\'larının async + agent-aware eşdeğeri.',
    kpis:["Event delivery p95 <50ms", "hook timeout incidence <%0.1", "dead-letter recovery >%95"],
    capabilities:["Hook Registry", "Event Bus", "Pattern: Outbox & Saga"],
    fields:[{"name": "hook_id", "type": "uuid", "req": true, "ai": false}, {"name": "hook_name", "type": "string", "req": true, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "doctype_target", "type": "string", "req": false, "ai": false}, {"name": "priority", "type": "int", "req": false, "ai": false}, {"name": "blocking", "type": "boolean", "req": false, "ai": false}, {"name": "max_runtime_ms", "type": "int", "req": false, "ai": false}, {"name": "triggered_by", "type": "string", "req": false, "ai": false}, {"name": "payload", "type": "jsonb", "req": false, "ai": false}, {"name": "duration_ms", "type": "int", "req": false, "ai": false}, {"name": "error", "type": "text", "req": false, "ai": false}, {"name": "event_id", "type": "uuid", "req": true, "ai": false}, {"name": "topic", "type": "string", "req": true, "ai": false}, {"name": "emitted_by", "type": "string", "req": false, "ai": false}],
    tools:["register_hook", "dispatch_event", "list_hooks", "remove_hook", "replay_event"]
  },
  K05: {
    id:'K05', layer:'L0', name:'Service Container & Configuration',
    faz:'Faz 2', priority:'P1', squad:'Kernel Squad',
    color:'#6366f1', icon:'ph-cube',
    desc:'Dependency injection container, hierarchical configuration (global → tenant → user), feature flags, secret resolution.',
    kpis:["Config read p99 <5ms", "feature flag toggle propagation <2sn", "secret rotation downtime 0"],
    capabilities:["Service Registry", "Configuration Hierarchy", "Feature Flags", "Secrets Resolution"],
    fields:[{"name": "service_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "interface", "type": "string", "req": true, "ai": false}, {"name": "implementation", "type": "string", "req": true, "ai": false}, {"name": "scope", "type": "enum", "req": false, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": false, "ai": false}, {"name": "requested_interface", "type": "string", "req": true, "ai": false}, {"name": "resolved_implementation", "type": "string", "req": false, "ai": false}, {"name": "resolution_path", "type": "list<string>", "req": false, "ai": false}, {"name": "key", "type": "string(120)", "req": true, "ai": false}, {"name": "value", "type": "jsonb", "req": false, "ai": false}, {"name": "scope_id", "type": "uuid", "req": false, "ai": false}, {"name": "type", "type": "enum", "req": false, "ai": false}, {"name": "version", "type": "int", "req": false, "ai": false}],
    tools:["get_config", "set_config", "rotate_secret", "list_services", "health_check"]
  },
  I01: {
    id:'I01', layer:'L1', name:'Tenant Lifecycle Management',
    faz:'Faz 1', priority:'P0', squad:'Identity Squad',
    color:'#0ea5e9', icon:'ph-buildings',
    desc:'Tenant (müşteri organizasyon) provisioning, suspend, archive, kota yönetimi. Multi-tenant SaaS\'in en alt katmanı.',
    kpis:["Provisioning p95 <60sn", "isolation breach 0", "schema-per-tenant migration eşzamanlılığı >%95"],
    capabilities:["Tenant Provisioning", "Quota & Resource Limits", "Tenant Configuration Profile", "Suspension & Lifecycle"],
    fields:[{"name": "tenant_id", "type": "uuid", "req": true, "ai": false}, {"name": "slug", "type": "string(60)", "req": true, "ai": false}, {"name": "display_name", "type": "string", "req": true, "ai": false}, {"name": "isolation_strategy", "type": "enum", "req": true, "ai": false}, {"name": "schema_name", "type": "string", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": true, "ai": false}, {"name": "created_at", "type": "datetime", "req": true, "ai": false}, {"name": "activated_at", "type": "datetime", "req": false, "ai": false}, {"name": "region", "type": "enum", "req": false, "ai": false}, {"name": "step", "type": "enum", "req": false, "ai": false}, {"name": "ai_resource_estimate", "type": "jsonb", "req": false, "ai": true}, {"name": "rollback_token", "type": "string", "req": false, "ai": false}, {"name": "quota_id", "type": "uuid", "req": true, "ai": false}, {"name": "resource", "type": "enum", "req": true, "ai": false}],
    tools:["provision_tenant", "suspend_tenant", "delete_tenant", "list_tenants", "upgrade_plan", "get_quota_usage"]
  },
  I02: {
    id:'I02', layer:'L1', name:'User & Identity Core',
    faz:'Faz 1', priority:'P0', squad:'Identity Squad',
    color:'#0ea5e9', icon:'ph-users',
    desc:'Bireysel kullanıcı, kurumsal kullanıcı, agent kullanıcı, system kullanıcı — hepsi tek polymorphic identity modelinde. Kullanıcının agent ile karıştırılmaması için principal_type ayrımı zorunlu.',
    kpis:["Kullanıcı arama p95 <300ms", "principal type resolution %100 doğruluk", "merge/split conflict <%0.1"],
    capabilities:["Principal Model", "Identity Federation", "Profile Merge & Split", "Group & Org Membership"],
    fields:[{"name": "principal_id", "type": "uuid", "req": true, "ai": false}, {"name": "principal_type", "type": "enum", "req": true, "ai": false}, {"name": "display_name", "type": "string", "req": true, "ai": false}, {"name": "status", "type": "enum", "req": true, "ai": false}, {"name": "created_at", "type": "datetime", "req": true, "ai": false}, {"name": "tenant_id", "type": "uuid", "req": true, "ai": false}, {"name": "external_idp_subject", "type": "string", "req": false, "ai": false}, {"name": "email", "type": "email", "req": true, "ai": false}, {"name": "phone", "type": "phone", "req": false, "ai": false}, {"name": "full_name", "type": "string", "req": false, "ai": false}, {"name": "locale", "type": "string", "req": false, "ai": false}, {"name": "timezone", "type": "string", "req": false, "ai": false}, {"name": "avatar_url", "type": "string", "req": false, "ai": false}, {"name": "kyc_level", "type": "enum", "req": false, "ai": false}],
    tools:["create_user", "update_user", "deactivate_user", "list_users", "assign_role", "get_principal"]
  },
  I03: {
    id:'I03', layer:'L1', name:'Authentication & Sessions',
    faz:'Faz 1', priority:'P0', squad:'Identity Squad',
    color:'#0ea5e9', icon:'ph-lock-key',
    desc:'Password, OAuth, OIDC, magic link, passkey, API key, agent token — tek auth katmanı. Agent token\'ları human session\'lardan ayrı muhasebe edilir.',
    kpis:["Login latency p95 <800ms", "brute-force attempt 0 başarılı", "agent token TTL ihlali 0"],
    capabilities:["Credential Types", "Session Management", "MFA / Step-up", "Risk-based Auth"],
    fields:[{"name": "credential_id", "type": "uuid", "req": true, "ai": false}, {"name": "principal_id", "type": "uuid", "req": true, "ai": false}, {"name": "password_hash", "type": "string", "req": true, "ai": false}, {"name": "hash_algorithm", "type": "enum", "req": false, "ai": false}, {"name": "must_change", "type": "boolean", "req": false, "ai": false}, {"name": "last_changed_at", "type": "datetime", "req": false, "ai": false}, {"name": "credential_id_b64", "type": "string", "req": true, "ai": false}, {"name": "public_key_b64", "type": "string", "req": true, "ai": false}, {"name": "aaguid", "type": "string", "req": false, "ai": false}, {"name": "device_label", "type": "string", "req": false, "ai": false}, {"name": "name", "type": "string", "req": false, "ai": false}, {"name": "prefix", "type": "string(8)", "req": false, "ai": false}, {"name": "hash", "type": "string", "req": false, "ai": false}, {"name": "scopes", "type": "list<string>", "req": false, "ai": false}],
    tools:["create_session", "validate_token", "revoke_session", "refresh_token", "verify_mfa"]
  },
  I04: {
    id:'I04', layer:'L1', name:'Permission Framework',
    faz:'Faz 1', priority:'P0', squad:'Identity Squad',
    color:'#0ea5e9', icon:'ph-shield-check',
    desc:'RBAC + ABAC + agent capability scopes. Agent kullanıcı adına çalışırken user\'ın izni VE agent\'ın capability scope\'u kesişimi geçerli olur.',
    kpis:["Permission check p99 <10ms", "misconfig (over-privileged) tespiti otomatik %100", "agent privilege escalation 0"],
    capabilities:["Roles & Permissions", "Agent Capability Scopes", "Field-level & Row-level Security", "Permission Audit"],
    fields:[{"name": "role_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "scope", "type": "enum", "req": false, "ai": false}, {"name": "inherits_from", "type": "list<uuid>", "req": false, "ai": false}, {"name": "description", "type": "text", "req": false, "ai": false}, {"name": "resource_type", "type": "string", "req": true, "ai": false}, {"name": "action", "type": "enum", "req": true, "ai": false}, {"name": "constraint_expression", "type": "text", "req": false, "ai": false}, {"name": "permission_id", "type": "uuid", "req": true, "ai": false}, {"name": "granted_by", "type": "uuid", "req": false, "ai": false}, {"name": "granted_at", "type": "datetime", "req": false, "ai": false}, {"name": "scope_id", "type": "uuid", "req": true, "ai": false}, {"name": "allowed_tools", "type": "list<string>", "req": true, "ai": false}, {"name": "allowed_resources", "type": "list<string>", "req": false, "ai": false}],
    tools:["check_permission", "grant_permission", "revoke_permission", "list_roles", "evaluate_policy"]
  },
  I05: {
    id:'I05', layer:'L1', name:'Multi-Tenant Isolation',
    faz:'Faz 2', priority:'P0', squad:'Identity Squad + Security Squad',
    color:'#0ea5e9', icon:'ph-intersect',
    desc:'Schema-per-tenant izolasyon, query interception, cross-tenant erişim tespiti, tenant context propagation. Agent çağrıları tenant context\'i kaybetmeden alt servislere taşınmalı.',
    kpis:["Cross-tenant breach 0", "tenant context propagation hatası <%0.01", "schema switch overhead p99 <2ms"],
    capabilities:["Tenant Context Propagation", "Query Interception", "Schema Routing", "Tenant Data Export & Deletion"],
    fields:[{"name": "request_id", "type": "uuid", "req": true, "ai": false}, {"name": "tenant_id", "type": "uuid", "req": true, "ai": false}, {"name": "principal_id", "type": "uuid", "req": false, "ai": false}, {"name": "agent_id", "type": "uuid", "req": false, "ai": false}, {"name": "trace_id", "type": "string", "req": false, "ai": false}, {"name": "entry_point", "type": "enum", "req": false, "ai": false}, {"name": "sealed_at", "type": "datetime", "req": false, "ai": false}, {"name": "expires_at", "type": "datetime", "req": false, "ai": false}, {"name": "signature", "type": "string", "req": false, "ai": false}, {"name": "rewrite_id", "type": "uuid", "req": false, "ai": false}, {"name": "original_query", "type": "text", "req": false, "ai": false}, {"name": "tenant_filter_added", "type": "boolean", "req": false, "ai": false}, {"name": "rewritten_query", "type": "text", "req": false, "ai": false}, {"name": "intercepted_at", "type": "datetime", "req": false, "ai": false}],
    tools:["enforce_isolation", "audit_isolation", "list_policies", "switch_strategy", "verify_context"]
  },
  A01: {
    id:'A01', layer:'L2', name:'MCP Server Framework',
    faz:'Faz 1', priority:'P0', squad:'Agent Runtime Squad',
    color:'#8b5cf6', icon:'ph-hard-drives',
    desc:'Model Context Protocol native server. Plugin\'lerin tanımladığı tool\'lar otomatik MCP endpoint olarak servis edilir. LLM agent\'lar standart MCP transport (stdio/sse/streaming-http) ile bağlanabilir.',
    kpis:["Tool discovery latency <100ms", "MCP transport uptime >%99.95", "tool description LLM-readable score >%95"],
    capabilities:["MCP Endpoint Management", "Initialize Handshake", "Discovery Endpoints", "Tool Invocation Protocol", "Streaming Responses"],
    fields:[{"name": "server_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "transport", "type": "enum", "req": true, "ai": false}, {"name": "endpoint_url", "type": "string", "req": false, "ai": false}, {"name": "auth_method", "type": "enum", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "protocol_version", "type": "string", "req": true, "ai": false}, {"name": "supports_tools", "type": "boolean", "req": false, "ai": false}, {"name": "supports_resources", "type": "boolean", "req": false, "ai": false}, {"name": "supports_prompts", "type": "boolean", "req": false, "ai": false}, {"name": "supports_sampling", "type": "boolean", "req": false, "ai": false}, {"name": "supports_subscription", "type": "boolean", "req": false, "ai": false}, {"name": "session_id", "type": "uuid", "req": true, "ai": false}, {"name": "client_id", "type": "string", "req": true, "ai": false}],
    tools:["register_server", "list_servers", "invoke_tool", "health_check_server", "deregister_server"]
  },
  A02: {
    id:'A02', layer:'L2', name:'Tool Registry & Discovery',
    faz:'Faz 1', priority:'P0', squad:'Agent Runtime Squad',
    color:'#8b5cf6', icon:'ph-list-magnifying-glass',
    desc:'Plugin\'lerin tanımladığı tool\'ların merkezi kataloğu. Her tool: input/output schema, side-effect annotation, idempotency, blast radius, cost class, LLM-readable description. AI agent\'ın hangi tool\'u ne zaman çağıracağını bilmesi için tool description AI-grade kalitede olmalı.',
    kpis:["Tool description LLM tool-selection accuracy >%90", "tool registry sync <5sn", "deprecated tool cleanup >%99"],
    capabilities:["Tool Definition", "Side-Effect & Safety Annotations", "Tool Versioning", "Search & Recommendation", "Usage Analytics"],
    fields:[{"name": "tool_id", "type": "uuid", "req": true, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string(80)", "req": true, "ai": false}, {"name": "namespace", "type": "string", "req": true, "ai": false}, {"name": "display_name", "type": "string", "req": true, "ai": false}, {"name": "status", "type": "enum", "req": true, "ai": false}, {"name": "created_at", "type": "datetime", "req": true, "ai": false}, {"name": "introspection_uri", "type": "string", "req": false, "ai": false}, {"name": "input_schema", "type": "json_schema", "req": true, "ai": true}, {"name": "output_schema", "type": "json_schema", "req": true, "ai": false}, {"name": "description_for_llm", "type": "text", "req": true, "ai": true}, {"name": "examples", "type": "list<jsonb>", "req": false, "ai": true}, {"name": "deprecation_notice", "type": "text", "req": false, "ai": false}, {"name": "read_only", "type": "boolean", "req": true, "ai": false}],
    tools:["register_tool", "discover_tools", "search_tools", "get_tool_schema", "deprecate_tool"]
  },
  A03: {
    id:'A03', layer:'L2', name:'Agent Identity & Capability Scopes',
    faz:'Faz 1', priority:'P0', squad:'Agent Runtime Squad + Security Squad',
    color:'#8b5cf6', icon:'ph-robot',
    desc:'Agent kimliği, capability scope binding, session-bound limit, blast-radius kontrolü, ihlal tespiti. Her agent çağrısında etkin yetki = user_perms ∩ agent_scope ∩ session_limits.',
    kpis:["Privilege escalation 0", "scope drift tespit <1sn", "scope binding accuracy %100"],
    capabilities:["Capability Pack Definition", "Agent-User Binding", "Session Limits & Throttling", "Tool Execution Sandbox", "Violation & Incident"],
    fields:[{"name": "pack_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "intended_persona", "type": "string", "req": false, "ai": false}, {"name": "included_tools", "type": "list<string>", "req": true, "ai": false}, {"name": "excluded_tools", "type": "list<string>", "req": false, "ai": false}, {"name": "max_token_budget", "type": "int", "req": false, "ai": false}, {"name": "max_runtime_sec", "type": "int", "req": false, "ai": false}, {"name": "approved_by_human", "type": "boolean", "req": true, "ai": false}, {"name": "binding_id", "type": "uuid", "req": true, "ai": false}, {"name": "agent_id", "type": "uuid", "req": true, "ai": false}, {"name": "user_id", "type": "uuid", "req": true, "ai": false}, {"name": "authorization_token", "type": "string", "req": false, "ai": false}, {"name": "delegation_expires_at", "type": "datetime", "req": false, "ai": false}, {"name": "revoked_at", "type": "datetime", "req": false, "ai": false}],
    tools:["create_scope", "validate_scope", "list_scopes", "audit_scope_usage", "revoke_scope"]
  },
  A04: {
    id:'A04', layer:'L2', name:'Agent Memory Layer',
    faz:'Faz 2', priority:'P0', squad:'Agent Runtime Squad',
    color:'#8b5cf6', icon:'ph-brain',
    desc:'Short-term (conversation buffer), long-term (semantic), episodic (geçmiş etkileşim), procedural (öğrenilmiş prosedür) memory katmanları. Hibrit retrieval: vector + SQL filter + temporal weighting.',
    kpis:["Memory recall relevance >%85", "write latency <100ms", "context window optimization (token tasarrufu) >%30"],
    capabilities:["Short-term Memory", "Long-term Semantic Memory", "Episodic Memory", "Procedural Memory", "Memory Hygiene"],
    fields:[{"name": "buffer_id", "type": "uuid", "req": true, "ai": false}, {"name": "session_id", "type": "uuid", "req": true, "ai": false}, {"name": "messages", "type": "list<jsonb>", "req": false, "ai": false}, {"name": "token_count", "type": "int", "req": false, "ai": false}, {"name": "max_token_budget", "type": "int", "req": false, "ai": false}, {"name": "compaction_strategy", "type": "enum", "req": false, "ai": false}, {"name": "ai_summary", "type": "text", "req": false, "ai": true}, {"name": "memory_id", "type": "uuid", "req": true, "ai": false}, {"name": "principal_id", "type": "uuid", "req": true, "ai": false}, {"name": "agent_id", "type": "uuid", "req": false, "ai": false}, {"name": "content", "type": "text", "req": true, "ai": false}, {"name": "embedding", "type": "vector(1536)", "req": true, "ai": false}, {"name": "memory_kind", "type": "enum", "req": false, "ai": false}, {"name": "source", "type": "string", "req": false, "ai": false}],
    tools:["store_memory", "recall_memory", "compact_memory", "forget_memory", "list_memories", "scrub_pii_from_memory"]
  },
  A05: {
    id:'A05', layer:'L2', name:'Vector Store & Embedding Pipeline',
    faz:'Faz 2', priority:'P0', squad:'Agent Runtime Squad + AI Squad',
    color:'#8b5cf6', icon:'ph-graph',
    desc:'pgvector tabanlı vector storage, embedding job runner, model versioning, hybrid search (vector + BM25 + filter), reranking. Tüm semantic operasyonların altyapısı.',
    kpis:["Embedding generation throughput >1000/dk", "hybrid search relevance NDCG@10 >0.75", "embedding model upgrade downtime 0"],
    capabilities:["Embedding Model Registry", "Embedding Generation", "Hybrid Search", "Reindex & Migration", "Index Statistics"],
    fields:[{"name": "model_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "provider", "type": "enum", "req": false, "ai": false}, {"name": "dimension", "type": "int", "req": true, "ai": false}, {"name": "max_input_tokens", "type": "int", "req": false, "ai": false}, {"name": "cost_per_million_tokens", "type": "decimal", "req": false, "ai": false}, {"name": "normalized", "type": "boolean", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "job_id", "type": "uuid", "req": true, "ai": false}, {"name": "source_doctype", "type": "string", "req": true, "ai": false}, {"name": "source_field", "type": "string", "req": true, "ai": false}, {"name": "rows_total", "type": "int", "req": false, "ai": false}, {"name": "rows_done", "type": "int", "req": false, "ai": false}, {"name": "retry_count", "type": "int", "req": false, "ai": false}],
    tools:["embed_text", "search_semantic", "upsert_vector", "delete_vectors", "list_namespaces"]
  },
  A06: {
    id:'A06', layer:'L2', name:'Prompt Library & Versioning',
    faz:'Faz 2', priority:'P0', squad:'AI Squad',
    color:'#8b5cf6', icon:'ph-text-t',
    desc:'Prompt\'ların kod gibi versiyonlanması, A/B test, eval suite, drift detection, rollout. Her prompt: input variables, output schema, eval cases, metrik bağlantısı.',
    kpis:["Prompt deploy <2dk", "A/B winning detection automated", "eval coverage per prompt >%80"],
    capabilities:["Prompt Definition", "A/B Testing", "Eval Suite", "Rollout & Rollback", "Drift Detection"],
    fields:[{"name": "prompt_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "category", "type": "enum", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "created_by", "type": "uuid", "req": false, "ai": false}, {"name": "created_at", "type": "datetime", "req": false, "ai": false}, {"name": "version", "type": "int", "req": true, "ai": false}, {"name": "system_template", "type": "text", "req": false, "ai": false}, {"name": "user_template", "type": "text", "req": true, "ai": false}, {"name": "variables_schema", "type": "json_schema", "req": true, "ai": false}, {"name": "output_schema", "type": "json_schema", "req": false, "ai": false}, {"name": "model_target", "type": "string", "req": false, "ai": false}, {"name": "temperature_default", "type": "decimal", "req": false, "ai": false}, {"name": "experiment_id", "type": "uuid", "req": true, "ai": false}],
    tools:["create_prompt", "version_prompt", "test_prompt", "deploy_prompt", "compare_versions", "run_eval"]
  },
  A07: {
    id:'A07', layer:'L2', name:'LLM Provider Abstraction',
    faz:'Faz 1', priority:'P0', squad:'AI Squad',
    color:'#8b5cf6', icon:'ph-cpu',
    desc:'Anthropic, OpenAI, Azure OpenAI, Bedrock, lokal Ollama gibi sağlayıcıları tek soyutlamada birleştirir. Routing (model fallback, cost-optimal, capability-based), retry, circuit breaker, streaming uyumluluğu.',
    kpis:["Provider failover <2sn", "cost optimization tasarruf >%20", "rate-limit absorption başarı >%99"],
    capabilities:["Provider Registry", "Routing & Fallback", "Retry & Circuit Breaker", "Streaming Adapter"],
    fields:[{"name": "provider_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "enum", "req": true, "ai": false}, {"name": "base_url", "type": "string", "req": false, "ai": false}, {"name": "auth_secret_ref", "type": "string", "req": false, "ai": false}, {"name": "region", "type": "string", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "supports_streaming", "type": "boolean", "req": false, "ai": false}, {"name": "supports_tool_use", "type": "boolean", "req": false, "ai": false}, {"name": "supports_vision", "type": "boolean", "req": false, "ai": false}, {"name": "model_name", "type": "string", "req": true, "ai": false}, {"name": "context_window", "type": "int", "req": false, "ai": false}, {"name": "max_output_tokens", "type": "int", "req": false, "ai": false}, {"name": "input_cost_per_million", "type": "decimal", "req": false, "ai": false}, {"name": "output_cost_per_million", "type": "decimal", "req": false, "ai": false}],
    tools:["call_llm", "list_providers", "route_request", "test_provider", "get_usage_stats"]
  },
  A08: {
    id:'A08', layer:'L2', name:'LLM Observability & Cost Tracking',
    faz:'Faz 2', priority:'P0', squad:'AI Squad + Platform Ops Squad',
    color:'#8b5cf6', icon:'ph-chart-line',
    desc:'Her LLM çağrısı: input/output, token count, latency, cost, trace, hallucination skoru. Langfuse-equivalent ama MCP-aware. Cost attribution: tenant/agent/feature.',
    kpis:["Cost attribution accuracy >%99", "hallucination flag false-positive <%10", "latency p99 dashboard refresh <30sn"],
    capabilities:["LLM Trace", "Cost Attribution", "Quality Signals", "Replay & Debug"],
    fields:[{"name": "trace_id", "type": "uuid", "req": true, "ai": false}, {"name": "session_id", "type": "uuid", "req": false, "ai": false}, {"name": "agent_id", "type": "uuid", "req": false, "ai": false}, {"name": "user_id", "type": "uuid", "req": false, "ai": false}, {"name": "tenant_id", "type": "uuid", "req": true, "ai": false}, {"name": "started_at", "type": "datetime", "req": true, "ai": false}, {"name": "ended_at", "type": "datetime", "req": false, "ai": false}, {"name": "total_duration_ms", "type": "int", "req": false, "ai": false}, {"name": "total_token_input", "type": "int", "req": false, "ai": false}, {"name": "total_token_output", "type": "int", "req": false, "ai": false}, {"name": "total_cost_usd", "type": "decimal", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "provider_id", "type": "uuid", "req": false, "ai": false}, {"name": "model", "type": "string", "req": false, "ai": false}],
    tools:["log_trace", "get_cost_report", "alert_budget", "list_traces", "export_traces", "flag_hallucination"]
  },
  A09: {
    id:'A09', layer:'L2', name:'Agent Orchestration & Workflow',
    faz:'Faz 3', priority:'P0', squad:'Agent Runtime Squad + AI Squad',
    color:'#8b5cf6', icon:'ph-flow-arrow',
    desc:'Çok-adımlı agent görevleri için workflow engine. Plan-execute-reflect döngüsü, alt-agent çağrısı, paralel tool execution, checkpoint/resume, human-in-the-loop.',
    kpis:["Multi-step task success rate >%75", "checkpoint-resume reliability >%99", "human approval queue median wait <15dk"],
    capabilities:["Workflow Definition", "Execution Run", "Checkpoint & Resume", "Human-in-the-Loop", "Multi-Agent Coordination"],
    fields:[{"name": "workflow_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "orchestration_pattern", "type": "enum", "req": true, "ai": false}, {"name": "max_iterations", "type": "int", "req": false, "ai": false}, {"name": "system_prompt_id", "type": "uuid", "req": false, "ai": false}, {"name": "tool_set_ids", "type": "list<uuid>", "req": false, "ai": false}, {"name": "requires_human_approval", "type": "boolean", "req": false, "ai": false}, {"name": "run_id", "type": "uuid", "req": true, "ai": false}, {"name": "agent_id", "type": "uuid", "req": true, "ai": false}, {"name": "trigger", "type": "enum", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": true, "ai": false}, {"name": "started_at", "type": "datetime", "req": false, "ai": false}, {"name": "completed_at", "type": "datetime", "req": false, "ai": false}, {"name": "iteration_count", "type": "int", "req": false, "ai": false}],
    tools:["create_workflow", "run_workflow", "pause_workflow", "approve_step", "get_workflow_status", "checkpoint_run"]
  },
  A10: {
    id:'A10', layer:'L2', name:'Streaming & SSE Primitives',
    faz:'Faz 2', priority:'P1', squad:'Agent Runtime Squad',
    color:'#8b5cf6', icon:'ph-wave-sine',
    desc:'LLM token stream, tool execution progress stream, agent step stream için unified SSE/WebSocket katmanı. Backpressure, reconnect, multiplex, fan-out destekli.',
    kpis:["Stream reconnect success >%99", "backpressure dropout <%0.1", "fan-out 1→N latency p99 <100ms"],
    capabilities:["Stream Channel", "Subscriber Lifecycle", "Backpressure & Buffering", "Transport"],
    fields:[{"name": "channel_id", "type": "uuid", "req": true, "ai": false}, {"name": "kind", "type": "enum", "req": true, "ai": false}, {"name": "subscriber_count", "type": "int", "req": false, "ai": false}, {"name": "created_at", "type": "datetime", "req": false, "ai": false}, {"name": "closed_at", "type": "datetime", "req": false, "ai": false}, {"name": "sequence", "type": "int", "req": true, "ai": false}, {"name": "event_type", "type": "string", "req": true, "ai": false}, {"name": "payload", "type": "jsonb", "req": false, "ai": false}, {"name": "emitted_at", "type": "datetime", "req": false, "ai": false}, {"name": "subscription_id", "type": "uuid", "req": true, "ai": false}, {"name": "subscriber_principal_id", "type": "uuid", "req": true, "ai": false}, {"name": "last_seen_sequence", "type": "int", "req": false, "ai": false}, {"name": "ack_mode", "type": "enum", "req": false, "ai": false}, {"name": "last_event_id", "type": "string", "req": false, "ai": false}],
    tools:["open_stream", "close_stream", "push_event", "subscribe_channel", "list_channels"]
  },
  A11: {
    id:'A11', layer:'L2', name:'Conversation & Session Management',
    faz:'Faz 2', priority:'P0', squad:'Agent Runtime Squad',
    color:'#8b5cf6', icon:'ph-chat-circle-dots',
    desc:'Konuşma geçmişi, session state, multi-turn context, message threading, branching (alternative replies), conversation forking. Agent ile insan ve agent ile agent karışık konuşmaları destekler.',
    kpis:["Session resume p95 <300ms", "conversation branching consistency %100", "context window optimization >%30"],
    capabilities:["Conversation", "Messages & Threading", "Context Window Management", "Conversation Sharing"],
    fields:[{"name": "conversation_id", "type": "uuid", "req": true, "ai": false}, {"name": "title", "type": "string", "req": false, "ai": true}, {"name": "primary_agent_id", "type": "uuid", "req": false, "ai": false}, {"name": "primary_user_id", "type": "uuid", "req": false, "ai": false}, {"name": "started_at", "type": "datetime", "req": true, "ai": false}, {"name": "last_message_at", "type": "datetime", "req": false, "ai": false}, {"name": "message_count", "type": "int", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "ai_topic_classification", "type": "text", "req": false, "ai": true}, {"name": "message_id", "type": "uuid", "req": true, "ai": false}, {"name": "role", "type": "enum", "req": true, "ai": false}, {"name": "sender_principal_id", "type": "uuid", "req": false, "ai": false}, {"name": "parent_message_id", "type": "uuid", "req": false, "ai": false}, {"name": "content", "type": "jsonb", "req": true, "ai": false}],
    tools:["create_conversation", "append_message", "summarize_context", "end_conversation", "branch_conversation"]
  },
  S01: {
    id:'S01', layer:'L3', name:'Auto REST API Engine',
    faz:'Faz 1', priority:'P0', squad:'Application Squad',
    color:'#10b981', icon:'ph-code',
    desc:'DocType tanımından otomatik REST endpoint üretimi (CRUD + filter + bulk). Aynı tanımdan OpenAPI spec, MCP tool listesi, GraphQL schema türetilir.',
    kpis:["DocType → API endpoint p95 <60sn", "OpenAPI conformance %100", "endpoint latency p95 <120ms"],
    capabilities:["CRUD Endpoint Generation", "OpenAPI Spec", "Bulk & Batch Operations", "Pagination & Cursor", "Webhooks & Outgoing"],
    fields:[{"name": "endpoint_id", "type": "uuid", "req": true, "ai": false}, {"name": "doctype_id", "type": "uuid", "req": true, "ai": false}, {"name": "path", "type": "string", "req": true, "ai": false}, {"name": "method", "type": "enum", "req": true, "ai": false}, {"name": "operation_id", "type": "string", "req": true, "ai": false}, {"name": "auth_required", "type": "boolean", "req": false, "ai": false}, {"name": "required_permissions", "type": "list<string>", "req": false, "ai": false}, {"name": "rate_limit_per_minute", "type": "int", "req": false, "ai": false}, {"name": "supported_operators", "type": "list<string>", "req": false, "ai": false}, {"name": "supports_jsonb_path", "type": "boolean", "req": false, "ai": false}, {"name": "supports_relation_traversal", "type": "boolean", "req": false, "ai": false}, {"name": "spec_id", "type": "uuid", "req": true, "ai": false}, {"name": "version", "type": "semver", "req": false, "ai": false}, {"name": "openapi_version", "type": "string", "req": false, "ai": false}],
    tools:["generate_api", "list_endpoints", "test_endpoint", "regenerate_docs", "disable_endpoint"]
  },
  S02: {
    id:'S02', layer:'L3', name:'Auto Admin UI Engine',
    faz:'Faz 2', priority:'P0', squad:'Application Squad',
    color:'#10b981', icon:'ph-layout',
    desc:'DocType tanımından auto-generated admin UI: list view, detail view, form, bulk actions, filter side-panel. Flowbite + React Router v7. AI co-pilot her ekranda.',
    kpis:["DocType → çalışır admin UI <2dk", "custom override penalty <%10", "Lighthouse a11y score >90"],
    capabilities:["List View", "Detail View & Form", "Bulk Actions", "AI Co-pilot Side-panel", "Theming & Branding"],
    fields:[{"name": "config_id", "type": "uuid", "req": true, "ai": false}, {"name": "doctype_id", "type": "uuid", "req": true, "ai": false}, {"name": "default_columns", "type": "list<string>", "req": false, "ai": false}, {"name": "default_sort", "type": "string", "req": false, "ai": false}, {"name": "page_size", "type": "int", "req": false, "ai": false}, {"name": "filter_panel_layout", "type": "enum", "req": false, "ai": false}, {"name": "supports_saved_views", "type": "boolean", "req": false, "ai": false}, {"name": "ai_quick_filter", "type": "boolean", "req": false, "ai": true}, {"name": "name", "type": "string", "req": false, "ai": false}, {"name": "filter_state", "type": "jsonb", "req": false, "ai": false}, {"name": "sort_state", "type": "jsonb", "req": false, "ai": false}, {"name": "is_shared", "type": "boolean", "req": false, "ai": false}, {"name": "layout_id", "type": "uuid", "req": true, "ai": false}, {"name": "sections", "type": "list<jsonb>", "req": false, "ai": false}],
    tools:["generate_page", "publish_page", "preview_page", "update_layout", "list_pages"]
  },
  S03: {
    id:'S03', layer:'L3', name:'Form & Validation Framework',
    faz:'Faz 2', priority:'P1', squad:'Application Squad',
    color:'#10b981', icon:'ph-check-square',
    desc:'Form lifecycle, server-side + client-side validation, conditional fields, wizard flows, AI auto-fill, draft autosave. Tüm validation kuralları MCP tool olarak dış dünyaya da expose edilir.',
    kpis:["Form save success >%99.5", "validation latency p95 <80ms", "AI auto-fill accuracy >%80"],
    capabilities:["Validation Rules", "Conditional Logic", "Wizard / Multi-step", "AI Auto-fill", "Draft & Autosave"],
    fields:[{"name": "rule_id", "type": "uuid", "req": true, "ai": false}, {"name": "doctype_id", "type": "uuid", "req": true, "ai": false}, {"name": "rule_kind", "type": "enum", "req": false, "ai": false}, {"name": "expression", "type": "text", "req": true, "ai": false}, {"name": "error_message", "type": "string", "req": false, "ai": false}, {"name": "ai_explanation", "type": "text", "req": false, "ai": true}, {"name": "field_name", "type": "string", "req": true, "ai": false}, {"name": "show_when", "type": "text", "req": false, "ai": false}, {"name": "required_when", "type": "text", "req": false, "ai": false}, {"name": "step_id", "type": "uuid", "req": true, "ai": false}, {"name": "step_index", "type": "int", "req": false, "ai": false}, {"name": "title", "type": "string", "req": false, "ai": false}, {"name": "required_fields", "type": "list<string>", "req": false, "ai": false}, {"name": "can_go_back", "type": "boolean", "req": false, "ai": false}],
    tools:["create_form", "validate_data", "get_validation_rules", "update_rules", "preview_form"]
  },
  S04: {
    id:'S04', layer:'L3', name:'Workflow & State Machine',
    faz:'Faz 3', priority:'P1', squad:'Application Squad',
    color:'#10b981', icon:'ph-git-fork',
    desc:'DocType yaşam döngüsü için deklaratif state machine. Her transition: guard, action, side-effect, audit. Agent transition\'ı tetikleyebilir (scope izinliyse).',
    kpis:["Transition latency p95 <100ms", "illegal transition 0", "audit completeness %100"],
    capabilities:["Workflow Definition", "Transition Execution", "Side Effects", "Visualization"],
    fields:[{"name": "workflow_id", "type": "uuid", "req": true, "ai": false}, {"name": "doctype_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": false, "ai": false}, {"name": "initial_state", "type": "string", "req": true, "ai": false}, {"name": "terminal_states", "type": "list<string>", "req": false, "ai": false}, {"name": "version", "type": "int", "req": false, "ai": false}, {"name": "description", "type": "text", "req": false, "ai": false}, {"name": "is_terminal", "type": "boolean", "req": false, "ai": false}, {"name": "color", "type": "string", "req": false, "ai": false}, {"name": "from_state", "type": "string", "req": true, "ai": false}, {"name": "to_state", "type": "string", "req": true, "ai": false}, {"name": "event", "type": "string", "req": true, "ai": false}, {"name": "guard_expression", "type": "text", "req": false, "ai": false}, {"name": "required_permission", "type": "string", "req": false, "ai": false}],
    tools:["define_workflow", "transition_state", "get_current_state", "list_transitions", "reset_workflow"]
  },
  S05: {
    id:'S05', layer:'L3', name:'Notification Center',
    faz:'Faz 3', priority:'P1', squad:'Application Squad',
    color:'#10b981', icon:'ph-bell',
    desc:'Multi-channel bildirim: in-app, email, SMS, push, webhook, agent ping. Template management, user preferences, digest, throttle.',
    kpis:["Email delivery rate >%98", "in-app render p95 <500ms", "user preference compliance %100"],
    capabilities:["Channel & Provider", "Template", "User Preferences", "Delivery", "Digest"],
    fields:[{"name": "channel_id", "type": "uuid", "req": true, "ai": false}, {"name": "kind", "type": "enum", "req": true, "ai": false}, {"name": "provider", "type": "string", "req": false, "ai": false}, {"name": "config", "type": "jsonb", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "template_id", "type": "uuid", "req": true, "ai": false}, {"name": "name", "type": "string", "req": false, "ai": false}, {"name": "channel_kind", "type": "enum", "req": false, "ai": false}, {"name": "locale", "type": "enum", "req": false, "ai": false}, {"name": "subject", "type": "string", "req": false, "ai": false}, {"name": "body", "type": "text", "req": false, "ai": false}, {"name": "variables", "type": "jsonb", "req": false, "ai": false}, {"name": "ai_localization_status", "type": "enum", "req": false, "ai": true}, {"name": "preference_id", "type": "uuid", "req": true, "ai": false}],
    tools:["send_notification", "list_notifications", "mark_read", "create_template", "bulk_notify"]
  },
  S06: {
    id:'S06', layer:'L3', name:'Search & Discovery',
    faz:'Faz 3', priority:'P1', squad:'Application Squad + AI Squad',
    color:'#10b981', icon:'ph-magnifying-glass',
    desc:'DocType genel arama yüzeyi. Hybrid retrieval (BM25 + vector), faceted filter, query understanding (NL → structured), saved searches, alert subscriptions.',
    kpis:["Search relevance NDCG@10 >0.78", "query latency p95 <250ms", "NL query understanding accuracy >%85"],
    capabilities:["Search Query", "Faceted Filtering", "Saved Searches & Alerts", "Query Understanding"],
    fields:[{"name": "query_id", "type": "uuid", "req": true, "ai": false}, {"name": "query_text", "type": "string", "req": true, "ai": false}, {"name": "query_embedding", "type": "vector(1536)", "req": false, "ai": false}, {"name": "filters", "type": "jsonb", "req": false, "ai": false}, {"name": "facets_requested", "type": "list<string>", "req": false, "ai": false}, {"name": "page_size", "type": "int", "req": false, "ai": false}, {"name": "offset", "type": "int", "req": false, "ai": false}, {"name": "ai_query_intent", "type": "text", "req": false, "ai": true}, {"name": "source_doctype", "type": "string", "req": false, "ai": false}, {"name": "source_record_id", "type": "uuid", "req": false, "ai": false}, {"name": "score", "type": "decimal", "req": false, "ai": false}, {"name": "highlight", "type": "text", "req": false, "ai": false}, {"name": "relevance_explanation", "type": "text", "req": false, "ai": true}, {"name": "facet_id", "type": "uuid", "req": false, "ai": false}],
    tools:["full_text_search", "semantic_search", "index_doctype", "reindex", "get_search_stats"]
  },
  D01: {
    id:'D01', layer:'L4', name:'Audit Log & Event Sourcing',
    faz:'Faz 3', priority:'P0', squad:'Compliance Squad + Platform Ops Squad',
    color:'#f59e0b', icon:'ph-clipboard-text',
    desc:'Tüm değişikliklerin (kim, ne zaman, ne yaptı, neden) yazılı kaydı. Append-only event log, replay, forensic search, retention policy. Agent eylemleri ayrı bir audit kanalında ve ek metadata\'yla kayıt altına alınır.',
    kpis:["Event capture completeness %100", "log query p95 <2sn", "tamper detection (hash chain) %100"],
    capabilities:["Audit Event", "Agent-specific Audit", "Forensic Search", "Retention & Legal Hold", "Tamper Detection"],
    fields:[{"name": "event_id", "type": "uuid", "req": true, "ai": false}, {"name": "event_type", "type": "string", "req": true, "ai": false}, {"name": "actor_principal_id", "type": "uuid", "req": true, "ai": false}, {"name": "actor_kind", "type": "enum", "req": false, "ai": false}, {"name": "on_behalf_of_user_id", "type": "uuid", "req": false, "ai": false}, {"name": "resource_doctype", "type": "string", "req": false, "ai": false}, {"name": "resource_id", "type": "uuid", "req": false, "ai": false}, {"name": "action", "type": "enum", "req": false, "ai": false}, {"name": "ip_address", "type": "inet", "req": false, "ai": false}, {"name": "user_agent", "type": "string", "req": false, "ai": false}, {"name": "trace_id", "type": "string", "req": false, "ai": false}, {"name": "emitted_at", "type": "datetime", "req": true, "ai": false}, {"name": "hash_prev", "type": "string", "req": false, "ai": false}, {"name": "hash_self", "type": "string", "req": true, "ai": false}],
    tools:["query_audit_log", "export_logs", "verify_integrity", "create_alert", "purge_old_logs"]
  },
  D02: {
    id:'D02', layer:'L4', name:'PII Governance & Data Classification',
    faz:'Faz 3', priority:'P0', squad:'Compliance Squad + Security Squad',
    color:'#f59e0b', icon:'ph-eye-slash',
    desc:'Otomatik PII keşfi, data classification (public/internal/confidential/restricted), field-level encryption policy, redaction in logs, KVKK madde 7 (silme) ve madde 11 (erişim) hakları otomasyonu.',
    kpis:["PII discovery recall >%98", "redaction in logs %100", "DSAR (data subject access request) süresi <72sa"],
    capabilities:["Data Classification", "DSAR (Data Subject Rights)", "Field-level Encryption", "Log & LLM Redaction", "Cross-border Transfer"],
    fields:[{"name": "tag_id", "type": "uuid", "req": true, "ai": false}, {"name": "doctype_id", "type": "uuid", "req": true, "ai": false}, {"name": "field_name", "type": "string", "req": true, "ai": false}, {"name": "classification", "type": "enum", "req": true, "ai": false}, {"name": "ai_inferred", "type": "boolean", "req": false, "ai": true}, {"name": "human_confirmed", "type": "boolean", "req": false, "ai": false}, {"name": "doctype_scanned", "type": "string", "req": false, "ai": false}, {"name": "pii_candidates_found", "type": "int", "req": false, "ai": true}, {"name": "auto_classified_count", "type": "int", "req": false, "ai": false}, {"name": "requires_review_count", "type": "int", "req": false, "ai": false}, {"name": "request_id", "type": "uuid", "req": true, "ai": false}, {"name": "data_subject_id", "type": "uuid", "req": true, "ai": false}, {"name": "kind", "type": "enum", "req": true, "ai": false}, {"name": "submitted_at", "type": "datetime", "req": false, "ai": false}],
    tools:["scan_pii", "classify_field", "mask_data", "audit_pii_access", "generate_pii_report", "handle_dsar"]
  },
  D03: {
    id:'D03', layer:'L4', name:'Compliance Framework (KVKK/GDPR/SOC2)',
    faz:'Faz 4', priority:'P1', squad:'Compliance Squad',
    color:'#f59e0b', icon:'ph-scales',
    desc:'Uyumluluk kontrol matrisi, kanıt toplama otomasyonu, periyodik tarama, discrepancy ticket\'ı. KVKK Veri Sorumluları Sicili (VERBİS) entegrasyonu, GDPR Article 30 records, SOC2 evidence collection.',
    kpis:["Control evidence freshness <30 gün", "audit hazırlık süresi <5 gün", "compliance posture skoru >85"],
    capabilities:["Control Catalog", "Evidence Collection", "Compliance Run & Score", "VERBİS / Article 30 Records"],
    fields:[{"name": "control_id", "type": "uuid", "req": true, "ai": false}, {"name": "framework", "type": "enum", "req": true, "ai": false}, {"name": "reference", "type": "string", "req": true, "ai": false}, {"name": "description", "type": "text", "req": false, "ai": false}, {"name": "severity", "type": "enum", "req": false, "ai": false}, {"name": "automated_check_available", "type": "boolean", "req": false, "ai": false}, {"name": "evidence_id", "type": "uuid", "req": true, "ai": false}, {"name": "collected_at", "type": "datetime", "req": false, "ai": false}, {"name": "collector_kind", "type": "enum", "req": false, "ai": false}, {"name": "artifact_url", "type": "string", "req": false, "ai": false}, {"name": "ai_relevance_score", "type": "decimal", "req": false, "ai": true}, {"name": "expires_at", "type": "datetime", "req": false, "ai": false}, {"name": "run_id", "type": "uuid", "req": true, "ai": false}, {"name": "started_at", "type": "datetime", "req": false, "ai": false}],
    tools:["assess_control", "generate_report", "list_controls", "update_evidence", "schedule_review"]
  },
  O01: {
    id:'O01', layer:'L5', name:'Observability & SLO Monitoring',
    faz:'Faz 3', priority:'P0', squad:'Platform Ops Squad',
    color:'#ef4444', icon:'ph-activity',
    desc:'Logs, metrics, traces — unified observability. SLO definition, error budget, alerting, on-call routing. AI anomaly detection.',
    kpis:["MTTR <30dk", "SLO breach precision >%95", "alerts/incident <5"],
    capabilities:["Telemetry Pipeline", "SLO Definition", "Alerting", "Anomaly Detection"],
    fields:[{"name": "stream_id", "type": "uuid", "req": true, "ai": false}, {"name": "source", "type": "string", "req": true, "ai": false}, {"name": "log_level", "type": "enum", "req": false, "ai": false}, {"name": "retention_days", "type": "int", "req": false, "ai": false}, {"name": "parser", "type": "string", "req": false, "ai": false}, {"name": "name", "type": "string", "req": true, "ai": false}, {"name": "kind", "type": "enum", "req": false, "ai": false}, {"name": "unit", "type": "string", "req": false, "ai": false}, {"name": "labels", "type": "list<string>", "req": false, "ai": false}, {"name": "root_span_name", "type": "string", "req": false, "ai": false}, {"name": "total_duration_ms", "type": "int", "req": false, "ai": false}, {"name": "services_touched", "type": "list<string>", "req": false, "ai": false}, {"name": "errors_present", "type": "boolean", "req": false, "ai": false}, {"name": "slo_id", "type": "uuid", "req": true, "ai": false}],
    tools:["get_metrics", "create_slo", "alert_breach", "export_metrics", "get_slo_report"]
  },
  O02: {
    id:'O02', layer:'L5', name:'Plugin Marketplace',
    faz:'Faz 4', priority:'P1', squad:'Marketplace Squad',
    color:'#ef4444', icon:'ph-storefront',
    desc:'3. parti plugin keşif, kurulum, lisans, ödeme, sürüm yönetimi. Plugin developer dashboard, billing, revenue share, rating/review.',
    kpis:["Plugin install conversion >%5", "refund rate <%2", "developer onboarding <1 saat"],
    capabilities:["Listing", "Discovery", "Purchase & Licensing", "Reviews & Rating", "Developer Dashboard"],
    fields:[{"name": "listing_id", "type": "uuid", "req": true, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "title", "type": "string", "req": true, "ai": false}, {"name": "short_description", "type": "string", "req": false, "ai": false}, {"name": "long_description", "type": "text", "req": false, "ai": true}, {"name": "category", "type": "string", "req": false, "ai": false}, {"name": "tags", "type": "list<string>", "req": false, "ai": false}, {"name": "screenshots", "type": "list<string>", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "model", "type": "enum", "req": false, "ai": false}, {"name": "price_per_month_usd", "type": "decimal", "req": false, "ai": false}, {"name": "trial_days", "type": "int", "req": false, "ai": false}, {"name": "revenue_share_percent", "type": "decimal", "req": false, "ai": false}, {"name": "search_id", "type": "uuid", "req": true, "ai": false}],
    tools:["publish_plugin", "search_marketplace", "install_from_market", "rate_plugin", "unpublish"]
  },
  O03: {
    id:'O03', layer:'L5', name:'Plugin Security Review & Sandbox',
    faz:'Faz 4', priority:'P0', squad:'Security Squad + Marketplace Squad',
    color:'#ef4444', icon:'ph-shield-warning',
    desc:'3. parti plugin\'lerin güvenlik denetimi, sandbox uygunluk testleri, imzalı bundle, supply-chain doğrulama. Marketplace\'in kara kutusu — buradan geçmeyen plugin yayına çıkmaz.',
    kpis:["Approve median <72sa", "post-publish vulnerability disclosure <%1", "supply chain attack 0"],
    capabilities:["Submission Pipeline", "Automated Scanning", "Manual Review", "Signing & Distribution", "Post-publish Monitoring"],
    fields:[{"name": "submission_id", "type": "uuid", "req": true, "ai": false}, {"name": "plugin_id", "type": "uuid", "req": true, "ai": false}, {"name": "version", "type": "semver", "req": true, "ai": false}, {"name": "bundle_url", "type": "string", "req": true, "ai": false}, {"name": "signature", "type": "string", "req": true, "ai": false}, {"name": "submitted_at", "type": "datetime", "req": false, "ai": false}, {"name": "status", "type": "enum", "req": false, "ai": false}, {"name": "scan_id", "type": "uuid", "req": true, "ai": false}, {"name": "findings_critical", "type": "int", "req": false, "ai": false}, {"name": "findings_high", "type": "int", "req": false, "ai": false}, {"name": "findings_medium", "type": "int", "req": false, "ai": false}, {"name": "ai_triage_summary", "type": "text", "req": false, "ai": true}, {"name": "vulnerable_deps_count", "type": "int", "req": false, "ai": false}, {"name": "license_violations", "type": "list<string>", "req": false, "ai": false}],
    tools:["submit_for_review", "run_sandbox", "approve_plugin", "reject_plugin", "get_review_report"]
  },
};

const LAYER_INFO = {
  L0: {name:'Kernel',tr:'Çekirdek',color:'#6366f1',icon:'ph-cube',modules:["K01", "K02", "K03", "K04", "K05"]},
  L1: {name:'Identity',tr:'Kimlik ve Kiracılık',color:'#0ea5e9',icon:'ph-users',modules:["I01", "I02", "I03", "I04", "I05"]},
  L2: {name:'Agent Runtime',tr:'Agent Çalışma Zamanı',color:'#8b5cf6',icon:'ph-robot',modules:["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11"]},
  L3: {name:'Application',tr:'Uygulama Yüzeyi',color:'#10b981',icon:'ph-layout',modules:["S01", "S02", "S03", "S04", "S05", "S06"]},
  L4: {name:'Data & Compliance',tr:'Veri ve Uyumluluk',color:'#f59e0b',icon:'ph-scales',modules:["D01", "D02", "D03"]},
  L5: {name:'Operations',tr:'Operasyon',color:'#ef4444',icon:'ph-activity',modules:["O01", "O02", "O03"]},
};