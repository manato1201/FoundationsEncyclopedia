"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./OsiEncapsulationAnimation.module.css";

const LAYERS = [
  { key: "l7", label: "L7 アプリケーション" },
  { key: "l4", label: "L4 トランスポート" },
  { key: "l3", label: "L3 ネットワーク" },
  { key: "l2", label: "L2 データリンク" },
];

/**
 * OSI参照モデルのパケットカプセル化(L7→L1へ各層でヘッダが付与される様子)。
 * 層ごとのボックスを重ねて表示し、ステップが進むごとに外側のヘッダ層を追加する
 * (FoundationsEncyclopedia_DESIGN.md Phase 3の例)。
 */
export function OsiEncapsulationAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.stack}>
        {LAYERS.map((layer, index) => (
          <div key={layer.key} className={`${styles.layer} ${styles[`layer${index}`]}`}>
            {layer.label}
          </div>
        ))}
        <p className={styles.caption} data-caption="0">
          L7(アプリケーション層)のデータそのもの。
        </p>
        <p className={styles.caption} data-caption="1">
          L4(トランスポート層)でTCP/UDPヘッダが付与される。
        </p>
        <p className={styles.caption} data-caption="2">
          L3(ネットワーク層)でIPヘッダが付与される。
        </p>
        <p className={styles.caption} data-caption="3">
          L2(データリンク層)でイーサネットフレームヘッダが付与され、L1として送出される。
        </p>
      </div>
    </CssStepAnimation>
  );
}
