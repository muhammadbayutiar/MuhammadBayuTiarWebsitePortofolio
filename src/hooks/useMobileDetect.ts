'use client';

import { useState, useEffect } from 'react';

// Shared state across all hook instances
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
  // FIX: Initialize with false to match SSR (prevents hydration warnings)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    init();
    
    // Defer initial sync to avoid synchronous setState inside effect warning
    const timer = setTimeout(() => {
      setIsMobile(currentValue);
    }, 0);
    
    // Subscribe to changes
    listeners.push(setIsMobile);
    return () => { 
      clearTimeout(timer);
      listeners = listeners.filter(fn => fn !== setIsMobile); 
    };
  }, []);
  
  return isMobile;
}
