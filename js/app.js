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
    if (view === 'listing') State.photoIdx = 0;
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
    const items = NAV[State.role];
    $('#sidebar').innerHTML = `
      <div class="brand">
        <i class="ph-fill ph-map-trifold"></i>
        <span>LandX <span class="brand-sub">arsa pazaryeri</span></span>
      </div>
      <div class="nav-group-title">${rolLabel(State.role)} paneli</div>
      ${items.map(it => `
        <div class="nav-item ${State.view===it.id?'active':''}" data-action="nav" data-view="${it.id}" tabindex="0" role="button" aria-label="${it.label}">
          <i class="ph ${it.icon}"></i><span>${it.label}</span>
        </div>
      `).join('')}
      <div class="sidebar-footer">
        <div class="row between">
          <span>${esc(currentUser().name)}</span>
          <button class="icon-btn" data-action="theme" title="Tema" aria-label="Tema değiştir">
            <i class="ph ph-moon"></i>
          </button>
        </div>
      </div>
    `;

    $('#bottomNav').innerHTML = items.map(it => `
      <div class="nav-item ${State.view===it.id?'active':''}" data-action="nav" data-view="${it.id}" role="button" aria-label="${it.label}" tabindex="0">
        <i class="ph ${it.icon}"></i><span>${it.label}</span>
      </div>
    `).join('');

    $('#headerAvatar').textContent = currentUser().avatar;

    const hasUnread = (NOTIFICATIONS[State.role] || []).some(n => !n.read);
    $('#notifDot').style.display = hasUnread ? '' : 'none';

    $('#roleSelect').value = State.role;
  },

  view(){
    const validViews = NAV[State.role].map(n=>n.id).concat(['listing','thread','profile','compare','notifications']);
    if (!validViews.includes(State.view)) {
      // Show 404 instead of silent redirect when hash invalid
      Render.shell();
      $('#appMain').innerHTML = `
        <div class="empty">
          <i class="ph ph-compass"></i>
          <h3>Sayfa bulunamadı</h3>
          <p>Aradığınız sayfa bu rol için geçerli değil.</p>
          <button class="btn primary" data-action="nav" data-view="${DEFAULT_VIEW[State.role]}">
            <i class="ph ph-house"></i> Ana sayfaya dön
          </button>
        </div>
      `;
      return;
    }

    Render.shell();
    const main = $('#appMain');
    main.scrollTo({ top:0 });

    switch(State.view){
      case 'discover':    main.innerHTML = views.discover();    break;
      case 'listing':     main.innerHTML = views.listing(State.params.id); break;
      case 'favorites':   main.innerHTML = views.favorites();   break;
      case 'messages':    main.innerHTML = views.messages();    break;
      case 'thread':      main.innerHTML = views.thread(State.params.id); afterChat(); break;
      case 'my-listings': main.innerHTML = views.myListings();  break;
      case 'wizard':      main.innerHTML = views.wizard();      break;
      case 'offers':      main.innerHTML = views.offers();      break;
      case 'performance': main.innerHTML = views.performance(); break;
      case 'approval':    main.innerHTML = views.approval();    break;
      case 'users':       main.innerHTML = views.users();       break;
      case 'reports':     main.innerHTML = views.reports();     break;
      case 'profile':       main.innerHTML = views.profile();     break;
      case 'compare':       main.innerHTML = views.compare();     break;
      case 'notifications': main.innerHTML = views.notifications(); break;
    }
    // mobile FAB
    renderFab();
  }
};

function renderFab(){
  let fab = $('#fab');
  if (!fab){
    fab = document.createElement('button');
    fab.id = 'fab';
    fab.className = 'fab';
    document.body.appendChild(fab);
  }
  if (State.role === 'seller' && State.view === 'my-listings'){
    fab.style.display = '';
    fab.innerHTML = '<i class="ph ph-plus"></i>';
    fab.title = 'Yeni İlan';
    fab.setAttribute('aria-label','Yeni İlan');
    fab.onclick = () => Router.go('wizard');
  } else if (State.role === 'buyer' && (State.view === 'favorites' || State.view === 'compare') && State.compare.length){
    fab.style.display = '';
    fab.innerHTML = `<i class="ph ph-scales"></i><span>Karşılaştır ${State.compare.length}</span>`;
    fab.title = 'Karşılaştır';
    fab.setAttribute('aria-label','Karşılaştır');
    fab.onclick = () => Router.go('compare');
  } else {
    fab.style.display = 'none';
  }
}

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

