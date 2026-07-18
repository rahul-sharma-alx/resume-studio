"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/features/resume/store";
import { downloadResumeJson, readResumeJsonFile } from "@/features/resume/io";

export function ResumeIO() {
  const resume = useResumeStore((s) => s.resume);
  const importResume = useResumeStore((s) => s.importResume);
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onImport = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    try {
      const data = await readResumeJsonFile(file);
      if (!importResume(data)) setError("Invalid resume file. Check the format and try again.");
    } catch {
      setError("Could not read file. Make sure it is valid JSON.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => downloadResumeJson(resume)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Import JSON
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onImport(e.target.files?.[0])}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
