import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { useData } from '@/store/data';
import { SectionHeading } from '@/components/data/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkle, MapPin, House, Image, CurrencyCircleDollar, FileText, CheckCircle, ShieldCheck, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { parseQuery } from '@/lib/ai/nl-parser';
import { estimateValue } from '@/lib/ai/value-estimator';
import { queryParcel, tkgmCodeMessage } from '@/lib/tkgm/mock-api';
import { TR_CITIES } from '@/data/fixtures/turkish-cities';
import { IMAR_LABELS, TKGM_LABELS, TAPU_LABELS, FEATURES_TR } from '@/data/fixtures/imar-types';
import { cls } from '@/lib/utils/cls';
import { formatPrice } from '@/lib/utils/format';
import { nanoid } from 'nanoid';
import type { Listing, ImarType, TapuType, TkgmStatus } from '@/types/domain';
import { AiBadge } from '@/components/ui/AiBadge';
import { ImageUploader } from '@/components/forms/ImageUploader';

interface Draft {
  intent: string;
  city: string;
  district: string;
  neighborhood: string;
  ada: string;
  parsel: string;
  pafta: string;
  area: number;
  imarType: ImarType;
  tapuType: TapuType;
  tkgmStatus: TkgmStatus;
  hisseRatio?: number;
  utilities: Listing['utilities'];
  features: string[];
  images: string[];
  price: number;
  title: string;
  description: string;
}

const empty: Draft = {
  intent: '',
  city: '', district: '', neighborhood: '',
  ada: '', parsel: '', pafta: '',
  area: 1000,
  imarType: 'konut',
  tapuType: 'mustakil',
  tkgmStatus: 'bilinmiyor',
  utilities: { road: true, electricity: true, water: false, gas: false, internet: false },
  features: [],
  images: [],
  price: 1_500_000,
  title: '',
  description: ''
};

const STORAGE = 'landx:listing-wizard';

const STEPS = [
  { id: 'location', label: 'Konum', Icon: MapPin },
  { id: 'detail',   label: 'Detay', Icon: House },
  { id: 'images',   label: 'Görseller', Icon: Image },
  { id: 'price',    label: 'Fiyat', Icon: CurrencyCircleDollar },
  { id: 'desc',     label: 'Açıklama', Icon: FileText },
  { id: 'review',   label: 'Önizle', Icon: CheckCircle }
] as const;