/* ---------- Photo helpers ----------------------------------------------- */
function shade(hex, pct){
  const n = parseInt(hex.slice(1), 16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r = Math.min(255, Math.max(0, r + Math.round((pct/100)*255)));
  g = Math.min(255, Math.max(0, g + Math.round((pct/100)*255)));
  b = Math.min(255, Math.max(0, b + Math.round((pct/100)*255)));
  return '#' + ((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');
}

// 4 farklı pseudo-foto açısı sağlamak için renk varyantları
function listingPhotos(l){
  return [
    { color:l.photo_color, label:l.photo_label || l.il, kind:'Genel' },
    { color:shade(l.photo_color, 12), label:l.photo_label || l.il, kind:'Yol Cephesi' },
    { color:shade(l.photo_color, -12), label:l.photo_label || l.il, kind:'Uydu' },
    { color:shade(l.photo_color, 20), label:l.photo_label || l.il, kind:'Çevre' },
  ];
}

/* ---------- Listing card ------------------------------------------------ */
function listingCard(l, opts={}){
  const fav = isFav(l.id);
  return `
    <article class="listing-card" data-action="open-listing" data-id="${l.id}" tabindex="0" role="link" aria-label="${esc(l.title)}">
      <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)})">
        <div class="photo-label">${esc(l.photo_label || l.il)}</div>
        ${l.verified ? '<div class="verified-badge"><i class="ph ph-seal-check"></i>Onaylı</div>' : ''}
        ${State.role==='buyer' ? `
          <button class="fav-btn ${fav?'active':''}" data-action="toggle-fav" data-id="${l.id}" title="${fav?'Favoriden çıkar':'Favoriye ekle'}" aria-label="Favori">
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
  let result = LISTINGS.filter(l => l.status === 'active')
    .filter(l => !f.il   || l.il === f.il)
    .filter(l => !f.imar || l.imar === f.imar)
    .filter(l => !f.tkgm || l.tkgm === f.tkgm)
    .filter(l => !f.fiyat_max || l.fiyat <= f.fiyat_max)
    .filter(l => !f.alan_min  || l.alan  >= f.alan_min)
    .filter(l => !f.tag_hint  || l.tags.some(t => t.toLowerCase().includes(f.tag_hint)));

  if      (f.sort === 'price-asc')  result.sort((a,b)=>a.fiyat - b.fiyat);
  else if (f.sort === 'price-desc') result.sort((a,b)=>b.fiyat - a.fiyat);
  else if (f.sort === 'area-desc')  result.sort((a,b)=>b.alan  - a.alan);
  else                              result.sort((a,b)=> (b.created||'').localeCompare(a.created||''));

  const aiHint = f.q ? aiParseQuery(f.q) : null;
  const activeCount = [f.il, f.imar, f.tkgm].filter(Boolean).length + (f.fiyat_max?1:0) + (f.alan_min?1:0);

  return `
    <div class="page-header">
      <h1>Keşfet</h1>
      <div class="subtitle">${result.length} aktif arsa ilanı${activeCount?` · ${activeCount} filtre`:''}</div>
    </div>

    <div class="input mb-3">
      <i class="ph ph-magnifying-glass"></i>
      <input id="aiSearch" type="text" placeholder="AI ile ara: 'İstanbul konut 5M altı temiz tapu'" value="${esc(f.q)}" aria-label="AI arama">
      ${f.q ? '<button class="icon-btn" data-action="clear-search" title="Temizle" style="background:transparent;border:none;" aria-label="Aramayı temizle"><i class="ph ph-x"></i></button>' : ''}
    </div>

    ${aiHint && (aiHint.il||aiHint.imar||aiHint.fiyat_max||aiHint.alan_min||aiHint.tkgm||aiHint.tag_hint) ? `
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

    <div class="row between gap-2 mb-2">
      <button class="btn sm" data-action="open-filter-sheet"><i class="ph ph-funnel"></i> Detaylı Filtre${activeCount?` · ${activeCount}`:''}</button>
      <div class="row gap-2">
        <select class="chip" data-action="set-sort" aria-label="Sıralama">
          <option value="newest"     ${f.sort==='newest'?'selected':''}>En Yeni</option>
          <option value="price-asc"  ${f.sort==='price-asc'?'selected':''}>Fiyat ↑</option>
          <option value="price-desc" ${f.sort==='price-desc'?'selected':''}>Fiyat ↓</option>
          <option value="area-desc"  ${f.sort==='area-desc'?'selected':''}>Alan ↓</option>
        </select>
      </div>
    </div>

    <div class="chips scroll mb-3" role="tablist" aria-label="İl filtresi">
      <button class="chip ${!f.il?'active':''}" data-action="filter" data-key="il" data-val=""><i class="ph ph-funnel"></i>Tüm İller</button>
      ${IL_LIST.map(il => `<button class="chip ${f.il===il?'active':''}" data-action="filter" data-key="il" data-val="${esc(il)}">${esc(il)}</button>`).join('')}
    </div>

    <div class="chips scroll mb-3" role="tablist" aria-label="İmar filtresi">
      <button class="chip ${!f.imar?'active':''}" data-action="filter" data-key="imar" data-val="">Tüm İmar</button>
      ${IMAR_LIST.map(im => `<button class="chip ${f.imar===im?'active':''}" data-action="filter" data-key="imar" data-val="${esc(im)}">${esc(im)}</button>`).join('')}
    </div>

    ${result.length === 0 ? `
      <div class="empty">
        <i class="ph ph-magnifying-glass"></i>
        <h3>Sonuç yok</h3>
        <p>Filtreleri gevşetip tekrar deneyin.</p>
        <button class="btn" data-action="clear-all-filters"><i class="ph ph-broom"></i> Tüm Filtreleri Temizle</button>
      </div>
    ` : `
      <div class="grid listings">${result.map(l => listingCard(l)).join('')}</div>
    `}
  `;
};

/* ----- BUYER: Listing detail ------------------------------------------- */
views.listing = (id) => {
  const l = listingById(id);
  if (!l) return `<div class="empty"><i class="ph ph-warning"></i><h3>İlan bulunamadı</h3><button class="btn primary" data-action="nav" data-view="discover">Keşfet'e dön</button></div>`;
  const fav = isFav(l.id);
  const pricePos = Math.max(0, Math.min(100, ((l.fiyat - l.ai_min) / Math.max(1,(l.ai_max - l.ai_min))) * 100));
  const photos = listingPhotos(l);
  const idx = Math.min(State.photoIdx || 0, photos.length-1);
  const cur = photos[idx];
  const seller = USERS.find(u => u.id === l.seller_id);

  // benzer ilanlar (aynı il + benzer imar, başka id)
  const similar = LISTINGS
    .filter(x => x.id !== l.id && x.status==='active' && (x.il===l.il || x.imar===l.imar))
    .sort((a,b)=>Math.abs(a.fiyat-l.fiyat) - Math.abs(b.fiyat-l.fiyat))
    .slice(0,4);

  // satıcının diğer aktif ilanları
  const otherFromSeller = LISTINGS.filter(x => x.id !== l.id && x.seller_id===l.seller_id && x.status==='active').slice(0,3);

  return `
    <div class="row gap-2 mb-3">
      <button class="btn sm ghost" data-action="back" aria-label="Geri"><i class="ph ph-arrow-left"></i> Geri</button>
      <div class="header-spacer"></div>
      ${State.role==='buyer' ? `
        <button class="icon-btn" data-action="toggle-fav" data-id="${l.id}" title="Favori" aria-label="Favoriye ekle">
          <i class="${fav?'ph-fill':'ph'} ph-heart" style="${fav?'color:var(--danger);':''}"></i>
        </button>` : ''}
      <button class="icon-btn" data-action="share" data-id="${l.id}" title="Paylaş" aria-label="Paylaş"><i class="ph ph-share-network"></i></button>
      ${State.role==='buyer' ? `<button class="icon-btn" data-action="report" data-id="${l.id}" title="Şikayet" aria-label="Şikayet et"><i class="ph ph-flag"></i></button>` : ''}
    </div>

    <div class="carousel">
      <div class="detail-hero" style="background:linear-gradient(135deg, ${cur.color}, ${shade(cur.color,25)})">
        <span>${esc(cur.label)} · ${esc(cur.kind)}</span>
        <button class="carousel-arrow left" data-action="photo-prev" aria-label="Önceki foto"${idx===0?' disabled':''}><i class="ph ph-caret-left"></i></button>
        <button class="carousel-arrow right" data-action="photo-next" aria-label="Sonraki foto"${idx===photos.length-1?' disabled':''}><i class="ph ph-caret-right"></i></button>
        <div class="photo-dots">${photos.map((_,i)=>`<span class="${i===idx?'active':''}" data-action="photo-go" data-i="${i}"></span>`).join('')}</div>
      </div>
    </div>

    <div class="mt-3">
      <div class="row gap-2 mb-2" style="flex-wrap:wrap;">
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
      <div class="row gap-3 mt-2 muted" style="font-size:var(--fs-xs);">
        <span><i class="ph ph-eye"></i> ${l.views} görüntülenme</span>
        <span><i class="ph ph-heart"></i> ${l.favs} favori</span>
        <span><i class="ph ph-chat-circle"></i> ${l.inquiries} mesaj</span>
      </div>
    </div>

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

    <h3 class="mt-4 mb-3">Konum</h3>
    <div class="map-box">
      <i class="ph ph-map-pin-line"></i>
      <div>
        <div style="font-weight:600;">${esc(l.mahalle)}, ${esc(l.ilce)}</div>
        <div class="muted" style="font-size:var(--fs-xs);">${esc(l.il)} · Ada ${esc(l.ada)} / Parsel ${esc(l.parsel)}</div>
      </div>
      <button class="btn sm ghost" data-action="copy-coords" data-il="${esc(l.il)}" data-ilce="${esc(l.ilce)}"><i class="ph ph-copy"></i> Konumu Kopyala</button>
    </div>

    <h3 class="mt-4 mb-3">Açıklama</h3>
    <p>${esc(l.desc)}</p>

    <div class="tag-row mt-2">
      ${l.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
    </div>

    <h3 class="mt-4 mb-3">Satıcı</h3>
    <div class="card">
      <div class="row gap-3">
        <div class="avatar lg">${esc(seller?.avatar || '?')}</div>
        <div style="flex:1;">
          <div style="font-weight:600;">${esc(sellerName(l.seller_id))}</div>
          <div class="muted" style="font-size:var(--fs-xs);">
            ${esc(seller?.badge || 'Satıcı')}
            ${seller?.verified ? '<i class="ph ph-seal-check" style="color:var(--success);"></i>' : ''}
            · Üyelik: ${esc(seller?.joined || '—')}
          </div>
        </div>
        ${State.role==='buyer' ? `<button class="btn sm" data-action="open-thread" data-listing="${l.id}" data-seller="${l.seller_id}"><i class="ph ph-chat-circle"></i></button>` : ''}
      </div>
    </div>

    ${otherFromSeller.length ? `
      <h3 class="mt-4 mb-3">Bu Satıcının Diğer İlanları</h3>
      <div class="grid listings">${otherFromSeller.map(x => listingCard(x)).join('')}</div>
    `:''}

    ${similar.length ? `
      <h3 class="mt-4 mb-3">Benzer İlanlar</h3>
      <div class="grid listings">${similar.map(x => listingCard(x)).join('')}</div>
    `:''}

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
      <div class="subtitle">${favs.length} kayıtlı ilan${State.compare.length ? ` · ${State.compare.length} karşılaştırma seçimi` : ''}</div>
    </div>
    ${tipCard('favorites', 'Karşılaştır', 'Karşılaştırmak istediğin ilanları seç (max 3), sonra alttaki butona dokun.')}
    ${favs.length === 0 ? `
      <div class="empty">
        <i class="ph ph-heart"></i>
        <h3>Henüz favori yok</h3>
        <p>Keşfet'te beğendiğiniz ilanları kalp ikonuyla kaydedin.</p>
        <button class="btn primary" data-action="nav" data-view="discover"><i class="ph ph-compass"></i> Keşfet'e Git</button>
      </div>
    ` : `
      <div class="row between mb-3" style="flex-wrap:wrap; gap:var(--s-2);">
        <span class="muted">${favs.length} ilan</span>
        <div class="row gap-2">
          ${State.compare.length ? `<button class="btn sm primary" data-action="nav" data-view="compare"><i class="ph ph-scales"></i> Karşılaştır (${State.compare.length})</button>` : ''}
          ${State.compare.length ? `<button class="btn sm ghost" data-action="clear-compare"><i class="ph ph-x"></i> Seçimi Temizle</button>` : ''}
          <button class="btn sm ghost" data-action="clear-favs"><i class="ph ph-trash"></i> Tümünü Temizle</button>
        </div>
      </div>
      <div class="grid listings">${favs.map(l => favCard(l)).join('')}</div>
    `}
  `;
};

function favCard(l){
  const sel = State.compare.includes(l.id);
  return `
    <article class="listing-card ${sel?'sel':''}" data-action="open-listing" data-id="${l.id}" tabindex="0" role="link">
      <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)})">
        <div class="photo-label">${esc(l.photo_label || l.il)}</div>
        ${l.verified ? '<div class="verified-badge"><i class="ph ph-seal-check"></i>Onaylı</div>' : ''}
        <button class="fav-btn active" data-action="toggle-fav" data-id="${l.id}" title="Favoriden çıkar" aria-label="Favoriden çıkar"><i class="ph-fill ph-heart"></i></button>
        <button class="compare-btn ${sel?'on':''}" data-action="toggle-compare" data-id="${l.id}" aria-label="Karşılaştırmaya ekle">
          <i class="ph ${sel?'ph-check-square':'ph-square'}"></i> ${sel?'Seçildi':'Karşılaştır'}
        </button>
      </div>
      <div class="listing-body">
        <div class="listing-title">${esc(l.title)}</div>
        <div class="listing-loc"><i class="ph ph-map-pin"></i> ${esc(l.ilce)}, ${esc(l.il)}</div>
        <div class="listing-stats">
          <span><i class="ph ph-ruler"></i> ${fmtAlan(l.alan)}</span>
          <span><i class="ph ph-buildings"></i> ${esc(l.imar)}</span>
        </div>
        <div class="listing-price">${fmtTL(l.fiyat)}</div>
      </div>
    </article>
  `;
}

function tipCard(key, title, body){
  if (State.tipsDismissed[key]) return '';
  return `
    <div class="tip-card mb-3">
      <i class="ph ph-lightbulb"></i>
      <div style="flex:1;">
        <div style="font-weight:600;">${esc(title)}</div>
        <div class="muted" style="font-size:var(--fs-xs);">${esc(body)}</div>
      </div>
      <button class="icon-btn" data-action="dismiss-tip" data-key="${key}" aria-label="Kapat" style="background:transparent;border:none;"><i class="ph ph-x"></i></button>
    </div>
  `;
}

/* ----- BUYER: Compare ------------------------------------------------- */
views.compare = () => {
  const items = State.compare.map(id => listingById(id)).filter(Boolean);
  if (items.length === 0) return `
    <div class="page-header"><h1>Karşılaştırma</h1></div>
    <div class="empty">
      <i class="ph ph-scales"></i>
      <h3>Seçili ilan yok</h3>
      <p>Favorilerden en az 2 ilan seçin.</p>
      <button class="btn primary" data-action="nav" data-view="favorites"><i class="ph ph-heart"></i> Favorilere git</button>
    </div>`;

  const rows = [
    ['İl',           l => esc(l.il)],
    ['İlçe',         l => esc(l.ilce)],
    ['Mahalle',      l => esc(l.mahalle)],
    ['Alan',         l => fmtAlan(l.alan)],
    ['İmar',         l => esc(l.imar)],
    ['Tapu',         l => esc(l.tapu)],
    ['TKGM',         l => `<span class="badge ${l.tkgm==='Temiz'?'success':'warning'}">${esc(l.tkgm)}</span>`],
    ['Emsal',        l => l.emsal>0?'E:'+l.emsal:'—'],
    ['Yol Cephesi',  l => l.yol_cephesi+' m'],
    ['Fiyat',        l => `<strong>${fmtTLFull(l.fiyat)}</strong>`],
    ['m² fiyat',     l => fmt(l.fiyat_m2)+' ₺'],
    ['AI bant',      l => `${fmtTL(l.ai_min)} – ${fmtTL(l.ai_max)}`],
    ['Görüntülenme', l => l.views],
    ['Favori',       l => l.favs],
  ];

  return `
    <div class="row between mb-3">
      <div class="page-header" style="margin:0;">
        <h1>Karşılaştırma</h1>
        <div class="subtitle">${items.length} ilan yan yana</div>
      </div>
      <button class="btn sm ghost" data-action="clear-compare"><i class="ph ph-x"></i> Temizle</button>
    </div>

    <div class="compare-grid" style="--cols:${items.length}">
      <div class="compare-cell head"></div>
      ${items.map(l => `
        <div class="compare-cell head">
          <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)}); aspect-ratio:16/9;border-radius:var(--r-md);">
            <div class="photo-label">${esc(l.photo_label||l.il)}</div>
          </div>
          <div style="font-weight:600; margin-top:var(--s-2);">${esc(l.title)}</div>
          <button class="btn sm mt-2" data-action="open-listing" data-id="${l.id}"><i class="ph ph-arrow-square-out"></i> Aç</button>
        </div>
      `).join('')}

      ${rows.map(([label, val]) => `
        <div class="compare-cell label">${label}</div>
        ${items.map(l => `<div class="compare-cell">${val(l)}</div>`).join('')}
      `).join('')}
    </div>
  `;
};

