"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  exportReviews,
  importReviews,
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

  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([exportReviews()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "foundations-review.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("復習の記録を書き出しました");
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const result = importReviews(await file.text());
    setMessage(result.ok ? `${result.imported}件の記録を読み込みました` : "読み込めませんでした。書き出したJSONファイルを選んでください");
    if (fileInput.current) fileInput.current.value = "";
  };

  const tools = (
    <details className={styles.tools}>
      <summary>復習の記録を書き出す・読み込む</summary>
      <p className={styles.toolsNote}>
        記録はこのブラウザの中だけに保存されています。別の端末へ移すときは、書き出したファイルを読み込んでください。
      </p>
      <div className={styles.toolsRow}>
        <button type="button" className={styles.toolButton} onClick={handleExport}>
          書き出す(JSON)
        </button>
        <button type="button" className={styles.toolButton} onClick={() => fileInput.current?.click()}>
          読み込む
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className={styles.fileInput}
          onChange={(event) => void handleImport(event.target.files?.[0])}
          aria-label="復習の記録ファイルを選ぶ"
        />
      </div>
      {message ? (
        <p className={styles.toolsMessage} role="status">
          {message}
        </p>
      ) : null}
    </details>
  );

  if (dueEntries.length === 0) {
    return <section className={styles.quiet}>{tools}</section>;
  }

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
      {tools}
    </section>
  );
}
