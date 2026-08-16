export function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
}

export function formatDateParts(dateStr: string): { month: number; day: number; weekday: string } {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: d.toLocaleDateString("ja-JP", { weekday: "short" }),
  };
}
