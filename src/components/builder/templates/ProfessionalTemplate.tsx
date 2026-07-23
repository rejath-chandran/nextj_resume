"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import type { StepKey } from "@/app/builder/page";

/* ---------- Types (matches builder page types) ---------- */

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

interface TemplateProps {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  sectionOrder: StepKey[];
}

/* ---------- Skill Dots ---------- */

function SkillDots({ level }: { level: Skill["level"] }) {
  const filled = level === "Expert" ? 5 : level === "Advanced" ? 4 : level === "Intermediate" ? 3 : 2;
  return (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            "h-2 w-2 rounded-full " +
            (i <= filled ? "bg-indigo-900" : "bg-slate-200")
          }
        />
      ))}
    </div>
  );
}

/* ---------- Section Header ---------- */

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-indigo-700 border-b-2 border-indigo-200 pb-1.5">
        {title}
      </h3>
    </div>
  );
}

/* ---------- Main Template ---------- */

export default function ProfessionalTemplate({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
  sectionOrder,
}: TemplateProps) {
  const renderSection = (key: StepKey) => {
    switch (key) {
      case "personal":
        return (
          <div key="personal" className="pb-4 border-b border-slate-200">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {personal.fullName || "Your Full Name"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-600">
              {personal.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span className="text-indigo-700 underline decoration-indigo-200">{personal.email}</span>
                </span>
              )}
              {personal.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {personal.location}
                </span>
              )}
            </div>
            {personal.summary && (
              <div className="mt-3">
                <SectionHeader title="Professional Summary" />
                <p className="text-[11px] leading-[1.6] text-slate-700">{personal.summary}</p>
              </div>
            )}
          </div>
        );

      case "skills":
        return skills.length > 0 ? (
          <div key="skills" className="mt-4">
            <SectionHeader title="Technical Skills" />
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <p className="font-bold text-[10px] text-slate-800">{skill.name}</p>
                  <p className="text-[9px] text-slate-500 capitalize">{skill.level}</p>
                  <SkillDots level={skill.level} />
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <div key="education" className="mt-4">
            <SectionHeader title="Education" />
            <div className="space-y-2.5">
              {education.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[11px] text-slate-900">{item.degree || "Degree"}</p>
                    <p className="text-[10px] font-semibold text-slate-600">{item.school || "Institution"}</p>
                  </div>
                  {item.period && (
                    <span className="shrink-0 text-[10px] font-medium text-slate-500">{item.period}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience" className="mt-4">
            <SectionHeader title="Professional Experience" />
            <div className="space-y-3.5">
              {experience.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[11px] text-slate-900">{item.role || "Position"}</p>
                      <p className="text-[10px] font-bold text-slate-700">{item.company}</p>
                    </div>
                    {item.period && (
                      <span className="shrink-0 text-[10px] font-medium text-slate-500">{item.period}</span>
                    )}
                  </div>
                  {item.description && (
                    <ul className="mt-1.5 space-y-0.5 text-[10.5px] leading-[1.55] text-slate-700">
                      {item.description.split("\n").filter(Boolean).map((line, idx) => (
                        <li key={idx} className="flex gap-1.5">
                          <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{line.replace(/^[-•]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects" className="mt-4">
            <SectionHeader title="Projects" />
            <div className="space-y-2.5">
              {projects.map((p) => (
                <div key={p.id}>
                  <p className="font-bold text-[11px] text-slate-900">
                    {p.name || "Project Title"}
                    {p.link && (
                      <span className="ml-1.5 font-normal text-[10px] text-indigo-600">({p.link})</span>
                    )}
                  </p>
                  {p.description && (
                    <p className="mt-0.5 text-[10.5px] leading-[1.55] text-slate-700">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications" className="mt-4">
            <SectionHeader title="Certifications & Honors" />
            <div className="space-y-1.5">
              {certifications.map((c) => (
                <div key={c.id} className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] font-bold text-slate-800">
                    {c.name || "Certification"}
                    {c.issuer && (
                      <span className="font-normal text-slate-500"> · {c.issuer}</span>
                    )}
                  </p>
                  {c.year && (
                    <span className="shrink-0 text-[10px] text-slate-500">{c.year}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="font-[system-ui,_-apple-system,_sans-serif] text-slate-900 leading-normal text-[11px]">
      {sectionOrder.map(renderSection)}
    </div>
  );
}
