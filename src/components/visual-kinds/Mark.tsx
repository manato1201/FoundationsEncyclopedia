import { splitMark, type Mark } from "@/lib/visual/schema";
import palette from "./palette.module.css";

const SYMBOL: Record<Mark, string> = { good: "○", fair: "△", poor: "×" };
const SPOKEN: Record<Mark, string> = { good: "得意", fair: "条件つき", poor: "苦手" };

/** 評価記号 ○ △ ×(色+形+読み上げの 3 つで区別する) */
export function MarkSymbol({ mark }: { mark: Mark }) {
  return (
    <span className={palette.mark} data-mark={mark} role="img" aria-label={SPOKEN[mark]}>
      {SYMBOL[mark]}
    </span>
  );
}

/** 先頭の ○ △ × を評価記号として描き、残りを文字で出す */
export function MarkedText({ text, className }: { text: string; className?: string }) {
  const { mark, text: rest } = splitMark(text);
  return (
    <span className={className}>
      {mark ? <MarkSymbol mark={mark} /> : null}
      {mark ? " " : null}
      {rest}
    </span>
  );
}
