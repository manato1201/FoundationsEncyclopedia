import type { FoundationsMeta } from "@/lib/content/foundations";

/** ステップ表示を持つ章(専用アニメ または operationSteps) */
export const isAnimated = (entry: FoundationsMeta) =>
  entry.hasVisualizer || (entry.operationSteps?.length ?? 0) > 0;
