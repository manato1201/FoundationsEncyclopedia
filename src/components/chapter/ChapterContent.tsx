"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChapterQuiz } from "@/components/quiz/ChapterQuiz";
import type { QuizItem } from "@/lib/content/foundations";
import styles from "./ChapterContent.module.css";

export type ChapterGuide = {
  watch?: string;
  caution?: string;
  misconception?: string;
};

type TabKey = "explain" | "example" | "quiz";

type ChapterContentProps = {
  entryId: string;
  explanationHtml: string;
  exampleHtml: string | null;
  quiz: QuizItem[];
  guide?: ChapterGuide;
};

const GUIDE_ITEMS: { key: keyof ChapterGuide; label: string; caution?: boolean }[] = [
  { key: "watch", label: "見るポイント" },
  { key: "caution", label: "使うときの注意", caution: true },
  { key: "misconception", label: "よくある誤解", caution: true },
];

/**
 * 章の本文を「解説 / 例 / クイズ」のタブで切り替える。該当する内容がないタブは出さない。
 * タブ内容は常にDOMへ置き(hiddenで隠す)、クイズの回答状態や目次リンクの飛び先を保つ。
 * `#section-N`・`#quiz-heading` へのリンクは、対応するタブを自動で開く。
 */
export function ChapterContent({ entryId, explanationHtml, exampleHtml, quiz, guide }: ChapterContentProps) {
  const [tab, setTab] = useState<TabKey>("explain");
  const tabs = useRef<HTMLDivElement>(null);

  const available: { key: TabKey; label: string }[] = [{ key: "explain", label: "解説" }];
  if (exampleHtml) available.push({ key: "example", label: "例" });
  if (quiz.length > 0) available.push({ key: "quiz", label: "クイズ" });

  useEffect(() => {
    const open = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const next: TabKey | null =
        hash === "quiz-heading" ? "quiz" : hash.startsWith("section-") ? "explain" : null;
      if (!next) return;
      setTab(next);
      // タブを開いた直後に目的の見出しへスクロールする
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
    };
    window.addEventListener("hashchange", open);
    const frame = requestAnimationFrame(open);
    return () => {
      window.removeEventListener("hashchange", open);
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;
    event.preventDefault();
    const next = available[(index + delta + available.length) % available.length];
    setTab(next.key);
    tabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${next.key}"]`)?.focus();
  };

  const guideItems = guide ? GUIDE_ITEMS.filter((item) => guide[item.key]) : [];

  return (
    <div>
      {available.length > 1 ? (
        <div ref={tabs} className={styles.tabs} role="tablist" aria-label="章の内容">
          {available.map((item, index) => (
            <button
              key={item.key}
              id={`tab-${item.key}`}
              data-tab={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              aria-controls={`panel-${item.key}`}
              tabIndex={tab === item.key ? 0 : -1}
              className={`${styles.tab} ${tab === item.key ? styles.tabActive : ""}`}
              onClick={() => setTab(item.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <div id="panel-explain" role="tabpanel" aria-labelledby="tab-explain" hidden={tab !== "explain"}>
        <div
          className={styles.markdownBody}
          // content/foundations/*.md はリポジトリで管理する信頼済みコンテンツのみ(外部入力なし)
          dangerouslySetInnerHTML={{ __html: explanationHtml }}
        />
        {guide && guideItems.length > 0 ? (
          <section className={styles.guide} aria-labelledby="guide-heading">
            <h2 id="guide-heading" className={styles.guideTitle}>
              この章の見方
            </h2>
            <dl className={styles.guideList}>
              {guideItems.map((item) => (
                <div key={item.key}>
                  <dt className={`${styles.guideTerm} ${item.caution ? styles.guideTermCaution : ""}`}>
                    {item.label}
                  </dt>
                  <dd className={styles.guideDesc}>{guide[item.key]}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>

      {exampleHtml ? (
        <div id="panel-example" role="tabpanel" aria-labelledby="tab-example" hidden={tab !== "example"}>
          <div className={styles.markdownBody} dangerouslySetInnerHTML={{ __html: exampleHtml }} />
        </div>
      ) : null}

      {quiz.length > 0 ? (
        <div id="panel-quiz" role="tabpanel" aria-labelledby="tab-quiz" hidden={tab !== "quiz"}>
          <ChapterQuiz entryId={entryId} items={quiz} />
        </div>
      ) : null}
    </div>
  );
}
