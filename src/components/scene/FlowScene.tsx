"use client";

import type { CSSProperties } from "react";
import { Glyph } from "./glyphs";
import { inferGlyph, wrapLabel, type FlowKind } from "@/lib/step-scene";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./FlowScene.module.css";

type FlowSceneProps = {
  steps: OperationStep[];
  stepIndex: number;
  kind: FlowKind;
  onSeek?: (index: number) => void;
};

const WIDTH = 640;
const TILE_W = 132;
const TILE_H = 92;
const ROW_H = 142;

type Point = { x: number; y: number };

/** 蛇行(pipeline): 1行に並べる数は4つまで。奇数行は右から左へ折り返し、線が途切れないようにする */
function snakeLayout(count: number): { points: Point[]; height: number } {
  const cols = count <= 4 ? count : count <= 6 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  const cell = WIDTH / cols;
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = (row % 2 === 0 ? col : cols - 1 - col) * cell + cell / 2;
    points.push({ x, y: row * ROW_H + 62 });
  }
  return { points, height: (rows - 1) * ROW_H + 62 + 46 + 10 };
}

/** 輪(cycle): 楕円の上に等間隔で置く。最後から最初へ戻る線が「繰り返し」を表す */
function ringLayout(count: number): { points: Point[]; height: number } {
  const rx = 240;
  const ry = 130;
  const cx = WIDTH / 2;
  const cy = 190;
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (i / count) * Math.PI * 2;
    points.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) });
  }
  return { points, height: 376 };
}

/**
 * 手順を「ノードと線」の図にする平面表示。文字の一覧ではなく、
 * 完了=緑の線が伸びる / 現在=青のパケットが乗る / 未到達=薄い、という状態の違いを形で見せる。
 * 現在の1点だけが光る(グローは現在の段階だけ)。動きは線の伸びとパケットの移動の2種類のみ。
 */
export function FlowScene({ steps, stepIndex, kind, onSeek }: FlowSceneProps) {
  const count = steps.length;
  const { points, height } =
    kind === "cycle" ? ringLayout(count) : snakeLayout(count);
  const closing = kind === "cycle" && count > 2;
  const packet = points[Math.min(stepIndex, count - 1)];

  const segments: {
    from: Point;
    to: Point;
    filled: boolean;
    closing?: boolean;
  }[] = [];
  for (let i = 0; i < count - 1; i++) {
    segments.push({
      from: points[i],
      to: points[i + 1],
      filled: i < stepIndex,
    });
  }
  if (closing) {
    segments.push({
      from: points[count - 1],
      to: points[0],
      filled: false,
      closing: true,
    });
  }

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${WIDTH} ${height}`}
      role="img"
      aria-label={`${count}つの手順を順に進める図。現在は${stepIndex + 1}番目`}
    >
      {segments.map((segment, index) => (
        <g key={index}>
          <line
            className={styles.edge}
            data-closing={segment.closing ? "" : undefined}
            x1={segment.from.x}
            y1={segment.from.y}
            x2={segment.to.x}
            y2={segment.to.y}
          />
          <line
            className={styles.edgeFill}
            data-filled={segment.filled ? "" : undefined}
            x1={segment.from.x}
            y1={segment.from.y}
            x2={segment.to.x}
            y2={segment.to.y}
            pathLength={1}
          />
        </g>
      ))}

      {steps.map((step, index) => {
        const point = points[index];
        const state =
          index === stepIndex ? "current" : index < stepIndex ? "done" : "todo";
        const lines = wrapLabel(step.label);
        return (
          <g
            key={index}
            className={styles.node}
            data-state={state}
            transform={`translate(${point.x} ${point.y})`}
            onClick={onSeek ? () => onSeek(index) : undefined}
          >
            <rect
              className={styles.tile}
              x={-TILE_W / 2}
              y={-TILE_H / 2}
              width={TILE_W}
              height={TILE_H}
              rx={16}
            />
            <g className={styles.glyph} transform="translate(-14 -36)">
              {state === "done" ? (
                <Glyph name="test" size={28} />
              ) : (
                <Glyph name={inferGlyph(step)} size={28} />
              )}
            </g>
            <text
              className={styles.number}
              x={-TILE_W / 2 + 12}
              y={-TILE_H / 2 + 20}
            >
              {index + 1}
            </text>
            <text
              className={styles.label}
              x={0}
              y={14}
              textAnchor="middle"
            >
              {lines.map((line, lineIndex) => (
                <tspan key={lineIndex} x={0} dy={lineIndex === 0 ? 0 : 15}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      <g
        className={styles.packet}
        style={
          { "--px": `${packet.x}px`, "--py": `${packet.y}px` } as CSSProperties
        }
      >
        <circle className={styles.packetHalo} r={9} />
        <circle className={styles.packetCore} r={4.5} />
      </g>
    </svg>
  );
}
