"use client";

import { CssStepAnimation } from "./CssStepAnimation";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./OperationStepsAnimation.module.css";

type OperationStepsAnimationProps = {
  steps: OperationStep[];
};

/**
 * DCC/ツール別エントリの`operationSteps`frontmatterを直接入力データとして使う汎用ラッパー
 * (FoundationsEncyclopedia_DESIGN.md Phase 5)。`CssStepAnimation`を`frameCount={steps.length}`でラップするだけの
 * 薄い実装に徹し、`useStepPlayer`側への変更は発生しない。ステップ数の二重管理を避けるため、
 * frameCountは常に`steps.length`から導出する。
 */
export function OperationStepsAnimation({
  steps,
}: OperationStepsAnimationProps) {
  return (
    <CssStepAnimation frameCount={steps.length}>
      <ol className={styles.list}>
        {steps.map((step, index) => (
          <li key={index} className={styles.item} data-index={index}>
            <span className={styles.indexBadge}>{index + 1}</span>
            <div className={styles.body}>
              <p className={styles.label}>{step.label}</p>
              {step.menuPath ? (
                <p className={styles.menuPath}>{step.menuPath}</p>
              ) : null}
              {step.note ? <p className={styles.note}>{step.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </CssStepAnimation>
  );
}
