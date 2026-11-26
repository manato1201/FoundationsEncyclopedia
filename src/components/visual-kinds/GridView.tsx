import type { CSSProperties } from "react";
import type { GridSpec } from "@/lib/visual/schema";
import { gridState, legendMap } from "@/lib/visual/state";
import styles from "./GridView.module.css";

type GridViewProps = { spec: GridSpec; step: number; still?: boolean };

/**
 * grid: 行・列の見出しつきのマス。段ごとにマスが凡例の色で埋まり(記号つき)、focus のマスに枠が付く。
 */
export function GridView({ spec, step }: GridViewProps) {
  const { cells, values, focus } = gridState(spec, step);
  const legend = legendMap(spec);
  const cols = spec.cols.length;

  return (
    <div className={styles.root}>
      {spec.colLabel ? (
        <p className={styles.axisCol}>{spec.colLabel} →</p>
      ) : null}
      <div className={styles.body}>
        <table
          className={styles.table}
          style={{ "--cols": cols } as CSSProperties}
        >
          <thead>
            <tr>
              <th className={styles.corner}>
                {spec.rowLabel ? `${spec.rowLabel} ↓` : ""}
              </th>
              {spec.cols.map((col, c) => (
                <th key={c} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, r) => (
              <tr key={r}>
                <th scope="row">{row}</th>
                {spec.cols.map((_, c) => {
                  const address = `${r},${c}`;
                  const entry = cells[address]
                    ? legend.get(cells[address])
                    : undefined;
                  return (
                    <td
                      key={`${c}-${entry?.key ?? ""}`}
                      className={styles.cell}
                      data-tone={entry?.tone}
                      data-filled={entry ? "" : undefined}
                      data-focus={focus.has(address) ? "" : undefined}
                    >
                      <span className={styles.value}>
                        {values[address] ?? ""}
                      </span>
                      {entry ? (
                        <span className={styles.mark} title={entry.label}>
                          {entry.mark}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
