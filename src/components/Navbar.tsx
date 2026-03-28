'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

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
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
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
    console.log(`[DEBUG] scrollToSection called for: ${id}`);
    
    const element = document.getElementById(id);

    if (!element) {
      console.error("Scroll failed: section not found ->", id);
      return;
    }

    console.log(`[DEBUG] Element found, scrolling to: ${id}`);
    
    const isMobile = window.innerWidth < 768;
    
    element.scrollIntoView({
      behavior: isMobile ? "auto" : "smooth",
      block: "start",
    });

    // DON'T close dropdown here - let the caller handle it
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
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: scrolled ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(6px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between pointer-events-auto">
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
                    
                    // === MOBILE TOUCH HANDLER (Primary for mobile devices) ===
                    onTouchStart={() => {
                      console.log(`[TOUCH START] ${link.name}`);
                    }}
                    
                    onTouchEnd={(e) => {
                      console.log(`[TOUCH END] ${link.name} - type: ${link.type}`);
                      
                      // Prevent default to avoid ghost clicks
                      e.preventDefault();
                      e.stopPropagation();
                      
                      if (link.type === "scroll" && link.id) {
                        console.log(`[TOUCH] Navigating to section: ${link.id}`);
                        
                        // Start navigation immediately
                        scrollToSection(link.id);
                        
                        // Close dropdown after a delay to let navigation start
                        requestAnimationFrame(() => {
                          setTimeout(() => {
                            console.log(`[TOUCH] Closing dropdown after navigation to: ${link.id}`);
                            setShowDropdown(false);
                          }, 300); // Longer delay for About/Projects
                        });
                        
                      } else if (link.type === "route" && link.path) {
                        console.log(`[TOUCH] Routing to: ${link.path}`);
                        router.push(link.path);
                        setShowDropdown(false);
                      }
                    }}
                    
                    // === DESKTOP CLICK HANDLER (Fallback) ===
                    onClick={(e) => {
                      console.log(`[CLICK] ${link.name} - type: ${link.type}`);
                      
                      // Ignore synthetic clicks from touch events
                      if (e.detail === 0) {
                        console.log(`[CLICK] Synthetic click detected, ignoring`);
                        return;
                      }
                      
                      if (link.type === "route" && link.path) {
                        console.log(`[CLICK] Routing to: ${link.path}`);
                        router.push(link.path);
                        setShowDropdown(false);
                      } else if (link.type === "scroll" && link.id) {
                        console.log(`[CLICK] Navigating to section: ${link.id}`);
                        scrollToSection(link.id);
                        setTimeout(() => {
                          console.log(`[CLICK] Closing dropdown after navigation to: ${link.id}`);
                          setShowDropdown(false);
                        }, 150);
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
