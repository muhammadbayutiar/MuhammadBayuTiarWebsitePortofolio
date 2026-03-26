'use client';

import { useState, useEffect } from 'react';

let listeners: Array<(v: boolean) => void> = [];
let currentValue = false;
let initialized = false;

function init() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  currentValue = window.innerWidth < 768;
  
  const handler = () => {
    const next = window.innerWidth < 768;
    if (next !== currentValue) {
      currentValue = next;
      listeners.forEach(fn => fn(next));
    }
  };
  
  window.addEventListener('resize', handler, { passive: true });
}

export function useMobileDetect(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  
  useEffect(() => {
    init();
    listeners.push(setIsMobile);
    return () => { listeners = listeners.filter(fn => fn !== setIsMobile); };
  }, []);
  
  return isMobile;
}
