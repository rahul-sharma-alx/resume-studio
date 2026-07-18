"use client";

import { useAiImprove } from "./useAiImprove";

interface AiImproveButtonProps {
  text: string;
  onImproved: (text: string) => void;
  label?: string;
}

export function AiImproveButton({ text, onImproved, label = "Improve with AI" }: AiImproveButtonProps) {
  const { improve, loading, error } = useAiImprove();

  const handleClick = async () => {
    const result = await improve(text);
    if (result) onImproved(result);
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || text.trim().length === 0}
        className="self-start rounded-md border border-indigo-300 px-2.5 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950"
        title="Rewrite this text with AI (only polishes your wording; never invents facts)"
      >
        {loading ? "Improving…" : label}
      </button>
      {error ? (
        <span className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
