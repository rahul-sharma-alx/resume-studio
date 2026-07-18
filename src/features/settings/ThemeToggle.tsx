"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

function initialMode(): Mode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("resume-studio:theme") as Mode | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(initialMode);

  // Sync external system (the <html> class) whenever mode changes.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("resume-studio:theme", mode);
  }, [mode]);

  return (
    <button
      type="button"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label="Toggle theme"
    >
      {mode === "dark" ? "Light" : "Dark"} mode
    </button>
  );
}
