import { Badge } from "@/lib/badges";
import StickerIcon from "./StickerIcon";

export type ToastPayload = { badge: Badge | null; message: string; key: number };

export default function LogToast({ payload }: { payload: ToastPayload | null }) {
  if (!payload) return null;

  return (
    <div
      key={payload.key}
      className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center sm:inset-x-auto sm:right-6"
    >
      <div className="animate-toast flex max-w-sm items-center gap-3 rounded-2xl border border-rose-200/80 bg-white/90 px-4 py-3 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.9),0_20px_45px_-16px_rgba(190,18,60,0.45)] backdrop-blur-2xl backdrop-saturate-200">
        {payload.badge ? (
          <>
            <span className="text-xl leading-none">🎉</span>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <StickerIcon
                id={payload.badge.threshold}
                className="h-9 w-9 drop-shadow-[0_3px_6px_rgba(190,18,60,0.4)]"
              />
            </div>
            <p className="text-sm font-medium text-stone-700">
              新しいバッジ「{payload.badge.label}」を獲得しました
            </p>
          </>
        ) : (
          <>
            <span className="text-xl leading-none">✅</span>
            <p className="text-sm font-medium text-stone-700">{payload.message}</p>
          </>
        )}
      </div>
    </div>
  );
}
