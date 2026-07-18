"use client";

import { SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import { skillCategorySchema, type SkillCategory } from "@/features/resume/validators/resume";
import { StringListEditor } from "./StringListEditor";

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills);
  const setSkills = useResumeStore((s) => s.setSkills);

  const ensureGroup = (category: SkillCategory) => {
    if (skills.some((g) => g.category === category)) return skills;
    return [...skills, { category, skills: [] }];
  };

  const updateGroup = (category: string, values: string[]) => {
    setSkills(
      ensureGroup(category as SkillCategory).map((g) =>
        g.category === category ? { ...g, skills: values } : g,
      ),
    );
  };

  return (
    <SectionCard title="Skills">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {skillCategorySchema.options.map((category) => {
          const group = skills.find((g) => g.category === category);
          return (
            <StringListEditor
              key={category}
              label={category}
              items={group?.skills ?? []}
              placeholder="Skill"
              onChange={(values) => updateGroup(category, values)}
            />
          );
        })}
      </div>
    </SectionCard>
  );
}
