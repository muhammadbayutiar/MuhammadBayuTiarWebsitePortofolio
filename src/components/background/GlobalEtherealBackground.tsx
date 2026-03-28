'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Component } from '@/components/ui/etheral-shadow';
import { useMobileDetect } from '@/hooks/useMobileDetect';

export default function GlobalEtherealBackground() {
  const { scrollYProgress } = useScroll();
  const isMobile = useMobileDetect();
  const [isReady, setIsReady] = useState(false);

  // Delay background activation until loader is done
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 4700); // Slightly after enhanced loader (4500ms + 200ms buffer)
    
    return () => clearTimeout(timer);
  }, []);

  // Background parallax (depth effect) - ONLY animate wrapper - Minimal range for full coverage
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  // Overlay darkness - MINIMAL for maximum visibility
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.08, 0.18]);

  // Mobile-optimized settings — reduced GPU cost on mobile
  const baseColor = isMobile 
    ? 'rgba(90, 160, 255, 0.85)'   // Mobile: reduced alpha for lighter compositing
    : 'rgba(72, 140, 255, 0.95)';  // Desktop: vibrant but elegant
  
  const animationScale = isMobile ? 30 : 78;  // was 60, reduce to 30 on mobile
  const animationSpeed = isMobile ? 20 : 65;  // was 50, reduce to 20 on mobile
  const noiseOpacity = isMobile ? 0.15 : 0.35; // was 0.25, reduce to 0.15 on mobile

  return (
    <>
      {/* Etheral shadow background - Scroll reactive wrapper with clarity boost */}
      {isReady && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed pointer-events-none"
          style={{ 
            top: '-25%',
            left: '-5%',
            width: '110%',
            height: '150%',
            y: bgY, 
            zIndex: -20,
            filter: isMobile ? 'none' : 'contrast(1.1) brightness(1.05)',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
          }}
        >
          <Component
            color={baseColor}
            animation={{ scale: animationScale, speed: animationSpeed }}
            noise={{ opacity: noiseOpacity, scale: 1.1 }}
            sizing="fill"
          />
        </motion.div>
      )}

      {/* Contrast boost layer - Enhances center visibility (SINGLE RADIAL LAYER) */}
      {isReady && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(80, 160, 255, 0.2) 0%, transparent 60%)',
            zIndex: -15
          }}
        />
      )}

      {/* Depth overlay - MINIMAL darkness for visibility */}
      {isReady && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20 pointer-events-none"
          style={{ 
            opacity: overlayOpacity,
            zIndex: -10
          }}
        />
      )}
    </>
  );
}
