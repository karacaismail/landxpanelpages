import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Stat } from '@/components/ui/Stat';
import { AiBadge } from '@/components/ui/AiBadge';
import { Sparkle, ShieldCheck, Buildings, CurrencyCircleDollar, FlowArrow, ArrowRight, CheckCircle, MapPin } from '@phosphor-icons/react';

export default function SellPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const data = useData();

  // Auth'lu seller direkt wizard'a yönlensin
  useEffect(() => {
    if (auth.role === 'seller' || auth.role === 'admin') {
      navigate('/seller/listings/new', { replace: true });
    }
  }, [auth.role, navigate]);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 text-white">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12 lg:py-20 text-center">
          <AiBadge className="!bg-white/20 !text-white !border-white/30 mb-3 inline-flex">C2C — Bireysel ilan yayını</AiBadge>
          <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight">Arsanızı 5 dakikada yayınlayın</h1>
          <p className="mt-3 text-white/90 lg:text-lg max-w-2xl mx-auto">AI yardımcı başlık, açıklama ve fiyatı sizin için önerir. TKGM doğrulamasını tek tık ile yapın. Komisyon yok, ilk yayın ücretsiz.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {auth.role === 'guest'
              ? <>
                  <Link to="/auth?next=%2Fsell"><Button size="lg" className="!bg-white !text-brand-700 hover:!bg-white/90">Giriş yap / Kayıt ol</Button></Link>
                  <Link to="/listings"><Button size="lg" variant="outline" className="!border-white !text-white hover:!bg-white/10">Önce keşfet</Button></Link>
                </>
              : <Link to="/seller/listings/new"><Button size="lg" className="!bg-white !text-brand-700 hover:!bg-white/90" iconRight={<ArrowRight size={18} />}>İlan oluşturmaya başla</Button></Link>}
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Yayında ilan" value={data.listings.filter((l) => l.status === 'live').length} icon={<MapPin size={20} weight="fill" />} />
        <Stat label="Bireysel satıcı" value={data.users.filter((u) => u.roles.includes('seller') && u.principalType === 'individual').length} icon={<Buildings size={20} weight="fill" />} />
        <Stat label="Ortalama yayın süresi" value="<5dk" icon={<Sparkle size={20} weight="fill" />} hint="AI yardımcılı" />
        <Stat label="Komisyon" value="0%" icon={<CurrencyCircleDollar size={20} weight="fill" />} hint="İlk yayın ücretsiz" />
      </section>

      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10">
        <SectionHeading title="Nasıl çalışır?" description="6 adımda yayın — sihirbaz size eşlik eder" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { Icon: MapPin, t: '1. Konum', d: 'İl, ilçe, parsel girin veya TKGM ile otomatik doldurun.' },
            { Icon: Buildings, t: '2. Detaylar', d: 'm², imar, tapu tipi, altyapı, öne çıkan özellikler.' },
            { Icon: Sparkle, t: '3. Görseller', d: 'Drag-drop ile yükleyin. AI kapak görselini seçer.' },
            { Icon: CurrencyCircleDollar, t: '4. Fiyat', d: 'AI bölge emsallerine göre alt/önerilen/üst değer sunar.' },
            { Icon: FlowArrow, t: '5. Açıklama', d: 'Tek tık AI taslak; düzenleyip kişiselleştirin.' },
            { Icon: CheckCircle, t: '6. Önizle + Yayınla', d: 'Tüm bilgileri kontrol edin, onay kuyruğuna gönderin.' }
          ].map((s) => (
            <Card key={s.t}>
              <s.Icon size={28} weight="duotone" className="text-brand-500" />
              <h3 className="font-medium mt-2">{s.t}</h3>
              <p className="text-sm text-fg-3 mt-1">{s.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-10">
        <SectionHeading title="Güvenli yayın" description="TKGM, KYC, AI risk skoru bütünleşik" />
        <div className="grid md:grid-cols-3 gap-3">
          <Card>
            <ShieldCheck size={28} weight="duotone" className="text-emerald-500" />
            <h3 className="font-medium mt-2">TKGM doğrulama</h3>
            <p className="text-sm text-fg-3 mt-1">Ada/parsel sorgusu tek tık. Yüzölçümü, cinsi ve hisse otomatik form'a düşer.</p>
          </Card>
          <Card>
            <Sparkle size={28} weight="duotone" className="text-brand-500" />
            <h3 className="font-medium mt-2">AI risk skoru</h3>
            <p className="text-sm text-fg-3 mt-1">TKGM, tapu tipi, imar ve altyapı verilerinden alıcılara şeffaf risk göstergesi.</p>
          </Card>
          <Card>
            <CheckCircle size={28} weight="duotone" className="text-accent-500" />
            <h3 className="font-medium mt-2">KYC + KVKK</h3>
            <p className="text-sm text-fg-3 mt-1">Kimlik doğrulama opsiyonel ama yayında "Doğrulanmış satıcı" rozeti sağlar.</p>
          </Card>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 lg:px-6 py-12">
        <Card className="p-6 lg:p-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-semibold">Hazır mısınız?</h2>
            <p className="text-fg-3 mt-2">İlk ilanınız ücretsiz. AI yardımcı yanınızda. 5 dakikada yayında olun.</p>
          </div>
          {auth.role === 'guest'
            ? <Link to="/auth?next=%2Fsell"><Button size="lg" iconRight={<ArrowRight size={18} />}>Başla</Button></Link>
            : <Link to="/seller/listings/new"><Button size="lg" iconRight={<ArrowRight size={18} />}>İlan oluştur</Button></Link>}
        </Card>
      </section>
    </div>
  );
}
