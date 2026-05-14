import { faker } from '@faker-js/faker/locale/tr';
import type { User, Role, KycLevel } from '@/types/domain';
import { pick, pickMany } from '@/lib/utils/random';

const TURKISH_FIRST = ['Ahmet','Mehmet','Mustafa','Ayşe','Fatma','Emine','Ali','Hüseyin','Hasan','İbrahim','Zeynep','Elif','Hatice','Merve','Burak','Murat','Selin','Deniz','Ece','Kerem','Ozan','Cem','Berk','Tuna','Sevgi','Esra','Defne','Yiğit','Eren','Naz','Furkan','Doğa','Pelin','Ceren','Gizem','Beste','Tunç','Volkan','Ümit','Kaan'];
const TURKISH_LAST  = ['Yılmaz','Kaya','Demir','Şahin','Çelik','Yıldız','Yıldırım','Öztürk','Aydın','Özdemir','Arslan','Doğan','Kılıç','Aslan','Çetin','Kara','Koç','Kurt','Özkan','Şimşek','Polat','Erdoğan','Türk','Acar','Korkmaz','Erdem','Güneş','Karaca','Tekin','Akın','Bulut','Soylu','Avcı','Yavuz'];

const KYC_LEVELS: KycLevel[] = ['none', 'phone', 'email', 'identity', 'full'];

function avatar(id: string): string {
  return `https://i.pravatar.cc/240?u=${encodeURIComponent(id)}`;
}

export function generateUser(seedId: number, rand: () => number, roles: Role[]): User {
  faker.seed(seedId + 1000);
  const first = pick(TURKISH_FIRST, rand);
  const last  = pick(TURKISH_LAST, rand);
  const fullName = `${first} ${last}`;
  const id = `u-${seedId.toString().padStart(4, '0')}`;
  const principalType: User['principalType'] = roles.includes('seller') && rand() > 0.6 ? 'org' : 'individual';
  const isOrg = principalType === 'org';
  const orgName = isOrg ? `${last} Gayrimenkul` : undefined;
  const displayName = isOrg ? (orgName as string) : fullName;
  const cityList = ['İstanbul','Ankara','İzmir','Antalya','Bursa','Muğla','Tekirdağ','Sakarya','Aydın','Eskişehir','Edirne','Çanakkale'];
  return {
    id,
    principalType,
    displayName,
    email: faker.internet.email({ firstName: first, lastName: last, provider: 'landx.test' }).toLowerCase(),
    phone: `+9053${Math.floor(rand() * 90 + 10)}${Math.floor(rand() * 9000000 + 1000000)}`,
    fullName,
    avatarUrl: avatar(id),
    locale: rand() > 0.05 ? 'tr' : 'en',
    timezone: 'Europe/Istanbul',
    kycLevel: pick(KYC_LEVELS, rand),
    status: rand() > 0.95 ? 'suspended' : 'active',
    roles,
    organization: isOrg ? { id: `org-${seedId}`, name: orgName as string } : undefined,
    createdAt: faker.date.between({ from: '2024-01-01', to: '2026-03-01' }).toISOString(),
    lastSeenAt: faker.date.recent({ days: 14 }).toISOString(),
    preferences: {
      notifyEmail: rand() > 0.2,
      notifySms: rand() > 0.5,
      notifyPush: rand() > 0.3,
      aiAssistantDefault: pick(['auto', 'minimal', 'off'] as const, rand),
      theme: pick(['light', 'dark', 'system'] as const, rand),
      locale: 'tr'
    },
    rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
    vipScore: Math.floor(rand() * 100),
    city: pick(cityList, rand),
    bio: isOrg
      ? `${orgName} — Türkiye genelinde arsa ve yatırım danışmanlığı sunuyoruz.`
      : roles.includes('seller')
        ? 'Arsa, tarla ve yatırım projeleri üzerine çalışıyorum.'
        : 'Yatırımlık arsa arıyorum.'
  };
}

export function generateUsers(seed: number, rand: () => number, count = 60): User[] {
  const out: User[] = [];
  faker.seed(seed);

  // 8 admin/moderator + 22 seller (10 individual, 12 org) + 30 buyer
  for (let i = 0; i < 8; i++)  out.push(generateUser(i, rand, i < 5 ? ['admin'] : ['moderator']));
  for (let i = 0; i < 22; i++) out.push(generateUser(100 + i, rand, ['seller']));
  for (let i = 0; i < count - 30; i++) out.push(generateUser(200 + i, rand, ['buyer']));

  // 5 hibrit (both buyer and seller)
  for (let i = 0; i < 5; i++) {
    out.push(generateUser(300 + i, rand, ['buyer', 'seller']));
  }
  return out;
}

export { TURKISH_FIRST, TURKISH_LAST };
