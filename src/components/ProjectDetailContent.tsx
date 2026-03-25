'use client';

import { useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import type { Project } from '@/data/projects';

const easing = [0.22, 1, 0.36, 1] as const;

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.6, ease: easing },
};

function ProjectDetailContentInner({ project }: { project: Project }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAll = searchParams.get('from') === 'all';
  const demoSectionRef = useRef<HTMLElement | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const [demoVideoFailed, setDemoVideoFailed] = useState(false);
  const demoSectionInView = useInView(demoSectionRef, { amount: 0.2 });
  const hasVideo = Boolean(project.video);
  const hasHeroVideo = hasVideo && !heroVideoFailed && !demoSectionInView;
  const hasDemoVideo = hasVideo && !demoVideoFailed && demoSectionInView;

  const handleBack = () => {
    if (fromAll) {
      router.push('/projects');
    } else {
      router.push('/?section=projects');
    }
  };

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-950 text-white pt-20">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header Group - Back Button + Hero */}
        <div className="flex flex-col gap-6 md:gap-8 mb-16 md:mb-24">
          {/* Back navigation - Isolated */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: easing }}
            className="mb-2 md:mb-4 w-fit relative z-20"
          >
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 group min-h-11 shadow-sm shadow-black/20"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-medium text-sm">Back to {fromAll ? 'All Projects' : 'Featured'}</span>
            </button>
          </motion.div>

          {/* Hero Section - Split Layout */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easing }}
          >
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-12 items-center">
              {/* Text Content */}
              <motion.div style={{ y: heroY }} className="order-2 lg:order-1 relative z-10 mt-4 sm:mt-6 lg:mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: easing }}
                  className="relative z-10"
                >
                  <span className={`inline-block px-2 py-1 sm:px-2.5 sm:py-1.5 mt-4 sm:mt-6 md:mt-4 mb-3 md:mb-4 text-xs font-semibold rounded-full ${
                    project.category === 'ai' ? 'bg-orange-500/20 text-orange-400 border border-orange-400/50' :
                    project.category === 'web' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50' :
                    'bg-violet-500/20 text-violet-400 border border-violet-400/50'
                  }`}>
                    {project.category.toUpperCase()}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: easing }}
                  className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight"
                >
                  {project.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: easing }}
                  className="text-base md:text-lg text-slate-400 leading-relaxed mb-6 md:mb-8"
                >
                  {project.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: easing }}
                  className="flex flex-wrap gap-2"
                >
                  {project.tech.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs md:text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Hero Media */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: easing }}
                className="order-1 lg:order-2 relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700/50 shadow-2xl z-0"
              >
                {imageLoading && (
                  <div className="absolute inset-0 bg-linear-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse" />
                )}
                {hasHeroVideo ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={project.image}
                    className="w-full h-full object-cover"
                    onLoadedData={() => setImageLoading(false)}
                    onError={() => {
                      setHeroVideoFailed(true);
                      setImageLoading(false);
                    }}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                ) : project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    onLoad={() => setImageLoading(false)}
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* Overview Section */}
        {(project.overview ?? project.description) && (
          <motion.section
            {...sectionMotion}
            className="mb-12 md:mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Overview
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {project.overview ?? project.description}
            </p>
          </motion.section>
        )}

        {/* Problem Section */}
        {project.problem && (
          <motion.section
            {...sectionMotion}
            className="mb-12 md:mb-20 max-w-3xl mx-auto py-10 md:py-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              The Problem
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              {project.problem}
            </p>
          </motion.section>
        )}

        {/* Features Section */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <motion.section
            {...sectionMotion}
            className="mb-12 md:mb-20 max-w-3xl mx-auto py-10 md:py-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Key Features
            </h2>
            <div className="grid gap-4">
              {project.keyFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: easing }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/30 hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-indigo-400 text-lg mt-0.5 group-hover:scale-110 transition-transform">•</span>
                  <span className="text-slate-300 text-sm md:text-base">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Demo Video Section */}
        {project.video && (
          <motion.section
            {...sectionMotion}
            ref={demoSectionRef}
            className="mb-12 md:mb-20 py-10 md:py-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Demo
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-700/50 shadow-2xl">
                {hasDemoVideo ? (
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster={project.image}
                    className="w-full h-full"
                    onError={() => setDemoVideoFailed(true)}
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                ) : project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                    Demo unavailable
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <GallerySection images={project.gallery} title={project.title} />
        )}

        {/* Results Section */}
        {project.results && project.results.length > 0 && (
          <motion.section
            {...sectionMotion}
            className="mb-12 md:mb-20 max-w-3xl mx-auto py-10 md:py-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Results & Impact
            </h2>
            <div className="grid gap-4">
              {project.results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: easing }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                >
                  <span className="text-emerald-400 text-lg mt-0.5">✓</span>
                  <span className="text-slate-300 text-sm md:text-base">{result}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Tech Stack Section */}
        <motion.section
          {...sectionMotion}
          className="mb-12 md:mb-20 max-w-3xl mx-auto py-10 md:py-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.tech.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:border-purple-400/40 hover:text-purple-200 hover:bg-white/10 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Figma Section */}
        {project.figma && (
          <motion.section
            {...sectionMotion}
            className="py-10 md:py-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Figma Prototype
            </h2>
            <div className="rounded-xl overflow-hidden border border-neutral-700/50 shadow-2xl">
              <iframe
                src={project.figma}
                width="100%"
                height="600"
                className="w-full bg-neutral-900"
                title="Figma prototype"
              />
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

function GallerySection({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <motion.section
        {...sectionMotion}
        className="mb-12 md:mb-20 py-10 md:py-16"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Gallery
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((img, index) => (
            <motion.div
              key={`${title}-gallery-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: easing }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-video overflow-hidden rounded-xl group cursor-pointer bg-neutral-900 border border-neutral-700/50 shadow-lg"
              onClick={() => setLightboxIndex(index)}
            >
              <Image
                src={img}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 sm:group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 min-h-11 min-w-11 flex items-center justify-center"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: easing }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${title} ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProjectDetailContent({ project }: { project: Project }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <ProjectDetailContentInner project={project} />
    </Suspense>
  );
}
