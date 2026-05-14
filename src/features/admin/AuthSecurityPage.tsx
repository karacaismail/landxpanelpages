// I03 Authentication & Sessions — MFA, Step-up, Risk-based auth, credentials
import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Button } from '@/components/ui/Button';
import { AiBadge } from '@/components/ui/AiBadge';
import {
  ShieldCheck, Key, DeviceMobile, Lock, Warning, CheckCircle, Eye, EyeSlash, Sparkle, X, ArrowsClockwise,
  Lightning, GlobeHemisphereEast, Fingerprint, ChartLineUp, Brain
} from '@phosphor-icons/react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { cls } from '@/lib/utils/cls';
import { toast } from '@/store/toast';

interface MfaUser {
  id: string;
  name: string;
  email: string;
  mfaMethods: string[];
  primaryMethod: 'totp' | 'sms' | 'passkey' | 'email' | 'none';
  riskScore: number;
  lastLogin: string;
  lastIp: string;
  device: string;
  status: 'protected' | 'partial' | 'unprotected';
}

const MFA_USERS: MfaUser[] = [
  { id: 'u-001', name: 'Ahmet Demir', email: 'ahmet@anadolu.test', mfaMethods: ['passkey', 'totp', 'sms'], primaryMethod: 'passkey', riskScore: 8, lastLogin: '2sn önce', lastIp: '88.230.x.x (TR)', device: 'Mac · Chrome', status: 'protected' },
  { id: 'u-002', name: 'Ayşe Kaya', email: 'ayse@kiyiemlak.test', mfaMethods: ['totp'], primaryMethod: 'totp', riskScore: 18, lastLogin: '15dk önce', lastIp: '85.99.x.x (TR)', device: 'iPhone · Safari', status: 'protected' },
  { id: 'u-003', name: 'Mehmet Yıldırım', email: 'mehmet@…', mfaMethods: ['sms'], primaryMethod: 'sms', riskScore: 32, lastLogin: '1sa önce', lastIp: '78.165.x.x (TR)', device: 'Android · Firefox', status: 'partial' },
  { id: 'u-004', name: 'Zeynep Bulut', email: 'zeynep@…', mfaMethods: ['email'], primaryMethod: 'email', riskScore: 48, lastLogin: '3sa önce', lastIp: '95.140.x.x (TR)', device: 'Windows · Edge', status: 'partial' },
  { id: 'u-005', name: 'Cem Özdemir', email: 'cem@…', mfaMethods: [], primaryMethod: 'none', riskScore: 78, lastLogin: '12sa önce', lastIp: '92.45.x.x (TR)', device: 'Mac · Safari', status: 'unprotected' },
  { id: 'u-006', name: 'Tuncay Kara', email: 'tuncay@…', mfaMethods: ['totp', 'passkey'], primaryMethod: 'passkey', riskScore: 12, lastLogin: '1dk önce', lastIp: '78.165.x.x (TR)', device: 'iPhone · Safari', status: 'protected' },
  { id: 'u-007', name: 'Hasan Akın', email: 'hasan@…', mfaMethods: [], primaryMethod: 'none', riskScore: 91, lastLogin: '5dk önce', lastIp: '186.x.x.x (BR)', device: 'Linux · Chrome', status: 'unprotected' }
];

interface RiskEvent {
  id: string;
  at: string;
  user: string;
  type: 'unusual_geo' | 'impossible_travel' | 'tor_exit' | 'failed_attempts' | 'new_device' | 'leaked_password';
  riskAdd: number;
  action: 'allow' | 'step_up' | 'block' | 'review';
  resolved: boolean;
}

