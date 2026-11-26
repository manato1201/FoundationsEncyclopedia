import { edgeId, type GraphSpec } from "@/lib/visual/schema";
import { graphState, legendMap } from "@/lib/visual/state";
import styles from "./GraphView.module.css";

type GraphViewProps = { spec: GraphSpec; step: number; still?: boolean };

const W = 480;
const PAD_X = 40;
const PAD_TOP = 34;
/** 下端のノードの注記(名前の下の小さな文字)が入る余白 */
const PAD_BOTTOM = 44;
/** ノードの高さの半分 */
const R = 20;
/** 縦に並ぶ行どうしの最小の間隔(px)。状態の記号・ノード・注記が重ならない幅 */
const ROW_GAP = 86;

/**
 * viewBox の高さ。横に重なる位置にある 2 つのノードの縦の間隔が、ROW_GAP 以上になるまで縦に伸ばす。
 * 横に離れているノード同士は縦が近くてもぶつからないので数えない(縦に伸ばしすぎない)。
 */
function layoutHeight(nodes: { label: string; x: number; y: number }[]): number {
  let usable = 200;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dy = Math.abs(a.y - b.y);
      const dxPx = (Math.abs(a.x - b.x) * (W - PAD_X * 2)) / 100;
      const reach = Math.max(R, labelWidth(a.label) / 2 + 10) + Math.max(R, labelWidth(b.label) / 2 + 10) + 12;
      if (dy > 0 && dxPx < reach) usable = Math.max(usable, (ROW_GAP * 100) / dy);
    }
  }
  return Math.round(PAD_TOP + PAD_BOTTOM + Math.min(usable, 420));
}

/** 名前の幅(等幅 15px: 全角 ≒ 15px・半角 ≒ 9.5px) */
function labelWidth(label: string): number {
  let width = 0;
  for (const char of label) width += (char.codePointAt(0) ?? 0) > 0x2e7f ? 15 : 9.5;
  return width;
}

/**
 * graph: ノード(角の丸い札+名前)とエッジ(線)。段ごとにノード・エッジが凡例の色になり、focus のノードに輪が付く。
 * - ノードの幅は名前の長さに合わせる(短い名前は円)。縦の行が多い図は viewBox を縦に伸ばす。
 * - `hidden: true` のノード・エッジは、状態(nodes / edges)が付く段まで隠す(現れるときは opacity と scale)。
 *   隠れたノードにつながるエッジも隠れる。
 * - 矢印(directed)はエッジと同じ色の三角を線の先に描く。
 */
export function GraphView({ spec, step }: GraphViewProps) {
  const { nodes, edges, notes, focus } = graphState(spec, step);
  const legend = legendMap(spec);
  const H = layoutHeight(spec.nodes);
  const toX = (x: number) => PAD_X + ((W - PAD_X * 2) * x) / 100;
  const toY = (y: number) => PAD_TOP + ((H - PAD_TOP - PAD_BOTTOM) * y) / 100;

  const layout = new Map(
    spec.nodes.map((node) => [
      node.id,
      {
        x: toX(node.x),
        y: toY(node.y),
        hw: Math.max(R, labelWidth(node.label) / 2 + 10),
        shown: !node.hidden || node.id in nodes,
      },
    ]),
  );

  return (
    <svg className={styles.root} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.question}>
      {spec.edges.map((edge) => {
        const a = layout.get(edge.from);
        const b = layout.get(edge.to);
        if (!a || !b) return null;
        const id = edgeId(edge);
        const entry = edges[id] ? legend.get(edges[id]) : undefined;
        const shown = a.shown && b.shown && (!edge.hidden || id in edges);
        // ノードの札の縁で止める(札 = 幅 hw×2・高さ R×2 の箱として近似)
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const length = Math.hypot(dx, dy) || 1;
        const ux = dx / length;
        const uy = dy / length;
        const edgeOf = (hw: number) => Math.min(ux !== 0 ? hw / Math.abs(ux) : Infinity, uy !== 0 ? R / Math.abs(uy) : Infinity);
        const x1 = a.x + ux * edgeOf(a.hw);
        const y1 = a.y + uy * edgeOf(a.hw);
        const x2 = b.x - ux * (edgeOf(b.hw) + 2);
        const y2 = b.y - uy * (edgeOf(b.hw) + 2);
        const head = spec.directed
          ? [
              `${x2},${y2}`,
              `${x2 - ux * 9 - uy * 5},${y2 - uy * 9 + ux * 5}`,
              `${x2 - ux * 9 + uy * 5},${y2 - uy * 9 - ux * 5}`,
            ].join(" ")
          : null;
        return (
          <g
            key={id}
            data-tone={entry?.tone}
            className={styles.edge}
            data-on={entry ? "" : undefined}
            data-hidden={shown ? undefined : ""}
          >
            <line x1={x1} y1={y1} x2={head ? x2 - ux * 8 : x2} y2={head ? y2 - uy * 8 : y2} />
            {head ? <polygon className={styles.head} points={head} /> : null}
            {edge.label ? (
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} className={styles.edgeLabel}>
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {spec.nodes.map((node) => {
        const p = layout.get(node.id);
        if (!p) return null;
        const entry = nodes[node.id] ? legend.get(nodes[node.id]) : undefined;
        return (
          <g key={node.id} transform={`translate(${p.x} ${p.y})`}>
            <g
              className={styles.node}
              data-tone={entry?.tone}
              data-on={entry ? "" : undefined}
              data-focus={focus.has(node.id) ? "" : undefined}
              data-hidden={p.shown ? undefined : ""}
            >
              <rect className={styles.ring} x={-p.hw - 5} y={-R - 5} width={p.hw * 2 + 10} height={R * 2 + 10} rx={R + 5} />
              <rect className={styles.disc} x={-p.hw} y={-R} width={p.hw * 2} height={R * 2} rx={R} />
              <text className={styles.label} dy="0.35em">
                {node.label}
              </text>
              {entry ? (
                <text className={styles.state} y={-R - 7}>
                  {entry.mark}
                </text>
              ) : null}
              {notes[node.id] ? (
                <text className={styles.note} y={R + 19}>
                  {notes[node.id]}
                </text>
              ) : null}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