export default function ListingWizardPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const params = useParams();
  const editingId = params.id;
  const editing = editingId ? data.listings.find((l) => l.id === editingId) : null;

  const [draft, setDraft] = useState<Draft>(() => {
    if (editing) {
      return {
        intent: editing.title,
        city: editing.city, district: editing.district, neighborhood: editing.neighborhood,
        ada: editing.ada || '', parsel: editing.parsel || '', pafta: editing.pafta || '',
        area: editing.area,
        imarType: editing.imarType, tapuType: editing.tapuType, tkgmStatus: editing.tkgmStatus,
        hisseRatio: editing.hisseRatio,
        utilities: editing.utilities,
        features: editing.features,
        images: editing.images.map((i) => i.url),
        price: editing.price,
        title: editing.title,
        description: editing.description
      };
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (saved) return saved as Draft;
    } catch {}
    return empty;
  });
  const [step, setStep] = useState(0);
  const [tkgmLoading, setTkgmLoading] = useState(false);
  const [tkgmResult, setTkgmResult] = useState<string | null>(null);

  // Autosave
  useEffect(() => {
    if (editing) return;
    const id = setTimeout(() => localStorage.setItem(STORAGE, JSON.stringify(draft)), 600);
    return () => clearTimeout(id);
  }, [draft, editing]);

  const valuation = useMemo(() => estimateValue({
    area: draft.area, imarType: draft.imarType, city: draft.city || 'İstanbul', utilities: draft.utilities, hisseRatio: draft.hisseRatio
  }), [draft.area, draft.imarType, draft.city, draft.utilities, draft.hisseRatio]);

  function parseIntent() {
    const p = parseQuery(draft.intent);
    setDraft((d) => ({
      ...d,
      city: p.city || d.city,
      district: p.district || d.district,
      imarType: p.imarType || d.imarType,
      tapuType: p.tapuType || d.tapuType,
      tkgmStatus: p.tkgmStatus || d.tkgmStatus,
      area: p.maxArea || p.minArea || d.area,
      price: p.maxPrice || d.price,
      features: p.features || d.features
    }));
  }

  async function verifyTkgm() {
    setTkgmLoading(true); setTkgmResult(null);
    const res = await queryParcel({ il: draft.city || 'İstanbul', ilce: draft.district || 'Beykoz', ada: draft.ada || '0', parsel: draft.parsel || '0', userId: auth.currentUserId || 'u-0000' });
    data.recordTkgm(res);
    setTkgmLoading(false);
    if (res.status === 'OK' && res.result) {
      setDraft((d) => ({ ...d, neighborhood: res.result!.mahalle, area: res.result!.yuzolcumu }));
      setTkgmResult(`Doğrulandı (${res.latencyMs}ms): ${res.result.mahalle}, ${res.result.yuzolcumu} m² ${res.result.cinsi}`);
    } else {
      setTkgmResult(`${res.status}: ${tkgmCodeMessage(res.status)}`);
    }
  }

  function aiTitle() {
    const parts = [
      draft.features.includes('Yatırımlık') ? 'Yatırımlık' : 'Fırsat',
      draft.city, draft.district,
      IMAR_LABELS[draft.imarType].tr.split(' ')[0],
      'arsa'
    ];
    setDraft((d) => ({ ...d, title: parts.join(' ') }));
  }

  function aiDesc() {
    const cityRef = draft.city || 'Türkiye';
    setDraft((d) => ({
      ...d,
      description: `${cityRef}${draft.district ? ', ' + draft.district : ''} bölgesinde ${draft.area.toLocaleString('tr-TR')} m² ${IMAR_LABELS[draft.imarType].tr.toLowerCase()} parsel. ${draft.features.slice(0, 3).join(', ')}${draft.features.length ? '.' : ''} Tapu: ${TAPU_LABELS[draft.tapuType].tr}. TKGM: ${TKGM_LABELS[draft.tkgmStatus].tr}.`
    }));
  }

  function aiPrice() {
    setDraft((d) => ({ ...d, price: valuation.mid }));
  }

  function publish() {
    if (!auth.currentUserId) return;
    const id = editing?.id || `L${(data.listings.length + 1).toString().padStart(4, '0')}`;
    const now = new Date().toISOString();
    const images = (draft.images.length ? draft.images : Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/landx-${id}-${i}/1200/800`)).map((url, i) => ({
      id: `img-${id}-${i}`, url, thumbUrl: url.replace('1200/800', '400/300'), alt: `Görsel ${i + 1}`, order: i
    }));
    const listing: Listing = {
      id,
      ownerId: auth.currentUserId,
      title: draft.title || `${draft.city || 'İlan'} ${draft.district} arsa`,
      description: draft.description || '—',
      status: 'review',
      city: draft.city || 'İstanbul',
      district: draft.district || 'Beykoz',
      neighborhood: draft.neighborhood,
      ada: draft.ada, parsel: draft.parsel, pafta: draft.pafta,
      lat: (TR_CITIES.find((c) => c.name === draft.city)?.lat ?? 41) + (Math.random() - 0.5) * 0.4,
      lng: (TR_CITIES.find((c) => c.name === draft.city)?.lng ?? 29) + (Math.random() - 0.5) * 0.6,
      area: draft.area,
      price: draft.price,
      currency: 'TRY',
      pricePerM2: Math.round(draft.price / draft.area),
      tapuType: draft.tapuType,
      tkgmStatus: draft.tkgmStatus,
      imarType: draft.imarType,
      hisseRatio: draft.hisseRatio,
      utilities: draft.utilities,
      features: draft.features,
      images,
      views: 0, messageCount: 0, offerCount: 0, favoriteCount: 0,
      aiSummary: '',
      aiTags: draft.features.slice(0, 3),
      aiRiskScore: 18,
      aiRiskReasons: ['Belirgin risk tespit edilmedi'],
      aiValuation: valuation,
      createdAt: editing?.createdAt || now,
      updatedAt: now,
      publishedAt: now
    };
    data.upsertListing(listing);
    if (!editing) localStorage.removeItem(STORAGE);
    navigate(`/listings/${listing.id}`);
  }

  const cityFx = TR_CITIES.find((c) => c.name === draft.city);

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeading title={editing ? 'İlanı düzenle' : 'Yeni ilan oluştur'} description="6 adımda yayına hazır" />

      {/* Adım göstergesi */}
      <ol className="flex items-center gap-1 overflow-x-auto pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
        {STEPS.map((s, i) => (
          <li key={s.id} className={cls('flex items-center gap-1 text-xs', i === step ? 'text-brand-700 dark:text-brand-300 font-medium' : i < step ? 'text-fg-2' : 'text-fg-3')}>
            <span className={cls('w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold', i <= step ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-fg-3')}>{i + 1}</span>
            <span className="hidden sm:inline">{s.label}</span>
            {i < STEPS.length - 1 && <span className="text-fg-4 mx-1">›</span>}
          </li>
        ))}
      </ol>

      {/* AI niyet alanı */}
      <Card className="mb-4 bg-gradient-to-br from-brand-50/60 to-transparent dark:from-brand-900/30">
        <div className="flex items-center gap-2 mb-2"><AiBadge>AI ile doldur</AiBadge></div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={draft.intent}
            onChange={(e) => setDraft((d) => ({ ...d, intent: e.target.value }))}
            placeholder="İstanbul Beykoz 5000 m² imarlı tarlamı 2,5M ₺'a satıyorum"
            className="flex-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]"
            aria-label="Niyet"
          />
          <Button onClick={parseIntent} iconLeft={<Sparkle size={16} weight="fill" />}>Parse et</Button>
        </div>
        <p className="text-xs text-fg-3 mt-2">Niyetinizi yazın, AI tüm alanları sizin için doldursun. Sonra adım adım ince ayar yapabilirsiniz.</p>
      </Card>

      {step === 0 && (
        <Card className="space-y-3">
          <h3 className="font-medium inline-flex items-center gap-2"><MapPin size={18} /> Konum</h3>
          <div className="grid grid-cols-2 gap-3">
            <select value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value, district: '' }))} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
              <option value="">İl seç</option>
              {TR_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select value={draft.district} onChange={(e) => setDraft((d) => ({ ...d, district: e.target.value }))} disabled={!cityFx} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
              <option value="">İlçe seç</option>
              {cityFx?.districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <Input label="Mahalle / Köy" value={draft.neighborhood} onChange={(e) => setDraft((d) => ({ ...d, neighborhood: e.target.value }))} block />
          <div className="grid grid-cols-3 gap-2">
            <Input label="Ada" value={draft.ada} onChange={(e) => setDraft((d) => ({ ...d, ada: e.target.value }))} />
            <Input label="Parsel" value={draft.parsel} onChange={(e) => setDraft((d) => ({ ...d, parsel: e.target.value }))} />
            <Input label="Pafta" value={draft.pafta} onChange={(e) => setDraft((d) => ({ ...d, pafta: e.target.value }))} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={verifyTkgm} loading={tkgmLoading} iconLeft={<ShieldCheck size={16} />}>TKGM ile doğrula</Button>
            <span className="text-xs text-fg-3">Mock servis · 1-3sn</span>
          </div>
          {tkgmResult && (
            <div className={`text-sm rounded-r-2 px-3 py-2 ${tkgmResult.startsWith('Doğrulandı') ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200'}`}>
              {tkgmResult}
            </div>
          )}
        </Card>
      )}

      {step === 1 && (
        <Card className="space-y-3">
          <h3 className="font-medium inline-flex items-center gap-2"><House size={18} /> Detay</h3>
          <Input label="Alan (m²)" type="number" value={draft.area} onChange={(e) => setDraft((d) => ({ ...d, area: Number(e.target.value) }))} block />
          <div className="grid grid-cols-2 gap-3">
            <Select label="İmar" value={draft.imarType} onChange={(v) => setDraft((d) => ({ ...d, imarType: v as ImarType }))} options={Object.entries(IMAR_LABELS).map(([v, l]) => ({ value: v, label: l.tr }))} />
            <Select label="Tapu" value={draft.tapuType} onChange={(v) => setDraft((d) => ({ ...d, tapuType: v as TapuType }))} options={Object.entries(TAPU_LABELS).map(([v, l]) => ({ value: v, label: l.tr }))} />
          </div>
          <Select label="TKGM" value={draft.tkgmStatus} onChange={(v) => setDraft((d) => ({ ...d, tkgmStatus: v as TkgmStatus }))} options={Object.entries(TKGM_LABELS).map(([v, l]) => ({ value: v, label: l.tr }))} />
          {draft.tapuType === 'hisseli' && (
            <Input label="Hisse oranı (%)" type="number" value={draft.hisseRatio || ''} onChange={(e) => setDraft((d) => ({ ...d, hisseRatio: Number(e.target.value) || undefined }))} block />
          )}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.entries(draft.utilities) as [keyof Listing['utilities'], boolean][]).map(([k, v]) => (
              <label key={k} className={cls('inline-flex items-center gap-2 px-3 py-2 rounded-r-2 border cursor-pointer text-sm', v ? 'border-brand-300 bg-brand-50 dark:bg-brand-900/40 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 text-fg-2')}>
                <input type="checkbox" className="sr-only" checked={v} onChange={() => setDraft((d) => ({ ...d, utilities: { ...d.utilities, [k]: !v } }))} />
                <span className="capitalize">{({ road: 'Yol', electricity: 'Elektrik', water: 'Su', gas: 'Doğalgaz', internet: 'İnternet' } as Record<string, string>)[k as string]}</span>
              </label>
            ))}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-fg-3 mb-1.5">Öne çıkan özellikler</div>
            <div className="flex flex-wrap gap-1.5">
              {FEATURES_TR.map((f) => {
                const on = draft.features.includes(f);
                return (
                  <button key={f} onClick={() => setDraft((d) => ({ ...d, features: on ? d.features.filter((x) => x !== f) : [...d.features, f] }))} className={cls('rounded-full px-3 py-1 text-xs border', on ? 'bg-brand-100 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200' : 'border-slate-300 dark:border-slate-700 text-fg-2 hover:bg-slate-50 dark:hover:bg-slate-800')}>{f}</button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-3">
          <h3 className="font-medium inline-flex items-center gap-2"><Image size={18} /> Görseller</h3>
          <ImageUploader
            urls={draft.images}
            onChange={(urls) => setDraft((d) => ({ ...d, images: urls }))}
          />
          <Button size="sm" variant="outline" iconLeft={<Sparkle size={14} weight="fill" />} onClick={() => {
            const seed = (draft.city || 'plot').toLowerCase().replace(/\s+/g, '-');
            const generated = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/landx-${seed}-${i}-${Math.random().toString(36).slice(2,6)}/1200/800`);
            setDraft((d) => ({ ...d, images: [...d.images, ...generated] }));
          }}>AI ile 6 örnek görsel üret</Button>
        </Card>
      )}

      {step === 3 && (
        <Card className="space-y-3">
          <h3 className="font-medium inline-flex items-center gap-2"><CurrencyCircleDollar size={18} /> Fiyat</h3>
          <Input label="Fiyat (₺)" type="number" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))} block />
          <div className="rounded-r-3 bg-brand-50 dark:bg-brand-900/30 p-3">
            <div className="text-xs uppercase tracking-wider text-brand-700 dark:text-brand-200 mb-1 inline-flex items-center gap-1"><Sparkle size={12} weight="fill" /> AI Değerleme</div>
            <div className="text-sm text-fg-2">Alt: {formatPrice(valuation.low)} · Önerilen: <strong>{formatPrice(valuation.mid)}</strong> · Üst: {formatPrice(valuation.high)} <span className="text-xs text-fg-3">(güven %{Math.round(valuation.confidence * 100)})</span></div>
            <Button size="sm" variant="outline" className="mt-2" onClick={aiPrice}>Önerilen fiyatı uygula</Button>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="space-y-3">
          <h3 className="font-medium inline-flex items-center gap-2"><FileText size={18} /> Açıklama</h3>
          <Input label="Başlık" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} block />
          <Button size="sm" variant="outline" onClick={aiTitle} iconLeft={<Sparkle size={14} weight="fill" />}>AI başlık öner</Button>
          <div>
            <label className="text-sm font-medium text-fg-2">İlan Açıklaması</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={6}
              className="w-full mt-1 rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-base"
            />
          </div>
          <Button size="sm" variant="outline" onClick={aiDesc} iconLeft={<Sparkle size={14} weight="fill" />}>AI taslak yaz</Button>
        </Card>
      )}

      {step === 5 && (
        <Card className="space-y-2">
          <h3 className="font-medium inline-flex items-center gap-2"><CheckCircle size={18} /> Önizle</h3>
          <div className="text-sm space-y-1.5">
            <Row k="Başlık" v={draft.title || '—'} />
            <Row k="Konum" v={`${draft.city} · ${draft.district} · ${draft.neighborhood}`} />
            <Row k="Alan" v={`${draft.area} m²`} />
            <Row k="İmar / Tapu / TKGM" v={`${IMAR_LABELS[draft.imarType].tr} · ${TAPU_LABELS[draft.tapuType].tr} · ${TKGM_LABELS[draft.tkgmStatus].tr}`} />
            <Row k="Fiyat" v={formatPrice(draft.price)} />
            <Row k="Özellikler" v={draft.features.join(', ') || '—'} />
          </div>
        </Card>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Button variant="ghost" iconLeft={<ArrowLeft size={16} />} disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Geri</Button>
        <div className="ml-auto flex gap-2">
          {step < STEPS.length - 1 ? (
            <Button iconRight={<ArrowRight size={16} />} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>İleri</Button>
          ) : (
            <Button onClick={publish}>İncelemeye gönder</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-fg-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-r-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm min-h-[44px]">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1 last:border-0">
      <span className="text-fg-3 text-xs uppercase tracking-wider">{k}</span>
      <span className="text-right text-sm">{v}</span>
    </div>
  );
}
