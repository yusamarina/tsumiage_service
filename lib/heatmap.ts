import { LogEntry } from "./types";

export type HeatmapDay = { date: string; count: number };

const WEEKS = 12;

export function buildHeatmapColumns(entries: LogEntry[]): HeatmapDay[][] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    counts.set(e.date, (counts.get(e.date) ?? 0) + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const totalDays = WEEKS * 7;
  const start = new Date(endOfWeek);
  start.setDate(endOfWeek.getDate() - totalDays + 1);

  const days: HeatmapDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }

  const columns: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }
  return columns;
}
