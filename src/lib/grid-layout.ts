/**
 * カードグリッドの列数を件数に合わせ、最終段に余り(1〜2個だけ寂しく残る)を作らないための計算(P1)。
 *
 * 通常の段は `columns` 列。余り `remainder` 個の最終段は、列トラックを `trackCount` 本に細分して
 * 各カードの幅を伸ばし、行全体を埋める。
 * 例) 77件・3列 → 余り2個。6本のトラックを使い、通常カードは2本分、最終段の2枚は3本分の幅になる。
 */
export type GridLayout = {
  columns: number;
  trackCount: number;
  normalSpan: number;
  lastSpan: number;
  /** 最終段(余りの段)に入るカードの先頭インデックス。余りが無ければ itemCount と同値 */
  lastRowStart: number;
};

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** 件数が割り切れる列数があればそれを、無ければ3列を採用する */
export function pickColumns(itemCount: number, candidates: number[] = [4, 3, 2]): number {
  for (const columns of candidates) {
    if (itemCount >= columns && itemCount % columns === 0) return columns;
  }
  return 3;
}

export function computeGridLayout(itemCount: number): GridLayout {
  const columns = pickColumns(itemCount);
  const remainder = itemCount % columns;
  if (remainder === 0 || itemCount < columns) {
    return { columns, trackCount: columns, normalSpan: 1, lastSpan: 1, lastRowStart: itemCount };
  }
  const lcm = (columns * remainder) / gcd(columns, remainder);
  return {
    columns,
    trackCount: lcm,
    normalSpan: lcm / columns,
    lastSpan: lcm / remainder,
    lastRowStart: itemCount - remainder,
  };
}
