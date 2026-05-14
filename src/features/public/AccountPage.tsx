import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { Card } from '@/components/ui/Card';
import { Heart, BookmarkSimple, ChatCircle, Briefcase, Calendar, ShieldCheck, IdentificationCard, ArrowRight, BellRinging, Sparkle } from '@phosphor-icons/react';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/data/SectionHeading';

export default function AccountPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const me = data.users.find((u) => u.id === auth.currentUserId);
  if (!me) return null;

  const fav = data.favorites.filter((f) => f.userId === me.id).length;
  const saved = data.savedSearches.filter((s) => s.userId === me.id).length;
  const myMessages = data.threads.filter((t) => t.participantIds.includes(me.id)).length;
  const myOffers = data.offers.filter((o) => o.buyerId === me.id || o.sellerId === me.id).length;
  const myViewings = data.viewings.filter((v) => v.visitorId === me.id || v.sellerId === me.id).length;

  const items = [
    { to: '/account/favorites', label: t('nav.favorites'), Icon: Heart, count: fav },
    { to: '/account/searches', label: t('nav.savedSearches'), Icon: BookmarkSimple, count: saved },
    { to: '/account/messages', label: t('nav.messages'), Icon: ChatCircle, count: myMessages },
    { to: '/account/offers', label: t('nav.offers'), Icon: Briefcase, count: myOffers },
    { to: '/account/viewings', label: t('nav.viewings'), Icon: Calendar, count: myViewings },
    { to: '/account/profile', label: t('nav.profile'), Icon: IdentificationCard },
    { to: '/account/ai-history', label: 'AI Geçmişi', Icon: Sparkle },
    { to: '/notifications', label: t('nav.notifications'), Icon: BellRinging }
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading
        title={`Merhaba, ${me.displayName.split(' ')[0]}`}
        description={`Rol: ${auth.role} · KYC: ${me.kycLevel}`}
        actions={
          (auth.role === 'seller' || auth.role === 'admin') ? (
            <Button onClick={() => navigate('/seller')}>{t('nav.seller')}</Button>
          ) : (
            <Button onClick={() => navigate('/sell')}>{t('nav.sell')}</Button>
          )
        }
      />

      <KycProgress kycLevel={me.kycLevel} />

      <div className="rounded-r-3 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30 border border-brand-200/60 dark:border-brand-700/40 p-4 mb-4">
        <div className="inline-flex items-center gap-2 text-sm font-medium mb-1">
          <Sparkle size={16} weight="fill" className="text-brand-500" /> AI özet
        </div>
        <ul className="text-sm text-fg-2 space-y-1">
          <li>• Bu hafta 3 yeni ilan kaydettiğiniz arama ile eşleşti.</li>
          <li>• 2 görme randevunuz var: yarın ve önümüzdeki perşembe.</li>
          <li>• Profil tamamlanma oranınız: %{Math.round((me.kycLevel === 'full' ? 100 : me.kycLevel === 'identity' ? 80 : me.kycLevel === 'email' ? 60 : 40))}</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Favoriler" value={fav} icon={<Heart size={20} weight="fill" />} />
        <Stat label="Aramalarım" value={saved} icon={<BookmarkSimple size={20} weight="fill" />} />
        <Stat label="Mesajlar" value={myMessages} icon={<ChatCircle size={20} weight="fill" />} />
        <Stat label="Teklifler" value={myOffers} icon={<Briefcase size={20} weight="fill" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <Link key={it.to} to={it.to} className="block">
            <Card interactive className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-r-2 bg-brand-50 dark:bg-brand-900/30 grid place-items-center text-brand-600">
                <it.Icon size={20} weight="duotone" />
              </span>
              <div className="flex-1">
                <div className="font-medium">{it.label}</div>
                {it.count !== undefined && <div className="text-xs text-fg-3">{it.count} kayıt</div>}
              </div>
              <ArrowRight size={16} className="text-fg-3" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function KycProgress({ kycLevel }: { kycLevel: import('@/types/domain').KycLevel }) {
  const steps: Array<{ id: import('@/types/domain').KycLevel; label: string }> = [
    { id: 'phone', label: 'Telefon doğrulama' },
    { id: 'email', label: 'E-posta doğrulama' },
    { id: 'identity', label: 'Kimlik doğrulama' },
    { id: 'full', label: 'Tam profil' }
  ];
  const order: Record<import('@/types/domain').KycLevel, number> = { none: 0, phone: 1, email: 2, identity: 3, full: 4 };
  const current = order[kycLevel];
  const pct = Math.round((current / 4) * 100);
  return (
    <div className="rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm">Hesap güvenliği</div>
        <div className="text-xs text-fg-3">%{pct} tamamlandı</div>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {steps.map((s) => {
          const done = order[s.id] <= current;
          return (
            <div key={s.id} className={`rounded-r-2 px-2 py-1.5 text-xs border ${done ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-800 text-fg-3'}`}>
              <span className="inline-flex items-center gap-1">{done ? '✓' : '○'} {s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
