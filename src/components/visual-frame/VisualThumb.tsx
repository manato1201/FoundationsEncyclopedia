import type { VisualSpec } from "@/lib/visual/schema";
import { VisualStage } from "./VisualStage";
import styles from "./VisualThumb.module.css";

/**
 * 一覧のカード用: 図の最後の段の縮小の静止コマ。
 * 図は固定の幅(48rem)で描いてから縮め、カードの枠(高さ固定)で切り取る。動きは止め、読み上げから外す。
 */
export function VisualThumb({ spec }: { spec: VisualSpec }) {
  return (
    <div className={styles.thumb} aria-hidden="true">
      <div className={styles.canvas}>
        <VisualStage spec={spec} step={spec.steps.length - 1} still />
      </div>
    </div>
  );
}
