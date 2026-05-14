import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Card } from '@/components/ui/Card';
import { Check, X as XIcon, Sparkle } from '@phosphor-icons/react';
import { formatPrice, formatRelTime } from '@/lib/utils/format';
import type { Listing } from '@/types/domain';

export default function ApprovalsPage() {
  const data = useData();
  const queue = useMemo(() => data.listings.filter((l) => l.status === 'review' || l.status === 'draft'), [data.listings]);

  const [selected, setSelected] = useState<Listing | null>(queue[0] || null);

  function approve(l: Listing) { data.setListingStatus(l.id, 'live'); }
  function reject(l: Listing)  { data.setListingStatus(l.id, 'rejected'); }

  const columns: Column<Listing>[] = [
    {
      key: 'title', header: 'İlan',
      cell: (r) => (
        <div className="flex items-center gap-3">
          <img src={r.images[0]?.thumbUrl} alt="" className="w-12 h-10 rounded-r-2 object-cover bg-slate-200" />
          <div>
            <button onClick={() => setSelected(r)} className="font-medium hover:text-brand-600 text-left text-sm">{r.title}</button>
            <div className="text-xs text-fg-3">{r.city} · {r.district}</div>
          </div>
        </div>
      )
    },
    { key: 'price', header: 'Fiyat', align: 'right', sortable: true, cell: (r) => formatPrice(r.price) },
    { key: 'risk', header: 'Risk', cell: (r) => <RiskBadge size="sm" score={r.aiRiskScore} reasons={r.aiRiskReasons} /> },
    { key: 'status', header: 'Durum', cell: (r) => <StatusBadge status={r.status} size="sm" /> },
    { key: 'createdAt', header: 'Tarih', hideOn: 'md', cell: (r) => <span className="text-xs text-fg-3">{formatRelTime(r.createdAt)}</span> },
    {
      key: 'actions', header: 'Aksiyon', align: 'right',
      cell: (r) => (
        <div className="inline-flex gap-1">
          <Button size="xs" variant="success" iconLeft={<Check size={12} />} onClick={() => approve(r)}>Onayla</Button>
          <Button size="xs" variant="danger" iconLeft={<XIcon size={12} />} onClick={() => reject(r)}>Reddet</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <SectionHeading title="Onay Kuyruğu" description={`${queue.length} ilan bekliyor`} />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DataTable
            data={queue}
            columns={columns}
            rowKey={(r) => r.id}
            searchable
            onRowClick={(r) => setSelected(r)}
            aiSuggestions={[
              { label: 'Düşük riskli olanları toplu onayla', onRun: () => queue.filter((q) => q.aiRiskScore < 30).forEach((q) => approve(q)) },
              { label: 'TKGM ipotekli olanları işaretle', onRun: () => alert('AI: 3 ilan TKGM ipotekli olarak işaretlendi (mock).') }
            ]}
            bulkActions={[
              { label: 'Onayla', onRun: (rows) => rows.forEach(approve) },
              { label: 'Reddet', onRun: (rows) => rows.forEach(reject), tone: 'danger' }
            ]}
          />
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-3">
            {selected ? (
              <>
                <Card>
                  <h3 className="font-medium mb-2">Önizleme</h3>
                  <img src={selected.images[0]?.url} alt="" className="w-full aspect-[16/10] object-cover rounded-r-2 mb-2 bg-slate-200" />
                  <Link to={`/listings/${selected.id}`} className="font-medium hover:text-brand-600">{selected.title}</Link>
                  <div className="text-sm text-fg-3 mt-1">{selected.city} · {selected.district}</div>
                  <div className="text-sm mt-2">{selected.aiSummary}</div>
                </Card>
                <Card>
                  <div className="flex items-center gap-2 mb-2"><Sparkle size={16} weight="fill" className="text-brand-500" /><span className="font-medium">AI risk açıklaması</span></div>
                  <div className="text-sm text-fg-2">Skor: <strong>{selected.aiRiskScore}/100</strong></div>
                  <ul className="mt-1 text-sm text-fg-2 space-y-1">
                    {selected.aiRiskReasons.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </Card>
                <Card>
                  <h3 className="font-medium mb-2">Hızlı aksiyonlar</h3>
                  <div className="flex flex-col gap-2">
                    <Button block variant="success" iconLeft={<Check size={16} />} onClick={() => approve(selected)}>Onayla</Button>
                    <Button block variant="danger" iconLeft={<XIcon size={16} />} onClick={() => reject(selected)}>Reddet</Button>
                  </div>
                  <div className="text-xs text-fg-3 mt-2">AI red mektubu taslağı: "Tapu hisse oranı kabul eşiğimizin altında. Müsait olduğunda güncelleyebilirsiniz."</div>
                </Card>
              </>
            ) : (
              <div className="text-sm text-fg-3 text-center py-6">İlan seçin</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
