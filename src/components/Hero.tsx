"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useTransform, useScroll, AnimatePresence, useSpring, useReducedMotion, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useMobileDetect } from '@/hooks/useMobileDetect';

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

// Move roles outside component to prevent dependency issues
const HERO_ROLES = ["Prompt Engineer", "Vibe Coder", "AI-Augmented Developer"];

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: easeOutQuart } },
});

const scaleIn = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay, ease: easeOutQuart } },
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobileDetect();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Simplified parallax: only Y movement for desktop, static for mobile
  // Reduced from 4 motion values to 1 for better performance
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const staticY = useMotionValue(0);
  const activeY = isMobile ? staticY : yRaw;

  // Higher stiffness (faster, less expensive than low stiffness springs)
  const smoothY = useSpring(activeY, { 
    stiffness: prefersReducedMotion ? 400 : (isMobile ? 500 : 300),
    damping: prefersReducedMotion ? 60 : (isMobile ? 70 : 30),
    mass: 0.1
  });

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative h-screen flex items-center justify-center"
      style={{
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <motion.div
        style={{ y: smoothY }}
        className="w-full max-w-4xl mx-auto px-6 relative z-10"
      >
        <div className="flex flex-col items-center justify-center text-center gap-4 max-w-2xl mx-auto">

          {/* Profile Image */}
          <div className="mb-1">
            <motion.div
              variants={scaleIn(0.1)}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="relative w-28 h-28">
                {/* Subtle gradient ring */}
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-cyan-500/30 via-emerald-500/30 to-teal-500/30 blur-md" />
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-cyan-500/20 to-emerald-500/20 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black" />
                </div>
                {/* Photo */}
                <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                  <Image
                    src="/media/fotodiri/fotoprofile.jpeg"
                    alt="Muhammad Bayu Tiar"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Name */}
          <motion.h1
            variants={fadeIn(0.2)}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-linear-to-r from-white via-cyan-400 to-emerald-500 bg-clip-text text-transparent tracking-tight leading-tight sm:leading-tight"
          >
            Muhammad <span className="inline-block">Bayu Tiar</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            variants={fadeIn(0.3)}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl text-neutral-300 font-medium max-w-md mx-auto h-7 sm:h-8 md:h-9 flex items-center justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {HERO_ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeIn(0.4)}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-md mx-auto"
          >
            Computer Science graduate building intelligent systems with AI, Computer Vision, and modern web technologies.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeIn(0.5)}
            initial="hidden"
            animate="visible"
            className="flex flex-row justify-center items-center flex-wrap gap-3 pt-3"
          >
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="bg-linear-to-r from-cyan-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5 min-w-[140px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Me
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => scrollToSection('projects')}
              className="border border-white/20 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:border-white/40 hover:bg-white/5 min-w-[140px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.button>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            variants={fadeIn(0.6)}
            initial="hidden"
            animate="visible"
            className="flex gap-3 justify-center pt-2"
          >
            <a
              href="https://github.com/muhammadbayutiar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 rounded-xl transition-all duration-300 text-xl text-neutral-400 hover:text-white hover:scale-110 hover:-translate-y-0.5 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-bayu-tiar-a7889027b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 rounded-xl transition-all duration-300 text-xl text-neutral-400 hover:text-blue-400 hover:scale-110 hover:-translate-y-0.5 hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            >
              <FaLinkedin />
            </a>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
