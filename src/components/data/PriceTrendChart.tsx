import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { compactNumber } from '@/lib/utils/format';

interface Props {
  data: Array<{ month: string; price: number }>;
}

export function PriceTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e7c61" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0e7c61" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="rgb(100,116,139)" />
        <YAxis tickFormatter={(v) => compactNumber(v as number)} tick={{ fontSize: 10 }} stroke="rgb(100,116,139)" width={48} />
        <Tooltip formatter={(v: number) => v.toLocaleString('tr-TR') + ' ₺'} />
        <Area type="monotone" dataKey="price" stroke="#0e7c61" strokeWidth={2} fill="url(#trendGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
