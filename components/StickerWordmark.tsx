const CHARS = ["つ", "み", "あ", "げ"];
const ROTATIONS = [-8, 6, -5, 9];
const OFFSETS_Y = [0, -3, 2, -2];
const COLORS = ["#5457DE", "#31BFAE", "#818cf8", "#14b8a6"];

function CharSticker({
  char,
  color,
  rotate,
  offsetY,
}: {
  char: string;
  color: string;
  rotate: number;
  offsetY: number;
}) {
  return (
    <span
      className="inline-block"
      style={{ transform: `rotate(${rotate}deg) translateY(${offsetY}px)` }}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] lg:h-13 lg:w-13">
        {/* 文字の形そのままの白フチ(シールの縁取り) */}
        <text
          x="22"
          y="32"
          textAnchor="middle"
          fontSize="30"
          fontWeight="bold"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth={7}
          strokeLinejoin="round"
        >
          {char}
        </text>

        <text x="22" y="32" textAnchor="middle" fontSize="30" fontWeight="bold" fill={color}>
          {char}
        </text>
      </svg>
    </span>
  );
}

export default function StickerWordmark({ animated = false }: { animated?: boolean }) {
  return (
    <div className="flex items-end">
      {CHARS.map((char, i) =>
        animated ? (
          <span key={i} className="animate-sticker-hop" style={{ animationDelay: `${i * 0.12}s` }}>
            <CharSticker
              char={char}
              color={COLORS[i % COLORS.length]}
              rotate={ROTATIONS[i % ROTATIONS.length]}
              offsetY={OFFSETS_Y[i % OFFSETS_Y.length]}
            />
          </span>
        ) : (
          <CharSticker
            key={i}
            char={char}
            color={COLORS[i % COLORS.length]}
            rotate={ROTATIONS[i % ROTATIONS.length]}
            offsetY={OFFSETS_Y[i % OFFSETS_Y.length]}
          />
        )
      )}
    </div>
  );
}
