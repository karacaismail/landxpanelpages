// LandX — Sample Data (Frontend Only, In-Memory)
// Tüm veriler runtime'da değiştirilebilir. Sayfa yenilenince sıfırlanır.

const USERS = [
  { id:'U001', role:'buyer',  name:'Mert Aydın',     email:'mert@email.com',   avatar:'MA', phone:'0532 111 22 33', verified:true,  joined:'2024-09-12' },
  { id:'U002', role:'seller', name:'Ahmet Koç',      email:'ahmet@emlak.com',  avatar:'AK', phone:'0533 222 33 44', verified:true,  badge:'Lisanslı Emlakçı', listings:5, joined:'2023-11-04' },
  { id:'U003', role:'seller', name:'Fatma Demir',    email:'fatma@email.com',  avatar:'FD', phone:'0534 333 44 55', verified:true,  badge:'Bireysel Satıcı',  listings:4, joined:'2024-02-19' },
  { id:'U004', role:'admin',  name:'Platform Admin', email:'admin@landx.com',  avatar:'LX', phone:'',               verified:true,  joined:'2023-06-01' },
  { id:'U005', role:'buyer',  name:'Selin Çelik',    email:'selin@email.com',  avatar:'SC', phone:'0535 444 55 66', verified:false, joined:'2025-01-22' },
  { id:'U006', role:'buyer',  name:'Cem Yılmaz',     email:'cem@email.com',    avatar:'CY', phone:'0536 555 66 77', verified:true,  joined:'2024-11-08' },
  { id:'U007', role:'seller', name:'Burak Şahin',    email:'burak@emlak.com',  avatar:'BŞ', phone:'0537 666 77 88', verified:false, badge:'Lisanslı Emlakçı', listings:1, joined:'2025-05-01' },
];

// Bu seans için aktif kullanıcı eşleştirmesi
const ACTIVE_USER_PER_ROLE = {
  buyer:  'U001',
  seller: 'U002',
  admin:  'U004',
};

