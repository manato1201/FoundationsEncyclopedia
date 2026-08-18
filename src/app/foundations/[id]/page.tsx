import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { FoundationsAnimation } from "@/components/animation/FoundationsAnimation";
import { OperationStepsAnimation } from "@/components/animation/OperationStepsAnimation";
import { foundationsLoader } from "@/lib/content/foundations";

type FoundationsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return foundationsLoader.getAllIds().map((id) => ({ id }));
}

export default async function FoundationsDetailPage({
  params,
}: FoundationsDetailPageProps) {
  const { id } = await params;
  const entry = foundationsLoader.getDetail(id);

  if (!entry) {
    notFound();
  }

  const operationSteps = entry.operationSteps ?? [];
  const hasOperationSteps = operationSteps.length > 0;

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.backLink}>
        ← カタログに戻る
      </Link>

      <header className={styles.header}>
        <span className={styles.category}>
          {entry.category} ・ {entry.subcategory}
        </span>
        <h1 className={styles.title}>{entry.name}</h1>
        {entry.masteryBadge ? (
          <MasteryBadgeChip badge={entry.masteryBadge} />
        ) : null}
      </header>

      <div className={styles.layout}>
        <section className={styles.visualPane} aria-labelledby="visual-heading">
          <h2 id="visual-heading" className={styles.sectionLabel}>
            ■ VISUALIZE ステップの可視化
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

        <section
          className={styles.explainPane}
          aria-labelledby="explain-heading"
        >
          <h2 id="explain-heading" className={styles.sectionLabel}>
            ■ ABOUT 概要
          </h2>
          <div
            className={styles.markdownBody}
            // content/foundations/*.md はリポジトリで管理する信頼済みコンテンツのみ(外部入力なし)
            dangerouslySetInnerHTML={{ __html: entry.bodyHtml }}
          />
        </section>
      </div>
    </div>
  );
}
