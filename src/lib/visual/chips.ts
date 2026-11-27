import type { VisualSpec } from "./schema";

export type VisualChip = { label: string; value: string };

/**
 * 詳細画面の SPEC に出す「数値チップ」。章の図(visual)に**目安の数値**として書かれた値だけを拾う(文章は足さない)。
 * 対象は `approx`(数値は目安)を付けた図だけ。階層(tiers)の各段の値と、段ごとの右上の大きな数(callout)。
 * 同じ値が重なるときは先に出たほうだけ残す。拾えなければ空の配列(チップは出さない)。
 */
export function visualChips(spec: VisualSpec | undefined): VisualChip[] {
  if (!spec || !spec.approx) return [];
  const chips: VisualChip[] = [];
  const seen = new Set<string>();
  const push = (label: string, value: string | undefined) => {
    if (!value || seen.has(value)) return;
    seen.add(value);
    chips.push({ label, value });
  };
  if (spec.kind === "tiers") {
    for (const tier of spec.tiers) push(tier.label, tier.value);
  }
  for (const step of spec.steps) {
    if (step.callout) push(step.callout.label ?? "", step.callout.value);
  }
  return chips;
}

/** 図の「数値は目安」の文言(VisualFrame と同じ決め方) */
export function approxText(spec: VisualSpec | undefined): string | null {
  if (!spec) return null;
  return spec.approx === true ? "数値は目安" : typeof spec.approx === "string" ? spec.approx : null;
}