const LISTINGS = [
  { id:'L001', title:'Kadıköy Merkezde Konut İmarlı Arsa',
    il:'İstanbul', ilce:'Kadıköy', mahalle:'Moda',
    ada:'245', parsel:'12', alan:450, fiyat:4500000, fiyat_m2:10000,
    imar:'Konut', tapu:'Müstakil', tkgm:'Temiz', emsal:2.07,
    yol_cephesi:12, kat_adedi:6, status:'active', verified:true,
    seller_id:'U002', views:342, favs:28, inquiries:7,
    ai_min:4200000, ai_max:4800000, ai_trend:12, ai_risk:'low', ai_risk_score:18,
    created:'2025-04-15',
    desc:'Kadıköy Moda bölgesinde nadir bulunan müstakil tapulu arsa. Bölgenin en prestijli konumlarından birinde, yürüme mesafesinde deniz manzaralı proje geliştirmeye elverişli.',
    photo_color:'#1a3a5c', photo_label:'Kadıköy',
    tags:['Müstakil Tapu','İmarlı','Denize Yakın','Metro 800m'] },
  { id:'L002', title:'Bolu Abant Gölü Yakını Tarım Arazisi',
    il:'Bolu', ilce:'Merkez', mahalle:'Abant',
    ada:'112', parsel:'4', alan:25000, fiyat:1250000, fiyat_m2:50,
    imar:'Tarım', tapu:'Hisseli', tkgm:'Temiz', emsal:0,
    yol_cephesi:40, kat_adedi:0, status:'active', verified:true,
    seller_id:'U003', views:89, favs:12, inquiries:3,
    ai_min:1100000, ai_max:1400000, ai_trend:8, ai_risk:'medium', ai_risk_score:42,
    created:'2025-04-20',
    desc:'Abant Gölü manzaralı, ormana sınır büyük tarım arazisi. Ekoturizm ve organik tarım projeleri için ideal konum.',
    photo_color:'#1a4a2a', photo_label:'Bolu',
    tags:['Tarım','Göl Manzarası','Büyük Parsel','Yatırımlık'] },
  { id:'L003', title:'Karşıyaka Ticari Arsa — E:3.00',
    il:'İzmir', ilce:'Karşıyaka', mahalle:'Atakent',
    ada:'88', parsel:'7', alan:320, fiyat:2200000, fiyat_m2:6875,
    imar:'Ticari', tapu:'Müstakil', tkgm:'Temiz', emsal:3.00,
    yol_cephesi:18, kat_adedi:8, status:'active', verified:true,
    seller_id:'U002', views:215, favs:19, inquiries:11,
    ai_min:2100000, ai_max:2500000, ai_trend:15, ai_risk:'low', ai_risk_score:22,
    created:'2025-03-10',
    desc:"Karşıyaka'nın en işlek caddesine cepheli ticari arsa. Yüksek emsali ve çift cephe avantajıyla mükemmel ticari proje potansiyeli.",
    photo_color:'#2a1a4a', photo_label:'İzmir',
    tags:['Ticari İmar','Yüksek Emsal','Ana Cadde','Metro Yakın'] },
  { id:'L004', title:'Antalya Konyaaltı Sanayi Arsası',
    il:'Antalya', ilce:'Konyaaltı', mahalle:'Hurma',
    ada:'55', parsel:'3', alan:1800, fiyat:3600000, fiyat_m2:2000,
    imar:'Sanayi', tapu:'Müstakil', tkgm:'İpotekli', emsal:1.00,
    yol_cephesi:30, kat_adedi:0, status:'pending', verified:false,
    seller_id:'U003', views:0, favs:0, inquiries:0,
    ai_min:3400000, ai_max:3900000, ai_trend:6, ai_risk:'high', ai_risk_score:71,
    ai_risk_reason:'TKGM ipotek kaydı tespit edildi; satıcı doğrulaması yok.',
    created:'2025-05-10',
    desc:'Konyaaltı Sanayi Bölgesi içinde, organize sanayi yakınında büyük parsel. Lojistik ve depo yatırımı için uygun.',
    photo_color:'#4a3a1a', photo_label:'Antalya',
    tags:['Sanayi İmar','Geniş Parsel','Lojistik','OSB Yakın'] },
  { id:'L005', title:'Çankaya Prestijli Konut Arsası',
    il:'Ankara', ilce:'Çankaya', mahalle:'Oran',
    ada:'301', parsel:'22', alan:680, fiyat:6800000, fiyat_m2:10000,
    imar:'Konut', tapu:'Müstakil', tkgm:'Temiz', emsal:1.80,
    yol_cephesi:20, kat_adedi:5, status:'active', verified:true,
    seller_id:'U002', views:178, favs:22, inquiries:5,
    ai_min:6500000, ai_max:7200000, ai_trend:9, ai_risk:'low', ai_risk_score:15,
    created:'2025-04-01',
    desc:"Ankara'nın en prestijli semtlerinden Oran'da köşe parsel. Büyükelçilikler bölgesine yakın, sakin ve güvenli ortam.",
    photo_color:'#1a2a4a', photo_label:'Ankara',
    tags:['Köşe Parsel','Prestijli','Sakin Bölge','Temiz Tapu'] },
  { id:'L006', title:'Bursa Nilüfer Konut İmarlı Arsa',
    il:'Bursa', ilce:'Nilüfer', mahalle:'Görükle',
    ada:'78', parsel:'5', alan:550, fiyat:2750000, fiyat_m2:5000,
    imar:'Konut', tapu:'Kat İrtifakı', tkgm:'Temiz', emsal:2.50,
    yol_cephesi:16, kat_adedi:7, status:'active', verified:true,
    seller_id:'U003', views:134, favs:15, inquiries:4,
    ai_min:2600000, ai_max:3000000, ai_trend:11, ai_risk:'low', ai_risk_score:28,
    created:'2025-03-25',
    desc:"Uludağ Üniversitesi çevresinde, Nilüfer'in gelişen bölgesinde yüksek yapılaşma imarlı arsa. Kira garantili proje için ideal.",
    photo_color:'#1a4a3a', photo_label:'Bursa',
    tags:['Yüksek Emsal','Üniversite Yakın','Gelişen Bölge'] },
  { id:'L007', title:'Muğla Bodrum Turistik Tesis Arsası',
    il:'Muğla', ilce:'Bodrum', mahalle:'Yalıkavak',
    ada:'14', parsel:'9', alan:3200, fiyat:19200000, fiyat_m2:6000,
    imar:'Turizm', tapu:'Müstakil', tkgm:'Temiz', emsal:0.30,
    yol_cephesi:45, kat_adedi:2, status:'active', verified:true,
    seller_id:'U002', views:421, favs:67, inquiries:18,
    ai_min:18000000, ai_max:22000000, ai_trend:22, ai_risk:'low', ai_risk_score:11,
    created:'2025-02-14',
    desc:'Yalıkavak marinasına 500m mesafede, deniz manzaralı turizm tesis arsası. Butik otel veya villa projesi için uygun.',
    photo_color:'#1a3a4a', photo_label:'Bodrum',
    tags:['Turizm İmar','Deniz Manzarası','Marina Yakın','Yatırımlık'] },
  { id:'L008', title:'Gaziantep Şehitkamil Ticari Köşe Parsel',
    il:'Gaziantep', ilce:'Şehitkamil', mahalle:'İncilipınar',
    ada:'156', parsel:'18', alan:420, fiyat:1680000, fiyat_m2:4000,
    imar:'Ticari', tapu:'Müstakil', tkgm:'Temiz', emsal:2.00,
    yol_cephesi:22, kat_adedi:5, status:'active', verified:true,
    seller_id:'U003', views:98, favs:8, inquiries:2,
    ai_min:1600000, ai_max:1900000, ai_trend:7, ai_risk:'low', ai_risk_score:25,
    created:'2025-04-28',
    desc:"Gaziantep'in ticaret merkezinde, yüksek yaya trafiğine sahip köşe parsel. Market veya alışveriş merkezi projesi için elverişli.",
    photo_color:'#4a2a1a', photo_label:'Gaziantep',
    tags:['Köşe Parsel','Ticari','Yoğun Trafik','Merkez'] },
  { id:'L009', title:'Trabzon Arsin OSB Yanı Sanayi Arsası',
    il:'Trabzon', ilce:'Arsin', mahalle:'Merkez',
    ada:'44', parsel:'2', alan:5500, fiyat:2750000, fiyat_m2:500,
    imar:'Sanayi', tapu:'Müstakil', tkgm:'Temiz', emsal:1.50,
    yol_cephesi:60, kat_adedi:0, status:'pending', verified:false,
    seller_id:'U007', views:0, favs:0, inquiries:0,
    ai_min:2600000, ai_max:3100000, ai_trend:4, ai_risk:'medium', ai_risk_score:55,
    ai_risk_reason:'Satıcı yeni; benzer ilan örüntüsü düşük.',
    created:'2025-05-12',
    desc:'Arsin OSB sınırına bitişik büyük sanayi arsası. Karadeniz liman hattına yakın, ihracat odaklı sanayi yatırımı için uygun.',
    photo_color:'#3a1a4a', photo_label:'Trabzon',
    tags:['OSB Yanı','Büyük Parsel','Liman Yakın','Sanayi'] },
  { id:'L010', title:'Eskişehir Tepebaşı Konut Arsası',
    il:'Eskişehir', ilce:'Tepebaşı', mahalle:'Batıkent',
    ada:'209', parsel:'33', alan:380, fiyat:1140000, fiyat_m2:3000,
    imar:'Konut', tapu:'Müstakil', tkgm:'Temiz', emsal:2.00,
    yol_cephesi:14, kat_adedi:5, status:'active', verified:true,
    seller_id:'U003', views:67, favs:9, inquiries:2,
    ai_min:1050000, ai_max:1200000, ai_trend:8, ai_risk:'low', ai_risk_score:21,
    created:'2025-05-01',
    desc:'Eskişehir Anadolu Üniversitesi yakınında gelişen bölgede konut arsası. Öğrenci nüfusuna yönelik kira garantili apartman projesi için.',
    photo_color:'#1a4a4a', photo_label:'Eskişehir',
    tags:['Üniversite Yakın','Konut İmar','Gelişen Bölge'] },
  { id:'L011', title:'İzmir Urla Zeytinlik Tarım Arazisi',
    il:'İzmir', ilce:'Urla', mahalle:'Bademler',
    ada:'77', parsel:'6', alan:12000, fiyat:3600000, fiyat_m2:300,
    imar:'Zeytinlik', tapu:'Hisseli', tkgm:'Temiz', emsal:0,
    yol_cephesi:25, kat_adedi:0, status:'active', verified:true,
    seller_id:'U002', views:102, favs:17, inquiries:4,
    ai_min:3400000, ai_max:4000000, ai_trend:18, ai_risk:'medium', ai_risk_score:38,
    created:'2025-03-18',
    desc:"Urla'nın güzide zeytinlikleri arasında, tescilli 800 dönümlük antik zeytin bahçesi. Premium zeytinyağı üretimi veya agro-turizm için ideal.",
    photo_color:'#2a4a1a', photo_label:'Urla',
    tags:['Zeytinlik','Organik','Agro-turizm','Büyük Parsel'] },
  { id:'L012', title:'Sakarya Sapanca Göl Kenarı Arsa',
    il:'Sakarya', ilce:'Sapanca', mahalle:'Merkez',
    ada:'33', parsel:'11', alan:1200, fiyat:4800000, fiyat_m2:4000,
    imar:'Konut', tapu:'Müstakil', tkgm:'Temiz', emsal:0.60,
    yol_cephesi:28, kat_adedi:2, status:'active', verified:true,
    seller_id:'U003', views:289, favs:45, inquiries:13,
    ai_min:4500000, ai_max:5500000, ai_trend:25, ai_risk:'low', ai_risk_score:14,
    created:'2025-02-28',
    desc:'Sapanca Gölü kıyısında nadir bulunan müstakil tapulu arsa. Doğa ile iç içe, düşük yoğunluklu villa projesi için mükemmel.',
    photo_color:'#1a3a2a', photo_label:'Sapanca',
    tags:['Göl Kenarı','Villa Arsası','Nadir','Temiz Tapu'] },
];

