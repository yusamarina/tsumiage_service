import { LogEntry } from "./types";

// サンプル用のダミーログ。日付は「アプリを開いた日」を基準に生成し、
// いつアクセスしても直近2週間強のログに見えるようにする。
// 今日・昨日は空けておき、サンプルだけで「今日も記録した」ように見えないようにする。
// hourは同日内の登録順(=タイムライン上での並び順)を決めるための補助。省略時は9時扱い。
const SAMPLE_ENTRIES: (Omit<LogEntry, "id" | "date" | "createdAt"> & { hour?: number })[] = [
  { task: "スタート画面のオンボーディング構成を検討した", reflection: "画面を増やすほど離脱リスクも上がるので、競合調査の結果も踏まえて2枚に絞り込んだ" },
  { task: "ホーム画面のエージェント統合を要件定義した", reflection: "複数体いたエージェントを1体に絞ることで、サービスの魅力をシンプルに伝えられるようにした" },
  { task: "ヒアリングシートの設問順序を設計した", reflection: "答えやすい質問を先に聞くことで、心理的ハードルを下げる工夫をした" },
  { task: "PBIの優先順位をKPIベースで整理した", reflection: "応募率への貢献度という軸で、感覚ではなく指標をもとに判断した" },
  { task: "ToDoリスト機能の実装を見送る判断をした", reflection: "再訪問率は上がりそうだったが、応募率への直接貢献が薄いと判断して見送った" },
  { task: "リリースに向けてロードマップを見直した", reflection: "全部やりたい気持ちを抑えて、事業指標に効くものだけ残した" },
  { task: "エンジニアと仕様のすり合わせをした", reflection: "一方的に仕様を渡すのではなく、意見を聞きながら一緒に固めることを意識した" },
  { task: "グッドデザイン賞のパネル構成を1週間で仕上げた", reflection: "デザイン未経験だったので、伝えたいことを明確にする工夫を重ねた", hour: 10 },
  { task: "1on1でチームメンバーの相談に乗った", reflection: "アドバイスより先に、状況を最後まで聞くことを意識した" },
  { task: "リリース後の振り返りMTGをファシリテートした", reflection: "数字だけでなく、ユーザーからの反応も交えて良かった点を伝えるようにした" },
  // 同じ日付に2件目を記録した場合のグルーピング表示を確認するためのサンプル(グッドデザイン賞の日の夕方に追加で記録)
  { task: "採用ページの表記ゆれを確認した", reflection: "細かい言い回しのブレを一つずつ直した", hour: 17 },
];

// 昨日より前(2日前〜)の日にログがある想定。最後の要素は8つ前と同じ日付にして、同日2件のサンプルを作る
const DAYS_AGO_OFFSETS = [15, 13, 11, 10, 9, 8, 7, 6, 4, 2, 6];

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function buildSeedEntries(): LogEntry[] {
  const now = new Date();
  return SAMPLE_ENTRIES.map((entry, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - DAYS_AGO_OFFSETS[i]);
    const date = toDateString(d);
    const hour = entry.hour ?? 9;
    return {
      id: `seed-${i}`,
      date,
      task: entry.task,
      reflection: entry.reflection,
      createdAt: new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`).toISOString(),
    };
  });
}
