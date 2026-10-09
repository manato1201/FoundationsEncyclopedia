"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./ProcessorLanesAnimation.module.css";

const LANES = [
  { key: "cpu", name: "CPU", role: "1つずつ順番に" },
  { key: "gpu", name: "GPU", role: "全部同時に" },
  { key: "npu", name: "NPU", role: "重みを回路に置いて流れ作業" },
] as const;

const CELLS = [0, 1, 2, 3];

/**
 * 同じ「4つの掛け算」を CPU / GPU / NPU がどう処理するかを3レーンで並べる概念図。
 * 速度や消費電力の実測値を示すものではなく、処理の進め方の違いだけを表す。
 */
export function ProcessorLanesAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.stage}>
        <p className={styles.task}>
          同じ仕事: 4つの掛け算 <code>x × w</code>
        </p>
        {LANES.map((lane) => (
          <div
            key={lane.key}
            className={styles.lane}
          >
            <div className={styles.laneHead}>
              <span className={styles.laneName}>{lane.name}</span>
              <span className={styles.laneRole}>{lane.role}</span>
            </div>
            <div className={styles.cells}>
              {CELLS.map((index) => (
                <span
                  key={index}
                  className={`${styles.cell} ${styles[`${lane.key}Cell${index}`]}`}
                  data-tabular
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
        ))}
        <p className={styles.caption} data-caption="0">
          3つのレーンに同じ4つの掛け算が並んでいる。進め方がそれぞれ違う。
        </p>
        <p className={styles.caption} data-caption="1">
          CPU:
          1つずつ順番に処理する。1つ終わるまで次は待つ。何にでも使えるが、同じ計算の大量処理は不得意。
        </p>
        <p className={styles.caption} data-caption="2">
          GPU: 同じ種類の計算を、たくさんの小さな演算器で同時に処理する。
        </p>
        <p className={styles.caption} data-caption="3">
          NPU:
          重みを回路側に置いたまま、データだけを流し込む流れ作業。ニューラルネットの計算に特化している。
        </p>
      </div>
    </CssStepAnimation>
  );
}
