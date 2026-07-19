import { z } from "zod";

export const employmentTypeSchema = z.enum([
  "FullTime",
  "PartTime",
  "Internship",
  "Contract",
  "Freelance",
  "SelfEmployed",
]);

export const skillCategorySchema = z.enum([
  "Languages",
  "Frameworks",
  "Databases",
  "Cloud",
  "DevOps",
  "Testing",
  "Tools",
  "Concepts",
  "SoftSkills",
]);

const urlSchema = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .or(z.literal(""))
  .optional();

const optionalString = z.string().trim().max(200).optional().default("");

// ponytail: profile fields are intentionally lenient here. Required-field
// enforcement happens at the export boundary (validateExport) and via inline
// UI hints — never by blocking input or rejecting a freshly-created resume.
// Empty strings are valid; only format is checked when a value is present.
export const profileSchema = z.object({
  fullName: z.string().trim().max(80).optional().default(""),
  jobTitle: z.string().trim().max(60).optional().default(""),
  email: z.string().trim().email("Invalid email").or(z.literal("")).optional().default(""),
  phone: optionalString,
  location: optionalString,
  website: urlSchema,
  linkedin: urlSchema,
  github: urlSchema,
  summary: z.string().trim().max(600).optional().default(""),
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().trim().min(1, "Company is required"),
  position: z.string().trim().min(1, "Position is required"),
  employmentType: employmentTypeSchema.optional(),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().optional().default(""),
  current: z.boolean().default(false),
  location: optionalString,
  description: z.string().trim().max(400).optional().default(""),
  // Each achievement is one bullet line.
  achievements: z.array(z.string().trim().min(1)).default([]),
  technologies: z.array(z.string().trim().min(1)).default([]),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().trim().min(1, "Description is required"),
  role: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  github: urlSchema,
  liveDemo: urlSchema,
  technologies: z.array(z.string().trim().min(1)).min(1, "Add at least one technology"),
  achievements: z.array(z.string().trim().min(1)).default([]),
});

export const skillGroupSchema = z.object({
  category: skillCategorySchema,
  skills: z.array(z.string().trim().min(1)).default([]),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().trim().min(1, "Institution is required"),
  degree: z.string().trim().min(1, "Degree is required"),
  field: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  score: optionalString,
  location: optionalString,
});

export const linkSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  url: urlSchema,
});

export const resumeSchema = z.object({
  profile: profileSchema,
  summary: z.string().trim().max(600).optional().default(""),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  education: z.array(educationSchema).default([]),
  certificates: z.array(z.string().trim().min(1)).default([]),
  achievements: z.array(z.string().trim().min(1)).default([]),
  languages: z
    .array(z.object({ name: z.string().trim().min(1), proficiency: optionalString }))
    .default([]),
  links: z.array(linkSchema).default([]),
});

export type Link = z.infer<typeof linkSchema>;

export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Resume = z.infer<typeof resumeSchema>;
