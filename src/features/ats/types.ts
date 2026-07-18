export type ATSCategoryId =
  | "contact"
  | "sections"
  | "experience"
  | "achievements"
  | "actionVerbs"
  | "keywords"
  | "readability"
  | "length"
  | "formatting";

export interface ATSCategoryScore {
  id: ATSCategoryId;
  label: string;
  score: number; // 0–100
  weight: number; // relative contribution to overall score
  suggestions: string[];
}

export interface ATSReport {
  overall: number; // 0–100
  categories: ATSCategoryScore[];
}

export const ATS_CATEGORY_WEIGHTS: Record<ATSCategoryId, { label: string; weight: number }> = {
  contact: { label: "Contact Information", weight: 10 },
  sections: { label: "Section Completeness", weight: 15 },
  experience: { label: "Experience Quality", weight: 20 },
  achievements: { label: "Achievements", weight: 15 },
  actionVerbs: { label: "Action Verbs", weight: 10 },
  keywords: { label: "Keyword Match", weight: 20 },
  readability: { label: "Readability", weight: 5 },
  length: { label: "Resume Length", weight: 3 },
  formatting: { label: "Formatting", weight: 2 },
};
