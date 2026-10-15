import type { CSSProperties } from "react";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./StepPreview.module.css";

/** プレビューに並べる最大段数(それ以上は「全N段階」と表記する) */
const MAX_STEPS = 8;

type StepPreviewProps = {
  /** 章の operationSteps。ある場合はラベルを順に切り替える */
  steps?: OperationStep[];
  /** 専用アニメ(operationSteps なし)の章。ラベルは固定表示にする */
  bespoke?: boolean;
};

/**
 * カード用の小さな段階プレビュー(ステップを順に点灯する)。
 * 既定は静止(最初のステップを点灯)で、カードのホバー/フォーカス中、またはカタログの
 * 「プレビューを動かす」がONのときだけ再生する。動きを減らす設定では常に静止。
 * 動きの種類は「ステップが順に点灯する」の1つだけにしている。
 */
export function StepPreview({ steps, bespoke = false }: StepPreviewProps) {
  const hasSteps = steps !== undefined && steps.length > 0;
  if (!hasSteps && !bespoke) return null;

  const shown = hasSteps
    ? steps.slice(0, MAX_STEPS)
    : Array.from({ length: 4 }, (_, i) => ({ label: `${i + 1}` }));
  const n = shown.length;

  return (
    <div className={`${styles.preview} ${styles[`n${n}`]}`} aria-hidden="true">
      <div className={styles.track}>
        {shown.map((_, index) => (
          // --o: 点灯のずれ。停止中は最初のバーだけが点灯して見えるように、位相をずらしておく
          <span
            key={index}
            className={styles.bar}
            style={{ "--o": index === 0 ? 0 : n - index } as CSSProperties}
          />
        ))}
      </div>
      <div className={styles.labels}>
        {hasSteps ? (
          shown.map((step, index) => (
            <span
              key={index}
              className={styles.label}
              style={{ "--o": index === 0 ? 0 : n - index } as CSSProperties}
            >
              {step.label}
            </span>
          ))
        ) : (
          <span className={styles.labelStatic}>段階アニメで確認できる</span>
        )}
      </div>
      {hasSteps && steps.length > MAX_STEPS ? (
        <span className={styles.more}>全{steps.length}段階</span>
      ) : null}
    </div>
  );
}