/* ----- Notifications full page ---------------------------------------- */
views.notifications = () => {
  const ns = NOTIFICATIONS[State.role] || [];
  return `
    <div class="page-header">
      <h1>Bildirimler</h1>
      <div class="subtitle">${ns.filter(n=>!n.read).length} okunmamış · toplam ${ns.length}</div>
    </div>
    ${ns.length === 0 ? '<div class="empty"><i class="ph ph-bell-slash"></i><h3>Bildirim yok</h3></div>' : `
      <div class="card flush">
        ${ns.map(n => `
          <div class="row gap-3" style="padding:var(--s-3) var(--s-4); border-bottom:1px solid var(--border);">
            <div class="kpi-icon" style="${n.read?'opacity:0.45;':''}"><i class="ph ${esc(n.icon)}"></i></div>
            <div style="flex:1;">
              <div style="${n.read?'color:var(--text-muted);':''}">${esc(n.text)}</div>
              <div class="muted" style="font-size:var(--fs-xs);">${esc(n.time)}</div>
            </div>
            ${!n.read ? '<span class="status-dot active"></span>' : ''}
          </div>
        `).join('')}
      </div>
      <div class="row gap-2 mt-3">
        <button class="btn ghost" data-action="mark-all-read"><i class="ph ph-check-double"></i> Tümünü okundu işaretle</button>
      </div>
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
      <div class="subtitle">${myThreads.length} sohbet · ${myThreads.reduce((a,t)=>a+(role==='buyer'?t.unread_for_buyer:t.unread_for_seller),0)} okunmamış</div>
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
              <div class="thread-item ${unread>0?'unread':''}" data-action="open-thread-id" data-id="${t.id}" tabindex="0" role="button">
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
  // mark as read for me
  if (role==='buyer') t.unread_for_buyer = 0; else t.unread_for_seller = 0;

  return `
    <div class="chat-window">
      <div class="chat-header">
        <button class="btn ghost sm" data-action="back" aria-label="Geri"><i class="ph ph-arrow-left"></i></button>
        <div class="avatar">${esc(other?.avatar || '?')}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;">${esc(other?.name || '?')}</div>
          <div class="muted truncate" style="font-size:var(--fs-xs);">${esc(l?.title || '')}</div>
        </div>
        <button class="icon-btn" data-action="open-listing" data-id="${t.listing_id}" title="İlanı gör" aria-label="İlanı gör"><i class="ph ph-arrow-square-out"></i></button>
      </div>
      <div class="chat-msgs" id="chatMsgs">
        ${msgs.map(m => `
          <div class="msg-bubble ${m.from===meId?'out':'in'}">
            ${esc(m.text)}
            <span class="msg-time">${esc(m.time)}${m.from===meId?' <i class="ph ph-checks" style="font-size:0.85em;"></i>':''}</span>
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
          <input id="chatField" type="text" placeholder="Mesaj yazın..." aria-label="Mesaj">
        </div>
        <button class="btn primary" data-action="send-msg" data-thread="${threadId}" aria-label="Gönder"><i class="ph ph-paper-plane-tilt"></i></button>
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
    field.focus();
  }
}

