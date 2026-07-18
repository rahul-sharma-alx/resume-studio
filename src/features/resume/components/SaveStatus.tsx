"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/features/resume/store";

function relativeTime(ts: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(ts).toLocaleDateString();
}

export function SaveStatus() {
  const lastSavedAt = useResumeStore((s) => s.lastSavedAt);
  const [, force] = useState(0);

  // ponytail: re-render every 30s so the relative label stays fresh.
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-xs text-zinc-500" role="status" aria-live="polite">
      All changes saved · {relativeTime(lastSavedAt)}
    </span>
  );
}
