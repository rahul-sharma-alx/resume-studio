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
  "links",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface Variant {
  id: string;
  name: string;
  template: TemplateId;
  visibleSections: SectionId[];
  // Template customization (doc: accent, font, size, spacing, header align).
  accent: string;
  font: "serif" | "sans" | "mono";
  fontSize: number; // pt
  spacing: "compact" | "normal" | "relaxed";
  headerAlign: "left" | "center";
}

export const FONT_OPTIONS: Array<{ id: Variant["font"]; label: string; stack: string }> = [
  { id: "serif", label: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  { id: "sans", label: "Sans", stack: "Arial, Helvetica, sans-serif" },
  { id: "mono", label: "Mono", stack: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace" },
];

export const SPACING_SCALE = { compact: 0.85, normal: 1, relaxed: 1.2 } as const;

export function defaultVariant(name: string, template: TemplateId = "minimal"): Variant {
  return {
    id: createId(),
    name,
    template,
    visibleSections: [...SECTION_IDS],
    accent: "#1f2937",
    font: "serif",
    fontSize: 11,
    spacing: "normal",
    headerAlign: "left",
  };
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
    links: [],
  };
}
