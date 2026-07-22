"use client";

import { useMemo, useState, useEffect } from "react";
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

const STEPS = [
  { key: "personal", label: "Personal info", icon: User },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "skills", label: "Skills", icon: Sparkles },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "certifications", label: "Certifications", icon: Award },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

/* ------------------------------- Page ------------------------------- */

export default function BuilderPage() {
  const [personalInfoId, setPersonalInfoId] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

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

  const activeStep = STEPS[stepIndex];

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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#FAFAFA]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {personal.fullName ? `${personal.fullName}'s resume` : "Untitled resume"}
              </p>
              <p className="text-xs text-gray-400">Autosaved to this browser</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <ProgressRing progress={completion} size={28} strokeWidth={3} />
              <span className="text-xs font-medium text-gray-500">
                {Math.round(completion * 100)}% complete
              </span>
            </div>

            <GhostButton
              className="lg:hidden"
              onClick={() => setShowPreviewMobile((v) => !v)}
            >
              {showPreviewMobile ? <X className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPreviewMobile ? "Close preview" : "Preview"}
            </GhostButton>

            <Magnetic strength={0.25}>
              <PrimaryButton onClick={() => window.print()}>
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </PrimaryButton>
            </Magnetic>
          </div>
        </div>

        {/* Step rail — horizontal on mobile */}
        <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
          {STEPS.map((step, i) => (
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

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr_420px] lg:px-8">
        {/* Desktop step rail */}
        <nav className="hidden lg:block">
          <ol className="sticky top-24 space-y-1">
            {STEPS.map((step, i) => (
              <li key={step.key}>
                <StepRailItem
                  step={step}
                  index={i}
                  active={i === stepIndex}
                  done={stepIsComplete(step.key)}
                  onClick={() => goTo(i)}
                />
              </li>
            ))}
          </ol>
        </nav>

        {/* Form panel */}
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

          {/* Step navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-6">
            <GhostButton
              onClick={() => goTo(Math.max(0, stepIndex - 1))}
              disabled={stepIndex === 0}
              className="disabled:pointer-events-none disabled:opacity-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </GhostButton>
            {stepIndex < STEPS.length - 1 ? (
              <PrimaryButton onClick={() => goTo(stepIndex + 1)}>
                Next: {STEPS[stepIndex + 1].label}
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={() => window.print()}>
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </PrimaryButton>
            )}
          </div>
        </main>

        {/* Live preview — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ResumePreview
              personal={personal}
              experience={experience}
              education={education}
              skills={skills}
              projects={projects}
              certifications={certifications}
            />
          </div>
        </aside>
      </div>

      {/* Live preview — mobile drawer */}
      {showPreviewMobile && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#FAFAFA] p-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Preview</p>
            <GhostButton onClick={() => setShowPreviewMobile(false)}>
              <X className="h-3.5 w-3.5" />
              Close
            </GhostButton>
          </div>
          <ResumePreview
            personal={personal}
            experience={experience}
            education={education}
            skills={skills}
            projects={projects}
            certifications={certifications}
          />
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
  onClick,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;
  return (
    <button
      onClick={onClick}
      className={
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition " +
        (active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900")
      }
    >
      <span
        className={
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition " +
          (active
            ? "bg-white/15 text-white"
            : done
            ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
            : "bg-gray-100 text-gray-400 group-hover:bg-gray-200")
        }
      >
        {done && !active ? <Check className="h-3.5 w-3.5" /> : index + 1}
      </span>
      <span className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-3.5 w-3.5 opacity-70" />
        {step.label}
      </span>
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
  step: (typeof STEPS)[number];
  index: number;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition " +
        (active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-500")
      }
    >
      <span
        className={
          "flex h-4 w-4 items-center justify-center rounded-full text-[10px] " +
          (active ? "bg-white/20" : done ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "bg-gray-100")
        }
      >
        {done && !active ? <Check className="h-2.5 w-2.5" /> : index + 1}
      </span>
      {step.label}
    </button>
  );
}

/* ---------------------------------- Steps ---------------------------------- */

function StepHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <FadeIn>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{hint}</p>
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
    <div>
      <StepHeading title="Let's start with you" hint="This appears at the top of your resume template." />
      <FadeIn delay={0.05} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput
            placeholder="Jordan Rivera"
            value={value.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </Field>
        <Field label="Title">
          <TextInput
            placeholder="Product Designer"
            value={value.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            placeholder="jordan@email.com"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <TextInput
            placeholder="+1 (555) 010-0199"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Location" hint="City, country">
          <TextInput
            placeholder="Lisbon, Portugal"
            value={value.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Summary" hint="2–3 sentences">
            <TextArea
              rows={4}
              placeholder="A brief line on what you do and what you're looking for next."
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
    <div>
      <StepHeading title="Work experience" hint="Add roles in reverse chronological order." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Role {i + 1}
                </p>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Role">
                  <TextInput
                    placeholder="Senior Product Designer"
                    value={item.role}
                    onChange={(e) => update(item.id, { role: e.target.value })}
                  />
                </Field>
                <Field label="Company">
                  <TextInput
                    placeholder="Acme Inc."
                    value={item.company}
                    onChange={(e) => update(item.id, { company: e.target.value })}
                  />
                </Field>
                <Field label="Period" hint="e.g. 2022 — Present">
                  <TextInput
                    placeholder="2022 — Present"
                    value={item.period}
                    onChange={(e) => update(item.id, { period: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <TextArea
                      rows={3}
                      placeholder="What did you own, ship, or improve?"
                      value={item.description}
                      onChange={(e) => update(item.id, { description: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </GlowCard>
          </FadeIn>
        ))}
        <AddRowButton onClick={add} label="Add role" />
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
    <div>
      <StepHeading title="Education" hint="Degrees, bootcamps, or relevant coursework." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Entry {i + 1}
                </p>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="School">
                  <TextInput
                    placeholder="University of Lisbon"
                    value={item.school}
                    onChange={(e) => update(item.id, { school: e.target.value })}
                  />
                </Field>
                <Field label="Degree">
                  <TextInput
                    placeholder="B.A. Design"
                    value={item.degree}
                    onChange={(e) => update(item.id, { degree: e.target.value })}
                  />
                </Field>
                <Field label="Period">
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
        <AddRowButton onClick={add} label="Add education" />
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
    <div>
      <StepHeading title="Skills" hint="Add a skill, then tap it to cycle its level." />
      <FadeIn delay={0.05} className="mt-6 flex gap-2">
        <TextInput
          placeholder="e.g. Figma, TypeScript, Negotiation"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <GhostButton onClick={add}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </GhostButton>
      </FadeIn>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((skill) => (
          <FadeIn key={skill.id}>
            <button
              onClick={() => cycleLevel(skill.id)}
              className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-3.5 pr-2 text-sm text-gray-700 transition hover:border-[#8B5CF6]/40"
            >
              <span>{skill.name}</span>
              <span className="rounded-full bg-[#8B5CF6]/10 px-2 py-0.5 text-xs font-medium text-[#8B5CF6]">
                {skill.level}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  remove(skill.id);
                }}
                className="rounded-full p-0.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          </FadeIn>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400">No skills yet — add your first one above.</p>
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
    <div>
      <StepHeading title="Projects" hint="Portfolio pieces, side projects, open source." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Project {i + 1}
                </p>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <TextInput
                    placeholder="Resume Builder AI"
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Link" hint="optional">
                  <TextInput
                    placeholder="github.com/you/project"
                    value={item.link}
                    onChange={(e) => update(item.id, { link: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <TextArea
                      rows={3}
                      placeholder="What it does and what you used to build it."
                      value={item.description}
                      onChange={(e) => update(item.id, { description: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </GlowCard>
          </FadeIn>
        ))}
        <AddRowButton onClick={add} label="Add project" />
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
    <div>
      <StepHeading title="Certifications" hint="Licenses, courses, and credentials." />
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.04}>
            <GlowCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Certification {i + 1}
                </p>
                <DangerGhostButton onClick={() => remove(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </DangerGhostButton>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Name">
                  <TextInput
                    placeholder="AWS Solutions Architect"
                    value={item.name}
                    onChange={(e) => update(item.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Issuer">
                  <TextInput
                    placeholder="Amazon Web Services"
                    value={item.issuer}
                    onChange={(e) => update(item.id, { issuer: e.target.value })}
                  />
                </Field>
                <Field label="Year">
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
        <AddRowButton onClick={add} label="Add certification" />
      </div>
    </div>
  );
}

function AddRowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/5 hover:text-[#8B5CF6]"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

/* --------------------------------- Preview --------------------------------- */

function ResumePreview({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
}: {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}) {
  return (
    <div id="resume-preview" className="rounded-2xl bg-[#0A0A0A] p-3">
      <div className="mb-2 flex items-center justify-between px-2 pt-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">Live preview</p>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
      <div className="max-h-[calc(100vh-9rem)] overflow-y-auto rounded-xl bg-white p-8 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            {personal.fullName || "Your name"}
          </h2>
          <p className="text-sm font-medium text-[#8B5CF6]">{personal.title || "Your title"}</p>
          <p className="mt-2 text-xs text-gray-400">
            {[personal.email, personal.phone, personal.location].filter(Boolean).join("  ·  ") ||
              "email · phone · location"}
          </p>
          {personal.summary && <p className="mt-3 text-sm leading-relaxed text-gray-600">{personal.summary}</p>}
        </div>

        {experience.length > 0 && (
          <PreviewSection title="Experience">
            <div className="space-y-4">
              {experience.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium text-gray-900">
                      {item.role || "Role"} {item.company && <span className="text-gray-400">· {item.company}</span>}
                    </p>
                    <p className="shrink-0 text-xs text-gray-400">{item.period}</p>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {education.length > 0 && (
          <PreviewSection title="Education">
            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id} className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">
                    {item.school || "School"}
                    {item.degree && <span className="font-normal text-gray-500"> — {item.degree}</span>}
                  </p>
                  <p className="shrink-0 text-xs text-gray-400">{item.period}</p>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {skills.length > 0 && (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </PreviewSection>
        )}

        {projects.length > 0 && (
          <PreviewSection title="Projects">
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id}>
                  <p className="text-sm font-medium text-gray-900">
                    {p.name || "Project"} {p.link && <span className="font-normal text-gray-400">· {p.link}</span>}
                  </p>
                  {p.description && <p className="mt-0.5 text-sm text-gray-600">{p.description}</p>}
                </div>
              ))}
            </div>
          </PreviewSection>
        )}

        {certifications.length > 0 && (
          <PreviewSection title="Certifications">
            <div className="space-y-1.5">
              {certifications.map((c) => (
                <div key={c.id} className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-gray-800">
                    {c.name || "Certification"}
                    {c.issuer && <span className="text-gray-400"> · {c.issuer}</span>}
                  </p>
                  <p className="text-xs text-gray-400">{c.year}</p>
                </div>
              ))}
            </div>
          </PreviewSection>
        )}
      </div>
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      {children}
    </div>
  );
}
