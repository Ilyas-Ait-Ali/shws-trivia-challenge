import { useEffect, useRef, useState } from "react";
import { applyTheme, getInitialTheme, type ThemeMode } from "./theme";
import { useTriviaGame, WIN_TARGET, MAX_HEARTS } from "./hooks/useTriviaGame";
import {
  Card,
  Chip,
  MetricLine,
  ProgressCard,
  SELECT_CLASS,
  SelectWrap,
  StatPill,
  SummaryCard,
} from "./components/ui";

const ABCD = ["A", "B", "C", "D"];

function PixelHeart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      className={
        "shrink-0 transition-colors duration-150 " +
        (filled
          ? "text-rose-500 dark:text-rose-400"
          : "text-slate-300 dark:text-slate-700")
      }
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      <rect x="3" y="2" width="1" height="1" fill="currentColor" />
      <rect x="4" y="2" width="1" height="1" fill="currentColor" />
      <rect x="6" y="2" width="1" height="1" fill="currentColor" />
      <rect x="7" y="2" width="1" height="1" fill="currentColor" />
      <rect x="9" y="2" width="1" height="1" fill="currentColor" />
      <rect x="10" y="2" width="1" height="1" fill="currentColor" />
      <rect x="12" y="2" width="1" height="1" fill="currentColor" />
      <rect x="13" y="2" width="1" height="1" fill="currentColor" />

      <rect x="2" y="3" width="1" height="1" fill="currentColor" />
      <rect x="3" y="3" width="1" height="1" fill="currentColor" />
      <rect x="4" y="3" width="1" height="1" fill="currentColor" />
      <rect x="5" y="3" width="1" height="1" fill="currentColor" />
      <rect x="6" y="3" width="1" height="1" fill="currentColor" />
      <rect x="7" y="3" width="1" height="1" fill="currentColor" />
      <rect x="8" y="3" width="1" height="1" fill="currentColor" />
      <rect x="9" y="3" width="1" height="1" fill="currentColor" />
      <rect x="10" y="3" width="1" height="1" fill="currentColor" />
      <rect x="11" y="3" width="1" height="1" fill="currentColor" />
      <rect x="12" y="3" width="1" height="1" fill="currentColor" />
      <rect x="13" y="3" width="1" height="1" fill="currentColor" />
      <rect x="14" y="3" width="1" height="1" fill="currentColor" />

      <rect x="2" y="4" width="1" height="1" fill="currentColor" />
      <rect x="3" y="4" width="1" height="1" fill="currentColor" />
      <rect x="4" y="4" width="1" height="1" fill="currentColor" />
      <rect x="5" y="4" width="1" height="1" fill="currentColor" />
      <rect x="6" y="4" width="1" height="1" fill="currentColor" />
      <rect x="7" y="4" width="1" height="1" fill="currentColor" />
      <rect x="8" y="4" width="1" height="1" fill="currentColor" />
      <rect x="9" y="4" width="1" height="1" fill="currentColor" />
      <rect x="10" y="4" width="1" height="1" fill="currentColor" />
      <rect x="11" y="4" width="1" height="1" fill="currentColor" />
      <rect x="12" y="4" width="1" height="1" fill="currentColor" />
      <rect x="13" y="4" width="1" height="1" fill="currentColor" />
      <rect x="14" y="4" width="1" height="1" fill="currentColor" />

      <rect x="3" y="5" width="1" height="1" fill="currentColor" />
      <rect x="4" y="5" width="1" height="1" fill="currentColor" />
      <rect x="5" y="5" width="1" height="1" fill="currentColor" />
      <rect x="6" y="5" width="1" height="1" fill="currentColor" />
      <rect x="7" y="5" width="1" height="1" fill="currentColor" />
      <rect x="8" y="5" width="1" height="1" fill="currentColor" />
      <rect x="9" y="5" width="1" height="1" fill="currentColor" />
      <rect x="10" y="5" width="1" height="1" fill="currentColor" />
      <rect x="11" y="5" width="1" height="1" fill="currentColor" />
      <rect x="12" y="5" width="1" height="1" fill="currentColor" />
      <rect x="13" y="5" width="1" height="1" fill="currentColor" />

      <rect x="4" y="6" width="1" height="1" fill="currentColor" />
      <rect x="5" y="6" width="1" height="1" fill="currentColor" />
      <rect x="6" y="6" width="1" height="1" fill="currentColor" />
      <rect x="7" y="6" width="1" height="1" fill="currentColor" />
      <rect x="8" y="6" width="1" height="1" fill="currentColor" />
      <rect x="9" y="6" width="1" height="1" fill="currentColor" />
      <rect x="10" y="6" width="1" height="1" fill="currentColor" />
      <rect x="11" y="6" width="1" height="1" fill="currentColor" />
      <rect x="12" y="6" width="1" height="1" fill="currentColor" />

      <rect x="5" y="7" width="1" height="1" fill="currentColor" />
      <rect x="6" y="7" width="1" height="1" fill="currentColor" />
      <rect x="7" y="7" width="1" height="1" fill="currentColor" />
      <rect x="8" y="7" width="1" height="1" fill="currentColor" />
      <rect x="9" y="7" width="1" height="1" fill="currentColor" />
      <rect x="10" y="7" width="1" height="1" fill="currentColor" />
      <rect x="11" y="7" width="1" height="1" fill="currentColor" />

      <rect x="6" y="8" width="1" height="1" fill="currentColor" />
      <rect x="7" y="8" width="1" height="1" fill="currentColor" />
      <rect x="8" y="8" width="1" height="1" fill="currentColor" />
      <rect x="9" y="8" width="1" height="1" fill="currentColor" />
      <rect x="10" y="8" width="1" height="1" fill="currentColor" />

      <rect x="7" y="9" width="1" height="1" fill="currentColor" />
      <rect x="8" y="9" width="1" height="1" fill="currentColor" />
      <rect x="9" y="9" width="1" height="1" fill="currentColor" />
    </svg>
  );
}

