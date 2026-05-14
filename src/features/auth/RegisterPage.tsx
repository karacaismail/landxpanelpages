import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[80dvh] grid place-items-center px-4 py-8">
      <Card className="w-full max-w-md p-6 lg:p-8 space-y-4">
        <h1 className="text-2xl font-semibold">{t('auth.register')}</h1>
        <Input label="Ad Soyad" block />
        <Input label={t('auth.email')} type="email" block />
        <Input label="Telefon" type="tel" block />
        <Input label={t('auth.password')} type="password" block />
        <label className="text-sm inline-flex items-start gap-2"><input type="checkbox" className="mt-1" /> KVKK aydınlatma metnini ve kullanım koşullarını kabul ediyorum.</label>
        <Button block>{t('nav.register')}</Button>
        <p className="text-sm text-center text-fg-3">Hesabınız var mı? <Link to="/auth" className="text-brand-700 dark:text-brand-300 hover:underline">{t('nav.auth')}</Link></p>
      </Card>
    </div>
  );
}
