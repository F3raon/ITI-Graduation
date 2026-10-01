import React, { createContext, useContext, useEffect, useState } from 'react';

export interface NeonStore {
  current: number;       // Interpolated 0 -> 1
  target: number;        // Target from hover (0 -> 1)
  isLocked: boolean;     // Locked by button to 1.0 (Full Neon)
  setTarget: (target: number) => void;
  toggleLock: () => void;
  listeners: Set<(val: number) => void>;
  subscribe: (fn: (val: number) => void) => () => void;
  notify: () => void;
}

export const neonStore: NeonStore = {
  current: 0,
  target: 0,
  isLocked: false,
  listeners: new Set(),
  setTarget(target: number) {
    if (this.isLocked) return;
    this.target = Math.max(0, Math.min(1, target));
  },
  toggleLock() {
    this.isLocked = !this.isLocked;
    this.target = this.isLocked ? 1.0 : 0.0;
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
  (window as any).__neonStore = neonStore;
}

const NeonContext = createContext<NeonStore>(neonStore);

export function NeonProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonContext.Provider value={neonStore}>
      {children}
    </NeonContext.Provider>
  );
}

export function useNeon() {
  return useContext(NeonContext);
}

export function useNeonProgress() {
  const [progress, setProgress] = useState(neonStore.current);

  useEffect(() => {
    return neonStore.subscribe((val) => {
      setProgress(val);
    });
  }, []);

  return { progress, toggleLock: neonStore.toggleLock.bind(neonStore) };
}
