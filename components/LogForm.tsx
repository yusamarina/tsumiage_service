"use client";

import { useState } from "react";
import { GlassHighlight } from "./GlassCard";
import MascotFace from "./MascotFace";

type Props = {
  onSubmit: (entry: { date: string; task: string; reflection: string }) => void;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LogForm({ onSubmit }: Props) {
  const [task, setTask] = useState("");
  const [reflection, setReflection] = useState("");

  const canSubmit = task.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ date: today(), task: task.trim(), reflection: reflection.trim() });
    setTask("");
    setReflection("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border-2 border-indigo-400/80 bg-gradient-to-br from-indigo-50/70 via-white/50 to-teal-50/60 p-5 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.9),inset_-1px_-1px_1px_rgba(0,0,0,0.04),0_0_0_6px_rgba(129,140,248,0.15),0_25px_60px_-20px_rgba(79,70,229,0.55)] backdrop-blur-3xl backdrop-saturate-200 sm:p-6"
    >
      <GlassHighlight />
      <div className="relative">
        <div className="mb-4 flex items-center justify-center gap-3">
          <MascotFace className="h-16 w-16" />
          <div className="relative rounded-2xl border border-white/70 bg-white/85 px-4 py-2 text-sm font-semibold text-stone-600 shadow-sm">
            <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-l border-white/70 bg-white/85" />
            今日の仕事内容を教えてください
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">今日やったこと</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="例:新機能の要件をチームに説明した"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-500 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              maxLength={80}
            />
            <div className="mt-1 flex items-center justify-end gap-2">
              {task.length >= 80 && (
                <p className="text-[10px] text-rose-500">これ以上入力できません(80文字まで)</p>
              )}
              <span className={`text-[10px] ${task.length >= 80 ? "text-rose-500" : "text-stone-500"}`}>
                {task.length}/80
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500">一言振り返り(任意)</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="例:理由を聞いてから話せた"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/50 bg-white/60 px-3 py-2 text-sm text-stone-700 placeholder:text-stone-500 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              maxLength={100}
            />
            <div className="mt-1 flex items-center justify-end gap-2">
              {reflection.length >= 100 && (
                <p className="text-[10px] text-rose-500">これ以上入力できません(100文字まで)</p>
              )}
              <span className={`text-[10px] ${reflection.length >= 100 ? "text-rose-500" : "text-stone-500"}`}>
                {reflection.length}/100
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.01] hover:shadow-indigo-600/50 disabled:cursor-not-allowed disabled:from-stone-200 disabled:to-stone-200 disabled:text-stone-400 disabled:shadow-none disabled:hover:scale-100 sm:w-80"
          >
            記録する
          </button>
        </div>
      </div>
    </form>
  );
}
