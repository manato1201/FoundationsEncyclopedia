import { asciiCrystal } from "@/lib/ascii-crystal";
import styles from "./AsciiCrystal.module.css";

type AsciiCrystalProps = {
  /** 文字数(横)。縦は約半分 */
  cols?: number;
  rows?: number;
  className?: string;
};

/**
 * 鉱石モチーフ(結晶の格子)の装飾。ヒーロー・空状態・404だけに置き、本文や操作部品には出さない。
 * 静止画1枚で、動かない(動きを減らす設定でも見た目が変わらない)。色は既存の青トークンだけ。
 * 意味は周囲の文章で伝わるので、補助技術からは隠す。
 */
export function AsciiCrystal({
  cols = 49,
  rows = 25,
  className,
}: AsciiCrystalProps) {
  return (
    <pre className={`${styles.crystal} ${className ?? ""}`} aria-hidden="true">
      {asciiCrystal(cols, rows)}
    </pre>
  );
}
