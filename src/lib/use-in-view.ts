"use client";

import { useEffect, useState } from "react";

type Listener = (inView: boolean) => void;

const listeners = new WeakMap<Element, Listener>();
let sharedObserver: IntersectionObserver | null = null;

/**
 * 画面(上下 240px の余白つき)に入っているかを見る。495 件のカードがそれぞれ Observer を作らないよう、
 * ページ全体で 1 つの IntersectionObserver を共有する。入ったら true・十分に離れたら false を返す。
 * IntersectionObserver が無い環境では、常に true(従来どおり全部描く)にする。
 */
function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (records) => {
        for (const record of records) listeners.get(record.target)?.(record.isIntersecting);
      },
      { rootMargin: "240px 0px" },
    );
  }
  return sharedObserver;
}

export function useInView<T extends Element>(): [(node: T | null) => void, boolean] {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = getObserver();
    if (!observer) {
      queueMicrotask(() => setInView(true));
      return;
    }
    listeners.set(node, setInView);
    observer.observe(node);
    return () => {
      observer.unobserve(node);
      listeners.delete(node);
    };
  }, [node]);

  return [setNode, inView];
}
