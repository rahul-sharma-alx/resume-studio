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

// One saved resume ("document"). The app holds many; the editor always works
// on the active one. Mirror fields at the top of ResumeState keep the existing
// form components unchanged.
export interface ResumeDoc {
  id: string;
  title: string;
  targetRole: string;
  createdAt: number;
  updatedAt: number;
  resume: Resume;
  variants: Record<string, Variant>;
  activeVariantId: string;
  jobDescription: string;
  past: Resume[];
  future: Resume[];
}

interface ResumeState {
  // Mirror of the active doc (kept in sync by every mutation).
  resume: Resume;
  variants: Record<string, Variant>;
  activeVariantId: string;
  jobDescription: string;
  // Multi-resume store.
  resumes: Record<string, ResumeDoc>;
  activeResumeId: string;
  lastSavedAt: number;
  // Resume-document CRUD
  createResume: (title?: string) => string;
  duplicateResume: (id: string) => string;
  deleteResume: (id: string) => void;
  renameResume: (id: string, title: string) => void;
  setTargetRole: (id: string, role: string) => void;
  setActiveResume: (id: string) => void;
  // Content actions (operate on the active doc)
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
    section: "certificates" | "achievements" | "languages" | "links",
    value: Resume["certificates"] | Resume["achievements"] | Resume["languages"] | Resume["links"],
  ) => void;
  // Variant actions
  addVariant: (name: string) => void;
  renameVariant: (id: string, name: string) => void;
  removeVariant: (id: string) => void;
  setActiveVariant: (id: string) => void;
  setTemplate: (template: TemplateId) => void;
  setVariantStyle: (id: string, patch: Partial<Pick<Variant, "accent" | "font" | "fontSize" | "spacing" | "headerAlign">>) => void;
  toggleSection: (section: SectionId) => void;
  importResume: (data: unknown) => boolean;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const HISTORY_LIMIT = 50;

