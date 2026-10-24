"use client";

import { Icon } from "@/components/icons/Icon";
import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./ProcessorLanesAnimation.module.css";

const LANES = [
  { key: "cpu", name: "CPU", role: "1つずつ順番に" },
  { key: "gpu", name: "GPU", role: "全部同時に" },
  { key: "npu", name: "NPU", role: "重みを回路に置いて流れ作業" },
] as const;

const CELLS = [0, 1, 2, 3];
const GPU_UNITS = Array.from({ length: 24 }, (_, index) => index);
const STEP_LABELS = ["比較の準備", "CPU", "GPU", "NPU"];

/**
 * 同じ「4つの掛け算」を CPU / GPU / NPU がどう処理するかを3レーンで並べる概念図。
 * 速度や消費電力の実測値を示すものではなく、処理の進め方の違いだけを表す。
 * 下の「内部をのぞく窓」は、いまのステップの装置の中身を概念的に見せる(個数・配置は説明用で、実機の構成ではない)。
 */
export function ProcessorLanesAnimation() {
  return (
    <CssStepAnimation frameCount={4} stepLabels={STEP_LABELS}>
      <div className={styles.stage}>
        <p className={styles.task}>
          同じ仕事: 4つの掛け算 <code>x × w</code>
        </p>
        {LANES.map((lane) => (
          <div key={lane.key} className={styles.lane}>
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

        <div className={styles.window} aria-label="内部をのぞく窓(概念図)">
          <p className={styles.windowTitle}>内部をのぞく窓(概念図)</p>
          <div className={styles.windowBody} data-window="0">
            <p className={styles.windowHint}>ステップを進めると、その装置の中身が見える。</p>
          </div>
          <div className={styles.windowBody} data-window="1">
            <div className={styles.cpuCores}>
              {[0, 1, 2, 3].map((index) => (
                <span key={index} className={`${styles.core} ${index === 0 ? styles.coreActive : ""}`}>
                  コア
                </span>
              ))}
            </div>
            <p className={styles.windowNote}>少数の大きなコアが、複雑な処理を1つずつこなす。</p>
          </div>
          <div className={styles.windowBody} data-window="2">
            <div className={styles.gpuGrid}>
              {GPU_UNITS.map((index) => (
                <span key={index} className={styles.unit} />
              ))}
            </div>
            <p className={styles.windowNote}>小さな演算器が大量に並び、同じ計算を一斉に行う。</p>
          </div>
          <div className={styles.windowBody} data-window="3">
            <div className={styles.npuFlow}>
              <span className={styles.flowData}>データ x</span>
              <span className={styles.flowArrow} aria-hidden="true">
                <Icon name="arrow-right" size={14} />
              </span>
              <span className={styles.weights}>
                {[1, 2, 3, 4].map((index) => (
                  <span key={index} className={styles.weight}>
                    w{index}
                  </span>
                ))}
              </span>
              <span className={styles.flowArrow} aria-hidden="true">
                <Icon name="arrow-right" size={14} />
              </span>
              <span className={styles.flowData}>結果</span>
            </div>
            <p className={styles.windowNote}>重み w は回路に置いたまま、データだけが流れる。</p>
          </div>
        </div>

        <p className={styles.caption} data-caption="0">
          3つのレーンに同じ4つの掛け算が並んでいる。進め方がそれぞれ違う。
        </p>
        <p className={styles.caption} data-caption="1">
          CPU: 1つずつ順番に処理する。1つ終わるまで次は待つ。何にでも使えるが、同じ計算の大量処理は不得意。
        </p>
        <p className={styles.caption} data-caption="2">
          GPU: 同じ種類の計算を、たくさんの小さな演算器で同時に処理する。
        </p>
        <p className={styles.caption} data-caption="3">
          NPU: 重みを回路側に置いたまま、データだけを流し込む流れ作業。ニューラルネットの計算に特化している。
        </p>
      </div>
    </CssStepAnimation>
  );
}
