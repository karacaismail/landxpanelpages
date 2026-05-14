import { useEffect, useRef, useState } from 'react';
import { cls } from '@/lib/utils/cls';
import type { ListingImage } from '@/types/domain';
import { CaretLeft, CaretRight, X, MagnifyingGlassPlus, MagnifyingGlassMinus } from '@phosphor-icons/react';

interface Props {
  images: ListingImage[];
}

export function ImageGallery({ images }: Props) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [scale, setScale] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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
    closeBtnRef.current?.focus();
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { setIdx((i) => (i + 1) % images.length); setScale(1); }
      else if (e.key === 'ArrowLeft') { setIdx((i) => (i - 1 + images.length) % images.length); setScale(1); }
      else if (e.key === 'Escape') setZoom(false);
      else if (e.key === '+' || e.key === '=') setScale((s) => Math.min(3, s + 0.25));
      else if (e.key === '-' || e.key === '_') setScale((s) => Math.max(1, s - 0.25));
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoom, images.length]);

  // Reset scale when switching image
  useEffect(() => { setScale(1); }, [idx]);

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
        <img src={main.url} alt={main.alt} loading="lazy" className="w-full aspect-[16/10] object-cover" />
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
              <img src={im.thumbUrl} alt="" loading="lazy" className="w-16 h-12 object-cover" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Görsel önizleme"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={() => setZoom(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm">
              <span className="font-medium">{idx + 1}</span>
              <span className="text-white/60"> / {images.length}</span>
              {main.alt && <span className="ml-3 text-white/80 hidden sm:inline truncate max-w-[40vw]">{main.alt}</span>}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setScale((s) => Math.max(1, s - 0.25))}
                className="p-2 rounded-full text-white hover:bg-white/10 disabled:opacity-40"
                disabled={scale <= 1}
                aria-label="Uzaklaştır"
              ><MagnifyingGlassMinus size={20} /></button>
              <span className="text-xs text-white/70 w-12 text-center">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale((s) => Math.min(3, s + 0.25))}
                className="p-2 rounded-full text-white hover:bg-white/10 disabled:opacity-40"
                disabled={scale >= 3}
                aria-label="Yakınlaştır"
              ><MagnifyingGlassPlus size={20} /></button>
              <button
                ref={closeBtnRef}
                onClick={() => setZoom(false)}
                className="ml-2 p-2 rounded-full text-white hover:bg-white/10"
                aria-label="Kapat"
              ><X size={22} /></button>
            </div>
          </div>

          {/* Image area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={main.url}
              alt={main.alt}
              className="max-w-full max-h-full object-contain transition-transform duration-150 select-none"
              style={{ transform: `scale(${scale})`, cursor: scale > 1 ? 'move' : 'default' }}
              draggable={false}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white"
                  aria-label="Önceki"
                ><CaretLeft size={22} /></button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white"
                  aria-label="Sonraki"
                ><CaretRight size={22} /></button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              className="px-3 py-3 flex gap-1.5 overflow-x-auto bg-black/60"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((im, i) => (
                <button
                  key={im.id}
                  onClick={() => setIdx(i)}
                  className={cls(
                    'shrink-0 rounded-r-2 overflow-hidden border-2',
                    i === idx ? 'border-brand-500' : 'border-transparent opacity-60 hover:opacity-90'
                  )}
                  aria-label={`Görsel ${i + 1}`}
                >
                  <img src={im.thumbUrl} alt="" loading="lazy" className="w-14 h-10 sm:w-20 sm:h-14 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
