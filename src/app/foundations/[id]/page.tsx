import { notFound } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./page.module.css";
import d from "@/components/chapter/ChapterDetail.module.css";
import body from "@/components/chapter/ChapterBody.module.css";
import { Icon } from "@/components/icons/Icon";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { FoundationsAnimation } from "@/components/animation/FoundationsAnimation";
import { VisualPlayer } from "@/components/visual-frame/VisualPlayer";
import { VisualFrame } from "@/components/visual-frame/VisualFrame";
import { usableVisual, validateVisual } from "@/lib/visual/schema";
import { approxText, visualChips } from "@/lib/visual/chips";
import { eyebrowFor } from "@/lib/visual/eyebrow";
import { ChapterQuiz } from "@/components/quiz/ChapterQuiz";
import { ChapterRail } from "@/components/chapter/ChapterRail";
import { ChapterMap } from "@/components/chapter/ChapterMap";
import { ChapterNav } from "@/components/chapter/ChapterNav";
import { MethodsBody } from "@/components/chapter/MethodsBody";
import { getChapterLinks } from "@/lib/chapter-links";
import { ScrollSpyOutline, type OutlineItem } from "@/components/chapter/ScrollSpyOutline";
import { splitChapterBody, stripLeadingHeading } from "@/lib/chapter-sections";
import { foundationsLoader, type FoundationsMeta } from "@/lib/content/foundations";
import { TitleBlock } from "@/components/chapter/TitleBlock";
import { chapterRevision } from "@/lib/chapter-revision";
import { FOUNDATIONS_TAXONOMY } from "@/lib/foundations-categories";

type FoundationsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return foundationsLoader.getAllIds().map((id) => ({ id }));
}

/** 全章をカテゴリ順(分類表のカテゴリ → サブカテゴリの順、同じ分類の中は id 順)に並べる。前後の章の移動に使う */
let categoryOrder: FoundationsMeta[] | null = null;
function chaptersInCategoryOrder(): FoundationsMeta[] {
  if (categoryOrder) return categoryOrder;
  const rank = (meta: FoundationsMeta) => {
    const c = FOUNDATIONS_TAXONOMY.findIndex((group) => group.category === meta.category);
    const s = c >= 0 ? (FOUNDATIONS_TAXONOMY[c].subcategories as readonly string[]).indexOf(meta.subcategory) : -1;
    return [c < 0 ? Number.MAX_SAFE_INTEGER : c, s < 0 ? Number.MAX_SAFE_INTEGER : s] as const;
  };
  categoryOrder = foundationsLoader
    .getAllMeta()
    .map((meta, index) => ({ meta, index, rank: rank(meta) }))
    .sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.index - b.index)
    .map((row) => row.meta);
  return categoryOrder;
}

