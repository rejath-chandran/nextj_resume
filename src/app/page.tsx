"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Zap, 
  Palette, 
  Users, 
  Check, 
  ArrowRight, 
  Play,
  Star,
  Shield,
  LayoutTemplate,
  CloudSync,
  Code2,
  Menu,
  X,
  ChevronDown,
  Lock,
  Building2,
  GraduationCap,
  Briefcase
} from "lucide-react";

// FadeIn Scroll Component for smooth section entry
function FadeInScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    { icon: Zap, title: "Real-time Live Preview", desc: "Type your details on the left, watch your ATS resume format instantly on the right." },
    { icon: Shield, title: "ATS Optimizer Core", desc: "Built to pass Applicant Tracking System scanners used by Fortune 500 recruiters." },
    { icon: Download, title: "1-Click PDF Export", desc: "Export high-resolution, print-ready PDF files formatted according to industry standards." },
    { icon: Palette, title: "Curated Design System", desc: "Modern, professional layouts tailored for software, corporate, and creative roles." },
    { icon: CloudSync, title: "Auto-Save to Cloud", desc: "Your progress is saved automatically. Access your resumes from any browser anytime." },
    { icon: LayoutTemplate, title: "Multiple Resume Versions", desc: "Create tailored resume variants for different job applications in seconds." },
  ];

  const useCases = [
    { icon: Code2, title: "Software Engineers", desc: "Showcase projects, GitHub repositories, tech stacks, and architecture impact.", badge: "Tech & Dev" },
    { icon: Briefcase, title: "Career Professionals", desc: "Highlight measurable revenue metrics, team leadership, and key career milestones.", badge: "Corporate" },
    { icon: GraduationCap, title: "New Graduates", desc: "Turn academic projects, coursework, and internships into compelling early-career resumes.", badge: "Students" },
    { icon: Users, title: "Career Changers", desc: "Reframe transferable skills and emphasize relevant certifications for new industries.", badge: "Transition" },
  ];

  const faqs = [
    { q: "Is the resume builder really free to start?", a: "Yes! You can create your first resume, edit all sections, and export your PDF completely free without entering a credit card." },
    { q: "How does the ATS optimization work?", a: "Our resume structures use standard headings, single-column parsing geometry, and web-safe typography that ATS scanners like Workday, Greenhouse, and Lever read effortlessly." },
    { q: "Can I create multiple versions of my resume?", a: "Absoluty. You can duplicate existing resumes or build unique variants for distinct job descriptions to maximize your interview callback rate." },
    { q: "Can I download my resume as a PDF?", a: "Yes, you can export your resume as a clean, high-resolution PDF with standard A4 / Letter page dimensions anytime." },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      
      {/* Glow Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-violet-600/20 via-purple-500/15 to-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-violet-900/10 blur-[150px] rounded-full" />
        <div className="absolute top-3/4 -right-40 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F17]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Resume<span className="text-violet-400">AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Live Preview</a>
              <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/resumes">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  My Resumes
                </Button>
              </Link>
              <Link href="/builder">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-600/30 rounded-xl px-5">
                  Build Resume
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-800 bg-[#0B0F17] px-4 pt-2 pb-6 space-y-3"
            >
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Features
              </a>
              <a 
                href="#demo" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Live Preview
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                FAQ
              </a>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/resumes" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center border-slate-700 text-slate-200 hover:bg-slate-800">
                    My Resumes
                  </Button>
                </Link>
                <Link href="/builder" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center bg-violet-600 hover:bg-violet-500">
                    Create Resume Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <FadeInScroll delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-violet-300">Next-Gen Resume Platform 2.0</span>
            </div>
          </FadeInScroll>

          <FadeInScroll delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-white max-w-5xl mx-auto">
              Build ATS-Ready Resumes <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                In Minutes, Not Hours.
              </span>
            </h1>
          </FadeInScroll>

          <FadeInScroll delay={0.3}>
            <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Create sleek, recruiter-tested resumes with our real-time interactive builder. Beat applicant tracking systems and land 3x more interviews.
            </p>
          </FadeInScroll>

          <FadeInScroll delay={0.4}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/builder" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-base px-8 h-13 rounded-2xl shadow-xl shadow-violet-600/30 hover:scale-[1.02] transition-all">
                  Build Your Resume Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#demo" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base px-7 h-13 rounded-2xl">
                  <Play className="w-4 h-4 fill-slate-300 text-slate-300" />
                  See Live Demo
                </Button>
              </a>
            </div>
          </FadeInScroll>

          {/* Social Proof Badges */}
          <FadeInScroll delay={0.5} className="mt-14 pt-8 border-t border-slate-800/60 max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
              Trusted by candidates hired at top companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
              <span className="font-bold text-base sm:text-lg text-slate-300 tracking-wider">GOOGLE</span>
              <span className="font-bold text-base sm:text-lg text-slate-300 tracking-wider">META</span>
              <span className="font-bold text-base sm:text-lg text-slate-300 tracking-wider">AMAZON</span>
              <span className="font-bold text-base sm:text-lg text-slate-300 tracking-wider">MICROSOFT</span>
              <span className="font-bold text-base sm:text-lg text-slate-300 tracking-wider">NETFLIX</span>
            </div>
          </FadeInScroll>
        </section>

        {/* LIVE DEMO / MOCKUP PREVIEW SECTION */}
        <section id="demo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInScroll>
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-3 sm:p-6 shadow-2xl shadow-violet-900/20 backdrop-blur-xl">
              {/* Browser Mac Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-4 text-xs font-semibold text-slate-400 hidden sm:inline">
                    resume-ai.app/builder?template=modern-executive
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync Active
                </div>
              </div>

              {/* Grid 2 Column Preview mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Form side */}
                <div className="lg:col-span-5 space-y-4 p-4 bg-[#0B0F17] rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Step 1 of 6 · Personal Info</span>
                    <span className="text-xs text-slate-500">Auto-saved</span>
                  </div>
                  <div className="space-y-3 text-left">
                    <div>
                      <label className="text-xs font-medium text-slate-400">Full Name</label>
                      <div className="mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white">
                        Alex Rivera
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-slate-400">Role</label>
                        <div className="mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white">
                          Staff Engineer
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400">Location</label>
                        <div className="mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white">
                          San Francisco
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">Summary</label>
                      <div className="mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                        Accomplished software architect with 8+ years leading distributed systems engineering...
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Paper side */}
                <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl text-left font-sans">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Alex Rivera</h2>
                    <p className="text-sm font-bold text-violet-600">Staff Software Engineer</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">alex.rivera@example.com · +1 (555) 019-2831 · San Francisco, CA</p>
                  </div>
                  <div className="mt-4 space-y-3 text-xs">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Experience</span>
                      <div className="mt-1.5 flex justify-between font-bold text-slate-800">
                        <span>Lead Architect — CloudScale Inc.</span>
                        <span className="text-slate-400 font-normal">2021 – Present</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">Scaled microservice architecture serving 5M+ daily active requests with 99.99% uptime.</p>
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Skills</span>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">TypeScript</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">React / Next.js</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">Node.js</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">AWS Cloud</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInScroll>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInScroll className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4 font-normal">
              Designed from the ground up to eliminate formatting frustration and beat ATS screeners.
            </p>
          </FadeInScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeInScroll key={i} delay={i * 0.1}>
                  <div className="group relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 transition-all duration-300 hover:border-violet-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-900/10">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-600 text-violet-400 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </FadeInScroll>
              );
            })}
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInScroll className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Tailored Templates
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Built for Every Career Stage
            </h2>
          </FadeInScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <FadeInScroll key={i} delay={i * 0.1}>
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-left hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-violet-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                        {uc.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white mb-1.5">{uc.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{uc.desc}</p>
                  </div>
                </FadeInScroll>
              );
            })}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInScroll className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Simple Plans for Serious Job Seekers
            </h2>
            
            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === "monthly" ? "bg-violet-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "bg-violet-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Annual Billing
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-extrabold">Save 40%</span>
              </button>
            </div>
          </FadeInScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <FadeInScroll delay={0.1}>
              <div className="h-full rounded-3xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Starter</h3>
                  <p className="text-xs text-slate-400 mb-6">Perfect for building your first resume</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-white">$0</span>
                    <span className="text-slate-500 text-xs font-medium"> / forever</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      1 Full Resume Profile
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Standard ATS PDF Export
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Real-time Live Editor
                    </li>
                  </ul>
                </div>
                <Link href="/builder">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 rounded-xl py-5">
                    Start Free Now
                  </Button>
                </Link>
              </div>
            </FadeInScroll>

            {/* Pro Plan */}
            <FadeInScroll delay={0.2}>
              <div className="relative h-full rounded-3xl border-2 border-violet-500 bg-slate-900/90 p-8 flex flex-col justify-between shadow-2xl shadow-violet-900/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 mt-2">Pro Job Seeker</h3>
                  <p className="text-xs text-violet-300 mb-6">For active job hunters seeking fast hiring</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-white">
                      {billingCycle === "annual" ? "$7" : "$12"}
                    </span>
                    <span className="text-slate-400 text-xs font-medium"> / month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-xs text-slate-200">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-violet-400" />
                      Unlimited Resume Versions
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-violet-400" />
                      All Executive & Dev Templates
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-violet-400" />
                      Advanced ATS keyword scanning
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-violet-400" />
                      Auto-cloud backup & sync
                    </li>
                  </ul>
                </div>
                <Link href="/builder">
                  <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-5 shadow-lg shadow-violet-600/30">
                    Get Started Pro
                  </Button>
                </Link>
              </div>
            </FadeInScroll>

            {/* Enterprise Plan */}
            <FadeInScroll delay={0.3}>
              <div className="h-full rounded-3xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Teams & Agencies</h3>
                  <p className="text-xs text-slate-400 mb-6">For career coaches & bootcamps</p>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-white">
                      {billingCycle === "annual" ? "$29" : "$49"}
                    </span>
                    <span className="text-slate-500 text-xs font-medium"> / month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Manage up to 25 Student Seats
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Custom Branding & Watermarks
                    </li>
                  </ul>
                </div>
                <Link href="/builder">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 rounded-xl py-5">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </FadeInScroll>

          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <FadeInScroll className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Frequently Asked Questions
            </h2>
          </FadeInScroll>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeInScroll key={i} delay={i * 0.08}>
                <div 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-base text-white">{faq.q}</h3>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? "rotate-180 text-violet-400" : ""}`} />
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </FadeInScroll>
            ))}
          </div>
        </section>

        {/* FINAL CALL TO ACTION BANNER */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInScroll>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 p-8 sm:p-14 text-center shadow-2xl shadow-violet-900/40">
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Ready to Land Your Next Career Role?
                </h2>
                <p className="mt-4 text-base sm:text-lg text-violet-100 font-normal">
                  Create an ATS-optimized, high-impact resume in 5 minutes. Free forever.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link href="/builder">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-base px-8 h-13 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                      Create Your Resume Now
                      <ArrowRight className="w-5 h-5 ml-2 text-violet-600" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeInScroll>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base text-white">ResumeAI</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/builder" className="hover:text-white transition-colors">Resume Builder</Link>
          </div>
          <p className="text-xs text-slate-500">© 2026 ResumeAI Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
