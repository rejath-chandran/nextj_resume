"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Award,
  Check,
  Eye,
  X,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
} from "lucide-react";

import { FadeIn, GlowCard, Magnetic, ProgressRing, StepPanel } from "@/components/builder/animated";
import {
  DangerGhostButton,
  Field,
  GhostButton,
  PrimaryButton,
  TextArea,
  TextInput,
} from "@/components/builder/form-fields";
import TemplateSelector, { type TemplateName } from "@/components/builder/TemplateSelector";
import ProfessionalTemplate from "@/components/builder/templates/ProfessionalTemplate";
import CleanSidebarTemplate from "@/components/builder/templates/CleanSidebarTemplate";

/* --------------------------------- Types --------------------------------- */

type PersonalInfo = {
  id?: number;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
};

type Experience = { id: string; dbId?: number; role: string; company: string; period: string; description: string };
type Education = { id: string; dbId?: number; school: string; degree: string; period: string };
type Skill = { id: string; dbId?: number; name: string; level: "Beginner" | "Intermediate" | "Advanced" | "Expert" };
type Project = { id: string; dbId?: number; name: string; description: string; link: string };
type Certification = { id: string; dbId?: number; name: string; issuer: string; year: string };

const uid = () => Math.random().toString(36).slice(2, 10);

/* --------------------------------- Steps --------------------------------- */

type StepKey = "personal" | "experience" | "education" | "skills" | "projects" | "certifications";

type SectionStep = {
  key: StepKey;
  label: string;
  icon: typeof User;
};

const DEFAULT_STEPS: SectionStep[] = [
  { key: "personal", label: "Personal info", icon: User },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "skills", label: "Skills", icon: Sparkles },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "certifications", label: "Certifications", icon: Award },
];

export type { StepKey, SectionStep };

/* ------------------------------- Page ------------------------------- */

