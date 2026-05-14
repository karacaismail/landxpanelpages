import type { ImarType, TapuType, TkgmStatus } from '@/types/domain';

export const IMAR_LABELS: Record<ImarType, { tr: string; en: string }> = {
  konut: { tr: 'Konut imarlı', en: 'Residential zoned' },
  tarim: { tr: 'Tarım arazisi', en: 'Agricultural' },
  ticari: { tr: 'Ticari imarlı', en: 'Commercial zoned' },
  sanayi: { tr: 'Sanayi imarlı', en: 'Industrial zoned' },
  turizm: { tr: 'Turizm imarlı', en: 'Tourism zoned' },
  zeytinlik: { tr: 'Zeytinlik', en: 'Olive grove' },
  imarsiz: { tr: 'İmarsız', en: 'Unzoned' },
  karma: { tr: 'Karma imar', en: 'Mixed-use zoned' }
};

export const TAPU_LABELS: Record<TapuType, { tr: string; en: string }> = {
  mustakil: { tr: 'Müstakil tapu', en: 'Detached deed' },
  hisseli: { tr: 'Hisseli tapu', en: 'Shared deed' },
  kat_irtifaki: { tr: 'Kat irtifakı', en: 'Floor easement' },
  arsa_tapulu: { tr: 'Arsa tapulu', en: 'Plot deed' },
  tarla_tapulu: { tr: 'Tarla tapulu', en: 'Field deed' }
};

export const TKGM_LABELS: Record<TkgmStatus, { tr: string; en: string }> = {
  temiz: { tr: 'Temiz', en: 'Clean' },
  ipotekli: { tr: 'İpotekli', en: 'Mortgaged' },
  serh: { tr: 'Şerhli', en: 'Annotated' },
  tedbir: { tr: 'Tedbirli', en: 'Restricted' },
  bilinmiyor: { tr: 'Bilinmiyor', en: 'Unknown' }
};

export const FEATURES_TR = [
  'Deniz manzaralı',
  'Göl manzaralı',
  'Yola sıfır',
  'Köşe parsel',
  'Yatırımlık',
  'Krediye uygun',
  'Tapuda arsa',
  'Tapuda tarla',
  'Su kuyusu',
  'Elektrik mevcut',
  'Doğalgaz mevcut',
  'Ağaçlı',
  'Verimli toprak',
  'Eğimsiz arazi',
  'Sahile yakın',
  'Otoyola yakın',
  'Şehir merkezine yakın',
  'Havalimanına yakın',
  'Yıllık sözleşmeli',
  'Tek tapu',
  'Acil satılık',
  'İmar planında',
  'Ana yol cepheli',
  'Geniş cephe'
] as const;
