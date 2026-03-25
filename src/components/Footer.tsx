'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="py-16 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-xl md:text-2xl font-bold bg-linear-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Muhammad Bayu Tiar
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Prompt Engineer • AI Builder • Vibe Coder
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h4 className="text-base font-semibold text-white">Navigation</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#home" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Skills", href: "#skills" },
                { name: "Contact", href: "#contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-all duration-300 inline-block relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-linear-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h4 className="text-base font-semibold text-white">Connect</h4>
            <div className="flex space-x-3">
              <Link
                href="https://github.com/muhammadbayutiar"
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group relative"
                aria-label="GitHub"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Github className="w-5 h-5 text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all duration-300" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/muhammad-bayu-tiar-a7889027b"
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group relative"
                aria-label="LinkedIn"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Linkedin className="w-5 h-5 text-blue-400 relative z-10 drop-shadow-[0_0_8px_rgba(59,130,246,0)] group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300" />
              </Link>
              <Link
                href="mailto:muhammadbayutiar@gmail.com"
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 group relative"
                aria-label="Email"
              >
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Mail className="w-5 h-5 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="my-8 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="text-center">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Muhammad Bayu Tiar. Crafted with Next.js & AI-assisted development.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Footer;
