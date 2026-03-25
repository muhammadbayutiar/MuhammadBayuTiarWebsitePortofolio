'use client';

import React, { useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import useMeasure from 'react-use-measure';

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 40,
  duration = 30,
  durationOnHover = 60,
  className = '',
}: InfiniteSliderProps) {
  const [ref, { width }] = useMeasure();
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);

  useAnimationFrame((_t, delta) => {
    // Guard: don't animate until width is measured
    if (width === 0) return;

    const speed = isHovered ? durationOnHover : duration;
    const moveBy = (delta / 1000) * (width / speed);
    
    x.set(x.get() - moveBy);

    // Smooth loop reset
    if (x.get() <= -width) {
      x.set(0);
    }
  });

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <motion.div
        className="flex flex-nowrap"
        style={{
          gap: `${gap}px`,
          x,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div ref={ref} className="flex shrink-0 flex-nowrap" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex shrink-0 flex-nowrap" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
