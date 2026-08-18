"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./BlenderModifierStackAnimation.module.css";

/**
 * Blenderモディファイアスタックの適用順(Mirror → Subdivision Surface → Bevel)。
 * スタック内のモディファイアを上から順に適用し、各ステップでメッシュ形状のクラスを切り替える
 * (FoundationsEncyclopedia_DESIGN.md Phase 3の例)。
 */
export function BlenderModifierStackAnimation() {
  return (
    <CssStepAnimation frameCount={3}>
      <div className={styles.layout}>
        <ul className={styles.stack}>
          <li className={`${styles.stackItem} ${styles.mirrorItem}`}>Mirror</li>
          <li className={`${styles.stackItem} ${styles.subdivItem}`}>
            Subdivision Surface
          </li>
          <li className={`${styles.stackItem} ${styles.bevelItem}`}>Bevel</li>
        </ul>
        <div className={styles.mesh}>
          <div className={styles.shape} />
        </div>
        <p className={styles.caption} data-caption="0">
          Mirror を適用: 片側のメッシュを鏡像複製する。
        </p>
        <p className={styles.caption} data-caption="1">
          Subdivision Surface を適用: 全体を分割して滑らかにする。
        </p>
        <p className={styles.caption} data-caption="2">
          Bevel を適用: エッジに面取りを加える。
        </p>
      </div>
    </CssStepAnimation>
  );
}
