import { LogEntry } from "./types";
import { buildSeedEntries } from "./seedData";
import { THEMES, themeEntryCount } from "./tags";

const STORAGE_KEY = "growth-log:entries";
const PROGRESS_KEY = "growth-log:progress";
const HAS_RECORDED_KEY = "growth-log:has-recorded";

type Listener = () => void;
export type Progress = { count: number; themeCounts: Record<string, number> };

const listeners = new Set<Listener>();
let cache: LogEntry[] | null = null;
let progressCache: Progress | null = null;
const EMPTY: LogEntry[] = [];
const EMPTY_PROGRESS: Progress = { count: 0, themeCounts: {} };

function readFromStorage(): LogEntry[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = buildSeedEntries();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as LogEntry[];
  } catch {
    return [];
  }
}

function computeProgress(entries: LogEntry[]): Progress {
  const themeCounts: Record<string, number> = {};
  for (const theme of THEMES) {
    themeCounts[theme.shortLabel] = themeEntryCount(theme, entries);
  }
  return { count: entries.length, themeCounts };
}

// バッジは「これまでに到達した最高記録」を見て判定する。
// 現在の記録数をそのまま見てしまうと、記録を削除したときに一度獲得したバッジが
// 消えてしまい、「一度獲得したら失わない」という設計方針と矛盾するため。
function readProgress(): Progress {
  const raw = window.localStorage.getItem(PROGRESS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Progress;
    } catch {
      // フォールスルーして現在の記録から作り直す
    }
  }
  const initial = computeProgress(getSnapshot());
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
  return initial;
}

function bumpProgress(entries: LogEntry[]): void {
  const prev = readProgress();
  const current = computeProgress(entries);
  const themeCounts: Record<string, number> = {};
  for (const theme of THEMES) {
    themeCounts[theme.shortLabel] = Math.max(
      prev.themeCounts[theme.shortLabel] ?? 0,
      current.themeCounts[theme.shortLabel] ?? 0
    );
  }
  const merged: Progress = { count: Math.max(prev.count, current.count), themeCounts };
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
  progressCache = merged;
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = () => {
    cache = null;
    progressCache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): LogEntry[] {
  if (cache === null) {
    cache = readFromStorage();
  }
  return cache;
}

export function getServerSnapshot(): LogEntry[] {
  return EMPTY;
}

export function getProgressSnapshot(): Progress {
  if (progressCache === null) {
    progressCache = readProgress();
  }
  return progressCache;
}

export function getServerProgressSnapshot(): Progress {
  return EMPTY_PROGRESS;
}

export function addEntry(entry: Omit<LogEntry, "id" | "createdAt">): void {
  const entries = getSnapshot();
  const newEntry: LogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  cache = updated;
  bumpProgress(updated);
  window.localStorage.setItem(HAS_RECORDED_KEY, "1");
  notify();
}

export function updateEntry(id: string, updates: { task: string; reflection: string }): void {
  const entries = getSnapshot();
  const updated = entries.map((e) => (e.id === id ? { ...e, ...updates } : e));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  cache = updated;
  bumpProgress(updated);
  notify();
}

export function deleteEntry(id: string): void {
  const entries = getSnapshot();
  const updated = entries.filter((e) => e.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  cache = updated;
  bumpProgress(updated);
  notify();
}

// マイページの「退会する」から呼び出す。記録・バッジの進捗ともに消去し、
// 次回読み込み時は初回アクセス時と同じ(サンプルデータ入り+スプラッシュ表示あり)の状態に戻る。
export function clearAllData(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
  window.localStorage.removeItem(HAS_RECORDED_KEY);
  cache = null;
  progressCache = null;
  notify();
}

// 自分で1件でも記録を追加したことがあるか。サンプルデータの自動投入では立たず、
// フォームからの投稿(addEntry)でのみ立つフラグなので、「記録済みかどうか」を正しく判定できる。
export function hasRecordedOnce(): boolean {
  return window.localStorage.getItem(HAS_RECORDED_KEY) === "1";
}
