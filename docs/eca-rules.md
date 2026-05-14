# ECA Engine — Dilbilgisi ve Örnekler

ECA = **Event ▸ Condition ▸ Action**. LandX'te bu pattern hem admin tarafında "kural editör" olarak görünür hem de runtime'da gerçek davranışı tetikler.

## Dilbilgisi

```
Rule
 ├ event:      enum (15+ event türü)
 ├ conditions: AST (AND zinciri; her node: field, op, value)
 └ actions:    [ActionType + params...]
```

## Event türleri

- `listing.created`
- `listing.updated`
- `listing.status_changed`
- `listing.price_changed`
- `listing.viewed`        (impression sayacı)
- `offer.received`
- `offer.status_changed`
- `offer.expired`
- `message.received`
- `viewing.requested`
- `viewing.completed`
- `tkgm.query_completed`
- `tkgm.flag_changed`
- `user.signed_up`
- `user.kyc_status_changed`
- `user.favorited_listing`
- `system.cron.daily`
- `system.cron.hourly`

## Condition op'ları

| op | Açıklama | Örnek |
|---|---|---|
| `eq`/`ne` | eşit / değil | `tkgmStatus eq ipotekli` |
| `gt/gte/lt/lte` | sayısal kıyas | `price gt 5000000` |
| `between` | aralık | `area between [1000, 10000]` |
| `in/nin` | listede | `imarType in [konut, ticari]` |
| `contains` | string içerir | `title contains "deniz"` |
| `regex` | regex | `phone regex "^05"` |
| `ai.score.gt` | AI skoru | `ai.riskScore.gt 70` |

Conditions varsayılan AND. OR için ileride nested grup.

## Action türleri

| type | params | Davranış |
|---|---|---|
| `notify.user` | `{ userId, title, body, priority }` | in-app + storele |
| `notify.role` | `{ role, title, body, priority }` | rol bazlı yayın |
| `email.mock` | `{ to, template, vars }` | outbox tablosuna yaz |
| `webhook.mock` | `{ url, payload }` | history'e |
| `assign.to` | `{ userId }` | kayda owner ata |
| `set.field` | `{ field, value }` | kayıt güncelle |
| `tag.add` | `{ tag }` | tag listesine ekle |
| `flag.review` | `{ reason }` | review kuyruğuna |
| `ai.summarize` | `{ field }` | AI summary üret |

## 24 Örnek Kural (seed'de üretilecek)

| # | Ad | Event | Condition (özet) | Action |
|---|---|---|---|---|
| 1 | TKGM ipotekli → review | listing.created | tkgmStatus=ipotekli | flag.review + notify.role admin |
| 2 | 7 gün draft hatırlatma | system.cron.daily | status=draft & days>=7 | notify.user + ai.summarize |
| 3 | Fiyat anomalisi | listing.price_changed | Δ%>20 | tag.add "anomali" + notify.role admin |
| 4 | İyi teklif önerisi | offer.received | amount>=0.9*list | notify.user owner "kabul önerisi" |
| 5 | Yavaş yanıt | message.received | response.latency>24h | notify.user "AI taslak hazır" |
| 6 | KYC hatırlatma | user.kyc_status_changed | new=pending, age>48h | notify.user + email.mock |
| 7 | Popüler ilan | viewing.requested | count24h>=3 | tag.add "popüler" + notify.user owner |
| 8 | Sıcak alıcı | listing.viewed | by_user_24h>=5 | tag.add "sıcak alıcı" |
| 9 | Şerh uyarısı | tkgm.flag_changed | new=şerh | notify.user buyer.favorited_this |
| 10 | Yenileme önerisi | system.cron.daily | expiresAt<+7d | notify.user owner + email.mock |
| 11 | Yeni satıcı karşılama | user.signed_up | role contains seller | notify.user "rehber" |
| 12 | Hisseli uyarı | listing.created | tapuType=hisseli | tag.add "hisseli" + ai.summarize |
| 13 | Düşük fiyat alarmı | listing.price_changed | Δ%<-10 | notify.user saved_search_matches |
| 14 | Eksik görsel | listing.created | images.length<3 | notify.user owner "AI öneri: foto ekle" |
| 15 | Spam tespit | message.received | regex("(.)\\1{4,}") | flag.review + notify.role moderator |
| 16 | Yüksek riskli ilan | listing.created | ai.riskScore.gt=70 | flag.review |
| 17 | Otomatik karşılama | message.received | thread.first=true | notify.user "AI taslak" |
| 18 | Premium öneri | user.signed_up | kycLevel=full | notify.user "VIP avantaj" |
| 19 | Yakın çevre | listing.created | features contains "deniz" | notify.user saved_search "deniz" matches |
| 20 | Bayilik baskısı | offer.expired | listingCount>10 in 24h | notify.role admin |
| 21 | Tarım/zeytin uyarı | listing.created | imarType in [tarim,zeytinlik] | tag.add "tarımsal" + ai.summarize |
| 22 | Dispute eskalasyon | offer.status_changed | status=rejected & seq>=3 | notify.role moderator |
| 23 | Görsel bozuk | listing.updated | images.some(brokenUrl) | flag.review |
| 24 | Hava şartı opsiyonel | system.cron.daily | (mock) bulutluluk>80% | notify.role admin (info) |

## Engine implementasyonu

```ts
// lib/eca/engine.ts
type EvalCtx = { event: EcaEvent; payload: any; now: string; rules: EcaRule[]; emit: (a: EcaAction) => void };
export function evaluate(ctx: EvalCtx) {
  for (const r of ctx.rules) {
    if (!r.enabled) continue;
    if (r.event !== ctx.event) continue;
    const ok = r.conditions.every(c => matchCondition(c, ctx.payload));
    if (ok) {
      r.actions.forEach(a => ctx.emit(a));
      r.history.unshift({ at: ctx.now, payload: ctx.payload, matched: true, actionsRun: r.actions.map(a => a.type) });
      r.history.length = Math.min(r.history.length, 100);
    }
  }
}
```

## Editor UI

`/admin/rules` — sürükle-bırak (`dnd-kit`):

```
[ Event seç ▼ listing.created ]
     │
     ▼
[ Condition kart ] + ekle
   field [ tkgmStatus ▼ ]  op [ eq ▼ ]  value [ ipotekli ▼ ]
     │
     ▼
[ Action kart ] + ekle
   type [ notify.role ▼ ]  params: { role: admin, title: ..., body: ... }
     │
     ▼
[ Test çalıştır ] (örnek payload ile dry-run, sonuç önizleme)
[ Kaydet ] [ Etkinleştir ]
```

## Demo runner

`src/lib/eca/demo-runner.ts` — uygulamanın boş hallerinde mock olay üretmek için:
- 30sn'de bir rastgele event (listing/offer/message)
- Notifications ve audit log'a düşer
- Toggle ile kapatılır (`settings`)
