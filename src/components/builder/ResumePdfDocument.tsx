"use client";

/**
 * ResumePdfDocument — @react-pdf/renderer templates matching the 3 live preview options
 *
 * Generates ATS-friendly, selectable, searchable A4 PDFs for:
 * 1. Classic Template
 * 2. Professional Template (purple accents & skill dots)
 * 3. Clean Sidebar Template (2-column layout with left section labels)
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

/* ────────────────── Types ────────────────── */

export type PersonalInfo = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  period: string;
};

export type Skill = {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type TemplateName = "classic" | "professional" | "clean-sidebar";

export interface ResumePdfProps {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  sectionOrder: string[];
  template?: TemplateName;
}

/* ────────────────── Common Base Styles ────────────────── */

const baseStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 36,
    fontSize: 9.5,
    color: "#1e293b",
    lineHeight: 1.45,
  },
});

/* ─────────────────────────────────────────────────────────────
   1. CLASSIC TEMPLATE
   ───────────────────────────────────────────────────────────── */

const classicStyles = StyleSheet.create({
  header: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  nameBlock: {
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    lineHeight: 1.25,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  titleBlock: {
    marginBottom: 6,
  },
  title: {
    fontSize: 10.5,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    color: "#7c3aed",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 4,
  },
  contactItem: {
    fontSize: 9,
    lineHeight: 1.3,
    color: "#64748b",
    marginRight: 8,
  },
  summary: {
    fontSize: 9.5,
    color: "#475569",
    lineHeight: 1.5,
    marginTop: 6,
  },
  section: {
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "#94a3b8",
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  entryRole: {
    fontSize: 10,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  entryCompany: {
    fontSize: 9.5,
    lineHeight: 1.3,
    color: "#475569",
    fontFamily: "Helvetica",
  },
  entryPeriod: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: "#94a3b8",
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 9,
    lineHeight: 1.3,
    color: "#94a3b8",
    marginRight: 5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.45,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  skillChip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 8.5,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    marginRight: 5,
    marginBottom: 5,
  },
});

function ClassicTemplatePdf({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
  sectionOrder,
}: ResumePdfProps) {
  const renderSection = (key: string) => {
    switch (key) {
      case "personal":
        return (
          <View key="personal" style={classicStyles.header}>
            <View style={classicStyles.nameBlock}>
              <Text style={classicStyles.name}>{personal.fullName || "Your Full Name"}</Text>
            </View>
            {personal.title ? (
              <View style={classicStyles.titleBlock}>
                <Text style={classicStyles.title}>{personal.title}</Text>
              </View>
            ) : null}
            <View style={classicStyles.contactRow}>
              {personal.email ? <Text style={classicStyles.contactItem}>{personal.email}</Text> : null}
              {personal.phone ? <Text style={classicStyles.contactItem}>· {personal.phone}</Text> : null}
              {personal.location ? <Text style={classicStyles.contactItem}>· {personal.location}</Text> : null}
            </View>
            {personal.summary && <Text style={classicStyles.summary}>{personal.summary}</Text>}
          </View>
        );

      case "experience":
        return experience.length > 0 ? (
          <View key="experience" style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Work Experience</Text>
            {experience.map((item) => (
              <View key={item.id} style={classicStyles.entry} wrap={false}>
                <View style={classicStyles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={classicStyles.entryRole}>
                      {item.role || "Position"}
                      {item.company ? <Text style={classicStyles.entryCompany}> · {item.company}</Text> : null}
                    </Text>
                  </View>
                  {item.period && <Text style={classicStyles.entryPeriod}>{item.period}</Text>}
                </View>
                {item.description &&
                  item.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <View key={idx} style={classicStyles.bulletRow}>
                        <Text style={classicStyles.bulletDot}>•</Text>
                        <Text style={classicStyles.bulletText}>{line.replace(/^[-•]\s*/, "")}</Text>
                      </View>
                    ))}
              </View>
            ))}
          </View>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <View key="education" style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Education</Text>
            {education.map((item) => (
              <View key={item.id} style={classicStyles.entryHeader} wrap={false}>
                <View style={{ flex: 1 }}>
                  <Text style={classicStyles.entryRole}>
                    {item.school || "University / College"}
                    {item.degree ? <Text style={classicStyles.entryCompany}> — {item.degree}</Text> : null}
                  </Text>
                </View>
                {item.period && <Text style={classicStyles.entryPeriod}>{item.period}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <View key="skills" style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Skills & Tools</Text>
            <View style={classicStyles.skillsWrap}>
              {skills.map((s) => (
                <Text key={s.id} style={classicStyles.skillChip}>
                  {s.name}
                </Text>
              ))}
            </View>
          </View>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <View key="projects" style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={classicStyles.entry} wrap={false}>
                <Text style={classicStyles.entryRole}>
                  {p.name || "Project Title"}
                  {p.link ? <Text style={{ color: "#7c3aed", fontFamily: "Helvetica" }}> ({p.link})</Text> : null}
                </Text>
                {p.description && <Text style={classicStyles.bulletText}>{p.description}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <View key="certifications" style={classicStyles.section}>
            <Text style={classicStyles.sectionTitle}>Certifications</Text>
            {certifications.map((c) => (
              <View key={c.id} style={classicStyles.entryHeader} wrap={false}>
                <Text style={classicStyles.entryRole}>
                  {c.name || "Certification"}
                  {c.issuer ? <Text style={classicStyles.entryCompany}> · {c.issuer}</Text> : null}
                </Text>
                {c.year && <Text style={classicStyles.entryPeriod}>{c.year}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return <>{sectionOrder.map(renderSection)}</>;
}

/* ─────────────────────────────────────────────────────────────
   2. PROFESSIONAL TEMPLATE (Indigo accents & Skill dots)
   ───────────────────────────────────────────────────────────── */

const proStyles = StyleSheet.create({
  header: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  nameBlock: {
    marginBottom: 6,
  },
  name: {
    fontSize: 22,
    lineHeight: 1.25,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 6,
  },
  contactItem: {
    fontSize: 9,
    lineHeight: 1.3,
    color: "#475569",
    marginRight: 10,
  },
  contactEmail: {
    color: "#4338ca",
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 9.5,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
    color: "#4338ca",
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: "#c7d2fe",
  },
  summaryText: {
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.5,
    marginTop: 4,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  role: {
    fontSize: 10,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  company: {
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },
  period: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: "#64748b",
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2.5,
    paddingLeft: 2,
  },
  bulletDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#4338ca",
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.45,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  skillItem: {
    width: "33%",
    marginBottom: 8,
    paddingRight: 6,
  },
  skillName: {
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  skillLevel: {
    fontSize: 7.5,
    lineHeight: 1.3,
    color: "#64748b",
    textTransform: "capitalize" as const,
  },
  dotsRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  dot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    marginRight: 2.5,
  },
});

function SkillDotsPdf({ level }: { level: string }) {
  const filledCount =
    level === "Expert" ? 5 : level === "Advanced" ? 4 : level === "Intermediate" ? 3 : 2;
  return (
    <View style={proStyles.dotsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[
            proStyles.dot,
            { backgroundColor: i <= filledCount ? "#1e1b4b" : "#e2e8f0" },
          ]}
        />
      ))}
    </View>
  );
}

function ProfessionalTemplatePdf({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
  sectionOrder,
}: ResumePdfProps) {
  const renderSection = (key: string) => {
    switch (key) {
      case "personal":
        return (
          <View key="personal" style={proStyles.header}>
            <View style={proStyles.nameBlock}>
              <Text style={proStyles.name}>{personal.fullName || "Your Full Name"}</Text>
            </View>
            <View style={proStyles.contactRow}>
              {personal.email ? (
                <Text style={[proStyles.contactItem, proStyles.contactEmail]}>
                  {personal.email}
                </Text>
              ) : null}
              {personal.phone ? <Text style={proStyles.contactItem}>· {personal.phone}</Text> : null}
              {personal.location ? (
                <Text style={proStyles.contactItem}>· {personal.location}</Text>
              ) : null}
            </View>
            {personal.summary ? (
              <View style={{ marginTop: 6 }}>
                <View style={proStyles.sectionHeader}>
                  <Text style={proStyles.sectionTitle}>Professional Summary</Text>
                </View>
                <Text style={proStyles.summaryText}>{personal.summary}</Text>
              </View>
            ) : null}
          </View>
        );

      case "skills":
        return skills.length > 0 ? (
          <View key="skills" style={{ marginTop: 6 }}>
            <View style={proStyles.sectionHeader}>
              <Text style={proStyles.sectionTitle}>Technical Skills</Text>
            </View>
            <View style={proStyles.skillsGrid}>
              {skills.map((skill) => (
                <View key={skill.id} style={proStyles.skillItem}>
                  <Text style={proStyles.skillName}>{skill.name}</Text>
                  <Text style={proStyles.skillLevel}>{skill.level}</Text>
                  <SkillDotsPdf level={skill.level} />
                </View>
              ))}
            </View>
          </View>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <View key="experience" style={{ marginTop: 6 }}>
            <View style={proStyles.sectionHeader}>
              <Text style={proStyles.sectionTitle}>Professional Experience</Text>
            </View>
            {experience.map((item) => (
              <View key={item.id} style={proStyles.entry} wrap={false}>
                <View style={proStyles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={proStyles.role}>{item.role || "Position"}</Text>
                    {item.company ? <Text style={proStyles.company}>{item.company}</Text> : null}
                  </View>
                  {item.period ? <Text style={proStyles.period}>{item.period}</Text> : null}
                </View>
                {item.description &&
                  item.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <View key={idx} style={proStyles.bulletRow}>
                        <View style={proStyles.bulletDot} />
                        <Text style={proStyles.bulletText}>{line.replace(/^[-•]\s*/, "")}</Text>
                      </View>
                    ))}
              </View>
            ))}
          </View>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <View key="education" style={{ marginTop: 6 }}>
            <View style={proStyles.sectionHeader}>
              <Text style={proStyles.sectionTitle}>Education</Text>
            </View>
            {education.map((item) => (
              <View key={item.id} style={proStyles.entryHeader} wrap={false}>
                <View style={{ flex: 1 }}>
                  <Text style={proStyles.role}>{item.degree || "Degree"}</Text>
                  <Text style={proStyles.company}>{item.school || "Institution"}</Text>
                </View>
                {item.period ? <Text style={proStyles.period}>{item.period}</Text> : null}
              </View>
            ))}
          </View>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <View key="projects" style={{ marginTop: 6 }}>
            <View style={proStyles.sectionHeader}>
              <Text style={proStyles.sectionTitle}>Projects</Text>
            </View>
            {projects.map((p) => (
              <View key={p.id} style={proStyles.entry} wrap={false}>
                <Text style={proStyles.role}>
                  {p.name || "Project Title"}
                  {p.link ? <Text style={{ color: "#4338ca", fontFamily: "Helvetica", fontSize: 8.5 }}> ({p.link})</Text> : null}
                </Text>
                {p.description ? <Text style={proStyles.bulletText}>{p.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <View key="certifications" style={{ marginTop: 6 }}>
            <View style={proStyles.sectionHeader}>
              <Text style={proStyles.sectionTitle}>Certifications & Honors</Text>
            </View>
            {certifications.map((c) => (
              <View key={c.id} style={proStyles.entryHeader} wrap={false}>
                <Text style={proStyles.role}>
                  {c.name || "Certification"}
                  {c.issuer ? <Text style={proStyles.company}> · {c.issuer}</Text> : null}
                </Text>
                {c.year ? <Text style={proStyles.period}>{c.year}</Text> : null}
              </View>
            ))}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return <>{sectionOrder.map(renderSection)}</>;
}

/* ─────────────────────────────────────────────────────────────
   3. CLEAN SIDEBAR TEMPLATE (Left column labels)
   ───────────────────────────────────────────────────────────── */

const sidebarStyles = StyleSheet.create({
  header: {
    textAlign: "center" as const,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  nameBlock: {
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    lineHeight: 1.25,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textAlign: "center" as const,
  },
  titleBlock: {
    marginBottom: 6,
  },
  title: {
    fontSize: 9.5,
    lineHeight: 1.3,
    color: "#64748b",
    textAlign: "center" as const,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  contactItem: {
    fontSize: 9,
    lineHeight: 1.3,
    color: "#64748b",
    marginHorizontal: 6,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#e2e8f0",
  },
  leftCol: {
    width: 95,
    fontSize: 8.5,
    lineHeight: 1.3,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    color: "#94a3b8",
    paddingTop: 1,
  },
  rightCol: {
    flex: 1,
  },
  text: {
    fontSize: 9,
    lineHeight: 1.45,
    color: "#334155",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  sub: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: "#64748b",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#94a3b8",
    marginTop: 4,
    marginRight: 5,
  },
});

function CleanSidebarTemplatePdf({
  personal,
  experience,
  education,
  skills,
  projects,
  certifications,
  sectionOrder,
}: ResumePdfProps) {
  const renderSection = (key: string) => {
    switch (key) {
      case "personal":
        return (
          <View key="personal" style={sidebarStyles.header}>
            <View style={sidebarStyles.nameBlock}>
              <Text style={sidebarStyles.name}>{personal.fullName || "Your Full Name"}</Text>
            </View>
            {personal.title ? (
              <View style={sidebarStyles.titleBlock}>
                <Text style={sidebarStyles.title}>{personal.title}</Text>
              </View>
            ) : null}
            <View style={sidebarStyles.contactRow}>
              {personal.email ? <Text style={sidebarStyles.contactItem}>{personal.email}</Text> : null}
              {personal.phone ? <Text style={sidebarStyles.contactItem}>· {personal.phone}</Text> : null}
              {personal.location ? <Text style={sidebarStyles.contactItem}>· {personal.location}</Text> : null}
            </View>
            {personal.summary ? (
              <View style={sidebarStyles.row}>
                <Text style={sidebarStyles.leftCol}>Summary</Text>
                <View style={sidebarStyles.rightCol}>
                  <Text style={sidebarStyles.text}>{personal.summary}</Text>
                </View>
              </View>
            ) : null}
          </View>
        );

      case "experience":
        return experience.length > 0 ? (
          <View key="experience" style={sidebarStyles.row} wrap={false}>
            <Text style={sidebarStyles.leftCol}>Experience</Text>
            <View style={sidebarStyles.rightCol}>
              {experience.map((item, i) => (
                <View key={item.id} style={{ marginBottom: i < experience.length - 1 ? 6 : 0 }}>
                  <View style={sidebarStyles.entryHeader}>
                    <View>
                      <Text style={[sidebarStyles.text, sidebarStyles.bold]}>
                        {item.company || "Company"}
                      </Text>
                      <Text style={sidebarStyles.sub}>{item.role}</Text>
                    </View>
                    {item.period ? <Text style={sidebarStyles.sub}>{item.period}</Text> : null}
                  </View>
                  {item.description &&
                    item.description
                      .split("\n")
                      .filter(Boolean)
                      .map((line, idx) => (
                        <View key={idx} style={sidebarStyles.bulletRow}>
                          <View style={sidebarStyles.bulletDot} />
                          <Text style={sidebarStyles.text}>{line.replace(/^[-•]\s*/, "")}</Text>
                        </View>
                      ))}
                </View>
              ))}
            </View>
          </View>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <View key="education" style={sidebarStyles.row} wrap={false}>
            <Text style={sidebarStyles.leftCol}>Education</Text>
            <View style={sidebarStyles.rightCol}>
              {education.map((item, i) => (
                <View key={item.id} style={sidebarStyles.entryHeader}>
                  <View>
                    <Text style={[sidebarStyles.text, sidebarStyles.bold]}>
                      {item.school || "Institution"}
                    </Text>
                    <Text style={sidebarStyles.sub}>{item.degree}</Text>
                  </View>
                  {item.period ? <Text style={sidebarStyles.sub}>{item.period}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <View key="skills" style={sidebarStyles.row} wrap={false}>
            <Text style={sidebarStyles.leftCol}>Skills</Text>
            <View style={sidebarStyles.rightCol}>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {skills.map((s) => (
                  <View key={s.id} style={{ width: "50%", marginBottom: 4 }}>
                    <Text style={[sidebarStyles.text, sidebarStyles.bold]}>{s.name}</Text>
                    <Text style={sidebarStyles.sub}>{s.level}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <View key="projects" style={sidebarStyles.row} wrap={false}>
            <Text style={sidebarStyles.leftCol}>Projects</Text>
            <View style={sidebarStyles.rightCol}>
              {projects.map((p) => (
                <View key={p.id} style={{ marginBottom: 4 }}>
                  <Text style={[sidebarStyles.text, sidebarStyles.bold]}>
                    {p.name || "Project"}
                    {p.link ? <Text style={sidebarStyles.sub}> ({p.link})</Text> : null}
                  </Text>
                  {p.description ? <Text style={sidebarStyles.text}>{p.description}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <View key="certifications" style={sidebarStyles.row} wrap={false}>
            <Text style={sidebarStyles.leftCol}>Certificates</Text>
            <View style={sidebarStyles.rightCol}>
              {certifications.map((c) => (
                <View key={c.id} style={sidebarStyles.entryHeader}>
                  <Text style={[sidebarStyles.text, sidebarStyles.bold]}>
                    {c.name}
                    {c.issuer ? <Text style={sidebarStyles.sub}> · {c.issuer}</Text> : null}
                  </Text>
                  {c.year ? <Text style={sidebarStyles.sub}>{c.year}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return <>{sectionOrder.map(renderSection)}</>;
}

/* ─────────────────────────────────────────────────────────────
   MAIN DOCUMENT WRAPPER
   ───────────────────────────────────────────────────────────── */

export default function ResumePdfDocument(props: ResumePdfProps) {
  const { personal, template = "classic" } = props;

  return (
    <Document
      title={personal.fullName ? `${personal.fullName} Resume` : "Resume"}
      author={personal.fullName || "Resume Builder"}
      subject="Resume"
      creator="Resume Builder"
    >
      <Page size="A4" style={baseStyles.page}>
        {template === "professional" && <ProfessionalTemplatePdf {...props} />}
        {template === "clean-sidebar" && <CleanSidebarTemplatePdf {...props} />}
        {template === "classic" && <ClassicTemplatePdf {...props} />}
      </Page>
    </Document>
  );
}
