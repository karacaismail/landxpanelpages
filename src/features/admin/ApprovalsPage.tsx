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
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [tkgmFilter, setTkgmFilter] = useState<'all' | 'temiz' | 'ipotekli' | 'serh' | 'tedbir' | 'bilinmiyor'>('all');
  const queue = useMemo(() => data.listings.filter((l) => {
    if (l.status !== 'review' && l.status !== 'draft') return false;
    if (riskFilter === 'low' && l.aiRiskScore >= 30) return false;
    if (riskFilter === 'mid' && (l.aiRiskScore < 30 || l.aiRiskScore >= 60)) return false;
    if (riskFilter === 'high' && l.aiRiskScore < 60) return false;
    if (tkgmFilter !== 'all' && l.tkgmStatus !== tkgmFilter) return false;
    return true;
  }), [data.listings, riskFilter, tkgmFilter]);

  const [selected, setSelected] = useState<Listing | null>(queue[0] || null);
  const [rejectModal, setRejectModal] = useState(false);

  function approve(l: Listing) { data.setListingStatus(l.id, 'live'); }
  function reject(l: Listing)  { data.setListingStatus(l.id, 'rejected'); }

  function aiRejectLetter(l: Listing): string {
    const reasons: string[] = [];
    if (l.tkgmStatus === 'ipotekli') reasons.push('TKGM kaydında ipotek tespit edildi');
    if (l.tkgmStatus === 'serh') reasons.push('Tapuda şerh kayıtlı');
    if (l.tapuType === 'hisseli' && (l.hisseRatio || 0) < 40) reasons.push(`Hisse oranı (${l.hisseRatio}%) kabul eşiğimizin altında`);
    if (l.images.length < 3) reasons.push('Görsel sayısı 3\'ün altında');
    if (l.aiRiskScore > 70) reasons.push(`AI risk skoru yüksek (${l.aiRiskScore}/100)`);
    const list = reasons.length ? reasons.map((r) => `- ${r}`).join('\n') : '- Mevcut yayın politikamızla tam örtüşmüyor';
    return [
      `Sayın ${l.title.split(' ')[0]} ilan sahibi,`,
      '',
      'İlanınızı incelediğimiz için teşekkür ederiz. Aşağıdaki nedenlerle bu aşamada yayına alamadık:',
      list,
      '',
      'Bu noktaları gözden geçirip ilanınızı güncellerseniz tekrar inceleyebiliriz. Sorularınız için destek ekibimize yazabilirsiniz.',
      '',
      'LandX Moderasyon Ekibi'
    ].join('\n');
  }

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

      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="text-xs text-fg-3">Risk:</span>
        {(['all','low','mid','high'] as const).map((r) => (
          <button key={r} onClick={() => setRiskFilter(r)} className={`rounded-full px-3 py-1 text-xs border ${riskFilter === r ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2'}`}>
            {r === 'all' ? 'Tümü' : r === 'low' ? 'Düşük' : r === 'mid' ? 'Orta' : 'Yüksek'}
          </button>
        ))}
        <span className="text-xs text-fg-3 ml-3">TKGM:</span>
        {(['all','temiz','ipotekli','serh','tedbir','bilinmiyor'] as const).map((r) => (
          <button key={r} onClick={() => setTkgmFilter(r)} className={`rounded-full px-3 py-1 text-xs border ${tkgmFilter === r ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-fg-2'}`}>
            {r === 'all' ? 'Tümü' : r}
          </button>
        ))}
      </div>

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
                    <Button block variant="outline" iconLeft={<Sparkle size={16} weight="fill" />} onClick={() => setRejectModal(true)}>AI red mektubu taslağı</Button>
                  </div>
                </Card>
              </>
            ) : (
              <div className="text-sm text-fg-3 text-center py-6">İlan seçin</div>
            )}
          </div>
        </aside>
      </div>

      {rejectModal && selected && (
        <div role="dialog" aria-label="AI red mektubu" className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3" onClick={() => setRejectModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-r-4 p-4 lg:p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2 inline-flex items-center gap-2"><Sparkle size={18} weight="fill" className="text-brand-500" /> AI red mektubu</h3>
            <p className="text-xs text-fg-3 mb-2">Aşağıdaki taslak AI tarafından bu ilanın özelliklerine göre üretildi. Düzenleyebilirsiniz.</p>
            <textarea
              defaultValue={aiRejectLetter(selected)}
              rows={10}
              className="w-full rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono"
            />
            <div className="flex gap-2 mt-3">
              <Button variant="outline" block onClick={() => setRejectModal(false)}>İptal</Button>
              <Button variant="danger" block onClick={() => { reject(selected); setRejectModal(false); }}>Reddet ve gönder</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
