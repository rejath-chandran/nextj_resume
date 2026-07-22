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
  ctaText = "Build Resume",
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
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300">
      {/* Semi-transparent Glassmorphism Floating Pill Navbar */}
      <div
        className={`relative rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-white/20 bg-slate-950/40 backdrop-blur-xl shadow-2xl shadow-black/50 px-3 py-1.5"
            : "border-white/15 bg-slate-950/25 backdrop-blur-md shadow-xl shadow-black/30 px-3.5 py-1.5"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group pl-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
              Resume<span className="text-violet-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Items inside Floating Glass Pill */}
          <nav className="hidden md:flex items-center">
            <div className="p-0.5 rounded-full bg-black/25 border border-white/10 backdrop-blur-sm flex items-center gap-0.5">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveId(item.id)}
                    className={`relative px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors duration-200 ${
                      isActive ? "text-slate-950 font-bold" : "text-slate-200 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="floatingGlassPillIndicator"
                        className="absolute inset-0 rounded-full bg-white shadow-md shadow-white/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-1.5 pr-0.5">
            <Link href="/resumes">
              <span className="text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 transition-colors">
                My Resumes
              </span>
            </Link>
            <Link href={ctaHref}>
              <button className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[11px] px-3.5 py-1.5 shadow-md shadow-violet-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all">
                <span>{ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Animated Glass Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mt-2 md:hidden rounded-2xl border border-white/15 bg-slate-950/70 backdrop-blur-2xl p-3 shadow-2xl space-y-2"
          >
            <div className="space-y-0.5">
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
                    className={`block px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white text-slate-950 shadow-md font-bold"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="pt-2 flex flex-col gap-1.5 border-t border-white/10">
              <Link href="/resumes" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2 rounded-xl border border-white/10 bg-slate-900/60 text-xs font-semibold text-slate-200">
                  My Resumes
                </button>
              </Link>
              <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-violet-600/30">
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
