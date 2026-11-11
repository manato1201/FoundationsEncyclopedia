// サイトのマーク(「F」+ HUD のコーナーブラケット(青))。icon.svg と同じ図形を、ImageResponse(apple-icon・PWA・OGP)でも使う。
// 図形を変えるときは icon.svg も同じにする(DESIGN.md「アイコン」)。

export const MARK_COLORS = { tile: "#05070c", ink: "#eaf0f7", accent: "#3ba7ff" } as const;

/**
 * 32x32 の格子で描いたマーク。`rx` はタイルの角丸。
 * `inset` は、全面を塗るアイコン(iOS・maskable)で、マークを内側へ縮める割合(0〜0.3)。
 */
export function MarkSvg({
  size,
  rx = 7,
  inset = 0,
  colors = MARK_COLORS,
}: {
  size: number;
  rx?: number;
  inset?: number;
  colors?: { tile: string; ink: string; accent: string };
}) {
  const s = 1 - inset * 2;
  const t = 16 * (1 - s);
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx={rx} fill={colors.tile} />
      <g transform={`translate(${t} ${t}) scale(${s})`}>
        <path d="M12 24V9h9M12 16h6.5" fill="none" stroke={colors.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 11V5h6" fill="none" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27 21v6h-6" fill="none" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
