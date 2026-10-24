"use client";

import type { CSSProperties } from "react";
import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./IsolationLayersAnimation.module.css";

/** 外側 → 内側。実際の構成はツールによって異なる(概念図) */
const LAYERS = [
  { name: "物理マシン(ホスト)", detail: "すべての土台" },
  { name: "仮想マシン", detail: "OSごと分ける" },
  { name: "コンテナ", detail: "依存を含む環境を分ける" },
  { name: "サンドボックス", detail: "ファイル・ネットワークの範囲を絞る" },
  { name: "実行するコード", detail: "守りたい対象" },
];

const STEP_LABELS = ["重ねた状態", "分解して見せる", "OSごと分ける層", "軽い分離の層"];

/**
 * 実行環境の分離を「入れ子の層」として重ね、ステップで分解して見せる(Exploded view)。
 * 分離の強さ・手間の傾向を示す概念図で、層の数や順序は実際の構成とは限らない。
 * 3D表現はCSSのtransformだけで行い、動きを減らす設定では遷移を止める。
 */
export function IsolationLayersAnimation() {
  return (
    <CssStepAnimation frameCount={4} stepLabels={STEP_LABELS}>
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.viewport} aria-hidden="true">
            <div className={styles.stack}>
              {LAYERS.map((layer, index) => (
                <div
                  key={layer.name}
                  className={[styles.plate, styles[`plate${index}`]].filter(Boolean).join(" ")}
                  style={{ "--i": index } as CSSProperties}
                />
              ))}
            </div>
          </div>
          <ol className={styles.legend}>
            {LAYERS.map((layer, index) => (
              <li key={layer.name} className={[styles.legendItem, styles[`legend${index}`]].filter(Boolean).join(" ")}>
                <span className={styles.legendName}>{layer.name}</span>
                <span className={styles.legendDetail}>{layer.detail}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className={styles.caption} data-caption="0">
          5つの層が入れ子に重なっている。外側ほど強く分け、内側ほど手軽に使える、という傾向がある。
        </p>
        <p className={styles.caption} data-caption="1">
          層を引き離して、1枚ずつ見る。どの層を使うかは、守りたい範囲で決める。
        </p>
        <p className={styles.caption} data-caption="2">
          仮想マシン: OSごと分けるので強いが、準備と動作が重くなりやすい。
        </p>
        <p className={styles.caption} data-caption="3">
          コンテナ・サンドボックス: 手間が小さく試しやすい。ただし、許可した範囲の中では操作が実行される。
        </p>
        <p className={styles.note}>概念図。層の数や順序は、使うツールによって異なる。</p>
      </div>
    </CssStepAnimation>
  );
}
