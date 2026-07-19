/* eslint-disable @typescript-eslint/no-explicit-any -- this module normalizes untrusted external JSON; loose typing at the boundary is intentional. */
import type { Resume, EmploymentType, SkillCategory, SkillGroup } from "@/features/resume/validators/resume";
import type { TemplateId } from "@/features/resume/constants";

const KNOWN_CATEGORIES: Record<string, SkillCategory> = {
  languages: "Languages",
  frameworks: "Frameworks",
  databases: "Databases",
  cloud: "Cloud",
  devops: "DevOps",
  testing: "Testing",
  tools: "Tools",
  concepts: "Concepts",
  softskills: "SoftSkills",
};

export function resumeToJson(resume: Resume): string {
  return JSON.stringify(resume, null, 2);
}

export function downloadResumeJson(resume: Resume, filename = "resume.json"): void {
  const blob = new Blob([resumeToJson(resume)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readResumeJsonFile(file: File): Promise<unknown> {
  const text = await file.text();
  return JSON.parse(text);
}

const EMPLOYMENT_MAP: Record<string, string> = {
  fulltime: "FullTime",
  "full-time": "FullTime",
  parttime: "PartTime",
  "part-time": "PartTime",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
  selfemployed: "SelfEmployed",
};

export interface NormalizedResume {
  resume: Partial<Resume>;
  template?: TemplateId;
  title?: string;
}

// ponytail: maps common external JSON shapes (e.g. the Alxpace export) into our
// model before the strict Zod gate. Never throws — unknown fields are dropped,
// the resume still passes through resumeSchema (which fills defaults).
export function normalizeImportedResume(input: unknown): NormalizedResume {
  if (!input || typeof input !== "object") return { resume: {} };
  const data = input as Record<string, any>;

  const personal = data.personal ?? {};
  const profile = {
    fullName:
      data.profile?.fullName ??
      personal.fullName ??
      [personal.firstName, personal.lastName].filter(Boolean).join(" "),
    jobTitle: data.profile?.jobTitle ?? personal.headline ?? personal.title ?? "",
    email: data.profile?.email ?? personal.email ?? "",
    phone: data.profile?.phone ?? "",
    location: data.profile?.location ?? "",
    website:
      data.profile?.website ??
      personal.website ??
      personal.portfolio ??
      (data.socialLinks ?? []).find((l: any) => /portfolio/i.test(l.platform ?? ""))?.url ??
      "",
    linkedin:
      data.profile?.linkedin ??
      personal.linkedin ??
      (data.socialLinks ?? []).find((l: any) => /linkedin/i.test(l.platform ?? ""))?.url ??
      "",
    github:
      data.profile?.github ??
      personal.github ??
      (data.socialLinks ?? []).find((l: any) => /github/i.test(l.platform ?? ""))?.url ??
      "",
    summary: data.profile?.summary ?? "",
  };

  const summary = data.summary ?? profile.summary ?? "";

  const expIn = Array.isArray(data.experience) ? data.experience : [];
  const experience = expIn.map((e: any) => ({
    id: e.id ?? crypto.randomUUID?.() ?? String(Math.random()),
    company: e.company ?? "",
    position: e.position ?? e.title ?? "",
    employmentType: EMPLOYMENT_MAP[String(e.employmentType ?? "").toLowerCase()] as EmploymentType | undefined,
    startDate: e.startDate ?? "",
    endDate: e.currentlyWorking || e.current ? "Present" : e.endDate ?? "",
    current: Boolean(e.currentlyWorking || e.current),
    location: e.location ?? "",
    description: e.description ?? "",
    achievements: Array.isArray(e.achievements) ? e.achievements.filter(Boolean) : [],
    technologies: Array.isArray(e.technologies) ? e.technologies.filter(Boolean) : [],
  }));

  const projIn = Array.isArray(data.projects) ? data.projects : [];
  const projects = projIn.map((p: any) => ({
    id: p.id ?? crypto.randomUUID?.() ?? String(Math.random()),
    name: p.name ?? "",
    description: p.description ?? "",
    role: p.role ?? "",
    startDate: p.startDate ?? "",
    endDate: p.endDate ?? "",
    github: p.github ?? "",
    liveDemo: p.liveUrl ?? p.liveDemo ?? "",
    technologies: Array.isArray(p.technologies) ? p.technologies.filter(Boolean) : [],
    achievements: Array.isArray(p.achievements) ? p.achievements.filter(Boolean) : [],
  }));

  // skills: accept object keyed by category OR array of {category, skills}
  let skills: SkillGroup[] = [];
  if (data.skills && !Array.isArray(data.skills)) {
    skills = Object.entries(data.skills).map(([category, list]) => ({
      category: KNOWN_CATEGORIES[category.toLowerCase()] ?? ("SoftSkills" as SkillCategory),
      skills: Array.isArray(list) ? (list as string[]).filter(Boolean) : [],
    }));
  } else if (Array.isArray(data.skills)) {
    skills = data.skills;
  } else if (Array.isArray(data.skillGroups)) {
    skills = data.skillGroups;
  }

  const eduIn = Array.isArray(data.education) ? data.education : [];
  const education = eduIn.map((e: any) => ({
    id: e.id ?? crypto.randomUUID?.() ?? String(Math.random()),
    institution: e.institution ?? "",
    degree: e.degree ?? "",
    field: e.fieldOfStudy ?? e.field ?? "",
    startDate: String(e.startYear ?? e.startDate ?? ""),
    endDate: String(e.endYear ?? e.endDate ?? ""),
    score: e.grade ?? e.score ?? "",
    location: e.location ?? "",
  }));

  const certificates = Array.isArray(data.certifications)
    ? data.certifications.map((c: any) => (typeof c === "string" ? c : c.name ?? c.title ?? "")).filter(Boolean)
    : Array.isArray(data.certificates)
      ? data.certificates
      : [];

  const achievements = Array.isArray(data.achievements)
    ? data.achievements.map((a: any) => (typeof a === "string" ? a : a.title ?? a.description ?? "")).filter(Boolean)
    : [];

  const languagesIn = Array.isArray(data.languages) ? data.languages : [];
  const languages = languagesIn
    .map((l: any) => ({ name: l.name ?? l.language ?? "", proficiency: l.proficiency ?? "" }))
    .filter((l: any) => l.name);

  const linksIn = Array.isArray(data.links)
    ? data.links
    : Array.isArray(data.socialLinks)
      ? data.socialLinks
      : [];
  const links = linksIn
    .map((l: any) => ({ label: l.label ?? l.platform ?? l.name ?? "", url: l.url ?? "" }))
    .filter((l: any) => l.label);

  const knownTemplates = ["minimal", "professional", "modern", "executive", "developer", "academic"];
  const template = knownTemplates.includes(String(data.template ?? "").toLowerCase())
    ? (String(data.template).toLowerCase() as TemplateId)
    : undefined;

  return {
    resume: {
      profile,
      summary,
      experience,
      projects,
      skills,
      education,
      certificates,
      achievements,
      languages,
      links,
    },
    template,
    title: data.title ?? personal.fullName ?? "Imported Resume",
  };
}

