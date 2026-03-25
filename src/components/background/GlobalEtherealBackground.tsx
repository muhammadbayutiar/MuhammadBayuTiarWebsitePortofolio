'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Component } from '@/components/ui/etheral-shadow';

export default function GlobalEtherealBackground() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Delay background activation until loader is done
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 4700); // Slightly after enhanced loader (4500ms + 200ms buffer)
    
    return () => clearTimeout(timer);
  }, []);

  // Background parallax (depth effect) - ONLY animate wrapper - Minimal range for full coverage
  const bgYRaw = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const bgY = useSpring(bgYRaw, { stiffness: 40, damping: 20 });

  // Overlay darkness - MINIMAL for maximum visibility
  const overlayOpacityRaw = useTransform(scrollYProgress, [0, 1], [0.08, 0.18]);
  const overlayOpacity = useSpring(overlayOpacityRaw, { stiffness: 40, damping: 20 });

  // Mobile-optimized settings with brightness boost
  const baseColor = isMobile 
    ? 'rgba(90, 160, 255, 1)'      // Mobile: maximum brightness
    : 'rgba(72, 140, 255, 0.95)';  // Desktop: vibrant but elegant
  
  const animationScale = isMobile ? 60 : 78;
  const animationSpeed = isMobile ? 50 : 65;
  const noiseOpacity = isMobile ? 0.25 : 0.35;

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
            filter: 'contrast(1.1) brightness(1.05)'
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
