'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';
import Image from 'next/image';

export interface TechIcon {
  name: string;
  icon?: IconType;
  image?: string;
  color?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  iconColor: string;
  gradient: string;
  techIcons: TechIcon[];
}

interface SkillsAccordionProps {
  categories: SkillCategory[];
  isMobile?: boolean;
}

export default function SkillsAccordion({ categories, isMobile = false }: SkillsAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);

  const handleAccordionClick = (index: number, event?: React.MouseEvent) => {
    if (event && !isMobile) {
      const rect = event.currentTarget.getBoundingClientRect();
      setRippleOrigin({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
    setActiveIndex(index);
  };

  return (
    <>
      {/* Desktop Accordion */}
      <div className="hidden md:flex gap-3 h-[320px] sm:h-[360px] md:h-[420px]">
        {categories.map((category, index) => {
          const isActive = activeIndex === index;
          const validTechIcons = category.techIcons.filter(tech => tech.icon || tech.image);
          
          return (
            <motion.div
              key={category.id}
              className="relative rounded-2xl cursor-pointer group overflow-hidden"
              animate={{
                width: isActive ? '380px' : '60px',
              }}
              transition={{
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={(e) => handleAccordionClick(index, e)}
              whileHover={{ scale: isActive ? 1 : 1.01 }}
              style={{
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Ripple effect */}
              {showRipple && isActive && (
                <motion.div
                  className="absolute rounded-full bg-white/20 pointer-events-none z-30"
                  style={{
                    left: rippleOrigin.x,
                    top: rippleOrigin.y,
                  }}
                  initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
                  animate={{ width: 400, height: 400, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )}

              {/* Category Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover opacity-40"
                />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-linear-to-br ${category.gradient} opacity-10 z-10`} />
              
              {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              
              {/* Border with Glow */}
              <div className={`absolute inset-0 rounded-2xl border transition-all duration-500 z-10 ${
                isActive 
                  ? 'border-white/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]' 
                  : 'border-white/10 group-hover:border-white/15 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]'
              }`} />

              {/* Content */}
              <div className="relative h-full flex flex-col z-20 p-5 md:p-6">
                
                {/* Bottom Content */}
                <div className="flex-1 flex flex-col justify-end">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <h3 className={`text-2xl font-bold bg-linear-to-r ${category.iconColor} bg-clip-text text-transparent leading-tight`}>
                            {category.title}
                          </h3>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        {/* Tech Icons Grid with float animation */}
                        {validTechIcons.length >= 2 && (
                          <div className="grid grid-cols-4 gap-3">
                            {validTechIcons.map((tech, idx) => (
                              <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ 
                                  delay: 0.2 + idx * 0.05,
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15
                                }}
                                className="group/icon relative"
                              >
                                <motion.div 
                                  className="w-full aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20 p-2"
                                  whileHover={{ 
                                    scale: 1.15, 
                                    rotate: [0, -5, 5, 0],
                                    transition: { duration: 0.3 }
                                  }}
                                  animate={{
                                    y: [0, -4, 0],
                                  }}
                                  transition={{
                                    y: {
                                      duration: 2 + idx * 0.2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }
                                  }}
                                >
                                  {tech.image ? (
                                    <Image
                                      src={tech.image}
                                      alt={tech.name}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 object-contain"
                                    />
                                  ) : tech.icon && (
                                    <tech.icon className={`w-6 h-6 ${tech.color || 'text-white/90'}`} />
                                  )}
                                </motion.div>
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                  {tech.name}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="inactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex flex-col items-center gap-4">
                          {/* Vertical Title */}
                          <p
                            className={`font-semibold text-sm tracking-wider whitespace-nowrap bg-linear-to-b ${category.iconColor} bg-clip-text text-transparent`}
                            style={{
                              writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)',
                            }}
                          >
                            {category.title}
                          </p>
                          
                          {/* Mini Tech Icons Stack */}
                          {validTechIcons.length >= 2 && (
                            <div className="flex flex-col items-center gap-2">
                              {validTechIcons.map((tech) => (
                                <motion.div
                                  key={tech.name}
                                  className="w-6 h-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity p-0.5"
                                  whileHover={{ scale: 1.2 }}
                                >
                                  {tech.image ? (
                                    <Image
                                      src={tech.image}
                                      alt={tech.name}
                                      width={20}
                                      height={20}
                                      className="w-5 h-5 object-contain"
                                    />
                                  ) : tech.icon && (
                                    <tech.icon className={`w-4 h-4 ${tech.color || 'text-white/90'}`} />
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-mandatory scroll-smooth px-4 pr-12" style={{ touchAction: 'pan-x' }}>
        <div className="flex gap-3 w-max pb-4">
          {categories.map((category, index) => {
            const isActive = activeIndex === index;
            const validTechIcons = category.techIcons.filter(tech => tech.icon || tech.image);
            
            return (
              <motion.div
                key={category.id}
                className="relative rounded-xl cursor-pointer shrink-0 snap-start overflow-hidden last:mr-8"
                animate={{
                  width: isActive ? 260 : 80,
                }}
                style={{ 
                  height: '320px',
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                }}
                onClick={() => handleAccordionClick(index)}
              >
                {/* Category Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 80vw"
                    className="object-cover opacity-35"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-linear-to-br ${category.gradient} opacity-10 z-10`} />
                
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-black/30 z-10" />
                
                {/* Border */}
                <div className={`absolute inset-0 rounded-xl border transition-all duration-500 z-10 ${
                  isActive ? 'border-white/20' : 'border-white/10'
                }`} />

                {/* Content */}
                <div className="relative h-full flex flex-col z-20 p-4">
                  
                  {/* Bottom Content */}
                  <div className="flex-1 flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        <motion.div
                          key="active"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="space-y-3"
                        >
                          <div className="space-y-1.5">
                            <h3 className={`text-lg font-bold bg-linear-to-r ${category.iconColor} bg-clip-text text-transparent leading-tight`}>
                              {category.title}
                            </h3>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {category.description}
                            </p>
                          </div>
                          
                          {/* Tech Icons Grid */}
                          {validTechIcons.length >= 2 && (
                            <div className="grid grid-cols-4 gap-2">
                              {validTechIcons.map((tech, idx) => (
                                <motion.div
                                  key={tech.name}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 + idx * 0.05 }}
                                  className="aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center p-1.5"
                                >
                                  {tech.image ? (
                                    <Image
                                      src={tech.image}
                                      alt={tech.name}
                                      width={28}
                                      height={28}
                                      className="w-7 h-7 object-contain"
                                    />
                                  ) : tech.icon && (
                                    <tech.icon className={`w-5 h-5 ${tech.color || 'text-white/90'}`} />
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="inactive"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-center gap-3 h-full"
                        >
                          {/* Vertical Title */}
                          <p
                            className={`font-semibold text-xs tracking-wider whitespace-nowrap bg-linear-to-b ${category.iconColor} bg-clip-text text-transparent`}
                            style={{
                              writingMode: 'vertical-rl',
                              transform: 'rotate(180deg)',
                            }}
                          >
                            {category.title}
                          </p>
                          
                          {/* Mini Tech Icons Stack */}
                          {validTechIcons.length >= 2 && (
                            <div className="flex flex-col items-center gap-1.5">
                              {validTechIcons.slice(0, 3).map((tech) => (
                                <div
                                  key={tech.name}
                                  className="w-5 h-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded flex items-center justify-center opacity-80 p-0.5"
                                >
                                  {tech.image ? (
                                    <Image
                                      src={tech.image}
                                      alt={tech.name}
                                      width={16}
                                      height={16}
                                      className="w-4 h-4 object-contain"
                                    />
                                  ) : tech.icon && (
                                    <tech.icon className={`w-3 h-3 ${tech.color || 'text-white/90'}`} />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
