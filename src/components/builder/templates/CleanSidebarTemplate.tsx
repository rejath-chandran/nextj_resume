"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

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
}

/* ---------- Skill Dots ---------- */

function SkillDots({ level }: { level: Skill["level"] }) {
  const filled = level === "Expert" ? 5 : level === "Advanced" ? 4 : level === "Intermediate" ? 3 : 2;
  return (
    <div className="flex gap-0.5 mt-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            "h-1.5 w-1.5 rounded-full " +
            (i <= filled ? "bg-slate-800" : "bg-slate-200")
          }
        />
      ))}
    </div>
  );
}

/* ---------- Section Row (sidebar label + content) ---------- */

function SectionRow({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"grid grid-cols-[100px_1fr] gap-4 py-3 border-t border-slate-200 " + className}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-0.5">
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ---------- Main Template ---------- */

export default function CleanSidebarTemplate({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
}: TemplateProps) {
  return (
    <div className="font-[system-ui,_-apple-system,_sans-serif] text-slate-900 leading-normal text-[11px]">
      {/* ===== Header ===== */}
      <div className="text-center pb-3 border-b border-slate-200">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          {personal.fullName || "Your Full Name"}
        </h1>
        {personal.title && (
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{personal.title}</p>
        )}
        {/* Contact row */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[10px] text-slate-600">
          {personal.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="h-2.5 w-2.5 text-slate-400" />
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-2.5 w-2.5 text-slate-400" />
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-slate-400" />
              {personal.location}
            </span>
          )}
        </div>
      </div>

      {/* ===== Professional Summary ===== */}
      {personal.summary && (
        <SectionRow label="Professional Summary">
          <p className="text-[10.5px] leading-[1.6] text-slate-700">{personal.summary}</p>
        </SectionRow>
      )}

      {/* ===== Technical Skills ===== */}
      {skills.length > 0 && (
        <SectionRow label="Technical Skills">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {skills.map((skill) => (
              <div key={skill.id}>
                <p className="font-bold text-[10px] text-slate-800">{skill.name}</p>
                <p className="text-[9px] text-slate-500 capitalize">{skill.level}</p>
                <SkillDots level={skill.level} />
              </div>
            ))}
          </div>
        </SectionRow>
      )}

      {/* ===== Education ===== */}
      {education.length > 0 && (
        <SectionRow label="Education">
          <div className="space-y-2">
            {education.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[11px] text-slate-900">{item.school || "Institution"}</p>
                    <p className="text-[10px] text-slate-600">{item.degree}</p>
                  </div>
                  {item.period && (
                    <span className="shrink-0 text-[10px] text-slate-500 font-medium">{item.period}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionRow>
      )}

      {/* ===== Professional Experience ===== */}
      {experience.length > 0 && (
        <SectionRow label="Professional Experience">
          <div className="space-y-3">
            {experience.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[11px] text-slate-900">{item.company || "Company"}</p>
                    <p className="text-[10px] text-slate-600 italic">{item.role}</p>
                  </div>
                  {item.period && (
                    <span className="shrink-0 text-[10px] text-slate-500 font-medium whitespace-nowrap">{item.period}</span>
                  )}
                </div>
                {item.description && (
                  <ul className="mt-1 space-y-0.5 text-[10.5px] leading-[1.5] text-slate-700">
                    {item.description.split("\n").filter(Boolean).map((line, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                        <span>{line.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </SectionRow>
      )}

      {/* ===== Projects ===== */}
      {projects.length > 0 && (
        <SectionRow label="Projects">
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id}>
                <p className="font-bold text-[11px] text-slate-900">
                  {p.name || "Project Title"}
                  {p.link && (
                    <span className="ml-1.5 font-normal text-[10px] text-slate-500">({p.link})</span>
                  )}
                </p>
                {p.description && (
                  <ul className="mt-0.5 space-y-0.5 text-[10.5px] leading-[1.5] text-slate-700">
                    {p.description.split("\n").filter(Boolean).map((line, idx) => (
                      <li key={idx} className="flex gap-1.5">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                        <span>{line.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </SectionRow>
      )}

      {/* ===== Certifications ===== */}
      {certifications.length > 0 && (
        <SectionRow label="Certifications">
          <div className="space-y-1.5">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-baseline justify-between gap-2">
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
        </SectionRow>
      )}
    </div>
  );
}
