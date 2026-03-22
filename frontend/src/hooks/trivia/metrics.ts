import type { Metrics, Question } from "./types";

export function createEmptyMetrics(): Metrics {
  return {
    byDifficulty: {
      easy: { attempts: 0, correct: 0 },
      medium: { attempts: 0, correct: 0 },
      hard: { attempts: 0, correct: 0 },
    },
    byCategory: {},
  };
}

export function buildUpdatedMetrics(
  currentMetrics: Metrics,
  question: Question,
  isCorrect: boolean
): Metrics {
  const next: Metrics = {
    byDifficulty: {
      ...currentMetrics.byDifficulty,
      [question.difficulty]: {
        attempts: currentMetrics.byDifficulty[question.difficulty].attempts + 1,
        correct:
          currentMetrics.byDifficulty[question.difficulty].correct +
          (isCorrect ? 1 : 0),
      },
    },
    byCategory: { ...currentMetrics.byCategory },
  };

  const prevCategory = next.byCategory[question.category] ?? {
    attempts: 0,
    correct: 0,
  };

  next.byCategory[question.category] = {
    attempts: prevCategory.attempts + 1,
    correct: prevCategory.correct + (isCorrect ? 1 : 0),
  };

  return next;
}