'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Code2, Brain, Database, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const fadeIn = (delay: number, isMobile: boolean) => ({
  hidden: { opacity: 0, y: isMobile ? 10 : 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: isMobile ? 0.4 : 0.6, 
      delay: isMobile ? delay * 0.5 : delay 
    } 
  },
});

export default function ProfilePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const expertise = [
    { icon: Brain, label: 'Computer Vision', desc: 'Mask R-CNN, Image Segmentation' },
    { icon: Code2, label: 'Web Development', desc: 'Next.js, React, MySQL' },
    { icon: Database, label: 'System Design', desc: 'Database Architecture, CRUD' },
    { icon: Sparkles, label: 'AI-Augmented', desc: 'Prompt Engineering, AI Tools' },
  ];

  const experience = [
    {
      role: 'IT & Administration Intern',
      org: 'BNN Prov Lampung',
      period: 'Jan - Mar 2024',
      contributions: [
        'Built a web-based system for managing incoming and outgoing documents',
        'Designed the database structure to handle document workflows',
        'Created the interface so staff could easily navigate and use the system',
      ],
      tools: ['MySQL', 'HTML', 'CSS', 'PHP'],
    },
    {
      role: 'Event Operations Crew',
      org: 'Rvolt Pro Indonesia',
      period: '2022-2025',
      contributions: [
        'Coordinated event logistics and operations',
        'Managed registration and participant services',
      ],
      tools: ['Operations', 'Coordination'],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-neutral-950 to-black text-white">
      <div className="pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 pb-6 max-w-5xl">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium text-sm">Back to Home</span>
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl pb-20">
        
        {/* HERO PROFILE */}
        <motion.section
          className="text-center mb-12 sm:mb-14 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0, isMobile)}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
            Muhammad Bayu Tiar
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 font-medium mb-4">
            AI-Augmented Developer • Computer Vision
          </p>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Building intelligent systems with modern AI tools and practical engineering mindset
          </p>
        </motion.section>

        {/* PROFESSIONAL SUMMARY */}
        <motion.section
          className="mb-12 sm:mb-14 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.1, isMobile)}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">Professional Summary</h2>
          <div className="space-y-4 text-neutral-200 leading-relaxed text-sm sm:text-base">
            <p>
              I build systems that help simplify workflows and make data easier to manage. My background is in Computer Science, where I worked on web-based information systems and computer vision projects like Mask R-CNN for image segmentation.
            </p>
            <p>
              I design databases, build interfaces, and use AI tools to speed up development. My approach is practical. I focus on what works, keep things clean, and deliver systems that people can actually use.
            </p>
          </div>
        </motion.section>

        {/* CORE EXPERTISE */}
        <motion.section
          className="mb-12 sm:mb-14 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.15, isMobile)}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">Core Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {expertise.map((item, idx) => (
              <motion.div
                key={item.label}
                className="p-4 sm:p-5 rounded-xl bg-neutral-900/60 border border-neutral-700/50 hover:border-cyan-500/40 transition-all duration-300"
                initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0.15 + idx * 0.03 : 0.2 + idx * 0.05 }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{item.label}</h3>
                    <p className="text-xs sm:text-sm text-neutral-300">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* EXPERIENCE */}
        <motion.section
          className="mb-12 sm:mb-14 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.2, isMobile)}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">Experience</h2>
          <div className="space-y-5 sm:space-y-6">
            {experience.map((exp, idx) => (
              <motion.div
                key={exp.role}
                className="p-5 sm:p-6 rounded-xl bg-neutral-900/60 border border-neutral-700/50"
                initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: isMobile ? 0.2 + idx * 0.05 : 0.3 + idx * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-cyan-400 font-medium text-sm sm:text-base">{exp.org}</p>
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-400 mt-1 md:mt-0">{exp.period}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {exp.contributions.map((item, i) => (
                    <li key={i} className="text-xs sm:text-sm text-neutral-200 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 sm:px-3 py-1 text-xs rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PROJECT HIGHLIGHT */}
        <motion.section
          className="mb-12 sm:mb-14 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.25, isMobile)}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">Project Highlight</h2>
          <div className="p-5 sm:p-6 rounded-xl bg-linear-to-br from-neutral-900/80 to-neutral-900/50 border border-cyan-500/30">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Mask R-CNN Object Detection & Segmentation
            </h3>
            <p className="text-cyan-400 font-medium mb-4 text-sm sm:text-base">Computer Vision • Final Project</p>
            <p className="text-neutral-200 leading-relaxed mb-4 text-sm sm:text-base">
              I built an image segmentation model using Mask R-CNN to detect and analyze objects in images. The project covered everything from preparing the dataset to training the model, evaluating its performance, and converting pixel data into real-world area measurements.
            </p>
            <div className="space-y-2.5 sm:space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">→</span>
                <span className="text-xs sm:text-sm text-neutral-200">Trained a Mask R-CNN model for accurate image segmentation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">→</span>
                <span className="text-xs sm:text-sm text-neutral-200">Processed datasets and measured model performance with metrics</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">→</span>
                <span className="text-xs sm:text-sm text-neutral-200">Converted pixel measurements to area estimates for practical use</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Python', 'Mask R-CNN', 'Computer Vision', 'Data Analysis'].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 sm:px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* WORK APPROACH */}
        <motion.section
          className="mb-12 sm:mb-14 md:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.3, isMobile)}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">Work Approach</h2>
          <div className="p-5 sm:p-6 rounded-xl bg-neutral-900/60 border border-neutral-700/50">
            <p className="text-neutral-200 leading-relaxed text-sm sm:text-base">
              I build systems that work. Whether it&apos;s a database, a web interface, or a computer vision model, I focus on making things functional and reliable. I use AI tools to move faster, but I don&apos;t skip the fundamentals. I write clean code, build solid architecture, and make sure the system is reliable.
            </p>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.35, isMobile)}
        >
          <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-cyan-500/10 via-emerald-500/10 to-teal-500/10 border border-cyan-500/20">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">Let&apos;s Build Something</h2>
            <p className="text-neutral-200 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Open to opportunities in web development, AI systems, and data-driven projects
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => router.push('/?section=contact')}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 text-sm sm:text-base"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push('/projects')}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300 text-sm sm:text-base"
              >
                View Projects
              </button>
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <a
                href="https://github.com/muhammadbayutiar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-neutral-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-bayu-tiar-a7889027b"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-neutral-400 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.section>

      </div>
      </div>
    </div>
  );
}
