'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { scrollToSection } from '@/utils/scrollToSection';

// Lazy load below-fold sections
const About = dynamic(() => import('@/components/About'));
const Education = dynamic(() => import('@/components/Education'));
const ProjectsGrid = dynamic(() => import('@/components/ProjectsGrid'));
const Skills = dynamic(() => import('@/components/Skills'));
const AITools = dynamic(() => import('@/components/AITools'));
const Contact = dynamic(() => import('@/components/Contact'));
const Footer = dynamic(() => import('@/components/Footer'));
const GlobalEtherealBackground = dynamic(() => import('@/components/background/GlobalEtherealBackground'), { ssr: false });

export default function Home() {
  // Handle scroll to section from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    
    if (section) {
      setTimeout(() => {
        scrollToSection(section);
      }, 500);
    }
  }, []);

  return (
    <>
      <GlobalEtherealBackground />
      <LoadingScreen />
      <Navbar />
      <Hero />
      <About />
      <Education />
      <ProjectsGrid />
      <Skills />
      <AITools />
      <Contact />
      <Footer />
    </>
  );
}

