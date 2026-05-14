import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { BellSimple, EnvelopeSimple, ChatText, DeviceMobileCamera } from '@phosphor-icons/react';

const TEMPLATES = [
  { id: 't-001', name: 'Yeni teklif aldınız', channel: 'in_app', body: '{listing} ilanına {amount} ₺ teklif geldi.' },
  { id: 't-002', name: 'Fiyat alarmı', channel: 'in_app', body: '{count} yeni ilan kayıtlı aramanızla eşleşti.' },
  { id: 't-003', name: 'KYC hatırlatma', channel: 'email', body: 'Hesabınızı tamamlamak için kimlik doğrulamasını tamamlayın.' },
  { id: 't-004', name: 'TKGM uyarısı', channel: 'in_app', body: '{listing} için TKGM durumu değişti.' },
  { id: 't-005', name: 'Randevu hatırlatma', channel: 'push', body: 'Yarın {time} görme randevunuz var.' },
  { id: 't-006', name: 'Hoş geldiniz', channel: 'email', body: 'LandX\'e hoş geldiniz. Hızlı başlangıç rehberi.' }
];

const CHANNEL_ICONS: Record<string, typeof BellSimple> = { in_app: BellSimple, email: EnvelopeSimple, sms: ChatText, push: DeviceMobileCamera };

export default function NotificationsAdminPage() {
  const [active, setActive] = useState(TEMPLATES[0]);
  return (
    <div>
      <SectionHeading title="Bildirim Şablonları" description="In-app / E-posta / SMS / Push" />
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 !p-0 overflow-hidden">
          <ul>
            {TEMPLATES.map((t) => {
              const Icon = CHANNEL_ICONS[t.channel] || BellSimple;
              return (
                <li key={t.id}>
                  <button onClick={() => setActive(t)} className={`w-full text-left p-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 ${active.id === t.id ? 'bg-brand-50 dark:bg-brand-900/30' : ''}`}>
                    <Icon size={18} weight="duotone" className="text-fg-3" />
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-fg-3">{t.channel}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="lg:col-span-2 space-y-3">
          <Input label="Şablon adı" defaultValue={active.name} block />
          <div>
            <label className="text-sm font-medium text-fg-2">Mesaj</label>
            <textarea defaultValue={active.body} rows={5} className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base" />
          </div>
          <div className="text-xs text-fg-3">Değişkenler: <code>{`{listing}`}</code>, <code>{`{amount}`}</code>, <code>{`{count}`}</code>, <code>{`{time}`}</code></div>
          <div className="flex gap-2">
            <Button>Kaydet</Button>
            <Button variant="outline">Önizle</Button>
            <Button variant="ghost">Test gönder</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
