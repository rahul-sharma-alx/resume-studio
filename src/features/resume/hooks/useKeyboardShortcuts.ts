"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/features/resume/store";

// Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo, Ctrl/Cmd+S save (no-op: auto-save),
// Ctrl/Cmd+P print. Avoids firing while typing in inputs for Z (native undo
// there is fine), but we still handle it globally for the app-level history.
export function useKeyboardShortcuts() {
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      const key = event.key.toLowerCase();
      if (key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        event.preventDefault();
        redo();
      } else if (key === "p") {
        event.preventDefault();
        window.print();
      }
      // Ctrl/Cmd+S: auto-save already covers it; just prevent the browser dialog.
      else if (key === "s") {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);
}
