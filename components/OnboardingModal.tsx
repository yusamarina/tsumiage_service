"use client";

import { createPortal } from "react-dom";
import MascotFace from "./MascotFace";

const STEPS = [
  "今日やったことを、ひとつだけ記録",
  "続けるほど、シールやバッジが増えていく",
  "記録が貯まるとAIが振り返り!",
];

const PRO_FEATURES = ["AIが次にやるといいことを教えてくれます", "他の人の積み上げの特徴や職種などがわかります"];

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-6 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] backdrop-blur-3xl backdrop-saturate-200 sm:p-8"
      >
        <div className="flex justify-center">
          <MascotFace className="h-16 w-16" />
        </div>
        <h2 className="mt-3 text-base font-bold text-stone-700">「つみあげ」の使い方</h2>
        <div className="mt-5 space-y-3 text-left">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-snug text-stone-600">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-left">
          <span className="inline-block whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            Proプラン限定
          </span>
          <ul className="mt-2 space-y-1.5">
            {PRO_FEATURES.map((feature, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm leading-snug text-stone-600">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          始める
        </button>
      </div>
    </div>,
    document.body
  );
}
