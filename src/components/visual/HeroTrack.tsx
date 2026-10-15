import type { CSSProperties } from "react";
import styles from "./HeroTrack.module.css";

const NODES = ["変数と型", "条件分岐", "ループ", "関数", "配列・データ構造"];

/**
 * ヒーローの装飾: 「順番に」積み上がる基礎を、5つの節が順に点灯して示す(常時ループ)。
 * 意味は見出しと本文で伝わるため、補助技術からは隠す。動きを減らす設定では最初の節だけを点灯して静止する。
 * カタログの動きは、この装飾と、カードの段階プレビュー(ホバー/再生ON時のみ)の2種類に限る。
 */
export function HeroTrack() {
  return (
    <ol className={styles.track} aria-hidden="true">
      {NODES.map((name, index) => (
        // --o: 点灯の位相。節ごとに1.2秒ずつずらす(6秒周期で1周)
        <li key={name} className={styles.node} style={{ "--o": index === 0 ? 0 : NODES.length - index } as CSSProperties}>
          <span className={styles.dot} />
          <span className={styles.name}>{name}</span>
        </li>
      ))}
    </ol>
  );
}
