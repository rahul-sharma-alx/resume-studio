import { describe, it, expect } from "vitest";
import { normalizeImportedResume } from "@/features/resume/io";
import { resumeSchema } from "@/features/resume/validators/resume";

// A representative external export (e.g. the Alxpace shape) with the mismatches
// our importer must tolerate: `personal` not `profile`, "Full-time" casing,
// skills as an object, languages[].language, currentlyWorking, liveUrl.
const external = {
  title: "Backend Software Engineer Resume",
  targetRole: "Backend Software Engineer",
  template: "developer",
  personal: {
    firstName: "Rahul",
    lastName: "Sharma",
    fullName: "Rahul Sharma",
    headline: "Backend Software Engineer",
    email: "rahul@example.com",
    phone: "+91XXXXXXXXXX",
    location: "Noida, India",
    website: "https://alxpace.in",
  },
  summary: "Backend engineer with 2 years experience.",
  experience: [
    {
      company: "Alxpace Pvt. Ltd.",
      position: "Backend Software Engineer",
      employmentType: "Full-time",
      startDate: "2026-01",
      endDate: "Present",
      currentlyWorking: true,
      technologies: ["Laravel", "PHP"],
      achievements: ["Built scalable RESTful APIs."],
    },
  ],
  projects: [
    {
      name: "PaperPilot AI",
      role: "Full Stack Developer",
      description: "AI SaaS platform.",
      liveUrl: "https://paperpilot.online",
      technologies: ["Laravel"],
      achievements: ["Designed multi-tenant architecture."],
    },
  ],
  education: [
    { institution: "Marwadi University", degree: "MCA", fieldOfStudy: "Computer Applications", startYear: 2022, endYear: 2024 },
  ],
  skills: {
    languages: ["PHP", "JavaScript"],
    frameworks: ["Laravel", "React"],
    databases: ["MySQL"],
  },
  certifications: [],
  achievements: [],
  languages: [
    { language: "English", proficiency: "Professional" },
    { language: "Hindi", proficiency: "Native" },
  ],
  socialLinks: [{ platform: "Portfolio", url: "https://alxpace.in" }],
};

describe("normalizeImportedResume", () => {
  it("maps an external shape into a schema-valid resume", () => {
    const { resume, template, title } = normalizeImportedResume(external);
    const result = resumeSchema.safeParse(resume);
    expect(result.success, JSON.stringify(result.success ? "" : result.error.issues, null, 2)).toBe(true);
    expect(template).toBe("developer");
    expect(title).toBe("Backend Software Engineer Resume");
    if (result.success) {
      expect(result.data.profile.fullName).toBe("Rahul Sharma");
      expect(result.data.experience[0].employmentType).toBe("FullTime");
      expect(result.data.experience[0].current).toBe(true);
      expect(result.data.skills[0].category).toBe("Languages");
      expect(result.data.languages[0].name).toBe("English");
      expect(result.data.projects[0].liveDemo).toBe("https://paperpilot.online");
    }
  });
});
