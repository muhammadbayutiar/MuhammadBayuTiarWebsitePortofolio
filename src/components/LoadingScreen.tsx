'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Component as EtherealShadow } from '@/components/ui/etheral-shadow';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Disable scrolling while loader is active
    document.body.style.overflow = 'hidden';

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Smooth acceleration curve
        const increment = prev < 60 ? 2 : prev < 90 ? 1 : 0.5;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    // Extended cinematic duration (4.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Re-enable scrolling after fade out
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 1000); // Match enhanced fade-out duration
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            filter: 'blur(12px)',
            scale: 1.08
          }}
          transition={{ 
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center"
          style={{
            backgroundColor: '#0a0a0a',
            willChange: 'opacity, filter, transform'
          }}
        >
          {/* Enhanced 3D-style Ethereal Background */}
          <div className="absolute inset-0 pointer-events-none">
            <EtherealShadow
              color={isMobile ? 'rgba(90, 160, 255, 1)' : 'rgba(72, 140, 255, 0.95)'}
              animation={{ 
                scale: isMobile ? 80 : 92, 
                speed: isMobile ? 35 : 50 
              }}
              noise={{ 
                opacity: isMobile ? 0.25 : 0.35, 
                scale: 1.3 
              }}
              sizing="fill"
            />
          </div>

          {/* Enhanced radial glow overlay for depth */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(80, 160, 255, 0.4) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 70%)',
            }}
          />

          {/* Animated vignette */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(10, 10, 10, 0.6) 100%)',
            }}
          />

          {/* Content with parallax effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            transition={{ 
              delay: 0.3,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative z-10 text-center px-6 max-w-4xl"
          >
            {/* Name with gradient shimmer animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -5, 0],
              }}
              transition={{ 
                opacity: { delay: 0.5, duration: 0.8 },
                y: { 
                  delay: 1,
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 tracking-tight relative"
                style={{
                  textShadow: '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(6, 182, 212, 0.3)',
                }}
              >
                <motion.span
                  className="relative inline-block"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 100%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Muhammad Bayu Tiar
                </motion.span>
              </h1>
            </motion.div>

            {/* AI-focused subtitle with glow */}
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-cyan-400 font-semibold tracking-wide uppercase mb-10 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0.8,
                duration: 0.8
              }}
              style={{
                textShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)',
              }}
            >
              <motion.span
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                AI-Powered Developer
              </motion.span>
            </motion.p>

            {/* Enhanced progress bar */}
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 1,
                duration: 0.6
              }}
            >
              {/* Progress bar container */}
              <div className="relative h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-cyan-400/30 to-cyan-500/20"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Progress fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-cyan-500 via-cyan-400 to-emerald-400 rounded-full"
                  style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)',
                  }}
                  initial={{ width: '0%' }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    width: '30%',
                  }}
                  animate={{
                    x: ['-100%', '400%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5
                  }}
                />
              </div>

              {/* Progress percentage */}
              <motion.p
                className="text-xs sm:text-sm text-cyan-400/80 mt-3 font-medium tracking-wider"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {Math.round(progress)}%
              </motion.p>
            </motion.div>

            {/* Subtle loading text */}
            <motion.p
              className="text-xs sm:text-sm text-white/40 mt-6 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ 
                delay: 1.5,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Initializing Experience
            </motion.p>
          </motion.div>

          {/* Enhanced depth overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.2) 0%, transparent 50%, rgba(10, 10, 10, 0.4) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

