import profileRaw from "@/data/profile.json";
import navigationRaw from "@/data/navigation.json";
import socialsRaw from "@/data/socials.json";
import skillsRaw from "@/data/skills.json";
import projectsRaw from "@/data/projects.json";
import educationRaw from "@/data/education.json";
import experienceRaw from "@/data/experience.json";
import type {
  Education, Experience, ExperienceData, NavItem, Profile, Project, ProjectArchitecture, ProjectFact,
  ProjectImage, ProjectStatus, Skill, SkillGroup, SkillStatus, Social, FeatureGroup, ArchitectureLayer,
} from "./types";

/* ------------------------------------------------------------------ */
/* Tiny, forgiving validators. Bad entries are skipped with a warning  */
/* (visible in the terminal / build log) instead of crashing the page. */
/* ------------------------------------------------------------------ */

const warnings: string[] = [];
export const getDataWarnings = () => [...warnings];
function warn(msg: string) {
  warnings.push(msg);
  console.warn(`[portfolio-data] ${msg}`);
}

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const strs = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(str).filter((s): s is string => !!s) : str(v) ? [str(v) as string] : [];
const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

export function safeUrl(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const PROJECT_STATUSES: ProjectStatus[] = ["in-development", "completed", "academic", "prototype", "archived"];
const SKILL_STATUSES: SkillStatus[] = ["comfortable", "learning", "exploring"];

/* ------------------------------ projects ---------------------------- */

function normalizeImages(v: unknown, title: string): ProjectImage[] {
  return list(v).flatMap((item, i) => {
    const src = typeof item === "string" ? str(item) : isRec(item) ? str(item.src) : undefined;
    if (!src) return [];
    const rec = isRec(item) ? item : {};
    return [{ src, alt: str(rec.alt) ?? `${title}, image ${i + 1}`, caption: str(rec.caption) }];
  });
}
function normalizeLayers(v: unknown): ArchitectureLayer[] {
  return list(v).flatMap((l) => {
    if (!isRec(l)) return [];
    const title = str(l.title);
    if (!title) return [];
    return [{ title, description: str(l.description), items: strs(l.items) }];
  });
}
function normalizeArchitecture(v: unknown): ProjectArchitecture | undefined {
  // Accept a plain string / string[] as shorthand for a summary.
  if (typeof v === "string" || Array.isArray(v)) {
    const s = strs(v);
    return s.length ? { summary: s.join(" "), layers: [], notes: [] } : undefined;
  }
  if (!isRec(v)) return undefined;
  const a = { summary: str(v.summary), layers: normalizeLayers(v.layers), notes: strs(v.notes) };
  return a.summary || a.layers.length || a.notes.length ? a : undefined;
}
function normalizeGroups(v: unknown): FeatureGroup[] {
  return list(v).flatMap((g) => {
    if (!isRec(g)) return [];
    const title = str(g.title);
    const items = strs(g.items);
    return title && items.length ? [{ title, items }] : [];
  });
}
function normalizeFacts(v: unknown): ProjectFact[] {
  return list(v).flatMap((f) => {
    if (!isRec(f)) return [];
    const label = str(f.label), value = str(f.value);
    return label && value ? [{ label, value }] : [];
  });
}

function normalizeProject(raw: unknown, index: number): Project | null {
  if (!isRec(raw)) return warn(`projects[${index}] is not an object, skipped.`), null;
  const title = str(raw.title);
  if (!title) return warn(`projects[${index}] has no "title", skipped.`), null;
  const slug = slugify(str(raw.slug) ?? title);
  if (!slug) return warn(`projects[${index}] ("${title}") has no usable slug, skipped.`), null;
  const status = PROJECT_STATUSES.find((s) => s === raw.status);
  if (raw.status !== undefined && !status) {
    warn(`Project "${slug}": unknown status "${String(raw.status)}" (use ${PROJECT_STATUSES.join(", ")}). Status hidden.`);
  }
  return {
    slug,
    title,
    subtitle: str(raw.subtitle),
    description: str(raw.description) ?? "",
    status,
    featured: raw.featured === true,
    sortOrder: num(raw.sortOrder),
    coverImage: str(raw.coverImage),
    coverAlt: str(raw.coverAlt),
    gallery: normalizeImages(raw.gallery, title),
    technologies: strs(raw.technologies),
    categories: strs(raw.categories),
    facts: normalizeFacts(raw.facts),
    overview: strs(raw.overview),
    problem: strs(raw.problem),
    goals: strs(raw.goals),
    features: strs(raw.features),
    featureGroups: normalizeGroups(raw.featureGroups),
    architecture: normalizeArchitecture(raw.architecture),
    challengesNote: str(raw.challengesNote),
    challenges: strs(raw.challenges),
    lessonsLearned: strs(raw.lessonsLearned),
    futureImprovements: strs(raw.futureImprovements),
    liveUrl: safeUrl(raw.liveUrl),
    liveNote: str(raw.liveNote),
    repositoryUrl: safeUrl(raw.repositoryUrl),
    runLocally: str(raw.runLocally),
    startDate: str(raw.startDate),
    endDate: str(raw.endDate),
  };
}
const byOrder = <T extends { sortOrder?: number }>(a: [T, number], b: [T, number]) =>
  (a[0].sortOrder ?? Infinity) - (b[0].sortOrder ?? Infinity) || a[1] - b[1];

function buildProjects(): Project[] {
  const seen = new Set<string>();
  const projects = list(projectsRaw).flatMap((raw, i) => {
    const p = normalizeProject(raw, i);
    if (!p) return [];
    if (seen.has(p.slug)) return warn(`Duplicate project slug "${p.slug}", the later entry was skipped.`), [];
    seen.add(p.slug);
    return [p];
  });
  // Featured first, then by sortOrder, then by position in the file.
  return projects
    .map((p, i): [Project, number] => [p, i])
    .sort((a, b) => Number(b[0].featured) - Number(a[0].featured) || byOrder(a, b))
    .map(([p]) => p);
}

/* ------------------------------- skills ----------------------------- */

function buildSkillGroups(): SkillGroup[] {
  const skills = list(skillsRaw).flatMap((raw, i): Skill[] => {
    if (!isRec(raw)) return [];
    const name = str(raw.name);
    if (!name) return warn(`skills[${i}] has no "name", skipped.`), [];
    const status = SKILL_STATUSES.find((s) => s === raw.status);
    return [{
      name,
      category: str(raw.category) ?? "Other",
      icon: str(raw.icon),
      description: str(raw.description),
      status,
      featured: raw.featured === true,
      sortOrder: num(raw.sortOrder),
    }];
  });
  const groups = new Map<string, Array<[Skill, number]>>();
  skills.forEach((s, i) => groups.set(s.category, [...(groups.get(s.category) ?? []), [s, i]]));
  // Categories appear in the order they first show up in skills.json.
  return [...groups.entries()].map(([category, items]) => ({
    category,
    skills: items.sort(byOrder).map(([s]) => s),
  }));
}

/* ----------------------------- the rest ----------------------------- */

function buildProfile(): Profile {
  const r: Rec = isRec(profileRaw) ? profileRaw : {};
  const portrait = isRec(r.portrait) ? r.portrait : {};
  const phone = isRec(r.phone) ? r.phone : {};
  const resume = isRec(r.resume) ? r.resume : {};
  const name = str(r.name) ?? "Your Name";
  return {
    name,
    monogram: str(r.monogram) ?? name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    designation: str(r.designation) ?? "",
    tagline: str(r.tagline) ?? "",
    headline: str(r.headline) ?? name,
    intro: str(r.intro) ?? "",
    currentFocus: str(r.currentFocus),
    university: str(r.university) ?? "",
    degree: str(r.degree) ?? "",
    expectedGraduation: str(r.expectedGraduation),
    email: str(r.email) ?? "",
    phone: str(phone.display) && str(phone.tel) ? { display: str(phone.display)!, tel: str(phone.tel)! } : undefined,
    portrait: { src: str(portrait.src) ?? "/images/portrait.webp", alt: str(portrait.alt) ?? `Portrait of ${name}` },
    resumePath: str(resume.path) ?? "/resume.pdf",
    siteDescription: str(r.siteDescription) ?? str(r.intro) ?? "",
    about: strs(r.about),
    interests: strs(r.interests),
  };
}
function buildNav(): NavItem[] {
  return list(navigationRaw).flatMap((n) => {
    if (!isRec(n)) return [];
    const label = str(n.label), href = str(n.href);
    return label && href && (href.startsWith("#") || href.startsWith("/")) ? [{ label, href }] : [];
  });
}
function buildSocials(): Social[] {
  return list(socialsRaw).flatMap((s, i) => {
    if (!isRec(s)) return [];
    const label = str(s.label), url = safeUrl(s.url);
    if (!label || !url) return warn(`socials[${i}] needs a "label" and a valid http(s) "url", skipped.`), [];
    return [{
      id: str(s.id) ?? slugify(label), label, url, handle: str(s.handle),
      icon: str(s.icon) ?? slugify(label), hero: s.hero === true,
    }];
  });
}
function buildEducation(): Education[] {
  return list(educationRaw).flatMap((e) => {
    if (!isRec(e)) return [];
    const institution = str(e.institution), degree = str(e.degree);
    if (!institution || !degree) return warn(`An education entry needs "institution" and "degree", skipped.`), [];
    return [{
      institution, degree, status: str(e.status), startDate: str(e.startDate), endDate: str(e.endDate),
      endIsExpected: e.endIsExpected === true, summary: str(e.summary), focusAreas: strs(e.focusAreas),
    }];
  });
}
function buildExperience(): ExperienceData {
  const r: Rec = isRec(experienceRaw) ? experienceRaw : {};
  const entries = list(r.entries).flatMap((e): Experience[] => {
    if (!isRec(e)) return [];
    const role = str(e.role), organization = str(e.organization);
    if (!role || !organization) return warn(`An experience entry needs "role" and "organization", skipped.`), [];
    return [{
      role, organization, type: str(e.type), location: str(e.location), startDate: str(e.startDate),
      endDate: str(e.endDate), summary: str(e.summary), highlights: strs(e.highlights), url: safeUrl(e.url),
    }];
  });
  return {
    emptyTitle: str(r.emptyTitle) ?? "Experience",
    emptyText: str(r.emptyText) ?? "Professional experience will appear here.",
    entries,
  };
}

/* ------------------------------ exports ----------------------------- */

export const profile = buildProfile();
export const navigation = buildNav();
export const socials = buildSocials();
export const education = buildEducation();
export const experience = buildExperience();
export const skillGroups = buildSkillGroups();
export const projects = buildProjects();

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return { prev: i > 0 ? projects[i - 1] : undefined, next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined };
}
