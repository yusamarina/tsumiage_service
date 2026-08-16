"use client";

import { useEffect, useState } from "react";
import { useEntries } from "@/lib/useEntries";
import { useProgress } from "@/lib/useProgress";
import { addEntry, clearAllData, hasRecordedOnce } from "@/lib/store";
import { badgeUnlockedAt, randomEncouragement } from "@/lib/badges";
import LogForm from "@/components/LogForm";
import LogTimeline from "@/components/LogTimeline";
import WeeklySummary from "@/components/WeeklySummary";
import AccumulationHeatmap from "@/components/AccumulationHeatmap";
import BadgeCollection from "@/components/BadgeCollection";
import LogToast, { ToastPayload } from "@/components/LogToast";
import ComingSoonTeaser from "@/components/ComingSoonTeaser";
import GlassCard from "@/components/GlassCard";
import StickerWordmark from "@/components/StickerWordmark";
import InfoModal from "@/components/InfoModal";
import SplashScreen from "@/components/SplashScreen";
import OnboardingModal from "@/components/OnboardingModal";
import { UserIcon } from "@/components/icons";

type InfoPage = "mypage" | "terms" | "privacy" | "commerce" | null;

export default function Home() {
  const entries = useEntries();
  const progress = useProgress();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [infoPage, setInfoPage] = useState<InfoPage>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (hasRecordedOnce()) return;
    // キャンセル不可のマイクロタスクで遅延させる: setTimeoutだとStrict Modeの
    // 二重effect実行でクリーンアップにキャンセルされ、スプラッシュが出ないままになる
    queueMicrotask(() => setShowSplash(true));
  }, []);

  function handleAdd(entry: { date: string; task: string; reflection: string }) {
    const countBefore = entries.length;
    addEntry(entry);
    const unlocked = badgeUnlockedAt(countBefore + 1);
    setToast({ badge: unlocked, message: randomEncouragement(), key: Date.now() });
  }

  function handleClearAll() {
    clearAllData();
    setConfirmingClear(false);
    setInfoPage(null);
    setShowSplash(true);
  }

  function closeInfoModal() {
    setInfoPage(null);
    setConfirmingClear(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-8 lg:py-14">
      {showSplash && (
        <SplashScreen
          onDone={() => {
            setShowSplash(false);
            setShowOnboarding(true);
          }}
        />
      )}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <header className="mb-10 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <StickerWordmark />
          <p className="mt-3 text-sm font-medium text-stone-600 lg:text-base">
            今日やったこと、ひとつだけ書けばいい。あとはつみあがるのを待つだけ。
          </p>
        </div>
        <nav className="pt-2">
          <button
            onClick={() => setInfoPage("mypage")}
            title="マイページ"
            aria-label="マイページ"
            className="rounded-full border border-white/70 bg-white/50 p-2.5 text-stone-500 shadow-sm backdrop-blur-lg transition hover:bg-white/80 hover:text-stone-700"
          >
            <UserIcon className="h-4 w-4" />
          </button>
        </nav>
      </header>

      <div className="mb-6">
        <LogForm onSubmit={handleAdd} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-8">
        <div className="space-y-6 lg:sticky lg:top-10">
          <BadgeCollection progress={progress} />
          <GlassCard className="p-5 sm:p-6">
            <AccumulationHeatmap entries={entries} />
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-5 sm:p-6">
            <WeeklySummary entries={entries} />
          </GlassCard>
          <ComingSoonTeaser />
          <div>
            <h2 className="mb-3 text-sm font-semibold text-stone-700">これまでの記録</h2>
            <LogTimeline entries={entries} />
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-stone-500">
        <p>このデモには最初からサンプルの記録が入っています。追加した記録はあなたのブラウザにのみ保存されます。</p>
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <button onClick={() => setInfoPage("terms")} className="transition hover:text-stone-600 hover:underline">
            利用規約
          </button>
          <button onClick={() => setInfoPage("privacy")} className="transition hover:text-stone-600 hover:underline">
            プライバシーポリシー
          </button>
          <button onClick={() => setInfoPage("commerce")} className="transition hover:text-stone-600 hover:underline">
            特定商取引法に基づく表記
          </button>
        </nav>
      </footer>

      <LogToast payload={toast} />

      {infoPage === "mypage" && (
        <InfoModal title="マイページ" onClose={closeInfoModal}>
          <p>
            このデモにはログイン機能がなく、記録はすべてお使いのブラウザ内にのみ保存されています。
            実際のリリース時には、ここでプロフィールや通知設定、Proプランの契約状況などを管理できるようになる想定です。
          </p>

          <div className="mt-5 border-t border-stone-200/80 pt-4">
            <p className="text-xs font-semibold text-stone-600">退会</p>
            <p className="mt-1 text-xs text-stone-500">
              このデモにはアカウントがないため、退会するとこのブラウザに保存されている記録・シール・バッジなどの情報がすべて削除されます。退会後は初回アクセス時と同じ、サンプルデータ入りの状態に戻ります。
            </p>
            {confirmingClear ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-stone-500">本当に退会しますか？</span>
                <button
                  onClick={handleClearAll}
                  className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-600"
                >
                  退会する
                </button>
                <button
                  onClick={() => setConfirmingClear(false)}
                  className="text-xs text-stone-500 transition hover:text-stone-600"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingClear(true)}
                className="mt-2 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-500 transition hover:bg-rose-50"
              >
                退会する
              </button>
            )}
          </div>
        </InfoModal>
      )}
      {infoPage === "terms" && (
        <InfoModal title="利用規約" onClose={closeInfoModal}>
          このページは選考課題として作成したデモのため、実際の利用規約は掲載していません。
          実際にサービスとして提供する場合は、ここに禁止事項や免責事項などの利用条件を記載する想定です。
        </InfoModal>
      )}
      {infoPage === "privacy" && (
        <InfoModal title="プライバシーポリシー" onClose={closeInfoModal}>
          このデモでは、記録した内容はお使いのブラウザのlocalStorage内にのみ保存され、外部のサーバーには一切送信されません。
          正式な条文はまだ用意しておらず、実際にサービスとして提供する場合は、取得する情報の範囲や利用目的をここに記載する想定です。
        </InfoModal>
      )}
      {infoPage === "commerce" && (
        <InfoModal title="特定商取引法に基づく表記" onClose={closeInfoModal}>
          このページは選考課題として作成したデモのため、特定商取引法に基づく実際の表記は掲載していません。
          実際にProプランを提供する場合は、事業者名・所在地・連絡先・販売価格・支払い方法などをここに記載する想定です。
        </InfoModal>
      )}
    </main>
  );
}
