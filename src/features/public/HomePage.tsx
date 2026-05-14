import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowRight, MapTrifold, MapPin, Sparkle, ShieldCheck, Buildings, Globe, Compass, ChartLineUp, House } from '@phosphor-icons/react';
import { useData } from '@/store/data';
import { useAuth } from '@/store/auth';
import { ListingCard } from '@/components/data/ListingCard';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import { TR_CITIES } from '@/data/fixtures/turkish-cities';
import { formatPrice } from '@/lib/utils/format';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const data = useData();
  const auth = useAuth();
  const [intent, setIntent] = useState('');
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  const liveListings = useMemo(() => data.listings.filter((l) => l.status === 'live'), [data.listings]);
  const forYou = useMemo(() => [...liveListings].sort((a, b) => b.aiValuation.confidence - a.aiValuation.confidence).slice(0, 8), [liveListings]);
  const popular = useMemo(() => [...liveListings].sort((a, b) => b.views - a.views).slice(0, 8), [liveListings]);
  const recent = useMemo(() => [...liveListings].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '')).slice(0, 8), [liveListings]);

  function go() {
    navigate(`/listings${intent ? `?q=${encodeURIComponent(intent)}` : ''}`);
  }

  return (
    <div>
      {/* Hero — conversational */}
      <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <AiBadge className="!bg-white/20 !text-white !border-white/30 mb-4 inline-flex">
              AI-first arsa pazaryeri
            </AiBadge>
            <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight">{t('home.heroTitle')}</h1>
            <p className="mt-3 text-white/90 lg:text-lg">{t('home.heroSub')}</p>
            <form onSubmit={(e) => { e.preventDefault(); go(); }} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <input
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder={t('home.trySearch')}
                className="flex-1 rounded-r-3 px-4 py-3 text-base bg-white text-fg-1 placeholder:text-fg-3"
                aria-label={t('home.trySearch')}
              />
              <Button type="submit" variant="primary" className="!bg-white !text-brand-700 hover:!bg-white/90" iconRight={<ArrowRight size={18} />}>
                {t('home.ctaDiscover')}
              </Button>
            </form>
            <div className="mt-5 text-white/80 text-sm flex flex-wrap justify-center gap-2">
              {['İstanbul Beykoz 5000 m² imarlı 2.5M altı', 'İzmir Urla zeytinlik temiz tapu', 'Çanakkale deniz manzaralı tarla'].map((q) => (
                <button key={q} type="button" onClick={() => { setIntent(q); navigate(`/listings?q=${encodeURIComponent(q)}`); }} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs">{q}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats / quick highlights */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'Yayında ilan', value: liveListings.length, Icon: MapPin },
          { label: 'TKGM doğrulama', value: '7/24 mock', Icon: ShieldCheck },
          { label: 'Kapsanan il', value: TR_CITIES.length, Icon: Globe },
          { label: 'AI değerleme', value: 'Anlık', Icon: ChartLineUp }
        ].map((s) => (
          <div key={s.label} className="rounded-r-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-2 text-fg-3 text-xs uppercase tracking-wider">
              <s.Icon size={14} /> {s.label}
            </div>
            <div className="text-2xl font-semibold mt-1">{s.value}</div>
          </div>
        ))}
      </section>

      {/* Sizin için */}
      <Strip title={t('home.stripForYou')} description="AI değerleme güveni yüksek ilanlar" cta={<Link to="/listings" className="text-sm text-brand-700 dark:text-brand-300 inline-flex items-center gap-1 hover:underline">Tümü <ArrowRight size={14} /></Link>}>
        {forYou.map((l) => <ListingCard key={l.id} listing={l} hideStatus />)}
      </Strip>

      {/* Popüler */}
      <Strip title={t('home.stripPopular')} description="Bu hafta en çok görüntülenen ilanlar">
        {popular.map((l) => <ListingCard key={l.id} listing={l} hideStatus />)}
      </Strip>

      {/* Recent */}
      <Strip title="Yeni eklenen" description="Son 30 günde yayına giren ilanlar">
        {recent.map((l) => <ListingCard key={l.id} listing={l} hideStatus />)}
      </Strip>

      {/* Kategori grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-8">
        <SectionHeading title={t('home.stripCategories')} description="İmar tipine göre keşfedin" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { id: 'konut', label: 'Konut imarlı', Icon: House, color: 'from-brand-500 to-brand-700' },
            { id: 'tarim', label: 'Tarım arazisi', Icon: MapTrifold, color: 'from-emerald-500 to-emerald-700' },
            { id: 'turizm', label: 'Turizm imarlı', Icon: Compass, color: 'from-sky-500 to-sky-700' },
            { id: 'ticari', label: 'Ticari imarlı', Icon: Buildings, color: 'from-violet-500 to-violet-700' },
            { id: 'sanayi', label: 'Sanayi imarlı', Icon: Buildings, color: 'from-zinc-500 to-zinc-700' },
            { id: 'zeytinlik', label: 'Zeytinlik', Icon: MapTrifold, color: 'from-lime-500 to-lime-700' },
            { id: 'karma', label: 'Karma imar', Icon: Sparkle, color: 'from-accent-500 to-accent-700' },
            { id: 'imarsiz', label: 'İmarsız', Icon: MapTrifold, color: 'from-slate-500 to-slate-700' }
          ].map((c) => (
            <Link key={c.id} to={`/listings?imar=${c.id}`} className={`relative overflow-hidden rounded-r-3 p-4 text-white bg-gradient-to-br ${c.color} hover:shadow-lg transition-shadow`}>
              <c.Icon size={28} weight="duotone" className="opacity-80" />
              <div className="font-medium mt-2">{c.label}</div>
              <div className="text-xs opacity-80 mt-0.5">{liveListings.filter((l) => l.imarType === c.id).length} ilan</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Sell */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10">
        <div className="rounded-r-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 lg:p-10 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Arsanızı 5 dakikada yayınlayın</h2>
            <p className="text-fg-3 mt-2">AI yardımcı başlığı, fiyatı ve açıklamayı sizin için öneriyor. TKGM doğrulamasını tek tık ile yapın.</p>
          </div>
          <Button size="lg" iconRight={<ArrowRight size={18} />} onClick={() => navigate(auth.role === 'guest' ? '/auth?next=' + encodeURIComponent('/sell') : '/sell')}>
            {t('nav.sell')}
          </Button>
        </div>
      </section>
    </div>
  );
}

function Strip({ title, description, cta, children }: { title: string; description?: string; cta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6">
      <SectionHeading title={title} description={description} actions={cta} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{children}</div>
    </section>
  );
}