const RISK_EVENTS: RiskEvent[] = [
  { id: 'risk-001', at: '14:22:18', user: 'Hasan A.', type: 'unusual_geo', riskAdd: 28, action: 'step_up', resolved: true },
  { id: 'risk-002', at: '13:48:02', user: 'Hasan A.', type: 'impossible_travel', riskAdd: 35, action: 'block', resolved: false },
  { id: 'risk-003', at: '12:14:40', user: 'Cem Ö.', type: 'new_device', riskAdd: 18, action: 'step_up', resolved: true },
  { id: 'risk-004', at: '11:02:18', user: 'Zeynep B.', type: 'failed_attempts', riskAdd: 22, action: 'step_up', resolved: true },
  { id: 'risk-005', at: '09:34:12', user: 'unknown', type: 'tor_exit', riskAdd: 50, action: 'block', resolved: true },
  { id: 'risk-006', at: '08:12:08', user: 'Mehmet Y.', type: 'leaked_password', riskAdd: 45, action: 'review', resolved: false }
];

const RISK_LABEL: Record<RiskEvent['type'], string> = {
  unusual_geo: 'Olağandışı coğrafya',
  impossible_travel: 'İmkansız seyahat',
  tor_exit: 'TOR exit node',
  failed_attempts: '5+ başarısız deneme',
  new_device: 'Yeni cihaz',
  leaked_password: 'HIBP eşleşme (sızdırılmış parola)'
};

const ACTION_CLS: Record<RiskEvent['action'], string> = {
  allow: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  step_up: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  block: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  review: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300'
};

const METHOD_ICON: Record<string, typeof Key> = {
  totp: Key, sms: DeviceMobile, passkey: Fingerprint, email: Lock, none: EyeSlash
};

