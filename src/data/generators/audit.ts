import { faker } from '@faker-js/faker/locale/tr';
import type { AuditEvent, User, Listing } from '@/types/domain';
import { pick } from '@/lib/utils/random';

function hash(prev: string, content: string): string {
  // basit deterministic hash (16-char)
  let h = 5381;
  const s = prev + '|' + content;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h).toString(16).padStart(8, '0').slice(0, 8) + Math.abs(h * 31).toString(16).padStart(8, '0').slice(0, 8);
}

const ACTIONS = [
  'listing.create', 'listing.update', 'listing.publish', 'listing.reject', 'listing.approve',
  'offer.create', 'offer.accept', 'offer.reject', 'offer.expire',
  'user.signup', 'user.kyc.start', 'user.kyc.complete', 'user.role.change',
  'rule.create', 'rule.update', 'rule.toggle',
  'tkgm.query', 'audit.export'
];

export function generateAudit(rand: () => number, users: User[], listings: Listing[], count = 500): AuditEvent[] {
  const out: AuditEvent[] = [];
  let prevHash = '00000000';
  for (let i = 0; i < count; i++) {
    const u = pick(users, rand);
    const action = pick(ACTIONS, rand);
    const resType = action.startsWith('listing') ? 'listing'
      : action.startsWith('offer') ? 'offer'
      : action.startsWith('user') ? 'user'
      : action.startsWith('rule') ? 'eca_rule'
      : action.startsWith('tkgm') ? 'tkgm_query'
      : 'system';
    const resId = resType === 'listing' ? pick(listings, rand).id : `${resType}-${Math.floor(rand()*9999)}`;
    const at = faker.date.between({ from: '2026-04-13', to: '2026-05-13' }).toISOString();
    const content = `${u.id}|${action}|${resType}|${resId}|${at}`;
    const h = hash(prevHash, content);
    out.push({
      id: `a-${i.toString().padStart(5, '0')}`,
      at,
      principalId: u.id,
      principalType: u.principalType,
      action,
      resourceType: resType,
      resourceId: resId,
      hashPrev: prevHash,
      hash: h,
      reason: rand() > 0.7 ? pick(['Kullanıcı talebi', 'Otomasyon', 'Onay süreci', 'KYC zorunluluğu'], rand) : undefined
    });
    prevHash = h;
  }
  // Tarihe göre sırala (yeniden eski)
  out.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return out;
}
