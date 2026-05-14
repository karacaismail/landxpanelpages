import { faker } from '@faker-js/faker/locale/tr';
import type {
  Listing, ListingStatus, ImarType, TapuType, TkgmStatus, ListingImage, User
} from '@/types/domain';
import { TR_CITIES, weightedCityPick } from '@/data/fixtures/turkish-cities';
import { FEATURES_TR } from '@/data/fixtures/imar-types';
import { pick, pickMany, clamp, gaussian } from '@/lib/utils/random';

const IMAR_TYPES: ImarType[] = ['konut', 'tarim', 'ticari', 'sanayi', 'turizm', 'zeytinlik', 'imarsiz', 'karma'];
const IMAR_WEIGHTS: number[] = [0.30, 0.25, 0.12, 0.06, 0.08, 0.10, 0.05, 0.04];
const TAPU_TYPES: TapuType[] = ['mustakil', 'hisseli', 'kat_irtifaki', 'arsa_tapulu', 'tarla_tapulu'];
const TAPU_WEIGHTS = [0.45, 0.20, 0.05, 0.20, 0.10];
const TKGM_STATUSES: TkgmStatus[] = ['temiz', 'ipotekli', 'serh', 'tedbir', 'bilinmiyor'];
const TKGM_WEIGHTS = [0.55, 0.18, 0.13, 0.07, 0.07];

function weightedPick<T>(arr: T[], weights: number[], rand: () => number): T {
  let r = rand();
  for (let i = 0; i < arr.length; i++) {
    if (r < weights[i]) return arr[i];
    r -= weights[i];
  }
  return arr[arr.length - 1];
}

function imageFor(seed: string, idx: number): ListingImage {
  const w = 1200;
  const h = 800;
  // picsum.photos deterministic seed
  const url = `https://picsum.photos/seed/landx-${seed}-${idx}/${w}/${h}`;
  const thumbUrl = `https://picsum.photos/seed/landx-${seed}-${idx}/400/300`;
  return { id: `img-${seed}-${idx}`, url, thumbUrl, alt: `Arsa fotoğrafı ${idx + 1}`, order: idx };
}

function priceFor(area: number, imar: ImarType, city: string, rand: () => number): number {
  // basit emsal mock: il × imar × m² × varyans
  const cityMul: Record<string, number> = {
    'İstanbul': 6.5, 'Ankara': 2.5, 'İzmir': 4.0, 'Antalya': 4.2, 'Muğla': 5.5,
    'Bursa': 2.2, 'Aydın': 2.5, 'Çanakkale': 1.8, 'Tekirdağ': 2.0,
    'Kocaeli': 2.4, 'Sakarya': 1.8, 'Yalova': 2.3
  };
  const imarMul: Record<ImarType, number> = {
    konut: 1.3, ticari: 1.7, sanayi: 0.9, turizm: 1.5,
    tarim: 0.4, zeytinlik: 0.55, imarsiz: 0.3, karma: 1.1
  };
  const base = 1200; // ₺/m² baz
  const variance = 0.6 + gaussian(rand) * 0.15;
  const cm = cityMul[city] ?? 1.0;
  const im = imarMul[imar];
  const price = area * base * cm * im * Math.max(0.4, variance);
  return Math.round(price / 10000) * 10000;
}

function valuation(p: number): { low: number; mid: number; high: number; confidence: number } {
  const noise = 0.08 + Math.random() * 0.05;
  return {
    low:  Math.round(p * (1 - noise) / 10000) * 10000,
    mid:  Math.round(p / 10000) * 10000,
    high: Math.round(p * (1 + noise) / 10000) * 10000,
    confidence: Math.round((0.6 + Math.random() * 0.35) * 100) / 100
  };
}

function riskScore(tkgm: TkgmStatus, tapu: TapuType, imar: ImarType, rand: () => number): { score: number; reasons: string[] } {
  let s = 5 + rand() * 15;
  const reasons: string[] = [];
  if (tkgm === 'ipotekli') { s += 40; reasons.push('TKGM kaydında ipotek var'); }
  if (tkgm === 'serh')     { s += 30; reasons.push('Tapuda şerh kayıtlı'); }
  if (tkgm === 'tedbir')   { s += 35; reasons.push('Tedbir kaydı'); }
  if (tkgm === 'bilinmiyor'){ s += 15; reasons.push('TKGM durumu doğrulanmadı'); }
  if (tapu === 'hisseli')  { s += 18; reasons.push('Hisseli tapu — paylaşımlı mülkiyet'); }
  if (imar === 'imarsiz')  { s += 10; reasons.push('İmarsız parsel'); }
  if (imar === 'tarim' || imar === 'zeytinlik') { s += 6; reasons.push('Tarımsal alanda kullanım kısıtı'); }
  s = clamp(Math.round(s), 0, 100);
  if (!reasons.length) reasons.push('Belirgin risk tespit edilmedi');
  return { score: s, reasons };
}

const aiTagsPool = ['yatırımlık', 'krediye uygun', 'temiz tapu', 'gözde bölge', 'doğa içinde', 'şehir merkezine yakın', 'yola sıfır', 'manzaralı', 'fiyat avantajlı'];

function aiSummary(city: string, district: string, area: number, imarLabel: string): string {
  return `${city} ${district} bölgesinde ${area.toLocaleString('tr-TR')} m² ${imarLabel.toLowerCase()} parsel. Bölgenin yıllık ortalama değer artışı %12 civarındadır. Tapu ve TKGM bilgileri doğrulanmıştır; yatırım amaçlı tercih edilebilir.`;
}

