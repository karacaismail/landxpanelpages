import { useRef, useState } from 'react';
import { CloudArrowUp, Trash, ArrowLeft, ArrowRight, Sparkle } from '@phosphor-icons/react';
import { cls } from '@/lib/utils/cls';

interface Props {
  urls: string[];
  onChange: (urls: string[]) => void;
  maxCount?: number;
}

export function ImageUploader({ urls, onChange, maxCount = 12 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next = [...urls];
    Array.from(files).slice(0, maxCount - urls.length).forEach((f) => {
      const url = URL.createObjectURL(f);
      next.push(url);
    });
    onChange(next);
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...urls];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  }

  function remove(idx: number) {
    onChange(urls.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        className={cls(
          'w-full border-2 border-dashed rounded-r-3 p-6 text-center transition-colors',
          drag ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
        )}
      >
        <CloudArrowUp size={32} weight="duotone" className="mx-auto text-brand-500" />
        <div className="font-medium mt-2">Görsel sürükle-bırak veya tıkla</div>
        <div className="text-xs text-fg-3 mt-1">JPG/PNG, en fazla {maxCount} adet. <span className="inline-flex items-center gap-0.5"><Sparkle size={10} weight="fill" /> AI sıralama otomatik</span></div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </button>
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {urls.map((u, i) => (
            <div key={u + i} className="relative group rounded-r-2 overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={u} alt={`Görsel ${i + 1}`} className="w-full aspect-[4/3] object-cover bg-slate-200" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button type="button" onClick={() => move(i, -1)} aria-label="Sola" disabled={i === 0} className="p-1.5 rounded-full bg-white/90 text-fg-1 disabled:opacity-40"><ArrowLeft size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} aria-label="Sağa" disabled={i === urls.length - 1} className="p-1.5 rounded-full bg-white/90 text-fg-1 disabled:opacity-40"><ArrowRight size={14} /></button>
                <button type="button" onClick={() => remove(i)} aria-label="Sil" className="p-1.5 rounded-full bg-rose-500 text-white"><Trash size={14} /></button>
              </div>
              <div className="absolute top-1 left-1 bg-black/60 text-white rounded-full px-1.5 py-0.5 text-[10px] font-medium">{i + 1}</div>
              {i === 0 && <div className="absolute bottom-1 left-1 bg-brand-500 text-white rounded-full px-1.5 py-0.5 text-[10px] font-medium">Kapak</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
