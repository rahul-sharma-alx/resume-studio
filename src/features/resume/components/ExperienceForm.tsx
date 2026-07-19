"use client";

import { TextField, TextAreaField, SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import type { Experience } from "@/features/resume/validators/resume";
import { employmentTypeSchema } from "@/features/resume/validators/resume";
import { StringListEditor } from "./StringListEditor";
import { AiImproveButton } from "@/features/ai/AiImproveButton";

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resume.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  return (
    <SectionCard
      title="Experience"
      collapsible
      onAdd={() =>
        addExperience({
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: [""],
          technologies: [""],
        })
      }
      addLabel="Add Experience"
    >
      {experience.length === 0 ? (
        <p className="text-sm text-zinc-500">No experience yet. Add your work history.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {experience.map((item) => (
            <ExperienceItem
              key={item.id}
              item={item}
              onChange={(patch) => updateExperience(item.id, patch)}
              onRemove={() => removeExperience(item.id)}
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function ExperienceItem({
  item,
  onChange,
  onRemove,
}: {
  item: Experience;
  onChange: (patch: Partial<Experience>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Company" value={item.company} onChange={(e) => onChange({ company: e.target.value })} />
        <TextField label="Position" value={item.position} onChange={(e) => onChange({ position: e.target.value })} />
        <div className="flex flex-col gap-1">
          <label htmlFor={`emp-${item.id}`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Employment Type</label>
          <select
            id={`emp-${item.id}`}
            value={item.employmentType ?? ""}
            onChange={(e) => onChange({ employmentType: (e.target.value || undefined) as Experience["employmentType"] })}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">—</option>
            {employmentTypeSchema.options.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <TextField label="Start Date" placeholder="Jan 2023" value={item.startDate} onChange={(e) => onChange({ startDate: e.target.value })} />
        <TextField
          label="End Date"
          placeholder="Present"
          value={item.endDate ?? ""}
          disabled={item.current}
          onChange={(e) => onChange({ endDate: e.target.value })}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={item.current}
          onChange={(e) => onChange({ current: e.target.checked })}
        />
        I currently work here
      </label>
      <TextAreaField label="Description" value={item.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} />
      <AiImproveButton text={item.description ?? ""} onImproved={(text) => onChange({ description: text })} />
      <StringListEditor
        label="Achievements"
        items={item.achievements}
        placeholder="Reduced API latency by 35%"
        aiLabel="Improve"
        onChange={(achievements) => onChange({ achievements })}
      />
      <StringListEditor
        label="Technologies"
        items={item.technologies}
        placeholder="React"
        onChange={(technologies) => onChange({ technologies })}
      />
    </div>
  );
}
