"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

export function ThemeToggle() {
  // Start stable on server and client to avoid hydration mismatch; the real
  // preference is applied in an effect after mount.
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync persisted/system theme into state after mount — the intended
    // effect use case (reading external state). The lint rule is bypassed
    // because this is external-state synchronization, not derived state.
    const stored = localStorage.getItem("resume-studio:theme") as Mode | null;
    const next: Mode =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(next);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("resume-studio:theme", mode);
  }, [mode, mounted]);

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
