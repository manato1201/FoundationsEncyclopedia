"use client";

import { useSyncExternalStore } from "react";

/**
 * CSS のメディアクエリの一致を返す。サーバー描画・水和の最初の描画は false(見た目は CSS が決めるので、
 * これは「いまシート表示か」のような挙動の切り替えにだけ使う)。
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
