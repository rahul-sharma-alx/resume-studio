import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  emptyResume,
  createId,
  STORAGE_KEY,
  defaultVariant,
  SECTION_IDS,
  type TemplateId,
  type Variant,
  type SectionId,
} from "./constants";
import {
  profileSchema,
  experienceSchema,
  projectSchema,
  educationSchema,
  skillGroupSchema,
  resumeSchema,
  type Resume,
  type Profile,
  type Experience,
  type Project,
  type SkillGroup,
  type Education,
} from "./validators/resume";

// ponytail: single validation gate. Every complete entity passes Zod before
// entering the store. Returns the parsed value or null (and logs) on failure.
function tryParse<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: unknown } }, value: unknown): T | null {
  const result = schema.safeParse(value);
  if (result.success) return result.data ?? null;
  console.error("Resume validation failed:", result.error);
  return null;
}

interface ResumeState {
  resume: Resume;
  variants: Record<string, Variant>;
  activeVariantId: string;
  setProfile: (profile: Profile) => void;
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setSkills: (skills: SkillGroup[]) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  setSummary: (summary: string) => void;
  setSectionList: (
    section: "certificates" | "achievements" | "languages",
    value: Resume["certificates"] | Resume["achievements"] | Resume["languages"],
  ) => void;
  // Variant actions
  addVariant: (name: string) => void;
  renameVariant: (id: string, name: string) => void;
  removeVariant: (id: string) => void;
  setActiveVariant: (id: string) => void;
  setTemplate: (template: TemplateId) => void;
  toggleSection: (section: SectionId) => void;
  importResume: (data: unknown) => boolean;
  reset: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => {
      const initialVariant = defaultVariant("Default");
      return {
      resume: emptyResume(),
      variants: { [initialVariant.id]: initialVariant },
      activeVariantId: initialVariant.id,
      setProfile: (profile) => {
        const parsed = tryParse(profileSchema, profile);
        if (!parsed) return;
        set((state) => ({ resume: { ...state.resume, profile: parsed } }));
      },
      addExperience: (experience) => {
        const parsed = tryParse(experienceSchema, { ...experience, id: createId() });
        if (!parsed) return;
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [...state.resume.experience, parsed],
          },
        }));
      },
      updateExperience: (id, experience) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((item) =>
              item.id === id ? { ...item, ...experience } : item,
            ),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((item) => item.id !== id),
          },
        })),
      addProject: (project) => {
        const parsed = tryParse(projectSchema, { ...project, id: createId() });
        if (!parsed) return;
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [...state.resume.projects, parsed],
          },
        }));
      },
      updateProject: (id, project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((item) =>
              item.id === id ? { ...item, ...project } : item,
            ),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((item) => item.id !== id),
          },
        })),
      setSkills: (skills) => {
        const parsed = skills.map((g) => tryParse(skillGroupSchema, g)).filter(Boolean) as SkillGroup[];
        set((state) => ({ resume: { ...state.resume, skills: parsed } }));
      },
      addEducation: (education) => {
        const parsed = tryParse(educationSchema, { ...education, id: createId() });
        if (!parsed) return;
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, parsed],
          },
        }));
      },
      updateEducation: (id, education) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((item) =>
              item.id === id ? { ...item, ...education } : item,
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((item) => item.id !== id),
          },
        })),
      setSummary: (summary) =>
        set((state) => ({ resume: { ...state.resume, summary } })),
      setSectionList: (section, value) =>
        set((state) => ({ resume: { ...state.resume, [section]: value } })),
      setTemplate: (template) =>
        set((state) => ({
          variants: {
            ...state.variants,
            [state.activeVariantId]: {
              ...state.variants[state.activeVariantId],
              template,
            },
          },
        })),
      addVariant: (name) =>
        set((state) => {
          const variant = defaultVariant(name || "Untitled");
          return {
            variants: { ...state.variants, [variant.id]: variant },
            activeVariantId: variant.id,
          };
        }),
      renameVariant: (id, name) =>
        set((state) =>
          state.variants[id]
            ? { variants: { ...state.variants, [id]: { ...state.variants[id], name } } }
            : state,
        ),
      removeVariant: (id) =>
        set((state) => {
          if (Object.keys(state.variants).length <= 1) return state;
          const variants = { ...state.variants };
          delete variants[id];
          const activeVariantId =
            state.activeVariantId === id ? Object.keys(variants)[0] : state.activeVariantId;
          return { variants, activeVariantId };
        }),
      setActiveVariant: (id) =>
        set((state) => (state.variants[id] ? { activeVariantId: id } : state)),
      toggleSection: (section) =>
        set((state) => {
          const variant = state.variants[state.activeVariantId];
          const visible = variant.visibleSections.includes(section)
            ? variant.visibleSections.filter((s) => s !== section)
            : [...SECTION_IDS.filter((s) => variant.visibleSections.includes(s) || s === section)];
          return {
            variants: {
              ...state.variants,
              [state.activeVariantId]: { ...variant, visibleSections: visible },
            },
          };
        }),
      importResume: (data) => {
        const parsed = tryParse(resumeSchema, data);
        if (!parsed) return false;
        set({ resume: parsed });
        return true;
      },
      reset: () => {
        const variant = defaultVariant("Default");
        set({ resume: emptyResume(), variants: { [variant.id]: variant }, activeVariantId: variant.id });
      },
      };
    },
    {
      name: STORAGE_KEY,
      // ponytail: only persist data, never UI-only flags.
      partialize: (state) => ({
        resume: state.resume,
        variants: state.variants,
        activeVariantId: state.activeVariantId,
      }),
      // Never trust browser storage: re-validate the full resume on load.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const parsed = tryParse(resumeSchema, state.resume);
        if (parsed) state.resume = parsed;
      },
    },
  ),
);
