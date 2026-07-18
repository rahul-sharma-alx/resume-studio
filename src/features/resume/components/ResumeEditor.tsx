"use client";

import { useResumeStore } from "@/features/resume/store";
import { TEMPLATE_OPTIONS } from "@/features/resume/constants";
import { ResumeDocument } from "@/features/resume/components/ResumeDocument";
import { ProfileForm } from "@/features/resume/components/ProfileForm";
import { SummaryForm } from "@/features/resume/components/SummaryForm";
import { ExperienceForm } from "@/features/resume/components/ExperienceForm";
import { ProjectsForm } from "@/features/resume/components/ProjectsForm";
import { SkillsForm } from "@/features/resume/components/SkillsForm";
import { EducationForm } from "@/features/resume/components/EducationForm";
import { ExtrasForm } from "@/features/resume/components/ExtrasForm";
import { ResumeIO } from "@/features/resume/components/ResumeIO";
import { VariantSwitcher } from "@/features/resume/components/VariantSwitcher";
import { ATSPanel } from "@/features/ats/ATSPanel";

export function ResumeEditor() {
  const resume = useResumeStore((s) => s.resume);
  const variants = useResumeStore((s) => s.variants);
  const activeVariantId = useResumeStore((s) => s.activeVariantId);
  const template = variants[activeVariantId].template;
  const visibleSections = variants[activeVariantId].visibleSections;
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const reset = useResumeStore((s) => s.reset);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <ProfileForm />
        <SummaryForm />
        <ExperienceForm />
        <ProjectsForm />
        <SkillsForm />
        <EducationForm />
        <ExtrasForm />
        <ATSPanel />
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <VariantSwitcher />
        <div className="mb-3 mt-4 flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="template">
            Template
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value as typeof template)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {TEMPLATE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-auto rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-white">
          <ResumeDocument resume={resume} template={template} visibleSections={visibleSections} />
        </div>
        <ResumeIO />
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-3 w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all resume data? This cannot be undone.")) reset();
          }}
          className="mt-2 w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Clear resume
        </button>
      </div>
    </div>
  );
}
