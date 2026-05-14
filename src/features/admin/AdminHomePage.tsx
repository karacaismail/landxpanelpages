import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/store/data';
import { Stat } from '@/components/ui/Stat';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Users, MapPin, FlowArrow, ShieldCheck, Sparkle, ArrowRight, Buildings, CheckSquare, Briefcase, ChartLineUp, Clock, FlowArrow as Flow } from '@phosphor-icons/react';

export default function AdminHomePage() {
  const data = useData();
  const stats = useMemo(() => ({
    users: data.users.length,
    listings: data.listings.length,
    live: data.listings.filter((l) => l.status === 'live').length,
    pending: data.listings.filter((l) => l.status === 'review').length,
    offers: data.offers.length,
    rules: data.ecaRules.filter((r) => r.enabled).length,
    tkgmToday: data.tkgmQueries.length
  }), [data]);

  return (
    <div>
      <SectionHeading title="Yönetim Paneli" description="Sistem sağlığı, ana metrikler ve AI önerileri" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <Stat label="Toplam Kullanıcı" value={stats.users} icon={<Users size={20} weight="fill" />} />
        <Stat label="İlanlar" value={stats.listings} icon={<MapPin size={20} weight="fill" />} hint={`${stats.live} yayında`} />
        <Stat label="Bekleyen Onay" value={stats.pending} icon={<CheckSquare size={20} weight="fill" />} />
        <Stat label="Teklifler" value={stats.offers} icon={<Briefcase size={20} weight="fill" />} />
        <Stat label="Aktif Kural" value={stats.rules} icon={<FlowArrow size={20} weight="fill" />} />
        <Stat label="TKGM Sorgu" value={stats.tkgmToday} icon={<Buildings size={20} weight="fill" />} />
      </div>

      <Card className="mb-4 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI haftalık özet</span></div>
        <ul className="text-sm text-fg-2 space-y-1">
          <li>• Onay kuyruğunda {stats.pending} ilan bekliyor. Risk dağılımı: ortalama 32/100.</li>
          <li>• Yeni kayıt %12 arttı (geçen haftaya göre). 5'i kurumsal hesap.</li>
          <li>• ECA "Fiyat anomalisi" kuralı 7 kez tetiklendi.</li>
          <li>• TKGM mock başarı oranı %78. E001 hata kodu ön planda.</li>
        </ul>
        <div className="flex flex-wrap gap-2 mt-3">
          <Link to="/admin/approvals"><Button size="sm">Onay kuyruğuna git</Button></Link>
          <Link to="/admin/rules"><Button size="sm" variant="outline">Kuralları gör</Button></Link>
          <Link to="/admin/reports"><Button size="sm" variant="outline">Raporlar</Button></Link>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <RecentActivity />
        <LiveEcaActivity />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { to: '/admin/approvals', label: 'Onaylar', desc: `${stats.pending} bekleyen`, Icon: CheckSquare },
          { to: '/admin/users', label: 'Kullanıcılar', desc: `${stats.users} kayıt`, Icon: Users },
          { to: '/admin/rules', label: 'ECA Kuralları', desc: `${stats.rules} aktif`, Icon: FlowArrow },
          { to: '/admin/agent-tasks', label: 'Agent Görevleri', desc: 'A09 HITL akışları', Icon: Sparkle },
          { to: '/admin/audit', label: 'Denetim İzi', desc: 'Hash-chain log', Icon: ShieldCheck },
          { to: '/admin/tkgm', label: 'TKGM', desc: 'Entegrasyon paneli', Icon: Buildings },
          { to: '/admin/modules', label: 'Modüller', desc: '33 modül · 1398 alan', Icon: Sparkle },
          { to: '/admin/tenant', label: 'Tenant', desc: 'Multi-tenant yönetim', Icon: Buildings },
          { to: '/admin/compliance', label: 'Uyumluluk', desc: 'KVKK/GDPR/SOC2', Icon: ShieldCheck },
          { to: '/admin/plugins', label: 'Eklentiler', desc: 'Marketplace + güvenlik', Icon: Sparkle },
          { to: '/admin/reports/ai-usage', label: 'AI Kullanım', desc: 'Token + maliyet', Icon: Sparkle },
          { to: '/admin/reports/health', label: 'SLO & Sağlık', desc: 'Uptime + MTTR', Icon: Sparkle }
        ].map((it) => (
          <Link key={it.to} to={it.to}>
            <Card interactive className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-r-2 bg-brand-50 dark:bg-brand-900/30 grid place-items-center text-brand-600"><it.Icon size={20} weight="duotone" /></span>
              <div className="flex-1">
                <div className="font-medium">{it.label}</div>
                <div className="text-xs text-fg-3">{it.desc}</div>
              </div>
              <ArrowRight size={16} className="text-fg-3" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const data = useData();
  const recent = data.audit.slice(0, 6);
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium inline-flex items-center gap-2"><Clock size={16} weight="duotone" /> Son aktivite</h3>
        <Link to="/admin/audit" className="text-xs text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1">Denetim İzi <ArrowRight size={12} /></Link>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
        {recent.map((a) => {
          const u = data.users.find((x) => x.id === a.principalId);
          return (
            <li key={a.id} className="py-2 flex items-center gap-3">
              <code className="text-[11px] text-brand-700 dark:text-brand-300 shrink-0">{a.action}</code>
              <span className="text-fg-2 truncate flex-1">{a.resourceType}:{a.resourceId}</span>
              <span className="text-xs text-fg-3 shrink-0">{u?.displayName || a.principalId}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function LiveEcaActivity() {
  const data = useData();
  // Tüm kuralların son tetiklenme tarihçesini topla, en yenileri al
  const triggers = data.ecaRules
    .flatMap((r) => r.history.map((h) => ({ rule: r.name, ruleId: r.id, ...h })))
    .filter((h) => h.matched)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium inline-flex items-center gap-2">
          <FlowArrow size={16} weight="duotone" />
          Canlı ECA tetiklenmeleri
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </h3>
        <Link to="/admin/rules" className="text-xs text-brand-700 dark:text-brand-300 hover:underline inline-flex items-center gap-1">Tüm kurallar <ArrowRight size={12} /></Link>
      </div>
      {triggers.length === 0 ? (
        <div className="text-sm text-fg-3 py-4 text-center">Henüz tetiklenme yok. ECA demo runner 45 saniyede bir mock olay üretir.</div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {triggers.map((t, i) => (
            <li key={i} className="py-2 flex items-center gap-3">
              <Sparkle size={14} weight="fill" className="text-brand-500 shrink-0" />
              <span className="text-fg-2 truncate flex-1">{t.rule}</span>
              <span className="text-xs text-fg-3 shrink-0">{t.actionsRun.length} aksiyon</span>
              <span className="text-[11px] text-fg-3 shrink-0">{relTime(t.at)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'az önce';
  if (diff < 3600_000) return `${Math.round(diff / 60_000)}dk önce`;
  if (diff < 86400_000) return `${Math.round(diff / 3600_000)}sa önce`;
  return `${Math.round(diff / 86400_000)}g önce`;
}
