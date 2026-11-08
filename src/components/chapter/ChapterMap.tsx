import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { ProvenanceTag } from "@/components/scene/ProvenanceTag";
import type { ChapterLinks, LinkedChapter } from "@/lib/chapter-links";
import styles from "./ChapterMap.module.css";

const LIMIT = 6;

function Column({ title, items }: { title: string; items: LinkedChapter[] }) {
  const shown = items.slice(0, LIMIT);
  const rest = items.length - shown.length;
  return (
    <div className={styles.column}>
      <p className={styles.columnTitle}>{title}</p>
      {shown.length === 0 ? (
        <p className={styles.empty}>なし</p>
      ) : (
        <ul className={styles.list}>
          {shown.map((item) => (
            <li key={item.id}>
              <Link href={`/foundations/${item.id}`} className={styles.chip}>
                {item.name}
              </Link>
            </li>
          ))}
          {rest > 0 ? <li className={styles.more}>ほか {rest} 章</li> : null}
        </ul>
      )}
    </div>
  );
}

/**
 * つながりの地図(依存の地図の考え方): 左=この章の本文が参照している章 → 中央=この章 → 右=この章を参照している章。
 * 「前提」と断定せず、本文のリンクから読み取った事実だけを出す(出どころの札=読み取り)。
 */
export function ChapterMap({ name, links }: { name: string; links: ChapterLinks }) {
  if (links.refers.length === 0 && links.referredBy.length === 0) return null;
  return (
    <section className={styles.map} aria-labelledby="map-heading">
      <h2 id="map-heading" className={styles.heading}>
        つながりの地図
      </h2>
      <div className={styles.grid}>
        <Column title="本文で参照している章" items={links.refers} />
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="arrow-right" size={16} />
        </span>
        <div className={styles.center}>
          <span className={styles.centerLabel}>いまの章</span>
          <span className={styles.centerName}>{name}</span>
        </div>
        <span className={styles.arrow} aria-hidden="true">
          <Icon name="arrow-right" size={16} />
        </span>
        <Column title="この章を参照している章" items={links.referredBy} />
      </div>
      <p className={styles.note}>
        <ProvenanceTag kind="read">各章の本文にあるリンクから集めました。学ぶ順序の「前提」と決めたものではありません。</ProvenanceTag>
      </p>
    </section>
  );
}
