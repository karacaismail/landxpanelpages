import { useEffect, useRef, RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Modal/drawer içinde Tab navigation'ı sınırla. ESC opsiyonel kapat callback. */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onEscape?: () => void): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Initial focus: first focusable or container itself
    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
    const first = focusables()[0];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && onEscape) { e.preventDefault(); onEscape(); return; }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const f = list[0];
      const l = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && active === l) { e.preventDefault(); f.focus(); }
    }
    container.addEventListener('keydown', onKey);
    return () => {
      container.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [active, onEscape]);

  return ref;
}

/** Sayfa değişimini screen reader'a duyur (aria-live). */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const region = document.getElementById('a11y-live-' + priority);
  if (!region) return;
  region.textContent = '';
  // Force re-announce
  setTimeout(() => { region.textContent = message; }, 50);
}
