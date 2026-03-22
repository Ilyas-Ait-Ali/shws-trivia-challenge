import type { Difficulty } from "./types";

export const WIN_TARGET = 10;
export const MAX_HEARTS = 5;

export const STAGES: Array<{ difficulty: Difficulty; neededCorrect: number }> = [
  { difficulty: "easy", neededCorrect: 3 },
  { difficulty: "medium", neededCorrect: 3 },
  { difficulty: "hard", neededCorrect: 4 },
];