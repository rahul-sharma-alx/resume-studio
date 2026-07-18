import type { Resume } from "@/features/resume/validators/resume";

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
