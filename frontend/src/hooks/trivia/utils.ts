import type { Difficulty } from "./types";

export function pointsForDifficulty(d: Difficulty): number {
  if (d === "easy") return 10;
  if (d === "medium") return 20;
  return 30;
}

export async function readJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export function formatFetchError(args: {
  label: string;
  url?: string;
  status?: number;
  body?: any;
  cause?: unknown;
}) {
  const parts: string[] = [];
  parts.push(args.label);
  if (args.url) parts.push(`URL: ${args.url}`);
  if (typeof args.status === "number") parts.push(`HTTP: ${args.status}`);
  if (args.body) parts.push(`Body: ${JSON.stringify(args.body).slice(0, 300)}`);
  if (args.cause && typeof args.cause === "object") {
    const name = (args.cause as any)?.name;
    const msg = (args.cause as any)?.message;
    if (name || msg) parts.push(`Cause: ${name ?? ""} ${msg ?? ""}`.trim());
  }
  return parts.join(" • ");
}