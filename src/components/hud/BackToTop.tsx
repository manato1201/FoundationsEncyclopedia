"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import styles from "./BackToTop.module.css";

/** 1 画面ぶん以上スクロールしたら出す */
const SHOW_AFTER_SCREENS = 1.2;

/**
 * 「ページの先頭へ戻る」ボタン。長い章ページ・カタログで、一定量スクロールしたあとだけ右下に出る。
 * 出現は 1 回きりの opacity/transform。戻るスクロールは、動きを減らす設定(OS / 画面の手動スイッチ)では即時。
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * SHOW_AFTER_SCREENS);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;

  const goTop = () => {
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "reduce";
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button type="button" className={styles.button} onClick={goTop} aria-label="ページの先頭へ戻る">
      <Icon name="chevron-up" size={18} />
    </button>
  );
}
