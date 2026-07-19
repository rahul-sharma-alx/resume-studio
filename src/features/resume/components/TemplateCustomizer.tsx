"use client";

import { useResumeStore } from "@/features/resume/store";
import { FONT_OPTIONS } from "@/features/resume/constants";

const ACCENTS = ["#1f2937", "#2563eb", "#059669", "#7c3aed", "#dc2626", "#0891b2", "#b45309"];

export function TemplateCustomizer() {
  const variants = useResumeStore((s) => s.variants);
  const activeVariantId = useResumeStore((s) => s.activeVariantId);
  const setVariantStyle = useResumeStore((s) => s.setVariantStyle);
  const toggleSection = useResumeStore((s) => s.toggleSection);
  const variant = variants[activeVariantId];

  if (!variant) return null;
  const style = (patch: Parameters<typeof setVariantStyle>[1]) => setVariantStyle(activeVariantId, patch);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">Customize template</span>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500">Accent</span>
        <div className="flex gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => style({ accent: c })}
              aria-label={`Accent ${c}`}
              className={`h-6 w-6 rounded-full border ${
                variant.accent.toLowerCase() === c.toLowerCase() ? "ring-2 ring-offset-1 ring-zinc-500" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={variant.accent}
            onChange={(e) => style({ accent: e.target.value })}
            className="h-6 w-8 cursor-pointer rounded border"
            aria-label="Custom accent color"
          />
        </div>
      </div>

      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500">Font</span>
        <select
          value={variant.font}
          onChange={(e) => style({ font: e.target.value as typeof variant.font })}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500">Size</span>
        <select
          value={variant.fontSize}
          onChange={(e) => style({ fontSize: Number(e.target.value) })}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {[10, 11, 12].map((s) => (
            <option key={s} value={s}>
              {s}pt
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500">Spacing</span>
        <select
          value={variant.spacing}
          onChange={(e) => style({ spacing: e.target.value as typeof variant.spacing })}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </label>

      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500">Header</span>
        <select
          value={variant.headerAlign}
          onChange={(e) => style({ headerAlign: e.target.value as typeof variant.headerAlign })}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
        </select>
      </label>

      <details className="text-xs">
        <summary className="cursor-pointer text-zinc-500">Sections</summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["summary", "experience", "projects", "skills", "education", "certificates", "achievements", "languages", "links"] as const).map(
            (s) => (
              <label key={s} className="flex items-center gap-1 capitalize">
                <input
                  type="checkbox"
                  checked={variant.visibleSections.includes(s)}
                  onChange={() => toggleSection(s)}
                />
                {s}
              </label>
            ),
          )}
        </div>
      </details>
    </div>
  );
}
