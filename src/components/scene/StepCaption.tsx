import { Glyph } from "./glyphs";
import { inferGlyph } from "@/lib/step-scene";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./StepCaption.module.css";

type StepCaptionProps = {
  steps: OperationStep[];
  stepIndex: number;
};

/**
 * 図の下に置く「いまの手順」カード。図は形で状態を見せ、細かい文字(操作・コマンド・補足)はここに集める。
 * ステップが変わるたびにkeyで作り直し、短くふわっと入る(動きの種類は図と合わせて2つまで)。
 */
export function StepCaption({ steps, stepIndex }: StepCaptionProps) {
  const step = steps[stepIndex];
  if (!step) return null;
  return (
    <div className={styles.caption} key={stepIndex} aria-live="polite">
      <span className={styles.glyph}>
        <Glyph name={inferGlyph(step)} size={26} />
      </span>
      <div className={styles.body}>
        <p className={styles.kicker} data-tabular>
          手順 {stepIndex + 1} / {steps.length}
        </p>
        <p className={styles.label}>{step.label}</p>
        {step.menuPath ? (
          <p className={styles.menuPath}>{step.menuPath}</p>
        ) : null}
        {step.note ? <p className={styles.note}>{step.note}</p> : null}
      </div>
    </div>
  );
}
