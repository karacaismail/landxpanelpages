import { faker } from '@faker-js/faker/locale/tr';
import type { TkgmQuery, TkgmCode, User, Listing } from '@/types/domain';
import { pick } from '@/lib/utils/random';

export function generateTkgmQueries(rand: () => number, users: User[], listings: Listing[], count = 60): TkgmQuery[] {
  const out: TkgmQuery[] = [];
  for (let i = 0; i < count; i++) {
    const u = pick(users, rand);
    const listing = pick(listings, rand);
    const codes: TkgmCode[] = ['OK', 'OK', 'OK', 'OK', 'OK', 'E001', 'E002', 'E003', 'E099'];
    const status = pick(codes, rand);
    const at = faker.date.recent({ days: 30 }).toISOString();
    out.push({
      id: `tq-${i.toString().padStart(4, '0')}`,
      by: u.id,
      input: { il: listing.city, ilce: listing.district, ada: listing.ada || '0', parsel: listing.parsel || '0' },
      status,
      latencyMs: 1200 + Math.floor(rand() * 2200),
      createdAt: at,
      result: status === 'OK' ? {
        il: listing.city, ilce: listing.district,
        mahalle: listing.neighborhood,
        ada: listing.ada || '0', parsel: listing.parsel || '0',
        yuzolcumu: listing.area, cinsi: listing.imarType === 'tarim' ? 'Tarla' : listing.imarType === 'zeytinlik' ? 'Zeytinlik' : 'Arsa',
        hisse: listing.hisseRatio ? `${listing.hisseRatio}/100` : undefined
      } : undefined
    });
  }
  out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return out;
}
