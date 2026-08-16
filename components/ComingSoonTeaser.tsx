import { THEMES, MYSTERY_ICON_IDS } from "@/lib/tags";
import MascotFace from "./MascotFace";

// シール帳の「得意分野」欄は実テーマ5種+未発見枠15種の計20枠(StickerBookModal/BadgeCollectionと同じ数え方)
const TOTAL_THEME_BADGES = THEMES.length + MYSTERY_ICON_IDS.length;

// 「みんなのつみあげ」構想の予告。実装はまだなく、方向性を示すだけの控えめな見た目にする
// 個別の記録内容(生の日報テキスト)はプライバシー上見せず、属性レベルの情報にとどめる想定
const SAMPLE_PEERS = [
  {
    role: "PMディレクター(5年目)",
    count: 320,
    salaryBand: "700万円台",
    mainFocus: "プロダクト戦略",
    similarWork: ["ロードマップ作成", "ステークホルダー調整"],
    themeBadgeCount: 16,
    mascotColors: {
      bodyColor: "#7dd3fc",
      innerEarColor: "#e0f2fe",
      antennaColor: "#0ea5e9",
      smileColor: "#0369a1",
      variant: "leaf" as const,
    },
  },
  {
    role: "UXデザイナー(3年目)",
    count: 180,
    salaryBand: "550万円台",
    mainFocus: "UIデザイン",
    similarWork: ["デザインカンプ作成", "ユーザーインタビュー"],
    themeBadgeCount: 11,
    mascotColors: {
      bodyColor: "#86efac",
      innerEarColor: "#dcfce7",
      antennaColor: "#22c55e",
      smileColor: "#15803d",
      variant: "twin" as const,
    },
  },
];

export default function ComingSoonTeaser() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-stone-300/80 bg-white/20 p-5 backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-stone-500">みんなのつみあげ</h2>
        <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm shadow-amber-500/30">
          Pro限定
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-stone-500">
        同じ職種の人が、どんな仕事をつみあげてスキルを伸ばしているかを覗ける機能を検討中です。つみあげの記録が、次のキャリアを考えるヒントになる未来を目指しています。
      </p>

      <div className="relative mt-4 space-y-2 opacity-70 blur-[0.5px]" aria-hidden>
        {SAMPLE_PEERS.map((peer) => (
          <div
            key={peer.role}
            className="flex gap-2.5 rounded-xl border border-white/70 bg-white/40 px-3 py-2 text-xs text-stone-500"
          >
            <MascotFace className="h-9 w-9 shrink-0" animated={false} {...peer.mascotColors} />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-stone-600">{peer.role}</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="inline-block whitespace-nowrap rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] text-stone-500">
                  つみあげ {peer.count}件
                </span>
                <span className="inline-block whitespace-nowrap rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] text-stone-500">
                  想定年収帯 {peer.salaryBand}
                </span>
                <span className="inline-block whitespace-nowrap rounded-full bg-rose-100/70 px-2 py-0.5 text-[10px] text-rose-500">
                  得意分野バッジ {peer.themeBadgeCount}/{TOTAL_THEME_BADGES}
                </span>
              </div>
              <p className="mt-1.5 text-stone-500">
                メインのつみあげ: <span className="font-medium text-stone-600">{peer.mainFocus}</span>
              </p>
              <p className="mt-0.5 text-stone-500">
                似ているつみあげ内容: {peer.similarWork.join(" / ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-stone-500">
        ※実データではなく、構想イメージのサンプルです。個別の記録内容ではなく、大まかな傾向のみ表示する想定です
      </p>
    </div>
  );
}
