import { describe, it, expect } from "vitest";
import { parseResumeText } from "@/features/resume/parseResumeText";
import { profileFieldErrors } from "@/features/resume/validators/profileErrors";

describe("parseResumeText", () => {
  it("extracts contact info from pasted text", () => {
    const text = `Jane Doe
Software Engineer
jane@example.com | (555) 123-4567 | https://jane.dev
Experience
Acme Corp - Senior Engineer
- Shipped feature X
Education
BS Computer Science
Skills
TypeScript React`;
    const parsed = parseResumeText(text);
    const p = parsed.profile as Record<string, string>;
    expect(p.fullName).toBe("Jane Doe");
    expect(p.email).toBe("jane@example.com");
    expect(p.phone).toContain("123-4567");
    expect(p.website).toBe("https://jane.dev");
    expect((parsed.experience as unknown[]).length).toBe(1);
    expect(Array.isArray(parsed.skills)).toBe(true);
  });

  it("never throws on empty input", () => {
    expect(() => parseResumeText("")).not.toThrow();
  });
});

describe("profileFieldErrors", () => {
  it("flags malformed email and urls but not valid ones", () => {
    const errors = profileFieldErrors({
      fullName: "A",
      jobTitle: "B",
      email: "not-an-email",
      phone: "",
      location: "",
      website: "ftp://x",
      linkedin: "",
      github: "",
      summary: "",
    });
    expect(errors.email).toBeTruthy();
    expect(errors.website).toBeTruthy();
    expect(errors.linkedin).toBeUndefined();
  });
});
