"use client";

import { SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import type { Link } from "@/features/resume/validators/resume";

export function LinksForm() {
  const links = useResumeStore((s) => s.resume.links ?? []);
  const setSectionList = useResumeStore((s) => s.setSectionList);

  const update = (index: number, patch: Partial<Link>) => {
    const next = links.map((l, i) => (i === index ? { ...l, ...patch } : l));
    setSectionList("links", next);
  };
  const add = () => setSectionList("links", [...links, { label: "", url: "" }]);
  const remove = (index: number) => setSectionList("links", links.filter((_, i) => i !== index));

  return (
    <SectionCard title="Links" collapsible>
      <div className="flex flex-col gap-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={link.label}
              placeholder="Portfolio"
              onChange={(e) => update(index, { label: e.target.value })}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              aria-label="Link label"
            />
            <input
              value={link.url ?? ""}
              placeholder="https://…"
              onChange={(e) => update(index, { url: e.target.value })}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              aria-label="Link URL"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              aria-label="Remove link"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="self-start rounded-md px-2 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          + Add link
        </button>
      </div>
    </SectionCard>
  );
}
