/* =========================================================================
   LandX — App Shell, Router, View Renderers, AI Hooks
   Mobile-first SPA, vanilla JS, in-memory state
   ========================================================================= */

const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Nav config (rol bazlı) -------------------------------------- */
const NAV = {
  buyer: [
    { id:'discover',  label:'Keşfet',     icon:'ph-compass' },
    { id:'favorites', label:'Favoriler',  icon:'ph-heart' },
    { id:'messages',  label:'Mesajlar',   icon:'ph-chats' },
    { id:'profile',   label:'Profil',     icon:'ph-user' },
  ],
  seller: [
    { id:'my-listings', label:'İlanlarım',  icon:'ph-stack' },
    { id:'wizard',      label:'Yeni İlan',  icon:'ph-plus-circle' },
    { id:'offers',      label:'Teklifler',  icon:'ph-currency-circle-dollar' },
    { id:'performance', label:'Performans', icon:'ph-chart-line-up' },
  ],
  admin: [
    { id:'approval',  label:'Onay',         icon:'ph-shield-check' },
    { id:'users',     label:'Kullanıcılar', icon:'ph-users-three' },
    { id:'reports',   label:'Raporlar',     icon:'ph-chart-pie' },
  ],
};
const DEFAULT_VIEW = { buyer:'discover', seller:'my-listings', admin:'approval' };

/* ---------- Sheet, Toast helpers ---------------------------------------- */
const Sheet = {
  open(html){
    $('#sheetBody').innerHTML = html;
    $('#sheetHost').classList.add('open');
  },
  close(){ $('#sheetHost').classList.remove('open'); }
};
$('#sheetHost').addEventListener('click', e => { if (e.target.id === 'sheetHost') Sheet.close(); });

const Toast = {
  show(msg, kind='', icon='ph-check-circle'){
    const host = $('#toastHost');
    const t = document.createElement('div');
    t.className = `toast ${kind}`;
    t.innerHTML = `<i class="ph ${icon}"></i><span>${esc(msg)}</span>`;
    host.appendChild(t);
    setTimeout(()=> t.remove(), 2600);
  }
};

