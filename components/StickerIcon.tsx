"use client";

import { useId } from "react";

// バッジのしきい値ごとに対応する自作のシールイラスト(絵文字は使わない)
type Shape = {
  d: string;
  fill: string; // "none" は輪郭線のみのパス
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  transform?: string;
};

// 4枚の花びら状パーツを中心(12,12)を軸に回転させて並べる(四つ葉のクローバー用)
const CLOVER_PETAL = "M12 12C8.5 12 7 8 12 5C17 8 15.5 12 12 12Z";
const CLOVER_ANGLES = [0, 90, 180, 270];

// 5枚の花びらを中心(12,11)を軸に回転させて並べる(花用)
const FLOWER_PETAL = "M12 11C9 11 7.8 7.3 12 4C16.2 7.3 15 11 12 11Z";
const FLOWER_ANGLES = [0, 72, 144, 216, 288];

// 8本の光の線を中心(12,12)を軸に回転させて並べる(太陽用)
const SUN_RAY = "M12 4.5V1.5";
const SUN_RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const ICONS: Record<number, Shape[]> = {
  1: [
    { d: "M12 20V11", fill: "none", stroke: "#15803d", strokeWidth: 2 },
    { d: "M12 13c0-4 4-6 7-5-1 4-4 6-7 5z", fill: "#4ade80" },
    { d: "M12 15c0-3-3-5-6-4 1 3 3 5 6 4z", fill: "#86efac" },
  ],
  3: [
    { d: "M5.5 13a6.5 8.5 0 1 0 13 0 6.5 8.5 0 1 0-13 0Z", fill: "#fde68a" },
    { d: "M7.5 9a2 2.5 0 1 0 4 0 2 2.5 0 1 0-4 0Z", fill: "#fff7d6", opacity: 0.8 },
    { d: "M9.45 12a.55 .55 0 1 0 1.1 0 .55 .55 0 1 0-1.1 0Z", fill: "#f59e0b", opacity: 0.55 },
    { d: "M14 11.5a.5 .5 0 1 0 1 0 .5 .5 0 1 0-1 0Z", fill: "#f59e0b", opacity: 0.5 },
    { d: "M11 17a.5 .5 0 1 0 1 0 .5 .5 0 1 0-1 0Z", fill: "#f59e0b", opacity: 0.5 },
    { d: "M16 5.3L16.6 6.7L18 7.3L16.6 7.9L16 9.3L15.4 7.9L14 7.3L15.4 6.7Z", fill: "#ffffff" },
  ],
  7: [
    ...CLOVER_ANGLES.map((angle) => ({
      d: CLOVER_PETAL,
      fill: "#4ade80",
      transform: `rotate(${angle} 12 12)`,
    })),
    { d: "M12 17V21", fill: "none", stroke: "#15803d", strokeWidth: 1.6 },
  ],
  14: [
    { d: "M12 12.5V20", fill: "none", stroke: "#16a34a", strokeWidth: 1.6 },
    { d: "M12 17c0-2 2-3 4-2-1 2-2 3-4 2z", fill: "#22c55e" },
    ...FLOWER_ANGLES.map((angle) => ({
      d: FLOWER_PETAL,
      fill: "#fb7185",
      transform: `rotate(${angle} 12 11)`,
    })),
    { d: "M10.3 11a1.7 1.7 0 1 0 3.4 0 1.7 1.7 0 1 0-3.4 0Z", fill: "#fbbf24" },
  ],
  30: [{ d: "M12 2.5l2.7 6.6 7.1.6-5.4 4.6 1.6 6.9L12 17.4l-6 3.8 1.6-6.9-5.4-4.6 7.1-.6z", fill: "#fbbf24" }],
  50: [
    { d: "M7 4h10v5a5 5 0 01-10 0V4z", fill: "#f59e0b" },
    { d: "M7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3", fill: "none", stroke: "#f59e0b", strokeWidth: 1.4 },
    { d: "M10.5 14h3v4h-3z", fill: "#f59e0b" },
    { d: "M7.5 18h9v2.2h-9z", fill: "#d97706" },
  ],
  100: [
    { d: "M4 9.5l3.3 6.5h9.4l3.3-6.5-5.3 3.2-2.7-4.7-2.7 4.7z", fill: "#a78bfa" },
    { d: "M6 16.5h12v2.6H6z", fill: "#7c3aed" },
  ],
  150: [
    { d: "M12 3L18 9L12 21L6 9Z", fill: "#38bdf8" },
    { d: "M12 3L15 9H9Z", fill: "#bae6fd", opacity: 0.7 },
    { d: "M6 9H18", fill: "none", stroke: "#e0f2fe", strokeWidth: 0.8 },
  ],
  200: [
    { d: "M4 18A8 8 0 0 1 20 18", fill: "none", stroke: "#f87171", strokeWidth: 2.2 },
    { d: "M6 18A6 6 0 0 1 18 18", fill: "none", stroke: "#fbbf24", strokeWidth: 2.2 },
    { d: "M8 18A4 4 0 0 1 16 18", fill: "none", stroke: "#34d399", strokeWidth: 2.2 },
    { d: "M2.2 18a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0Z", fill: "#ffffff" },
    { d: "M18.2 18a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0Z", fill: "#ffffff" },
  ],
  300: [
    { d: "M15 9L4 20L11 13Z", fill: "#fde68a", opacity: 0.5 },
    { d: "M16 3l1.6 3.9L21.5 8l-3.9 1.6L16 13.5l-1.6-3.9L10.5 8l3.9-1.6z", fill: "#fbbf24" },
  ],
  500: [
    { d: "M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0Z", fill: "#fbbf24" },
    ...SUN_RAY_ANGLES.map((angle) => ({
      d: SUN_RAY,
      fill: "none",
      stroke: "#f59e0b",
      strokeWidth: 1.8,
      transform: `rotate(${angle} 12 12)`,
    })),
  ],
  1000: [
    { d: "M6 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z", fill: "#fbbf24" },
    { d: "M9 15.5L7 22L11 19Z", fill: "#dc2626" },
    { d: "M15 15.5L17 22L13 19Z", fill: "#b91c1c" },
    {
      d: "M12 6.5l1.1 2.8 3 .2-2.3 1.9.8 2.9-2.6-1.6-2.6 1.6.8-2.9-2.3-1.9 3-.2z",
      fill: "#fff7d6",
    },
  ],
  // 得意分野シール(lib/tags.ts の THEME_BADGE_ICON_IDS と対応): 傾聴
  9001: [
    { d: "M13 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z", fill: "#60a5fa" },
    { d: "M10 8A5 5 0 0 1 10 16", fill: "none", stroke: "#93c5fd", strokeWidth: 1.8 },
    { d: "M6 5A9 9 0 0 1 6 19", fill: "none", stroke: "#bfdbfe", strokeWidth: 1.8 },
  ],
  // 優先順位付け
  9002: [{ d: "M4 5h16l-6.5 8v6h-3v-6z", fill: "#fb923c" }],
  // 先回り
  9003: [
    { d: "M3 12L21 4L14 21L11 13L3 12Z", fill: "#38bdf8" },
    { d: "M11 13L14 21L14 14Z", fill: "#0ea5e9", opacity: 0.6 },
  ],
  // 数字で語る
  9004: [
    { d: "M5 19H9V15H5Z", fill: "#fbbf24" },
    { d: "M10.5 19H14.5V11H10.5Z", fill: "#fb923c" },
    { d: "M16 19H20V7H16Z", fill: "#ec4899" },
  ],
  // 伝え方の工夫
  9005: [
    { d: "M3 5H21V15H9L5 19V15H3Z", fill: "#f472b6" },
    {
      d: "M12 12.5c-1.5-1.5-3-1-3 .5 0 1.5 3 3 3 3s3-1.5 3-3c0-1.5-1.5-2-3-.5Z",
      fill: "#ffffff",
      opacity: 0.9,
    },
  ],
};

