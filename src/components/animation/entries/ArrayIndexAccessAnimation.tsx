"use client";

import { CssStepAnimation } from "../CssStepAnimation";
import styles from "./ArrayIndexAccessAnimation.module.css";

const VALUES = [90, 80, 70, 60];

/**
 * 配列のインデックスアクセス(scores[i]のようにインデックスを指定すると、
 * 先頭アドレス+オフセットの計算だけで直接その要素にアクセスできる様子)。
 * C#/C++/Java/TypeScript/Rust/Pythonの配列(相当)系エントリで共用する、言語非依存の概念図。
 */
export function ArrayIndexAccessAnimation() {
  return (
    <CssStepAnimation frameCount={4}>
      <div className={styles.stage}>
        <div className={styles.array}>
          {VALUES.map((value, index) => (
            <div key={index} className={styles.cell}>
              <span className={`${styles.value} ${styles[`cell${index}`]}`}>
                {value}
              </span>
              <span className={styles.index}>[{index}]</span>
            </div>
          ))}
        </div>
        <p className={styles.caption} data-caption="0">
          scores[0] にアクセスする。先頭要素なのでオフセット計算は0。
        </p>
        <p className={styles.caption} data-caption="1">
          scores[1]
          にアクセスする。先頭アドレス+要素1個分のオフセットで直接計算できる。
        </p>
        <p className={styles.caption} data-caption="2">
          scores[2]
          にアクセスする。インデックスがどこであっても計算量は変わらない。
        </p>
        <p className={styles.caption} data-caption="3">
          scores[3]
          にアクセスする。どの位置への直接アクセスも同じコスト(O(1))で行える。
        </p>
      </div>
    </CssStepAnimation>
  );
}
