"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./ForLoopFlowAnimation.module.css";

/**
 * forループの実行フロー(FoundationsEncyclopedia_DESIGN.md Phase 3の例そのもの)。
 * 新規Reactコンポーネントを書く必要があるのはこの「箱を並べるだけ」の描画部分のみで、
 * ステップごとの見た目・キャプションの出し分けは隣接する.module.cssの`[data-step="N"]`セレクタが担う
 * (CssStepAnimationはstepIndexをchildrenへpropsとして渡さないため、CSS側だけで完結させる)。
 */
export function ForLoopFlowAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.flow}>
        <div className={`${styles.box} ${styles.initBox}`}>初期化 (i = 0)</div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.box} ${styles.conditionBox}`}>条件判定 (i &lt; 5)</div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.box} ${styles.bodyBox}`}>本体実行</div>
        <div className={styles.arrow}>→</div>
        <div className={`${styles.box} ${styles.incrementBox}`}>更新 (i++)</div>
        <div className={styles.loopArrow}>↺ 条件判定へ戻る</div>
        <p className={styles.caption} data-caption="0">
          i を 0 で初期化する。ここはループ突入前に1回だけ実行される。
        </p>
        <p className={styles.caption} data-caption="1">
          i &lt; 5 を評価する。falseならループを抜け、trueなら本体実行へ進む。
        </p>
        <p className={styles.caption} data-caption="2">
          ループ本体を実行する。
        </p>
        <p className={styles.caption} data-caption="3">
          i を更新(i++)してから、再び条件判定へ戻る。
        </p>
      </div>
    </CssStepAnimation>
  );
}
