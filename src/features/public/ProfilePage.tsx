import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { setLocale } from '@/i18n';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const me = data.users.find((u) => u.id === auth.currentUserId);
  const [name, setName] = useState(me?.fullName || '');
  const [phone, setPhone] = useState(me?.phone || '');
  const [bio, setBio] = useState(me?.bio || '');

  if (!me) return null;

  return (
    <div className="max-w-3xl mx-auto px-3 lg:px-6 py-4 lg:py-6 space-y-4">
      <SectionHeading title={t('nav.profile')} description={`${me.displayName} · ${auth.role}`} />
      <Card className="space-y-3">
        <div className="flex items-center gap-3">
          <img src={me.avatarUrl} className="w-16 h-16 rounded-full bg-slate-200 object-cover" alt="" />
          <div>
            <div className="font-medium">{me.displayName}</div>
            <div className="text-sm text-fg-3">{me.email}</div>
          </div>
        </div>
        <Input label="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} block />
        <Input label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} block />
        <div>
          <label className="text-sm font-medium text-fg-2">Hakkında</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base" rows={3} />
        </div>
        <div className="flex gap-2">
          <Button>{t('actions.save')}</Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-medium">Tercihler</h3>
        <div className="flex items-center justify-between text-sm">
          <span>Dil</span>
          <select className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5" value={i18n.language} onChange={(e) => setLocale(e.target.value as 'tr' | 'en')}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <ToggleRow label="E-posta bildirimleri" initial={me.preferences.notifyEmail} />
        <ToggleRow label="SMS bildirimleri" initial={me.preferences.notifySms} />
        <ToggleRow label="Push bildirimleri" initial={me.preferences.notifyPush} />
      </Card>

      <Card>
        <h3 className="font-medium mb-2">Gizlilik (KVKK)</h3>
        <p className="text-sm text-fg-3">Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için <a className="text-brand-700 dark:text-brand-300 hover:underline" href="#/legal/kvkk">KVKK Aydınlatma Metni</a>ni inceleyin.</p>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" onClick={() => exportMyData(me)}>Verilerimi dışa aktar (KVKK m.11)</Button>
          <Button variant="danger" onClick={() => alert('Hesap silme talebi alındı. 30 gün içinde tüm verileriniz silinecek (mock).')}>Hesabı silme talebi (KVKK m.7)</Button>
        </div>
      </Card>
    </div>
  );
}

function exportMyData(me: import('@/types/domain').User) {
  // Mock: collect everything visible about the user into a JSON
  const payload = {
    exportedAt: new Date().toISOString(),
    profile: {
      id: me.id, displayName: me.displayName, email: me.email, phone: me.phone,
      fullName: me.fullName, locale: me.locale, timezone: me.timezone,
      kycLevel: me.kycLevel, status: me.status, roles: me.roles,
      createdAt: me.createdAt, lastSeenAt: me.lastSeenAt,
      preferences: me.preferences, bio: me.bio
    },
    note: 'Bu dosya KVKK madde 11 kapsamında ihraç edilmiştir (mock). Detaylar için kvkk@landx.test'
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `landx-data-${me.id}-${Date.now()}.json`;
  a.click();
}

function ToggleRow({ label, initial }: { label: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <label className="flex items-center justify-between text-sm cursor-pointer">
      <span>{label}</span>
      <button onClick={() => setOn(!on)} aria-pressed={on} className={`w-10 h-6 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'} translate-y-0.5`} />
      </button>
    </label>
  );
}
