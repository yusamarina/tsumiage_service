"use client";

import { useEffect, useState } from "react";
import MascotFace from "./MascotFace";
import StickerWordmark from "./StickerWordmark";

const VISIBLE_MS = 2400;
const FADE_MS = 500;

export default function SplashScreen({
  onFadeStart,
  onDone,
}: {
  onFadeStart: () => void;
  onDone: () => void;
}) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // フェード開始と同時に裏でオンボーディングを表示しておくことで、フェード中に
    // 透けて見えるのが素のホーム画面ではなくオンボーディングの背景になるようにする
    const fadeTimer = setTimeout(() => {
      setFading(true);
      onFadeStart();
    }, VISIBLE_MS);
    const doneTimer = setTimeout(onDone, VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFadeStart, onDone]);

  return (
    <div
      data-testid="splash-screen"
      className={`pointer-events-none fixed inset-0 z-[100] overflow-hidden transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 背景はテキストと別レイヤーに分離する(blurブロブと同じ描画コンテキストに文字を置くと、
          ヘッドレスChromiumのスクリーンショットで文字が描画されない不具合を確認したため) */}
      <div aria-hidden className="absolute inset-0 bg-[#f6f5f3]">
        <div className="absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-violet-400/35 blur-[110px]" />
        <div className="absolute -right-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-indigo-400/30 blur-[120px]" />
        <div className="absolute bottom-[-8rem] left-1/4 h-[26rem] w-[26rem] rounded-full bg-teal-300/30 blur-[110px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5">
        <MascotFace className="h-24 w-24 drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]" />
        <StickerWordmark animated />
        <p className="max-w-xs px-6 text-center text-sm font-medium text-stone-600">
          今日やったこと、ひとつだけ書けばいい。あとはつみあがるのを待つだけ。
        </p>
      </div>
    </div>
  );
}