/* ----- SELLER: My Listings --------------------------------------------- */
views.myListings = () => {
  const all = LISTINGS.filter(l => l.seller_id === State.userId);
  const filterMap = { all:'Tümü', active:'Aktif', pending:'Onayda', rejected:'Reddedildi' };
  const f = State.myListingsFilter;
  const mine = f === 'all' ? all : all.filter(l => l.status === f);
  const counts = {
    all:      all.length,
    active:   all.filter(l=>l.status==='active').length,
    pending:  all.filter(l=>l.status==='pending').length,
    rejected: all.filter(l=>l.status==='rejected').length,
  };

  return `
    <div class="row between mb-3">
      <div class="page-header" style="margin:0;">
        <h1>İlanlarım</h1>
        <div class="subtitle">${all.length} ilan · ${counts.active} aktif · ${counts.pending} onayda</div>
      </div>
      <button class="btn primary hide-mobile" data-action="nav" data-view="wizard"><i class="ph ph-plus"></i> Yeni İlan</button>
    </div>

    <div class="tabs">
      ${Object.entries(filterMap).map(([k,label])=>`
        <button class="tab ${f===k?'active':''}" data-action="my-listings-filter" data-val="${k}">${label} <span class="badge">${counts[k]||0}</span></button>
      `).join('')}
    </div>

    ${mine.length === 0 ? `
      <div class="empty">
        <i class="ph ph-stack"></i><h3>${f==='all'?'Henüz ilan yok':'Bu durumda ilan yok'}</h3>
        <p>${f==='all'?'İlk arsanızı 4 adımlık sihirbazla yayınlayın.':''}</p>
        ${f==='all'?`<button class="btn primary" data-action="nav" data-view="wizard"><i class="ph ph-plus"></i> Yeni İlan Ekle</button>`:''}
      </div>
    ` : `
      <div class="grid listings">${mine.map(l => `
        <article class="listing-card" data-action="open-listing" data-id="${l.id}" tabindex="0" role="link">
          <div class="listing-photo" style="background:linear-gradient(135deg, ${l.photo_color}, ${shade(l.photo_color,25)})">
            <div class="photo-label">${esc(l.photo_label||l.il)}</div>
            <div class="verified-badge" style="background:${l.status==='active'?'rgba(16,185,129,0.92)':l.status==='rejected'?'rgba(239,68,68,0.92)':'rgba(245,158,11,0.92)'}">
              <i class="ph ${l.status==='active'?'ph-check':l.status==='rejected'?'ph-x':'ph-clock'}"></i>${l.status==='active'?'Aktif':l.status==='rejected'?'Red':'Onayda'}
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
            <button class="btn sm ghost" data-action="delete-listing" data-id="${l.id}" aria-label="Sil"><i class="ph ph-trash"></i></button>
          </div>
        </article>
      `).join('')}</div>
    `}
  `;
};

/* ----- SELLER: New Listing Wizard -------------------------------------- */
function wizValidate(){
  const data = State.wizard.data;
  const step = State.wizard.step;
  const required = WIZARD_REQUIRED[step] || [];
  const errors = {};
  required.forEach(k => {
    const v = data[k];
    if (v === '' || v === null || v === undefined || (typeof v === 'number' && !v)) errors[k] = true;
  });
  State.wizard.errors = errors;
  return Object.keys(errors).length === 0;
}

