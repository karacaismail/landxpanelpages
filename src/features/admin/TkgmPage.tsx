import { useMemo, useState } from 'react';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Buildings, ShieldCheck, Pulse, Sparkle } from '@phosphor-icons/react';
import { queryParcel, tkgmCodeMessage } from '@/lib/tkgm/mock-api';
import { formatDateTime } from '@/lib/utils/format';
import type { TkgmQuery } from '@/types/domain';
import { useAuth } from '@/store/auth';

export default function TkgmPage() {
  const data = useData();
  const auth = useAuth();
  const [il, setIl] = useState('İstanbul');
  const [ilce, setIlce] = useState('Beykoz');
  const [ada, setAda] = useState('1234');
  const [parsel, setParsel] = useState('56');
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState<TkgmQuery | null>(null);

  async function run() {
    setLoading(true);
    const q = await queryParcel({ il, ilce, ada, parsel, userId: auth.currentUserId || 'u-0000' });
    data.recordTkgm(q);
    setLast(q);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const total = data.tkgmQueries.length;
    const ok = data.tkgmQueries.filter((q) => q.status === 'OK').length;
    const avgLatency = total > 0 ? Math.round(data.tkgmQueries.reduce((s, q) => s + q.latencyMs, 0) / total) : 0;
    return { total, ok, avgLatency, successRate: total > 0 ? Math.round((ok / total) * 100) : 0 };
  }, [data.tkgmQueries]);

  const columns: Column<TkgmQuery>[] = [
    { key: 'createdAt', header: 'Zaman', cell: (r) => <span className="text-xs">{formatDateTime(r.createdAt)}</span> },
    { key: 'input', header: 'Sorgu', cell: (r) => <span className="text-xs">{r.input.il}/{r.input.ilce} {r.input.ada}/{r.input.parsel}</span> },
    { key: 'status', header: 'Durum', cell: (r) => (
      <span className={r.status === 'OK' ? 'text-emerald-600' : 'text-rose-600'}>
        {r.status} — {tkgmCodeMessage(r.status)}
      </span>
    ) },
    { key: 'latencyMs', header: 'Latency', hideOn: 'sm', cell: (r) => <span className="text-xs">{r.latencyMs}ms</span> }
  ];

  return (
    <div>
      <SectionHeading title="TKGM Entegrasyon Paneli" description="Mock servis — parsel doğrulama" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Toplam sorgu" value={stats.total} icon={<Buildings size={20} weight="fill" />} />
        <Stat label="Başarı oranı" value={`%${stats.successRate}`} icon={<ShieldCheck size={20} weight="fill" />} />
        <Stat label="Ort. latency" value={`${stats.avgLatency}ms`} icon={<Pulse size={20} weight="fill" />} />
        <Stat label="AI tahmin" value="+%6 hafta sonu" icon={<Sparkle size={20} weight="fill" />} hint="Sorgu yoğunluğu" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-1">
          <h3 className="font-medium mb-3">Yeni sorgu</h3>
          <div className="space-y-2">
            <Input label="İl" value={il} onChange={(e) => setIl(e.target.value)} block />
            <Input label="İlçe" value={ilce} onChange={(e) => setIlce(e.target.value)} block />
            <Input label="Ada" value={ada} onChange={(e) => setAda(e.target.value)} block />
            <Input label="Parsel" value={parsel} onChange={(e) => setParsel(e.target.value)} block />
            <Button block loading={loading} onClick={run} iconLeft={<ShieldCheck size={16} />}>Doğrula</Button>
          </div>
          {last && (
            <div className="mt-3 p-3 rounded-r-2 bg-slate-100 dark:bg-slate-800 text-xs">
              <div className="font-medium mb-1">Sonuç: {last.status}</div>
              {last.result ? (
                <ul className="space-y-0.5">
                  <li>Mahalle: {last.result.mahalle}</li>
                  <li>Yüzölçümü: {last.result.yuzolcumu} m²</li>
                  <li>Cinsi: {last.result.cinsi}</li>
                  {last.result.hisse && <li>Hisse: {last.result.hisse}</li>}
                </ul>
              ) : <div>{tkgmCodeMessage(last.status)}</div>}
              <div className="text-fg-3 mt-1">{last.latencyMs}ms</div>
            </div>
          )}
        </Card>
        <div className="lg:col-span-2">
          <DataTable data={data.tkgmQueries} columns={columns} rowKey={(r) => r.id} searchable pageSize={15} />
        </div>
      </div>
    </div>
  );
}
