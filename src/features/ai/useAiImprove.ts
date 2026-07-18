"use client";

import { useCallback, useState } from "react";

interface ImproveState {
  loading: boolean;
  error: string | null;
}

export function useAiImprove() {
  const [state, setState] = useState<ImproveState>({ loading: false, error: null });

  const improve = useCallback(async (text: string): Promise<string | null> => {
    setState({ loading: true, error: null });
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) {
        setState({ loading: false, error: data.error ?? "AI request failed." });
        return null;
      }
      setState({ loading: false, error: null });
      return data.text;
    } catch {
      setState({ loading: false, error: "Network error calling AI." });
      return null;
    }
  }, []);

  return { improve, loading: state.loading, error: state.error };
}
