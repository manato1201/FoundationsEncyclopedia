import {
  createContentLoader,
  type ContentFrontmatterBase,
} from "./createContentLoader";
import { hasAnimation } from "@/lib/has-animation";
import type { MasteryBadge } from "@/lib/mastery-badge";

export interface OperationStep {
  label: string;
  menuPath?: string;
  note?: string;
}

export interface FoundationsFrontmatter extends ContentFrontmatterBase {
  masteryBadge?: MasteryBadge;
  operationSteps?: OperationStep[];
}

/**
 * ColorEncyclopediaのcreateContentLoader<T>の3個目の利用先。独自ローダーを新規に書かない
 * (FoundationsEncyclopedia_DESIGN.md Phase 1参照)。
 * hasVisualizerフィールドはPhase3のCSSステップアニメーション対応可否(hasAnimation)を渡す。
 */
export const foundationsLoader = createContentLoader<FoundationsFrontmatter>(
  "foundations",
  hasAnimation,
);

export type FoundationsMeta = ReturnType<
  typeof foundationsLoader.getAllMeta
>[number];
export type FoundationsDetail = NonNullable<
  ReturnType<typeof foundationsLoader.getDetail>
>;