// Buyer'a göre favoriler (listing_id array'leri)
const FAVORITES = {
  U001: ['L001','L007','L012'],
  U005: ['L003','L006'],
  U006: ['L005','L007','L011','L012'],
};

// Mesaj thread'leri (bir thread = bir buyer↔seller↔listing)
const THREADS = [
  { id:'M001', listing_id:'L001', buyer_id:'U001', seller_id:'U002', unread_for_buyer:0, unread_for_seller:2, last_time:'10:32' },
  { id:'M002', listing_id:'L003', buyer_id:'U005', seller_id:'U002', unread_for_buyer:1, unread_for_seller:0, last_time:'Dün'  },
  { id:'M003', listing_id:'L007', buyer_id:'U001', seller_id:'U002', unread_for_buyer:0, unread_for_seller:0, last_time:'2 gün'},
  { id:'M004', listing_id:'L012', buyer_id:'U006', seller_id:'U003', unread_for_buyer:0, unread_for_seller:1, last_time:'09:14'},
  { id:'M005', listing_id:'L005', buyer_id:'U006', seller_id:'U002', unread_for_buyer:2, unread_for_seller:0, last_time:'08:02'},
];

// Thread içi mesajlar
const MESSAGES = [
  { thread:'M001', from:'U001', text:'Merhaba, arsa hâlâ satılık mı?', time:'10:18' },
  { thread:'M001', from:'U002', text:'Evet, satışta. Görüşmek ister misiniz?', time:'10:22' },
  { thread:'M001', from:'U001', text:'TKGM belgelerini paylaşabilir misiniz?', time:'10:30' },
  { thread:'M001', from:'U001', text:'Ayrıca yerinde görmek istiyorum.', time:'10:32' },
  { thread:'M002', from:'U005', text:'Fiyatta pazarlık payı var mı?', time:'Dün 16:40' },
  { thread:'M002', from:'U002', text:'Ciddi alıcıya değerlendirebiliriz.', time:'Dün 17:02' },
  { thread:'M003', from:'U001', text:'Teşekkürler, değerlendireceğim.', time:'2 gün önce' },
  { thread:'M004', from:'U006', text:'Göl kıyısı tam manzara mı?', time:'09:14' },
  { thread:'M005', from:'U002', text:'Oran arsamızla ilgili güncel fiyat: 6.8M ₺', time:'07:58' },
  { thread:'M005', from:'U002', text:'Hafta sonu yerinde gezdirebilirim.',          time:'08:02' },
];

