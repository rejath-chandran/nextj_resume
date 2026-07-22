"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Menu, X, ArrowRight } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface GlassNavbarProps {
  items?: NavItem[];
  defaultActiveId?: string;
  ctaText?: string;
  ctaHref?: string;
}

const defaultNavItems: NavItem[] = [
  { id: "features", label: "Features", href: "#features" },
  { id: "demo", label: "Live Preview", href: "#demo" },
  { id: "pricing", label: "Pricing", href: "#pricing" },
  { id: "faq", label: "FAQ", href: "#faq" },
];

export default function GlassNavbar({
  items = defaultNavItems,
  defaultActiveId = "features",
  ctaText = "Build Resume Free",
  ctaHref = "/builder",
}: GlassNavbarProps) {
  const [activeId, setActiveId] = useState<string>(defaultActiveId);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-300">
      {/* Professional SaaS Glassmorphism Floating Pill Navbar */}
      <div
        className={`relative rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-slate-700/80 bg-[#0B0F17]/85 backdrop-blur-2xl shadow-2xl shadow-black/70 px-4 sm:px-6 py-2.5 sm:py-3"
            : "border-slate-800/80 bg-[#0B0F17]/65 backdrop-blur-xl shadow-xl shadow-black/40 px-5 sm:px-7 py-3 sm:py-3.5"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-black text-base sm:text-lg tracking-tight text-white">
              Resume<span className="text-violet-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Items inside Floating Glass Pill */}
          <nav className="hidden md:flex items-center">
            <div className="p-1 rounded-full bg-slate-900/80 border border-slate-800/90 shadow-inner flex items-center gap-1">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveId(item.id)}
                    className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 ${
                      isActive ? "text-slate-950 font-extrabold" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="floatingGlassPillIndicator"
                        className="absolute inset-0 rounded-full bg-white shadow-lg shadow-white/20"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/resumes">
              <span className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors">
                My Resumes
              </span>
            </Link>
            <Link href={ctaHref}>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 sm:py-3 shadow-lg shadow-violet-600/35 hover:scale-[1.03] active:scale-[0.98] transition-all">
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-200 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Animated Glass Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3 md:hidden rounded-3xl border border-slate-800 bg-[#0B0F17]/95 backdrop-blur-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="space-y-1.5">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveId(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                      isActive
                        ? "bg-white text-slate-950 shadow-md"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="pt-3 flex flex-col gap-2.5 border-t border-slate-800">
              <Link href="/resumes" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-2xl border border-slate-700 bg-slate-900 text-sm font-semibold text-slate-200">
                  My Resumes
                </button>
              </Link>
              <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-600/30">
                  {ctaText}
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
