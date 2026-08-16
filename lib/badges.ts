export type Badge = {
  threshold: number;
  label: string;
};

// 記録数に応じた段階的なバッジ。種→芽→木→星…と「成長」のメタファーで揃えている。
// ストリークのような「途切れたら失う」仕組みにはせず、一度獲得したら消えない設計にする
// (つみあげのコンセプトと矛盾しないように)。
// 各バッジのイラストは components/StickerIcon.tsx 側で threshold をキーに自作している。
export const BADGES: Badge[] = [
  { threshold: 1, label: "はじめの一歩" },
  { threshold: 3, label: "習慣のたまご" },
  { threshold: 7, label: "1週間の積み上げ" },
  { threshold: 14, label: "2週間の積み上げ" },
  { threshold: 30, label: "ひと月の積み上げ" },
  { threshold: 50, label: "積み上げ50" },
  { threshold: 100, label: "積み上げマスター" },
  { threshold: 150, label: "積み上げ150" },
  { threshold: 200, label: "積み上げ200" },
  { threshold: 300, label: "積み上げ300" },
  { threshold: 500, label: "積み上げ500" },
  { threshold: 1000, label: "積み上げの伝説" },
];

export function earnedBadges(count: number): Badge[] {
  return BADGES.filter((b) => count >= b.threshold);
}

export function badgeUnlockedAt(count: number): Badge | null {
  return BADGES.find((b) => b.threshold === count) ?? null;
}

const ENCOURAGEMENTS = [
  "今日も一つ、積み上がりました。",
  "小さな一歩も、ちゃんと記録されています。",
  "また一つ、あなたの歩みが刻まれました。",
  "続けている、それ自体が積み上げです。",
  "今日の記録、未来のあなたが読み返します。",
  "また一つ積み上がった。よくやりました。",
];

export function randomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}