const OFFERS = [
  { id:'O001', listing_id:'L001', listing_title:'Kadıköy Merkezde Konut İmarlı Arsa',
    buyer_id:'U001', buyer_name:'Mert Aydın',  amount:4200000, status:'pending',  date:'2025-05-12', msg:'TKGM temiz ise fiyat konuşabiliriz.' },
  { id:'O002', listing_id:'L003', listing_title:'Karşıyaka Ticari Arsa — E:3.00',
    buyer_id:'U005', buyer_name:'Selin Çelik', amount:2000000, status:'declined', date:'2025-05-10', msg:'Son fiyat nedir?' },
  { id:'O003', listing_id:'L007', listing_title:'Bodrum Turistik Tesis Arsası',
    buyer_id:'U001', buyer_name:'Mert Aydın',  amount:18500000,status:'accepted', date:'2025-04-30', msg:'Nisan sonuna kadar sonuçlandırabiliriz.' },
  { id:'O004', listing_id:'L005', listing_title:'Çankaya Prestijli Konut Arsası',
    buyer_id:'U006', buyer_name:'Cem Yılmaz',  amount:6500000, status:'pending',  date:'2025-05-13', msg:'Tapuyu inceledim, teklifim bu.' },
];

function PENDING_QUEUE(){
  return LISTINGS.filter(l => l.status === 'pending');
}

