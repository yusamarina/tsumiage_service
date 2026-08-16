"use client";

import { useState } from "react";
import { LogEntry } from "@/lib/types";
import { formatDateParts } from "@/lib/date";
import { tagsForEntry } from "@/lib/tags";
import { updateEntry, deleteEntry } from "@/lib/store";
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from "./icons";

const PAGE_SIZE = 3;

function groupByDate(entries: LogEntry[]): { date: string; entries: LogEntry[] }[] {
  const groups: { date: string; entries: LogEntry[] }[] = [];
  for (const entry of entries) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === entry.date) {
      lastGroup.entries.push(entry);
    } else {
      groups.push({ date: entry.date, entries: [entry] });
    }
  }
  return groups;
}

export default function LogTimeline({ entries }: { entries: LogEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editReflection, setEditReflection] = useState("");

  if (entries.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-white/60 bg-white/40 p-6 text-center text-sm text-stone-500 backdrop-blur-lg">
        まだ記録がありません。今日の出来事を1つ書いてみましょう。
      </p>
    );
  }

  const sortedEntries = [...entries].sort((a, b) => (a.date === b.date ? (a.createdAt < b.createdAt ? 1 : -1) : a.date < b.date ? 1 : -1));
  const visibleEntries = expanded ? sortedEntries : sortedEntries.slice(0, PAGE_SIZE);
  const hiddenCount = sortedEntries.length - visibleEntries.length;
  const groups = groupByDate(visibleEntries);

  function startEdit(entry: LogEntry) {
    setEditingId(entry.id);
    setEditTask(entry.task);
    setEditReflection(entry.reflection);
    setConfirmingId(null);
  }

  function saveEdit(id: string) {
    if (!editTask.trim()) return;
    updateEntry(id, { task: editTask.trim(), reflection: editReflection.trim() });
    setEditingId(null);
  }

  function handleDeleteClick(id: string) {
    if (confirmingId === id) {
      deleteEntry(id);
      setConfirmingId(null);
    } else {
      setConfirmingId(id);
      setEditingId(null);
    }
  }

  return (
    <div>
      <ul className="space-y-3">
        {groups.map((group) => {
          const { month, day, weekday } = formatDateParts(group.date);

          return (
            <li
              key={group.date}
              className="flex gap-3 rounded-2xl border border-white/80 bg-white/40 p-4 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.9),inset_-1px_-1px_1px_rgba(0,0,0,0.04),0_15px_35px_-20px_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-200"
            >
              <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white/70 py-2">
                <span className="text-[10px] text-stone-500">{month}月</span>
                <span className="text-lg font-bold leading-tight text-stone-700">{day}</span>
                <span className="text-[10px] text-stone-500">({weekday})</span>
              </div>

              <div className="min-w-0 flex-1 divide-y divide-stone-200/60">
                {group.entries.map((entry, i) => {
                  const tags = tagsForEntry(entry);
                  const isEditing = editingId === entry.id;
                  const isConfirmingDelete = confirmingId === entry.id;

                  return (
                    <div key={entry.id} className={`flex items-center gap-3 ${i > 0 ? "pt-3" : ""}`}>
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div>
                              <div className="mb-1 flex items-baseline justify-between">
                                <label className="text-xs font-medium text-stone-500">今日やったこと</label>
                                <span className={`text-[10px] ${editTask.length >= 80 ? "text-rose-500" : "text-stone-500"}`}>
                                  {editTask.length}/80
                                </span>
                              </div>
                              <textarea
                                value={editTask}
                                onChange={(e) => setEditTask(e.target.value)}
                                placeholder="例:新機能の要件をチームに説明した"
                                rows={2}
                                maxLength={80}
                                className="w-full resize-none rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-stone-800 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
                              />
                            </div>
                            <div>
                              <div className="mb-1 flex items-baseline justify-between">
                                <label className="text-xs text-stone-500">一言振り返り(任意)</label>
                                <span className={`text-[10px] ${editReflection.length >= 100 ? "text-rose-500" : "text-stone-500"}`}>
                                  {editReflection.length}/100
                                </span>
                              </div>
                              <textarea
                                value={editReflection}
                                onChange={(e) => setEditReflection(e.target.value)}
                                rows={2}
                                maxLength={100}
                                placeholder="例:理由を聞いてから話せた"
                                className="w-full resize-none rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-500 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(entry.id)}
                                disabled={!editTask.trim()}
                                className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-1.5 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:from-stone-200 disabled:to-stone-200 disabled:text-stone-400"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded-full border border-stone-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-white"
                              >
                                キャンセル
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                              <p className="whitespace-pre-wrap text-sm font-semibold text-stone-800">{entry.task}</p>
                              {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="whitespace-nowrap rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-500"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {entry.reflection && (
                              <p className="mt-1.5 whitespace-pre-wrap border-l-2 border-rose-200/80 pl-2 text-sm text-stone-600">
                                {entry.reflection}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex shrink-0 items-center gap-1">
                          {isConfirmingDelete ? (
                            <>
                              <button
                                onClick={() => handleDeleteClick(entry.id)}
                                title="削除する"
                                className="rounded-full p-1.5 text-rose-500 transition hover:bg-rose-50"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmingId(null)}
                                title="キャンセル"
                                className="rounded-full p-1.5 text-stone-500 transition hover:bg-white/70 hover:text-stone-600"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(entry)}
                                title="編集"
                                className="rounded-full p-1.5 text-stone-500 transition hover:bg-white/70 hover:text-stone-600"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(entry.id)}
                                title="削除"
                                className="rounded-full p-1.5 text-stone-500 transition hover:bg-white/70 hover:text-rose-500"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-4 w-full rounded-full border border-white/70 bg-white/50 px-4 py-2.5 text-sm font-medium text-stone-600 backdrop-blur-lg transition hover:bg-white/70"
        >
          もっと見る({hiddenCount}件)
        </button>
      )}
      {expanded && sortedEntries.length > PAGE_SIZE && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-4 w-full rounded-full border border-white/70 bg-white/50 px-4 py-2.5 text-sm font-medium text-stone-600 backdrop-blur-lg transition hover:bg-white/70"
        >
          閉じる
        </button>
      )}
    </div>
  );
}