/* ---------- Router ------------------------------------------------------ */
const Router = {
  go(view, params={}){
    State.view = view;
    State.params = params;
    const h = '#' + view + (params.id ? '/' + params.id : '');
    if (location.hash !== h) location.hash = h;
    Render.view();
  },
  fromHash(){
    const h = location.hash.replace(/^#/,'');
    if (!h) return null;
    const [v, id] = h.split('/');
    return { view:v, params: id ? { id } : {} };
  }
};
window.addEventListener('hashchange', () => {
  const r = Router.fromHash();
  if (r){ State.view = r.view; State.params = r.params; Render.view(); }
});

/* ---------- Renderer ---------------------------------------------------- */
const Render = {
  shell(){
    /* sidebar (desktop) */
    const items = NAV[State.role];
    $('#sidebar').innerHTML = `
      <div class="brand">
        <i class="ph-fill ph-map-trifold"></i>
        <span>LandX <span class="brand-sub">arsa pazaryeri</span></span>
      </div>
      <div class="nav-group-title">${rolLabel(State.role)} paneli</div>
      ${items.map(it => `
        <div class="nav-item ${State.view===it.id?'active':''}" data-action="nav" data-view="${it.id}">
          <i class="ph ${it.icon}"></i><span>${it.label}</span>
        </div>
      `).join('')}
      <div class="sidebar-footer">
        <div class="row between">
          <span>${esc(currentUser().name)}</span>
          <button class="icon-btn" data-action="theme" title="Tema">
            <i class="ph ph-moon"></i>
          </button>
        </div>
      </div>
    `;

    /* bottom nav (mobile) */
    $('#bottomNav').innerHTML = items.map(it => `
      <div class="nav-item ${State.view===it.id?'active':''}" data-action="nav" data-view="${it.id}">
        <i class="ph ${it.icon}"></i><span>${it.label}</span>
      </div>
    `).join('');

    /* header avatar */
    $('#headerAvatar').textContent = currentUser().avatar;

    /* notif dot */
    const hasUnread = (NOTIFICATIONS[State.role] || []).some(n => !n.read);
    $('#notifDot').style.display = hasUnread ? '' : 'none';

    /* role select sync */
    $('#roleSelect').value = State.role;
  },

  view(){
    /* If role doesn't include current view, fall back */
    const validViews = NAV[State.role].map(n=>n.id).concat(['listing','thread','profile']);
    if (!validViews.includes(State.view)) State.view = DEFAULT_VIEW[State.role];

    Render.shell();
    const main = $('#appMain');
    const view = State.view;
    main.scrollTo({ top:0 });

    switch(view){
      // Buyer
      case 'discover':    main.innerHTML = views.discover();    break;
      case 'listing':     main.innerHTML = views.listing(State.params.id); break;
      case 'favorites':   main.innerHTML = views.favorites();   break;
      case 'messages':    main.innerHTML = views.messages();    break;
      case 'thread':      main.innerHTML = views.thread(State.params.id); afterChat(); break;
      // Seller
      case 'my-listings': main.innerHTML = views.myListings();  break;
      case 'wizard':      main.innerHTML = views.wizard();      break;
      case 'offers':      main.innerHTML = views.offers();      break;
      case 'performance': main.innerHTML = views.performance(); break;
      // Admin
      case 'approval':    main.innerHTML = views.approval();    break;
      case 'users':       main.innerHTML = views.users();       break;
      case 'reports':     main.innerHTML = views.reports();     break;
      // Shared
      case 'profile':     main.innerHTML = views.profile();     break;
      default:            main.innerHTML = `<div class="empty"><i class="ph ph-warning"></i><h3>Sayfa bulunamadı</h3></div>`;
    }
  }
};

function rolLabel(r){ return { buyer:'Alıcı', seller:'Satıcı', admin:'Yönetici' }[r]; }
function currentUser(){ return USERS.find(u => u.id === State.userId) || USERS[0]; }
function listingById(id){ return LISTINGS.find(l => l.id === id); }
function sellerName(id){ const u = USERS.find(u=>u.id===id); return u ? u.name : '—'; }
function isFav(listingId){ return (State.favs[State.userId] || []).includes(listingId); }
function toggleFav(listingId){
  const arr = State.favs[State.userId] = State.favs[State.userId] || [];
  const i = arr.indexOf(listingId);
  if (i>=0) arr.splice(i,1); else arr.push(listingId);
}

/* ---------- Photo placeholder ------------------------------------------- */
function photoBox(l, klass='listing-photo'){
  return `
    <div class="${klass}" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color, 25)})">
      <div class="photo-label">${esc(l.photo_label || l.il)}</div>
      ${l.verified ? '<div class="verified-badge"><i class="ph ph-seal-check"></i>Onaylı</div>' : ''}
    </div>
  `;
}
function shade(hex, pct){
  // lighten/darken hex by pct (positive = lighter)
  const n = parseInt(hex.slice(1), 16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r = Math.min(255, Math.max(0, r + Math.round((pct/100)*255)));
  g = Math.min(255, Math.max(0, g + Math.round((pct/100)*255)));
  b = Math.min(255, Math.max(0, b + Math.round((pct/100)*255)));
  return '#' + ((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');
}

/* ---------- Listing card component -------------------------------------- */
function listingCard(l, opts={}){
  const fav = isFav(l.id);
  return `
    <article class="listing-card" data-action="open-listing" data-id="${l.id}">
      <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)})">
        <div class="photo-label">${esc(l.photo_label || l.il)}</div>
        ${l.verified ? '<div class="verified-badge"><i class="ph ph-seal-check"></i>Onaylı</div>' : ''}
        ${State.role==='buyer' ? `
          <button class="fav-btn ${fav?'active':''}" data-action="toggle-fav" data-id="${l.id}" title="Favori">
            <i class="${fav?'ph-fill':'ph'} ph-heart"></i>
          </button>` : ''}
      </div>
      <div class="listing-body">
        <div class="listing-title">${esc(l.title)}</div>
        <div class="listing-loc"><i class="ph ph-map-pin"></i> ${esc(l.ilce)}, ${esc(l.il)}</div>
        <div class="listing-stats">
          <span><i class="ph ph-ruler"></i> ${fmtAlan(l.alan)}</span>
          <span><i class="ph ph-buildings"></i> ${esc(l.imar)}</span>
          ${l.emsal > 0 ? `<span><i class="ph ph-arrows-vertical"></i> E:${l.emsal}</span>` : ''}
        </div>
        <div class="listing-price">${fmtTL(l.fiyat)} <small>${fmt(l.fiyat_m2)} ₺/m²</small></div>
      </div>
      ${opts.seller ? `
        <div class="listing-actions">
          <button class="btn sm" data-action="edit-listing" data-id="${l.id}"><i class="ph ph-pencil"></i> Düzenle</button>
          <button class="btn sm" data-action="boost" data-id="${l.id}"><i class="ph ph-rocket-launch"></i> Yükselt</button>
        </div>` : ''}
    </article>
  `;
}

/* =========================================================================
   VIEWS
   ========================================================================= */
const views = {};

/* ----- BUYER: Discover -------------------------------------------------- */
views.discover = () => {
  const f = State.filters;
  const filtered = LISTINGS.filter(l => l.status === 'active')
    .filter(l => !f.il   || l.il === f.il)
    .filter(l => !f.imar || l.imar === f.imar)
    .filter(l => !f.tkgm || l.tkgm === f.tkgm)
    .filter(l => !f.fiyat_max || l.fiyat <= f.fiyat_max)
    .filter(l => !f.alan_min  || l.alan  >= f.alan_min)
    .filter(l => !f.tag_hint  || l.tags.some(t => t.toLowerCase().includes(f.tag_hint)));
  const aiHint = f.q ? aiParseQuery(f.q) : null;

  return `
    <div class="page-header">
      <h1>Keşfet</h1>
      <div class="subtitle">${filtered.length} aktif arsa ilanı</div>
    </div>

    <div class="input mb-3">
      <i class="ph ph-magnifying-glass"></i>
      <input id="aiSearch" type="text" placeholder="AI ile ara: 'İstanbul konut 5M altı temiz tapu'" value="${esc(f.q)}">
      ${f.q ? '<button class="icon-btn" data-action="clear-search" title="Temizle" style="background:transparent;border:none;"><i class="ph ph-x"></i></button>' : ''}
    </div>

    ${aiHint ? `
      <div class="ai-card mb-3">
        <div class="ai-label"><i class="ph ph-sparkle"></i> AI arama yorumladı</div>
        <div class="chips">
          ${aiHint.il   ? `<span class="chip active">İl: ${esc(aiHint.il)}</span>` : ''}
          ${aiHint.imar ? `<span class="chip active">İmar: ${esc(aiHint.imar)}</span>` : ''}
          ${aiHint.fiyat_max ? `<span class="chip active">Max ${fmtTL(aiHint.fiyat_max)}</span>` : ''}
          ${aiHint.alan_min  ? `<span class="chip active">Min ${fmt(aiHint.alan_min)} m²</span>` : ''}
          ${aiHint.tkgm ? `<span class="chip active">${esc(aiHint.tkgm)} tapu</span>` : ''}
          ${aiHint.tag_hint ? `<span class="chip active">${esc(aiHint.tag_hint)} özelliği</span>` : ''}
        </div>
      </div>
    ` : ''}

    <div class="chips scroll mb-3">
      <button class="chip ${!f.il?'active':''}" data-action="filter" data-key="il" data-val=""><i class="ph ph-funnel"></i>Tüm İller</button>
      ${IL_LIST.map(il => `<button class="chip ${f.il===il?'active':''}" data-action="filter" data-key="il" data-val="${esc(il)}">${esc(il)}</button>`).join('')}
    </div>

    <div class="chips scroll mb-3">
      <button class="chip ${!f.imar?'active':''}" data-action="filter" data-key="imar" data-val="">Tüm İmar</button>
      ${IMAR_LIST.map(im => `<button class="chip ${f.imar===im?'active':''}" data-action="filter" data-key="imar" data-val="${esc(im)}">${esc(im)}</button>`).join('')}
    </div>

    ${filtered.length === 0 ? `
      <div class="empty"><i class="ph ph-magnifying-glass"></i><h3>Sonuç yok</h3><p>Filtreleri gevşetip tekrar deneyin.</p></div>
    ` : `
      <div class="grid listings">${filtered.map(l => listingCard(l)).join('')}</div>
    `}
  `;
};

/* ----- BUYER: Listing detail ------------------------------------------- */
views.listing = (id) => {
  const l = listingById(id);
  if (!l) return `<div class="empty"><i class="ph ph-warning"></i><h3>İlan bulunamadı</h3></div>`;
  const fav = isFav(l.id);
  const pricePos = Math.max(0, Math.min(100, ((l.fiyat - l.ai_min) / (l.ai_max - l.ai_min)) * 100));

  return `
    <div class="row gap-2 mb-3">
      <button class="btn sm ghost" data-action="back"><i class="ph ph-arrow-left"></i> Geri</button>
      <div class="header-spacer"></div>
      ${State.role==='buyer' ? `
        <button class="icon-btn" data-action="toggle-fav" data-id="${l.id}" title="Favori">
          <i class="${fav?'ph-fill':'ph'} ph-heart" style="${fav?'color:var(--danger);':''}"></i>
        </button>` : ''}
      <button class="icon-btn" title="Paylaş"><i class="ph ph-share-network"></i></button>
    </div>

    <div class="detail-hero" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)})">
      <span>${esc(l.photo_label || l.il)}</span>
      <div class="photo-dots"><span class="active"></span><span></span><span></span><span></span></div>
    </div>

    <div class="mt-3">
      <div class="row gap-2 mb-2">
        ${l.verified ? '<span class="badge success"><i class="ph ph-seal-check"></i>Onaylı</span>' : '<span class="badge warning">Bekleyen</span>'}
        <span class="badge"><i class="ph ph-buildings"></i> ${esc(l.imar)}</span>
        <span class="badge"><i class="ph ph-shield-check"></i> ${esc(l.tapu)}</span>
        <span class="badge ${l.tkgm==='Temiz'?'success':'warning'}">TKGM: ${esc(l.tkgm)}</span>
      </div>
      <h1>${esc(l.title)}</h1>
      <div class="muted mt-2"><i class="ph ph-map-pin"></i> ${esc(l.mahalle)}, ${esc(l.ilce)}, ${esc(l.il)} · Ada ${esc(l.ada)}/Parsel ${esc(l.parsel)}</div>
      <div class="row gap-3 mt-3" style="font-size:var(--fs-2xl); font-weight:600;">
        ${fmtTLFull(l.fiyat)}
        <small class="muted" style="font-weight:400; font-size:var(--fs-sm);">${fmt(l.fiyat_m2)} ₺/m²</small>
      </div>
    </div>

    <!-- AI valuation card -->
    <div class="ai-card mt-4">
      <div class="ai-label"><i class="ph ph-sparkle"></i> AI Değerleme</div>
      <div class="ai-range">${fmtTL(l.ai_min)} – ${fmtTL(l.ai_max)} <small>tahmini bant</small></div>
      <div class="ai-bar">
        <div class="ai-fill" style="left:0; right:0;"></div>
        <div class="ai-marker" style="left: calc(${pricePos.toFixed(1)}% - 6px);" title="Listeleme fiyatı"></div>
      </div>
      <div class="row between">
        <span class="muted" style="font-size:var(--fs-xs);">Liste fiyatı bantın %${pricePos.toFixed(0)} konumunda</span>
        <span class="ai-trend"><i class="ph ph-trend-up"></i> Yıllık +%${l.ai_trend}</span>
      </div>
    </div>

    <h3 class="mt-4 mb-3">Arsa Bilgileri</h3>
    <div class="spec-grid">
      <div class="spec-item"><span class="spec-label">Alan</span><span class="spec-value">${fmtAlan(l.alan)}</span></div>
      <div class="spec-item"><span class="spec-label">İmar</span><span class="spec-value">${esc(l.imar)}</span></div>
      <div class="spec-item"><span class="spec-label">Emsal</span><span class="spec-value">${l.emsal>0?'E:'+l.emsal:'—'}</span></div>
      <div class="spec-item"><span class="spec-label">Yol Cephesi</span><span class="spec-value">${l.yol_cephesi} m</span></div>
      <div class="spec-item"><span class="spec-label">Tapu</span><span class="spec-value">${esc(l.tapu)}</span></div>
      <div class="spec-item"><span class="spec-label">TKGM</span><span class="spec-value">${esc(l.tkgm)}</span></div>
      <div class="spec-item"><span class="spec-label">Kat Adedi</span><span class="spec-value">${l.kat_adedi || '—'}</span></div>
      <div class="spec-item"><span class="spec-label">Yayın</span><span class="spec-value">${esc(l.created)}</span></div>
    </div>

    <h3 class="mt-4 mb-3">Açıklama</h3>
    <p>${esc(l.desc)}</p>

    <div class="tag-row mt-2">
      ${l.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
    </div>

    <h3 class="mt-4 mb-3">Satıcı</h3>
    <div class="card">
      <div class="row gap-3">
        <div class="avatar lg">${esc(USERS.find(u=>u.id===l.seller_id)?.avatar || '?')}</div>
        <div style="flex:1;">
          <div style="font-weight:600;">${esc(sellerName(l.seller_id))}</div>
          <div class="muted" style="font-size:var(--fs-xs);">
            ${esc(USERS.find(u=>u.id===l.seller_id)?.badge || 'Satıcı')}
            ${USERS.find(u=>u.id===l.seller_id)?.verified ? '<i class="ph ph-seal-check" style="color:var(--success);"></i>' : ''}
          </div>
        </div>
        ${State.role==='buyer' ? `<button class="btn sm" data-action="open-thread" data-listing="${l.id}" data-seller="${l.seller_id}"><i class="ph ph-chat-circle"></i></button>` : ''}
      </div>
    </div>

    ${State.role==='buyer' ? `
      <div class="detail-cta-bar mt-4">
        <button class="btn outline lg" data-action="open-thread" data-listing="${l.id}" data-seller="${l.seller_id}">
          <i class="ph ph-chat-circle"></i> Mesaj
        </button>
        <button class="btn primary lg" data-action="make-offer" data-id="${l.id}">
          <i class="ph ph-handshake"></i> Teklif Ver
        </button>
      </div>
    ` : ''}
  `;
};

/* ----- BUYER: Favorites ------------------------------------------------- */
views.favorites = () => {
  const favIds = State.favs[State.userId] || [];
  const favs = favIds.map(id => listingById(id)).filter(Boolean);
  return `
    <div class="page-header">
      <h1>Favorilerim</h1>
      <div class="subtitle">${favs.length} kayıtlı ilan</div>
    </div>
    ${favs.length === 0 ? `
      <div class="empty">
        <i class="ph ph-heart"></i>
        <h3>Henüz favori yok</h3>
        <p>Keşfet'te beğendiğiniz ilanları kalp ikonuyla kaydedin.</p>
        <button class="btn primary" data-action="nav" data-view="discover"><i class="ph ph-compass"></i> Keşfet'e Git</button>
      </div>
    ` : `
      <div class="grid listings">${favs.map(l => listingCard(l)).join('')}</div>
    `}
  `;
};

/* ----- BUYER/SELLER: Messages ------------------------------------------- */
views.messages = () => {
  const role = State.role;
  const meId = State.userId;
  const myThreads = THREADS.filter(t => role==='buyer' ? t.buyer_id===meId : t.seller_id===meId);
  return `
    <div class="page-header">
      <h1>Mesajlar</h1>
      <div class="subtitle">${myThreads.length} sohbet</div>
    </div>
    ${myThreads.length === 0 ? `
      <div class="empty"><i class="ph ph-chats"></i><h3>Mesajınız yok</h3></div>
    ` : `
      <div class="card flush">
        <div class="thread-list">
          ${myThreads.map(t => {
            const l = listingById(t.listing_id);
            const other = USERS.find(u => u.id === (role==='buyer' ? t.seller_id : t.buyer_id));
            const unread = role==='buyer' ? t.unread_for_buyer : t.unread_for_seller;
            const last = MESSAGES.filter(m=>m.thread===t.id).slice(-1)[0];
            return `
              <div class="thread-item ${unread>0?'unread':''}" data-action="open-thread-id" data-id="${t.id}">
                <div class="avatar">${esc(other?.avatar || '?')}</div>
                <div class="thread-info">
                  <div class="thread-title">${esc(other?.name || '?')} · <span class="muted" style="font-weight:400;">${esc(l?.title || '')}</span></div>
                  <div class="thread-text">${esc(last?.text || '')}</div>
                </div>
                <div class="thread-meta">
                  <span class="time">${esc(t.last_time)}</span>
                  ${unread>0 ? `<span class="unread-pill">${unread}</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `}
  `;
};

views.thread = (threadId) => {
  const t = THREADS.find(x => x.id === threadId);
  if (!t) return `<div class="empty"><i class="ph ph-warning"></i><h3>Sohbet bulunamadı</h3></div>`;
  const role = State.role;
  const meId = State.userId;
  const other = USERS.find(u => u.id === (role==='buyer' ? t.seller_id : t.buyer_id));
  const l = listingById(t.listing_id);
  const msgs = MESSAGES.filter(m => m.thread === threadId);
  const templates = AI_REPLY_TEMPLATES[role] || [];

  return `
    <div class="chat-window">
      <div class="chat-header">
        <button class="btn ghost sm" data-action="back"><i class="ph ph-arrow-left"></i></button>
        <div class="avatar">${esc(other?.avatar || '?')}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;">${esc(other?.name || '?')}</div>
          <div class="muted truncate" style="font-size:var(--fs-xs);">${esc(l?.title || '')}</div>
        </div>
        <button class="icon-btn" data-action="open-listing" data-id="${t.listing_id}" title="İlanı gör"><i class="ph ph-arrow-square-out"></i></button>
      </div>
      <div class="chat-msgs" id="chatMsgs">
        ${msgs.map(m => `
          <div class="msg-bubble ${m.from===meId?'out':'in'}">
            ${esc(m.text)}
            <span class="msg-time">${esc(m.time)}</span>
          </div>
        `).join('')}
      </div>
      <div class="chat-templates">
        <span class="chip" style="cursor:default;"><i class="ph ph-sparkle"></i> AI önerileri:</span>
        ${templates.map(txt => `<button class="chip" data-action="use-template" data-text="${esc(txt)}">${esc(txt)}</button>`).join('')}
      </div>
      <div class="chat-input">
        <div class="input">
          <i class="ph ph-pencil-simple-line"></i>
          <input id="chatField" type="text" placeholder="Mesaj yazın...">
        </div>
        <button class="btn primary" data-action="send-msg" data-thread="${threadId}"><i class="ph ph-paper-plane-tilt"></i></button>
      </div>
    </div>
  `;
};

function afterChat(){
  const c = $('#chatMsgs');
  if (c) c.scrollTop = c.scrollHeight;
  const field = $('#chatField');
  if (field){
    field.addEventListener('keydown', e => {
      if (e.key === 'Enter'){
        const btn = $('[data-action="send-msg"]');
        if (btn) btn.click();
      }
    });
  }
}

/* ----- SELLER: My Listings --------------------------------------------- */
views.myListings = () => {
  const mine = LISTINGS.filter(l => l.seller_id === State.userId);
  return `
    <div class="row between mb-3">
      <div class="page-header" style="margin:0;">
        <h1>İlanlarım</h1>
        <div class="subtitle">${mine.length} ilan · ${mine.filter(l=>l.status==='active').length} aktif</div>
      </div>
      <button class="btn primary hide-mobile" data-action="nav" data-view="wizard"><i class="ph ph-plus"></i> Yeni İlan</button>
    </div>

    ${mine.length === 0 ? `
      <div class="empty">
        <i class="ph ph-stack"></i><h3>Henüz ilan yok</h3>
        <p>İlk arsanızı 4 adımlık sihirbazla yayınlayın.</p>
        <button class="btn primary" data-action="nav" data-view="wizard"><i class="ph ph-plus"></i> Yeni İlan Ekle</button>
      </div>
    ` : `
      <div class="grid listings">${mine.map(l => `
        <article class="listing-card" data-action="open-listing" data-id="${l.id}">
          <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)})">
            <div class="photo-label">${esc(l.photo_label||l.il)}</div>
            <div class="verified-badge" style="background:${l.status==='active'?'rgba(16,185,129,0.92)':'rgba(245,158,11,0.92)'}">
              <i class="ph ${l.status==='active'?'ph-check':'ph-clock'}"></i>${l.status==='active'?'Aktif':'Onayda'}
            </div>
          </div>
          <div class="listing-body">
            <div class="listing-title">${esc(l.title)}</div>
            <div class="listing-loc"><i class="ph ph-map-pin"></i> ${esc(l.ilce)}, ${esc(l.il)}</div>
            <div class="listing-stats">
              <span><i class="ph ph-eye"></i> ${l.views}</span>
              <span><i class="ph ph-heart"></i> ${l.favs}</span>
              <span><i class="ph ph-chat-circle"></i> ${l.inquiries}</span>
            </div>
            <div class="listing-price">${fmtTL(l.fiyat)}</div>
          </div>
          <div class="listing-actions">
            <button class="btn sm" data-action="edit-listing" data-id="${l.id}"><i class="ph ph-pencil"></i> Düzenle</button>
            <button class="btn sm" data-action="boost" data-id="${l.id}"><i class="ph ph-rocket-launch"></i> Yükselt</button>
          </div>
        </article>
      `).join('')}</div>
    `}
  `;
};

/* ----- SELLER: New Listing Wizard -------------------------------------- */
views.wizard = () => {
  const w = State.wizard;
  const step = w.step;

  const stepperHtml = WIZARD_STEPS.map((s, i) => {
    const cls = i < step ? 'done' : (i === step ? 'active' : '');
    return `<span class="step ${cls}"><span class="step-dot">${i<step?'<i class="ph ph-check"></i>':(i+1)}</span>${s.label}</span>${i<WIZARD_STEPS.length-1?'<span class="step-divider"></span>':''}`;
  }).join('');

  let body = '';
  if (step === 0){
    body = `
      <h2>Konum</h2>
      <p class="muted">Arsanın il, ilçe, mahalle ve tapu bilgileri.</p>
      <div class="field-row cols-2">
        <div class="field">
          <label>İl</label>
          <div class="input"><i class="ph ph-map-pin"></i>
            <select data-wiz="il">
              <option value="">Seçin...</option>
              ${IL_LIST.map(il => `<option value="${esc(il)}" ${w.data.il===il?'selected':''}>${esc(il)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>İlçe</label>
          <div class="input"><i class="ph ph-buildings"></i><input data-wiz="ilce" value="${esc(w.data.ilce)}" placeholder="örn. Kadıköy"></div>
        </div>
      </div>
      <div class="field">
        <label>Mahalle</label>
        <div class="input"><i class="ph ph-house"></i><input data-wiz="mahalle" value="${esc(w.data.mahalle)}" placeholder="örn. Moda"></div>
      </div>
      <div class="field-row cols-2">
        <div class="field">
          <label>Ada</label>
          <div class="input"><i class="ph ph-hash"></i><input data-wiz="ada" value="${esc(w.data.ada)}"></div>
        </div>
        <div class="field">
          <label>Parsel</label>
          <div class="input"><i class="ph ph-hash"></i><input data-wiz="parsel" value="${esc(w.data.parsel)}"></div>
        </div>
      </div>
    `;
  }
  else if (step === 1){
    body = `
      <h2>Detaylar</h2>
      <p class="muted">Arsanın teknik özellikleri.</p>
      <div class="field-row cols-2">
        <div class="field">
          <label>Alan (m²)</label>
          <div class="input"><i class="ph ph-ruler"></i><input data-wiz="alan" type="number" value="${w.data.alan||''}"></div>
        </div>
        <div class="field">
          <label>İmar</label>
          <div class="input"><i class="ph ph-buildings"></i>
            <select data-wiz="imar">
              <option value="">Seçin...</option>
              ${IMAR_LIST.map(im => `<option value="${esc(im)}" ${w.data.imar===im?'selected':''}>${esc(im)}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="field-row cols-2">
        <div class="field">
          <label>Tapu Türü</label>
          <div class="input"><i class="ph ph-shield-check"></i>
            <select data-wiz="tapu">
              <option value="">Seçin...</option>
              ${TAPU_LIST.map(t => `<option value="${esc(t)}" ${w.data.tapu===t?'selected':''}>${esc(t)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>TKGM Durumu</label>
          <div class="input"><i class="ph ph-file-text"></i>
            <select data-wiz="tkgm">
              <option value="">Seçin...</option>
              ${TKGM_LIST.map(t => `<option value="${esc(t)}" ${w.data.tkgm===t?'selected':''}>${esc(t)}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="field-row cols-3">
        <div class="field">
          <label>Yol Cephesi (m)</label>
          <div class="input"><i class="ph ph-arrows-horizontal"></i><input data-wiz="yol_cephesi" type="number" value="${w.data.yol_cephesi||''}"></div>
        </div>
        <div class="field">
          <label>Emsal</label>
          <div class="input"><i class="ph ph-arrows-vertical"></i><input data-wiz="emsal" type="number" step="0.01" value="${w.data.emsal||''}"></div>
        </div>
        <div class="field">
          <label>Kat Adedi</label>
          <div class="input"><i class="ph ph-stack"></i><input data-wiz="kat_adedi" type="number" value="${w.data.kat_adedi||''}"></div>
        </div>
      </div>
    `;
  }
  else if (step === 2){
    const ai = aiPriceEstimate(w.data);
    body = `
      <h2>Fiyat</h2>
      <p class="muted">AI önerisini 1 tıkla uygulayabilir veya kendi fiyatınızı belirleyebilirsiniz.</p>

      ${ai ? `
        <div class="ai-card mb-4">
          <div class="ai-label"><i class="ph ph-sparkle"></i> AI Fiyat Önerisi</div>
          <div class="ai-range">${fmtTL(ai.min)} – ${fmtTL(ai.max)}</div>
          <div class="muted mt-2" style="font-size:var(--fs-sm);">Önerilen: <strong style="color:var(--text);">${fmtTLFull(ai.suggested)}</strong></div>
          <button class="btn primary mt-3" data-action="apply-ai-price" data-val="${ai.suggested}">
            <i class="ph ph-magic-wand"></i> AI önerisini uygula
          </button>
        </div>
      ` : `<div class="card mb-4"><span class="muted">Önce konum ve alanı doldurun.</span></div>`}

      <div class="field">
        <label>Liste Fiyatı (₺)</label>
        <div class="input"><i class="ph ph-currency-circle-dollar"></i>
          <input data-wiz="fiyat" type="number" value="${w.data.fiyat||''}" placeholder="0">
        </div>
        ${w.data.fiyat && w.data.alan ? `<span class="help">m² birim fiyatı: <strong>${fmt(Math.round(w.data.fiyat/w.data.alan))} ₺</strong></span>` : ''}
      </div>

      <div class="field">
        <label>Açıklama</label>
        <div class="row gap-2 mb-2">
          <button class="btn sm" data-action="ai-write-desc">
            <i class="ph ph-sparkle"></i> AI ile yaz
          </button>
        </div>
        <div class="input"><textarea data-wiz="desc" rows="5" placeholder="Arsa hakkında bilgi...">${esc(w.data.desc)}</textarea></div>
      </div>
    `;
  }
  else if (step === 3){
    const ai = aiPriceEstimate(w.data);
    body = `
      <h2>Önizleme ve Yayın</h2>
      <p class="muted">Bilgilerinizi son kez kontrol edin.</p>

      <div class="card mt-3">
        <h3 class="mb-2">${esc(w.data.il)} ${esc(w.data.ilce)} ${esc(w.data.imar)} Arsası</h3>
        <div class="row gap-2 mb-3" style="flex-wrap:wrap;">
          <span class="badge"><i class="ph ph-map-pin"></i> ${esc(w.data.mahalle || w.data.ilce)}</span>
          <span class="badge"><i class="ph ph-ruler"></i> ${fmtAlan(w.data.alan || 0)}</span>
          <span class="badge"><i class="ph ph-buildings"></i> ${esc(w.data.imar)}</span>
          <span class="badge"><i class="ph ph-shield-check"></i> ${esc(w.data.tapu)}</span>
        </div>
        <div style="font-size:var(--fs-2xl); font-weight:600;">${fmtTLFull(w.data.fiyat || 0)}</div>
        ${ai ? `<div class="muted mt-1" style="font-size:var(--fs-sm);">AI bantı: ${fmtTL(ai.min)} – ${fmtTL(ai.max)}</div>` : ''}
        <p class="mt-3">${esc(w.data.desc || '—')}</p>
      </div>

      <div class="card mt-3">
        <div class="row gap-2">
          <i class="ph ph-info" style="color:var(--primary); font-size:1.2rem;"></i>
          <span class="muted" style="font-size:var(--fs-sm);">Yayınladıktan sonra ilan yönetici onayına gider. Onay süresi ortalama 30 dakika.</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="page-header">
      <h1>Yeni İlan</h1>
      <div class="subtitle">${step+1}/${WIZARD_STEPS.length} adım</div>
    </div>

    <div class="stepper">${stepperHtml}</div>

    <div class="wizard-body card mt-3">
      ${body}
      <div class="wizard-actions">
        <button class="btn ${step===0?'ghost':''}" data-action="wiz-prev" ${step===0?'disabled':''}>
          <i class="ph ph-arrow-left"></i> Geri
        </button>
        ${step < WIZARD_STEPS.length-1
          ? `<button class="btn primary" data-action="wiz-next">İleri <i class="ph ph-arrow-right"></i></button>`
          : `<button class="btn success" data-action="wiz-publish"><i class="ph ph-rocket-launch"></i> Yayınla</button>`}
      </div>
    </div>
  `;
};

/* ----- SELLER: Offers --------------------------------------------------- */
views.offers = () => {
  const myListingIds = LISTINGS.filter(l => l.seller_id === State.userId).map(l => l.id);
  const mine = OFFERS.filter(o => myListingIds.includes(o.listing_id));
  const pending  = mine.filter(o => o.status==='pending');
  const accepted = mine.filter(o => o.status==='accepted');
  const declined = mine.filter(o => o.status==='declined');

  function offerEl(o, withActions=true){
    const listing = listingById(o.listing_id);
    const aiBand = listing ? `${fmtTL(listing.ai_min)}–${fmtTL(listing.ai_max)}` : '';
    return `
      <div class="offer-card">
        <div class="row between">
          <div>
            <div style="font-weight:600;">${esc(o.listing_title)}</div>
            <div class="muted" style="font-size:var(--fs-xs);">${esc(o.buyer_name)} · ${esc(o.date)}</div>
          </div>
          <span class="badge ${o.status==='accepted'?'success':o.status==='declined'?'danger':'warning'}">
            ${o.status==='accepted'?'Kabul':o.status==='declined'?'Reddedildi':'Bekliyor'}
          </span>
        </div>
        <div class="row between gap-3">
          <div>
            <div class="offer-amount">${fmtTLFull(o.amount)}</div>
            <div class="muted" style="font-size:var(--fs-xs);">AI bandı: ${aiBand}</div>
          </div>
          ${listing ? `<button class="btn sm" data-action="open-listing" data-id="${listing.id}"><i class="ph ph-eye"></i></button>` : ''}
        </div>
        ${o.msg ? `<p style="margin:0; padding:var(--s-3); background:var(--surface-2); border-radius:var(--r-md); font-size:var(--fs-sm);">${esc(o.msg)}</p>` : ''}
        ${withActions ? `
          <div class="offer-actions">
            <button class="btn success" data-action="offer-accept" data-id="${o.id}"><i class="ph ph-check"></i> Kabul</button>
            <button class="btn danger"  data-action="offer-decline" data-id="${o.id}"><i class="ph ph-x"></i> Reddet</button>
            <button class="btn" data-action="offer-counter" data-id="${o.id}"><i class="ph ph-arrows-counter-clockwise"></i> Karşı Teklif</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  return `
    <div class="page-header">
      <h1>Gelen Teklifler</h1>
      <div class="subtitle">${pending.length} bekleyen · ${accepted.length} kabul · ${declined.length} red</div>
    </div>

    ${pending.length ? `
      <h3 class="mt-3 mb-2">Bekleyen Teklifler</h3>
      <div class="col gap-3">${pending.map(o => offerEl(o, true)).join('')}</div>
    ` : ''}

    ${accepted.length ? `
      <h3 class="mt-4 mb-2">Kabul Edilenler</h3>
      <div class="col gap-3">${accepted.map(o => offerEl(o, false)).join('')}</div>
    ` : ''}

    ${declined.length ? `
      <h3 class="mt-4 mb-2">Reddedilenler</h3>
      <div class="col gap-3">${declined.map(o => offerEl(o, false)).join('')}</div>
    ` : ''}

    ${mine.length===0 ? `<div class="empty"><i class="ph ph-handshake"></i><h3>Henüz teklif yok</h3></div>` : ''}
  `;
};

/* ----- SELLER: Performance --------------------------------------------- */
views.performance = () => {
  const p = PERFORMANCE[State.userId] || PERFORMANCE.U002;
  return `
    <div class="page-header">
      <h1>Performans</h1>
      <div class="subtitle">Son 14 günün özeti</div>
    </div>

    <div class="kpi-grid mb-4">
      ${kpiCard('Toplam Görüntülenme', fmt(p.total_views), 'ph-eye', '+12%')}
      ${kpiCard('Favoriye Eklenme', fmt(p.total_favs), 'ph-heart', '+8%')}
      ${kpiCard('Mesaj/Teklif', fmt(p.total_inquiries), 'ph-chat-circle', '+5%')}
      ${kpiCard('Dönüşüm', '%' + p.conversion, 'ph-trend-up', '+0.3pp')}
    </div>

    <div class="card mb-3">
      <h3 class="mb-3">Günlük Görüntülenme</h3>
      ${sparkSvg(p.views, 'var(--primary)')}
    </div>
    <div class="card mb-3">
      <h3 class="mb-3">Favori Eklenmesi</h3>
      ${sparkSvg(p.favs, 'var(--success)')}
    </div>
    <div class="card">
      <h3 class="mb-3">Mesaj / Teklif</h3>
      ${sparkSvg(p.inquiries, 'var(--warning)')}
    </div>

    <h3 class="mt-4 mb-3">En İyi İlanlar</h3>
    <div class="grid listings">
      ${LISTINGS.filter(l => l.seller_id===State.userId).sort((a,b)=>b.views-a.views).slice(0,3).map(l => listingCard(l, {seller:true})).join('')}
    </div>
  `;
};

function kpiCard(label, value, icon, trend){
  return `
    <div class="kpi">
      <div class="kpi-icon"><i class="ph ${icon}"></i></div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-trend"><i class="ph ph-trend-up"></i>${trend}</div>
    </div>
  `;
}

function sparkSvg(arr, color){
  if (!arr || !arr.length) return '';
  const w = 100, h = 30;
  const max = Math.max(...arr, 1);
  const step = w / (arr.length - 1);
  const pts = arr.map((v,i) => `${(i*step).toFixed(1)},${(h - (v/max)*h*0.9 - 1).toFixed(1)}`).join(' ');
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return `
    <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polygon points="${area}" fill="${color}" opacity="0.18"/>
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `;
}

/* ----- ADMIN: Approval Queue ------------------------------------------- */
views.approval = () => {
  const queue = PENDING_QUEUE();
  return `
    <div class="page-header">
      <h1>Onay Kuyruğu</h1>
      <div class="subtitle">${queue.length} ilan beklemede</div>
    </div>

    ${queue.length === 0 ? `<div class="empty"><i class="ph ph-shield-check"></i><h3>Kuyruk boş</h3></div>` : `
      <div class="col gap-3">
        ${queue.map(l => {
          const seller = USERS.find(u => u.id === l.seller_id);
          return `
            <div class="approval-card">
              <div class="row gap-3">
                <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)}); flex:0 0 96px; aspect-ratio:1; border-radius:var(--r-md);">
                  <div class="photo-label">${esc(l.photo_label || l.il)}</div>
                </div>
                <div style="flex:1; min-width:0;">
                  <div style="font-weight:600;">${esc(l.title)}</div>
                  <div class="muted" style="font-size:var(--fs-xs); margin-top:2px;">${esc(l.ilce)}, ${esc(l.il)} · ${fmtAlan(l.alan)} · ${fmtTL(l.fiyat)}</div>
                  <div class="row gap-2 mt-2">
                    <span class="badge"><i class="ph ph-user"></i> ${esc(seller?.name || '?')}</span>
                    ${seller?.verified ? '<span class="badge success">Doğrulanmış</span>' : '<span class="badge warning">Doğrulanmamış</span>'}
                  </div>
                </div>
              </div>

              <div class="badge risk-${l.ai_risk}" style="align-self:flex-start;">
                <i class="ph ph-sparkle"></i> AI Risk: ${l.ai_risk==='high'?'Yüksek':l.ai_risk==='medium'?'Orta':'Düşük'} (${l.ai_risk_score})
              </div>
              ${l.ai_risk_reason ? `<div class="muted" style="font-size:var(--fs-sm);">${esc(l.ai_risk_reason)}</div>` : ''}

              <div class="offer-actions">
                <button class="btn success" data-action="approve" data-id="${l.id}"><i class="ph ph-check"></i> Onayla</button>
                <button class="btn danger" data-action="reject" data-id="${l.id}"><i class="ph ph-x"></i> Reddet</button>
                <button class="btn" data-action="open-listing" data-id="${l.id}"><i class="ph ph-eye"></i> İncele</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
};

/* ----- ADMIN: Users ---------------------------------------------------- */
views.users = () => {
  return `
    <div class="page-header">
      <h1>Kullanıcılar</h1>
      <div class="subtitle">${USERS.length} kayıtlı kullanıcı</div>
    </div>

    <div class="chips mb-3">
      <button class="chip active" data-action="user-filter" data-val="all">Tümü</button>
      <button class="chip" data-action="user-filter" data-val="buyer">Alıcılar</button>
      <button class="chip" data-action="user-filter" data-val="seller">Satıcılar</button>
      <button class="chip" data-action="user-filter" data-val="admin">Yöneticiler</button>
    </div>

    <div class="card flush">
      ${USERS.map(u => `
        <div class="user-row">
          <div class="avatar">${esc(u.avatar)}</div>
          <div>
            <div style="font-weight:600;">${esc(u.name)} ${u.verified ? '<i class="ph ph-seal-check" style="color:var(--success);"></i>' : ''}</div>
            <div class="user-meta">${esc(u.email)} · ${esc(u.phone || '—')}</div>
          </div>
          <span class="badge ${u.role==='admin'?'primary':u.role==='seller'?'success':''}">${rolLabel(u.role)}</span>
          <span class="badge hide-mobile">${esc(u.badge || '—')}</span>
          <span class="badge hide-mobile">${esc(u.joined)}</span>
          <button class="icon-btn" title="İşlemler"><i class="ph ph-dots-three-vertical"></i></button>
        </div>
      `).join('')}
    </div>
  `;
};

/* ----- ADMIN: Reports -------------------------------------------------- */
views.reports = () => {
  const m = PLATFORM_METRICS;
  return `
    <div class="page-header">
      <h1>Platform Raporları</h1>
      <div class="subtitle">Bu hafta · genel durum</div>
    </div>

    <div class="kpi-grid mb-4">
      ${kpiCard('Toplam İlan', fmt(m.total_listings), 'ph-stack', '+2')}
      ${kpiCard('Aktif İlan', fmt(m.active_listings), 'ph-check-circle', '+1')}
      ${kpiCard('Onay Bekleyen', fmt(m.pending_listings), 'ph-clock', '')}
      ${kpiCard('Toplam Kullanıcı', fmt(m.total_users), 'ph-users-three', '+1')}
    </div>

    <div class="card mb-4">
      <h3 class="mb-3">Günlük Ziyaret (Son 14 Gün)</h3>
      ${sparkSvg(m.daily_visits, 'var(--primary)')}
    </div>

    <div class="kpi-grid">
      ${kpiCard('Bu Hafta İşlem', fmt(m.this_week_transactions), 'ph-handshake', '+4')}
      ${kpiCard('İşlem Hacmi', fmtTL(m.this_week_volume), 'ph-currency-circle-dollar', '+18%')}
      ${kpiCard('Alıcılar', fmt(m.buyers), 'ph-user', '')}
      ${kpiCard('Satıcılar', fmt(m.sellers), 'ph-storefront', '')}
    </div>

    <h3 class="mt-4 mb-3">En Çok İlgi Gören İlanlar</h3>
    <div class="grid listings">
      ${LISTINGS.filter(l=>l.status==='active').sort((a,b)=>b.views-a.views).slice(0,4).map(l=>listingCard(l)).join('')}
    </div>
  `;
};

/* ----- Shared: Profile -------------------------------------------------- */
views.profile = () => {
  const u = currentUser();
  return `
    <div class="page-header"><h1>Profil</h1></div>
    <div class="card">
      <div class="row gap-3 mb-3">
        <div class="avatar lg">${esc(u.avatar)}</div>
        <div>
          <h3>${esc(u.name)} ${u.verified ? '<i class="ph ph-seal-check" style="color:var(--success);"></i>' : ''}</h3>
          <div class="muted">${esc(u.email)}</div>
        </div>
      </div>
      <div class="spec-grid">
        <div class="spec-item"><span class="spec-label">Rol</span><span class="spec-value">${rolLabel(u.role)}</span></div>
        <div class="spec-item"><span class="spec-label">Telefon</span><span class="spec-value">${esc(u.phone || '—')}</span></div>
        <div class="spec-item"><span class="spec-label">Katılım</span><span class="spec-value">${esc(u.joined)}</span></div>
        <div class="spec-item"><span class="spec-label">Durum</span><span class="spec-value">${u.verified ? 'Onaylı' : 'Doğrulanmamış'}</span></div>
      </div>
    </div>
  `;
};

/* =========================================================================
   EVENT DELEGATION
   ========================================================================= */
document.body.addEventListener('click', e => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const a = target.dataset.action;

  switch(a){
    case 'nav':
      Router.go(target.dataset.view);
      break;
    case 'theme': {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', t);
      const ic = $('#themeIcon');
      if (ic) ic.className = 'ph ' + (t==='dark' ? 'ph-moon' : 'ph-sun');
      break;
    }
    case 'back':
      history.back();
      break;
    case 'open-listing':
      Router.go('listing', { id: target.dataset.id });
      break;
    case 'toggle-fav': {
      e.stopPropagation();
      const id = target.dataset.id;
      toggleFav(id);
      const wasOnDetail = State.view === 'listing';
      Render.view();
      Toast.show(isFav(id) ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı', '', 'ph-heart');
      break;
    }
    case 'clear-search':
      State.filters.q = '';
      Render.view();
      break;
    case 'filter': {
      const k = target.dataset.key;
      State.filters[k] = State.filters[k] === target.dataset.val ? '' : target.dataset.val;
      Render.view();
      break;
    }
    case 'open-thread': {
      const buyerId = State.role === 'buyer' ? State.userId : USERS.find(u => u.role==='buyer').id;
      const sellerId = target.dataset.seller;
      const listingId = target.dataset.listing;
      let t = THREADS.find(x => x.listing_id===listingId && x.buyer_id===buyerId && x.seller_id===sellerId);
      if (!t){
        t = { id:'M' + (THREADS.length + 100), listing_id:listingId, buyer_id:buyerId, seller_id:sellerId, unread_for_buyer:0, unread_for_seller:0, last_time:'şimdi' };
        THREADS.push(t);
      }
      Router.go('thread', { id: t.id });
      break;
    }
    case 'open-thread-id':
      Router.go('thread', { id: target.dataset.id });
      break;
    case 'use-template': {
      const field = $('#chatField');
      if (field){ field.value = target.dataset.text; field.focus(); }
      break;
    }
    case 'send-msg': {
      const field = $('#chatField');
      if (!field || !field.value.trim()) break;
      MESSAGES.push({ thread: target.dataset.thread, from: State.userId, text: field.value.trim(), time: 'şimdi' });
      field.value = '';
      Render.view();
      Toast.show('Mesaj gönderildi', 'success', 'ph-paper-plane-tilt');
      break;
    }
    case 'make-offer': {
      const l = listingById(target.dataset.id);
      Sheet.open(`
        <h3>Teklif Ver</h3>
        <p class="muted">${esc(l.title)}</p>
        <div class="field">
          <label>Teklif Tutarı (₺)</label>
          <div class="input"><i class="ph ph-currency-circle-dollar"></i><input id="offerAmount" type="number" value="${Math.round(l.fiyat*0.95)}"></div>
          <span class="help">Liste fiyatı ${fmtTLFull(l.fiyat)}</span>
        </div>
        <div class="field">
          <label>Mesaj (opsiyonel)</label>
          <div class="input"><textarea id="offerMsg" rows="3" placeholder="Satıcıya iletmek istediğiniz not..."></textarea></div>
        </div>
        <div class="row gap-2 mt-3">
          <button class="btn" data-action="sheet-close">İptal</button>
          <button class="btn primary" style="flex:1;" data-action="submit-offer" data-id="${l.id}"><i class="ph ph-handshake"></i> Teklifi Gönder</button>
        </div>
      `);
      break;
    }
    case 'submit-offer': {
      const amt = parseInt($('#offerAmount').value || '0');
      const msg = $('#offerMsg').value || '';
      const l = listingById(target.dataset.id);
      const u = currentUser();
      OFFERS.push({
        id:'O' + (OFFERS.length+100), listing_id:l.id, listing_title:l.title,
        buyer_id:u.id, buyer_name:u.name, amount:amt, status:'pending', date:new Date().toISOString().slice(0,10), msg
      });
      Sheet.close();
      Toast.show(`Teklifiniz iletildi: ${fmtTLFull(amt)}`, 'success', 'ph-handshake');
      break;
    }
    case 'sheet-close':
      Sheet.close();
      break;
    case 'offer-accept': {
      const o = OFFERS.find(x=>x.id===target.dataset.id);
      if (o){ o.status='accepted'; Toast.show('Teklif kabul edildi', 'success'); Render.view(); }
      break;
    }
    case 'offer-decline': {
      const o = OFFERS.find(x=>x.id===target.dataset.id);
      if (o){ o.status='declined'; Toast.show('Teklif reddedildi', 'danger', 'ph-x'); Render.view(); }
      break;
    }
    case 'offer-counter':
      Toast.show('Karşı teklif modülü yakında', '', 'ph-info');
      break;
    case 'wiz-prev':
      if (State.wizard.step > 0) State.wizard.step--;
      Render.view();
      break;
    case 'wiz-next':
      if (State.wizard.step < WIZARD_STEPS.length-1) State.wizard.step++;
      Render.view();
      break;
    case 'wiz-publish': {
      const d = State.wizard.data;
      const newId = 'L' + (LISTINGS.length + 100);
      LISTINGS.unshift({
        id:newId,
        title: d.title || `${d.il} ${d.ilce} ${d.imar} Arsası`,
        il:d.il, ilce:d.ilce, mahalle:d.mahalle, ada:d.ada, parsel:d.parsel,
        alan:+d.alan||0, fiyat:+d.fiyat||0, fiyat_m2:+d.alan?Math.round(+d.fiyat/+d.alan):0,
        imar:d.imar, tapu:d.tapu, tkgm:d.tkgm, emsal:+d.emsal||0,
        yol_cephesi:+d.yol_cephesi||0, kat_adedi:+d.kat_adedi||0,
        status:'pending', verified:false, seller_id:State.userId,
        views:0, favs:0, inquiries:0,
        ai_min:Math.round((+d.fiyat||0)*0.92), ai_max:Math.round((+d.fiyat||0)*1.08), ai_trend:8, ai_risk:'medium', ai_risk_score:40,
        created:new Date().toISOString().slice(0,10),
        desc:d.desc, photo_color:'#1a3a5c', photo_label:d.ilce||d.il, tags:[]
      });
      State.wizard = { step:0, data:{ il:'', ilce:'', mahalle:'', ada:'', parsel:'', alan:0, imar:'', tapu:'', tkgm:'', yol_cephesi:0, emsal:0, kat_adedi:0, fiyat:0, desc:'', tags:[], title:'' } };
      Toast.show('İlanınız yayınlandı — onay bekleniyor', 'success', 'ph-rocket-launch');
      Router.go('my-listings');
      break;
    }
    case 'apply-ai-price':
      State.wizard.data.fiyat = +target.dataset.val;
      Toast.show('AI önerisi uygulandı', '', 'ph-magic-wand');
      Render.view();
      break;
    case 'ai-write-desc':
      State.wizard.data.desc = aiWriteDescription(State.wizard.data);
      Toast.show('AI açıklama yazdı', '', 'ph-sparkle');
      Render.view();
      break;
    case 'approve': {
      const l = listingById(target.dataset.id);
      if (l){ l.status='active'; l.verified=true; Toast.show('İlan onaylandı', 'success'); Render.view(); }
      break;
    }
    case 'reject': {
      const l = listingById(target.dataset.id);
      if (l){ l.status='rejected'; Toast.show('İlan reddedildi', 'danger', 'ph-x'); Render.view(); }
      break;
    }
    case 'edit-listing':
      Toast.show('İlan düzenleme yakında', '', 'ph-info');
      break;
    case 'boost':
      Toast.show('İlan öne çıkarıldı (24 sa)', 'success', 'ph-rocket-launch');
      break;
    case 'user-filter':
      Toast.show(`Filtre: ${target.dataset.val}`, '', 'ph-funnel');
      $$('[data-action="user-filter"]').forEach(b=>b.classList.remove('active'));
      target.classList.add('active');
      break;
  }
});

/* Bind text inputs for search & wizard */
document.body.addEventListener('input', e => {
  if (e.target.id === 'aiSearch'){
    State.filters.q = e.target.value;
    const ai = aiParseQuery(e.target.value);
    Object.assign(State.filters, {
      il: ai.il || '', imar: ai.imar || '', tkgm: ai.tkgm || '',
      fiyat_max: ai.fiyat_max || 0, alan_min: ai.alan_min || 0, tag_hint: ai.tag_hint || ''
    });
    // re-render but don't lose focus
    const focused = e.target;
    const caret = focused.selectionStart;
    Render.view();
    const re = $('#aiSearch');
    if (re){ re.focus(); re.setSelectionRange(caret, caret); }
  }
  if (e.target.dataset.wiz){
    const key = e.target.dataset.wiz;
    State.wizard.data[key] = e.target.value;
  }
});
document.body.addEventListener('change', e => {
  if (e.target.dataset.wiz){
    State.wizard.data[e.target.dataset.wiz] = e.target.value;
    Render.view();
  }
});

/* Role switcher */
$('#roleSelect').addEventListener('change', e => {
  State.role = e.target.value;
  State.userId = ACTIVE_USER_PER_ROLE[State.role];
  State.view = DEFAULT_VIEW[State.role];
  location.hash = '#' + State.view;
  Render.view();
  Toast.show(`Rol: ${rolLabel(State.role)}`, '', 'ph-user-switch');
});

/* Theme btn (mobile header) */
$('#themeBtn').addEventListener('click', () => {
  const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  $('#themeIcon').className = 'ph ' + (t==='dark' ? 'ph-moon' : 'ph-sun');
});

/* Notif btn → sheet */
$('#notifBtn').addEventListener('click', () => {
  const ns = NOTIFICATIONS[State.role] || [];
  Sheet.open(`
    <h3 class="mb-3">Bildirimler</h3>
    ${ns.length===0 ? '<p class="muted">Henüz bildirim yok.</p>' :
      ns.map(n => `
        <div class="row gap-3" style="padding:var(--s-3) 0; border-bottom:1px solid var(--border);">
          <div class="kpi-icon"><i class="ph ${esc(n.icon)}"></i></div>
          <div style="flex:1;">
            <div style="${n.read?'color:var(--text-muted);':''}">${esc(n.text)}</div>
            <div class="muted" style="font-size:var(--fs-xs);">${esc(n.time)}</div>
          </div>
          ${!n.read ? '<span class="status-dot active"></span>' : ''}
        </div>
      `).join('')
    }
    <button class="btn block mt-3" data-action="sheet-close">Kapat</button>
  `);
  ns.forEach(n => n.read = true);
});

/* Initial route */
(function init(){
  const r = Router.fromHash();
  if (r){ State.view = r.view; State.params = r.params; }
  else State.view = DEFAULT_VIEW[State.role];
  Render.view();
})();
