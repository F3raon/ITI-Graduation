import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ScrollStore {
  current: number;
  target: number;
  locked: boolean;
  scrollTo: (target: number) => void;
  listeners: Set<(val: number) => void>;
  subscribe: (fn: (val: number) => void) => () => void;
  notify: () => void;
}

export const scrollStore: ScrollStore = {
  current: 0,
  target: 0,
  locked: false,
  listeners: new Set(),
  scrollTo(target: number) {
    this.target = Math.max(0, Math.min(1, target));
  },
  subscribe(fn: (val: number) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  },
  notify() {
    this.listeners.forEach((fn) => fn(this.current));
  },
};

if (typeof window !== 'undefined') {
  (window as any).__scrollStore = scrollStore;
}

const ScrollContext = createContext<ScrollStore>(scrollStore);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let touchStartY = 0;

    // Mouse wheel handler - smooth controlled speed & reliable bi-directional scrolling
    const handleWheel = (e: WheelEvent) => {
      if (scrollStore.locked) return;
      // Reduced sensitivity for smoother, cinematic, controlled pacing
      const sensitivity = 0.00038;
      const next = Math.max(0, Math.min(1, scrollStore.target + e.deltaY * sensitivity));
      scrollStore.target = next;
    };

    // Touch support for touchpads, mobile, and tablets
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollStore.locked) return;
      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        touchStartY = touchY;

        // Controlled touch sensitivity
        const sensitivity = 0.0009;
        const next = Math.max(0, Math.min(1, scrollStore.target + deltaY * sensitivity));
        scrollStore.target = next;
      }
    };

    // Keyboard navigation (Arrow keys, PageUp/Down, Space, Home, End)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollStore.locked) return;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        const step = e.key === ' ' || e.key === 'PageDown' ? 0.08 : 0.03;
        scrollStore.target = Math.min(1, scrollStore.target + step);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        const step = e.key === 'PageUp' ? 0.08 : 0.03;
        scrollStore.target = Math.max(0, scrollStore.target - step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollStore.target = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollStore.target = 1;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollStore}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useWorldScroll() {
  return useContext(ScrollContext);
}

// Hook for HTML components to subscribe to scroll updates without re-rendering the whole tree
export function useScrollProgress() {
  const [progress, setProgress] = useState(scrollStore.current);

  useEffect(() => {
    return scrollStore.subscribe((val) => {
      setProgress(val);
    });
  }, []);

  return { progress, scrollTo: scrollStore.scrollTo.bind(scrollStore) };
}