function HeartsPill({ hearts, lossPulse }: { hearts: number; lossPulse: boolean }) {
  const low = hearts === 1;

  return (
    <div
      className={
        "rounded-xl border px-3 py-2 text-sm shadow-sm transition " +
        "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 " +
        (lossPulse ? "heart-loss" : "") +
        (low ? " low-life" : "")
      }
    >
      <div className="flex items-center gap-1.5">
        <span className="text-slate-600 dark:text-slate-300">Lives</span>
        <span className="mx-1 text-slate-300 dark:text-slate-700">•</span>

        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <PixelHeart key={i} filled={i < hearts} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EndPanel({
  kind,
  title,
  subtitle,
  score,
  accuracy,
  bestStreak,
  onNewSetup,
  onPlayAgain,
}: {
  kind: "won" | "lost";
  title: string;
  subtitle: string;
  score: number;
  accuracy: string;
  bestStreak: number;
  onNewSetup: () => void;
  onPlayAgain: () => void;
}) {
  const ring =
    kind === "won"
      ? "ring-emerald-200/60 dark:ring-emerald-900/40"
      : "ring-rose-200/70 dark:ring-rose-900/40";

  const glow =
    kind === "won"
      ? "from-emerald-200/60 via-violet-200/30 to-transparent dark:from-emerald-900/25 dark:via-violet-900/15"
      : "from-rose-200/60 via-violet-200/25 to-transparent dark:from-rose-900/25 dark:via-violet-900/15";

  const badge =
    kind === "won"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
      : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow}`} />
      <div className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-slate-900/5 blur-3xl dark:bg-white/5`} />
      <div className={`relative ring-1 ${ring} rounded-2xl p-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badge}`}>
              {kind === "won" ? "Run complete" : "Run failed"}
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SummaryCard label="Score" value={String(score)} />
            <SummaryCard label="Accuracy" value={accuracy} />
            <SummaryCard label="Streak" value={String(bestStreak)} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 active:scale-[0.99] dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            onClick={onNewSetup}
          >
            New setup
          </button>
          <button
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.99]"
            onClick={onPlayAgain}
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  useEffect(() => {
    const init = getInitialTheme();
    setTheme(init);
    applyTheme(init);
  }, []);
  function setThemeMode(mode: ThemeMode) {
    setTheme(mode);
    applyTheme(mode);
  }


  const g = useTriviaGame();

  const prevHeartsRef = useRef(g.hearts);
  const [heartLossPulse, setHeartLossPulse] = useState(false);

  useEffect(() => {
    const prev = prevHeartsRef.current;
    if (g.hearts < prev) {
      setHeartLossPulse(true);
      window.setTimeout(() => setHeartLossPulse(false), 220);
    }
    prevHeartsRef.current = g.hearts;
  }, [g.hearts]);

  const difficultySuccess = (d: "easy" | "medium" | "hard") => {
    const x = g.metrics.byDifficulty[d];
    if (!x.attempts) return "—";
    return `${Math.round((x.correct / x.attempts) * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <style>{`
        @keyframes qIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pop {
          0% { transform: scale(0.98); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
        .card-anim { animation: cardIn 280ms ease-out both; }
        .pop-anim { animation: pop 180ms ease-out both; }

        @keyframes heartLoss {
          0%   { transform: translateX(0); filter: brightness(1); }
          20%  { transform: translateX(-2px); filter: brightness(1.15); }
          40%  { transform: translateX(2px);  filter: brightness(1.15); }
          60%  { transform: translateX(-1px); filter: brightness(1.05); }
          80%  { transform: translateX(1px);  filter: brightness(1.02); }
          100% { transform: translateX(0);    filter: brightness(1); }
        }
        .heart-loss { animation: heartLoss 220ms ease-out; }

        @keyframes lowLifePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .low-life { border-color: rgba(244, 63, 94, 0.35); animation: lowLifePulse 1.1s ease-in-out infinite; }
        .dark .low-life { border-color: rgba(244, 63, 94, 0.28); }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-violet-300 blur-3xl dark:bg-violet-900/60" />
        <div className="absolute top-40 right-1/4 h-72 w-72 rounded-full bg-emerald-300 blur-3xl dark:bg-emerald-900/50" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="card-anim">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              SHWS Trivia
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Staged difficulty • Score • Categories • Metrics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 card-anim">
            <div className="w-[140px]">
              <SelectWrap>
                <select
                  value={theme}
                  onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
                  className={SELECT_CLASS}
                  title="Theme"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </SelectWrap>
            </div>

            <StatPill label="Score" value={String(g.score)} />
            <StatPill label="Accuracy" value={g.accuracy} />
            <StatPill label="Streak" value={String(g.bestStreak)} />

            <HeartsPill hearts={g.hearts} lossPulse={heartLossPulse} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="card-anim">
            <ProgressCard
              title="Run progress"
              right={`${g.correctCount} / ${WIN_TARGET}`}
              value={g.runProgress}
              barClass="bg-violet-600"
            />
          </div>
          <div className="card-anim">
            <ProgressCard
              title="Stage progress"
              right={g.stageLabel}
              value={g.stageProgress}
              barClass="bg-emerald-600"
            />
          </div>
        </div>

        <Card className="mt-6 card-anim">
          <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
            <label className="block">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Category
              </div>
              <div className="mt-1">
                <SelectWrap>
                  <select
                    value={g.categoryId}
                    onChange={(e) =>
                      g.setCategoryId(e.target.value ? Number(e.target.value) : "")
                    }
                    disabled={g.lockedControls}
                    className={SELECT_CLASS}
                  >
                    <option value="">any</option>
                    {g.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </SelectWrap>
              </div>
            </label>

            {g.status === "playing" || g.status === "loading" ? (
              <button
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50 active:scale-[0.99] dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                onClick={g.resetToIdle}
              >
                Reset run
              </button>
            ) : (
              <button
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.99]"
                onClick={g.startGame}
              >
                Start
              </button>
            )}
          </div>

          <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
            Keyboard: <b>1-4</b> choose • <b>T/F</b> works on True/False questions •{" "}
            <b>Enter</b> next after an answer
          </div>
        </Card>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6 card-anim">
            {g.status === "idle" && (
              <>
                <h2 className="text-lg font-semibold">Ready to play?</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Pick a category (optional), then hit Start. Difficulty ramps up automatically.
                </p>
              </>
            )}

            {g.status === "loading" && (
              <>
                <h2 className="text-lg font-semibold">Loading…</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Fetching questions for the current stage.
                </p>
              </>
            )}

            {g.status === "error" && (
              <>
                <h2 className="text-lg font-semibold">Something went wrong</h2>
                <p className="mt-2 text-sm">{g.errorMsg}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={g.resetToIdle}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 active:scale-[0.99] dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                  >
                    Back to setup
                  </button>
                  <button
                    onClick={g.startGame}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.99]"
                  >
                    Try again
                  </button>
                </div>
              </>
            )}

            {g.status === "lost" && (
              <EndPanel
                kind="lost"
                title="You lost"
                subtitle="You ran out of lives before reaching the target."
                score={g.score}
                accuracy={g.accuracy}
                bestStreak={g.bestStreak}
                onNewSetup={g.resetToIdle}
                onPlayAgain={g.startGame}
              />
            )}

            {g.status === "won" && (
              <EndPanel
                kind="won"
                title="You won"
                subtitle={`You reached ${WIN_TARGET} correct answers.`}
                score={g.score}
                accuracy={g.accuracy}
                bestStreak={g.bestStreak}
                onNewSetup={g.resetToIdle}
                onPlayAgain={g.startGame}
              />
            )}

            {g.status === "playing" && g.current && (
              <div
                key={`${g.current.id}-${g.qAnimKey}`}
                style={{ animation: "qIn 240ms ease-out" }}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Chip>{g.current.difficulty}</Chip>
                  <Chip>{g.current.type === "boolean" ? "T/F" : "MCQ"}</Chip>
                  <span className="mx-1">•</span>
                  <span className="truncate">{g.current.category}</span>
                </div>

                <h2 className="mt-3 text-xl font-semibold leading-snug">
                  {g.current.question}
                </h2>

                <div className="mt-4 grid gap-2">
                  {g.current.answers.map((a, i) => {
                    const isSelected = g.selectedAnswer === a;
                    const isCorrect = a === g.current!.correctAnswer;
                    const selectedWrong = g.showResult && isSelected && !isCorrect;

                    const base =
                      "group w-full rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition-all duration-200 " +
                      "active:translate-y-px active:scale-[0.99] disabled:opacity-60";

                    const normal =
                      "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 " +
                      "dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:border-slate-700";

                    const selected =
                      "border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-900/20";

                    const correctStyle =
                      "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20";

                    const wrongStyle =
                      "border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/20";

                    const cls =
                      base +
                      " " +
                      (g.showResult
                        ? isCorrect
                          ? correctStyle
                          : selectedWrong
                          ? wrongStyle
                          : normal
                        : isSelected
                        ? selected
                        : normal);

                    return (
                      <button
                        key={a}
                        onClick={() => g.handleAnswer(a)}
                        disabled={g.locked || g.hearts <= 0}
                        className={cls}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                            {ABCD[i] ?? i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-slate-900 dark:text-slate-100">{a}</div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Press <b>{i + 1}</b>
                              {g.current.type === "boolean" && i < 2
                                ? ` (${a.toLowerCase() === "true" ? "T" : "F"})`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {g.feedback && (
                  <div
                    className={
                      "mt-4 rounded-xl border p-3 text-sm pop-anim " +
                      (g.feedback.kind === "ok"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
                        : "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100")
                    }
                  >
                    {g.feedback.text}
                  </div>
                )}

                {/* Next button for BOTH correct and incorrect results */}
                {g.feedback && g.hearts > 0 && (
                  <div className="mt-4 flex justify-end pop-anim">
                    <button
                      className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.99]"
                      onClick={g.nextQuestion}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6 card-anim">
            <div>
              <h2 className="text-base font-semibold">Metrics</h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Success rate by difficulty + categories
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <MetricLine label="Easy" value={difficultySuccess("easy")} tone="easy" />
              <MetricLine label="Medium" value={difficultySuccess("medium")} tone="medium" />
              <MetricLine label="Hard" value={difficultySuccess("hard")} tone="hard" />
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Top categories
              </div>

              <div className="mt-3 space-y-2 text-sm">
                {g.categoryRows.length === 0 ? (
                  <div className="text-slate-600 dark:text-slate-400">
                    Answer a few questions to populate.
                  </div>
                ) : (
                  g.categoryRows.map(([name, v]) => {
                    const rate = v.attempts
                      ? Math.round((v.correct / v.attempts) * 100)
                      : 0;
                    return (
                      <div key={name} className="flex justify-between gap-3">
                        <span className="max-w-[60%] truncate">{name}</span>
                        <b className="shrink-0">
                          {rate}% ({v.correct}/{v.attempts})
                        </b>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
