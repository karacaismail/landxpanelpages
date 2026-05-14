import { useMemo } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Users, MapPin, Briefcase, ChartLineUp } from '@phosphor-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0e7c61', '#c97f1d', '#2563eb', '#d97706', '#dc2626', '#16a34a', '#7c3aed', '#475569'];

export default function ReportsPage() {
  const data = useData();

  const cityBuckets = useMemo(() => {
    const m = new Map<string, number>();
    data.listings.forEach((l) => m.set(l.city, (m.get(l.city) || 0) + 1));
    return Array.from(m.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [data.listings]);

  const imarPie = useMemo(() => {
    const m = new Map<string, number>();
    data.listings.forEach((l) => m.set(l.imarType, (m.get(l.imarType) || 0) + 1));
    return Array.from(m.entries()).map(([imar, value]) => ({ name: imar, value }));
  }, [data.listings]);

  const days = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    listings: Math.round(6 + Math.sin(i / 4) * 3 + Math.random() * 4),
    offers: Math.round(3 + Math.cos(i / 5) * 2 + Math.random() * 3)
  })), []);

  return (
    <div>
      <SectionHeading title="Raporlar" description="Sistem geneli — son 30 gün" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Kullanıcı" value={data.users.length} icon={<Users size={20} weight="fill" />} delta={{ value: 12.4 }} />
        <Stat label="İlanlar" value={data.listings.length} icon={<MapPin size={20} weight="fill" />} delta={{ value: 8.2 }} />
        <Stat label="Teklifler" value={data.offers.length} icon={<Briefcase size={20} weight="fill" />} delta={{ value: 3.1 }} />
        <Stat label="Ortalama dönüşüm" value="4.2%" icon={<ChartLineUp size={20} weight="fill" />} delta={{ value: 0.4 }} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <h3 className="font-medium mb-2">Günlük yayın aktivitesi</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="listings" stroke="#0e7c61" fill="rgba(14,124,97,0.2)" />
                <Area type="monotone" dataKey="offers" stroke="#c97f1d" fill="rgba(201,127,29,0.18)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">İmar dağılımı</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={imarPie} dataKey="value" nameKey="name" outerRadius={80} label>
                  {imarPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-medium mb-2">İl bazlı ilan sayısı (Top 10)</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={cityBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="city" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0e7c61" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
