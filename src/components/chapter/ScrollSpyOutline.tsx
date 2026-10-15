"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollSpyOutline.module.css";

export type OutlineItem = { id: string; label: string };

/**
 * ページ内の見出し一覧(スクロールスパイ)。画面上部に来ている見出しを現在地として青で示す。
 * 目次のリンクは通常のアンカーなので、スクリプトが動かない環境でもジャンプはできる。
 */
export function ScrollSpyOutline({ items }: { items: OutlineItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // 目次の並び順で、画面内に入っている最初の見出しを現在地にする
        const current = items.find((item) => visible.has(item.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <ul className={styles.list} aria-label="このページの見出し">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`${styles.link} ${activeId === item.id ? styles.linkActive : ""}`}
            aria-current={activeId === item.id ? "location" : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
