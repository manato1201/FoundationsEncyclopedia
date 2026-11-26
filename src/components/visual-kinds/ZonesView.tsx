"use client";

import { Fragment, useLayoutEffect, useRef, type CSSProperties } from "react";
import type { ZonesSpec } from "@/lib/visual/schema";
import {
  legendMap,
  prefersReducedMotion,
  zonesState,
} from "@/lib/visual/state";
import styles from "./ZonesView.module.css";

type ZonesViewProps = { spec: ZonesSpec; step: number; still?: boolean };

/**
 * zones: 名前つきの場所(列)の間を、もの(チップ)が移動する。
 * 移動は FLIP(前の位置から今の位置へ transform で滑らせる)。動きを減らす設定・縮小コマでは即座に置き換わる。
 */
export function ZonesView({ spec, step, still = false }: ZonesViewProps) {
  const { place, state, highlight, zoneFocus } = zonesState(spec, step);
  const legend = legendMap(spec);
  const rootRef = useRef<HTMLDivElement>(null);
  const previous = useRef(new Map<string, { x: number; y: number }>());

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const origin = root.getBoundingClientRect();
    const animate = !still && !prefersReducedMotion();
    const next = new Map<string, { x: number; y: number }>();
    root.querySelectorAll<HTMLElement>("[data-item]").forEach((element) => {
      const id = element.dataset.item ?? "";
      const rect = element.getBoundingClientRect();
      const position = { x: rect.left - origin.left, y: rect.top - origin.top };
      next.set(id, position);
      if (!animate) return;
      const before = previous.current.get(id);
      if (before) {
        const dx = before.x - position.x;
        const dy = before.y - position.y;
        if (Math.abs(dx) + Math.abs(dy) > 1) {
          element.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "none" },
            ],
            {
              duration: 560,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
          );
        }
      } else if (previous.current.size > 0) {
        element.animate(
          [
            { opacity: 0, transform: "scale(0.85)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 300,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
        );
      }
    });
    previous.current = next;
  }, [step, still]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ "--zones": spec.zones.length } as CSSProperties}
    >
      {spec.zones.map((zone, index) => {
        const items = spec.items.filter((item) => place[item.id] === zone.id);
        return (
          <Fragment key={zone.id}>
            {index > 0 && spec.arrows !== false ? (
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            ) : null}
            <section
              className={styles.zone}
              data-focus={zoneFocus.has(zone.id) ? "" : undefined}
              aria-label={zone.label}
            >
              <header className={styles.zoneHead}>
                <span className={styles.zoneIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.zoneLabel}>{zone.label}</span>
              </header>
              {zone.note ? (
                <p className={styles.zoneNote}>{zone.note}</p>
              ) : null}
              <ul className={styles.items}>
                {items.map((item) => {
                  const entry = state[item.id]
                    ? legend.get(state[item.id])
                    : undefined;
                  return (
                    <li
                      key={item.id}
                      className={styles.item}
                      data-item={item.id}
                      data-tone={entry?.tone}
                      data-filled={entry ? "" : undefined}
                      data-highlight={highlight.has(item.id) ? "" : undefined}
                    >
                      {entry ? (
                        <span className={styles.itemMark} aria-hidden="true">
                          {entry.mark}
                        </span>
                      ) : null}
                      <span className={styles.itemLabel}>{item.label}</span>
                      {entry ? (
                        <span className={styles.srOnly}>({entry.label})</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          </Fragment>
        );
      })}
    </div>
  );
}
