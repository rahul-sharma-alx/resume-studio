"use client";

import { SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import { StringListEditor } from "./StringListEditor";

export function ExtrasForm() {
  const certificates = useResumeStore((s) => s.resume.certificates);
  const achievements = useResumeStore((s) => s.resume.achievements);
  const languages = useResumeStore((s) => s.resume.languages);
  const setSectionList = useResumeStore((s) => s.setSectionList);

  return (
    <SectionCard title="Certifications, Achievements & Languages" collapsible>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StringListEditor
          label="Certificates"
          items={certificates}
          placeholder="AWS Certified Solutions Architect"
          onChange={(items) => setSectionList("certificates", items)}
        />
        <StringListEditor
          label="Achievements"
          items={achievements}
          placeholder="Hackathon winner 2024"
          onChange={(items) => setSectionList("achievements", items)}
        />
        <StringListEditor
          label="Languages"
          items={languages.map((l) => l.name)}
          placeholder="English"
          onChange={(items) =>
            setSectionList(
              "languages",
              items.map((name) => ({ name, proficiency: "" })),
            )
          }
        />
      </div>
    </SectionCard>
  );
}
