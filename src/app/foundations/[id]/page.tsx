import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { Icon } from "@/components/icons/Icon";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { FoundationsAnimation } from "@/components/animation/FoundationsAnimation";
import { OperationStepsAnimation } from "@/components/animation/OperationStepsAnimation";
import { ChapterQuiz } from "@/components/quiz/ChapterQuiz";
import { foundationsLoader } from "@/lib/content/foundations";

type FoundationsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return foundationsLoader.getAllIds().map((id) => ({ id }));
}

/**
 * 章ページ(P3の型): 左=目次(同じ分類の章) / 中央=見出し+副題・段階アニメ・解説 / 下=段階操作(アニメ枠の下部)。
 * 見出しは「見出し + 灰色の副題(その章で分かること)」の2段にする。
 */
export default async function FoundationsDetailPage({ params }: FoundationsDetailPageProps) {
  const { id } = await params;
  const entry = foundationsLoader.getDetail(id);

  if (!entry) {
    notFound();
  }

  const operationSteps = entry.operationSteps ?? [];
  const hasOperationSteps = operationSteps.length > 0;
  const quiz = entry.quiz ?? [];

  const siblings = foundationsLoader
    .getAllMeta()
    .filter((meta) => meta.category === entry.category && meta.subcategory === entry.subcategory)
    .map((meta) => ({ id: meta.id, name: meta.name }));
  const currentIndex = siblings.findIndex((meta) => meta.id === id);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        <Icon name="arrow-left" size={14} />
        カタログに戻る
      </Link>

      <div className={styles.layout}>
        <aside className={styles.toc} aria-label="同じ分類の章">
          <p className={styles.tocLabel}>
            {entry.category}
            <span className={styles.tocSub}>{entry.subcategory}</span>
          </p>
          <ol className={styles.tocList}>
            {siblings.map((sibling, index) => {
              const current = sibling.id === id;
              return (
                <li key={sibling.id}>
                  <Link
                    href={`/foundations/${sibling.id}`}
                    className={`${styles.tocItem} ${current ? styles.tocItemCurrent : ""}`}
                    aria-current={current ? "page" : undefined}
                  >
                    <span className={styles.tocIndex} data-tabular>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{sibling.name}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>

        <article className={styles.main}>
          <header className={styles.header}>
            <p className={styles.category}>
              {entry.category} ・ {entry.subcategory}
            </p>
            <h1 className={styles.title}>{entry.name}</h1>
            <p className={styles.subtitle}>{entry.summary}</p>
            {entry.masteryBadge ? <MasteryBadgeChip badge={entry.masteryBadge} /> : null}
          </header>

          <section className={styles.visualPane} aria-labelledby="visual-heading">
            <h2 id="visual-heading" className={styles.sectionLabel}>
              ステップで見る
            </h2>
            {hasOperationSteps ? (
              <OperationStepsAnimation steps={operationSteps} />
            ) : entry.hasVisualizer ? (
              <FoundationsAnimation id={id} />
            ) : (
              <div className={styles.placeholder}>
                このエントリにはまだCSSステップアニメーションが用意されていません。概要の説明を参照してください。
              </div>
            )}
          </section>

          <section className={styles.explainPane} aria-labelledby="explain-heading">
            <h2 id="explain-heading" className={styles.sectionLabel}>
              解説
            </h2>
            <div
              className={styles.markdownBody}
              // content/foundations/*.md はリポジトリで管理する信頼済みコンテンツのみ(外部入力なし)
              dangerouslySetInnerHTML={{ __html: entry.bodyHtml }}
            />
          </section>

          {quiz.length > 0 ? <ChapterQuiz entryId={id} items={quiz} /> : null}

          <nav className={styles.pager} aria-label="前後の章">
            {previous ? (
              <Link href={`/foundations/${previous.id}`} className={styles.pagerLink}>
                <Icon name="arrow-left" size={14} />
                <span>{previous.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/foundations/${next.id}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
                <span>{next.name}</span>
                <Icon name="arrow-right" size={14} />
              </Link>
            ) : null}
          </nav>
        </article>
      </div>
    </div>
  );
}
