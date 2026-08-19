"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./StateMachineAnimation.module.css";

/**
 * ステートマシンの状態遷移(Idle→Walk→Jump→Idle)。ノード+矢印のグラフをステップごとに
 * ハイライトし、「今どの状態にいるか」を視覚的に示す。
 */
export function StateMachineAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.graph}>
        <div className={styles.row}>
          <div className={`${styles.node} ${styles.idleNode}`}>Idle</div>
          <span className={styles.edge}>→</span>
          <div className={`${styles.node} ${styles.walkNode}`}>Walk</div>
          <span className={styles.edge}>→</span>
          <div className={`${styles.node} ${styles.jumpNode}`}>Jump</div>
        </div>
        <div className={styles.returnEdge}>↺ 着地したらIdleへ戻る</div>
        <p className={styles.caption} data-caption="0">
          初期状態はIdle(待機)。
        </p>
        <p className={styles.caption} data-caption="1">
          移動入力を受けてWalk(歩行)へ遷移する。
        </p>
        <p className={styles.caption} data-caption="2">
          ジャンプ入力を受けてJump(跳躍)へ遷移する。
        </p>
        <p className={styles.caption} data-caption="3">
          着地するとIdleへ戻る。定義されていない遷移(例:
          JumpからAttackへの直接遷移)は起こらない。
        </p>
      </div>
    </CssStepAnimation>
  );
}
