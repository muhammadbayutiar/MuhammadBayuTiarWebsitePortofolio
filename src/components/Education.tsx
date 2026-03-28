"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion';
import { useMobileDetect } from '@/hooks/useMobileDetect';

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const } 
  },
});

const slideInFromLeft = (delay: number) => ({
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } 
  },
});

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobileDetect();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const shouldAnimate = isMounted ? (!isMobile && !prefersReducedMotion) : true;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    // @ts-expect-error - optimization
    layoutEffect: shouldAnimate
  });

  // Timeline progress bar animation
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const staticY = useMotionValue(0);
  const y = shouldAnimate ? yTransform : staticY;

  // Timeline progress bar height
  const progressHeight = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      
      <section 
        ref={sectionRef}
        id="education" 
        className="relative min-h-screen w-full flex items-center justify-center py-24 px-6"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'layout style paint',
          willChange: 'transform',
        }}
      >
        <motion.div 
          style={{ 
            y: shouldAnimate ? y : 0,
            willChange: shouldAnimate ? 'transform' : 'auto'
          }} 
          className="max-w-3xl mx-auto w-full"
        >
          <div className="flex flex-col items-center justify-center text-center space-y-10">
            
            {/* Label */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn(0)}
              className="text-sm text-cyan-400 font-medium tracking-wide uppercase"
            >
              Academic Background
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn(0.1)}
              className="text-3xl md:text-4xl font-semibold text-white tracking-tight"
            >
              Education
            </motion.h2>

            {/* Description */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn(0.2)}
              className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl"
            >
              I hold a Bachelor&apos;s degree in Computer Science from Universitas Lampung, Indonesia. 
              During my studies, I developed a strong foundation in software engineering and 
              artificial intelligence, with a particular focus on building practical systems 
              that bridge theory and real-world applications.
            </motion.p>

            {/* Timeline with animated progress */}
            <motion.div
              ref={timelineRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInFromLeft(0.3)}
              className="w-full max-w-2xl mt-8"
            >
              <div className="relative pl-8">
                {/* Static vertical line */}
                <div className="absolute left-0 top-2 bottom-0 w-px bg-white/10" />
                
                {/* Animated progress line */}
                <motion.div 
                  className="absolute left-0 top-2 w-px bg-linear-to-b from-cyan-500 via-cyan-400 to-emerald-500"
                  style={{ 
                    height: progressHeight,
                    transformOrigin: 'top',
                  }}
                />
                
                {/* Pulsing timeline dot */}
                <motion.div 
                  className="absolute left-[-3px] top-2 w-2 h-2 rounded-full bg-cyan-400"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(34,211,238,0.8)',
                      '0 0 20px rgba(34,211,238,1)',
                      '0 0 10px rgba(34,211,238,0.8)',
                    ],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Content with hover effect */}
                <motion.div 
                  className="group pb-8 text-left transition-all duration-300"
                  whileHover={!isMobile ? { 
                    x: 4,
                    transition: { duration: 0.3 }
                  } : {}}
                >
                  <motion.h3 
                    className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Bachelor of Computer Science
                  </motion.h3>
                  
                  <motion.p 
                    className="text-base text-neutral-300 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Universitas Lampung
                  </motion.p>
                  
                  <motion.p 
                    className="text-sm text-neutral-500 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    2021 – 2026
                  </motion.p>
                  
                  <motion.div 
                    className="pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <p className="text-sm text-neutral-400">
                      <span className="text-neutral-300 font-medium">Focus:</span> Computer Vision, Machine Learning
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>
      
      {/* Bottom Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </>
  );
}