const NOTIFICATIONS = {
  buyer: [
    { id:'N01', icon:'ph-tag',          text:'Kadıköy ilanında fiyat %3 düştü.',       time:'2sa', read:false },
    { id:'N02', icon:'ph-chat-circle',  text:'Ahmet Koç yeni mesaj gönderdi.',         time:'4sa', read:false },
    { id:'N03', icon:'ph-bell',         text:'Aradığınız "Bodrum" için 2 yeni ilan.',  time:'1g',  read:true  },
  ],
  seller: [
    { id:'N04', icon:'ph-currency-circle-dollar', text:'Mert Aydın "Kadıköy" için 4.2M ₺ teklif verdi.', time:'1sa', read:false },
    { id:'N05', icon:'ph-eye',          text:'"Bodrum" ilanı bugün 42 görüntülenme aldı.', time:'3sa', read:false },
    { id:'N06', icon:'ph-check-circle', text:'Yeni ilanınız "Karşıyaka" onaylandı.',       time:'1g',  read:true  },
  ],
  admin: [
    { id:'N07', icon:'ph-warning',      text:'"Antalya Konyaaltı" yüksek AI risk skoru.', time:'12dk', read:false },
    { id:'N08', icon:'ph-user-plus',    text:'3 yeni satıcı doğrulama bekliyor.',          time:'2sa',  read:false },
    { id:'N09', icon:'ph-chart-bar',    text:'Bu hafta toplam işlem hacmi %18 arttı.',     time:'1g',   read:true  },
  ]
};

