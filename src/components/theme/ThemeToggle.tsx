"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/icons/Icon";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";
const STORAGE_KEY = "fe-theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

/** サーバー描画時はダークを仮定する。実際の値はlayoutのインラインスクリプトが初回描画前にDOMへ設定済み。 */
const getServerSnapshot = (): Theme => "dark";

/** ライト/ダークの手動切替(P10)。初期値は保存値 → なければ prefers-color-scheme。 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "light" ? "dark" : "light";

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できない環境(プライベートモード等)では、そのページ内の切替だけ有効にする
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggle}
      aria-label={next === "light" ? "ライトテーマに切り替える" : "ダークテーマに切り替える"}
      title={next === "light" ? "ライトテーマ" : "ダークテーマ"}
      suppressHydrationWarning
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size={16} />
    </button>
  );
}
