import { useEffect, useRef, useState } from 'react';
import { cls } from '@/lib/utils/cls';
import type { ListingImage } from '@/types/domain';
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';

interface Props {
  images: ListingImage[];
}

export function ImageGallery({ images }: Props) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const touchStartX = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) setIdx((i) => (i + 1) % images.length);
      else setIdx((i) => (i - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  }

  useEffect(() => {
    if (!zoom) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      else if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
      else if (e.key === 'Escape') setZoom(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom, images.length]);

  if (!images.length) return null;
  const main = images[idx];

  return (
    <div className="space-y-2">
      <button
        onClick={() => setZoom(true)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full block group rounded-r-3 overflow-hidden bg-slate-200 dark:bg-slate-800"
        aria-label="Görseli büyüt"
      >
        <img src={main.url} alt={main.alt} className="w-full aspect-[16/10] object-cover" />
        {images.length > 1 && (
          <>
            <div className="absolute top-2 right-2 text-xs font-medium bg-black/50 text-white rounded-full px-2 py-0.5">{idx + 1}/{images.length}</div>
            {idx === 0 && (
              <div className="md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-black/50 text-white rounded-full px-2 py-0.5 animate-pulse">← Kaydırın →</div>
            )}
          </>
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
              aria-label="Önceki"
            ><CaretLeft size={16} /></button>
            <button
              onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
              aria-label="Sonraki"
            ><CaretRight size={16} /></button>
          </>
        )}
      </button>

      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {images.map((im, i) => (
            <button
              key={im.id}
              onClick={() => setIdx(i)}
              className={cls('shrink-0 rounded-r-2 overflow-hidden border-2', i === idx ? 'border-brand-500' : 'border-transparent opacity-80')}
              aria-label={`Görsel ${i + 1}`}
            >
              <img src={im.thumbUrl} alt="" className="w-16 h-12 object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div role="dialog" className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <button className="absolute top-4 right-4 p-2 text-white" aria-label="Kapat" onClick={() => setZoom(false)}><X size={28} /></button>
          <img src={main.url} alt={main.alt} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