export default function AuthSecurityPage() {
  const [tab, setTab] = useState<'overview' | 'mfa' | 'risk' | 'sessions' | 'policies'>('overview');

  const series = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    logins: Math.round(120 + Math.sin(i / 3) * 50 + Math.random() * 30),
    failed: Math.round(Math.random() * 8),
    stepUp: Math.round(Math.random() * 5)
  })), []);

  const protectedCount = MFA_USERS.filter((u) => u.status === 'protected').length;
  const partialCount = MFA_USERS.filter((u) => u.status === 'partial').length;
  const unprotectedCount = MFA_USERS.filter((u) => u.status === 'unprotected').length;
  const totalMfaRate = Math.round(((protectedCount + partialCount * 0.5) / MFA_USERS.length) * 100);

  return (
    <div>
      <SectionHeading
        title="Auth & Security (I03)"
        description="MFA, Step-up Challenge, Risk-based Auth, Passkey/WebAuthn, Agent Token"
        actions={
          <div className="flex gap-1.5">
            <AiBadge>Excel I03</AiBadge>
            <Button size="sm" iconLeft={<Sparkle size={14} weight="fill" />} onClick={() => toast('ai', 'AI risk taraması', 'Mock: 7 kullanıcının davranışı son 24sa\'de değerlendirildi, 2 anormal.')}>AI tarama</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="MFA aktif" value={`${totalMfaRate}%`} icon={<ShieldCheck size={20} weight="fill" />} hint={`${protectedCount} korunmalı`} />
        <Stat label="Passkey kullanıcı" value={MFA_USERS.filter((u) => u.mfaMethods.includes('passkey')).length} icon={<Fingerprint size={20} weight="fill" />} hint="WebAuthn FIDO2" />
        <Stat label="Step-up bekleyen" value={RISK_EVENTS.filter((r) => r.action === 'step_up' && !r.resolved).length} icon={<Lightning size={20} weight="fill" />} />
        <Stat label="Yüksek risk" value={MFA_USERS.filter((u) => u.riskScore >= 60).length} icon={<Warning size={20} weight="fill" />} hint="Skor ≥ 60" />
        <Stat label="Blokları (24sa)" value={RISK_EVENTS.filter((r) => r.action === 'block').length} icon={<X size={20} weight="fill" />} hint="Otomatik" />
      </div>

      <div className="flex gap-0.5 border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Genel', Icon: ChartLineUp },
          { id: 'mfa' as const, label: 'MFA Yöntemleri', Icon: Fingerprint },
          { id: 'risk' as const, label: 'Risk Olayları', Icon: Warning },
          { id: 'sessions' as const, label: 'Aktif Oturumlar', Icon: GlobeHemisphereEast },
          { id: 'policies' as const, label: 'Politikalar', Icon: Lock }
        ].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cls(
            'inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px',
            tab === id ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-medium' : 'border-transparent text-fg-3 hover:text-fg-1'
          )}>
            <Icon size={14} weight={tab === id ? 'fill' : 'regular'} /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-3">
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><ChartLineUp size={14} /> Saatlik login (son 24sa)</h3>
            <div className="h-48">
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="logins" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="font-medium mb-2 inline-flex items-center gap-2"><Warning size={14} /> Başarısız denemeler / Step-up</h3>
            <div className="h-48">
              <ResponsiveContainer>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="failed" fill="#ef4444" />
                  <Bar dataKey="stepUp" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-2 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
            <div className="flex items-start gap-3">
              <Brain size={20} weight="fill" className="text-brand-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">AI Risk Değerlendirme</h3>
                <p className="text-sm text-fg-2 mt-1">
                  <strong>{unprotectedCount} kullanıcının MFA'sı yok.</strong> Aktivasyon önerisi: passkey self-enrollment kampanyası (mock + push bildirimi).
                  Son 24sa'de <strong>{RISK_EVENTS.length} risk olayı</strong> yakalandı; 1 kritik (TOR exit) otomatik bloklandı.
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Button size="xs" onClick={() => toast('success', 'Kampanya başladı', `${unprotectedCount} kullanıcıya MFA aktivasyon push gönderildi.`)}>MFA kampanyası</Button>
                  <Button size="xs" variant="outline" onClick={() => toast('info', 'AI rapor', 'auth-risk-2026-05.pdf hazırlandı.')}>Risk raporu</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'mfa' && (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-fg-3 text-xs">
                  <th className="text-left px-3 py-2">Kullanıcı</th>
                  <th className="text-left px-3 py-2 hidden md:table-cell">Yöntemler</th>
                  <th className="text-left px-3 py-2 hidden sm:table-cell">Primary</th>
                  <th className="text-right px-3 py-2">Risk skoru</th>
                  <th className="text-left px-3 py-2 hidden lg:table-cell">Son login</th>
                  <th className="text-left px-3 py-2">Durum</th>
                  <th className="text-right px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {MFA_USERS.map((u) => {
                  const PrimaryIcon = METHOD_ICON[u.primaryMethod];
                  return (
                    <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <td className="px-3 py-2">
                        <div className="font-medium text-sm">{u.name}</div>
                        <div className="text-[11px] text-fg-3">{u.email}</div>
                      </td>
                      <td className="px-3 py-2 hidden md:table-cell">
                        <div className="flex gap-1">
                          {u.mfaMethods.length === 0 && <span className="text-[10px] text-rose-600">— hiçbiri</span>}
                          {u.mfaMethods.map((m) => {
                            const I = METHOD_ICON[m];
                            return <span key={m} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800"><I size={10} /> {m}</span>;
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell">
                        <code className="text-xs inline-flex items-center gap-1"><PrimaryIcon size={12} /> {u.primaryMethod}</code>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={cls('font-bold tabular-nums', u.riskScore >= 60 ? 'text-rose-600' : u.riskScore >= 30 ? 'text-amber-600' : 'text-emerald-600')}>
                          {u.riskScore}
                        </span>
                      </td>
                      <td className="px-3 py-2 hidden lg:table-cell text-xs text-fg-3">{u.lastLogin}</td>
                      <td className="px-3 py-2">
                        <span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded',
                          u.status === 'protected' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                            u.status === 'partial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        )}>
                          {u.status === 'protected' ? 'korunmalı' : u.status === 'partial' ? 'kısmi' : 'korumasız'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        {u.status !== 'protected' && (
                          <Button size="xs" variant="outline" onClick={() => toast('info', 'MFA zorlandı', `${u.name} bir sonraki login\'de step-up isteyecek.`)}>MFA zorla</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'risk' && (
        <Card className="!p-0 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Warning size={14} className="text-amber-500" />
            <span className="text-sm font-medium">Son 24 saat risk olayları</span>
            <span className="ml-auto text-xs text-fg-3">{RISK_EVENTS.length} olay</span>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {RISK_EVENTS.map((r) => (
              <li key={r.id} className="px-3 py-2.5 flex items-start gap-3">
                <span className="text-xs text-fg-3 tabular-nums w-16 shrink-0">{r.at}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{r.user}</span>
                    <span className="text-xs text-fg-3">·</span>
                    <code className="text-xs text-amber-700 dark:text-amber-300">{RISK_LABEL[r.type]}</code>
                  </div>
                  <div className="text-[11px] text-fg-3 mt-0.5">Risk +{r.riskAdd} · Aksiyon: <strong>{r.action.replace('_', ' ')}</strong></div>
                </div>
                <span className={cls('text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0', ACTION_CLS[r.action])}>{r.action}</span>
                {r.resolved
                  ? <CheckCircle size={14} weight="fill" className="text-emerald-500 shrink-0" />
                  : <Button size="xs" variant="outline" onClick={() => toast('success', 'Olay çözüldü', `${r.id} resolve edildi.`)}>Çöz</Button>}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'sessions' && (
        <Card>
          <h3 className="font-medium mb-2 inline-flex items-center gap-2"><GlobeHemisphereEast size={14} /> Aktif Oturumlar ({MFA_USERS.length})</h3>
          <ul className="space-y-2">
            {MFA_USERS.map((u) => (
              <li key={u.id} className="flex items-center gap-3 p-2 rounded-r-2 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-[11px] text-fg-3">
                    {u.device} · {u.lastIp} · son aktivite {u.lastLogin}
                  </div>
                </div>
                <Button size="xs" variant="ghost" iconLeft={<X size={12} />} onClick={() => toast('warning', 'Oturum sonlandırıldı', `${u.name} log out yapıldı.`)}>Sonlandır</Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'policies' && (
        <div className="space-y-3">
          <Card>
            <h3 className="font-medium mb-2">Parola politikası</h3>
            <ul className="text-sm space-y-1">
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Minimum 12 karakter</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Büyük/küçük + rakam + özel karakter</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> HIBP (Have I Been Pwned) kontrolü aktif</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> Son 12 parola tekrar kullanılamaz</li>
              <li className="inline-flex items-center gap-2"><CheckCircle size={14} weight="fill" className="text-emerald-500" /> 90 günde bir rotasyon (admin için)</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-medium mb-2">Step-up zorlanan durumlar</h3>
            <ul className="text-sm space-y-1">
              <li className="inline-flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Yeni cihazdan login</li>
              <li className="inline-flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Risk skoru ≥ 40</li>
              <li className="inline-flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Admin paneline erişim (her oturumda)</li>
              <li className="inline-flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Tenant değiştirme</li>
              <li className="inline-flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Veri export, KYC değişikliği, ödeme</li>
              <li className="inline-flex items-center gap-2"><Warning size={14} weight="fill" className="text-amber-500" /> Impersonate başlatma</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-medium mb-2">Otomatik bloklamalar</h3>
            <ul className="text-sm space-y-1">
              <li className="inline-flex items-center gap-2"><X size={14} weight="fill" className="text-rose-500" /> TOR exit node tespiti</li>
              <li className="inline-flex items-center gap-2"><X size={14} weight="fill" className="text-rose-500" /> İmkansız seyahat (15dk içinde 1000+km)</li>
              <li className="inline-flex items-center gap-2"><X size={14} weight="fill" className="text-rose-500" /> 10+ başarısız deneme (15dk)</li>
              <li className="inline-flex items-center gap-2"><X size={14} weight="fill" className="text-rose-500" /> Brute-force user enumeration</li>
              <li className="inline-flex items-center gap-2"><X size={14} weight="fill" className="text-rose-500" /> Otomatik bot tespiti (UA + davranış)</li>
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
