"use client";

import { useState } from "react";
import { guessChoices } from "@/lib/guess";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./GuessCard.module.css";

type GuessCardProps = {
  steps: OperationStep[];
  stepIndex: number;
};

/**
 * 「次はどれ?」の任意の予想カード(Guess first)。採点せず、記録もしない。
 * 選んでも「わからない」でも、次の手順を見せるだけ。親が stepIndex を key にして、手順が進むたびに作り直す。
 */
export function GuessCard({ steps, stepIndex }: GuessCardProps) {
  const [answer, setAnswer] = useState<number | "skip" | null>(null);
  const { indices, correct } = guessChoices(steps.length, stepIndex);
  const nextLabel = steps[stepIndex + 1]?.label;

  return (
    <div className={styles.card} aria-live="polite">
      <p className={styles.title}>先に予想: 次の手順はどれ?</p>
      {answer === null ? (
        <>
          <div className={styles.choices}>
            {indices.map((stepNumber, position) => (
              <button
                key={stepNumber}
                type="button"
                className={styles.choice}
                onClick={() => setAnswer(position)}
              >
                {steps[stepNumber].label}
              </button>
            ))}
          </div>
          <button type="button" className={styles.skip} onClick={() => setAnswer("skip")}>
            わからない・見せて
          </button>
        </>
      ) : (
        <p className={styles.result} data-hit={answer === correct ? "" : undefined}>
          {answer === correct ? "予想どおり。" : "次はこちらです。"}
          <strong>{nextLabel}</strong>
          <span className={styles.hint}>「次へ」で進みます。</span>
        </p>
      )}
    </div>
  );
}
