"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./EntryCard.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { AnimatedBadge } from "@/components/badge/AnimatedBadge";
import { StepPreview } from "@/components/visual/StepPreview";
import { useInView } from "@/lib/use-in-view";
import { isAnimated } from "@/lib/is-animated";
import type { FoundationsMeta } from "@/lib/content/foundations";

export type EntryView = "grid" | "list";

type EntryCardProps = {
  entry: FoundationsMeta;
  view: EntryView;
  showCategory?: boolean;
  style?: CSSProperties;
  /** 出現演出(1 回きり)をかけるか */
  enter?: boolean;
};

/**
 * 一覧の 1 件。グリッド表示は「プレビュー枠 → 名前 → 一言 → 習得バッジ・アニメ対応の印」のカード。
 * プレビュー(StepPreview)は、画面(上下 240px)に入っている間だけマウントする。495 件を一度に描かない。
 * 枠の高さは固定なので、マウント/アンマウントでレイアウトは動かない。
 * 静止している間は最初の段階が点灯し、カードのホバー/フォーカス(または「プレビューを動かす」ON)でループ再生する。
 * 動きを減らす設定では StepPreview 側が再生しない。リスト表示はプレビューを出さない(密度を優先)。
 */
export function EntryCard({ entry, view, showCategory = false, style, enter = false }: EntryCardProps) {
  const [mediaRef, inView] = useInView<HTMLDivElement>();
  const isGrid = view === "grid";
  const animated = isAnimated(entry);
  return (
    <li
      className={`${styles.card} ${isGrid ? styles.grid : styles.list} ${enter ? styles.enter : ""}`}
      style={style}
      data-step-preview-host
    >
      {isGrid ? (
        <div ref={mediaRef} className={styles.media}>
          {inView ? <StepPreview steps={entry.operationSteps} bespoke={entry.hasVisualizer} variant="tile" /> : null}
        </div>
      ) : null}
      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link href={`/foundations/${entry.id}`} className={styles.link}>
            {entry.name}
          </Link>
        </h3>
        <p className={styles.summary}>{entry.summary}</p>
        <div className={styles.meta}>
          {showCategory ? (
            <span className={styles.category}>
              {entry.category} ・ {entry.subcategory}
            </span>
          ) : null}
          {entry.masteryBadge ? <MasteryBadgeChip badge={entry.masteryBadge} /> : null}
          {animated ? <AnimatedBadge /> : null}
        </div>
      </div>
    </li>
  );
}
