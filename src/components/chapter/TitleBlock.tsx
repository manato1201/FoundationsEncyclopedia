import styles from "./TitleBlock.module.css";

type TitleBlockProps = {
  /** 図面番号(カテゴリ番号.サブカテゴリ番号-章番号。例: 2.2-04) */
  dwg: string;
  category: string;
  subcategory: string;
  /** 同じ分類の中で何枚目か */
  sheet: { index: number; total: number };
  /** 図の型(ZONES・TIERS…/ 手順トラックは TRACK・専用アニメは ANIM・なしは —) */
  fig: string;
  steps: number;
  quiz: number;
  /** 最後に章を変えた日(git)。分からなければ null */
  rev: string | null;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 章の表題欄(製図の図面の右下にある欄の形)。章を 1 枚の図面に見立て、番号・分類・何枚目・図の型・段の数・問題数・改訂日を
 * 罫線の小欄に並べる。値はすべて章の frontmatter と分類表から決まる(手で書かない)。
 */
export function TitleBlock({ dwg, category, subcategory, sheet, fig, steps, quiz, rev }: TitleBlockProps) {
  return (
    <dl className={styles.block} aria-label="表題欄">
      <div className={`${styles.cell} ${styles.dwg}`}>
        <dt>DWG</dt>
        <dd data-tabular>{dwg}</dd>
      </div>
      <div className={`${styles.cell} ${styles.kind}`}>
        <dt>KIND · 分類</dt>
        <dd>
          {category} / {subcategory}
        </dd>
      </div>
      <div className={styles.cell}>
        <dt>SHEET · 何枚目</dt>
        <dd data-tabular>
          {pad(sheet.index)} / {pad(sheet.total)}
        </dd>
      </div>
      <div className={styles.cell}>
        <dt>FIG · 図</dt>
        <dd>{fig}</dd>
      </div>
      <div className={styles.cell}>
        <dt>STEPS · 段</dt>
        <dd data-tabular>{steps > 0 ? steps : "—"}</dd>
      </div>
      <div className={styles.cell}>
        <dt>QUIZ · 問</dt>
        <dd data-tabular>{quiz > 0 ? quiz : "—"}</dd>
      </div>
      <div className={styles.cell}>
        <dt>REV · 改訂</dt>
        <dd data-tabular>{rev ? <time dateTime={rev}>{rev}</time> : "—"}</dd>
      </div>
    </dl>
  );
}
