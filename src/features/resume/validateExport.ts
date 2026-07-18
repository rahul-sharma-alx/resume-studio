import type { Resume } from "./validators/resume";

export interface ExportWarning {
  field: string;
  message: string;
}

// Export-time checks per 09-FEATURES.md "Export Validation". Warnings only —
// they never modify data. Returns an empty array when the resume is clean.
export function validateExport(resume: Resume): ExportWarning[] {
  const warnings: ExportWarning[] = [];
  const profile = resume.profile;

  if (!profile.email) warnings.push({ field: "email", message: "Missing email address." });
  if (!profile.phone) warnings.push({ field: "phone", message: "Missing phone number." });
  if (!profile.location) warnings.push({ field: "location", message: "Missing location." });

  if (resume.experience.length === 0 && resume.projects.length === 0) {
    warnings.push({ field: "experience", message: "No experience or projects added." });
  }

  for (const exp of resume.experience) {
    if (exp.current) continue;
    if (!exp.endDate) {
      warnings.push({
        field: `experience.${exp.company || "untitled"}`,
        message: "Experience has no end date and is not marked current.",
      });
    }
  }

  const urls: Array<[string, string | undefined]> = [
    ["website", profile.website],
    ["linkedin", profile.linkedin],
    ["github", profile.github],
    ...resume.projects.map((p) => [`project.${p.name || "untitled"}`, p.liveDemo] as [string, string | undefined]),
    ...resume.projects.map((p) => [`project.${p.name || "untitled"}`, p.github] as [string, string | undefined]),
  ];
  for (const [field, url] of urls) {
    if (url && !/^https?:\/\/.+/.test(url)) {
      warnings.push({ field, message: `Broken URL: ${url}` });
    }
  }

  return warnings;
}
