"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./PointerDereferenceAnimation.module.css";

/**
 * ポインタ・逆参照の概念(変数の宣言→アドレスの取得→ポインタ経由での書き換え→元の変数への反映)。
 * C++/C#(unsafe)/Go/Rustのポインタ系エントリで共用する、言語非依存の概念図。
 * 「メモリ上の箱と矢印」という空間的なイメージが本質を説明する題材のため、operationStepsの
 * テキストリストではなくボックス+矢印のビジュアルで表現する。
 */
export function PointerDereferenceAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.stage}>
        <div className={styles.memoryRow}>
          <div className={styles.cell}>
            <span className={styles.cellLabel}>value</span>
            <span className={`${styles.cellValue} ${styles.valueBox}`}>42</span>
            <span className={styles.address}>0x1000</span>
          </div>
          <div className={styles.cell}>
            <span className={styles.cellLabel}>p</span>
            <span className={`${styles.cellValue} ${styles.pointerBox}`}>
              ?
            </span>
            <span className={styles.address}>0x2000</span>
          </div>
        </div>
        <svg
          className={styles.arrowSvg}
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 150 5 C 100 5, 100 35, 50 35"
            className={styles.arrowPath}
          />
          <polygon points="50,35 60,30 60,40" className={styles.arrowHead} />
        </svg>
        <p className={styles.caption} data-caption="0">
          変数 value を宣言する(値42がメモリアドレス0x1000に置かれる)。
        </p>
        <p className={styles.caption} data-caption="1">
          ポインタ p を宣言し、&演算子で value のアドレスを取得して代入する。
        </p>
        <p className={styles.caption} data-caption="2">
          p は value を指す(矢印)。*p で逆参照すると value
          の値にアクセスできる。
        </p>
        <p className={styles.caption} data-caption="3">
          *p = 99 のように逆参照経由で書き換えると、value 自体が変更される。
        </p>
      </div>
    </CssStepAnimation>
  );
}
