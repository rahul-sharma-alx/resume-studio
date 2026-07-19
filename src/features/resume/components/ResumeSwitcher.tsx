"use client";

import { useMemo, useState } from "react";
import { useResumeStore } from "@/features/resume/store";

type SortKey = "updated" | "created" | "name";

export function ResumeSwitcher() {
  const resumes = useResumeStore((s) => s.resumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const setActiveResume = useResumeStore((s) => s.setActiveResume);
  const createResume = useResumeStore((s) => s.createResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const renameResume = useResumeStore((s) => s.renameResume);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const list = useMemo(() => {
    const docs = Object.values(resumes);
    const filtered = docs.filter((d) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.targetRole.toLowerCase().includes(q)
      );
    });
    return filtered.sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "created") return b.createdAt - a.createdAt;
      return b.updatedAt - a.updatedAt;
    });
  }, [resumes, query, sort]);

  const startRename = (id: string, title: string) => {
    setEditingId(id);
    setDraft(title);
  };
  const commitRename = () => {
    if (editingId && draft.trim()) renameResume(editingId, draft.trim());
    setEditingId(null);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex max-w-[220px] items-center gap-2 truncate rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <span className="truncate">{resumes[activeResumeId]?.title ?? "Resume"}</span>
        <span aria-hidden className="text-zinc-400">▾</span>
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resumes"
                className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                aria-label="Search resumes"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                aria-label="Sort resumes"
              >
                <option value="updated">Recent</option>
                <option value="created">Created</option>
                <option value="name">Name</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                createResume();
                setOpen(false);
              }}
              className="mt-2 w-full rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              + New Resume
            </button>

            <ul className="mt-2 max-h-72 overflow-auto">
              {list.map((doc) => (
                <li
                  key={doc.id}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                    doc.id === activeResumeId ? "bg-zinc-100 dark:bg-zinc-800" : ""
                  }`}
                >
                  {editingId === doc.id ? (
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 rounded border border-zinc-400 px-1 py-0.5 text-sm"
                      aria-label="Rename resume"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveResume(doc.id);
                        setOpen(false);
                      }}
                      className="flex-1 truncate text-left text-sm text-zinc-800 dark:text-zinc-200"
                      title={doc.title}
                    >
                      <span className="block truncate font-medium">{doc.title}</span>
                      {doc.targetRole ? (
                        <span className="block truncate text-xs text-zinc-500">{doc.targetRole}</span>
                      ) : null}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startRename(doc.id, doc.title)}
                    className="text-xs text-zinc-500 hover:underline"
                    aria-label="Rename"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      duplicateResume(doc.id);
                      setOpen(false);
                    }}
                    className="text-xs text-zinc-500 hover:underline"
                    aria-label="Duplicate"
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (Object.keys(resumes).length <= 1) return;
                      if (window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
                        deleteResume(doc.id);
                        if (doc.id === activeResumeId) setOpen(false);
                      }
                    }}
                    disabled={Object.keys(resumes).length <= 1}
                    className="text-xs text-red-600 hover:underline disabled:opacity-30"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </li>
              ))}
              {list.length === 0 ? (
                <li className="px-2 py-3 text-center text-sm text-zinc-500">No resumes found.</li>
              ) : null}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
