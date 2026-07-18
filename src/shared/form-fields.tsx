"use client";

import { type InputHTMLAttributes, forwardRef, useState } from "react";
import { clsx } from "clsx";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, className, ...props }, ref) {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={clsx(
            "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors",
            "focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400/40",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            error && "border-red-500 focus-visible:ring-red-400/40",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

interface TextAreaFieldProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, error, id, className, ...props }, ref) {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={clsx(
            "min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors",
            "focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400/40",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            error && "border-red-500 focus-visible:ring-red-400/40",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

export function SectionCard({
  title,
  children,
  onAdd,
  addLabel,
  collapsible = false,
  defaultCollapsed = false,
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
      <header className="flex items-center justify-between">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <span aria-hidden className="text-zinc-400">
              {collapsed ? "▸" : "▾"}
            </span>
            {title}
          </button>
        ) : (
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        )}
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {addLabel ?? "Add"}
          </button>
        ) : null}
      </header>
      {!(collapsible && collapsed) && children}
    </section>
  );
}
