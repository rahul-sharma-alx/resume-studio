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
  jobDescription: string;
  past: Resume[];
  future: Resume[];
  lastSavedAt: number;
  setJobDescription: (text: string) => void;
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
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

// ponytail: history cap prevents unbounded memory growth.
const HISTORY_LIMIT = 50;

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => {
      const initialVariant = defaultVariant("Default");
      // Records the current resume onto the undo stack, then applies `next`.
      const commit = (next: (resume: Resume) => Resume) =>
        set((state) => {
          const past = [...state.past, state.resume].slice(-HISTORY_LIMIT);
          return { resume: next(state.resume), past, future: [], lastSavedAt: Date.now() };
        });
      return {
      resume: emptyResume(),
      variants: { [initialVariant.id]: initialVariant },
      activeVariantId: initialVariant.id,
      jobDescription: "",
      past: [],
      lastSavedAt: Date.now(),
      future: [],
      setJobDescription: (text) => set({ jobDescription: text }),
      setProfile: (profile) => {
        const parsed = tryParse(profileSchema, profile);
        if (!parsed) return;
        commit((resume) => ({ ...resume, profile: parsed }));
      },
      addExperience: (experience) => {
        const parsed = tryParse(experienceSchema, { ...experience, id: createId() });
        if (!parsed) return;
        commit((resume) => ({ ...resume, experience: [...resume.experience, parsed] }));
      },
      updateExperience: (id, experience) =>
        commit((resume) => ({
          ...resume,
          experience: resume.experience.map((item) =>
            item.id === id ? { ...item, ...experience } : item,
          ),
        })),
      removeExperience: (id) =>
        commit((resume) => ({
          ...resume,
          experience: resume.experience.filter((item) => item.id !== id),
        })),
      addProject: (project) => {
        const parsed = tryParse(projectSchema, { ...project, id: createId() });
        if (!parsed) return;
        commit((resume) => ({ ...resume, projects: [...resume.projects, parsed] }));
      },
      updateProject: (id, project) =>
        commit((resume) => ({
          ...resume,
          projects: resume.projects.map((item) =>
            item.id === id ? { ...item, ...project } : item,
          ),
        })),
      removeProject: (id) =>
        commit((resume) => ({
          ...resume,
          projects: resume.projects.filter((item) => item.id !== id),
        })),
      setSkills: (skills) => {
        const parsed = skills.map((g) => tryParse(skillGroupSchema, g)).filter(Boolean) as SkillGroup[];
        commit((resume) => ({ ...resume, skills: parsed }));
      },
      addEducation: (education) => {
        const parsed = tryParse(educationSchema, { ...education, id: createId() });
        if (!parsed) return;
        commit((resume) => ({ ...resume, education: [...resume.education, parsed] }));
      },
      updateEducation: (id, education) =>
        commit((resume) => ({
          ...resume,
          education: resume.education.map((item) =>
            item.id === id ? { ...item, ...education } : item,
          ),
        })),
      removeEducation: (id) =>
        commit((resume) => ({
          ...resume,
          education: resume.education.filter((item) => item.id !== id),
        })),
      setSummary: (summary) => commit((resume) => ({ ...resume, summary })),
      setSectionList: (section, value) =>
        commit((resume) => ({ ...resume, [section]: value })),
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
        commit(() => parsed);
        return true;
      },
      undo: () =>
        set((state) => {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          return {
            resume: previous,
            past: state.past.slice(0, -1),
            future: [state.resume, ...state.future].slice(0, HISTORY_LIMIT),
          };
        }),
      redo: () =>
        set((state) => {
          if (state.future.length === 0) return state;
          const nextResume = state.future[0];
          return {
            resume: nextResume,
            past: [...state.past, state.resume].slice(-HISTORY_LIMIT),
            future: state.future.slice(1),
          };
        }),
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
        jobDescription: state.jobDescription,
        lastSavedAt: state.lastSavedAt,
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
