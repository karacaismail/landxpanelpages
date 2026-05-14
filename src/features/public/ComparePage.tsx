import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Stack as StackIcon, ArrowRight, Sparkle } from '@phosphor-icons/react';
import { useCompare } from '@/store/compare';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { AiBadge } from '@/components/ui/AiBadge';
import { formatPrice, formatArea, compactNumber } from '@/lib/utils/format';
import { IMAR_LABELS, TKGM_LABELS, TAPU_LABELS } from '@/data/fixtures/imar-types';

export default function ComparePage() {
  const { t, i18n } = useTranslation();
  const compare = useCompare();
  const data = useData();
  const navigate = useNavigate();
  const items = useMemo(() => compare.ids.map((id) => data.listings.find((l) => l.id === id)).filter(Boolean), [compare.ids, data.listings]);
  const locale = (i18n.language === 'en' ? 'en' : 'tr') as 'tr' | 'en';

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState
          icon={<StackIcon size={48} weight="duotone" />}
          title="Karşılaştırma listeniz boş"
          description="İlanların kartlarındaki üst-üste yığın ikonuna tıklayarak 4'e kadar ilan ekleyebilirsiniz."
          aiHint="İlk eklediğiniz 4 ilanı yan yana koyarım, AI farkları üstte özetler."
          cta={<Button onClick={() => navigate('/listings')}>{t('nav.discover')}</Button>}
        />
      </div>
    );
  }

  const avgPrice = items.reduce((s, l) => s + (l!.price || 0), 0) / items.length;
  const minRisk = Math.min(...items.map((l) => l!.aiRiskScore));
  const bestRisk = items.find((l) => l!.aiRiskScore === minRisk)!;

  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-6 py-4 lg:py-6">
      <SectionHeading title={t('nav.compare')} description={`${items.length} ilan karşılaştırılıyor`} actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>Yazdır / PDF</Button>
          <Button variant="ghost" onClick={() => compare.clear()}>Tümünü temizle</Button>
        </div>
      } />

      {/* AI fark özeti */}
      <div className="rounded-r-3 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-900/30 p-4 mb-4 border border-brand-200/60 dark:border-brand-700/40">
        <div className="flex items-center gap-2 text-sm font-medium mb-1.5">
          <Sparkle size={16} weight="fill" className="text-brand-500" />
          AI farklara bakış
        </div>
        <ul className="text-sm text-fg-2 space-y-1">
          <li>• Ortalama fiyat: <strong>{formatPrice(Math.round(avgPrice), locale)}</strong></li>
          <li>• En düşük risk: <strong>{bestRisk.title}</strong> ({bestRisk.aiRiskScore})</li>
          <li>• Toplam alan: <strong>{items.reduce((s, l) => s + l!.area, 0).toLocaleString('tr-TR')} m²</strong></li>
        </ul>
      </div>

      <div className="overflow-x-auto rounded-r-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="min-w-[640px] w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="text-left px-3 py-2 font-medium text-fg-3 w-32">Alan</th>
              {items.map((l) => (
                <th key={l!.id} className="px-3 py-2">
                  <div className="flex items-center justify-between gap-1">
                    <Link to={`/listings/${l!.id}`} className="text-sm font-medium hover:text-brand-600 truncate text-left">{l!.title}</Link>
                    <button onClick={() => compare.remove(l!.id)} aria-label="Çıkar" className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={14} /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Görsel">
              {items.map((l) => <td key={l!.id} className="p-3"><img src={l!.images[0]?.thumbUrl} alt="" className="w-full aspect-[4/3] object-cover rounded-r-2" /></td>)}
            </Row>
            <Row label="Fiyat">{items.map((l) => <td key={l!.id} className="px-3 py-2 font-medium">{formatPrice(l!.price, locale)}</td>)}</Row>
            <Row label="m²">{items.map((l) => <td key={l!.id} className="px-3 py-2">{formatArea(l!.area, locale)}</td>)}</Row>
            <Row label="m² başı">{items.map((l) => <td key={l!.id} className="px-3 py-2">{compactNumber(l!.pricePerM2, locale)} ₺</td>)}</Row>
            <Row label="Şehir">{items.map((l) => <td key={l!.id} className="px-3 py-2">{l!.city} / {l!.district}</td>)}</Row>
            <Row label="İmar">{items.map((l) => <td key={l!.id} className="px-3 py-2">{IMAR_LABELS[l!.imarType].tr}</td>)}</Row>
            <Row label="Tapu">{items.map((l) => <td key={l!.id} className="px-3 py-2">{TAPU_LABELS[l!.tapuType].tr}</td>)}</Row>
            <Row label="TKGM">{items.map((l) => <td key={l!.id} className="px-3 py-2">{TKGM_LABELS[l!.tkgmStatus].tr}</td>)}</Row>
            <Row label="Risk">{items.map((l) => <td key={l!.id} className="px-3 py-2"><RiskBadge size="sm" score={l!.aiRiskScore} reasons={l!.aiRiskReasons} /></td>)}</Row>
            <Row label="AI etiketler">{items.map((l) => <td key={l!.id} className="px-3 py-2 space-x-1">{l!.aiTags.slice(0, 2).map((t) => <AiBadge key={t}>{t}</AiBadge>)}</td>)}</Row>
            <Row label="Detay">{items.map((l) => <td key={l!.id} className="px-3 py-2"><Link to={`/listings/${l!.id}`} className="inline-flex items-center gap-1 text-sm text-brand-700 dark:text-brand-300 hover:underline">Aç <ArrowRight size={14} /></Link></td>)}</Row>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <td className="px-3 py-2 text-fg-3 font-medium align-top">{label}</td>
      {children}
    </tr>
  );
}
