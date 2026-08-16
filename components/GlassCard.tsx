import { ReactNode } from "react";

export const glassCardClass =
  "relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/35 backdrop-blur-3xl backdrop-saturate-200 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.9),inset_-1px_-1px_1px_rgba(0,0,0,0.04),0_25px_60px_-25px_rgba(0,0,0,0.35)]";

export function GlassHighlight() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/70 blur-2xl"
    />
  );
}

export default function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${glassCardClass} ${className}`}>
      <GlassHighlight />
      <div className="relative">{children}</div>
    </div>
  );
}
