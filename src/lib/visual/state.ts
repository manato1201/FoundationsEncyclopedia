import type {
  GraphSpec,
  GridSpec,
  LegendItem,
  SequenceSpec,
  Tone,
  TiersSpec,
  VisualSpec,
  ZonesSpec,
} from "./schema";
import { edgeId } from "./schema";

/**
 * 段 i の「積み上がった状態」を計算する純粋関数(描画コンポーネントから使う)。
 * schema.ts の約束: place・state・cells などは前の段を引き継ぎ、focus・highlight・send はその段だけ。
 */

/** 凡例キーに色を割り当てる順(gray は明示したときだけ) */
const TONE_ORDER: Tone[] = ["blue", "green", "amber", "pink", "violet", "cyan"];

export interface LegendEntry {
  key: string;
  label: string;
  tone: Tone;
  mark: string;
}

export function resolveLegend(legend: LegendItem[] | undefined): LegendEntry[] {
  return (legend ?? []).map((item, index) => ({
    key: item.key,
    label: item.label,
    tone: item.tone ?? TONE_ORDER[index % TONE_ORDER.length],
    mark: item.mark ?? Array.from(item.label)[0] ?? "",
  }));
}

export function legendMap(spec: VisualSpec): Map<string, LegendEntry> {
  return new Map(resolveLegend(spec.legend).map((entry) => [entry.key, entry]));
}

/** 並び順で色を決めるとき(tiers の箱など) */
export function toneAt(index: number): Tone {
  return TONE_ORDER[index % TONE_ORDER.length];
}

function merge<T>(
  base: Record<string, T>,
  patch: Record<string, T> | undefined,
): Record<string, T> {
  return patch ? { ...base, ...patch } : base;
}

export function zonesState(spec: ZonesSpec, step: number) {
  let place: Record<string, string | null> = {};
  let state: Record<string, string> = {};
  for (let i = 0; i <= step && i < spec.steps.length; i += 1) {
    place = merge(place, spec.steps[i].place);
    state = merge(state, spec.steps[i].state);
  }
  const current = spec.steps[step];
  return {
    place,
    state,
    highlight: new Set(current?.highlight ?? []),
    zoneFocus: new Set(current?.zoneFocus ?? []),
  };
}

export function tiersState(spec: TiersSpec, step: number) {
  const revealed = new Set<string>();
  const gaps = new Set<string>();
  let state: Record<string, string> = {};
  for (let i = 0; i <= step && i < spec.steps.length; i += 1) {
    const s = spec.steps[i];
    // 最初の段で reveal を書かなければ、全部を見せる
    if (i === 0 && s.reveal === undefined)
      spec.tiers.forEach((tier) => revealed.add(tier.id));
    s.reveal?.forEach((id) => revealed.add(id));
    s.gaps?.forEach((id) => gaps.add(id));
    state = merge(state, s.state);
  }
  return {
    revealed,
    gaps,
    state,
    focus: new Set(spec.steps[step]?.focus ?? []),
  };
}

export function gridState(spec: GridSpec, step: number) {
  let cells: Record<string, string> = {};
  let values: Record<string, string> = {};
  spec.initial?.forEach((row, r) =>
    row.forEach((value, c) => {
      if (value !== "" && value !== null && value !== undefined)
        values[`${r},${c}`] = String(value);
    }),
  );
  for (let i = 0; i <= step && i < spec.steps.length; i += 1) {
    const s = spec.steps[i];
    if (s.clear) {
      cells = {};
      values = {};
    }
    cells = merge(cells, s.cells);
    values = merge(values, s.values);
  }
  return { cells, values, focus: new Set(spec.steps[step]?.focus ?? []) };
}

export function sequenceState(spec: SequenceSpec, step: number) {
  /** 全段を通した送信の順(行の並び。先の段の行も場所だけ取っておき、レイアウトを動かさない) */
  const order: { id: string; step: number }[] = [];
  spec.steps.forEach((s, index) =>
    s.send?.forEach((id) => order.push({ id, step: index })),
  );
  let state: Record<string, string> = {};
  for (let i = 0; i <= step && i < spec.steps.length; i += 1)
    state = merge(state, spec.steps[i].state);
  return { order, state };
}

export function graphState(spec: GraphSpec, step: number) {
  let nodes: Record<string, string> = {};
  let edges: Record<string, string> = {};
  let notes: Record<string, string> = {};
  for (let i = 0; i <= step && i < spec.steps.length; i += 1) {
    const s = spec.steps[i];
    nodes = merge(nodes, s.nodes);
    edges = merge(edges, s.edges);
    notes = merge(notes, s.notes);
  }
  return {
    nodes,
    edges,
    notes,
    focus: new Set(spec.steps[step]?.focus ?? []),
    edgeId,
  };
}

/** 動きを減らす設定(OS 設定または画面のスイッチ)か。WAAPI で動かす前に確かめる */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.getAttribute("data-motion") === "reduce"
  );
}
