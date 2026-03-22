export type Difficulty = "easy" | "medium" | "hard";
export type QType = "" | "boolean" | "multiple";

export type Question = {
  id: string;
  type: "boolean" | "multiple";
  difficulty: Difficulty;
  category: string;
  question: string;
  answers: string[];
  correctAnswer: string;
};

export type Status = "idle" | "loading" | "playing" | "won" | "lost" | "error";

export type Category = { id: number; name: string };

export type Metrics = {
  byDifficulty: Record<Difficulty, { attempts: number; correct: number }>;
  byCategory: Record<string, { attempts: number; correct: number }>;
};

export type Feedback = { kind: "ok" | "no"; text: string } | null;