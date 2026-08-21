"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./RecursionStackAnimation.module.css";

const FRAMES = [
  "factorial(3)",
  "factorial(2)",
  "factorial(1)",
  "factorial(1) = 1",
  "factorial(2) = 2",
  "factorial(3) = 6",
];

/**
 * 再帰のコールスタック(factorial(3)の呼び出しが積み上がり、基底ケースに達してから
 * 戻り値を伴って1つずつ巻き戻っていく様子)。スタックが「積み上がってから畳まれる」という
 * 形が本質を説明する題材のため、専用のCSSステップアニメーションとして実装する。
 */
export function RecursionStackAnimation() {
  return (
    <CssStepAnimation frameCount={FRAMES.length}>
      <div className={styles.stage}>
        <div className={styles.stack}>
          {FRAMES.map((frame, index) => (
            <div key={frame} className={styles.frame} data-index={index}>
              {frame}
            </div>
          ))}
        </div>
        <p className={styles.caption} data-caption="0">
          factorial(3) が呼ばれ、スタックに積まれる。
        </p>
        <p className={styles.caption} data-caption="1">
          factorial(3) が factorial(2) を呼び出し、さらに積まれる。
        </p>
        <p className={styles.caption} data-caption="2">
          factorial(2) が factorial(1) を呼び出す。
        </p>
        <p className={styles.caption} data-caption="3">
          factorial(1) は基底ケース(n &lt;= 1)に達し、1
          を返してスタックから外れる。
        </p>
        <p className={styles.caption} data-caption="4">
          factorial(2) が 2 * 1 = 2 を計算して返り、スタックから外れる。
        </p>
        <p className={styles.caption} data-caption="5">
          factorial(3) が 3 * 2 = 6
          を計算して返り、最初の呼び出し元に結果が戻る。
        </p>
      </div>
    </CssStepAnimation>
  );
}
