import type { SavedSearchFilters, ImarType, TkgmStatus, TapuType } from '@/types/domain';
import { TR_CITIES } from '@/data/fixtures/turkish-cities';

const IMAR_KEYWORDS: Array<[RegExp, ImarType]> = [
  [/konut/i, 'konut'],
  [/ticari/i, 'ticari'],
  [/sanayi/i, 'sanayi'],
  [/turizm/i, 'turizm'],
  [/zeytin/i, 'zeytinlik'],
  [/tarım|tarim|tarla|bahçe/i, 'tarim'],
  [/imarsız|imarsiz/i, 'imarsiz'],
  [/karma/i, 'karma']
];

const TKGM_KEYWORDS: Array<[RegExp, TkgmStatus]> = [
  [/temiz/i, 'temiz'],
  [/ipotek/i, 'ipotekli'],
  [/şerh|serh/i, 'serh'],
  [/tedbir/i, 'tedbir']
];

const TAPU_KEYWORDS: Array<[RegExp, TapuType]> = [
  [/müstakil|mustakil/i, 'mustakil'],
  [/hisseli/i, 'hisseli'],
  [/arsa tapulu/i, 'arsa_tapulu'],
  [/tarla tapulu/i, 'tarla_tapulu'],
  [/kat irtifak/i, 'kat_irtifaki']
];

function parsePrice(s: string): number | undefined {
  // örn: "2.5 milyon", "5m", "5.000.000", "5M tl"
  const m1 = s.match(/(\d+(?:[\.,]\d+)?)\s*(milyon|m\b)/i);
  if (m1) return Math.round(parseFloat(m1[1].replace(',', '.')) * 1_000_000);
  const m2 = s.match(/(\d+(?:[\.,]\d+)?)\s*(bin|k\b)/i);
  if (m2) return Math.round(parseFloat(m2[1].replace(',', '.')) * 1_000);
  const m3 = s.match(/([\d\.]+(?:[,\.]\d+)?)\s*(?:tl|₺)/i);
  if (m3) {
    const n = parseFloat(m3[1].replaceAll('.', '').replace(',', '.'));
    return n;
  }
  return undefined;
}

function parseArea(s: string): number | undefined {
  const m = s.match(/(\d{2,7})\s*(?:m2|m²|metrekare)/i);
  if (m) return parseInt(m[1], 10);
  return undefined;
}

export function parseQuery(input: string): SavedSearchFilters & { remainingTokens: string[] } {
  const text = input.trim();
  const out: SavedSearchFilters = {};
  const tokens: string[] = [];

  // şehir
  for (const c of TR_CITIES) {
    if (new RegExp(`\\b${c.name.toLocaleLowerCase('tr-TR')}\\b`, 'i').test(text.toLocaleLowerCase('tr-TR'))) {
      out.city = c.name;
      // ilçe ara
      for (const d of c.districts) {
        if (new RegExp(`\\b${d.toLocaleLowerCase('tr-TR')}\\b`, 'i').test(text.toLocaleLowerCase('tr-TR'))) {
          out.district = d;
          break;
        }
      }
      break;
    }
  }

  // imar
  for (const [re, val] of IMAR_KEYWORDS) {
    if (re.test(text)) { out.imarType = val; break; }
  }
  // tkgm
  for (const [re, val] of TKGM_KEYWORDS) {
    if (re.test(text)) { out.tkgmStatus = val; break; }
  }
  // tapu
  for (const [re, val] of TAPU_KEYWORDS) {
    if (re.test(text)) { out.tapuType = val; break; }
  }

  // fiyat aralığı: "altı/altında/üstü/üstünde"
  const priceVal = parsePrice(text);
  if (priceVal) {
    if (/(alt[ıi]|altinda|altında)/i.test(text)) out.maxPrice = priceVal;
    else if (/(üst[üu]|üzeri|üzerinde)/i.test(text)) out.minPrice = priceVal;
    else out.maxPrice = priceVal; // varsayılan: üst sınır
  }

  const areaVal = parseArea(text);
  if (areaVal) {
    // hedef
    out.minArea = Math.round(areaVal * 0.7);
    out.maxArea = Math.round(areaVal * 1.4);
  }

  // serbest token'ları sakla (özellikler)
  const features: string[] = [];
  if (/deniz/i.test(text)) features.push('Deniz manzaralı');
  if (/göl|gol/i.test(text)) features.push('Göl manzaralı');
  if (/yola sıfır|yola sifir/i.test(text)) features.push('Yola sıfır');
  if (/köşe|kose/i.test(text)) features.push('Köşe parsel');
  if (/yatırım|yatirim/i.test(text)) features.push('Yatırımlık');
  if (features.length) out.features = features;

  out.query = text;
  return { ...out, remainingTokens: tokens };
}
