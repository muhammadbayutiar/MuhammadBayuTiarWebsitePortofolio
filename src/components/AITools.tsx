'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { aiToolsData } from '@/data/aiTools';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { useMobileDetect } from '@/hooks/useMobileDetect';

export default function AITools() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobileDetect();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Mobile-optimized parallax - use static MotionValue on mobile
  const yRaw = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const staticY = useMotionValue(0);
  const activeY = isMobile ? staticY : yRaw;

  const smoothY = useSpring(activeY, { 
    stiffness: prefersReducedMotion ? 400 : (isMobile ? 500 : 300),
    damping: prefersReducedMotion ? 60 : (isMobile ? 70 : 30),
    mass: 0.1
  });

  const [gap, setGap] = useState(32);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGap(12); // mobile (tight)
      } else if (window.innerWidth < 1024) {
        setGap(20); // tablet
      } else {
        setGap(32); // desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      <section 
        ref={sectionRef} 
        id="aitools" 
        className="py-24 relative overflow-hidden"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <motion.div style={{ y: smoothY }} className="max-w-7xl mx-auto px-6">

          {/* Title + Description */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2
              className="w-full text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-linear-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              AI Assisted Development
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-slate-400 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              AI tools that accelerate my development workflow
            </motion.p>
          </div>

          {/* Infinite Slider - Clean & Minimal */}
          <motion.div 
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Infinite Slider */}
            <InfiniteSlider
              gap={gap}
              duration={prefersReducedMotion ? 60 : 25}
              durationOnHover={prefersReducedMotion ? 60 : 50}
              className="w-full py-10"
            >
              {aiToolsData.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  className="flex items-center gap-2 md:gap-3 px-3 md:px-5 shrink-0 group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.4 + index * 0.05,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  <motion.div
                    whileHover={!isMobile ? { 
                      scale: 1.15, 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.3 }
                    } : {}}
                  >
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={50}
                      height={50}
                      className="w-[25px] h-[25px] sm:w-[30px] sm:h-[30px] lg:w-[50px] lg:h-[50px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      unoptimized
                    />
                  </motion.div>
                  <span className="text-[11px] sm:text-[13px] lg:text-[15px] font-medium text-white/70 group-hover:text-white/90 whitespace-nowrap transition-colors duration-300">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </InfiniteSlider>
          </motion.div>
        </motion.div>
      </section>
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </>
  );
}

