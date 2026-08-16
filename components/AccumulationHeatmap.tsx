import { LogEntry } from "@/lib/types";
import { buildHeatmapColumns } from "@/lib/heatmap";
import { formatDate } from "@/lib/date";

// 単色ホヴ・単調な明度で組んだ順序尺度パレット(dataviz skillのvalidate_palette.jsで検証済み:
// #f472b6 / #db2777 / #831843、白背景に対しライトエンドのコントラストも2:1超をクリア)
function colorFor(count: number): string {
  if (count <= 0) return "bg-stone-900/10 border border-white/50";
  if (count === 1) return "bg-[#f472b6]";
  if (count === 2) return "bg-[#db2777]";
  return "bg-[#831843]";
}

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default function AccumulationHeatmap({ entries }: { entries: LogEntry[] }) {
  const weeks = buildHeatmapColumns(entries);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-stone-600">記録カレンダー</h2>
        <p className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-stone-500">
          合計 {entries.length} 件
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="grid grid-cols-7 gap-1.5" style={{ gridTemplateColumns: "repeat(7, 16px)" }}>
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="text-center text-[10px] text-stone-500">
              {label}
            </span>
          ))}
          {weeks.map((week) =>
            week.map((day) => (
              <div
                key={day.date}
                title={`${formatDate(day.date)}・${day.count}件`}
                className={`aspect-square rounded-[3px] ${colorFor(day.count)}`}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-stone-500">
        <span>少ない</span>
        <span className="h-2.5 w-2.5 rounded-sm bg-stone-900/10 border border-white/50" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[#f472b6]" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[#db2777]" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[#831843]" />
        <span>多い</span>
      </div>
      <p className="mt-2 text-[11px] text-stone-500">直近12週間の記録</p>
    </div>
  );
}
