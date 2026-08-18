"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./GitBranchWorkflowAnimation.module.css";

/**
 * Gitのブランチ操作(checkout -b → 変更 → commit → merge)。
 * ブランチグラフをステップごとにノード追加していく様子をCSSだけで表現する
 * (FoundationsEncyclopedia_DESIGN.md Phase 3の例)。
 */
export function GitBranchWorkflowAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.graph}>
        <div className={styles.mainLine}>
          <span className={styles.node}>main</span>
          <span className={styles.trunk} />
          <span className={`${styles.node} ${styles.mergeNode}`}>merge</span>
        </div>
        <div className={styles.branchLine}>
          <span className={`${styles.node} ${styles.checkoutNode}`}>
            checkout -b
          </span>
          <span className={styles.branchPath} />
          <span className={`${styles.node} ${styles.commitNode}`}>commit</span>
        </div>
        <p className={styles.caption} data-caption="0">
          feature ブランチを main から分岐して作成する(checkout -b)。
        </p>
        <p className={styles.caption} data-caption="1">
          feature ブランチ上でファイルを編集する。
        </p>
        <p className={styles.caption} data-caption="2">
          変更を feature ブランチにコミットする。
        </p>
        <p className={styles.caption} data-caption="3">
          feature ブランチの変更を main へマージする。
        </p>
      </div>
    </CssStepAnimation>
  );
}