export default function StickerIcon({
  id,
  className = "h-full w-full",
  sparkle = false,
  shineDelay = 0,
}: {
  id: number;
  className?: string;
  sparkle?: boolean;
  shineDelay?: number;
}) {
  const uid = useId();
  const shapes = ICONS[id];
  if (!shapes) return null;

  const clipId = `sc-${id}-${uid}`;
  const gradientId = `sg-${id}-${uid}`;
  const filledShapes = shapes.filter((s) => s.fill !== "none");

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {sparkle && (
        <defs>
          <clipPath id={clipId}>
            {filledShapes.map((s, i) => (
              <path key={i} d={s.d} transform={s.transform} />
            ))}
          </clipPath>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      {/* シールの縁取り: 各パーツをイラストの形そのままに太い白フチでなぞる */}
      {shapes.map((s, i) => (
        <path
          key={`halo-${i}`}
          d={s.d}
          transform={s.transform}
          fill={s.fill === "none" ? "none" : "#ffffff"}
          stroke="#ffffff"
          strokeWidth={(s.strokeWidth ?? 0) + 3.2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}

      {shapes.map((s, i) => (
        <path
          key={`fill-${i}`}
          d={s.d}
          transform={s.transform}
          fill={s.fill}
          fillOpacity={s.opacity}
          stroke={s.stroke}
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {sparkle && (
        <g clipPath={`url(#${clipId})`}>
          <rect
            x="-6"
            y="-6"
            width="36"
            height="36"
            fill={`url(#${gradientId})`}
            style={{ animationDelay: `${shineDelay}s` }}
            className="sticker-shine-sweep"
          />
        </g>
      )}
    </svg>
  );
}
