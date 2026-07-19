"use client";

import { useMemo } from "react";
import { useResumeStore } from "@/features/resume/store";
import { analyzeResume } from "./analyze";
import { TextAreaField } from "@/shared/form-fields";

function ScoreRing({ score }: { score: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export function ATSPanel() {
  const resume = useResumeStore((s) => s.resume);
  const jobDescription = useResumeStore((s) => s.jobDescription);
  const setJobDescription = useResumeStore((s) => s.setJobDescription);
  const setSkills = useResumeStore((s) => s.setSkills);

  const report = useMemo(
    () => analyzeResume(resume, { jobDescription }),
    [resume, jobDescription],
  );

  const addKeywordToSkills = (keyword: string) => {
    const group = resume.skills.find((g) => g.category === "SoftSkills") ?? {
      category: "SoftSkills" as const,
      skills: [],
    };
    const skills = group.skills.map((s) => s.toLowerCase());
    if (skills.includes(keyword.toLowerCase())) return;
    setSkills(
      resume.skills.some((g) => g.category === "SoftSkills")
        ? resume.skills.map((g) =>
            g.category === "SoftSkills" ? { ...g, skills: [...g.skills, keyword] } : g,
          )
        : [...resume.skills, { category: "SoftSkills", skills: [keyword] }],
    );
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <header className="flex items-center gap-4">
        <ScoreRing score={report.overall} />
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">ATS Score</h2>
          <p className="text-sm text-zinc-500">
            {report.overall >= 80 ? "Strong" : report.overall >= 60 ? "Needs work" : "High risk of rejection"}
          </p>
        </div>
      </header>

      <TextAreaField
        label="Job Description (optional)"
        name="jobDescription"
        placeholder="Paste the job description to check keyword match…"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <ul className="flex flex-col gap-2">
        {report.categories.map((category) => (
          <li key={category.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">{category.label}</span>
              <span className="tabular-nums text-zinc-500">{category.score}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-zinc-700 dark:bg-zinc-300"
                style={{ width: `${category.score}%` }}
              />
            </div>
            {category.suggestions.length > 0 ? (
              <ul className="list-disc pl-4 text-xs text-zinc-500">
                {category.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : null}
            {category.missingKeywords && category.missingKeywords.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {category.missingKeywords.slice(0, 12).map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => addKeywordToSkills(kw)}
                    className="rounded-full border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950"
                    title="Add to Skills"
                  >
                    + {kw}
                  </button>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
