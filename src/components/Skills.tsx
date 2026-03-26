'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue } from 'framer-motion';
import SkillsAccordion from '@/components/ui/skills-accordion';
import { skillCategories } from '@/data/skillCategories';
import { useMobileDetect } from '@/hooks/useMobileDetect';

export default function Skills() {
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

  return (
    <>
      {/* Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <section 
        ref={sectionRef} 
        id="skills" 
        className="min-h-screen md:h-screen flex items-center"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <motion.div style={{ y: smoothY }} className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          {/* Flex Layout: Left Text + Right Accordion */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
            
            {/* Left Side - Header */}
            <motion.div
              className="w-full md:w-[45%] space-y-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-black bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                AI-Augmented Development Stack
              </motion.h2>
              <motion.p
                className="text-base md:text-lg text-slate-400 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Building at the intersection of AI and web development. 
                Leveraging machine learning, automation, and modern frameworks 
                to accelerate development velocity and solve complex problems.
              </motion.p>
            </motion.div>

            {/* Right Side - Interactive Accordion */}
            <motion.div
              className="w-full md:w-[55%]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <SkillsAccordion categories={skillCategories} isMobile={isMobile} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </>
  );
}

