// src/components/ui.tsx
import type React from "react";

export const SELECT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm " +
  "shadow-sm transition-colors duration-150 " +
  "hover:border-slate-300 hover:bg-slate-50 " +
  "focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "dark:border-slate-800 dark:bg-slate-950 " +
  "dark:hover:border-slate-700 dark:hover:bg-slate-900 " +
  "dark:focus:border-violet-500 dark:focus:ring-violet-500";

export function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
        ▾
      </span>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-lg shadow-slate-200/40 backdrop-blur " +
        "dark:border-slate-800/70 dark:bg-slate-900/50 dark:shadow-black/20 " +
        className
      }
    >
      {children}
    </div>
  );
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {label}: <b>{value}</b>
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-950">
      {children}
    </span>
  );
}

export function ProgressCard({
  title,
  right,
  value,
  barClass,
}: {
  title: string;
  right: string;
  value: number;
  barClass: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/50 dark:shadow-black/20">
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>{title}</span>
        <b className="text-slate-900 dark:text-slate-100">{right}</b>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${barClass}`}
          style={{ width: `${Math.min(100, Math.round(value * 100))}%` }}
        />
      </div>
    </div>
  );
}

type Tone = "easy" | "medium" | "hard";

function toneClasses(tone?: Tone) {
  if (tone === "easy") {
    return (
      "border-emerald-200 bg-emerald-50 text-emerald-900 " +
      "dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
    );
  }
  if (tone === "medium") {
    return (
      "border-amber-200 bg-amber-50 text-amber-900 " +
      "dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100"
    );
  }
  if (tone === "hard") {
    return (
      "border-rose-200 bg-rose-50 text-rose-900 " +
      "dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100"
    );
  }
  return "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950";
}

export function MetricLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const cls = toneClasses(tone);
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${cls}`}
    >
      <span className="font-medium">{label}</span>
      <b>{value}</b>
    </div>
  );
}

export function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs text-slate-600 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
