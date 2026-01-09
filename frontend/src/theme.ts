export type ThemeMode = "light" | "dark";
const STORAGE_KEY = "shws-theme";

export function getInitialTheme(): ThemeMode {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "dark" ? "dark" : "dark";
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  localStorage.setItem(STORAGE_KEY, mode);
}
