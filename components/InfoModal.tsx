"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function InfoModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] backdrop-blur-3xl backdrop-saturate-200 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-700">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-stone-200 bg-white/70 px-3 py-1 text-xs font-medium text-stone-500 transition hover:bg-white"
          >
            閉じる
          </button>
        </div>
        <div className="mt-4 text-sm leading-relaxed text-stone-500">{children}</div>
      </div>
    </div>,
    document.body
  );
}
