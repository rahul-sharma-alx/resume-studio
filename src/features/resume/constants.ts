import type { Resume } from "./validators/resume";

export const STORAGE_KEY = "resume-studio:resume:v1";

export const TEMPLATE_OPTIONS = [
  { id: "minimal", label: "Minimal" },
  { id: "professional", label: "Professional" },
  { id: "modern", label: "Modern" },
  { id: "executive", label: "Executive" },
  { id: "developer", label: "Developer" },
  { id: "academic", label: "Academic" },
] as const;

export type TemplateId = (typeof TEMPLATE_OPTIONS)[number]["id"];

// Sections a variant can show/hide, in default render order.
export const SECTION_IDS = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "certificates",
  "achievements",
  "languages",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface Variant {
  id: string;
  name: string;
  template: TemplateId;
  visibleSections: SectionId[];
}

export function defaultVariant(name: string, template: TemplateId = "minimal"): Variant {
  return { id: createId(), name, template, visibleSections: [...SECTION_IDS] };
}

export function createId(): string {
  // ponytail: crypto.randomUUID is available in all modern browsers + Node; no dep needed.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function emptyResume(): Resume {
  return {
    profile: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    summary: "",
    experience: [],
    projects: [],
    skills: [],
    education: [],
    certificates: [],
    achievements: [],
    languages: [],
  };
}