export default function BuilderPage() {
  const [personalInfoId, setPersonalInfoId] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("classic");
  const [sectionOrder, setSectionOrder] = useState<SectionStep[]>(DEFAULT_STEPS);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const [personal, setPersonal] = useState<PersonalInfo>({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setPersonalInfoId(parseInt(id));
      loadResumeData(parseInt(id));
    }
  }, []);

  const loadResumeData = async (id: number) => {
    try {
      const response = await fetch(`/api/resumes?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setPersonal({
          id: data.id,
          fullName: data.fullName || "",
          title: data.title || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          summary: data.summary || "",
        });
        if (data.experiences) {
          setExperience(data.experiences.map((e: any) => ({
            id: uid(),
            dbId: e.id,
            role: e.position || "",
            company: e.company || "",
            period: e.startDate ? `${e.startDate} — ${e.endDate || "Present"}` : "",
            description: e.description || "",
          })));
        }
        if (data.education) {
          setEducation(data.education.map((e: any) => ({
            id: uid(),
            dbId: e.id,
            school: e.institution || "",
            degree: e.degree || "",
            period: e.graduationDate || "",
          })));
        }
        if (data.skills) {
          setSkills(data.skills.map((s: any) => ({
            id: uid(),
            dbId: s.id,
            name: s.skillName || "",
            level: "Intermediate",
          })));
        }
        if (data.projects) {
          setProjects(data.projects.map((p: any) => ({
            id: uid(),
            dbId: p.id,
            name: p.name || "",
            description: p.description || "",
            link: p.technologies || "",
          })));
        }
        if (data.certifications) {
          setCertifications(data.certifications.map((c: any) => ({
            id: uid(),
            dbId: c.id,
            name: c.name || "",
            issuer: c.issuingOrganization || "",
            year: "",
          })));
        }
      }
    } catch (error) {
      console.error("Failed to load resume:", error);
    }
  };

  const savePersonalInfo = async (updated: PersonalInfo) => {
    try {
      if (personalInfoId) {
        await fetch("/api/resumes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updated, id: personalInfoId }),
        });
      } else if (updated.fullName || updated.email) {
        const response = await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (response.ok) {
          const data = await response.json();
          setPersonalInfoId(data.id);
          window.history.replaceState({}, "", `?id=${data.id}`);
        }
      }
    } catch (err) {
      console.error("Failed to save personal info:", err);
    }
  };

  const handlePersonalChange = (v: PersonalInfo) => {
    setPersonal(v);
    savePersonalInfo(v);
  };

  const activeStep = sectionOrder[stepIndex];

  const completion = useMemo(() => {
    const flags = [
      Boolean(personal.fullName && personal.email),
      experience.length > 0,
      education.length > 0,
      skills.length > 0,
      projects.length > 0,
      certifications.length > 0,
    ];
    return flags.filter(Boolean).length / flags.length;
  }, [personal, experience, education, skills, projects, certifications]);

  function goTo(index: number) {
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(index);
  }

  /* --- Drag & Drop reorder --- */
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTargetIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === toIndex) {
      setDragIndex(null);
      setDropTargetIndex(null);
      return;
    }
    setSectionOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    // Keep the active step pointing at the same section after reorder
    const currentKey = sectionOrder[stepIndex]?.key;
    if (currentKey) {
      setSectionOrder((prev) => {
        const newIdx = prev.findIndex((s) => s.key === currentKey);
        if (newIdx !== -1) setStepIndex(newIdx);
        return prev;
      });
    }
    setDragIndex(null);
    setDropTargetIndex(null);
  }, [dragIndex, sectionOrder, stepIndex]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDropTargetIndex(null);
  }, []);

  const sectionKeys = useMemo(() => sectionOrder.map((s) => s.key), [sectionOrder]);

  function stepIsComplete(key: StepKey) {
    switch (key) {
      case "personal":
        return Boolean(personal.fullName && personal.email);
      case "experience":
        return experience.length > 0;
      case "education":
        return education.length > 0;
      case "skills":
        return skills.length > 0;
      case "projects":
        return projects.length > 0;
      case "certifications":
        return certifications.length > 0;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-violet-100 selection:text-violet-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-xs transition-all">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {personal.fullName ? `${personal.fullName}'s Resume` : "Resume Builder"}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                Auto-saved in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2.5 sm:flex bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60">
              <ProgressRing progress={completion} size={24} strokeWidth={3} />
              <span className="text-xs font-semibold text-slate-700">
                {Math.round(completion * 100)}% complete
              </span>
            </div>

            <GhostButton
              className="lg:hidden shadow-2xs"
              onClick={() => setShowPreviewMobile((v) => !v)}
            >
              {showPreviewMobile ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4 text-violet-600" />}
              <span>{showPreviewMobile ? "Close" : "Preview"}</span>
            </GhostButton>

            <Magnetic strength={0.2}>
              <PrimaryButton 
                onClick={() => window.print()} 
                className="bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">Export</span>
              </PrimaryButton>
            </Magnetic>
          </div>
        </div>

        {/* Mobile Horizontal Step Chips */}
        <div className="mx-auto flex max-w-[1600px] gap-1.5 overflow-x-auto px-4 pb-3 pt-1 sm:px-6 lg:hidden scrollbar-none">
          {sectionOrder.map((step, i) => (
            <StepChip
              key={step.key}
              step={step}
              index={i}
              active={i === stepIndex}
              done={stepIsComplete(step.key)}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </header>

      {/* Main Container - 3 Column Layout */}
      <div
        className={
          "mx-auto grid max-w-[1600px] grid-cols-1 gap-6 sm:gap-8 px-4 py-6 sm:px-6 lg:px-8 transition-[grid-template-columns] duration-300 ease-in-out " +
          (navCollapsed
            ? "lg:grid-cols-[76px_1fr_420px] xl:grid-cols-[76px_1fr_460px]"
            : "lg:grid-cols-[230px_1fr_420px] xl:grid-cols-[250px_1fr_460px]")
        }
      >
        
        {/* Desktop Left Step Navigation Rail */}
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className={"flex items-center px-1 " + (navCollapsed ? "justify-center" : "justify-between px-3")}>
              {!navCollapsed && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Sections
                </span>
              )}
              <button
                onClick={() => setNavCollapsed((v) => !v)}
                title={navCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-violet-700"
              >
                {navCollapsed ? (
                  <ChevronsRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronsLeft className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <ol className="space-y-0.5">
              {sectionOrder.map((step, i) => (
                <li
                  key={step.key}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  className={
                    "relative transition-transform duration-150 " +
                    (dragIndex === i ? "opacity-40 scale-95" : "") +
                    (dropTargetIndex === i && dragIndex !== i
                      ? " border-t-2 border-violet-500 rounded-t-lg"
                      : "")
                  }
                >
                  <StepRailItem
                    step={step}
                    index={i}
                    active={i === stepIndex}
                    done={stepIsComplete(step.key)}
                    collapsed={navCollapsed}
                    onClick={() => goTo(i)}
                    draggable
                  />
                </li>
              ))}
            </ol>

            {/* Overall Progress Widget */}
            <div
              className={
                "mt-6 rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all " +
                (navCollapsed ? "flex justify-center p-2.5" : "p-4")
              }
            >
              {navCollapsed ? (
                <div title={`${Math.round(completion * 100)}% complete`}>
                  <ProgressRing progress={completion} size={28} strokeWidth={3} />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Resume Progress</span>
                    <span className="text-violet-600 font-bold">{Math.round(completion * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-500 ease-out" 
                      style={{ width: `${completion * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Center Main Form Panel */}
        <main className="min-w-0">
          <StepPanel activeKey={activeStep.key} direction={direction}>
            {activeStep.key === "personal" && (
              <PersonalStep value={personal} onChange={handlePersonalChange} />
            )}
            {activeStep.key === "experience" && (
              <ExperienceStep items={experience} onChange={setExperience} personalInfoId={personalInfoId} />
            )}
            {activeStep.key === "education" && (
              <EducationStep items={education} onChange={setEducation} personalInfoId={personalInfoId} />
            )}
            {activeStep.key === "skills" && (
              <SkillsStep items={skills} onChange={setSkills} personalInfoId={personalInfoId} />
            )}
            {activeStep.key === "projects" && (
              <ProjectsStep items={projects} onChange={setProjects} personalInfoId={personalInfoId} />
            )}
            {activeStep.key === "certifications" && (
              <CertificationsStep items={certifications} onChange={setCertifications} personalInfoId={personalInfoId} />
            )}
          </StepPanel>

          {/* Footer Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6">
            <GhostButton
              onClick={() => goTo(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="disabled:pointer-events-none disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </GhostButton>
            {stepIndex < sectionOrder.length - 1 ? (
              <PrimaryButton onClick={() => goTo(stepIndex + 1)} className="bg-violet-600 hover:bg-violet-700">
                <span>Next: {sectionOrder[stepIndex + 1].label}</span>
                <ChevronRight className="h-4 w-4" />
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => window.print()} className="bg-violet-600 hover:bg-violet-700">
                <Download className="h-4 w-4" />
                <span>Export Final PDF</span>
              </PrimaryButton>
            )}
          </div>
        </main>

        {/* Right Sticky Desktop Live Preview Panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {/* Template Selector */}
            <div className="mb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Select Template</p>
              <TemplateSelector selected={selectedTemplate} onChange={setSelectedTemplate} />
            </div>
            <div className="mb-2.5 flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview
              </span>
              <span className="text-[11px] font-medium text-slate-400">PDF Ready</span>
            </div>
            <ResumePreview
              personal={personal}
              experience={experience}
              education={education}
              skills={skills}
              projects={projects}
              certifications={certifications}
              template={selectedTemplate}
              sectionOrder={sectionKeys}
            />
          </div>
        </aside>
      </div>

      {/* Mobile Live Preview Full Screen Drawer */}
      {showPreviewMobile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4 lg:hidden flex justify-center items-start">
          <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <p className="text-sm font-bold text-slate-900">Live Resume Preview</p>
              </div>
              <GhostButton onClick={() => setShowPreviewMobile(false)} className="h-8 w-8 p-0 rounded-full">
                <X className="h-4 w-4" />
              </GhostButton>
            </div>
            {/* Mobile Template Selector */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Select Template</p>
              <TemplateSelector selected={selectedTemplate} onChange={setSelectedTemplate} />
            </div>
            <ResumePreview
              personal={personal}
              experience={experience}
              education={education}
              skills={skills}
              projects={projects}
              certifications={certifications}
              template={selectedTemplate}
              sectionOrder={sectionKeys}
            />
            <div className="pt-2">
              <PrimaryButton onClick={() => window.print()} className="w-full bg-violet-600 hover:bg-violet-700">
                <Download className="h-4 w-4" />
                Download PDF
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Step rail items ------------------------------ */

function StepRailItem({
  step,
  index,
  active,
  done,
  collapsed,
  onClick,
  draggable: isDraggable,
}: {
  step: SectionStep;
  index: number;
  active: boolean;
  done: boolean;
  collapsed?: boolean;
  onClick: () => void;
  draggable?: boolean;
}) {
  const Icon = step.icon;
  return (
    <button
      onClick={onClick}
      title={collapsed ? step.label : undefined}
      className={
        "group flex w-full items-center gap-2 rounded-2xl py-3 text-left transition-all duration-200 cursor-grab active:cursor-grabbing " +
        (collapsed ? "justify-center px-0" : "px-3") +
        " " +
        (active
          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 font-semibold"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium")
      }
    >
      {/* Drag handle */}
      {isDraggable && !collapsed && (
        <GripVertical
          className={
            "h-3.5 w-3.5 shrink-0 transition-opacity " +
            (active
              ? "text-white/40 group-hover:text-white/70"
              : "text-slate-300 group-hover:text-slate-500")
          }
        />
      )}
      <span
        className={
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all " +
          (active
            ? "bg-white/20 text-white"
            : done
            ? "bg-violet-100 text-violet-700"
            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")
        }
      >
        {done && !active ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : index + 1}
      </span>
      {!collapsed && (
        <span className="flex items-center gap-2 text-xs sm:text-sm">
          <Icon className="h-4 w-4 opacity-80" />
          {step.label}
        </span>
      )}
    </button>
  );
}

function StepChip({
  step,
  index,
  active,
  done,
  onClick,
}: {
  step: SectionStep;
  index: number;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all " +
        (active
          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
      }
    >
      <span
        className={
          "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold " +
          (active ? "bg-white/20" : done ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-400")
        }
      >
        {done && !active ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : index + 1}
      </span>
      {step.label}
    </button>
  );
}

/* ---------------------------------- Step Forms ---------------------------------- */

function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <FadeIn>
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">{hint}</p>
    </FadeIn>
  );
}

function PersonalStep({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (v: PersonalInfo) => void;
}) {
  const set = <K extends keyof PersonalInfo>(key: K, v: PersonalInfo[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <StepHeading title="Let's start with your details" hint="This information will form the header of your resume." />
      <FadeIn delay={0.05} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name *">
          <TextInput
            placeholder="e.g. Alex Johnson"
            value={value.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Professional Title *">
          <TextInput
            placeholder="e.g. Senior Software Engineer"
            value={value.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Email Address *">
          <TextInput
            type="email"
            placeholder="alex.johnson@example.com"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Phone Number">
          <TextInput
            placeholder="+1 (555) 234-5678"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Location" hint="City, Country">
          <TextInput
            placeholder="San Francisco, CA"
            value={value.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Professional Summary" hint="2–4 sentences describing your background">
            <TextArea
              rows={4}
              placeholder="Results-driven professional with 5+ years of experience in..."
              value={value.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
        </div>
      </FadeIn>
    </div>
  );
}

function ExperienceStep({
  items,
  onChange,
  personalInfoId,
}: {
  items: Experience[];
  onChange: (v: Experience[]) => void;
  personalInfoId: number | null;
}) {
  const add = async () => {
    const newItem: Experience = { id: uid(), role: "", company: "", period: "", description: "" };
    onChange([...items, newItem]);
    if (personalInfoId) {
      try {
        const res = await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalInfoId, position: "", company: "", startDate: "" }),
        });
        if (res.ok) {
          const dbData = await res.json();
          newItem.dbId = dbData.id;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const update = (id: string, patch: Partial<Experience>) => {
    const updated = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    onChange(updated);
  };

  const remove = async (id: string) => {
    const item = items.find(it => it.id === id);
    if (item?.dbId) {
      await fetch(`/api/experiences?id=${item.dbId}`, { method: "DELETE" }).catch(console.error);
    }
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <StepHeading title="Work Experience" hint="Highlight your roles, achievements, and impact." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Position {i + 1}
                </span>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Job Title">
                  <TextInput
                    placeholder="Senior Frontend Developer"
                    value={item.role}
                    onChange={(e) => update(item.id, { role: e.target.value })}
                  />
                </Field>
                <Field label="Company / Organization">
                  <TextInput
                    placeholder="TechCorp Inc."
                    value={item.company}
                    onChange={(e) => update(item.id, { company: e.target.value })}
                  />
                </Field>
                <Field label="Dates / Period" hint="e.g. 2021 — Present">
                  <TextInput
                    placeholder="Jan 2021 — Present"
                    value={item.period}
                    onChange={(e) => update(item.id, { period: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Key Achievements & Description">
                    <TextArea
                      rows={3}
                      placeholder="Led development of key web apps, increasing user retention by 25%..."
                      value={item.description}
                      onChange={(e) => update(item.id, { description: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </GlowCard>
          </FadeIn>
        ))}
        <AddRowButton onClick={add} label="Add Work Experience" />
      </div>
    </div>
  );
}

function EducationStep({
  items,
  onChange,
  personalInfoId,
}: {
  items: Education[];
  onChange: (v: Education[]) => void;
  personalInfoId: number | null;
}) {
  const add = async () => {
    const newItem: Education = { id: uid(), school: "", degree: "", period: "" };
    onChange([...items, newItem]);
    if (personalInfoId) {
      try {
        const res = await fetch("/api/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalInfoId, institution: "", degree: "" }),
        });
        if (res.ok) {
          const dbData = await res.json();
          newItem.dbId = dbData.id;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const update = (id: string, patch: Partial<Education>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const remove = async (id: string) => {
    const item = items.find(it => it.id === id);
    if (item?.dbId) {
      await fetch(`/api/education?id=${item.dbId}`, { method: "DELETE" }).catch(console.error);
    }
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <StepHeading title="Education & Qualifications" hint="List degrees, diplomas, or relevant training." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Education {i + 1}
                </span>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="School / University">
                  <TextInput
                    placeholder="Stanford University"
                    value={item.school}
                    onChange={(e) => update(item.id, { school: e.target.value })}
                  />
                </Field>
                <Field label="Degree / Field of Study">
                  <TextInput
                    placeholder="B.S. in Computer Science"
                    value={item.degree}
                    onChange={(e) => update(item.id, { degree: e.target.value })}
                  />
                </Field>
                <Field label="Period / Graduation Year">
                  <TextInput
                    placeholder="2016 — 2020"
                    value={item.period}
                    onChange={(e) => update(item.id, { period: e.target.value })}
                  />
                </Field>
              </div>
            </GlowCard>
          </FadeIn>
        ))}
        <AddRowButton onClick={add} label="Add Education Entry" />
      </div>
    </div>
  );
}

const SKILL_LEVELS: Skill["level"][] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function SkillsStep({ items, onChange, personalInfoId }: { items: Skill[]; onChange: (v: Skill[]) => void; personalInfoId: number | null }) {
  const [draft, setDraft] = useState("");

  const add = async () => {
    if (!draft.trim()) return;
    const name = draft.trim();
    const newItem: Skill = { id: uid(), name, level: "Intermediate" };
    onChange([...items, newItem]);
    setDraft("");
    if (personalInfoId) {
      try {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalInfoId, skillName: name, category: "General" }),
        });
        if (res.ok) {
          const dbData = await res.json();
          newItem.dbId = dbData.id;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const cycleLevel = (id: string) =>
    onChange(
      items.map((it) =>
        it.id === id
          ? { ...it, level: SKILL_LEVELS[(SKILL_LEVELS.indexOf(it.level) + 1) % SKILL_LEVELS.length] }
          : it
      )
    );

  const remove = async (id: string) => {
    const item = items.find(it => it.id === id);
    if (item?.dbId) {
      await fetch(`/api/skills?id=${item.dbId}`, { method: "DELETE" }).catch(console.error);
    }
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <StepHeading title="Skills & Competencies" hint="Type a skill name and press Enter. Click chips to adjust proficiency level." />
      <FadeIn delay={0.05} className="mt-6 flex flex-col sm:flex-row gap-2.5">
        <TextInput
          placeholder="e.g. React, TypeScript, Product Strategy"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1"
        />
        <PrimaryButton onClick={add} className="shrink-0 bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </PrimaryButton>
      </FadeIn>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {items.map((skill) => (
          <FadeIn key={skill.id}>
            <button
              onClick={() => cycleLevel(skill.id)}
              className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white py-2 pl-4 pr-2.5 text-xs sm:text-sm text-slate-800 transition-all hover:border-violet-300 hover:shadow-xs active:scale-[0.98]"
            >
              <span className="font-semibold">{skill.name}</span>
              <span className="rounded-xl bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-100">
                {skill.level}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  remove(skill.id);
                }}
                className="rounded-lg p-1 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            </button>
          </FadeIn>
        ))}
        {items.length === 0 && (
          <div className="w-full py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Sparkles className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs sm:text-sm text-slate-400 font-medium">No skills added yet — type your skills above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsStep({
  items,
  onChange,
  personalInfoId,
}: {
  items: Project[];
  onChange: (v: Project[]) => void;
  personalInfoId: number | null;
}) {
  const add = async () => {
    const newItem: Project = { id: uid(), name: "", description: "", link: "" };
    onChange([...items, newItem]);
    if (personalInfoId) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalInfoId, name: "" }),
        });
        if (res.ok) {
          const dbData = await res.json();
          newItem.dbId = dbData.id;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const update = (id: string, patch: Partial<Project>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = async (id: string) => {
    const item = items.find(it => it.id === id);
    if (item?.dbId) {
      await fetch(`/api/projects?id=${item.dbId}`, { method: "DELETE" }).catch(console.error);
    }
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <StepHeading title="Featured Projects" hint="Showcase your key side projects, portfolio items, or open source contributions." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project {i + 1}
                </span>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Project Title">
                  <TextInput
                    placeholder="AI Resume Builder"
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Technologies / Link">
                  <TextInput
                    placeholder="Next.js, TypeScript, Tailwind"
                    value={item.link}
                    onChange={(e) => update(item.id, { link: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description & Key Outcomes">
                    <TextArea
                      rows={3}
                      placeholder="Built a modern SaaS application featuring real-time preview..."
                      value={item.description}
                      onChange={(e) => update(item.id, { description: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </GlowCard>
          </FadeIn>
        ))}
        <AddRowButton onClick={add} label="Add Project Entry" />
      </div>
    </div>
  );
}

function CertificationsStep({
  items,
  onChange,
  personalInfoId,
}: {
  items: Certification[];
  onChange: (v: Certification[]) => void;
  personalInfoId: number | null;
}) {
  const add = async () => {
    const newItem: Certification = { id: uid(), name: "", issuer: "", year: "" };
    onChange([...items, newItem]);
    if (personalInfoId) {
      try {
        const res = await fetch("/api/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personalInfoId, name: "", issuingOrganization: "" }),
        });
        if (res.ok) {
          const dbData = await res.json();
          newItem.dbId = dbData.id;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const update = (id: string, patch: Partial<Certification>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = async (id: string) => {
    const item = items.find(it => it.id === id);
    if (item?.dbId) {
      await fetch(`/api/certifications?id=${item.dbId}`, { method: "DELETE" }).catch(console.error);
    }
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <StepHeading title="Certifications & Honors" hint="Include official certificates, awards, or professional accreditations." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Certification {i + 1}
                </span>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Certification Name">
                  <TextInput
                    placeholder="AWS Certified Solutions Architect"
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Issuing Organization">
                  <TextInput
                    placeholder="Amazon Web Services"
                    value={item.issuer}
                    onChange={(e) => update(item.id, { issuer: e.target.value })}
                  />
                </Field>
                <Field label="Year Issued">
                  <TextInput
                    placeholder="2024"
                    value={item.year}
                    onChange={(e) => update(item.id, { year: e.target.value })}
                  />
                </Field>
              </div>
            </GlowCard>
          </FadeIn>
        ))}
        <AddRowButton onClick={add} label="Add Certification Entry" />
      </div>
    </div>
  );
}

function AddRowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3.5 text-xs sm:text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 active:scale-[0.99]"
    >
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

/* --------------------------------- Paper Resume Preview Component --------------------------------- */

function ResumePreview({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
  template = "classic",
  sectionOrder,
}: {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  template?: TemplateName;
  sectionOrder: StepKey[];
}) {
  const templateProps = { personal, experience, education, skills, projects, certifications, sectionOrder };

  return (
    <div id="resume-preview" className="rounded-3xl bg-slate-900 p-2.5 sm:p-3 shadow-xl">
      <div data-print-hide className="mb-2 flex items-center justify-between px-3 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-violet-400" />
          A4 Paper View
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div id="resume-content" className="max-h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 text-slate-900 shadow-inner leading-normal scrollbar-none">
        {template === "professional" && <ProfessionalTemplate {...templateProps} />}
        {template === "clean-sidebar" && <CleanSidebarTemplate {...templateProps} />}
        {template === "classic" && <ClassicTemplate {...templateProps} />}
      </div>
    </div>
  );
}

/* --------------------------------- Classic Template (Original) --------------------------------- */

function ClassicTemplate({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
  sectionOrder,
}: {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  sectionOrder: StepKey[];
}) {
  const renderSection = (key: StepKey) => {
    switch (key) {
      case "personal":
        return (
          <div key="personal" className="border-b border-slate-200/80 pb-5">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {personal.fullName || "Your Full Name"}
            </h2>
            <p className="text-sm font-bold text-violet-600 mt-0.5">{personal.title || "Your Professional Title"}</p>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              {[personal.email, personal.phone, personal.location].filter(Boolean).join("  ·  ") ||
                "email@example.com  ·  +1 (555) 000-0000  ·  City, Country"}
            </p>
            {personal.summary && (
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
                {personal.summary}
              </p>
            )}
          </div>
        );
      case "experience":
        return experience.length > 0 ? (
          <PreviewSection key="experience" title="Work Experience">
            <div className="space-y-4">
              {experience.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.role || "Job Position"} {item.company && <span className="font-semibold text-slate-500">· {item.company}</span>}
                    </p>
                    <p className="shrink-0 text-[11px] font-medium text-slate-400">{item.period}</p>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 font-normal">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </PreviewSection>
        ) : null;
      case "education":
        return education.length > 0 ? (
          <PreviewSection key="education" title="Education">
            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id} className="flex items-baseline justify-between gap-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.school || "University / College"}
                    {item.degree && <span className="font-normal text-slate-600"> — {item.degree}</span>}
                  </p>
                  <p className="shrink-0 text-[11px] font-medium text-slate-400">{item.period}</p>
                </div>
              ))}
            </div>
          </PreviewSection>
        ) : null;
      case "skills":
        return skills.length > 0 ? (
          <PreviewSection key="skills" title="Skills & Tools">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-slate-700"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </PreviewSection>
        ) : null;
      case "projects":
        return projects.length > 0 ? (
          <PreviewSection key="projects" title="Projects">
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {p.name || "Project Title"} {p.link && <span className="font-normal text-violet-600 text-xs">({p.link})</span>}
                  </p>
                  {p.description && <p className="mt-0.5 text-xs text-slate-600 font-normal leading-relaxed">{p.description}</p>}
                </div>
              ))}
            </div>
          </PreviewSection>
        ) : null;
      case "certifications":
        return certifications.length > 0 ? (
          <PreviewSection key="certifications" title="Certifications">
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id} className="flex items-baseline justify-between gap-3 text-xs">
                  <p className="font-bold text-slate-800">
                    {c.name || "Certification"}
                    {c.issuer && <span className="font-normal text-slate-500"> · {c.issuer}</span>}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">{c.year}</p>
                </div>
              ))}
            </div>
          </PreviewSection>
        ) : null;
      default:
        return null;
    }
  };

  return <>{sectionOrder.map(renderSection)}</>;
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-3.5 last:border-0">
      <p className="mb-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
      {children}
    </div>
  );
}