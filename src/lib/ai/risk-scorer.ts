import type { Listing, TkgmStatus, TapuType, ImarType } from '@/types/domain';
import { clamp } from '@/lib/utils/random';

export interface RiskResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  reasons: string[];
}

export function scoreRisk(input: {
  tkgmStatus: TkgmStatus;
  tapuType: TapuType;
  imarType: ImarType;
  hisseRatio?: number;
  utilities?: { road?: boolean; electricity?: boolean };
}): RiskResult {
  let s = 8;
  const reasons: string[] = [];

  if (input.tkgmStatus === 'ipotekli') { s += 40; reasons.push('TKGM kaydında ipotek var'); }
  if (input.tkgmStatus === 'serh')     { s += 30; reasons.push('Tapuda şerh kayıtlı'); }
  if (input.tkgmStatus === 'tedbir')   { s += 35; reasons.push('Tapuda tedbir kaydı var'); }
  if (input.tkgmStatus === 'bilinmiyor'){ s += 12; reasons.push('TKGM durumu henüz doğrulanmadı'); }

  if (input.tapuType === 'hisseli') {
    s += 18;
    if (input.hisseRatio && input.hisseRatio < 50) s += 8;
    reasons.push('Hisseli mülkiyet — anlaşma süreci uzayabilir');
  }
  if (input.tapuType === 'kat_irtifaki') { s += 4; reasons.push('Kat irtifakı — yapı süreci kontrol edilmeli'); }

  if (input.imarType === 'imarsiz') { s += 12; reasons.push('İmar durumu yok'); }
  if (input.imarType === 'tarim' || input.imarType === 'zeytinlik') {
    s += 6; reasons.push('Tarımsal arazi kullanım kısıtı');
  }

  if (input.utilities && input.utilities.road === false) {
    s += 5; reasons.push('Yol erişimi yok');
  }

  s = clamp(Math.round(s), 0, 100);
  if (!reasons.length) reasons.push('Belirgin risk tespit edilmedi');
  const level: RiskResult['level'] = s >= 60 ? 'high' : s >= 30 ? 'medium' : 'low';
  return { score: s, level, reasons };
}

export function riskForListing(l: Listing): RiskResult {
  return scoreRisk({
    tkgmStatus: l.tkgmStatus,
    tapuType: l.tapuType,
    imarType: l.imarType,
    hisseRatio: l.hisseRatio,
    utilities: l.utilities
  });
}