views.wizard = () => {
  const w = State.wizard;
  const step = w.step;
  const err = w.errors || {};
  const errCls = k => err[k] ? 'style="border-color:var(--danger); background:var(--danger-fade);"' : '';

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
          <label>İl ${err.il?'<span style="color:var(--danger);">*</span>':''}</label>
          <div class="input" ${errCls('il')}><i class="ph ph-map-pin"></i>
            <select data-wiz="il">
              <option value="">Seçin...</option>
              ${IL_LIST.map(il => `<option value="${esc(il)}" ${w.data.il===il?'selected':''}>${esc(il)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>İlçe ${err.ilce?'<span style="color:var(--danger);">*</span>':''}</label>
          <div class="input" ${errCls('ilce')}><i class="ph ph-buildings"></i><input data-wiz="ilce" value="${esc(w.data.ilce)}" placeholder="örn. Kadıköy"></div>
        </div>
      </div>
      <div class="field">
        <label>Mahalle ${err.mahalle?'<span style="color:var(--danger);">*</span>':''}</label>
        <div class="input" ${errCls('mahalle')}><i class="ph ph-house"></i><input data-wiz="mahalle" value="${esc(w.data.mahalle)}" placeholder="örn. Moda"></div>
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
          <label>Alan (m²) ${err.alan?'<span style="color:var(--danger);">*</span>':''}</label>
          <div class="input" ${errCls('alan')}><i class="ph ph-ruler"></i><input data-wiz="alan" type="number" min="0" value="${w.data.alan||''}"></div>
        </div>
        <div class="field">
          <label>İmar ${err.imar?'<span style="color:var(--danger);">*</span>':''}</label>
          <div class="input" ${errCls('imar')}><i class="ph ph-buildings"></i>
            <select data-wiz="imar">
              <option value="">Seçin...</option>
              ${IMAR_LIST.map(im => `<option value="${esc(im)}" ${w.data.imar===im?'selected':''}>${esc(im)}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="field-row cols-2">
        <div class="field">
          <label>Tapu Türü ${err.tapu?'<span style="color:var(--danger);">*</span>':''}</label>
          <div class="input" ${errCls('tapu')}><i class="ph ph-shield-check"></i>
            <select data-wiz="tapu">
              <option value="">Seçin...</option>
              ${TAPU_LIST.map(t => `<option value="${esc(t)}" ${w.data.tapu===t?'selected':''}>${esc(t)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>TKGM Durumu ${err.tkgm?'<span style="color:var(--danger);">*</span>':''}</label>
          <div class="input" ${errCls('tkgm')}><i class="ph ph-file-text"></i>
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
          <div class="input"><i class="ph ph-arrows-horizontal"></i><input data-wiz="yol_cephesi" type="number" min="0" value="${w.data.yol_cephesi||''}"></div>
        </div>
        <div class="field">
          <label>Emsal</label>
          <div class="input"><i class="ph ph-arrows-vertical"></i><input data-wiz="emsal" type="number" step="0.01" min="0" value="${w.data.emsal||''}"></div>
        </div>
        <div class="field">
          <label>Kat Adedi</label>
          <div class="input"><i class="ph ph-stack"></i><input data-wiz="kat_adedi" type="number" min="0" value="${w.data.kat_adedi||''}"></div>
        </div>
      </div>
      <div class="field">
        <label>Fotoğraflar</label>
        <div class="upload-zone" data-action="photo-mock"><i class="ph ph-file-arrow-up"></i> <span>Fotoğraf ekle (demo)</span></div>
      </div>
    `;
  }
  else if (step === 2){
    const ai = aiPriceEstimate(w.data);
    body = `
      <h2>Fiyat ve Açıklama</h2>
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
        <label>Liste Fiyatı (₺) ${err.fiyat?'<span style="color:var(--danger);">*</span>':''}</label>
        <div class="input" ${errCls('fiyat')}><i class="ph ph-currency-circle-dollar"></i>
          <input data-wiz="fiyat" type="number" min="0" value="${w.data.fiyat||''}" placeholder="0">
        </div>
        ${w.data.fiyat && w.data.alan ? `<span class="help">m² birim fiyatı: <strong>${fmt(Math.round(w.data.fiyat/w.data.alan))} ₺</strong></span>` : ''}
      </div>

      <div class="field">
        <label>İlan Başlığı</label>
        <div class="row gap-2 mb-2">
          <button class="btn sm" data-action="ai-write-title"><i class="ph ph-sparkle"></i> AI ile üret</button>
        </div>
        <div class="input"><input data-wiz="title" value="${esc(w.data.title)}" placeholder="${esc(w.data.il||'')} ${esc(w.data.ilce||'')} ${esc(w.data.imar||'')} Arsası"></div>
      </div>

      <div class="field">
        <label>Açıklama</label>
        <div class="row gap-2 mb-2">
          <button class="btn sm" data-action="ai-write-desc"><i class="ph ph-sparkle"></i> AI ile yaz</button>
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
        <h3 class="mb-2">${esc(w.data.title || `${w.data.il} ${w.data.ilce} ${w.data.imar} Arsası`)}</h3>
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
        <button class="btn ghost" data-action="wiz-save-draft"><i class="ph ph-floppy-disk"></i> Taslak</button>
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
  const all = OFFERS.filter(o => myListingIds.includes(o.listing_id));
  const fmap = { all:'Tümü', pending:'Bekleyen', accepted:'Kabul', declined:'Reddedildi' };
  const f = State.offersFilter;
  const mine = f === 'all' ? all : all.filter(o => o.status === f);
  const counts = {
    all:      all.length,
    pending:  all.filter(o=>o.status==='pending').length,
    accepted: all.filter(o=>o.status==='accepted').length,
    declined: all.filter(o=>o.status==='declined').length,
  };

  function offerEl(o, withActions=true){
    const listing = listingById(o.listing_id);
    const aiBand = listing ? `${fmtTL(listing.ai_min)}–${fmtTL(listing.ai_max)}` : '';
    const aiDelta = listing ? Math.round(((o.amount - listing.fiyat) / listing.fiyat) * 100) : 0;
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
            <div class="muted" style="font-size:var(--fs-xs);">
              AI bandı: ${aiBand}
              ${listing ? ` · <span style="color:${aiDelta<0?'var(--danger)':'var(--success)'}">${aiDelta>=0?'+':''}${aiDelta}% liste</span>` : ''}
            </div>
          </div>
          ${listing ? `<button class="btn sm" data-action="open-listing" data-id="${listing.id}"><i class="ph ph-eye"></i></button>` : ''}
        </div>
        ${o.msg ? `<p style="margin:0; padding:var(--s-3); background:var(--surface-2); border-radius:var(--r-md); font-size:var(--fs-sm);">${esc(o.msg)}</p>` : ''}
        ${withActions && o.status==='pending' ? `
          <div class="offer-actions">
            <button class="btn success" data-action="offer-accept" data-id="${o.id}"><i class="ph ph-check"></i> Kabul</button>
            <button class="btn danger"  data-action="offer-decline" data-id="${o.id}"><i class="ph ph-x"></i> Reddet</button>
            <button class="btn" data-action="offer-counter" data-id="${o.id}"><i class="ph ph-arrows-counter-clockwise"></i> Karşı</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  return `
    <div class="page-header">
      <h1>Gelen Teklifler</h1>
      <div class="subtitle">${counts.pending} bekleyen · ${counts.accepted} kabul · ${counts.declined} red</div>
    </div>

    <div class="tabs">
      ${Object.entries(fmap).map(([k,label])=>`
        <button class="tab ${f===k?'active':''}" data-action="offers-filter" data-val="${k}">${label} <span class="badge">${counts[k]||0}</span></button>
      `).join('')}
    </div>

    ${mine.length===0 ? `<div class="empty"><i class="ph ph-handshake"></i><h3>Bu kategoride teklif yok</h3></div>` : `
      <div class="col gap-3">${mine.map(o => offerEl(o, true)).join('')}</div>
    `}
  `;
};

/* ----- SELLER: Performance --------------------------------------------- */
views.performance = () => {
  const p = PERFORMANCE[State.userId] || PERFORMANCE.U002;
  const r = State.perfRange;
  const slice = arr => arr.slice(-r);
  const totalViews = slice(p.views).reduce((a,b)=>a+b,0);
  const totalFavs  = slice(p.favs).reduce((a,b)=>a+b,0);
  const totalInq   = slice(p.inquiries).reduce((a,b)=>a+b,0);
  const conv = totalViews ? ((totalInq/totalViews)*100).toFixed(1) : '0';

  return `
    <div class="row between mb-3">
      <div class="page-header" style="margin:0;">
        <h1>Performans</h1>
        <div class="subtitle">Son ${r} günün özeti</div>
      </div>
      <div class="row gap-2">
        ${[7,14,30].map(n=>`<button class="chip ${r===n?'active':''}" data-action="set-perf-range" data-val="${n}">${n}g</button>`).join('')}
      </div>
    </div>

    <div class="kpi-grid mb-4">
      ${kpiCard('Görüntülenme', fmt(totalViews), 'ph-eye', '+12%')}
      ${kpiCard('Favori', fmt(totalFavs), 'ph-heart', '+8%')}
      ${kpiCard('Mesaj/Teklif', fmt(totalInq), 'ph-chat-circle', '+5%')}
      ${kpiCard('Dönüşüm', '%' + conv, 'ph-trend-up', '+0.3pp')}
    </div>

    <div class="card mb-3">
      <h3 class="mb-3">Günlük Görüntülenme</h3>
      ${sparkSvg(slice(p.views), 'var(--primary)')}
    </div>
    <div class="card mb-3">
      <h3 class="mb-3">Favori Eklenmesi</h3>
      ${sparkSvg(slice(p.favs), 'var(--success)')}
    </div>
    <div class="card">
      <h3 class="mb-3">Mesaj / Teklif</h3>
      ${sparkSvg(slice(p.inquiries), 'var(--warning)')}
    </div>

    <h3 class="mt-4 mb-3">En İyi İlanlar</h3>
    <div class="grid listings">
      ${LISTINGS.filter(l => l.seller_id===State.userId && l.status==='active').sort((a,b)=>b.views-a.views).slice(0,3).map(l => listingCard(l, {seller:true})).join('')}
    </div>
  `;
};

function kpiCard(label, value, icon, trend){
  return `
    <div class="kpi">
      <div class="kpi-icon"><i class="ph ${icon}"></i></div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}</div>
      ${trend?`<div class="kpi-trend"><i class="ph ph-trend-up"></i>${trend}</div>`:''}
    </div>
  `;
}

function sparkSvg(arr, color){
  if (!arr || !arr.length) return '';
  const w = 100, h = 30;
  const max = Math.max(...arr, 1);
  const step = w / Math.max(1,(arr.length - 1));
  const pts = arr.map((v,i) => `${(i*step).toFixed(1)},${(h - (v/max)*h*0.9 - 1).toFixed(1)}`).join(' ');
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return `
    <svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polygon points="${area}" fill="${color}" opacity="0.18"/>
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `;
}

// Pie chart (basic SVG)
function pieSvg(segments, size=160){
  // segments: [{label, value, color}]
  const total = segments.reduce((s,x)=>s+x.value, 0) || 1;
  let acc = 0;
  const r = size/2 - 4;
  const cx = size/2, cy = size/2;
  const paths = segments.map(s => {
    const start = acc / total * Math.PI * 2 - Math.PI/2;
    acc += s.value;
    const end   = acc / total * Math.PI * 2 - Math.PI/2;
    const x1 = cx + Math.cos(start)*r, y1 = cy + Math.sin(start)*r;
    const x2 = cx + Math.cos(end)*r,   y2 = cy + Math.sin(end)*r;
    const large = (end - start) > Math.PI ? 1 : 0;
    return `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${s.color}"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${paths}</svg>`;
}

/* ----- ADMIN: Approval Queue ------------------------------------------- */
views.approval = () => {
  const all = PENDING_QUEUE();
  const f = State.approvalFilter;
  const queue = f==='all' ? all : all.filter(l => l.ai_risk === f);
  const counts = {
    all: all.length,
    low: all.filter(l=>l.ai_risk==='low').length,
    medium: all.filter(l=>l.ai_risk==='medium').length,
    high: all.filter(l=>l.ai_risk==='high').length,
  };
  return `
    <div class="page-header">
      <h1>Onay Kuyruğu</h1>
      <div class="subtitle">${all.length} ilan beklemede · ${counts.high} yüksek risk</div>
    </div>

    <div class="tabs">
      <button class="tab ${f==='all'?'active':''}" data-action="approval-filter" data-val="all">Tümü <span class="badge">${counts.all}</span></button>
      <button class="tab ${f==='low'?'active':''}" data-action="approval-filter" data-val="low">Düşük <span class="badge">${counts.low}</span></button>
      <button class="tab ${f==='medium'?'active':''}" data-action="approval-filter" data-val="medium">Orta <span class="badge">${counts.medium}</span></button>
      <button class="tab ${f==='high'?'active':''}" data-action="approval-filter" data-val="high">Yüksek <span class="badge">${counts.high}</span></button>
    </div>

    ${queue.length === 0 ? `<div class="empty"><i class="ph ph-shield-check"></i><h3>Bu filtrede ilan yok</h3></div>` : `
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
                  <div class="row gap-2 mt-2" style="flex-wrap:wrap;">
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
                <button class="btn" data-action="approval-detail" data-id="${l.id}"><i class="ph ph-eye"></i> İncele</button>
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
  const f = State.usersFilter;
  const users = f==='all' ? USERS : USERS.filter(u => u.role === f);

  return `
    <div class="page-header">
      <h1>Kullanıcılar</h1>
      <div class="subtitle">${USERS.length} kayıtlı kullanıcı</div>
    </div>

    <div class="chips mb-3" role="tablist">
      ${['all','buyer','seller','admin'].map(k=>`
        <button class="chip ${f===k?'active':''}" data-action="user-filter" data-val="${k}">
          ${k==='all'?'Tümü':rolLabel(k)}
        </button>
      `).join('')}
    </div>

    <div class="card flush">
      ${users.length===0 ? `<div class="empty"><i class="ph ph-users-three"></i><h3>Kullanıcı yok</h3></div>` :
        users.map(u => `
          <div class="user-row">
            <div class="avatar">${esc(u.avatar)}</div>
            <div>
              <div style="font-weight:600;">${esc(u.name)} ${u.verified ? '<i class="ph ph-seal-check" style="color:var(--success);"></i>' : ''}</div>
              <div class="user-meta">${esc(u.email)} · ${esc(u.phone || '—')}</div>
            </div>
            <span class="badge ${u.role==='admin'?'primary':u.role==='seller'?'success':''}">${rolLabel(u.role)}</span>
            <span class="badge hide-mobile">${esc(u.badge || '—')}</span>
            <span class="badge hide-mobile">${esc(u.joined)}</span>
            <button class="icon-btn" data-action="user-action" data-id="${u.id}" title="İşlemler" aria-label="İşlemler"><i class="ph ph-dots-three-vertical"></i></button>
          </div>
        `).join('')
      }
    </div>
  `;
};

/* ----- ADMIN: Reports -------------------------------------------------- */
views.reports = () => {
  const m = PLATFORM_METRICS;
  // İmar dağılımı
  const imarCounts = {};
  LISTINGS.forEach(l => imarCounts[l.imar] = (imarCounts[l.imar]||0) + 1);
  const palette = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#ec4899'];
  const imarSegments = Object.entries(imarCounts).map(([k,v],i)=>({label:k, value:v, color:palette[i%palette.length]}));

  // Status dağılımı
  const statusCounts = {};
  LISTINGS.forEach(l => statusCounts[l.status] = (statusCounts[l.status]||0) + 1);
  const statusLabel = { active:'Aktif', pending:'Onayda', rejected:'Reddedildi' };
  const statusColors = { active:'var(--success)', pending:'var(--warning)', rejected:'var(--danger)' };
  const statusSegments = Object.entries(statusCounts).map(([k,v])=>({label:statusLabel[k]||k, value:v, color:statusColors[k]||'var(--primary)'}));

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

    <div class="grid-2 mb-4">
      <div class="card">
        <h3 class="mb-3">İmar Türü Dağılımı</h3>
        <div class="row gap-3" style="align-items:center;flex-wrap:wrap;">
          <div>${pieSvg(imarSegments, 140)}</div>
          <div class="col gap-2" style="flex:1; min-width:120px;">
            ${imarSegments.map(s => `
              <div class="row gap-2" style="font-size:var(--fs-xs);">
                <span style="width:10px;height:10px;background:${s.color};border-radius:2px;display:inline-block;"></span>
                <span style="flex:1;">${esc(s.label)}</span>
                <span class="muted">${s.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="mb-3">Onay Durumu</h3>
        <div class="row gap-3" style="align-items:center;flex-wrap:wrap;">
          <div>${pieSvg(statusSegments, 140)}</div>
          <div class="col gap-2" style="flex:1; min-width:120px;">
            ${statusSegments.map(s => `
              <div class="row gap-2" style="font-size:var(--fs-xs);">
                <span style="width:10px;height:10px;background:${s.color};border-radius:2px;display:inline-block;"></span>
                <span style="flex:1;">${esc(s.label)}</span>
                <span class="muted">${s.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
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
      <div class="row gap-2 mt-3">
        <button class="btn" data-action="edit-profile"><i class="ph ph-pencil"></i> Düzenle</button>
        <button class="btn ghost" data-action="theme"><i class="ph ph-palette"></i> Tema</button>
      </div>
    </div>

    <div class="card mt-3">
      <h3 class="mb-2">Hesap</h3>
      <div class="col gap-2">
        <button class="btn ghost" data-action="settings-mock"><i class="ph ph-bell"></i> Bildirim ayarları</button>
        <button class="btn ghost" data-action="settings-mock"><i class="ph ph-lock-key"></i> Güvenlik</button>
        <button class="btn ghost" data-action="settings-mock"><i class="ph ph-scales"></i> KVKK / Çerezler</button>
        <button class="btn ghost" data-action="settings-mock" style="color:var(--danger);"><i class="ph ph-sign-out"></i> Çıkış Yap</button>
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
      Render.view();
      Toast.show(isFav(id) ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı', '', 'ph-heart');
      break;
    }
    case 'clear-favs':
      State.favs[State.userId] = [];
      Render.view();
      Toast.show('Favoriler temizlendi', '', 'ph-broom');
      break;
    case 'clear-search':
      State.filters.q = '';
      Render.view();
      break;
    case 'clear-all-filters':
      State.filters = { q:'', il:'', imar:'', tkgm:'', fiyat_max:0, alan_min:0, tag_hint:'', sort:'newest' };
      Render.view();
      break;
    case 'filter': {
      const k = target.dataset.key;
      State.filters[k] = State.filters[k] === target.dataset.val ? '' : target.dataset.val;
      Render.view();
      break;
    }
    case 'photo-prev': {
      State.photoIdx = Math.max(0, (State.photoIdx||0) - 1);
      Render.view();
      break;
    }
    case 'photo-next': {
      State.photoIdx = Math.min(3, (State.photoIdx||0) + 1);
      Render.view();
      break;
    }
    case 'photo-go':
      State.photoIdx = +target.dataset.i;
      Render.view();
      break;
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
        <div class="card mt-2 mb-3" style="background:var(--surface-2);">
          <div class="row between"><span class="muted">Liste fiyatı</span><strong>${fmtTLFull(l.fiyat)}</strong></div>
          <div class="row between"><span class="muted">AI bandı</span><span>${fmtTL(l.ai_min)} – ${fmtTL(l.ai_max)}</span></div>
        </div>
        <div class="field">
          <label>Teklif Tutarı (₺)</label>
          <div class="input"><i class="ph ph-currency-circle-dollar"></i><input id="offerAmount" type="number" min="0" value="${Math.round(l.fiyat*0.95)}"></div>
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
    case 'offer-counter': {
      const o = OFFERS.find(x=>x.id===target.dataset.id);
      const l = listingById(o.listing_id);
      Sheet.open(`
        <h3>Karşı Teklif</h3>
        <p class="muted">${esc(o.listing_title)} · ${esc(o.buyer_name)}</p>
        <div class="card mt-2 mb-3" style="background:var(--surface-2);">
          <div class="row between"><span class="muted">Liste fiyatı</span><strong>${fmtTLFull(l?.fiyat||0)}</strong></div>
          <div class="row between"><span class="muted">Alıcı teklifi</span><strong>${fmtTLFull(o.amount)}</strong></div>
        </div>
        <div class="field">
          <label>Karşı Teklif Tutarı (₺)</label>
          <div class="input"><i class="ph ph-currency-circle-dollar"></i><input id="counterAmount" type="number" value="${Math.round(((l?.fiyat||0)+o.amount)/2)}"></div>
        </div>
        <div class="field">
          <label>Mesaj</label>
          <div class="input"><textarea id="counterMsg" rows="3" placeholder="Karşı teklifin gerekçesi..."></textarea></div>
        </div>
        <div class="row gap-2 mt-3">
          <button class="btn" data-action="sheet-close">İptal</button>
          <button class="btn primary" style="flex:1;" data-action="submit-counter" data-id="${o.id}"><i class="ph ph-arrows-counter-clockwise"></i> Karşı Teklifi Gönder</button>
        </div>
      `);
      break;
    }
    case 'submit-counter': {
      const o = OFFERS.find(x=>x.id===target.dataset.id);
      const amt = parseInt($('#counterAmount').value || '0');
      const msg = $('#counterMsg').value || '';
      // Eski teklifi declined'a çek, yeni karşı teklif ekle (alıcı için pending)
      if (o){
        o.status = 'countered';
        OFFERS.push({
          id:'O' + (OFFERS.length+100), listing_id:o.listing_id, listing_title:o.listing_title,
          buyer_id:o.buyer_id, buyer_name:o.buyer_name + ' (karşı)', amount:amt,
          status:'pending', date:new Date().toISOString().slice(0,10), msg:`Karşı teklif: ${msg}`
        });
      }
      Sheet.close();
      Toast.show(`Karşı teklif iletildi: ${fmtTLFull(amt)}`, 'success', 'ph-arrows-counter-clockwise');
      Render.view();
      break;
    }
    case 'wiz-prev':
      if (State.wizard.step > 0){ State.wizard.step--; State.wizard.errors = {}; }
      Render.view();
      break;
    case 'wiz-next':
      if (!wizValidate()){
        Toast.show('Gerekli alanları doldurun', 'danger', 'ph-warning');
        Render.view();
        break;
      }
      if (State.wizard.step < WIZARD_STEPS.length-1) State.wizard.step++;
      State.wizard.errors = {};
      Render.view();
      break;
    case 'wiz-save-draft':
      Toast.show('Taslak hafızaya kaydedildi (oturum sonuna kadar)', '', 'ph-floppy-disk');
      break;
    case 'wiz-publish': {
      // tüm önceki adımları doğrula
      let valid = true;
      for (let s=0; s<WIZARD_STEPS.length; s++){
        State.wizard.step = s;
        if (!wizValidate()){ valid=false; break; }
      }
      if (!valid){
        Toast.show('Tüm gerekli alanları doldurun', 'danger', 'ph-warning');
        Render.view();
        break;
      }
      const d = State.wizard.data;
      const newId = 'L' + (LISTINGS.length + 100);
      LISTINGS.unshift({
        id:newId,
        title: d.title || `${d.il} ${d.ilce} ${d.imar} Arsası`,
        il:d.il, ilce:d.ilce, mahalle:d.mahalle, ada:d.ada||'-', parsel:d.parsel||'-',
        alan:+d.alan||0, fiyat:+d.fiyat||0, fiyat_m2:+d.alan?Math.round(+d.fiyat/+d.alan):0,
        imar:d.imar, tapu:d.tapu, tkgm:d.tkgm, emsal:+d.emsal||0,
        yol_cephesi:+d.yol_cephesi||0, kat_adedi:+d.kat_adedi||0,
        status:'pending', verified:false, seller_id:State.userId,
        views:0, favs:0, inquiries:0,
        ai_min:Math.round((+d.fiyat||0)*0.92), ai_max:Math.round((+d.fiyat||0)*1.08), ai_trend:8, ai_risk:'medium', ai_risk_score:40,
        created:new Date().toISOString().slice(0,10),
        desc:d.desc, photo_color:'#1a3a5c', photo_label:d.ilce||d.il, tags:[]
      });
      State.wizard = { step:0, errors:{}, data:{ il:'', ilce:'', mahalle:'', ada:'', parsel:'', alan:0, imar:'', tapu:'', tkgm:'', yol_cephesi:0, emsal:0, kat_adedi:0, fiyat:0, desc:'', tags:[], title:'' } };
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
    case 'ai-write-title': {
      const d = State.wizard.data;
      const parts = [d.ilce || d.il, d.imar, 'Arsa'];
      State.wizard.data.title = parts.filter(Boolean).join(' ') + (d.emsal>1.5?' (Yüksek Emsal)':'');
      Toast.show('AI başlık üretti', '', 'ph-sparkle');
      Render.view();
      break;
    }
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
    case 'approval-detail': {
      const l = listingById(target.dataset.id);
      const seller = USERS.find(u => u.id === l.seller_id);
      Sheet.open(`
        <h3>İnceleme — ${esc(l.title)}</h3>
        <div class="card mt-3" style="background:var(--surface-2);">
          <div class="row between mb-2"><span class="muted">Satıcı</span><span>${esc(seller?.name || '?')} ${seller?.verified ? '<i class="ph ph-seal-check" style="color:var(--success);"></i>' : '<span class="badge warning">Doğrulanmamış</span>'}</span></div>
          <div class="row between mb-2"><span class="muted">Konum</span><span>${esc(l.mahalle)}, ${esc(l.ilce)}, ${esc(l.il)}</span></div>
          <div class="row between mb-2"><span class="muted">Alan</span><span>${fmtAlan(l.alan)}</span></div>
          <div class="row between mb-2"><span class="muted">İmar</span><span>${esc(l.imar)} (E:${l.emsal})</span></div>
          <div class="row between mb-2"><span class="muted">Fiyat</span><span>${fmtTLFull(l.fiyat)}</span></div>
          <div class="row between mb-2"><span class="muted">AI bandı</span><span>${fmtTL(l.ai_min)} – ${fmtTL(l.ai_max)}</span></div>
          <div class="row between mb-2"><span class="muted">TKGM</span><span>${esc(l.tkgm)}</span></div>
        </div>
        <div class="ai-card mt-3">
          <div class="ai-label"><i class="ph ph-sparkle"></i> AI Risk Değerlendirmesi</div>
          <div class="row gap-2 mb-2"><span class="badge risk-${l.ai_risk}">${l.ai_risk==='high'?'Yüksek':l.ai_risk==='medium'?'Orta':'Düşük'} (${l.ai_risk_score})</span></div>
          ${l.ai_risk_reason ? `<p style="margin:0;">${esc(l.ai_risk_reason)}</p>` : '<p class="muted" style="margin:0;">Risk gerekçesi bulunamadı.</p>'}
        </div>
        <div class="row gap-2 mt-3">
          <button class="btn success" style="flex:1;" data-action="approve" data-id="${l.id}"><i class="ph ph-check"></i> Onayla</button>
          <button class="btn danger" style="flex:1;" data-action="reject" data-id="${l.id}"><i class="ph ph-x"></i> Reddet</button>
        </div>
      `);
      break;
    }
    case 'approval-filter':
      State.approvalFilter = target.dataset.val;
      Render.view();
      break;
    case 'edit-listing':
      Toast.show('İlan düzenleme yakında (demo)', '', 'ph-info');
      break;
    case 'delete-listing': {
      const id = target.dataset.id;
      const idx = LISTINGS.findIndex(l=>l.id===id);
      if (idx>=0){ LISTINGS.splice(idx,1); Toast.show('İlan silindi', '', 'ph-trash'); Render.view(); }
      break;
    }
    case 'boost':
      Toast.show('İlan öne çıkarıldı (24 sa)', 'success', 'ph-rocket-launch');
      break;
    case 'my-listings-filter':
      State.myListingsFilter = target.dataset.val;
      Render.view();
      break;
    case 'offers-filter':
      State.offersFilter = target.dataset.val;
      Render.view();
      break;
    case 'user-filter':
      State.usersFilter = target.dataset.val;
      Render.view();
      break;
    case 'user-action':
      Toast.show('Kullanıcı işlem menüsü yakında (demo)', '', 'ph-info');
      break;
    case 'set-perf-range':
      State.perfRange = +target.dataset.val;
      Render.view();
      break;
    case 'open-filter-sheet': {
      const f = State.filters;
      Sheet.open(`
        <h3>Detaylı Filtre</h3>
        <div class="field">
          <label>İl</label>
          <div class="input"><i class="ph ph-map-pin"></i>
            <select id="ff-il">
              <option value="">Tümü</option>
              ${IL_LIST.map(il=>`<option value="${esc(il)}" ${f.il===il?'selected':''}>${esc(il)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>İmar</label>
          <div class="input"><i class="ph ph-buildings"></i>
            <select id="ff-imar">
              <option value="">Tümü</option>
              ${IMAR_LIST.map(im=>`<option value="${esc(im)}" ${f.imar===im?'selected':''}>${esc(im)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Tapu Durumu (TKGM)</label>
          <div class="input"><i class="ph ph-file-text"></i>
            <select id="ff-tkgm">
              <option value="">Tümü</option>
              ${TKGM_LIST.map(t=>`<option value="${esc(t)}" ${f.tkgm===t?'selected':''}>${esc(t)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field-row cols-2">
          <div class="field">
            <label>Maks. Fiyat (₺)</label>
            <div class="input"><i class="ph ph-currency-circle-dollar"></i><input id="ff-fiyat" type="number" min="0" value="${f.fiyat_max||''}" placeholder="Sınırsız"></div>
          </div>
          <div class="field">
            <label>Min. Alan (m²)</label>
            <div class="input"><i class="ph ph-ruler"></i><input id="ff-alan" type="number" min="0" value="${f.alan_min||''}" placeholder="0"></div>
          </div>
        </div>
        <div class="row gap-2 mt-3">
          <button class="btn" data-action="filter-reset">Sıfırla</button>
          <button class="btn primary" style="flex:1;" data-action="filter-apply"><i class="ph ph-check"></i> Uygula</button>
        </div>
      `);
      break;
    }
    case 'filter-apply':
      State.filters.il = $('#ff-il').value;
      State.filters.imar = $('#ff-imar').value;
      State.filters.tkgm = $('#ff-tkgm').value;
      State.filters.fiyat_max = parseInt($('#ff-fiyat').value||'0');
      State.filters.alan_min = parseInt($('#ff-alan').value||'0');
      Sheet.close();
      Render.view();
      Toast.show('Filtre uygulandı', '', 'ph-funnel');
      break;
    case 'filter-reset':
      State.filters = { q:'', il:'', imar:'', tkgm:'', fiyat_max:0, alan_min:0, tag_hint:'', sort:'newest' };
      Sheet.close();
      Render.view();
      break;
    case 'copy-coords': {
      const txt = `${target.dataset.ilce}, ${target.dataset.il}`;
      navigator.clipboard?.writeText(txt).then(()=>Toast.show('Konum kopyalandı', '', 'ph-copy'));
      break;
    }
    case 'share': {
      const id = target.dataset.id;
      const url = location.origin + location.pathname + '#listing/' + id;
      navigator.clipboard?.writeText(url).then(()=>Toast.show('Bağlantı kopyalandı', '', 'ph-share-network'));
      break;
    }
    case 'report':
      Sheet.open(`
        <h3>Şikayet Et</h3>
        <p class="muted">Bu ilanı neden şikayet ediyorsunuz?</p>
        <div class="col gap-2">
          ${['Yanlış bilgi','Sahte ilan','Yasak içerik','Çift kayıt','Diğer'].map(r=>`
            <button class="btn block" data-action="submit-report" data-reason="${esc(r)}">${esc(r)}</button>
          `).join('')}
        </div>
      `);
      break;
    case 'submit-report':
      Sheet.close();
      Toast.show('Şikayetiniz alındı', 'success', 'ph-flag');
      break;
    case 'edit-profile':
      Toast.show('Profil düzenleme yakında (demo)', '', 'ph-info');
      break;
    case 'settings-mock':
      Toast.show('Demo modu — bu ekran henüz aktif değil', '', 'ph-info');
      break;
    case 'photo-mock':
      Toast.show('Foto yükleme demo modunda kapalı', '', 'ph-image');
      break;
    case 'set-sort':
      // handled by change listener
      break;
    case 'toggle-compare': {
      e.stopPropagation();
      const id = target.dataset.id;
      const i = State.compare.indexOf(id);
      if (i>=0) State.compare.splice(i,1);
      else if (State.compare.length < 3) State.compare.push(id);
      else { Toast.show('En fazla 3 ilan karşılaştırılabilir', 'danger', 'ph-warning'); break; }
      Render.view();
      break;
    }
    case 'clear-compare':
      State.compare = [];
      Render.view();
      Toast.show('Karşılaştırma seçimi temizlendi', '', 'ph-broom');
      break;
    case 'dismiss-tip':
      State.tipsDismissed[target.dataset.key] = true;
      Render.view();
      break;
    case 'mark-all-read':
      (NOTIFICATIONS[State.role] || []).forEach(n => n.read = true);
      Render.view();
      Toast.show('Tüm bildirimler okundu işaretlendi', '', 'ph-check-double');
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
  if (e.target.matches('[data-action="set-sort"]')){
    State.filters.sort = e.target.value;
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

/* Notif btn → tam sayfa bildirimler */
$('#notifBtn').addEventListener('click', () => {
  Router.go('notifications');
});

/* Desktop header global search */
document.body.addEventListener('input', e => {
  if (e.target.id === 'headerSearch'){
    const q = e.target.value.trim().toLowerCase();
    State.globalSearch = q;
    const dd = $('#headerSearchDD');
    if (!q){ if (dd) dd.style.display='none'; return; }
    const hits = LISTINGS.filter(l => l.status==='active').filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.il.toLowerCase().includes(q) ||
      l.ilce.toLowerCase().includes(q) ||
      l.imar.toLowerCase().includes(q)
    ).slice(0,6);
    if (dd){
      dd.innerHTML = hits.length === 0
        ? '<div class="dd-empty">Sonuç yok</div>'
        : hits.map(l => `
            <div class="dd-item" data-action="open-listing" data-id="${l.id}">
              <div class="avatar sm" style="background:${l.photo_color};">${esc((l.il||'?')[0])}</div>
              <div style="flex:1;min-width:0;">
                <div class="truncate">${esc(l.title)}</div>
                <div class="muted" style="font-size:var(--fs-xs);">${esc(l.ilce)}, ${esc(l.il)} · ${fmtTL(l.fiyat)}</div>
              </div>
            </div>
          `).join('');
      dd.style.display = 'block';
    }
  }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.header-search-wrap')){
    const dd = $('#headerSearchDD');
    if (dd) dd.style.display='none';
  }
});

/* Initial route */
(function init(){
  const r = Router.fromHash();
  if (r){ State.view = r.view; State.params = r.params; }
  else State.view = DEFAULT_VIEW[State.role];
  Render.view();
})();
