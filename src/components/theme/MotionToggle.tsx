"use client";

import { useSyncExternalStore } from "react";
import styles from "./MotionToggle.module.css";

const STORAGE_KEY = "fe-motion";

type MotionState = "full" | "reduce" | "os";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => observer.disconnect();
}

/** "os": OS側で「動きを減らす」が有効(この画面では変更できない) */
function getSnapshot(): MotionState {
  const root = document.documentElement;
  if (root.dataset.motionOs === "reduce") return "os";
  return root.dataset.motion === "reduce" ? "reduce" : "full";
}

const getServerSnapshot = (): MotionState => "full";

/**
 * 「動きを減らす」の手動スイッチ。prefers-reduced-motion の手動版で、ONにするとアニメーション・遷移を止める。
 * OS側の設定が有効なときは常にONで、ここからは解除できない(OSの設定を尊重する)。
 */
export function MotionToggle() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const checked = state !== "full";

  const toggle = () => {
    if (state === "os") return;
    const next = state === "reduce" ? "full" : "reduce";
    document.documentElement.dataset.motion = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できない環境では、そのページ内の切替だけ有効にする
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="動きを減らす"
      className={styles.switch}
      onClick={toggle}
      disabled={state === "os"}
      title={state === "os" ? "OSの設定で「動きを減らす」が有効です" : "アニメーションを止める"}
      suppressHydrationWarning
    >
      <span className={styles.label}>動き</span>
      <span className={styles.track} aria-hidden="true" suppressHydrationWarning>
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
