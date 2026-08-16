import { LogEntry } from "./types";

// 振り返り文のキーワードから成長パターンを判定する定義。
// AI要約(mockSummary.ts)と記録一覧のタグ表示の両方から参照する共通ロジック。
export type Theme = {
  pattern: RegExp;
  label: string; // AI要約の文章で使う長め表現
  shortLabel: string; // 記録一覧のタグで使う短い表現
  advice: string; // その分野が手薄なときのワンポイントアドバイス
};

export const THEMES: Theme[] = [
  {
    pattern: /(聞く|聞き|傾聴)/,
    label: "相手の話を先に聞く姿勢",
    shortLabel: "傾聴",
    advice: "ユーザーインタビューや1on1など、相手の話をじっくり聞く経験を増やすと、UXリサーチの解像度がさらに上がりそうです",
  },
  {
    pattern: /(優先順位|後回し|見送|絞|削る)/,
    label: "軸を決めて絞り込む判断力",
    shortLabel: "優先順位付け",
    advice: "ロードマップ策定やPBI整理など、複数の選択肢から取捨選択する経験を増やすと、事業判断の幅が広がりそうです",
  },
  {
    pattern: /(先回り|仮説|工夫)/,
    label: "先を見据えて工夫する視点",
    shortLabel: "先回り",
    advice: "仮説検証や競合調査など、先を見据えて動く経験を増やすと、意思決定のスピードと質がさらに上がりそうです",
  },
  {
    pattern: /(数字|KPI|指標|定量)/,
    label: "感覚でなく数字で語る姿勢",
    shortLabel: "数字で語る",
    advice: "KPI設計や指標をもとにした議論の経験を増やすと、事業インパクトをより説得力を持って語れるようになりそうです",
  },
  {
    pattern: /(伝え|説明|納得)/,
    label: "相手に合わせて伝え方を変える力",
    shortLabel: "伝え方の工夫",
    advice: "資料作成やプレゼンなど、相手に合わせて伝え方を変える経験を積むと、ステークホルダーマネジメントの幅が広がりそうです",
  },
];

export function tagsForEntry(entry: Pick<LogEntry, "reflection">): string[] {
  return THEMES.filter((theme) => theme.pattern.test(entry.reflection)).map((theme) => theme.shortLabel);
}

// 得意分野シール: 同じテーマが一定回数記録に登場したら、その分野のシールが増える
export const THEME_BADGE_THRESHOLD = 3;
// StickerIconの通常バッジ(1〜1000)と衝突しない専用ID帯
export const THEME_BADGE_ICON_IDS = [9001, 9002, 9003, 9004, 9005];

// まだ見つけていない得意分野の「?」枠。実データとは連動せず、コレクションの伸びしろを見せる演出用
export const MYSTERY_ICON_IDS = [1, 3, 7, 14, 30, 50, 100, 150, 200, 300, 500, 1000, 9001, 9002, 9003];

export function themeEntryCount(theme: Theme, entries: Pick<LogEntry, "reflection">[]): number {
  return entries.filter((e) => theme.pattern.test(e.reflection)).length;
}
