"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion';
import { MessageSquare, Brain, Code, Zap } from 'lucide-react';
import { useMobileDetect } from '@/hooks/useMobileDetect';

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const } 
  },
});



// Slide in from side animation
const slideInFromLeft = (delay: number) => ({
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } 
  },
});

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  isMobile: boolean;
}

const RoleCard = ({ title, description, icon, index, isMobile }: RoleCardProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn(index * 0.1)}
      style={{ 
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      whileHover={isMobile ? {} : { 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group relative w-full h-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all duration-300 flex flex-col"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4 text-3xl transition-colors duration-300">
          {icon}
        </div>
        
        <h3 className="text-base font-semibold text-white mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
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

  const yTransform = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const staticY = useMotionValue(0);
  const y = shouldAnimate ? yTransform : staticY;

  const roles = [
    { 
      title: 'AI-Assisted Developer', 
      description: 'I collaborate with AI coding systems to build applications faster and smarter.',
      icon: <MessageSquare className="w-6 h-6 text-cyan-400" />
    },
    { 
      title: 'AI-Augmented Engineer', 
      description: 'Engineering systems where AI handles repetitive tasks so I focus on innovation.',
      icon: <Brain className="w-6 h-6 text-purple-400" />
    },
    { 
      title: 'Prompt Engineer', 
      description: 'Crafting precise prompts that unlock the full potential of AI language models.',
      icon: <Code className="w-6 h-6 text-emerald-400" />
    },
    { 
      title: 'Vibe Coder', 
      description: 'Creating code with intuitive flow, aesthetic harmony, and developer joy.',
      icon: <Zap className="w-6 h-6 text-orange-400" />
    }
  ];

  return (
    <>
      {/* Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      
      <section 
        ref={sectionRef}
        id="about" 
        className="relative min-h-screen w-full flex items-center justify-center py-16 px-6"
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
          className="max-w-6xl mx-auto w-full"
        >
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            
            {/* Heading with slide-in effect */}
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideInFromLeft(0)}
              className="text-3xl md:text-4xl font-semibold text-white tracking-tight"
            >
              About Me
            </motion.h2>

            {/* Description */}
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn(0.1)}
              className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl mx-auto"
            >
              I am a Computer Science graduate from Universitas Lampung, Indonesia. 
              I leverage AI in software development, focusing on web development, 
              data processing, and computer vision through machine learning approaches.
            </motion.p>

            {/* Cards Grid with stagger */}
            <div className="w-full mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {roles.map((role, index) => (
                  <RoleCard
                    key={role.title}
                    title={role.title}
                    description={role.description}
                    icon={role.icon}
                    index={index}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </section>
      
      {/* Bottom Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </>
  );
}
