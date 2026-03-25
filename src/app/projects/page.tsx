'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { projectsData } from '@/data/projects';

const categories = ['all', 'ai', 'web', 'uiux'] as const;
type Category = typeof categories[number];

function getPreviewImage(project: typeof projectsData[number]) {
  return project.image ?? project.gallery?.[0] ?? '/images/project-placeholder.svg';
}

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL
  const initialCategory = (() => {
    const category = searchParams.get('category') as Category;
    return category && categories.includes(category) ? category : 'all';
  })();
  
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set());

  const filteredProjects = selectedCategory === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === selectedCategory);

  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
    setImageLoading(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleImageLoad = (id: string) => {
    setImageLoading(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
    // Persist filter in URL
    const params = new URLSearchParams(window.location.search);
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '/projects';
    router.replace(newUrl, { scroll: false });
  };

  const handleBack = () => {
    router.push('/?section=projects');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-950 text-white pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 pb-6 max-w-7xl">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium text-sm">Back to Featured</span>
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-12">
        {/* Hero */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold mb-4 bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-xl"
          >
            All Projects
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-400 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore my work in AI, web development and design
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap gap-2 justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 border-2 relative overflow-hidden ${selectedCategory === cat ? 'bg-linear-to-r from-indigo-500/90 to-purple-600/90 border-transparent text-white shadow-md shadow-indigo-500/25' : 'bg-white/5 border-white/20 text-slate-400 hover:bg-white/10 hover:border-white/40 hover:text-white backdrop-blur-sm'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat === 'all' ? 'All' : cat.toUpperCase()}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project, index) => {
            const previewSrc = imageErrors.has(project.id) ? '/images/project-placeholder.svg' : getPreviewImage(project);
            const isLoading = imageLoading.has(project.id);
            
            return (
              <motion.div
                key={project.id}
                className="group flex flex-col rounded-xl overflow-hidden bg-neutral-900/70 border border-neutral-700/50 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-400 shadow-lg sm:hover:-translate-y-1.5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Preview */}
                <Link href={`/projects/${project.id}?from=all`} className="block relative aspect-video overflow-hidden bg-neutral-800">
                  {/* Loading skeleton */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-linear-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse" />
                  )}
                  <Image
                    src={previewSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => handleImageError(project.id)}
                    onLoad={() => handleImageLoad(project.id)}
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30" />
                </Link>

                {/* Content */}
                <div className="p-4 md:p-5 flex flex-col h-[200px]">
                  {/* Category Badge */}
                  <span className={`px-2.5 py-1 mb-2 inline-block text-xs font-semibold rounded-full w-fit ${project.category === 'ai' ? 'bg-orange-500/20 text-orange-400 border border-orange-400/50' : project.category === 'web' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50' : 'bg-violet-500/20 text-violet-400 border border-violet-400/50'}`}>
                    {project.category.toUpperCase()}
                  </span>

                  <Link href={`/projects/${project.id}?from=all`} className="group/link">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover/link:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-slate-500 text-sm line-clamp-2 mb-3 flex-1">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/projects/${project.id}?from=all`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-linear-to-r from-indigo-500/90 to-purple-600/90 text-white text-xs font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 mt-auto"
                  >
                    View Project
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div className="col-span-full text-center py-24">
            <h3 className="text-2xl font-bold text-slate-400 mb-4">No projects match this filter</h3>
            <button 
              onClick={() => handleCategoryChange('all')}
              className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm font-medium"
            >
              Show All ({projectsData.length})
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}


export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