const PERFORMANCE = {
  U002: {
    views:   [12,18,22,15,28,34,41,38,52,47,55,62,58,71],
    favs:    [1,2,3,2,4,5,4,6,7,6,8,9,7,11],
    inquiries:[0,1,1,0,2,1,2,3,2,4,3,4,3,5],
    total_views: 1156, total_favs: 131, total_inquiries: 41, conversion: 3.5,
  },
  U003: {
    views:   [5,7,9,11,8,12,15,18,14,17,21,19,24,28],
    favs:    [0,1,1,2,1,2,3,2,4,3,4,5,4,6],
    inquiries:[0,0,1,0,1,1,0,1,2,1,2,2,1,3],
    total_views: 488, total_favs: 62, total_inquiries: 17, conversion: 3.5,
  },
};

const PLATFORM_METRICS = {
  total_listings: 12, active_listings: 10, pending_listings: 2,
  total_users: 7, buyers: 3, sellers: 3,
  this_week_transactions: 4, this_week_volume: 22600000,
  daily_visits: [124,156,189,202,178,234,267,289,312,298,341,378,402,425],
};

const WIZARD_STEPS = [
  { id:'konum',    label:'Konum',    icon:'ph-map-pin' },
  { id:'detaylar', label:'Detaylar', icon:'ph-clipboard-text' },
  { id:'fiyat',    label:'Fiyat',    icon:'ph-currency-circle-dollar' },
  { id:'yayinla',  label:'Yayınla',  icon:'ph-rocket-launch' },
];

const IL_LIST   = ['Adana','Ankara','Antalya','Bolu','Bursa','Diyarbakır','Eskişehir','Gaziantep','İstanbul','İzmir','Kocaeli','Konya','Mersin','Muğla','Sakarya','Samsun','Trabzon'];
const IMAR_LIST = ['Konut','Ticari','Sanayi','Tarım','Turizm','Zeytinlik','Orman','Sit Alanı'];
const TAPU_LIST = ['Müstakil','Hisseli','Kat İrtifakı','Kat Mülkiyeti','Arsa Tapusu'];
const TKGM_LIST = ['Temiz','İpotekli','Şerh','Tedbir'];

const AI_REPLY_TEMPLATES = {
  buyer: [
    'Görüntülemek için müsait olduğunuz bir gün var mı?',
    'TKGM ve tapu belgelerini paylaşır mısınız?',
    'Fiyatta pazarlık payı var mı?',
    'Konum koordinatlarını gönderebilir misiniz?',
  ],
  seller: [
    'Hafta sonu yerinde gezdirebilirim.',
    'Ciddi alıcıya değerlendirebiliriz.',
    'Belgeleri özelden iletiyorum.',
    'Net teklifinizi bekliyorum.',
  ],
};

// Aktivite log (admin için)
const ACTIVITY = [
  { time:'10:42', icon:'ph-check-circle', kind:'success', text:'Yeni ilan onaylandı: Karşıyaka Ticari Arsa' },
  { time:'10:18', icon:'ph-user-plus',    kind:'',        text:'Yeni satıcı kaydı: Burak Şahin'  },
  { time:'09:55', icon:'ph-warning',      kind:'danger',  text:'Yüksek risk: Antalya Konyaaltı (AI skor 71)' },
  { time:'09:32', icon:'ph-handshake',    kind:'success', text:'Teklif kabul edildi: 18.5M ₺ — Bodrum' },
  { time:'08:14', icon:'ph-chart-bar',    kind:'',        text:'Günlük ziyaret %18 arttı' },
  { time:'07:58', icon:'ph-pencil',       kind:'',        text:'İlan güncellendi: Sapanca Göl Kenarı' },
];

