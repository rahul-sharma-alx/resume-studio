"use client";

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };
  const labelLower = label.toLowerCase().replace(/s$/, "");
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => update(index, e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="self-start rounded-md px-2 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        + Add {labelLower}
      </button>
    </div>
  );
}
