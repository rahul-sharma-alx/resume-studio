"use client";

import { useResumeStore } from "@/features/resume/store";
import { SECTION_IDS, type SectionId } from "@/features/resume/constants";

const SECTION_LABELS: Record<SectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  certificates: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
};

export function VariantSwitcher() {
  const variants = useResumeStore((s) => s.variants);
  const activeVariantId = useResumeStore((s) => s.activeVariantId);
  const active = variants[activeVariantId];
  const setActiveVariant = useResumeStore((s) => s.setActiveVariant);
  const addVariant = useResumeStore((s) => s.addVariant);
  const renameVariant = useResumeStore((s) => s.renameVariant);
  const removeVariant = useResumeStore((s) => s.removeVariant);
  const toggleSection = useResumeStore((s) => s.toggleSection);
  const variantList = Object.values(variants);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="variant">
          Resume
        </label>
        <select
          id="variant"
          value={activeVariantId}
          onChange={(e) => setActiveVariant(e.target.value)}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {variantList.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => addVariant(`Resume ${variantList.length + 1}`)}
          className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          aria-label="Add resume variant"
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          aria-label="Resume name"
          value={active.name}
          onChange={(e) => renameVariant(active.id, e.target.value)}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {variantList.length > 1 ? (
          <button
            type="button"
            onClick={() => removeVariant(active.id)}
            className="rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            aria-label="Delete resume variant"
          >
            ✕
          </button>
        ) : null}
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">Visible sections</legend>
        <div className="flex flex-wrap gap-2">
          {SECTION_IDS.map((section) => {
            const checked = active.visibleSections.includes(section);
            return (
              <label key={section} className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <input type="checkbox" checked={checked} onChange={() => toggleSection(section)} />
                {SECTION_LABELS[section]}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
