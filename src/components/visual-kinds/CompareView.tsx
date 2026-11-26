import type { CSSProperties } from "react";
import type { CompareSpec, FillOrder } from "@/lib/visual/schema";
import { toneAt } from "@/lib/visual/state";
import { MarkSymbol } from "./Mark";
import styles from "./CompareView.module.css";

type CompareViewProps = { spec: CompareSpec; step: number; still?: boolean };

/** 点灯の遅れ(ms)。row = 1 つずつ順に / all = 一斉 / diagonal = 斜めの波(流れ作業) */
function delayOf(order: FillOrder, index: number, cols: number): number {
  if (order === "all") return 0;
  if (order === "row") return index * 90;
  const r = Math.floor(index / cols);
  const c = index % cols;
  return (r + c) * 140;
}

/**
 * compare: 2〜4 列の横並びパネル。各パネル = 名前と札・小さなマス(段ごとに点灯)・評価記号と一言。
 * 狭い枠では 2 列 → 1 列に積む(横スクロールしない)。
 */
export function CompareView({ spec, step }: CompareViewProps) {
  const current = spec.steps[step];
  return (
    <div
      className={styles.root}
      style={
        {
          "--n": spec.columns.length,
          "--n2": Math.min(spec.columns.length, 2),
        } as CSSProperties
      }
    >
      {spec.columns.map((column, columnIndex) => {
        const cell = current?.cells?.[column.id] ?? {};
        const count = column.units.count;
        const cols = column.units.cols ?? Math.ceil(Math.sqrt(count));
        const lit = cell.lit ?? 0;
        const order = cell.order ?? "all";
        // 前の段(順番どおりに 1 つ前)の点灯数。減った分のマスは消える動きで見せる
        const prevLit = step > 0 ? (spec.steps[step - 1]?.cells?.[column.id]?.lit ?? 0) : 0;
        return (
          <section
            key={column.id}
            className={styles.panel}
            data-tone={column.tone ?? toneAt(columnIndex)}
            aria-label={column.label}
          >
            <header className={styles.head}>
              <span className={styles.label}>{column.label}</span>
              {column.tag ? (
                <span className={styles.tag}>{column.tag}</span>
              ) : null}
            </header>
            {/* key に段を入れて、段が変わるたびに点灯をやり直す */}
            <div
              key={step}
              className={styles.units}
              style={{ "--cols": cols } as CSSProperties}
              aria-hidden="true"
            >
              {Array.from({ length: count }, (_, index) => {
                const on = index < lit;
                const off = !on && index < prevLit;
                // 消える順: row は後ろから 1 つずつ、それ以外は点灯と同じ形
                const delay = off && order === "row" ? (prevLit - 1 - index) * 90 : delayOf(order, index, cols);
                return (
                  <span
                    key={index}
                    className={styles.unit}
                    data-lit={on ? "" : undefined}
                    data-off={off ? "" : undefined}
                    style={on || off ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
                  />
                );
              })}
            </div>
            {/* マスの数え方(units.label)を書いた列だけ「点灯数 / 全体」を出す */}
            {column.units.label ? (
              <p className={styles.count}>
                <span>{column.units.label}</span>
                <span data-tabular>
                  {lit} / {count}
                </span>
              </p>
            ) : null}
            <div key={`v${step}`} className={styles.verdict}>
              {cell.text ? (
                <p className={styles.text}>
                  {cell.mark ? <MarkSymbol mark={cell.mark} /> : null}
                  <span>{cell.text}</span>
                </p>
              ) : null}
              {cell.note ? <p className={styles.note}>{cell.note}</p> : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
