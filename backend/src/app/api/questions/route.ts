import { NextResponse } from "next/server";

export const runtime = "nodejs"; // important because you use Buffer

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "multiple" | "boolean";

type OpenTDBResponse = {
  response_code: number;
  results: Array<{
    type: string;        // base64 when encode=base64
    difficulty: string;  // base64 when encode=base64
    category: string;    // base64 when encode=base64
    question: string;    // base64 when encode=base64
    correct_answer: string;
    incorrect_answers: string[];
  }>;
};

function decodeBase64(input: string): string {
  return Buffer.from(input, "base64").toString("utf-8");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isDifficulty(x: string): x is Difficulty {
  return x === "easy" || x === "medium" || x === "hard";
}

function isQuestionType(x: string): x is QuestionType {
  return x === "multiple" || x === "boolean";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        // Some public APIs behave better when a UA is present
        "User-Agent": "shws-trivia-challenge/1.0",
        "Accept": "application/json",
      },
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function fetchOpenTDBWithRetry(url: string) {
  // tweak if you want
  const attempts = [
    { timeoutMs: 4000, backoffMs: 250 },
    { timeoutMs: 6000, backoffMs: 500 },
    { timeoutMs: 8000, backoffMs: 900 },
  ];

  let lastStatus: number | undefined;
  let lastBody: any = undefined;
  let lastError: any = undefined;

  for (let i = 0; i < attempts.length; i++) {
    try {
      const { timeoutMs, backoffMs } = attempts[i];

      const res = await fetchWithTimeout(url, timeoutMs);
      lastStatus = res.status;

      // Read body safely (even on error)
      const text = await res.text();
      try {
        lastBody = JSON.parse(text);
      } catch {
        lastBody = { raw: text?.slice(0, 300) };
      }

      if (res.ok) {
        return { ok: true as const, status: res.status, body: lastBody };
      }

      // Retry on rate limit / server errors
      const retryable = res.status === 429 || (res.status >= 500 && res.status <= 599);

      if (!retryable) {
        return { ok: false as const, status: res.status, body: lastBody };
      }

      await sleep(backoffMs);
    } catch (e: any) {
      lastError = e;
      // AbortError / network glitch — retry with backoff
      await sleep(attempts[i].backoffMs);
    }
  }

  return {
    ok: false as const,
    status: lastStatus ?? 502,
    body: lastBody ?? { error: "Fetch failed", cause: String(lastError?.message ?? lastError) },
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const amountRaw = searchParams.get("amount") ?? "10";
  const amount = Math.min(Math.max(Number(amountRaw), 1), 50).toString();

  const difficulty = searchParams.get("difficulty");
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  const params = new URLSearchParams({
    amount,
    encode: "base64",
  });

  if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
    params.set("difficulty", difficulty);
  }

  if (type && ["multiple", "boolean"].includes(type)) {
    params.set("type", type);
  }

  if (category && /^\d+$/.test(category)) {
    params.set("category", category);
  }

  const url = `https://opentdb.com/api.php?${params.toString()}`;

  const result = await fetchOpenTDBWithRetry(url);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: "Failed to reach Open Trivia DB",
        opentdb_status: result.status,
        opentdb_body: result.body,
        url,
      },
      { status: 502 }
    );
  }

  const data = result.body as OpenTDBResponse;

  if (data.response_code !== 0) {
    return NextResponse.json(
      {
        error: "Open Trivia DB returned an invalid response",
        response_code: data.response_code,
        url,
      },
      { status: 502 }
    );
  }

  const now = Date.now();

  const questions = data.results.map((q, i) => {
    const decodedType = decodeBase64(q.type);
    const decodedDifficulty = decodeBase64(q.difficulty);

    const safeType: QuestionType = isQuestionType(decodedType) ? decodedType : "multiple";
    const safeDifficulty: Difficulty = isDifficulty(decodedDifficulty) ? decodedDifficulty : "easy";

    const correct = decodeBase64(q.correct_answer);
    const answers = shuffle([correct, ...q.incorrect_answers.map(decodeBase64)]);

    return {
      id: `${now}-${i}`,
      type: safeType,
      difficulty: safeDifficulty,
      category: decodeBase64(q.category),
      question: decodeBase64(q.question),
      answers,
      correctAnswer: correct,
    };
  });

  return NextResponse.json({ questions });
}
