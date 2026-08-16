// まんまるボディ+丸耳+先端が光る触角で、実在の動物に寄せすぎない架空の生き物にする
// variantは色とは独立して見た目(耳・触角・目)を変える。将来「自分のキャラを選ぶ」設定を想定した種類分け
type Variant = "round" | "twin" | "leaf";

const BODY_POOFS: Record<Variant, { cx: number; cy: number; r: number }[]> = {
  round: [
    { cx: 50, cy: 58, r: 33 },
    { cx: 27, cy: 28, r: 13 },
    { cx: 73, cy: 28, r: 13 },
  ],
  twin: [
    { cx: 50, cy: 58, r: 33 },
    { cx: 21, cy: 33, r: 10.5 },
    { cx: 79, cy: 33, r: 10.5 },
  ],
  leaf: [
    { cx: 50, cy: 58, r: 33 },
    { cx: 31, cy: 22, r: 11 },
    { cx: 69, cy: 22, r: 11 },
  ],
};

const EAR_INNER: Record<Variant, { cx: number; cy: number; rx: number; ry: number }[]> = {
  round: [
    { cx: 27, cy: 30, rx: 5.5, ry: 6.5 },
    { cx: 73, cy: 30, rx: 5.5, ry: 6.5 },
  ],
  twin: [
    { cx: 21, cy: 35, rx: 4, ry: 5.5 },
    { cx: 79, cy: 35, rx: 4, ry: 5.5 },
  ],
  leaf: [
    { cx: 31, cy: 24, rx: 4.5, ry: 8.5 },
    { cx: 69, cy: 24, rx: 4.5, ry: 8.5 },
  ],
};

function Antenna({ color, variant }: { color: string; variant: Variant }) {
  if (variant === "twin") {
    return (
      <>
        <g fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round">
          <path d="M40 16L32 0" />
          <path d="M60 16L68 0" />
        </g>
        <g fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
          <path d="M40 16L32 0" />
          <path d="M60 16L68 0" />
        </g>
        <circle cx="32" cy="0" r="3.6" fill="#ffffff" />
        <circle cx="32" cy="0" r="3.6" fill={color} />
        <circle cx="68" cy="0" r="3.6" fill="#ffffff" />
        <circle cx="68" cy="0" r="3.6" fill={color} />
      </>
    );
  }
  if (variant === "leaf") {
    return (
      <>
        <g fill="#ffffff" stroke="#ffffff" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
          <path d="M50 10Q42 -2 47 -8Q52 -2 50 10Z" />
        </g>
        <g fill={color} stroke="none">
          <path d="M50 10Q42 -2 47 -8Q52 -2 50 10Z" />
        </g>
      </>
    );
  }
  return (
    <>
      <g fill="#ffffff" stroke="#ffffff" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
        <path d="M50 12Q56 2 55 -3" />
      </g>
      <g fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round">
        <path d="M50 12Q56 2 55 -3" />
      </g>
      <circle cx="55" cy="-3" r="4.5" fill="#ffffff" />
      <circle cx="55" cy="-3" r="4.5" fill={color} />
      <circle cx="53.7" cy="-4.3" r="1.4" fill="#ffffff" />
    </>
  );
}

function Eyes({ animated, variant }: { animated: boolean; variant: Variant }) {
  const blinkClass = animated ? "animate-mascot-blink" : "";
  if (variant === "twin") {
    // 少し吊り上がったアーモンド形の目で、きょとん・驚き顔にする
    return (
      <>
        <g className={blinkClass} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
          <ellipse cx="37" cy="58" rx="7" ry="8.5" fill="#ffffff" transform="rotate(-8 37 58)" />
          <circle cx="38.5" cy="60" r="3.8" fill="#44403c" />
          <circle cx="36.5" cy="57" r="1.5" fill="#ffffff" />
        </g>
        <g className={blinkClass} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
          <ellipse cx="63" cy="58" rx="7" ry="8.5" fill="#ffffff" transform="rotate(8 63 58)" />
          <circle cx="61.5" cy="60" r="3.8" fill="#44403c" />
          <circle cx="63.5" cy="57" r="1.5" fill="#ffffff" />
        </g>
      </>
    );
  }
  return (
    <>
      <g className={blinkClass} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <circle cx="38" cy="58" r="8" fill="#ffffff" />
        <circle cx="40" cy="59.5" r="4.2" fill="#44403c" />
        <circle cx="38" cy="56" r="1.7" fill="#ffffff" />
      </g>
      <g className={blinkClass} style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <circle cx="62" cy="58" r="8" fill="#ffffff" />
        <circle cx="64" cy="59.5" r="4.2" fill="#44403c" />
        <circle cx="62" cy="56" r="1.7" fill="#ffffff" />
      </g>
    </>
  );
}

export default function MascotFace({
  className = "h-14 w-14",
  bodyColor = "#f9a8d4",
  innerEarColor = "#fecdd3",
  antennaColor = "#c4b5fd",
  smileColor = "#be185d",
  animated = true,
  variant = "round",
}: {
  className?: string;
  bodyColor?: string;
  innerEarColor?: string;
  antennaColor?: string;
  smileColor?: string;
  animated?: boolean;
  variant?: Variant;
}) {
  const poofs = BODY_POOFS[variant];
  const ears = EAR_INNER[variant];

  return (
    <div className={`relative shrink-0 ${animated ? "animate-mascot-float" : ""} ${className}`}>
      <svg viewBox="0 -10 100 110" className="h-full w-full drop-shadow-md" aria-hidden>
        <Antenna color={antennaColor} variant={variant} />

        <g fill="#ffffff" stroke="#ffffff" strokeWidth="7" strokeLinejoin="round">
          {poofs.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
          ))}
        </g>
        <g fill={bodyColor}>
          {poofs.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
          ))}
        </g>

        {ears.map((e, i) => (
          <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill={innerEarColor} opacity="0.9" />
        ))}

        <ellipse cx="29" cy="68" rx="6.5" ry="4" fill="#fb7185" opacity="0.55" />
        <ellipse cx="71" cy="68" rx="6.5" ry="4" fill="#fb7185" opacity="0.55" />

        <Eyes animated={animated} variant={variant} />

        <path d="M45 73Q50 78 55 73" fill="none" stroke={smileColor} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
