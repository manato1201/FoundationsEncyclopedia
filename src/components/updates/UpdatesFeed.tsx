import Link from "next/link";
import styles from "./UpdatesFeed.module.css";
import type { UpdateItem } from "@/lib/updates";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

type UpdatesFeedProps = {
  items: UpdateItem[];
};

/**
 * このサイト自身の更新履歴を表示する。The-Algorithm-IllustratedのUpdatesFeedと見た目は揃えつつ、
 * データが静的(src/lib/updates.ts)でビルド時に確定するため、外部フィードのようなfetch/loading状態は持たない。
 */
export function UpdatesFeed({ items }: UpdatesFeedProps) {
  if (items.length === 0) {
    return <p className={styles.status}>まだ更新履歴がありません。</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardDate}>{formatDate(item.date)}</span>
          </div>
          <h2 className={styles.cardTitle}>{item.title}</h2>
          <p className={styles.cardDescription}>{item.description}</p>
          {item.entryIds && item.entryIds.length > 0 ? (
            <ul className={styles.entryLinks}>
              {item.entryIds.map((id) => (
                <li key={id}>
                  <Link
                    href={`/foundations/${id}`}
                    className={styles.entryLink}
                  >
                    {id}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
