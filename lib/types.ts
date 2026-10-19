/** Schemas for everything in /data. Optional fields may be omitted from the JSON. */

export type ProjectStatus = "in-development" | "completed" | "academic" | "prototype" | "archived";
export type SkillStatus = "comfortable" | "learning" | "exploring";

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}
export interface ArchitectureLayer {
  title: string;
  description?: string;
  items: string[];
}
export interface ProjectArchitecture {
  summary?: string;
  layers: ArchitectureLayer[];
  notes: string[];
}
export interface FeatureGroup {
  title: string;
  items: string[];
}
export interface ProjectFact {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  status?: ProjectStatus;
  featured: boolean;
  sortOrder?: number;
  coverImage?: string;
  coverAlt?: string;
  gallery: ProjectImage[];
  technologies: string[];
  categories: string[];
  facts: ProjectFact[];
  overview: string[];
  problem: string[];
  goals: string[];
  features: string[];
  featureGroups: FeatureGroup[];
  architecture?: ProjectArchitecture;
  challengesNote?: string;
  challenges: string[];
  lessonsLearned: string[];
  futureImprovements: string[];
  liveUrl?: string;
  liveNote?: string;
  repositoryUrl?: string;
  runLocally?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  name: string;
  category: string;
  icon?: string;
  description?: string;
  status?: SkillStatus;
  featured: boolean;
  sortOrder?: number;
}
export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Profile {
  name: string;
  monogram: string;
  designation: string;
  tagline: string;
  headline: string;
  intro: string;
  currentFocus?: string;
  university: string;
  degree: string;
  expectedGraduation?: string;
  email: string;
  phone?: { display: string; tel: string };
  portrait: { src: string; alt: string };
  resumePath: string;
  siteDescription: string;
  about: string[];
  interests: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
export interface Social {
  id: string;
  label: string;
  url: string;
  handle?: string;
  icon: string;
  hero: boolean;
}
export interface Education {
  institution: string;
  degree: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  endIsExpected: boolean;
  summary?: string;
  focusAreas: string[];
}
export interface Experience {
  role: string;
  organization: string;
  type?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights: string[];
  url?: string;
}
export interface ExperienceData {
  emptyTitle: string;
  emptyText: string;
  entries: Experience[];
}
