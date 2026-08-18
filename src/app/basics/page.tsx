import Link from "next/link";
import styles from "./page.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { FOUNDATIONS_TAXONOMY } from "@/lib/foundations-categories";
import { MASTERY_BADGE_ORDER } from "@/lib/mastery-badge";

/**
 * 「基礎学習図鑑とは?」ページ。The-Algorithm-Illustratedの/basicsと同じ静的ページの型を踏襲しつつ、
 * 内容は本図鑑固有のコンセプト(5カテゴリ・習得度バッジ・CSSステップアニメーション)を説明する。
 * 既存データ(FOUNDATIONS_TAXONOMY/MASTERY_BADGE_META)をそのまま参照し、内容を重複定義しない。
 */
export default function BasicsPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← カタログに戻る
      </Link>
      <header className={styles.header}>
        <p className={styles.eyebrow}>■ BASICS はじめての方へ</p>
        <h1 className={styles.title}>基礎学習図鑑とは?</h1>
        <p className={styles.lead}>
          この図鑑の見方・使い方をまとめました。カタログを眺める前に読むと、各要素の意味が分かりやすくなります。
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ WHAT この図鑑は何を目指しているか</h2>
        <p className={styles.paragraph}>
          プログラミング言語・IT知識・DCC(Digital Content
          Creation)・ツール別・Frameworkという、あらゆる専門分野の土台になる基礎知識を、「一覧して深掘りできる」形式で体系化した図鑑です。初学者の自己学習だけでなく、既に一定のスキルを持つ学習者が「基礎の抜け漏れ」を確認し直す用途も想定しています。
        </p>
        <p className={styles.paragraph}>
          各エントリはカタログ・詳細・可視化の3層で構成されます。カタログで一覧・絞り込みを行い、詳細ページで概要やつまずきやすい点を読み、対応するエントリではCSSステップアニメーションで手順やフローを実際に動かして確認できます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ CATEGORY 5つのカテゴリ</h2>
        <p className={styles.paragraph}>収録エントリは以下の5カテゴリに分類されています。カタログ画面のチップから絞り込めます。</p>
        <dl className={styles.categoryList}>
          {FOUNDATIONS_TAXONOMY.map((entry) => (
            <div key={entry.category} className={styles.categoryRow}>
              <dt className={styles.categoryTerm}>{entry.category}</dt>
              <dd className={styles.categoryDesc}>{entry.subcategories.join(" / ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ BADGE 習得度バッジとは</h2>
        <p className={styles.paragraph}>
          各エントリには任意で習得度バッジを設定できます。図鑑としての中立的な参照用途と、ユーザー個人の学習進捗トラッキング用途を両立させるため、全エントリへの設定は強制していません。
        </p>
        <dl className={styles.badgeList}>
          {MASTERY_BADGE_ORDER.map((badge) => (
            <div key={badge} className={styles.badgeRow}>
              <dt>
                <MasteryBadgeChip badge={badge} />
              </dt>
              <dd className={styles.badgeDesc}>{BADGE_DESCRIPTIONS[badge]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ ANIMATION CSSステップアニメーションとは</h2>
        <p className={styles.paragraph}>
          手順やフローを扱うエントリの一部には、詳細ページに再生・一時停止・ステップ送りができる可視化がついています。裏側では
          <code className={styles.code}>pixi.js</code>
          のようなCanvas描画ではなく、軽量なCSSクラス切り替え(<code className={styles.code}>data-step</code>属性とCSS custom
          property)で状態を表現しています。カタログの「アニメーション対応のみ」チップで絞り込むと、対応エントリだけを一覧できます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ NEXT 次に読むと良いページ</h2>
        <p className={styles.paragraph}>
          準備ができたら、
          <Link href="/" className={styles.link}>
            カタログ
          </Link>
          から気になるエントリを選んでみてください。図鑑の更新履歴は
          <Link href="/updates" className={styles.link}>
            更新情報
          </Link>
          ページで確認できます。
        </p>
      </section>
    </div>
  );
}

const BADGE_DESCRIPTIONS: Record<(typeof MASTERY_BADGE_ORDER)[number], string> = {
  done: "実績・成果物があり、既に習得済みの領域。",
  review: "経験はあるが、体系化・言語化が必要な領域。",
  next: "自分の路線の延長で、今後必要になる領域。",
  advanced: "既存スキルを掛け合わせて到達できる、応用・発展の領域。",
};
