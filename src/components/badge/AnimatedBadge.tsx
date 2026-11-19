import styles from "./AnimatedBadge.module.css";

/** CSSステップアニメーション対応済みであることを示す小さなバッジ。 */
export function AnimatedBadge() {
  return (
    <span className={styles.badge} title="このエントリはCSSステップアニメーション対応済みです">
      <span className={styles.dot} aria-hidden="true" />
      アニメーション対応
    </span>
  );
}
