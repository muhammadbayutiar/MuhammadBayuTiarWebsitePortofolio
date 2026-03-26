'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { scrollToSection as scrollToSectionUtil } from "@/utils/scrollToSection";

export default function Navbar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "education", "projects", "skills", "contact"];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.2,
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDropdown) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDropdown]);

  const scrollToSection = (id: string) => {
    // Close dropdown IMMEDIATELY before scrolling
    setShowDropdown(false);
    
    // Wait for dropdown animation to fully finish before scrolling
    // Framer-motion dropdown needs time to unmount (prevents layout shift)
    setTimeout(() => {
      scrollToSectionUtil(id);
    }, 250);
  };

  const menuLinks = [
    { name: "Personal", type: "route", path: "/profile" },
    { name: "About", type: "scroll", id: "about" },
    { name: "Education", type: "scroll", id: "education" },
    { name: "Projects", type: "scroll", id: "projects" },
    { name: "Skills", type: "scroll", id: "skills" },
    { name: "Contact", type: "scroll", id: "contact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full transition-all duration-300"
      style={{
        zIndex: 9999,
        backgroundColor: 'transparent',
        backdropFilter: scrolled ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(6px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.button
          onClick={() => scrollToSection('home')}
          className={`text-lg font-semibold transition-all duration-300 px-2 py-1 rounded ${
            activeSection === 'home'
              ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
              : 'text-white hover:text-cyan-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </motion.button>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            aria-expanded={showDropdown}
            aria-haspopup="true"
            aria-controls="nav-menu"
            aria-label="Navigation menu"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>Menu</span>
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                id="nav-menu"
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-2 sm:right-0 top-[calc(100%+6px)] w-40 sm:w-44 max-h-[60vh] overflow-y-auto rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg py-1.5"
              >
                {menuLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    role="menuitem"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => {
                      if (link.type === "route" && link.path) {
                        router.push(link.path);
                        setShowDropdown(false);
                      } else if (link.type === "scroll" && link.id) {
                        scrollToSection(link.id);
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all duration-300 first:rounded-t-2xl last:rounded-b-2xl ${
                      link.type === "scroll" && activeSection === link.id
                        ? 'text-cyan-400 bg-white/10 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                        : 'text-neutral-300 hover:text-cyan-400 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
