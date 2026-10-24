"use client";

import { useEffect, useRef, useState } from "react";
import { CssStepAnimation } from "./CssStepAnimation";
import { Icon } from "@/components/icons/Icon";
import type { OperationStep } from "@/lib/content/foundations";
import stepStyles from "./CssStepAnimation.module.css";
import styles from "./OperationStepsAnimation.module.css";

type OperationStepsAnimationProps = {
  steps: OperationStep[];
};

/**
 * DCC/ツール別エントリの`operationSteps`frontmatterを直接入力データとして使う汎用ラッパー
 * (FoundationsEncyclopedia_DESIGN.md Phase 5)。`CssStepAnimation`を`frameCount={steps.length}`でラップするだけの
 * 薄い実装に徹し、`useStepPlayer`側への変更は発生しない。ステップ数の二重管理を避けるため、
 * frameCountは常に`steps.length`から導出する。
 *
 * 既定は再生ボタンで進める通常表示。「スクロールで進める」を選ぶと、ページのスクロール量でステップが進む
 * (スクロールテリング。選んだときだけ有効にして、通常の画面は静かに保つ)。
 */
export function OperationStepsAnimation({ steps }: OperationStepsAnimationProps) {
  const [scrolly, setScrolly] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.modeRow}>
        <button
          type="button"
          className={`${styles.modeButton} ${scrolly ? styles.modeButtonActive : ""}`}
          aria-pressed={scrolly}
          onClick={() => setScrolly((current) => !current)}
          title="ページをスクロールした量に合わせて、ステップが1つずつ進みます"
        >
          スクロールで進める
        </button>
      </div>
      {scrolly ? (
        <ScrollSteppedList steps={steps} />
      ) : (
        <CssStepAnimation frameCount={steps.length} stepLabels={steps.map((step) => step.label)}>
          {({ stepIndex }) => <StepList steps={steps} stepIndex={stepIndex} />}
        </CssStepAnimation>
      )}
    </div>
  );
}

function StepList({ steps, stepIndex }: { steps: OperationStep[]; stepIndex: number }) {
  return (
    <ol className={styles.list}>
      {steps.map((step, index) => (
        <li
          key={index}
          className={styles.item}
          data-index={index}
          data-state={index === stepIndex ? "current" : index === stepIndex - 1 ? "prev" : undefined}
          data-done={index < stepIndex ? "" : undefined}
        >
          <span className={styles.indexBadge}>{index < stepIndex ? <Icon name="check" size={12} /> : index + 1}</span>
          <div className={styles.body}>
            <p className={styles.label}>{step.label}</p>
            {step.menuPath ? <p className={styles.menuPath}>{step.menuPath}</p> : null}
            {step.note ? <p className={styles.note}>{step.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** スクロール量(0〜1)をステップ番号に対応させる。見た目は通常表示と同じ一覧を固定表示(sticky)にする */
function ScrollSteppedList({ steps }: { steps: OperationStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const count = steps.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      const scrollable = track.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-track.getBoundingClientRect().top / scrollable, 0), 1) : 0;
      setStepIndex(Math.min(count - 1, Math.floor(progress * count)));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  return (
    <div ref={trackRef} className={styles.scrollTrack} style={{ height: `${count * 45 + 55}vh` }}>
      <div className={styles.scrollSticky}>
        <div className={stepStyles.wrapper}>
          <div className={stepStyles.stage} data-step={stepIndex}>
            <StepList steps={steps} stepIndex={stepIndex} />
          </div>
          <p className={styles.scrollHint}>
            <span data-tabular>
              {stepIndex + 1} / {count}
            </span>
            <span>下にスクロールすると次のステップへ進みます</span>
          </p>
        </div>
      </div>
    </div>
  );
}
