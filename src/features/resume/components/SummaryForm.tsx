"use client";

import { TextAreaField, SectionCard } from "@/shared/form-fields";
import { useResumeStore } from "@/features/resume/store";
import { AiImproveButton } from "@/features/ai/AiImproveButton";

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  return (
    <SectionCard title="Summary" collapsible>
      <TextAreaField
        label="Professional Summary"
        name="resumeSummary"
        value={summary ?? ""}
        onChange={(e) => setSummary(e.target.value)}
      />
      <AiImproveButton text={summary ?? ""} onImproved={setSummary} />
    </SectionCard>
  );
}
