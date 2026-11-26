"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./EntryCard.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { AnimatedBadge } from "@/components/badge/AnimatedBadge";
import { StepPreview } from "@/components/visual/StepPreview";
import { VisualThumb } from "@/components/visual-frame/VisualThumb";
import { usableVisual } from "@/lib/visual/schema";
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
 * プレビュー(StepPreview)は、画面(上下 240px)に入っている間だけマウントする。545 件を一度に描かない。
 * 枠の高さは固定なので、マウント/アンマウントでレイアウトは動かない。
 * 静止している間は最初の段階が点灯し、カードのホバー/フォーカス(または「プレビューを動かす」ON)でループ再生する。
 * 図(frontmatter の visual)のある章は、StepPreview の代わりに図の最後の段の縮小静止コマ(VisualThumb)を出す。
 * 動きを減らす設定では StepPreview 側が再生しない。リスト表示はプレビューを出さない(密度を優先)。
 */
export function EntryCard({ entry, view, showCategory = false, style, enter = false }: EntryCardProps) {
  const [mediaRef, inView] = useInView<HTMLDivElement>();
  const isGrid = view === "grid";
  const animated = isAnimated(entry);
  // 図(visual)のある章は最後の段の縮小コマ、ない章は手順の縮小(StepPreview)
  const visual = isGrid ? usableVisual(entry.visual, entry.operationSteps?.length ?? 0) : undefined;
  return (
    <li
      className={`${styles.card} ${isGrid ? styles.grid : styles.list} ${enter ? styles.enter : ""}`}
      style={style}
      data-step-preview-host
    >
      {isGrid ? (
        <div ref={mediaRef} className={styles.media}>
          {inView ? (
            visual ? (
              <VisualThumb spec={visual} />
            ) : (
              <StepPreview steps={entry.operationSteps} bespoke={entry.hasVisualizer} variant="tile" />
            )
          ) : null}
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
