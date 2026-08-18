/**
 * masteryBadge <-> LEARNING_ROADMAP.md バッジ対応表。
 * 4値・絵文字・配色はLEARNING_ROADMAP.md冒頭のバッジ凡例表を一次ソースとしてそのまま流用する
 * (FoundationsEncyclopedia_DESIGN.md Phase 0のアンチパターン参照。新規の意味づけ・配色は行わない)。
 */
export type MasteryBadge = "done" | "review" | "next" | "advanced";

export const MASTERY_BADGE_META: Record<MasteryBadge, { emoji: string; label: string; color: string }> = {
  done: { emoji: "🟢", label: "習得済み", color: "#2e7d32" },
  review: { emoji: "🟡", label: "復習すべき", color: "#f9a825" },
  next: { emoji: "🔵", label: "今後学ぶ", color: "#1565c0" },
  advanced: { emoji: "🟣", label: "応用・発展", color: "#6a1b9a" },
};

export const MASTERY_BADGE_ORDER: MasteryBadge[] = ["done", "review", "next", "advanced"];
