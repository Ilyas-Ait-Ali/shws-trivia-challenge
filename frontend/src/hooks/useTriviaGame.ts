// frontend/src/hooks/useTriviaGame.ts
import { useEffect, useMemo, useRef, useState } from "react";

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

export const WIN_TARGET = 10;
export const MAX_HEARTS = 5;

export const STAGES: Array<{ difficulty: Difficulty; neededCorrect: number }> = [
  { difficulty: "easy", neededCorrect: 3 },
  { difficulty: "medium", neededCorrect: 3 },
  { difficulty: "hard", neededCorrect: 4 },
];

function pointsForDifficulty(d: Difficulty): number {
  if (d === "easy") return 10;
  if (d === "medium") return 20;
  return 30;
}

export type Metrics = {
  byDifficulty: Record<Difficulty, { attempts: number; correct: number }>;
  byCategory: Record<string, { attempts: number; correct: number }>;
};

function createEmptyMetrics(): Metrics {
  return {
    byDifficulty: {
      easy: { attempts: 0, correct: 0 },
      medium: { attempts: 0, correct: 0 },
      hard: { attempts: 0, correct: 0 },
    },
    byCategory: {},
  };
}

type Feedback = { kind: "ok" | "no"; text: string } | null;

async function readJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function formatFetchError(args: {
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

export function useTriviaGame() {
  // setup
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);

  // run state
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [stageIndex, setStageIndex] = useState(0);
  const [stageCorrect, setStageCorrect] = useState(0);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);

  const [feedback, setFeedback] = useState<Feedback>(null);
  const [locked, setLocked] = useState(false);

  // hearts
  const [hearts, setHearts] = useState(MAX_HEARTS);

  // polish
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [qAnimKey, setQAnimKey] = useState(0);

  const [metrics, setMetrics] = useState<Metrics>(createEmptyMetrics());

  const current = questions[idx];
  const currentStage = STAGES[stageIndex];

  // anti-race
  const fetchSeq = useRef(0);
  const activeController = useRef<AbortController | null>(null);
  const transitioningRef = useRef(false);

  // lock category for the current run
  const runCategoryRef = useRef<number | "">("");

  // last fetch diagnostics
  const lastFetch = useRef<{ url?: string; status?: number; body?: any }>({});

  // remembers whether the last answered question was correct
  const lastAnsweredCorrectRef = useRef<boolean | null>(null);

  // derived
  const lockedControls = status === "loading" || status === "playing";
  const showResult = feedback !== null;

  const stageLabel = useMemo(() => {
    if (!currentStage) return "—";
    return `${currentStage.difficulty.toUpperCase()} (${stageCorrect}/${currentStage.neededCorrect})`;
  }, [currentStage, stageCorrect]);

  const runProgress = useMemo(() => correctCount / WIN_TARGET, [correctCount]);

  const stageProgress = useMemo(() => {
    if (!currentStage) return 0;
    return stageCorrect / currentStage.neededCorrect;
  }, [currentStage, stageCorrect]);

  const totalAttempts = useMemo(() => {
    const d = metrics.byDifficulty;
    return d.easy.attempts + d.medium.attempts + d.hard.attempts;
  }, [metrics]);

  const totalCorrect = useMemo(() => {
    const d = metrics.byDifficulty;
    return d.easy.correct + d.medium.correct + d.hard.correct;
  }, [metrics]);

  const accuracy = useMemo(() => {
    if (!totalAttempts) return "—";
    return `${Math.round((totalCorrect / totalAttempts) * 100)}%`;
  }, [totalAttempts, totalCorrect]);

  const difficultySuccess = (d: Difficulty) => {
    const x = metrics.byDifficulty[d];
    if (!x.attempts) return "—";
    return `${Math.round((x.correct / x.attempts) * 100)}%`;
  };

  const categoryRows = useMemo(() => {
    const entries = Object.entries(metrics.byCategory);
    entries.sort((a, b) => b[1].attempts - a[1].attempts);
    return entries.slice(0, 8);
  }, [metrics.byCategory]);

  // categories
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data.categories ?? []);
      } catch {
        // ignore
      }
    })();
  }, []);

  function resetToIdle() {
    activeController.current?.abort();
    activeController.current = null;
    transitioningRef.current = false;
    runCategoryRef.current = "";

    setStatus("idle");
    setErrorMsg("");
    setFeedback(null);
    setLocked(false);

    setStageIndex(0);
    setStageCorrect(0);

    setQuestions([]);
    setIdx(0);

    setCorrectCount(0);
    setScore(0);

    setMetrics(createEmptyMetrics());

    setSelectedAnswer(null);
    setBestStreak(0);
    setStreak(0);
    setQAnimKey((k) => k + 1);

    setHearts(MAX_HEARTS);

    lastAnsweredCorrectRef.current = null;
  }

  function bumpMetrics(q: Question, isCorrect: boolean) {
    setMetrics((m) => {
      const next: Metrics = {
        byDifficulty: {
          ...m.byDifficulty,
          [q.difficulty]: {
            attempts: m.byDifficulty[q.difficulty].attempts + 1,
            correct: m.byDifficulty[q.difficulty].correct + (isCorrect ? 1 : 0),
          },
        },
        byCategory: { ...m.byCategory },
      };

      const cat = q.category;
      const prev = next.byCategory[cat] ?? { attempts: 0, correct: 0 };
      next.byCategory[cat] = {
        attempts: prev.attempts + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      };

      return next;
    });
  }

  async function fetchStageQuestions(difficulty: Difficulty) {
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;

    const seq = ++fetchSeq.current;
    const runCat = runCategoryRef.current;

    const plans: Array<{ amount: number; useCategory: boolean }> = [
      { amount: 10, useCategory: true },
      { amount: 7, useCategory: true },
      { amount: 5, useCategory: true },
      { amount: 3, useCategory: true },
      { amount: 10, useCategory: false },
      { amount: 7, useCategory: false },
      { amount: 5, useCategory: false },
      { amount: 3, useCategory: false },
    ];

    for (const p of plans) {
      const params = new URLSearchParams();
      params.set("amount", String(p.amount));
      params.set("difficulty", difficulty);

      if (p.useCategory && runCat !== "") params.set("category", String(runCat));
      const url = `/api/questions?${params.toString()}`;

      let res: Response;
      try {
        res = await fetch(url, { signal: controller.signal });
      } catch (e: any) {
        if (e?.name === "AbortError") throw e;
        lastFetch.current = { url, status: undefined, body: { fetchError: String(e) } };
        continue;
      }

      const body = await readJsonSafe(res);
      lastFetch.current = { url, status: res.status, body };

      if (!res.ok) continue;

      const qs = (body as any)?.questions as Question[] | undefined;
      if (qs && qs.length > 0) {
        if (seq !== fetchSeq.current) return;

        setQuestions(qs);
        setIdx(0);
        setSelectedAnswer(null);
        setQAnimKey((k) => k + 1);

        if (!p.useCategory && runCat !== "") {
          setFeedback({
            kind: "no",
            text: "Note: Not enough questions in this category at this difficulty, so the game broadened the category.",
          });
          window.setTimeout(() => setFeedback(null), 2000);
        }

        return;
      }
    }

    throw new Error(
      formatFetchError({
        label: "Could not fetch questions after multiple attempts.",
        url: lastFetch.current.url,
        status: lastFetch.current.status,
        body: lastFetch.current.body,
      })
    );
  }

  async function startGame() {
    transitioningRef.current = false;
    runCategoryRef.current = categoryId;

    setStatus("loading");
    setErrorMsg("");
    setFeedback(null);
    setLocked(false);

    setStageIndex(0);
    setStageCorrect(0);

    setQuestions([]);
    setIdx(0);

    setCorrectCount(0);
    setScore(0);
    setMetrics(createEmptyMetrics());

    setSelectedAnswer(null);
    setStreak(0);
    setQAnimKey((k) => k + 1);

    setHearts(MAX_HEARTS);
    lastAnsweredCorrectRef.current = null;

    try {
      await fetchStageQuestions(STAGES[0].difficulty);
      setStatus("playing");
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setStatus("error");
      setErrorMsg(e?.message ?? "Failed to start.");
    }
  }

  async function goToStage(nextStage: number) {
    if (nextStage < 0 || nextStage >= STAGES.length) return;

    transitioningRef.current = true;
    setStatus("loading");
    setErrorMsg("");
    setFeedback(null);
    setLocked(false);

    try {
      setStageIndex(nextStage);
      setStageCorrect(0);
      await fetchStageQuestions(STAGES[nextStage].difficulty);
      setStatus("playing");
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setStatus("error");
      setErrorMsg(e?.message ?? "Failed to load next stage.");
    } finally {
      transitioningRef.current = false;
    }
  }

  function handleAnswer(answer: string) {
    if (!current || locked) return;
    if (status !== "playing") return;
    if (hearts <= 0) return;

    setLocked(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === current.correctAnswer;
    lastAnsweredCorrectRef.current = isCorrect;

    bumpMetrics(current, isCorrect);

    if (isCorrect) {
      setFeedback({ kind: "ok", text: "Correct." });
      setCorrectCount((c) => c + 1);
      setScore((s) => s + pointsForDifficulty(current.difficulty));
      setStreak((x) => {
        const next = x + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });

      setStageCorrect((sc) => sc + 1);

      // Do NOT auto-advance. Wait for Next click.
      setLocked(true);
    } else {
      setHearts((h) => {
        const next = Math.max(0, h - 1);
        if (next === 0) {
          window.setTimeout(() => {
            setStatus("lost");
            setLocked(false);
            setFeedback(null);
          }, 250);
        }
        return next;
      });

      setFeedback({
        kind: "no",
        text: `Incorrect.`,
      });
      setStreak(0);
      setLocked(true); // wait for Next
    }
  }

  function nextQuestion() {
    if (status !== "playing") return;
    if (hearts <= 0) return;

    // If we already hit win target, finish on Next.
    if (correctCount >= WIN_TARGET) {
      setFeedback(null);
      setLocked(false);
      setSelectedAnswer(null);
      setStatus("won");
      return;
    }

    const wasCorrect = lastAnsweredCorrectRef.current === true;

    setFeedback(null);
    setLocked(false);
    setSelectedAnswer(null);

    // If the last answer was correct, check stage completion and transition.
    if (wasCorrect) {
      const s = STAGES[stageIndex];
      const stageComplete = !!s && stageCorrect >= s.neededCorrect;
      const hasNextStage = stageIndex + 1 < STAGES.length;

      if (stageComplete && hasNextStage) {
        goToStage(stageIndex + 1);
        return;
      }
    }

    setIdx((i) => i + 1);
    setQAnimKey((k) => k + 1);
  }

  // Auto-refill when: playing, not transitioning, stage not complete, and ran out
  useEffect(() => {
    if (status !== "playing") return;
    if (locked) return;
    if (transitioningRef.current) return;

    if (correctCount >= WIN_TARGET) return;
    if (hearts <= 0) return;

    const s = STAGES[stageIndex];
    if (!s) return;

    if (stageCorrect >= s.neededCorrect) return;
    if (current) return;

    (async () => {
      try {
        setStatus("loading");
        await fetchStageQuestions(s.difficulty);
        setStatus("playing");
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setStatus("error");
        setErrorMsg(e?.message ?? "Ran out of questions for this stage.");
      }
    })();
  }, [status, current, stageIndex, stageCorrect, locked, correctCount, hearts]);

  // keyboard
  useEffect(() => {
    if (status !== "playing" || !current) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (feedback && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        nextQuestion();
        return;
      }

      if (locked) return;
      if (hearts <= 0) return;

      const n = Number(e.key);
      if (Number.isFinite(n) && n >= 1 && n <= 4) {
        const a = current.answers[n - 1];
        if (a) handleAnswer(a);
        return;
      }

      if (current.type === "boolean") {
        const k = e.key.toLowerCase();
        if (k === "t") {
          const a = current.answers.find((x) => x.toLowerCase() === "true");
          if (a) handleAnswer(a);
        }
        if (k === "f") {
          const a = current.answers.find((x) => x.toLowerCase() === "false");
          if (a) handleAnswer(a);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, current, locked, feedback, hearts, correctCount, stageCorrect, stageIndex]);

  return {
    categoryId,
    setCategoryId,
    categories,

    status,
    errorMsg,

    stageIndex,
    stageCorrect,
    questions,
    idx,
    current,

    correctCount,
    score,

    feedback,
    locked,

    hearts,

    selectedAnswer,
    streak,
    bestStreak,
    qAnimKey,

    metrics,
    difficultySuccess,
    categoryRows,

    lockedControls,
    showResult,
    stageLabel,
    runProgress,
    stageProgress,
    accuracy,

    startGame,
    resetToIdle,
    handleAnswer,
    nextQuestion,
  };
}
