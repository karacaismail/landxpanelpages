import { useMemo } from 'react';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { SectionHeading } from '@/components/data/SectionHeading';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { Eye, Briefcase, ChatCircle, Sparkle, ChartLineUp } from '@phosphor-icons/react';

export default function PerformancePage() {
  const auth = useAuth();
  const data = useData();

  const mine = useMemo(() => data.listings.filter((l) => l.ownerId === auth.currentUserId), [data.listings, auth.currentUserId]);
  const totalViews = mine.reduce((s, l) => s + l.views, 0);
  const totalMsg = mine.reduce((s, l) => s + l.messageCount, 0);
  const totalOff = data.offers.filter((o) => o.sellerId === auth.currentUserId).length;

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    views: Math.round(50 + Math.random() * 200 + Math.sin(i / 3) * 60),
    messages: Math.round(2 + Math.random() * 10)
  }));

  const cityBuckets = useMemo(() => {
    const m = new Map<string, number>();
    mine.forEach((l) => m.set(l.city, (m.get(l.city) || 0) + l.views));
    return Array.from(m.entries()).map(([city, views]) => ({ city, views })).sort((a, b) => b.views - a.views).slice(0, 6);
  }, [mine]);

  return (
    <div>
      <SectionHeading title="Performans" description="İlanlarınızın 30 günlük özeti" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Görüntülenme" value={totalViews.toLocaleString('tr-TR')} delta={{ value: 12.4 }} icon={<Eye size={20} weight="fill" />} />
        <Stat label="Mesajlar" value={totalMsg} delta={{ value: 6.8 }} icon={<ChatCircle size={20} weight="fill" />} />
        <Stat label="Teklifler" value={totalOff} delta={{ value: -2.3 }} icon={<Briefcase size={20} weight="fill" />} />
        <Stat label="Dönüşüm" value={`${Math.round((totalOff / Math.max(1, totalViews)) * 100 * 100) / 100}%`} delta={{ value: 0.4 }} icon={<ChartLineUp size={20} weight="fill" />} hint="Görüntülemeden teklife" />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Görüntülenme — 30 gün</h3>
          <div className="text-xs text-fg-3 inline-flex items-center gap-1"><Sparkle size={12} weight="fill" className="text-brand-500" /> AI tahmin: +%8 ay sonu</div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="rgb(100,116,139)" />
              <YAxis tick={{ fontSize: 11 }} stroke="rgb(100,116,139)" />
              <Tooltip />
              <Area type="monotone" dataKey="views" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-2">İl bazlı görüntülenme</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityBuckets} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="city" tick={{ fontSize: 11 }} stroke="rgb(100,116,139)" />
              <YAxis tick={{ fontSize: 11 }} stroke="rgb(100,116,139)" />
              <Tooltip />
              <Bar dataKey="views" fill="#c97f1d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
