// Adaptive viewport hook — Tailwind breakpoint'lerine paralel sınıflandırma + orientation
import { useEffect, useState } from 'react';

export type DeviceSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'tv';
export type DeviceClass = 'mini-phone' | 'phone' | 'large-phone' | 'small-tablet' | 'tablet' | 'small-laptop' | 'desktop' | 'large-desktop' | 'ultrawide' | 'tv';

const BREAKPOINTS: { px: number; size: DeviceSize; cls: DeviceClass }[] = [
  { px: 0,    size: 'xxs', cls: 'mini-phone' },
  { px: 375,  size: 'xs',  cls: 'phone' },
  { px: 480,  size: 'sm',  cls: 'large-phone' },
  { px: 600,  size: 'md',  cls: 'small-tablet' },
  { px: 768,  size: 'lg',  cls: 'tablet' },
  { px: 1024, size: 'xl',  cls: 'small-laptop' },
  { px: 1366, size: '2xl', cls: 'desktop' },
  { px: 1600, size: '3xl', cls: 'large-desktop' },
  { px: 1920, size: '3xl', cls: 'ultrawide' },
  { px: 2560, size: 'tv',  cls: 'tv' }
];

export interface AdaptiveState {
  width: number;
  height: number;
  size: DeviceSize;
  cls: DeviceClass;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  /** ≤ 480px */
  isMobile: boolean;
  /** 480-768 */
  isTablet: boolean;
  /** ≥ 768 */
  isDesktop: boolean;
  /** Yardımcı: `isAtLeast('lg')` döner true if width >= lg breakpoint */
  isAtLeast: (s: DeviceSize) => boolean;
}

function classify(width: number): { size: DeviceSize; cls: DeviceClass } {
  let result = BREAKPOINTS[0];
  for (const bp of BREAKPOINTS) {
    if (width >= bp.px) result = bp;
  }
  return { size: result.size, cls: result.cls };
}

function read(): AdaptiveState {
  if (typeof window === 'undefined') {
    return { width: 1280, height: 720, size: '2xl', cls: 'desktop', orientation: 'landscape', isTouch: false, isMobile: false, isTablet: false, isDesktop: true, isAtLeast: () => false };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const { size, cls } = classify(w);
  const orientation: 'portrait' | 'landscape' = h >= w ? 'portrait' : 'landscape';
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const isMobile = w < 480;
  const isTablet = w >= 480 && w < 768;
  const isDesktop = w >= 768;
  const idxByName: Record<DeviceSize, number> = { xxs: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6, '3xl': 7, tv: 8 };
  const currentIdx = idxByName[size];
  return {
    width: w, height: h, size, cls, orientation, isTouch, isMobile, isTablet, isDesktop,
    isAtLeast: (s) => currentIdx >= idxByName[s]
  };
}

export function useAdaptive(): AdaptiveState {
  const [state, setState] = useState<AdaptiveState>(() => read());
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setState(read()));
    };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return state;
}
