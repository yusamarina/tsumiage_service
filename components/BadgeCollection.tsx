"use client";

import { useState } from "react";
import { Progress } from "@/lib/store";
import { BADGES } from "@/lib/badges";
import { THEMES, THEME_BADGE_THRESHOLD, THEME_BADGE_ICON_IDS, MYSTERY_ICON_IDS } from "@/lib/tags";
import StickerIcon from "./StickerIcon";
import StickerBookModal from "./StickerBookModal";

const PREVIEW_COUNT = 7;
// シールを少しずつ違う角度で貼ったように見せる、あえて不揃いな回転
const ROTATIONS = [-7, 5, -4, 8, -9, 4, -5];
const THEME_ROTATIONS = [6, -5, 8, -6, 5];

export default function BadgeCollection({ progress }: { progress: Progress }) {
  const [open, setOpen] = useState(false);
  const count = progress.count;
  const previewBadges = BADGES.slice(0, PREVIEW_COUNT);

  const themeCounts = THEMES.map((theme) => progress.themeCounts[theme.shortLabel] ?? 0);
  const earnedThemeCount = themeCounts.filter((c) => c >= THEME_BADGE_THRESHOLD).length;
  const totalBadges = BADGES.length + THEMES.length + MYSTERY_ICON_IDS.length;
  const earnedTotal = BADGES.filter((b) => count >= b.threshold).length + earnedThemeCount;

  return (
    <div
      className="relative overflow-hidden rounded-[1.5rem] border border-[#e3cda0] bg-[#f7ecd6] py-5 pl-9 pr-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_20px_45px_-28px_rgba(120,80,30,0.5)] sm:py-6 sm:pl-11 sm:pr-6"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(150,110,60,0.22) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* バインダーのリング穴 */}
      <div className="absolute inset-y-4 left-3 flex flex-col justify-evenly sm:left-4">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="relative block h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
          >
            <span className="absolute inset-[3px] rounded-full bg-[#f7ecd6] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
          </span>
        ))}
      </div>

      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-amber-900/80">シール帳</h2>
        <p className="text-xs text-amber-800/50">
          {earnedTotal} / {totalBadges}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
        {previewBadges.map((badge, i) => {
          const earned = count >= badge.threshold;
          const rotate = ROTATIONS[i % ROTATIONS.length];
          return (
            <div key={badge.threshold} className="flex flex-col items-center gap-1.5" title={badge.label}>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={
                  earned
                    ? { transform: `rotate(${rotate}deg)` }
                    : { border: "1.5px dashed rgba(150,110,60,0.4)" }
                }
              >
                <StickerIcon
                  id={badge.threshold}
                  className={
                    earned
                      ? "h-10 w-10 drop-shadow-[0_3px_6px_rgba(120,60,20,0.4)]"
                      : "h-8 w-8 grayscale opacity-50"
                  }
                />
              </div>
              <p className="text-center text-[10px] leading-tight text-amber-900/60">
                {earned ? badge.label : `${badge.threshold}件`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-amber-800/10 pt-4">
        <p className="mb-2 text-[11px] font-medium text-amber-900/50">
          得意分野(振り返りの内容から自動判定)
        </p>
        <div className="grid grid-cols-5 gap-3">
          {THEMES.map((theme, i) => {
            const earned = themeCounts[i] >= THEME_BADGE_THRESHOLD;
            const rotate = THEME_ROTATIONS[i % THEME_ROTATIONS.length];
            return (
              <div key={theme.shortLabel} className="flex flex-col items-center gap-1.5" title={theme.shortLabel}>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={
                    earned
                      ? { transform: `rotate(${rotate}deg)` }
                      : { border: "1.5px dashed rgba(150,110,60,0.4)" }
                  }
                >
                  <StickerIcon
                    id={THEME_BADGE_ICON_IDS[i]}
                    className={
                      earned
                        ? "h-10 w-10 drop-shadow-[0_3px_6px_rgba(120,60,20,0.4)]"
                        : "h-8 w-8 grayscale opacity-50"
                    }
                  />
                </div>
                <p className="text-center text-[10px] leading-tight text-amber-900/60">
                  {theme.shortLabel} {Math.min(themeCounts[i], THEME_BADGE_THRESHOLD)}/{THEME_BADGE_THRESHOLD}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-full border border-amber-800/25 bg-white/50 px-4 py-2.5 text-sm font-medium text-amber-900/70 backdrop-blur-lg transition hover:bg-white/70"
      >
        シール帳を開く(全{totalBadges}件)
      </button>

      {open && <StickerBookModal progress={progress} onClose={() => setOpen(false)} />}
    </div>
  );
}
