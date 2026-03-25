'use client';

import { useEffect } from 'react';
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import ProjectsGrid from "@/components/ProjectsGrid";
import Skills from "@/components/Skills";
import AITools from "@/components/AITools";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  // Handle scroll to section from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, []);

  return (
    <>
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

