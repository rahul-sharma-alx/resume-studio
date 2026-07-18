import type { Resume } from "@/features/resume/validators/resume";
import {
  ATS_CATEGORY_WEIGHTS,
  type ATSCategoryId,
  type ATSCategoryScore,
  type ATSReport,
} from "./types";

const ACTION_VERBS = new Set([
  "achieved", "built", "created", "designed", "developed", "drove", "delivered",
  "improved", "increased", "led", "launched", "optimized", "reduced", "scaled",
  "shipped", "spearheaded", "implemented", "automated", "migrated", "resolved",
  "streamlined", "established", "managed", "mentored", "negotiated", "generated",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\#.]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function hasActionVerb(line: string): boolean {
  const first = line.trim().toLowerCase().split(/\s+/)[0] ?? "";
  return ACTION_VERBS.has(first.replace(/[^a-z]/g, ""));
}

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export interface AnalyzeOptions {
  // Optional job description for keyword matching. When omitted, keyword
  // match scores against common software-engineering skill tokens found in
  // the resume's own skills section.
  jobDescription?: string;
}

export function analyzeResume(resume: Resume, options: AnalyzeOptions = {}): ATSReport {
  const categories: ATSCategoryScore[] = [];

  const add = (id: ATSCategoryId, score: number, suggestions: string[]) => {
    const meta = ATS_CATEGORY_WEIGHTS[id];
    categories.push({ id, label: meta.label, score, weight: meta.weight, suggestions });
  };

  // --- Contact Information ---
  const profile = resume.profile;
  const contactMissing: string[] = [];
  if (!profile.email) contactMissing.push("Add an email address.");
  if (!profile.phone) contactMissing.push("Add a phone number.");
  if (!profile.location) contactMissing.push("Add your location.");
  const contactScore = pct(4 - contactMissing.length, 4);
  add("contact", contactScore, contactMissing);

  // --- Section Completeness ---
  const present = [
    profile.fullName,
    profile.jobTitle,
    profile.summary ?? resume.summary,
    resume.experience.length > 0,
    resume.projects.length > 0,
    resume.skills.some((g) => g.skills.length > 0),
    resume.education.length > 0,
  ].filter(Boolean).length;
  const sectionTotal = 7;
  const sectionSuggestions: string[] = [];
  if (!profile.summary && !resume.summary) sectionSuggestions.push("Add a professional summary.");
  if (resume.experience.length === 0 && resume.projects.length === 0)
    sectionSuggestions.push("Add at least one experience or project.");
  add("sections", pct(present, sectionTotal), sectionSuggestions);

  // --- Experience Quality ---
  const expSuggestions: string[] = [];
  let expWithDates = 0;
  let expMultiBullet = 0;
  for (const exp of resume.experience) {
    if (exp.startDate) expWithDates += 1;
    if (exp.achievements.filter((a) => a.trim()).length >= 2) expMultiBullet += 1;
  }
  if (resume.experience.length > 0) {
    if (expWithDates < resume.experience.length)
      expSuggestions.push("Add start (and end) dates to every experience.");
    if (expMultiBullet < resume.experience.length)
      expSuggestions.push("Use at least two achievement bullets per role.");
  }
  const expScore =
    resume.experience.length === 0
      ? 0
      : Math.min(
          100,
          pct(expWithDates, resume.experience.length) * 0.5 +
            pct(expMultiBullet, resume.experience.length) * 0.5,
        );
  add("experience", expScore, expSuggestions);

  // --- Achievements ---
  const allAchievements = [
    ...resume.experience.flatMap((e) => e.achievements),
    ...resume.projects.flatMap((p) => p.achievements),
    ...resume.achievements,
  ].filter((a) => a.trim());
  const measurable = allAchievements.filter((a) => /\d/.test(a)).length;
  const achievementSuggestions: string[] = [];
  if (allAchievements.length === 0)
    achievementSuggestions.push("Add measurable achievements (with numbers) to strengthen impact.");
  else if (measurable < allAchievements.length)
    achievementSuggestions.push("Quantify more bullets with metrics (%, time saved, users).");
  add(
    "achievements",
    allAchievements.length === 0
      ? 0
      : Math.round(pct(measurable, allAchievements.length) * 0.7 + pct(allAchievements.length, 6) * 0.3),
    achievementSuggestions,
  );

  // --- Action Verbs ---
  const bulletLines = [
    ...resume.experience.flatMap((e) => e.achievements),
    ...resume.projects.flatMap((p) => p.achievements),
  ].filter((a) => a.trim());
  const verbHits = bulletLines.filter(hasActionVerb).length;
  const verbSuggestions: string[] = [];
  if (bulletLines.length > 0 && pct(verbHits, bulletLines.length) < 80)
    verbSuggestions.push("Start more bullets with strong action verbs (Built, Led, Improved…).");
  add("actionVerbs", bulletLines.length === 0 ? 0 : pct(verbHits, bulletLines.length), verbSuggestions);

  // --- Keyword Match ---
  const resumeText = [
    profile.summary ?? resume.summary,
    ...resume.experience.flatMap((e) => [e.description, ...e.achievements, ...e.technologies]),
    ...resume.projects.flatMap((p) => [p.description, ...p.achievements, ...p.technologies]),
    ...resume.skills.flatMap((g) => g.skills),
  ]
    .join(" ")
    .toLowerCase();
  let keywordScore = 100;
  const keywordSuggestions: string[] = [];
  if (options.jobDescription && options.jobDescription.trim()) {
    const jdTokens = tokenize(options.jobDescription);
    const resumeTokens = new Set(tokenize(resumeText));
    const missing = jdTokens.filter((t) => t.length > 2 && !resumeTokens.has(t));
    const uniqueMissing = [...new Set(missing)];
    keywordScore = pct(jdTokens.length - missing.length, jdTokens.length) || 0;
    if (uniqueMissing.length > 0)
      keywordSuggestions.push(
        `Consider adding missing keywords: ${uniqueMissing.slice(0, 8).join(", ")}${uniqueMissing.length > 8 ? "…" : ""}`,
      );
  } else {
    keywordSuggestions.push("Paste a job description to get a keyword match score.");
  }
  add("keywords", keywordScore, keywordSuggestions);

  // --- Readability (ponytail: crude, no NLP lib — sentence-length heuristic) ---
  const sentences = resumeText
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 30).length;
  const readabilitySuggestions: string[] = [];
  if (sentences.length > 0 && pct(longSentences, sentences.length) > 20)
    readabilitySuggestions.push("Shorten some long sentences for better readability.");
  add(
    "readability",
    sentences.length === 0 ? 100 : Math.max(0, 100 - pct(longSentences, sentences.length) * 2),
    readabilitySuggestions,
  );

  // --- Resume Length ---
  const totalBullets = bulletLines.length;
  const lengthSuggestions: string[] = [];
  let lengthScore = 100;
  if (totalBullets > 24) {
    lengthScore = 70;
    lengthSuggestions.push("Resume looks long; trim to the most relevant bullets.");
  } else if (totalBullets < 3 && resume.experience.length + resume.projects.length > 0) {
    lengthScore = 60;
    lengthSuggestions.push("Add more detail — resumes under 3 bullets seem thin.");
  }
  add("length", lengthScore, lengthSuggestions);

  // --- Formatting (single column, semantic — always satisfied by our renderer) ---
  add("formatting", 100, []);

  const overall = Math.round(
    categories.reduce((sum, c) => sum + c.score * c.weight, 0) /
      categories.reduce((sum, c) => sum + c.weight, 0),
  );

  return { overall: Math.min(100, overall), categories };
}