export function generateListing(idx: number, rand: () => number, owners: User[]): Listing {
  faker.seed(idx + 5000);
  const city = weightedCityPick(rand);
  const districtArr = city.districts;
  const district = pick(districtArr, rand);
  const neighborhood = `${district} ${pick(['Mahallesi', 'Köyü', 'Beldesi'], rand)}`;

  const imar = weightedPick(IMAR_TYPES, IMAR_WEIGHTS, rand);
  const tapu = weightedPick(TAPU_TYPES, TAPU_WEIGHTS, rand);
  const tkgm = weightedPick(TKGM_STATUSES, TKGM_WEIGHTS, rand);

  // m² dağılımı: çok geniş yelpaze
  let area: number;
  const sizeRoll = rand();
  if (sizeRoll < 0.4) area = Math.round(200 + rand() * 2300);       // 200-2500
  else if (sizeRoll < 0.75) area = Math.round(2500 + rand() * 7500); // 2.5k-10k
  else if (sizeRoll < 0.95) area = Math.round(10000 + rand() * 40000); // 10k-50k
  else area = Math.round(50000 + rand() * 450000);                   // 50k-500k

  const price = priceFor(area, imar, city.name, rand);
  const pricePerM2 = Math.round(price / area);

  const id = `L${(idx + 1).toString().padStart(4, '0')}`;
  const owner = pick(owners.filter((u) => u.roles.includes('seller')), rand);

  const features = pickMany(FEATURES_TR, 3, 8, rand);
  const utilities = {
    road: rand() > 0.10,
    electricity: rand() > 0.20,
    water: rand() > 0.35,
    gas: rand() > 0.70,
    internet: rand() > 0.55
  };

  const imageCount = 3 + Math.floor(rand() * 9);
  const images: ListingImage[] = Array.from({ length: imageCount }, (_, i) => imageFor(id, i));

  // status dağılımı
  const statusRoll = rand();
  let status: ListingStatus;
  if (statusRoll < 0.06) status = 'draft';
  else if (statusRoll < 0.12) status = 'review';
  else if (statusRoll < 0.90) status = 'live';
  else if (statusRoll < 0.96) status = 'sold';
  else if (statusRoll < 0.99) status = 'rejected';
  else status = 'expired';

  const risk = riskScore(tkgm, tapu, imar, rand);
  const val = valuation(price);

  const createdAt = faker.date.between({ from: '2025-06-01', to: '2026-05-10' }).toISOString();
  const publishedAt = status === 'draft' ? undefined : new Date(new Date(createdAt).getTime() + 86400000 * (1 + rand() * 10)).toISOString();
  const expiresAt = publishedAt ? new Date(new Date(publishedAt).getTime() + 86400000 * (30 + rand() * 90)).toISOString() : undefined;

  const titleParts = [
    pick(['Yatırımlık', 'Acil Satılık', 'Müstakil', 'Köşe', 'Fırsat', 'Hisseli', 'Geniş', 'Verimli', 'Manzaralı'], rand),
    city.name, district,
    pick(['arsa', 'tarla', 'parsel', 'bahçe'], rand)
  ];
  const title = titleParts.join(' ');
  const imarLabelTR = ({
    konut: 'konut imarlı', tarim: 'tarım arazisi', ticari: 'ticari imarlı', sanayi: 'sanayi imarlı',
    turizm: 'turizm imarlı', zeytinlik: 'zeytinlik', imarsiz: 'imarsız', karma: 'karma imarlı'
  } as Record<ImarType, string>)[imar];

  // location jitter etrafında il merkezi
  const lat = city.lat + (rand() - 0.5) * 0.6;
  const lng = city.lng + (rand() - 0.5) * 0.8;

  return {
    id,
    ownerId: owner.id,
    title,
    description: `${city.name}, ${district}${neighborhood ? ', ' + neighborhood : ''}. ${imarLabelTR.charAt(0).toUpperCase() + imarLabelTR.slice(1)} ${area.toLocaleString('tr-TR')} m² parsel. ${features.slice(0, 4).join(', ')}. Tapu durumu: ${tapu === 'mustakil' ? 'müstakil' : tapu === 'hisseli' ? 'hisseli' : tapu === 'kat_irtifaki' ? 'kat irtifakı' : tapu === 'arsa_tapulu' ? 'arsa tapulu' : 'tarla tapulu'}.`,
    status,
    city: city.name,
    district,
    neighborhood,
    ada: `${Math.floor(rand() * 9000) + 100}`,
    parsel: `${Math.floor(rand() * 9000) + 100}`,
    pafta: `${Math.floor(rand() * 90) + 10}`,
    lat,
    lng,
    area,
    price,
    currency: 'TRY',
    pricePerM2,
    tapuType: tapu,
    tkgmStatus: tkgm,
    imarType: imar,
    hisseRatio: tapu === 'hisseli' ? Math.floor(rand() * 70) + 10 : undefined,
    utilities,
    features,
    images,
    publishedAt,
    expiresAt,
    views: Math.floor(rand() * 2500),
    messageCount: Math.floor(rand() * 25),
    offerCount: Math.floor(rand() * 8),
    favoriteCount: Math.floor(rand() * 45),
    aiSummary: aiSummary(city.name, district, area, imarLabelTR),
    aiTags: pickMany(aiTagsPool, 2, 5, rand),
    aiRiskScore: risk.score,
    aiRiskReasons: risk.reasons,
    aiValuation: val,
    createdAt,
    updatedAt: new Date(new Date(createdAt).getTime() + 86400000 * rand() * 30).toISOString()
  };
}

export function generateListings(rand: () => number, users: User[], count = 220): Listing[] {
  const out: Listing[] = [];
  for (let i = 0; i < count; i++) out.push(generateListing(i, rand, users));
  return out;
}
