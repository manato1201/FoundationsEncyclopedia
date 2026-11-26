import type { ReactNode } from "react";
import type { OperationStep } from "@/lib/content/foundations";
import type { VisualSummary } from "@/lib/visual/schema";
import type { LegendEntry } from "@/lib/visual/state";
import { MarkedText } from "@/components/visual-kinds/Mark";
import palette from "@/components/visual-kinds/palette.module.css";
import styles from "./VisualFrame.module.css";

type VisualFrameProps = {
  /** 英字の小ラベル(IT KNOWLEDGE / VERSION CONTROL) */
  eyebrow: string;
  /** 章の手順。渡すと「進み具合」「STEP n / N」「手順名(題名)」「注記」を出す */
  steps?: OperationStep[];
  stepIndex?: number;
  /** 進み具合の帯から段へ飛ぶ */
  onSeek?: (index: number) => void;
  /** 進み具合の帯に出す短い名前(visual.steps[i].short) */
  shorts?: (string | undefined)[];
  /** 手順がない枠(専用アニメ)の題名 */
  title?: string;
  /** 図の問いかけ(副題) */
  question?: string;
  /** 段の結論の一言(先頭の ○ △ × は評価記号) */
  verdict?: string;
  /** 右上の大きな数 */
  callout?: { value: string; label?: string };
  legend?: LegendEntry[];
  /** 「数値は目安」を出す(文字列ならその文言) */
  approx?: boolean | string;
  /** 最後の段で出すまとめ */
  summary?: VisualSummary;
  showSummary?: boolean;
  /** 手順の注記(note・menuPath)を図の下に出すか(手順トラックは自分で出すので false) */
  showNote?: boolean;
  /** 図(舞台) */
  children: ReactNode;
  /** 再生操作など、枠の下に置くもの */
  controls?: ReactNode;
};

/**
 * 図の共通の枠(全章で同じ)。上 = 英字の小ラベル・手順の進み具合・STEP と手順名・問いかけ・右上の大きな数、
 * 中 = 図、下 = 段の結論・手順の注記・(最後の段で)まとめ・凡例・「数値は目安」。
 * 枠そのものは動かない。段の切り替えで変わるのは文字と図だけ。
 */
export function VisualFrame({
  eyebrow,
  steps,
  stepIndex = 0,
  onSeek,
  shorts,
  title,
  question,
  verdict,
  callout,
  legend,
  approx,
  summary,
  showSummary = false,
  showNote = true,
  children,
  controls,
}: VisualFrameProps) {
  const step = steps?.[stepIndex];
  const total = steps?.length ?? 0;
  const approxText = approx === true ? "数値は目安" : typeof approx === "string" ? approx : null;

  return (
    <figure className={`${palette.palette} ${styles.frame}`}>
      <header className={styles.head}>
        <div className={styles.topRow}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          {steps && total > 1 ? (
            <ol className={styles.progress} aria-label="手順の進み具合">
              {steps.map((item, index) => {
                const state = index === stepIndex ? "current" : index < stepIndex ? "done" : "todo";
                const content = (
                  <>
                    <span className={styles.progressNo} data-tabular>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.progressLabel}>{shorts?.[index] ?? item.label}</span>
                  </>
                );
                return (
                  <li key={index} className={styles.progressItem} data-state={state} aria-current={state === "current" ? "step" : undefined}>
                    {onSeek ? (
                      <button type="button" className={styles.progressButton} onClick={() => onSeek(index)} title={item.label}>
                        {content}
                      </button>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
        <div className={styles.titleRow}>
          <div className={styles.titleBlock} aria-live="polite">
            {step ? (
              <p className={styles.kicker} data-tabular>
                STEP {String(stepIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
            ) : null}
            <p className={styles.title}>{step ? step.label : title}</p>
            {question ? <p className={styles.question}>{question}</p> : null}
          </div>
          {callout ? (
            <p className={styles.callout} key={stepIndex}>
              <span className={styles.calloutValue}>{callout.value}</span>
              {callout.label ? <span className={styles.calloutLabel}>{callout.label}</span> : null}
            </p>
          ) : null}
        </div>
      </header>

      <div className={styles.stage}>{children}</div>

      {verdict || (showNote && (step?.note || step?.menuPath)) ? (
        <div className={styles.caption} key={stepIndex} aria-live="polite">
          {verdict ? <MarkedText className={styles.verdict} text={verdict} /> : null}
          {showNote && step?.menuPath ? <p className={styles.menuPath}>{step.menuPath}</p> : null}
          {showNote && step?.note ? <p className={styles.note}>{step.note}</p> : null}
        </div>
      ) : null}

      {summary && showSummary ? <SummaryBlock summary={summary} /> : null}

      {(legend && legend.length > 0) || approxText ? (
        <footer className={styles.legend}>
          {legend && legend.length > 0 ? (
            <ul className={styles.legendList} aria-label="凡例">
              {legend.map((entry) => (
                <li key={entry.key} className={styles.legendItem} data-tone={entry.tone}>
                  <span className={styles.legendSwatch} aria-hidden="true">
                    {entry.mark}
                  </span>
                  {entry.label}
                </li>
              ))}
            </ul>
          ) : null}
          {approxText ? <p className={styles.approx}>※ {approxText}</p> : null}
        </footer>
      ) : null}

      {controls ? <div className={styles.controls}>{controls}</div> : null}
    </figure>
  );
}

function SummaryBlock({ summary }: { summary: VisualSummary }) {
  if (typeof summary === "string") {
    return (
      <div className={styles.summary}>
        <p className={styles.summaryKicker}>SUMMARY</p>
        <p className={styles.summaryText}>{summary}</p>
      </div>
    );
  }
  return (
    <div className={styles.summary}>
      <p className={styles.summaryKicker}>SUMMARY{summary.title ? ` — ${summary.title}` : ""}</p>
      <div className={styles.summaryScroll}>
        <table className={styles.summaryTable}>
          <thead>
            <tr>
              <th aria-hidden="true" />
              {summary.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summary.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.cells.map((cell, index) => (
                  <td key={index} data-label={summary.columns[index]}>
                    <MarkedText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {summary.note ? <p className={styles.note}>{summary.note}</p> : null}
    </div>
  );
}