// AI insights — rol bazlı öneri kartları
function aiInsights(role){
  if (role === 'buyer'){
    return [
      { icon:'ph-trend-up', text:'Bodrum bölgesinde son 30 günde fiyatlar %22 arttı. Favorilerindeki ilana yakın takip öneririz.' },
      { icon:'ph-target',   text:'Aradığın profile uyan 3 yeni ilan bulundu — Kadıköy, Çankaya, Sapanca.' },
      { icon:'ph-sparkle',  text:'Karşılaştırma için önerimiz: ortalama m² fiyatı en düşük 2 ilanını seç.' },
    ];
  }
  if (role === 'seller'){
    return [
      { icon:'ph-lightbulb', text:'İlanlarının görüntülenmesi son 7 günde %12 arttı. Yükselt özelliğini kullanabilirsin.' },
      { icon:'ph-target',    text:'Karşıyaka ilanın AI bandının %3 üzerinde — pazarlık marjı sınırlı, ana cadde vurgusu iyi olur.' },
      { icon:'ph-currency-circle-dollar', text:'Müsait taslak: 1 ilan henüz yayınlanmamış. Tamamlamak ister misin?' },
    ];
  }
  if (role === 'admin'){
    return [
      { icon:'ph-warning',     text:'2 ilan yüksek risk skoruyla kuyrukta — öncelikli incele.' },
      { icon:'ph-trend-up',    text:'Bu hafta işlem hacmi 22.6M ₺ — geçen haftaya göre +%18.' },
      { icon:'ph-users-three', text:'3 satıcı doğrulama bekliyor. Bekleme süresi ortalama 14 saat.' },
    ];
  }
  return [];
}

// AI doğal dil arama → filtre eşleştirici (sahte NLP)
function aiParseQuery(q){
  const out = { text:q };
  const ql = (q||'').toLowerCase();
  for (const il of IL_LIST) if (ql.includes(il.toLowerCase())) { out.il = il; break; }
  for (const im of IMAR_LIST) if (ql.includes(im.toLowerCase())) { out.imar = im; break; }
  const fiyatM = ql.match(/(\d+)\s*m/);          if (fiyatM) out.fiyat_max = parseInt(fiyatM[1]) * 1000000;
  const alanM  = ql.match(/(\d+)\s*(m2|metre)/); if (alanM)  out.alan_min  = parseInt(alanM[1]);
  if (ql.includes('temiz tapu') || ql.includes('temiz')) out.tkgm = 'Temiz';
  if (ql.includes('deniz')) out.tag_hint = 'deniz';
  if (ql.includes('göl'))   out.tag_hint = 'göl';
  return out;
}

// AI fiyat tahmini (m²×bölge çarpanı sahte hesap)
function aiPriceEstimate(d){
  if (!d || !d.alan || !d.il) return null;
  const ilMult = { 'İstanbul':14000, 'İzmir':9000, 'Ankara':9500, 'Muğla':7000, 'Antalya':5500, 'Bolu':800, 'Bursa':5000, 'Sakarya':4000, 'Trabzon':2500, 'Gaziantep':3800, 'Eskişehir':3000 };
  const imarMult = { 'Konut':1.0, 'Ticari':1.35, 'Sanayi':0.6, 'Tarım':0.05, 'Turizm':1.5, 'Zeytinlik':0.2 };
  const base = (ilMult[d.il] || 2500) * (imarMult[d.imar] || 1);
  const emsalBoost = 1 + (d.emsal || 0) * 0.1;
  const est = d.alan * base * emsalBoost;
  return { min: Math.round(est*0.92), suggested: Math.round(est), max: Math.round(est*1.08) };
}

