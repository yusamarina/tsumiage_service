"use client";

import { createPortal } from "react-dom";
import { Progress } from "@/lib/store";
import { BADGES } from "@/lib/badges";
import { THEMES, THEME_BADGE_THRESHOLD, THEME_BADGE_ICON_IDS, MYSTERY_ICON_IDS } from "@/lib/tags";
import StickerIcon from "./StickerIcon";

export default function StickerBookModal({
  progress,
  onClose,
}: {
  progress: Progress;
  onClose: () => void;
}) {
  const count = progress.count;
  const themeCounts = THEMES.map((theme) => progress.themeCounts[theme.shortLabel] ?? 0);
  const earnedThemeCount = themeCounts.filter((c) => c >= THEME_BADGE_THRESHOLD).length;
  const totalBadges = BADGES.length + THEMES.length + MYSTERY_ICON_IDS.length;
  const earnedTotal = BADGES.filter((b) => count >= b.threshold).length + earnedThemeCount;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#e3cda0] bg-[#f7ecd6] p-5 pl-9 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_40px_80px_-30px_rgba(0,0,0,0.5)] sm:p-6 sm:pl-11"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(150,110,60,0.22) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {/* バインダーのリング穴 */}
        <div className="absolute inset-y-5 left-3 flex flex-col justify-evenly sm:left-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="relative block h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            >
              <span className="absolute inset-[3px] rounded-full bg-[#f7ecd6] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-amber-900/80">シール帳(全件)</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-amber-800/20 bg-white/60 px-3 py-1 text-xs font-medium text-amber-900/60 backdrop-blur-lg transition hover:bg-white/80"
          >
            閉じる
          </button>
        </div>
        <p className="mt-1 text-xs text-amber-800/50">
          {earnedTotal} / {totalBadges} 個獲得
        </p>

        <div className="mt-3 rounded-2xl border border-white/70 bg-white/45 p-3">
          <p className="mb-1.5 text-xs font-medium text-amber-900/60">つみあげの節目</p>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {BADGES.map((badge) => {
              const earned = count >= badge.threshold;
              return (
                <div key={badge.threshold} className="flex flex-col items-center gap-1" title={badge.label}>
                  <div className="flex h-11 w-11 items-center justify-center">
                    <StickerIcon
                      id={badge.threshold}
                      className={
                        earned
                          ? "h-9 w-9 drop-shadow-[0_3px_6px_rgba(190,18,60,0.35)]"
                          : "h-9 w-9 grayscale opacity-60"
                      }
                    />
                  </div>
                  <p className="text-center text-[9px] leading-tight text-amber-900/60">
                    {earned ? badge.label : `${badge.threshold}件`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/70 bg-white/45 p-3">
          <p className="text-xs font-medium text-amber-900/60">得意分野(振り返りの内容から自動判定)</p>
          <p className="mb-1.5 text-[11px] text-amber-800/50">
            同じタグが{THEME_BADGE_THRESHOLD}つ集まると、その分野のシールがもらえます。
          </p>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {THEMES.map((theme, i) => {
              const earned = themeCounts[i] >= THEME_BADGE_THRESHOLD;
              return (
                <div key={theme.shortLabel} className="flex flex-col items-center gap-1" title={theme.shortLabel}>
                  <div className="flex h-11 w-11 items-center justify-center">
                    <StickerIcon
                      id={THEME_BADGE_ICON_IDS[i]}
                      className={
                        earned
                          ? "h-9 w-9 drop-shadow-[0_3px_6px_rgba(190,18,60,0.35)]"
                          : "h-9 w-9 grayscale opacity-60"
                      }
                    />
                  </div>
                  <p className="text-center text-[9px] leading-tight text-amber-900/60">
                    {theme.shortLabel} {Math.min(themeCounts[i], THEME_BADGE_THRESHOLD)}/{THEME_BADGE_THRESHOLD}
                  </p>
                </div>
              );
            })}
            {MYSTERY_ICON_IDS.map((id, i) => (
              <div key={`mystery-${i}`} className="flex flex-col items-center gap-1" title="???">
                <div className="flex h-11 w-11 items-center justify-center">
                  <StickerIcon id={id} className="h-9 w-9 grayscale opacity-40 blur-[2px]" />
                </div>
                <p className="text-center text-[9px] leading-tight text-amber-800/40">？？？</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-amber-800/50">
            ？？？は、記録を続けていくと見つかるかもしれない、まだ判定していない得意分野です。
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
