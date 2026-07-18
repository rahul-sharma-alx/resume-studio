"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/features/resume/store";
import { downloadResumeJson, readResumeJsonFile } from "@/features/resume/io";
import { parseResumeText } from "@/features/resume/parseResumeText";

export function ResumeIO() {
  const resume = useResumeStore((s) => s.resume);
  const importResume = useResumeStore((s) => s.importResume);
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasted, setPasted] = useState("");

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

  const onPasteImport = () => {
    setError(null);
    if (!pasted.trim()) {
      setError("Paste some resume text first.");
      return;
    }
    if (!importResume(parseResumeText(pasted))) {
      setError("Could not map the text into a valid resume. Try formatting headings (e.g. Experience, Education, Skills).");
    } else {
      setPasted("");
      setShowPaste(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
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
        <button
          type="button"
          onClick={() => setShowPaste((v) => !v)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {showPaste ? "Hide paste" : "Paste text"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onImport(e.target.files?.[0])}
        />
      </div>

      {showPaste ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={6}
            placeholder="Paste resume text. Use headings like 'Experience', 'Education', 'Skills' for best results."
            className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={onPasteImport}
            className="self-start rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Import pasted text
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
