import { LogEntry } from "./types";
import { formatDate } from "./date";
import { THEMES, themeEntryCount } from "./tags";

// 本番(マネタイズ後)はここをClaude API呼び出しに差し替える想定。
// 公開デモではAPIコストをかけずに済むよう、実際のログ内容を読み取って
// 反応するルールベースのロジックで代替している。

export type SummarySection = { title: string; body: string };

export async function buildMockSummary(entries: LogEntry[]): Promise<SummarySection[]> {
  // AIが読み込んで考えている体験を演出するための短い間(実際のAPI呼び出しでも同程度の待ち時間が発生する)
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (entries.length === 0) {
    return [{ title: "", body: "記録が集まったら、ここに振り返りが表示されます。" }];
  }

  const sorted = entries.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const matched: { label: string; example: LogEntry }[] = [];
  for (const theme of THEMES) {
    if (matched.length >= 2) break;
    const hit = sorted.find(
      (e) => theme.pattern.test(e.reflection) && !matched.some((m) => m.example.id === e.id)
    );
    if (hit) matched.push({ label: theme.label, example: hit });
  }

  const intro = `${formatDate(first.date)}から${formatDate(last.date)}までの${entries.length}件の記録を読み返すと、いくつか繰り返し出てくるパターンがあります。`;

  if (matched.length === 0) {
    return [{ title: "", body: `${intro}まだ明確な傾向は見えていませんが、記録が増えるほど積み上がりが見えやすくなります。` }];
  }

  const body = matched
    .map(
      (m) =>
        `${formatDate(m.example.date)}に「${m.example.task}」で「${m.example.reflection}」と書いていましたが、これは${m.label}が発揮された場面です。`
    )
    .join("");

  // 記録の中で一番出現の少ないテーマを、次に伸ばすと良い分野として提案する
  const weakest = THEMES.slice()
    .map((theme) => ({ theme, count: themeEntryCount(theme, sorted) }))
    .sort((a, b) => a.count - b.count)[0];
  const advice = `次のステップとして、${weakest.theme.shortLabel}の場面を意識的に増やしてみるのはどうでしょう。${weakest.theme.advice}。`;

  return [
    { title: "見つかった傾向", body: `${intro}${body}一つひとつは小さな判断ですが、積み重なると確かな傾向になっています。` },
    { title: "次に伸ばすと良い分野", body: advice },
  ];
}
