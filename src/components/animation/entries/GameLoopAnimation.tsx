"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./GameLoopAnimation.module.css";

/**
 * ゲームループ(入力→更新→描画の3ステップ循環)。for-loop-flowと同じ「区切られたステップの循環」
 * という題材の性質を持つため、同型のCSSステップアニメーションとして実装する。
 */
export function GameLoopAnimation() {
  return (
    <CssStepAnimation frameCount={3}>
      <div className={styles.flow}>
        <div className={`${styles.box} ${styles.inputBox}`}>入力 (Input)</div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.box} ${styles.updateBox}`}>更新 (Update)</div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.box} ${styles.renderBox}`}>描画 (Render)</div>
        <div className={styles.loopArrow}>↺ 次のフレームへ</div>
        <p className={styles.caption} data-caption="0">
          プレイヤーの入力(キー、パッド等)を取得する。
        </p>
        <p className={styles.caption} data-caption="1">
          入力とデルタタイムを元に、ゲームの状態(位置、当たり判定等)を更新する。
        </p>
        <p className={styles.caption} data-caption="2">
          現在の状態を画面に描画してから、次のフレームへ戻る。
        </p>
      </div>
    </CssStepAnimation>
  );
}