function newDoc(title: string, template: TemplateId = "minimal"): ResumeDoc {
  const now = Date.now();
  const variant = defaultVariant("Default", template);
  return {
    id: createId(),
    title: title || "Untitled Resume",
    targetRole: "",
    createdAt: now,
    updatedAt: now,
    resume: emptyResume(),
    variants: { [variant.id]: variant },
    activeVariantId: variant.id,
    jobDescription: "",
    past: [],
    future: [],
  };
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => {
      // Builds a doc from the current mirror + provided overrides.
      const mirrorToDoc = (state: ResumeState, overrides: Partial<ResumeDoc> = {}): ResumeDoc => {
        const current = state.resumes[state.activeResumeId];
        return {
          id: state.activeResumeId,
          title: current?.title ?? "Untitled Resume",
          targetRole: current?.targetRole ?? "",
          createdAt: current?.createdAt ?? Date.now(),
          updatedAt: Date.now(),
          resume: state.resume,
          variants: state.variants,
          activeVariantId: state.activeVariantId,
          jobDescription: state.jobDescription,
          past: current?.past ?? [],
          future: current?.future ?? [],
          ...overrides,
        };
      };

      // Applies a resume mutation to the active doc, keeps the mirror in sync.
      const commit = (next: (resume: Resume) => Resume) =>
        set((state) => {
          const resume = next(state.resume);
          const past = [...(state.resumes[state.activeResumeId]?.past ?? []), state.resume].slice(-HISTORY_LIMIT);
          const doc = mirrorToDoc(state, { resume, updatedAt: Date.now(), past });
          return {
            resume,
            resumes: { ...state.resumes, [state.activeResumeId]: doc },
            lastSavedAt: Date.now(),
          };
        });

      const initialDoc = newDoc("Untitled Resume");
      return {
        resume: initialDoc.resume,
        variants: initialDoc.variants,
        activeVariantId: initialDoc.activeVariantId,
        jobDescription: initialDoc.jobDescription,
        resumes: { [initialDoc.id]: initialDoc },
        activeResumeId: initialDoc.id,
        lastSavedAt: Date.now(),

        createResume: (title) => {
          const doc = newDoc(title ?? "Untitled Resume");
          set((state) => ({
            resumes: { ...state.resumes, [doc.id]: doc },
            activeResumeId: doc.id,
            resume: doc.resume,
            variants: doc.variants,
            activeVariantId: doc.activeVariantId,
            jobDescription: doc.jobDescription,
            lastSavedAt: Date.now(),
          }));
          return doc.id;
        },
        duplicateResume: (id) => {
          const src = useResumeStore.getState().resumes[id];
          if (!src) return id;
          const copy: ResumeDoc = {
            ...src,
            id: createId(),
            title: `${src.title} (copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            resume: structuredClone(src.resume),
            variants: structuredClone(src.variants),
            past: [],
            future: [],
          };
          set((state) => ({
            resumes: { ...state.resumes, [copy.id]: copy },
            activeResumeId: copy.id,
            resume: copy.resume,
            variants: copy.variants,
            activeVariantId: copy.activeVariantId,
            jobDescription: copy.jobDescription,
            lastSavedAt: Date.now(),
          }));
          return copy.id;
        },
        deleteResume: (id) =>
          set((state) => {
            if (Object.keys(state.resumes).length <= 1) return state;
            const resumes = { ...state.resumes };
            delete resumes[id];
            const remaining = Object.keys(resumes);
            const activeResumeId = state.activeResumeId === id ? remaining[0] : state.activeResumeId;
            const doc = resumes[activeResumeId];
            return {
              resumes,
              activeResumeId,
              resume: doc.resume,
              variants: doc.variants,
              activeVariantId: doc.activeVariantId,
              jobDescription: doc.jobDescription,
            };
          }),
        renameResume: (id, title) =>
          set((state) => {
            const doc = state.resumes[id];
            if (!doc) return state;
            return {
              resumes: { ...state.resumes, [id]: { ...doc, title, updatedAt: Date.now() } },
            };
          }),
        setTargetRole: (id, role) =>
          set((state) => {
            const doc = state.resumes[id];
            if (!doc) return state;
            return {
              resumes: { ...state.resumes, [id]: { ...doc, targetRole: role, updatedAt: Date.now() } },
            };
          }),
        setActiveResume: (id) =>
          set((state) => {
            const doc = state.resumes[id];
            if (!doc || id === state.activeResumeId) return state;
            return {
              activeResumeId: id,
              resume: doc.resume,
              variants: doc.variants,
              activeVariantId: doc.activeVariantId,
              jobDescription: doc.jobDescription,
              lastSavedAt: Date.now(),
            };
          }),

        setJobDescription: (text) =>
          set((state) => {
            const doc = { ...state.resumes[state.activeResumeId], jobDescription: text, updatedAt: Date.now() };
            return {
              jobDescription: text,
              resumes: { ...state.resumes, [state.activeResumeId]: doc },
            };
          }),
        // ponytail: live profile edits must not be blocked by strict schema —
        // the user is mid-typing (email may be empty). Strict validation lives
        // at the import/export trust boundaries (resumeSchema via importResume).
        setProfile: (profile) => commit((resume) => ({ ...resume, profile })),
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
          set((state) => {
            const variant = state.variants[state.activeVariantId];
            const variants = {
              ...state.variants,
              [state.activeVariantId]: { ...variant, template },
            };
            const doc = { ...state.resumes[state.activeResumeId], variants, updatedAt: Date.now() };
            return { variants, resumes: { ...state.resumes, [state.activeResumeId]: doc } };
          }),
        setVariantStyle: (id, patch) =>
          set((state) => {
            const variant = state.variants[id];
            if (!variant) return state;
            const variants = { ...state.variants, [id]: { ...variant, ...patch } };
            const doc = { ...state.resumes[state.activeResumeId], variants, updatedAt: Date.now() };
            return { variants, resumes: { ...state.resumes, [state.activeResumeId]: doc } };
          }),
        addVariant: (name) =>
          set((state) => {
            const variant = defaultVariant(name || "Untitled");
            const variants = { ...state.variants, [variant.id]: variant };
            const doc = { ...state.resumes[state.activeResumeId], variants, activeVariantId: variant.id, updatedAt: Date.now() };
            return {
              variants,
              activeVariantId: variant.id,
              resumes: { ...state.resumes, [state.activeResumeId]: doc },
            };
          }),
        renameVariant: (id, name) =>
          set((state) => {
            const variant = state.variants[id];
            if (!variant) return state;
            const variants = { ...state.variants, [id]: { ...variant, name } };
            const doc = { ...state.resumes[state.activeResumeId], variants };
            return { variants, resumes: { ...state.resumes, [state.activeResumeId]: doc } };
          }),
        removeVariant: (id) =>
          set((state) => {
            if (Object.keys(state.variants).length <= 1) return state;
            const variants = { ...state.variants };
            delete variants[id];
            const activeVariantId =
              state.activeVariantId === id ? Object.keys(variants)[0] : state.activeVariantId;
            const doc = { ...state.resumes[state.activeResumeId], variants, activeVariantId };
            return { variants, activeVariantId, resumes: { ...state.resumes, [state.activeResumeId]: doc } };
          }),
        setActiveVariant: (id) =>
          set((state) => {
            if (!state.variants[id]) return state;
            const doc = { ...state.resumes[state.activeResumeId], activeVariantId: id, updatedAt: Date.now() };
            return { activeVariantId: id, resumes: { ...state.resumes, [state.activeResumeId]: doc } };
          }),
        toggleSection: (section) =>
          set((state) => {
            const variant = state.variants[state.activeVariantId];
            const visible = variant.visibleSections.includes(section)
              ? variant.visibleSections.filter((s) => s !== section)
              : [...SECTION_IDS.filter((s) => variant.visibleSections.includes(s) || s === section)];
            const variants = { ...state.variants, [state.activeVariantId]: { ...variant, visibleSections: visible } };
            const doc = { ...state.resumes[state.activeResumeId], variants, updatedAt: Date.now() };
            return { variants, resumes: { ...state.resumes, [state.activeResumeId]: doc } };
          }),
        importResume: (data) => {
          const parsed = tryParse(resumeSchema, data);
          if (!parsed) return false;
          commit(() => parsed);
          return true;
        },
        undo: () =>
          set((state) => {
            const doc = state.resumes[state.activeResumeId];
            const past = doc?.past ?? [];
            if (past.length === 0) return state;
            const previous = past[past.length - 1];
            const future = [state.resume, ...(doc?.future ?? [])].slice(0, HISTORY_LIMIT);
            const updatedDoc = { ...doc, resume: previous, past: past.slice(0, -1), future, updatedAt: Date.now() };
            return {
              resume: previous,
              resumes: { ...state.resumes, [state.activeResumeId]: updatedDoc },
              lastSavedAt: Date.now(),
            };
          }),
        redo: () =>
          set((state) => {
            const doc = state.resumes[state.activeResumeId];
            const future = doc?.future ?? [];
            if (future.length === 0) return state;
            const nextResume = future[0];
            const past = [state.resume, ...(doc?.past ?? [])].slice(-HISTORY_LIMIT);
            const updatedDoc = { ...doc, resume: nextResume, past, future: future.slice(1), updatedAt: Date.now() };
            return {
              resume: nextResume,
              resumes: { ...state.resumes, [state.activeResumeId]: updatedDoc },
              lastSavedAt: Date.now(),
            };
          }),
        reset: () => {
          const variant = defaultVariant("Default");
          set((state) => {
            const past = [...(state.resumes[state.activeResumeId]?.past ?? []), state.resume].slice(-HISTORY_LIMIT);
            const doc: ResumeDoc = {
              ...(state.resumes[state.activeResumeId] as ResumeDoc),
              resume: emptyResume(),
              variants: { [variant.id]: variant },
              activeVariantId: variant.id,
              past,
              future: [],
              updatedAt: Date.now(),
            };
            return {
              resume: doc.resume,
              variants: doc.variants,
              activeVariantId: doc.activeVariantId,
              resumes: { ...state.resumes, [state.activeResumeId]: doc },
              lastSavedAt: Date.now(),
            };
          });
        },
      };
    },
    {
      name: STORAGE_KEY,
      // ponytail: only persist data, never UI-only flags.
      partialize: (state) => ({
        resumes: state.resumes,
        activeResumeId: state.activeResumeId,
        lastSavedAt: state.lastSavedAt,
      }),
      // Never trust browser storage: re-validate the full resume on load,
      // backfill any fields added since the data was saved, and rebuild the
      // active-doc mirror. Corrupt/unmigrated data falls back to a clean
      // resume rather than breaking the app (ponytail: tolerant rehydrate).
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const base = emptyResume();
        const merged: Record<string, ResumeDoc> = {};
        for (const [id, doc] of Object.entries(state.resumes ?? {})) {
          const rawResume = (doc?.resume ?? base) as Partial<Resume>;
          const safeResume = tryParse(resumeSchema, {
            ...base,
            ...rawResume,
            profile: { ...base.profile, ...(rawResume.profile ?? {}) },
            links: rawResume.links ?? [],
          });
          const variant = doc?.variants?.[doc.activeVariantId] ?? doc?.variants?.[Object.keys(doc.variants ?? {})[0]];
          merged[id] = {
            id,
            title: doc?.title ?? "Untitled Resume",
            targetRole: doc?.targetRole ?? "",
            createdAt: doc?.createdAt ?? Date.now(),
            updatedAt: doc?.updatedAt ?? Date.now(),
            resume: safeResume ?? base,
            variants: doc?.variants ?? { [variant?.id ?? "default"]: variant ?? defaultVariant("Default") },
            activeVariantId: doc?.activeVariantId ?? Object.keys(doc?.variants ?? {})[0] ?? "default",
            jobDescription: doc?.jobDescription ?? "",
            past: doc?.past ?? [],
            future: doc?.future ?? [],
          };
        }
        const activeId = state.activeResumeId && merged[state.activeResumeId] ? state.activeResumeId : Object.keys(merged)[0];
        if (!activeId) return;
        const active = merged[activeId];
        state.resumes = merged;
        state.activeResumeId = activeId;
        state.resume = active.resume;
        state.variants = active.variants;
        state.activeVariantId = active.activeVariantId;
        state.jobDescription = active.jobDescription;
        state.lastSavedAt = state.lastSavedAt ?? Date.now();
      },
    },
  ),
);
