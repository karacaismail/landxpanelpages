import { useParams } from 'react-router-dom';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    body: [
      'LandX olarak kişisel verilerinizi 6698 sayılı KVKK kapsamında işliyoruz.',
      'İşleme amaçları: hizmetin sunulması, güvenlik, iletişim, yasal yükümlülükler.',
      'Veri sahibi haklarınız: erişim, düzeltme, silme, taşıma, itiraz, sınırlama. Bu hakları profil ayarlarınızdan dijital olarak kullanabilirsiniz (KVKK m.11).',
      'İletişim: kvkk@landx.test'
    ]
  },
  terms: {
    title: 'Kullanım Koşulları',
    body: [
      'LandX platformunu kullanmadan önce bu koşulları okumanız zorunludur.',
      'İlanların doğruluğu satıcı sorumluluğundadır. Platform, aracılık hizmeti sağlar.',
      'TKGM verisi yalnızca doğrulama amaçlı olup yasal tapu işlemi yerine geçmez.'
    ]
  },
  cookies: {
    title: 'Çerez Tercihleri',
    body: [
      'Zorunlu çerezler (oturum, güvenlik) varsayılan olarak açıktır.',
      'Performans çerezleri sayfa hız ölçümü içindir. Pazarlama çerezleri tercihinize bağlıdır.',
      'Tercihinizi dilediğiniz zaman güncelleyebilirsiniz.'
    ]
  },
  accessibility: {
    title: 'Erişilebilirlik Beyanı',
    body: [
      'LandX, WCAG 2.1 AA standartlarına uygun arayüz hedefler.',
      'Klavye navigasyonu, ekran okuyucu desteği ve yüksek kontrast modu mevcuttur.',
      'Geri bildiriminizi access@landx.test adresine iletebilirsiniz.'
    ]
  },
  ai: {
    title: 'AI Uyumluluk Beyanı',
    body: [
      'LandX, AI önerilerini destek amaçlı sunar; nihai karar her zaman kullanıcıya aittir.',
      'Risk skoru ve değerleme bantları örüntü tabanlıdır, finansal tavsiye değildir.',
      'Veri kullanım izinleriniz hesap > tercihler altından yönetilir.'
    ]
  }
};

export default function LegalPage() {
  const { slug } = useParams();
  const data = CONTENT[(slug || 'kvkk')] || CONTENT.kvkk;
  return (
    <div className="max-w-3xl mx-auto px-3 lg:px-6 py-6">
      <SectionHeading title={data.title} />
      <Card>
        <div className="space-y-3 text-fg-2">
          {data.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Card>
    </div>
  );
}
