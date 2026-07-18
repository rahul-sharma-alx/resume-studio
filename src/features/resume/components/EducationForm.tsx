"use client";

import { TextField, SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";

export function EducationForm() {
  const education = useResumeStore((s) => s.resume.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  return (
    <SectionCard
      title="Education"
      onAdd={() => addEducation({ institution: "", degree: "", field: "", startDate: "", endDate: "", score: "", location: "" })}
      addLabel="Add Education"
    >
      {education.length === 0 ? (
        <p className="text-sm text-zinc-500">No education entries yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {education.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeEducation(item.id)} className="text-sm text-red-600 hover:underline">
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField label="Institution" value={item.institution} onChange={(e) => updateEducation(item.id, { institution: e.target.value })} />
                <TextField label="Degree" value={item.degree} onChange={(e) => updateEducation(item.id, { degree: e.target.value })} />
                <TextField label="Field" value={item.field ?? ""} onChange={(e) => updateEducation(item.id, { field: e.target.value })} />
                <TextField label="Score" value={item.score ?? ""} onChange={(e) => updateEducation(item.id, { score: e.target.value })} />
                <TextField label="Start" value={item.startDate ?? ""} onChange={(e) => updateEducation(item.id, { startDate: e.target.value })} />
                <TextField label="End" value={item.endDate ?? ""} onChange={(e) => updateEducation(item.id, { endDate: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