// AI açıklama yazıcı (template-based)
function aiWriteDescription(d){
  if (!d || !d.il) return '';
  const parts = [];
  parts.push(`${d.ilce || d.il} bölgesinde ${d.imar?.toLowerCase() || 'arsa'} niteliğinde ${d.alan} m² parsel.`);
  if (d.tapu === 'Müstakil') parts.push('Müstakil tapulu, hızlı devir uygun.');
  if (d.tkgm === 'Temiz')    parts.push('TKGM kaydı temiz.');
  if (d.emsal > 1.5)         parts.push(`Yüksek emsal (E:${d.emsal}) ile verimli yapılaşma imkânı.`);
  if (d.yol_cephesi > 15)    parts.push(`${d.yol_cephesi}m yol cephesi avantajı.`);
  parts.push('Yatırım veya geliştirme için değerlendirilebilir.');
  return parts.join(' ');
}

// Formatlayıcılar
function fmt(n){ return new Intl.NumberFormat('tr-TR').format(n); }
function fmtTL(n){
  if (n >= 1_000_000) return '₺' + (n/1_000_000).toFixed(n%1_000_000 === 0 ? 0 : 1) + 'M';
  if (n >= 1_000)     return '₺' + Math.round(n/1000) + 'K';
  return '₺' + fmt(n);
}
function fmtTLFull(n){ return '₺' + fmt(n); }
function fmtAlan(m2){ return m2 >= 10000 ? (m2/1000).toFixed(1) + ' dönüm' : fmt(m2) + ' m²'; }

// In-memory mutable app state
const State = {
  role: 'buyer',
  userId: ACTIVE_USER_PER_ROLE.buyer,
  view: 'discover',
  params: {},
  filters: { q:'', il:'', imar:'', tkgm:'', fiyat_max:0, alan_min:0, tag_hint:'', sort:'newest' },
  wizard: {
    step:0,
    errors:{},
    data:{ il:'', ilce:'', mahalle:'', ada:'', parsel:'', alan:0, imar:'', tapu:'', tkgm:'', yol_cephesi:0, emsal:0, kat_adedi:0, fiyat:0, desc:'', tags:[], title:'' }
  },
  favs: JSON.parse(JSON.stringify(FAVORITES)),
  photoIdx: 0,
  myListingsFilter: 'all',     // all | active | pending | rejected
  usersFilter: 'all',          // all | buyer | seller | admin
  offersFilter: 'all',         // all | pending | accepted | declined
  perfRange: 14,               // 7 | 14 | 30
  approvalFilter: 'all',       // all | low | medium | high
  compare: [],                 // listing id'leri (max 3)
  tipsDismissed: {},           // {dashboard:true, favorites:true, ...}
  globalSearch: '',
  msgSearch: '',               // thread içi arama
  selectedPerfListing: '',     // performans: ilan başı seçili
  savedSearches: [],           // [{ id, label, filters }]
  recent: [],                  // listing id'leri (son görüntülenen, max 8)
  consent: false,              // KVKK banner kabul
  wizardPhotos: [],            // [{label, color}] thumbs
};

// Required wizard fields per step (for validation)
const WIZARD_REQUIRED = [
  ['il','ilce','mahalle'],
  ['alan','imar','tapu','tkgm'],
  ['fiyat'],
  [],
];

// İl bazlı zone (placeholder konum tahmini için)
const IL_MAP = {
  'İstanbul':[41.0082, 28.9784], 'Ankara':[39.9334, 32.8597], 'İzmir':[38.4192, 27.1287],
  'Bursa':[40.1956, 29.0610], 'Antalya':[36.8969, 30.7133], 'Muğla':[37.2153, 28.3636],
  'Bolu':[40.7392, 31.6111], 'Sakarya':[40.7569, 30.3781], 'Eskişehir':[39.7767, 30.5206],
  'Gaziantep':[37.0662, 37.3833], 'Trabzon':[41.0027, 39.7178],
};
