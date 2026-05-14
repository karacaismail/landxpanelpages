import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Heart, Sparkle, ArrowLeft } from '@phosphor-icons/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatPrice, compactNumber } from '@/lib/utils/format';

const COLORS = ['#0e7c61', '#c97f1d', '#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#d97706', '#0891b2'];

export default function FavoriteTrendsPage() {
  const auth = useAuth();
  const data = useData();
  const items = useMemo(() => {
    if (!auth.currentUserId) return [];
    const ids = data.favorites.filter((f) => f.userId === auth.currentUserId).map((f) => f.listingId);
    return data.listings.filter((l) => ids.includes(l.id)).slice(0, 8);
  }, [auth.currentUserId, data.favorites, data.listings]);

  // 12 ay sentetik trend her favori için (deterministic seed)
  const series = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}.ay`);
    return months.map((m, i) => {
      const row: Record<string, number | string> = { month: m };
      items.forEach((l) => {
        const seed = parseInt(l.id.replace(/[^0-9]/g, ''), 10) || 1;
        const factor = 0.78 + (i / 11) * 0.25 + ((seed % 7) - 3) * 0.01 + Math.sin((seed + i) / 3) * 0.04;
        row[l.id] = Math.round(l.price * factor / 10000) * 10000;
      });
      return row;
    });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState icon={<Heart size={48} weight="duotone" />} title="Favori yok" description="Trendleri görmek için ilanları favoriye ekleyin." cta={<Link to="/listings"><Button>Keşfet</Button></Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <Link to="/account/favorites" className="inline-flex items-center gap-1 text-sm text-fg-3 hover:text-fg-1 mb-2"><ArrowLeft size={14} /> Favoriler</Link>
      <SectionHeading title="Favori fiyat trendleri" description={`${items.length} favori ilan · 12 aylık karşılaştırma (mock)`} />

      <Card className="mb-4 bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-1"><Sparkle size={14} weight="fill" className="text-brand-500" /><span className="font-medium text-sm">AI yorum</span></div>
        <p className="text-sm text-fg-2">Favorilerinizin geçen 12 aydaki ortalama yıllık değer artışı: <strong>+%18</strong>. En çok artan: <strong>{items[0]?.title}</strong>.</p>
      </Card>

      <Card>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => compactNumber(v as number)} tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(v: number) => formatPrice(v)} />
              <Legend />
              {items.map((l, i) => (
                <Line key={l.id} type="monotone" dataKey={l.id} name={l.title.slice(0, 24) + (l.title.length > 24 ? '…' : '')} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((l, i) => (
          <Link key={l.id} to={`/listings/${l.id}`} className="block p-3 rounded-r-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-sm">
            <div className="inline-flex items-center gap-2 text-xs font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="truncate">{l.title}</span>
            </div>
            <div className="text-xs text-fg-3 mt-1">{l.city} · {formatPrice(l.price)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