/** 実装例の節にあるコードの言語(```python の python)。言語の無いコードは "code" */
function codeLanguages(html: string): string[] {
  return Array.from(html.matchAll(/<pre><code(?:\s+class="language-([^"\s]+)")?/g), (match) => match[1] ?? "code");
}

const order = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * 章ページ(詳細画面)。シェーダー・3Dモーション図鑑の詳細と同じ並びのパネルにする:
 * ITEM(操作・分類・題名・ひと言)/ SPEC(表題欄・習得度・数値チップ)/ 図と本文 / NOTES(見るポイント・使うときの注意)/
 * METHODS(実装例)/ クイズ / RELATED(つながりの地図)。データは今あるものだけで、無い欄は出さない。
 * 左 = 同じ分類の目次(現在の章の下にページ内の見出し)。
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
  const sections = splitChapterBody(entry.bodyHtml);
  const links = getChapterLinks(id);
  const hasLinks = links.refers.length + links.referredBy.length > 0;
  const hasVisual = hasOperationSteps || entry.hasVisualizer;
  const eyebrow = eyebrowFor(entry.category, entry.subcategory);
  // 章の図(visual)。検証を通らなければ図は出さず、手順トラックへフォールバックする(ビルドのログに理由を出す)
  const visual = usableVisual(entry.visual, operationSteps.length);
  if (entry.visual !== undefined && !visual) {
    console.warn(`[visual] ${id}: ${validateVisual(entry.visual, operationSteps.length).join(" / ")}`);
  }

  // NOTES: 見るポイント = claim(+ guide.watch)、使うときの注意 = 本文の「つまずきやすい点」(+ guide.caution / misconception)
  const guide = entry.guide ?? {};
  const watchTexts = [entry.claim, guide.watch].filter((text): text is string => Boolean(text));
  const cautionHtml = sections.cautionHtml ? stripLeadingHeading(sections.cautionHtml) : null;
  const hasCaution = Boolean(cautionHtml || guide.caution || guide.misconception);
  const hasNotes = watchTexts.length > 0 || hasCaution;
  const notesTitle =
    watchTexts.length > 0 && hasCaution ? "NOTES · 見る所と注意" : hasCaution ? "NOTES · 使うときの注意" : "NOTES · 見るポイント";
  // METHODS: 本文の「実装例(コード)」
  const methodsHtml = sections.exampleHtml ? stripLeadingHeading(sections.exampleHtml) : null;
  // SPEC の数値チップ: 図に目安として書かれた数値だけ
  const chips = visualChips(visual);
  const chipsNote = chips.length > 0 ? approxText(visual) : null;

  // 現在の章の下に出す、このページの見出し(スクロールスパイ)
  const outline: OutlineItem[] = [
    ...(hasVisual ? [{ id: "visual-heading", label: "ステップで見る" }] : []),
    ...sections.headings.map((heading) => ({ id: heading.id, label: heading.text })),
    ...(hasNotes ? [{ id: "notes-heading", label: watchTexts.length > 0 ? "見るポイントと注意" : "使うときの注意" }] : []),
    ...(methodsHtml ? [{ id: "methods-heading", label: "実装例" }] : []),
    ...(quiz.length > 0 ? [{ id: "quiz-heading", label: "クイズ" }] : []),
    ...(hasLinks ? [{ id: "map-heading", label: "つながりの地図" }] : []),
  ];

  const siblings = foundationsLoader
    .getAllMeta()
    .filter((meta) => meta.category === entry.category && meta.subcategory === entry.subcategory)
    .map((meta) => ({ id: meta.id, name: meta.name }));
  const currentIndex = siblings.findIndex((meta) => meta.id === id);

  // 前後の章: カテゴリ順で全章をたどる(端では反対の端へ回る)
  const sequence = chaptersInCategoryOrder();
  const seqIndex = Math.max(
    0,
    sequence.findIndex((meta) => meta.id === id),
  );
  const previous = sequence[(seqIndex - 1 + sequence.length) % sequence.length];
  const next = sequence[(seqIndex + 1) % sequence.length];

  // 表題欄の値(すべて分類表と frontmatter から決まる)。DWG = カテゴリ番号.サブカテゴリ番号-章番号
  const categoryNo = FOUNDATIONS_TAXONOMY.findIndex((group) => group.category === entry.category) + 1;
  const subcategoryNo =
    categoryNo > 0
      ? (FOUNDATIONS_TAXONOMY[categoryNo - 1].subcategories as readonly string[]).indexOf(entry.subcategory) + 1
      : 0;
  const sheetNo = currentIndex + 1;
  const dwg = `${categoryNo || "?"}.${subcategoryNo || "?"}-${String(sheetNo).padStart(2, "0")}`;
  const fig = visual
    ? visual.kind.toUpperCase()
    : hasOperationSteps
      ? "TRACK"
      : entry.hasVisualizer
        ? "ANIM"
        : "—";

  return (
    <div className={styles.page}>
      <ChapterRail />

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
                  {current ? <ScrollSpyOutline items={outline} /> : null}
                </li>
              );
            })}
          </ol>
        </aside>

        <article className={styles.main}>
          <div className={d.wrap}>
            <div className={d.detail}>
              <section
                className={`${d.panel} ${d.item} bp-sheet`}
                data-title={`ITEM · FE-${dwg}`}
                style={order(0)}
                aria-labelledby="chapter-title"
              >
                <ChapterNav
                  id={id}
                  name={entry.name}
                  previous={{ id: previous.id, name: previous.name }}
                  next={{ id: next.id, name: next.name }}
                  position={{ index: seqIndex + 1, total: sequence.length }}
                />
                <p className={d.eyebrow}>
                  {entry.category} · {entry.subcategory}
                </p>
                <h1 id="chapter-title" className={d.title}>
                  {entry.name}
                </h1>
                <p className={d.summary}>{entry.summary}</p>
              </section>

              <section
                className={`${d.panel} ${d.spec} bp-sheet`}
                data-title="SPEC · 仕様"
                style={order(1)}
                aria-labelledby="spec-heading"
              >
                <h2 id="spec-heading" className={d.srOnly}>
                  仕様
                </h2>
                <TitleBlock
                  dwg={dwg}
                  category={entry.category}
                  subcategory={entry.subcategory}
                  sheet={{ index: sheetNo, total: siblings.length }}
                  fig={fig}
                  steps={operationSteps.length}
                  quiz={quiz.length}
                  rev={chapterRevision(id)}
                />
                {entry.masteryBadge ? (
                  <dl className={d.specRows}>
                    <div className={d.specRow}>
                      <dt>MASTERY · 習得度</dt>
                      <dd>
                        <MasteryBadgeChip badge={entry.masteryBadge} />
                      </dd>
                    </div>
                  </dl>
                ) : null}
                {chips.length > 0 ? (
                  <>
                    <ul className={d.chips} aria-label="図の数値の目安">
                      {chips.map((chip) => (
                        <li key={chip.value} className={d.chip}>
                          <span className={`${d.chipValue} bp-dim`}>{chip.value}</span>
                          {chip.label ? <span className={d.chipLabel}>{chip.label}</span> : null}
                        </li>
                      ))}
                    </ul>
                    {chipsNote ? <p className={d.approx}>※ {chipsNote}</p> : null}
                  </>
                ) : null}
              </section>

              <div className={d.stage}>
                <section className={styles.visualPane} aria-labelledby="visual-heading">
                  <h2 id="visual-heading" className={styles.sectionLabel}>
                    ステップで見る
                  </h2>
                  {hasOperationSteps ? (
                    // 汎用の 3D/流れの図(OperationStepsAnimation・StepScene)は中身と無関係なので既定から外した。
                    // visual があればその型の図、なければ手順トラック
                    <VisualPlayer eyebrow={eyebrow} steps={operationSteps} spec={visual} />
                  ) : entry.hasVisualizer ? (
                    // 専用アニメ(operationSteps なし)は、共通の枠の中で従来どおり動かす
                    <VisualFrame eyebrow={eyebrow} title={entry.name} question={entry.claim ?? entry.summary}>
                      <div className={styles.bespoke}>
                        <FoundationsAnimation id={id} />
                      </div>
                    </VisualFrame>
                  ) : (
                    <div className={styles.placeholder}>
                      このエントリにはまだCSSステップアニメーションが用意されていません。概要の説明を参照してください。
                    </div>
                  )}
                </section>

                {sections.explanationHtml.trim() ? (
                  <div
                    className={`${body.markdownBody} ${d.body}`}
                    // content/foundations/*.md はリポジトリで管理する信頼済みコンテンツのみ(外部入力なし)
                    dangerouslySetInnerHTML={{ __html: sections.explanationHtml }}
                  />
                ) : null}
              </div>

              {hasNotes ? (
                <section
                  className={`${d.panel} ${d.notes} bp-sheet`}
                  data-title={notesTitle}
                  style={order(2)}
                  aria-labelledby="notes-heading"
                >
                  <h2 id="notes-heading" className={d.srOnly}>
                    {watchTexts.length > 0 ? "見るポイントと注意" : "使うときの注意"}
                  </h2>
                  <div className={d.cards}>
                    {watchTexts.length > 0 ? (
                      <section className={d.card} aria-labelledby="notes-watch">
                        <h3 id="notes-watch" className={d.cardTitle}>
                          <span className="bp-balloon" aria-hidden="true">
                            1
                          </span>
                          <span className={`${d.cardTag} bp-tag`}>NOTE</span>
                          見るポイント
                        </h3>
                        {watchTexts.map((text) => (
                          <p key={text} className={d.cardText}>
                            {text}
                          </p>
                        ))}
                      </section>
                    ) : null}
                    {hasCaution ? (
                      <section className={`${d.card} ${d.cardCaution}`} aria-labelledby="notes-caution">
                        <h3 id="notes-caution" className={d.cardTitle}>
                          <span className="bp-balloon" aria-hidden="true">
                            {watchTexts.length > 0 ? 2 : 1}
                          </span>
                          <span className={`${d.cardTag} bp-tag`}>CAUTION</span>
                          使うときの注意
                        </h3>
                        {cautionHtml ? (
                          <div
                            className={`${body.markdownBody} ${d.cardBody}`}
                            dangerouslySetInnerHTML={{ __html: cautionHtml }}
                          />
                        ) : null}
                        {guide.caution ? <p className={d.cardText}>{guide.caution}</p> : null}
                        {guide.misconception ? (
                          <p className={d.cardText}>
                            <span className={d.cardSub}>よくある誤解</span>
                            {guide.misconception}
                          </p>
                        ) : null}
                      </section>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {methodsHtml ? (
                <section
                  className={`${d.panel} ${d.methods} bp-sheet`}
                  data-title="METHODS · 実装例"
                  style={order(3)}
                  aria-labelledby="methods-heading"
                >
                  <h2 id="methods-heading" className={d.srOnly}>
                    実装例
                  </h2>
                  <MethodsBody html={methodsHtml} langs={codeLanguages(methodsHtml)} />
                </section>
              ) : null}

              {quiz.length > 0 ? (
                <div className={d.quiz}>
                  <ChapterQuiz entryId={id} items={quiz} />
                </div>
              ) : null}

              {hasLinks ? (
                <section
                  className={`${d.panel} ${d.related} bp-sheet`}
                  data-title="RELATED · 関連"
                  style={order(4)}
                  aria-labelledby="map-heading"
                >
                  <h2 id="map-heading" className={d.srOnly}>
                    つながりの地図
                  </h2>
                  <ChapterMap name={entry.name} links={links} />
                </section>
              ) : null}
            </div>
          </div>

          <nav className={styles.pager} aria-label="前後の章(カテゴリ順)">
            <Link href={`/foundations/${previous.id}`} className={styles.pagerLink}>
              <Icon name="arrow-left" size={14} />
              <span>{previous.name}</span>
            </Link>
            <Link href={`/foundations/${next.id}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              <span>{next.name}</span>
              <Icon name="arrow-right" size={14} />
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
