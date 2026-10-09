"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { recordAnswer } from "@/lib/review-store";
import type { QuizItem } from "@/lib/content/foundations";
import styles from "./ChapterQuiz.module.css";

type ChapterQuizProps = {
  entryId: string;
  items: QuizItem[];
};

/**
 * 章末の理解度クイズ(F5)。選択肢をタップすると波紋が広がり、その場で正誤と解説を表示する。
 * 正答数は「2 / 3」形式の等幅数字で、変わった瞬間に桁がめくれる(prefers-reduced-motionでは止まる)。
 * 全問正解すると「全問正解」バッジが付く。不正解は復習ストア(固定間隔 1/3/7日)に記録される。
 */
export function ChapterQuiz({ entryId, items }: ChapterQuizProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(selected).length;
  const correctCount = items.reduce(
    (count, item, index) => count + (selected[index] === item.answer ? 1 : 0),
    0,
  );
  const allDone = answeredCount === items.length;
  const perfect = allDone && correctCount === items.length;

  const choose = (questionIndex: number, choiceIndex: number) => {
    if (selected[questionIndex] !== undefined) return;
    setSelected((current) => ({ ...current, [questionIndex]: choiceIndex }));
    recordAnswer(
      entryId,
      questionIndex,
      choiceIndex === items[questionIndex].answer,
    );
  };

  return (
    <section className={styles.quiz} aria-labelledby="quiz-heading">
      <div className={styles.header}>
        <div>
          <h2 id="quiz-heading" className={styles.title}>
            理解度クイズ
          </h2>
          <p className={styles.subtitle}>この章で分かったことを確認する</p>
        </div>
        <div className={styles.score} aria-live="polite" data-tabular>
          <span key={correctCount} className={styles.scoreDigit}>
            {correctCount}
          </span>
          <span className={styles.scoreTotal}> / {items.length}</span>
          {perfect ? <span className={styles.rareBadge}>全問正解</span> : null}
        </div>
      </div>

      <ol className={styles.questions}>
        {items.map((item, questionIndex) => {
          const chosen = selected[questionIndex];
          const answered = chosen !== undefined;
          return (
            <li key={questionIndex} className={styles.question}>
              <p className={styles.questionText}>
                <span className={styles.questionNumber} data-tabular>
                  Q{questionIndex + 1}
                </span>
                {item.question}
              </p>
              <ul className={styles.choices}>
                {item.choices.map((choice, choiceIndex) => {
                  const isCorrect = choiceIndex === item.answer;
                  const isChosen = chosen === choiceIndex;
                  const state = !answered
                    ? ""
                    : isCorrect
                      ? styles.choiceCorrect
                      : isChosen
                        ? styles.choiceWrong
                        : styles.choiceDim;
                  return (
                    <li key={choiceIndex}>
                      <button
                        type="button"
                        className={`${styles.choice} ${state}`}
                        onClick={() => choose(questionIndex, choiceIndex)}
                        disabled={answered}
                      >
                        <span className={styles.choiceMark}>
                          {answered && isCorrect ? (
                            <Icon name="check" size={14} />
                          ) : (
                            String.fromCharCode(65 + choiceIndex)
                          )}
                        </span>
                        <span>{choice}</span>
                        {isChosen ? (
                          <span className={styles.ripple} aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {answered ? (
                <p className={styles.explanation} role="status">
                  <strong>{chosen === item.answer ? "正解" : "不正解"}</strong>
                  {item.explanation ? ` — ${item.explanation}` : null}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      {allDone && !perfect ? (
        <p className={styles.note}>
          間違えた問題は、翌日・3日後・7日後にトップページの「復習」に出ます。
        </p>
      ) : null}
    </section>
  );
}
