"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./OwnershipMoveAnimation.module.css";

/**
 * Rustの所有権ムーブ(let s2 = s1; によってs1からs2へ所有権が移動し、
 * s1が以後使えなくなる様子)。「値そのものではなく所有権という抽象概念が移動する」という、
 * テキストだけでは伝わりにくい題材のため、専用のCSSステップアニメーションとして実装する。
 */
export function OwnershipMoveAnimation() {
  return (
    <CssStepAnimation frameCount={3}>
      <div className={styles.stage}>
        <div className={styles.row}>
          <div className={styles.slot}>
            <span className={styles.slotLabel}>s1</span>
            <span className={`${styles.valueBox} ${styles.s1Box}`}>
              &quot;hello&quot;
            </span>
          </div>
          <div className={styles.slot}>
            <span className={styles.slotLabel}>s2</span>
            <span className={`${styles.valueBox} ${styles.s2Box}`} />
          </div>
        </div>
        <p className={styles.caption} data-caption="0">
          let s1 = String::from(&quot;hello&quot;); — s1 が値の所有者になる。
        </p>
        <p className={styles.caption} data-caption="1">
          let s2 = s1; — 所有権が s2 へムーブする(値そのものはコピーされない)。
        </p>
        <p className={styles.caption} data-caption="2">
          s1 はもう有効ではない。println!(&quot;{}&quot;, s1)
          はコンパイルエラーになる。
        </p>
      </div>
    </CssStepAnimation>
  );
}
