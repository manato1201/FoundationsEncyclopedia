import type { CSSProperties } from "react";
import { Icon } from "@/components/icons/Icon";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./StepTrack.module.css";

type StepTrackProps = {
  steps: OperationStep[];
  stepIndex: number;
  onSeek?: (index: number) => void;
};

/**
 * visual のない章の「手順トラック」。中身と無関係な形は描かず、手順そのもの(番号・見出し・注記)を段として並べる。
 * 左の縦線が進み具合(通過した段まで伸びる)、いまの段だけ注記を開く。
 */
export function StepTrack({ steps, stepIndex, onSeek }: StepTrackProps) {
  const progress = steps.length > 1 ? stepIndex / (steps.length - 1) : 1;
  return (
    <ol className={styles.track} style={{ "--p": progress } as CSSProperties}>
      {steps.map((step, index) => {
        const state =
          index === stepIndex ? "current" : index < stepIndex ? "done" : "todo";
        return (
          <li key={index} className={styles.item} data-state={state}>
            <button
              type="button"
              className={styles.node}
              onClick={onSeek ? () => onSeek(index) : undefined}
              disabled={!onSeek}
              aria-label={`手順 ${index + 1} へ`}
            >
              {state === "done" ? (
                <Icon name="check" size={12} />
              ) : (
                String(index + 1).padStart(2, "0")
              )}
            </button>
            <div className={styles.body}>
              <p className={styles.label}>{step.label}</p>
              {state === "current" && step.menuPath ? (
                <p className={styles.menuPath}>{step.menuPath}</p>
              ) : null}
              {state === "current" && step.note ? (
                <p className={styles.note}>{step.note}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
