"use client";

import { useState } from "react";
import { useResumeStore } from "@/features/resume/store";
import { TEMPLATE_OPTIONS, type TemplateId } from "@/features/resume/constants";
import { ResumeDocument } from "@/features/resume/components/ResumeDocument";
import { ProfileForm } from "@/features/resume/components/ProfileForm";
import { SummaryForm } from "@/features/resume/components/SummaryForm";
import { ExperienceForm } from "@/features/resume/components/ExperienceForm";
import { ProjectsForm } from "@/features/resume/components/ProjectsForm";
import { SkillsForm } from "@/features/resume/components/SkillsForm";
import { EducationForm } from "@/features/resume/components/EducationForm";
import { ExtrasForm } from "@/features/resume/components/ExtrasForm";
import { LinksForm } from "@/features/resume/components/LinksForm";
import { ResumeIO } from "@/features/resume/components/ResumeIO";
import { Collapsible } from "@/features/resume/components/Collapsible";
import { VariantSwitcher } from "@/features/resume/components/VariantSwitcher";
import { TemplateCustomizer } from "@/features/resume/components/TemplateCustomizer";
import { ATSPanel } from "@/features/ats/ATSPanel";
import { extractKeywords } from "@/features/ats/analyze";
import { useKeyboardShortcuts } from "@/features/resume/hooks/useKeyboardShortcuts";
import { SaveStatus } from "@/features/resume/components/SaveStatus";
import { validateExport } from "@/features/resume/validateExport";

export function ResumeEditor() {
  const resume = useResumeStore((s) => s.resume);
  const variants = useResumeStore((s) => s.variants);
  const activeVariantId = useResumeStore((s) => s.activeVariantId);
  const jobDescription = useResumeStore((s) => s.jobDescription);
  const variant = variants[activeVariantId];
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const reset = useResumeStore((s) => s.reset);
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const canUndo = useResumeStore((s) => (s.resumes[s.activeResumeId]?.past.length ?? 0) > 0);
  const canRedo = useResumeStore((s) => (s.resumes[s.activeResumeId]?.future.length ?? 0) > 0);
  const exportWarnings = validateExport(resume);

  const [zoom, setZoom] = useState(1);
  useKeyboardShortcuts();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="no-print flex flex-col gap-4">
        <Collapsible title="Resume">
          <div className="flex flex-col gap-6">
            <ProfileForm />
            <SummaryForm />
            <ExperienceForm />
            <ProjectsForm />
            <SkillsForm />
            <EducationForm />
            <ExtrasForm />
            <LinksForm />
            <ATSPanel />
          </div>
        </Collapsible>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="no-print mb-3 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Undo"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Redo"
            >
              Redo
            </button>
          </div>
          <SaveStatus />
        </div>
        <Collapsible title="Customize template" className="no-print">
          <div className="flex flex-col gap-4">
            <VariantSwitcher />
            <TemplateCustomizer />
          </div>
        </Collapsible>
        <div className="no-print mb-3 mt-4 flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="template">
            Template
          </label>
          <select
            id="template"
            value={variant.template}
            onChange={(e) => setTemplate(e.target.value as TemplateId)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {TEMPLATE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="no-print mb-2 flex items-center justify-end gap-1 text-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
            className="rounded border border-zinc-300 px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="min-w-[3rem] rounded border border-zinc-300 px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))}
            className="rounded border border-zinc-300 px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
        <div className="resume-preview-frame overflow-auto rounded-lg border border-zinc-200 bg-zinc-100 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-800">
          <div
            className="resume-zoom-wrap"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              width: `${100 / zoom}%`,
            }}
          >
            <div className="rounded bg-white p-6 shadow-sm dark:bg-white">
              <ResumeDocument
                resume={resume}
                variant={variant}
                highlightTerms={jobDescription ? extractKeywords(jobDescription) : []}
              />
            </div>
          </div>
        </div>
        <div className="no-print">
          <ResumeIO />
          {exportWarnings.length > 0 ? (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <p className="mb-1 font-semibold">Before you export:</p>
            <ul className="list-disc pl-4">
              {exportWarnings.map((w, i) => (
                <li key={i}>{w.message}</li>
              ))}
            </ul>
          </div>
        ) : null}
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
    </div>
  );
}
