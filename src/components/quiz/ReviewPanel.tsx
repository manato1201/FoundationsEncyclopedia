"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  listAll,
  REVIEW_INTERVAL_DAYS,
  subscribeReviews,
  type ReviewRecord,
} from "@/lib/review-store";
import styles from "./ReviewPanel.module.css";

type ReviewPanelProps = {
  /** id → 章名 */
  titles: Record<string, string>;
};

const EMPTY: ReviewRecord[] = [];
let cachedRaw = "";
let cachedValue: ReviewRecord[] = EMPTY;

/** 期限が来た記録だけを返す。内容が変わらない限り同じ配列参照を返す(useSyncExternalStoreの要件) */
function getSnapshot(): ReviewRecord[] {
  const now = Date.now();
  const next = listAll().filter((record) => record.dueAt <= now);
  const raw = JSON.stringify(next);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = next;
  }
  return cachedValue;
}

const getServerSnapshot = (): ReviewRecord[] => EMPTY;

/** トップページの「復習」。期限が来た問題がある章だけを表示する(F6の固定間隔版)。 */
export function ReviewPanel({ titles }: ReviewPanelProps) {
  const records = useSyncExternalStore(
    subscribeReviews,
    getSnapshot,
    getServerSnapshot,
  );

  const dueEntries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const record of records) {
      if (titles[record.entryId]) {
        counts.set(record.entryId, (counts.get(record.entryId) ?? 0) + 1);
      }
    }
    return [...counts.entries()];
  }, [records, titles]);

  if (dueEntries.length === 0) return null;

  return (
    <section className={styles.panel} aria-labelledby="review-heading">
      <h2 id="review-heading" className={styles.title}>
        復習
        <span className={styles.count} data-tabular>
          {dueEntries.length}
        </span>
      </h2>
      <p className={styles.subtitle}>
        間違えた問題を {REVIEW_INTERVAL_DAYS.join("・")} 日後に再出題しています
      </p>
      <ul className={styles.list}>
        {dueEntries.map(([entryId, count]) => (
          <li key={entryId}>
            <Link
              href={`/foundations/${entryId}#quiz-heading`}
              className={styles.item}
            >
              <span>{titles[entryId]}</span>
              <span className={styles.itemCount} data-tabular>
                {count}問
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
