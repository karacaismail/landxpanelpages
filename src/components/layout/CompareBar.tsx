import { Stack as StackIcon, ArrowRight, X } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '@/store/compare';
import { useData } from '@/store/data';
import { Button } from '@/components/ui/Button';

export function CompareBar() {
  const compare = useCompare();
  const data = useData();
  const navigate = useNavigate();
  if (compare.ids.length === 0) return null;
  const items = compare.ids.map((id) => data.listings.find((l) => l.id === id)).filter(Boolean);

  return (
    <div className="fixed lg:bottom-4 bottom-20 inset-x-0 z-30 flex justify-center pointer-events-none safe-bottom">
      <div className="mx-3 max-w-3xl w-full pointer-events-auto rounded-r-4 bg-slate-900 text-white shadow-2xl px-3 py-2 flex items-center gap-2">
        <StackIcon weight="fill" size={18} className="text-brand-300 shrink-0" />
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
          {items.map((l) => (
            <div key={l!.id} className="inline-flex items-center gap-1 bg-white/10 rounded-full pl-2 pr-1 py-1 text-xs whitespace-nowrap">
              <span className="truncate max-w-[140px]">{l!.title}</span>
              <button onClick={() => compare.remove(l!.id)} aria-label="Çıkar" className="p-0.5 rounded-full hover:bg-white/20"><X size={10} /></button>
            </div>
          ))}
        </div>
        <span className="text-xs text-white/60 hidden sm:inline">{compare.ids.length}/4</span>
        <button onClick={() => compare.clear()} aria-label="Tümünü temizle" className="p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-white text-xs" title="Tümünü temizle">
          <X size={14} />
        </button>
        <Button size="sm" variant="primary" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/compare')}>Karşılaştır</Button>
      </div>
    </div>
  );
}
