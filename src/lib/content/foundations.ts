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

/** 章末の理解度クイズ1問(frontmatterの`quiz`)。answerは choices のインデックス(0始まり) */
export interface QuizItem {
  question: string;
  choices: string[];
  answer: number;
  explanation?: string;
}

/** 章の定型項目(frontmatterの`guide`)。書いた項目だけ表示する */
export interface ChapterGuideFrontmatter {
  /** 見るポイント */
  watch?: string;
  /** 使うときの注意 */
  caution?: string;
  /** よくある誤解 */
  misconception?: string;
}

export interface FoundationsFrontmatter extends ContentFrontmatterBase {
  masteryBadge?: MasteryBadge;
  operationSteps?: OperationStep[];
  quiz?: QuizItem[];
  guide?: ChapterGuideFrontmatter;
  /** 章の主張を1文で(「GPUは同じ計算を一斉に行う」の形)。1文で言えない章は2つに分ける */
  claim?: string;
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
