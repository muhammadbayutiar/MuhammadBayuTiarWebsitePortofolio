'use client';

import { motion, useReducedMotion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { useState, useEffect, useRef, useCallback } from 'react';

function getPreviewImage(project: (typeof projectsData)[0]) {
  return project.image ?? project.gallery?.[0] ?? null;
}

export default function ProjectsGrid() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-based animations - use static MotionValue on mobile
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const headerYRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [40, 0, -40]
  );
  const staticHeaderY = useMotionValue(0);
  const headerY = isMobile ? staticHeaderY : headerYRaw;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextProject = useCallback(() => {
    requestAnimationFrame(() => {
      setActiveIndex((prev) => (prev + 1) % projectsData.length);
    });
  }, []);

  const prevProject = useCallback(() => {
    requestAnimationFrame(() => {
      setActiveIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        nextProject();
      }

      if (e.key === 'ArrowLeft') {
        prevProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextProject, prevProject]);

  return (
    <>
      {/* Top Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
      
      <section 
        ref={sectionRef}
        id="projects" 
        className="relative min-h-screen w-full overflow-hidden py-24 md:py-32"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'layout style paint',
          willChange: 'transform',
        }}
      >
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Header with parallax */}
          <motion.div 
            style={{ y: headerY }}
            className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm text-cyan-400 font-medium tracking-wide uppercase mb-3"
            >
              Portfolio
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3"
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-neutral-400 leading-relaxed"
            >
              Showcasing my work in computer vision, web development, and AI-powered applications
            </motion.p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative flex items-center justify-center gap-4 mb-10 md:mb-12">
            
            {/* ARIA Live Region for Screen Readers */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              Showing project {activeIndex + 1} of {projectsData.length}: {projectsData[activeIndex]?.title}
            </div>
            
            {/* Left Arrow - Desktop only */}
            <button
              onClick={prevProject}
              className="hidden md:flex absolute left-0 z-30 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Projects Display */}
            <div className="relative w-full max-w-[1100px] min-h-[520px] md:min-h-[540px] mx-auto transform-gpu py-8 md:py-10">
              {projectsData.map((project, index) => {
                const previewSrc = getPreviewImage(project);
                
                // Calculate offset
                const total = projectsData.length;
                const half = Math.floor(total / 2);
                const normalizedOffset = ((index - activeIndex + total + half) % total) - half;
                
                const isActive = Math.abs(normalizedOffset) < 0.1;

                return (
                  <motion.div
                    key={project.id}
                    initial={false}
                    drag={isMobile ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.06}
                    dragMomentum={false}
                    whileDrag={{
                      scale: 0.96,
                      opacity: 0.9
                    }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(_event, info) => {
                      const swipe = info.offset.x;
                      const velocity = info.velocity.x;
                      const threshold = 35;
                      
                      if (swipe < -threshold || velocity < -350) {
                        nextProject();
                      } else if (swipe > threshold || velocity > 350) {
                        prevProject();
                      }
                      setTimeout(() => setIsDragging(false), 50);
                    }}
                    animate={{
                      x: normalizedOffset * 330,
                      scale: isActive ? 1.06 : 0.92,
                      opacity: Math.abs(normalizedOffset) > 1.5 ? 0 : (isActive ? 1 : 0.25)
                    }}
                    style={{
                      zIndex: Math.round(10 - Math.abs(normalizedOffset)),
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      touchAction: "pan-y",
                      transform: 'translate3d(0, 0, 0)',
                    }}
                    transition={{
                      type: "spring",
                      stiffness: prefersReducedMotion ? 300 : (isMobile ? 250 : 280),
                      damping: prefersReducedMotion ? 40 : (isMobile ? 35 : 30),
                      mass: 0.7
                    }}
                    className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 group flex flex-col rounded-xl overflow-hidden backdrop-blur-md border will-change-transform w-[85%] sm:w-[320px] md:w-[360px] min-h-[400px]
                      ${isActive 
                        ? 'bg-linear-to-b from-white/5 to-transparent border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.6)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/15 cursor-pointer'
                      }`}
                    onClick={() => {
                      if (isDragging) return;
                      if (!isActive) {
                        setActiveIndex(index);
                      }
                    }}
                  >
                    {/* Image with hover parallax */}
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="block relative w-full overflow-hidden bg-neutral-900"
                      style={{ aspectRatio: '16/10' }}
                      aria-label={`View ${project.title} project details`}
                    >
                      {previewSrc ? (
                        <>
                          <motion.div
                            whileHover={!isMobile && isActive ? { scale: 1.05 } : {}}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                          >
                            <Image
                              src={previewSrc}
                              alt={project.title}
                              fill
                              className="object-cover"
                              sizes="340px"
                              priority={isActive}
                              loading={isActive ? "eager" : "lazy"}
                            />
                          </motion.div>
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                          <span className="text-neutral-500 text-sm">No preview</span>
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <Link href={`/projects/${project.id}`} className="group/title">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 group-hover/title:text-cyan-400 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>
                      
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tech.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 text-[10px] sm:text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Buttons - Only active card */}
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="mt-auto flex items-center gap-2"
                        >
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white text-black text-xs sm:text-sm font-semibold hover:bg-white/90 transition-all duration-300"
                          >
                            View Project
                            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Link>
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 sm:p-2.5 rounded-lg border border-white/20 text-neutral-300 hover:border-white/30 hover:text-white transition-all duration-300"
                              aria-label="View on GitHub"
                            >
                              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                          )}
                          {project.figma && (
                            <a
                              href={project.figma}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 sm:p-2.5 rounded-lg border border-white/20 text-neutral-300 hover:border-white/30 hover:text-white transition-all duration-300"
                              aria-label="View design"
                            >
                              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Arrow - Desktop only */}
            <button
              onClick={nextProject}
              className="hidden md:flex absolute right-0 z-30 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center gap-2 mb-6">
            {projectsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-cyan-400 w-6' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link 
              href="/projects" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/15 hover:border-white/20 transition-all duration-300"
            >
              View All Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
        </div>
      </section>
      
      {/* Bottom Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
    </>
  );
}
