import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "つみあげ | 日々の記録から気づく成長ログ",
  description: "今日の1つを記録するだけで、気づかないうちに積み上がった成長をAIが見つけてくれるログアプリ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div aria-hidden className="fixed inset-0 -z-10 bg-[#f6f5f3]" />
        <div
          aria-hidden
          className="fixed -left-40 -top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-violet-400/35 blur-[110px]"
        />
        <div
          aria-hidden
          className="fixed -right-32 top-1/4 -z-10 h-[30rem] w-[30rem] rounded-full bg-pink-400/30 blur-[120px]"
        />
        <div
          aria-hidden
          className="fixed bottom-[-8rem] left-1/4 -z-10 h-[26rem] w-[26rem] rounded-full bg-orange-300/30 blur-[110px]"
        />
        {children}
      </body>
    </html>
  );
}
