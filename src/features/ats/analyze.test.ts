import { describe, it, expect } from "vitest";
import { analyzeResume, tokenize, extractKeywords } from "@/features/ats/analyze";
import { emptyResume } from "@/features/resume/constants";
import { resumeSchema } from "@/features/resume/validators/resume";
import type { Resume } from "@/features/resume/validators/resume";

function fullResume(): Resume {
  return {
    profile: {
      fullName: "Jane Doe",
      jobTitle: "Software Engineer",
      email: "jane@example.com",
      phone: "5551234567",
      location: "Berlin",
      website: "",
      linkedin: "",
      github: "",
      summary: "Backend engineer with 5 years building APIs.",
    },
    summary: "Backend engineer with 5 years building APIs.",
    experience: [
      {
        id: "1",
        company: "Acme",
        position: "Engineer",
        employmentType: "FullTime",
        startDate: "2020",
        endDate: "",
        current: true,
        location: "Berlin",
        description: "Built services.",
        achievements: [
          "Built a service handling 1M requests",
          "Reduced latency by 30%",
        ],
        technologies: ["Go", "Postgres"],
      },
    ],
    projects: [],
    skills: [{ category: "Languages", skills: ["Go", "Python"] }],
    education: [
      { id: "e1", institution: "TU", degree: "BSc", field: "CS", startDate: "2015", endDate: "2019", score: "", location: "" },
    ],
    certificates: [],
    achievements: ["Won hackathon 2022"],
    languages: [{ name: "English", proficiency: "Native" }],
    links: [],
  };
}

describe("analyzeResume", () => {
  it("accepts a fresh empty resume through the schema (rehydrate-safe)", () => {
    const result = resumeSchema.safeParse(emptyResume());
    expect(result.success).toBe(true);
  });

  it("parses a legacy persisted resume missing the links field", () => {
    const legacy = {
      ...emptyResume(),
      // old shape had no `links`
      profile: { fullName: "", jobTitle: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", summary: "" },
    };
    const result = resumeSchema.safeParse(legacy);
    expect(result.success).toBe(true);
    if (result.success) expect(Array.isArray(result.data.links)).toBe(true);
  });

  it("returns a low score for an empty resume", () => {
    const report = analyzeResume(emptyResume());
    expect(report.overall).toBeLessThanOrEqual(100);
    expect(report.categories.length).toBeGreaterThan(0);
    const contact = report.categories.find((c) => c.id === "contact");
    expect(contact?.score).toBeLessThan(100);
  });

  it("scores a complete resume higher than an empty one", () => {
    const empty = analyzeResume(emptyResume()).overall;
    const full = analyzeResume(fullResume()).overall;
    expect(full).toBeGreaterThan(empty);
  });

  it("detects missing keywords from a job description", () => {
    const jd = "We need a Rust and Kubernetes expert with strong communication.";
    const report = analyzeResume(fullResume(), { jobDescription: jd });
    const kw = report.categories.find((c) => c.id === "keywords");
    expect(kw?.missingKeywords).toContain("rust");
    expect(kw?.missingKeywords).toContain("kubernetes");
    // already-present skills should not be missing
    expect(kw?.missingKeywords).not.toContain("go");
  });
});

describe("tokenize / extractKeywords", () => {
  it("lowercases and strips punctuation", () => {
    expect(tokenize("Hello, World! Go/Python")).toEqual(
      expect.arrayContaining(["hello", "world", "go", "python"]),
    );
  });
  it("drops short tokens", () => {
    expect(extractKeywords("a an the Go")).not.toContain("a");
  });
});
