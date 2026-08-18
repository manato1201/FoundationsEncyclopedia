import Link from "next/link";
import styles from "./page.module.css";

const STACK_ITEMS: { label: string; value: string }[] = [
  { label: "フロントエンド", value: "Next.js 16.2.10 (App Router) + React 19.2.4 + TypeScript" },
  { label: "ホスティング", value: "Vercel(静的サイト生成)" },
  { label: "コンテンツ", value: "Markdown + フロントマター(content/foundations/、gray-matter + marked)" },
  { label: "可視化", value: "CSSステップアニメーション(data-step属性 + CSS custom property、Canvas/pixi.jsは不使用)" },
];

/**
 * Aboutページ。The-Algorithm-Illustrated/ColorEncyclopediaのAboutページと同じ静的ページの型を踏襲する。
 */
export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← カタログに戻る
      </Link>
      <header className={styles.header}>
        <p className={styles.eyebrow}>■ ABOUT このサイトについて</p>
        <h1 className={styles.title}>FoundationsEncyclopedia(基礎学習図鑑)</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ CONCEPT コンセプト</h2>
        <p className={styles.paragraph}>
          プログラミング言語・IT知識・DCC・ツール別・Frameworkという、あらゆる専門分野の土台になる基礎知識を、CEDEC講演由来の「アルゴリズム図鑑」形式(カタログ・詳細・可視化の3層)で体系化した学習図鑑です。
        </p>
        <p className={styles.paragraph}>
          <a
            className={styles.link}
            href="https://github.com/manato1201/The-Algorithm-Illustrated"
            target="_blank"
            rel="noopener noreferrer"
          >
            The-Algorithm-Illustrated
          </a>
          (1例目、アルゴリズム図鑑)・
          <a
            className={styles.link}
            href="https://github.com/manato1201/ColorEncyclopedia"
            target="_blank"
            rel="noopener noreferrer"
          >
            ColorEncyclopedia
          </a>
          (2例目、色彩・図形理論図鑑)に続く3番目の姉妹プロジェクトで、同一のスタック・コンテンツモデルを踏襲しつつ、可視化バックエンドだけをCSS駆動に差し替えています。個人の学習用に継続開発している非商用のプロジェクトです。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ STACK 技術スタック</h2>
        <dl className={styles.stackList}>
          {STACK_ITEMS.map((item) => (
            <div key={item.label} className={styles.stackRow}>
              <dt className={styles.stackLabel}>{item.label}</dt>
              <dd className={styles.stackValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>■ SOURCE ソース</h2>
        <p className={styles.paragraph}>
          リポジトリは{" "}
          <a
            className={styles.link}
            href="https://github.com/manato1201/FoundationsEncyclopedia"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          で公開しています。
        </p>
      </section>
    </div>
  );
}
