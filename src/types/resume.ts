export interface PersonalInfo {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary?: string;
}

export interface Experience {
  id: number;
  personalInfoId: number;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentJob: boolean;
  description?: string;
}

export interface Education {
  id: number;
  personalInfoId: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  graduationDate?: string;
  gpa?: string;
}

export interface Skill {
  id: number;
  personalInfoId: number;
  category: string;
  skillName: string;
  proficiencyLevel: string;
}

export interface Project {
  id: number;
  personalInfoId: number;
  name: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: number;
  personalInfoId: number;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}
