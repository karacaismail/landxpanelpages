import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { AiBadge } from '@/components/ui/AiBadge';
import { Fingerprint, EnvelopeSimple, GoogleLogo, AppleLogo, UserCircle, ShoppingCart, Storefront, ShieldStar, Sparkle } from '@phosphor-icons/react';

export default function AuthPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get('next') || '/';
  const [email, setEmail] = useState('');

  function loginAs(role: 'buyer' | 'seller' | 'admin') {
    const u = data.users.find((x) => x.roles.includes(role) && x.status === 'active');
    if (u) {
      auth.setUser(u.id, role);
      navigate(role === 'admin' ? '/admin' : role === 'seller' ? '/seller' : next);
    }
  }

  function loginGuest() {
    auth.logout();
    navigate(next);
  }

  return (
    <div className="min-h-[80dvh] grid place-items-center px-4 py-8">
      <Card className="w-full max-w-md p-6 lg:p-8 space-y-5">
        <div className="text-center">
          <AiBadge>AI-first</AiBadge>
          <h1 className="text-2xl font-semibold mt-2">{t('auth.title')}</h1>
          <p className="text-fg-3 text-sm mt-1">{t('auth.subtitle')}</p>
        </div>

        {/* Passkey + Magic + Social */}
        <div className="space-y-2">
          <Button block iconLeft={<Fingerprint size={18} />} variant="primary">{t('auth.loginPasskey')}</Button>
          <Button block iconLeft={<EnvelopeSimple size={18} />} variant="outline">{t('auth.loginMagic')}</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button block iconLeft={<GoogleLogo size={18} />} variant="outline">Google</Button>
            <Button block iconLeft={<AppleLogo size={18} />} variant="outline">Apple</Button>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-fg-3">{t('common.or')}</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); loginAs('buyer'); }}>
          <Input label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} block />
          <Input label={t('auth.password')} type="password" block />
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" /> {t('auth.remember')}</label>
            <Link to="#" className="text-brand-700 dark:text-brand-300 hover:underline">{t('auth.forgot')}</Link>
          </div>
          <Button block type="submit">{t('nav.auth')}</Button>
        </form>

        <div className="rounded-r-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-3 inline-flex items-center gap-1.5 mb-2">
            <Sparkle size={12} weight="fill" className="text-brand-500" /> {t('auth.loginAs')}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" iconLeft={<ShoppingCart size={14} />} onClick={() => loginAs('buyer')}>{t('auth.asBuyer')}</Button>
            <Button size="sm" variant="outline" iconLeft={<Storefront size={14} />} onClick={() => loginAs('seller')}>{t('auth.asSeller')}</Button>
            <Button size="sm" variant="outline" iconLeft={<ShieldStar size={14} />} onClick={() => loginAs('admin')}>{t('auth.asAdmin')}</Button>
          </div>
          <Button size="sm" variant="ghost" block className="mt-2" iconLeft={<UserCircle size={14} />} onClick={loginGuest}>{t('auth.asGuest')}</Button>
        </div>

        <p className="text-sm text-center text-fg-3">{t('auth.noAccount')} <Link to="/auth/register" className="text-brand-700 dark:text-brand-300 hover:underline">{t('auth.register')}</Link></p>
      </Card>
    </div>
  );
}
