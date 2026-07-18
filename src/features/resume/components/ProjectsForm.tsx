"use client";

import { TextField, TextAreaField, SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import { StringListEditor } from "./StringListEditor";
import { AiImproveButton } from "@/features/ai/AiImproveButton";

export function ProjectsForm() {
  const projects = useResumeStore((s) => s.resume.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  return (
    <SectionCard
      title="Projects"
      collapsible
      onAdd={() =>
        addProject({
          name: "",
          description: "",
          role: "",
          startDate: "",
          endDate: "",
          github: "",
          liveDemo: "",
          technologies: [""],
          achievements: [""],
        })
      }
      addLabel="Add Project"
    >
      {projects.length === 0 ? (
        <p className="text-sm text-zinc-500">No projects yet. Showcase your work.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeProject(item.id)} className="text-sm text-red-600 hover:underline">
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField label="Name" value={item.name} onChange={(e) => updateProject(item.id, { name: e.target.value })} />
                <TextField label="Role" value={item.role ?? ""} onChange={(e) => updateProject(item.id, { role: e.target.value })} />
                <TextField label="GitHub" value={item.github ?? ""} onChange={(e) => updateProject(item.id, { github: e.target.value })} />
                <TextField label="Live Demo" value={item.liveDemo ?? ""} onChange={(e) => updateProject(item.id, { liveDemo: e.target.value })} />
              </div>
              <TextAreaField label="Description" value={item.description} onChange={(e) => updateProject(item.id, { description: e.target.value })} />
              <AiImproveButton text={item.description} onImproved={(text) => updateProject(item.id, { description: text })} />
              <StringListEditor
                label="Technologies"
                items={item.technologies}
                placeholder="Next.js"
                onChange={(technologies) => updateProject(item.id, { technologies })}
              />
              <StringListEditor
                label="Achievements"
                items={item.achievements}
                placeholder="Served 10k users"
                aiLabel="Improve"
                onChange={(achievements) => updateProject(item.id, { achievements })}
              />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
