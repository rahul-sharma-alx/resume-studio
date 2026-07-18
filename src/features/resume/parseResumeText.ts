import type { Resume } from "./validators/resume";
import { createId } from "./constants";

const SECTION_HEADERS: Array<{ key: keyof Resume | "summary"; patterns: RegExp }> = [
  { key: "summary", patterns: /(summary|profile|about me|objective)/i },
  { key: "experience", patterns: /(experience|employment|work history|work)/i },
  { key: "projects", patterns: /(projects?|portfolio)/i },
  { key: "education", patterns: /(education|academics?)/i },
  { key: "skills", patterns: /(skills?|technologies|tech stack|competencies)/i },
  { key: "certificates", patterns: /(certifications?|certificates?|credentials)/i },
  { key: "achievements", patterns: /(achievements?|accomplishments?|honors?|awards?)/i },
  { key: "languages", patterns: /(languages?|spoken)/i },
];

const EMAIL_RE = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;
const PHONE_RE = /([+(]?\d[\d\s().-]{7,}\d)/;
const URL_RE = /(https?:\/\/[^\s,]+)/i;

function splitSections(text: string): Map<string, string> {
  const lines = text.split(/\r?\n/);
  const map = new Map<string, string>();
  let current = "header";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const matched = SECTION_HEADERS.find((h) => h.patterns.test(line) && line.length < 40);
    if (matched) {
      current = String(matched.key);
      map.set(current, "");
      continue;
    }
    map.set(current, `${map.get(current) ?? ""}\n${line}`);
  }
  return map;
}

function splitBullets(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

// Heuristic plain-text → partial resume model. Never throws; returns a plain
// object the store validates through resumeSchema before applying.
export function parseResumeText(text: string): Record<string, unknown> {
  const sections = splitSections(text);
  const header = sections.get("header") ?? "";
  const headerLines = header.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(EMAIL_RE);
  const phoneMatch = text.match(PHONE_RE);
  const urlMatch = text.match(URL_RE);

  const profile: Record<string, unknown> = {
    fullName: headerLines[0] ?? "",
    jobTitle: headerLines[1] ?? "",
    email: emailMatch ? emailMatch[1] : "",
    phone: phoneMatch ? phoneMatch[1] : "",
    website: urlMatch ? urlMatch[1] : "",
    linkedin: "",
    github: "",
    summary: "",
  };

  const summaryText = sections.get("summary")?.trim() ?? "";
  if (summaryText) profile.summary = summaryText.slice(0, 600);

  const experienceText = sections.get("experience") ?? "";
  const experience = experienceText
    ? [
        {
          id: createId(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: experienceText.trim().slice(0, 400),
          achievements: splitBullets(experienceText).slice(0, 10),
          technologies: [],
        },
      ]
    : [];

  const projectsText = sections.get("projects") ?? "";
  const projects = projectsText
    ? [
        {
          id: createId(),
          name: splitBullets(projectsText)[0] ?? "Project",
          description: projectsText.trim().slice(0, 400),
          role: "",
          github: "",
          liveDemo: "",
          technologies: [],
          achievements: splitBullets(projectsText).slice(1, 10),
        },
      ]
    : [];

  const skillsText = sections.get("skills") ?? "";
  const skillTokens = skillsText
    .replace(/[,;]/g, " ")
    .split(/\s+/)
    .map((s) => s.replace(/[-•*]/g, "").trim())
    .filter((s) => s.length > 1 && s.length < 30);
  const skills = skillTokens.length
    ? [{ category: "SoftSkills" as const, skills: [...new Set(skillTokens)] }]
    : [];

  const educationText = sections.get("education") ?? "";
  const education = educationText
    ? [
        {
          id: createId(),
          institution: splitBullets(educationText)[0] ?? "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          score: "",
          location: "",
        },
      ]
    : [];

  const certificates = splitBullets(sections.get("certificates") ?? "");
  const achievements = splitBullets(sections.get("achievements") ?? "");
  const languages = splitBullets(sections.get("languages") ?? "").map((name) => ({ name, proficiency: "" }));

  return {
    profile,
    summary: summaryText,
    experience,
    projects,
    skills,
    education,
    certificates,
    achievements,
    languages,
  };
}
