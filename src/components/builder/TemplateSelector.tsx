"use client";

import React from "react";
import { Check, Layout, LayoutList, FileText } from "lucide-react";

export type TemplateName = "classic" | "professional" | "clean-sidebar";

interface TemplateSelectorProps {
  selected: TemplateName;
  onChange: (template: TemplateName) => void;
}

const TEMPLATES: {
  key: TemplateName;
  label: string;
  description: string;
  icon: typeof Layout;
  accentColor: string;
  previewLines: string[];
}[] = [
  {
    key: "classic",
    label: "Classic",
    description: "Clean & minimal",
    icon: FileText,
    accentColor: "violet",
    previewLines: ["Name", "Title", "Summary"],
  },
  {
    key: "professional",
    label: "Professional",
    description: "Purple accents & skill dots",
    icon: Layout,
    accentColor: "indigo",
    previewLines: ["Name", "Skills Grid", "Experience"],
  },
  {
    key: "clean-sidebar",
    label: "Sidebar Labels",
    description: "Left labels, centered header",
    icon: LayoutList,
    accentColor: "slate",
    previewLines: ["Name & Title", "Label | Content", "Label | Content"],
  },
];

export default function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {TEMPLATES.map((t) => {
        const isActive = selected === t.key;
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={
              "group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 " +
              (isActive
                ? "border-violet-400 bg-violet-50 text-violet-800 shadow-sm shadow-violet-200/50"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800")
            }
          >
            <Icon
              className={
                "h-3.5 w-3.5 transition-colors " +
                (isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-500")
              }
            />
            <span>{t.label}</span>
            {isActive && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600">
                <Check className="h-2.5 w-2.5 text-white stroke-[3]" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
