"use client";

import { useState } from "react";
import { LogEntry } from "@/lib/types";
import { buildMockSummary, SummarySection } from "@/lib/mockSummary";
import { THEMES, themeEntryCount } from "@/lib/tags";
import { CopyIcon, CheckIcon } from "./icons";

export default function WeeklySummary({ entries }: { entries: LogEntry[] }) {
  const [summary, setSummary] = useState<SummarySection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const detectedThemes = THEMES.filter((theme) => themeEntryCount(theme, entries) > 0);

  async function handleClick() {
    setLoading(true);
    const result = await buildMockSummary(entries);
    setSummary(result);
    setLoading(false);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-stone-600">つみあげの振り返り</h2>

      {summary && (
        <div className="mt-3 space-y-3">
          {summary.map((section, i) => {
            const isProSection = section.title === "次に伸ばすと良い分野";

            if (isProSection) {
              return (
                <div key={i} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-indigo-600">{section.title}</p>
                    <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm shadow-amber-500/30">
                      Pro限定
                    </span>
                  </div>
                  <p
                    className="mt-1.5 select-none whitespace-pre-wrap text-sm leading-relaxed text-stone-700 blur-[4px]"
                    aria-hidden
                  >
                    {section.body}
                  </p>
                  <p className="mt-2 text-xs text-stone-500">Proプランなら、次に伸ばすと良い分野までAIが具体的に教えてくれます。</p>
                </div>
              );
            }

            const isCopyable = section.title === "見つかった傾向";

            return (
              <div key={i}>
                {section.title && (
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-indigo-600">{section.title}</p>
                    {isCopyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(section.body)}
                        className="flex shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-white/70 px-2 py-0.5 text-[10px] font-medium text-stone-500 transition hover:bg-white"
                      >
                        {copied ? (
                          <>
                            <CheckIcon className="h-3 w-3" />
                            コピーしました
                          </>
                        ) : (
                          <>
                            <CopyIcon className="h-3 w-3" />
                            コピー
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{section.body}</p>
              </div>
            );
          })}
        </div>
      )}

      {!summary && !loading && (
        <div className="mt-3">
          {detectedThemes.length > 0 ? (
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-teal-50/60 p-3.5">
              <p className="text-sm font-medium text-stone-600">記録の中から、すでにこんな傾向が見つかっています</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {detectedThemes.map((theme) => (
                  <span
                    key={theme.shortLabel}
                    className="whitespace-nowrap rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-600"
                  >
                    {theme.shortLabel}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-stone-500">
                ここからどんなパターンが読み取れるか、AIが文章にしてくれます。
              </p>
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              記録がつみあがってきたら、気づいていない成長パターンをAIが見つけます。
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={loading || entries.length === 0}
        className="mt-4 w-full whitespace-nowrap rounded-full bg-gradient-to-r from-teal-400 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/40 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-600/50 disabled:cursor-not-allowed disabled:from-stone-200 disabled:to-stone-200 disabled:text-stone-400 disabled:shadow-none disabled:hover:scale-100 sm:w-auto"
      >
        {loading ? "振り返り中…" : "AIに振り返ってもらう"}
      </button>

      <p className="mt-4 border-t border-stone-200/60 pt-3 text-[11px] text-stone-500">
        ※現在はデモ用に、記録内容を読み取る簡易ロジックで振り返り文を生成しています。将来的には、この部分をClaude
        APIによる本格的な分析に置き換える想定です。
      </p>
    </div>
  );
}
