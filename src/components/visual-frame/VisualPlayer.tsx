"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";
import { useStepPlayer } from "@/components/visualizer/useStepPlayer";
import { PlaybackControls, type PlaybackSpeed } from "@/components/visualizer/PlaybackControls";
import { GuessCard } from "@/components/scene/GuessCard";
import { guessTransitions } from "@/lib/guess";
import { setGuessPref, useGuessPref } from "@/lib/guess-pref";
import type { OperationStep } from "@/lib/content/foundations";
import type { VisualSpec } from "@/lib/visual/schema";
import { resolveLegend } from "@/lib/visual/state";
import { VisualFrame } from "./VisualFrame";
import { VisualStage } from "./VisualStage";
import { StepTrack } from "./StepTrack";
import styles from "./VisualPlayer.module.css";

/** 自動再生の 1 段の長さ(速度 1x)。図を読む時間を取る */
const STEP_MS = 2600;

type VisualPlayerProps = {
  /** 英字の小ラベル */
  eyebrow: string;
  /** 章の operationSteps(段の数・題名・注記の出どころ) */
  steps: OperationStep[];
  /** 検証済みの visual。なければ手順トラックを出す */
  spec?: VisualSpec;
};

/**
 * 章の図のプレイヤー。共通の枠(VisualFrame)+図(6 型のどれか、なければ手順トラック)+再生操作。
 * 再生操作は既存の useStepPlayer / PlaybackControls をそのまま使う(戻る・進む・再生・速度・段へ飛ぶ)。
 * 「先に予想する」「スクロールで進める」も従来どおり選べる。
 */
export function VisualPlayer({ eyebrow, steps, spec }: VisualPlayerProps) {
  const [scrolly, setScrolly] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const player = useStepPlayer(steps.length, STEP_MS / speed);
  const guessOn = useGuessPref();
  const prompts = guessTransitions(steps.length);
  const canGuess = prompts.length > 0 && !scrolly;
  const guess = canGuess && guessOn;
  const stepIndex = player.stepIndex;
  // 予想を問う手順では、「次へ」のボタンに次の手順名を出さない(答えを先に見せないため)
  const nextLabel = guess && prompts.includes(stepIndex) ? "(予想してから確かめる)" : steps[stepIndex + 1]?.label;

  // コマ送りのキー: , = 前 / . = 次(この枠にフォーカスがあるときだけ)
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) return;
    if (event.key === ",") {
      event.preventDefault();
      player.handleStep(-1);
    } else if (event.key === ".") {
      event.preventDefault();
      player.handleStep(1);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.modeRow}>
        {canGuess ? (
          <button
            type="button"
            className={`${styles.modeButton} ${guessOn ? styles.modeButtonActive : ""}`}
            aria-pressed={guessOn}
            onClick={() => setGuessPref(!guessOn)}
            title="最大3か所だけ、次の手順を先に予想できます。採点も記録もしません"
          >
            先に予想する
          </button>
        ) : null}
        <button
          type="button"
          className={`${styles.modeButton} ${scrolly ? styles.modeButtonActive : ""}`}
          aria-pressed={scrolly}
          onClick={() => setScrolly((current) => !current)}
          title="ページをスクロールした量に合わせて、ステップが1つずつ進みます"
        >
          スクロールで進める
        </button>
      </div>
      {scrolly ? (
        <ScrollStepped eyebrow={eyebrow} steps={steps} spec={spec} />
      ) : (
        <div className={styles.focusable} tabIndex={0} onKeyDown={handleKeyDown} aria-keyshortcuts=", .">
          <FramedVisual
            eyebrow={eyebrow}
            steps={steps}
            spec={spec}
            stepIndex={stepIndex}
            onSeek={player.goTo}
            controls={
              <>
                {guess && prompts.includes(stepIndex) ? <GuessCard key={stepIndex} steps={steps} stepIndex={stepIndex} /> : null}
                {steps.length > 1 ? (
                  <button
                    type="button"
                    className={styles.nextButton}
                    onClick={player.isFinished ? player.reset : () => player.handleStep(1)}
                  >
                    {player.isFinished ? (
                      <>
                        <Icon name="reset" size={16} />
                        最初からもう一度
                      </>
                    ) : (
                      <>
                        次へ: {nextLabel}
                        <Icon name="arrow-right" size={16} />
                      </>
                    )}
                  </button>
                ) : null}
                <PlaybackControls
                  stepIndex={stepIndex}
                  frameCount={steps.length}
                  isFinished={player.isFinished}
                  showPause={player.showPause}
                  onPlayPause={player.handlePlayPause}
                  onStep={player.handleStep}
                  onReset={player.reset}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  onSeek={player.goTo}
                />
              </>
            }
          />
        </div>
      )}
    </div>
  );
}

/** 枠+図(または手順トラック)。プレイヤーとスクロール表示で共通 */
function FramedVisual({
  eyebrow,
  steps,
  spec,
  stepIndex,
  onSeek,
  controls,
}: {
  eyebrow: string;
  steps: OperationStep[];
  spec?: VisualSpec;
  stepIndex: number;
  onSeek?: (index: number) => void;
  controls?: ReactNode;
}) {
  const visualStep = spec?.steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  return (
    <VisualFrame
      eyebrow={spec?.eyebrow ?? eyebrow}
      steps={steps}
      stepIndex={stepIndex}
      onSeek={onSeek}
      shorts={spec?.steps.map((step) => step.short)}
      question={spec?.question}
      verdict={visualStep?.verdict}
      callout={visualStep?.callout}
      legend={spec ? resolveLegend(spec.legend) : undefined}
      approx={spec?.approx}
      summary={spec?.summary}
      showSummary={isLast}
      showNote={spec !== undefined}
      controls={controls}
      sheetTitle={spec ? `FIG · ${spec.kind.toUpperCase()} · 図` : "FIG · TRACK · 手順"}
    >
      {spec ? (
        <VisualStage spec={spec} step={stepIndex} />
      ) : (
        <StepTrack steps={steps} stepIndex={stepIndex} onSeek={onSeek} />
      )}
    </VisualFrame>
  );
}

/** スクロール量(0〜1)を段に対応させる。枠は固定表示(sticky)にする */
function ScrollStepped({ eyebrow, steps, spec }: { eyebrow: string; steps: OperationStep[]; spec?: VisualSpec }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const count = steps.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      const scrollable = track.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-track.getBoundingClientRect().top / scrollable, 0), 1) : 0;
      setStepIndex(Math.min(count - 1, Math.floor(progress * count)));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  return (
    <div ref={trackRef} className={styles.scrollTrack} style={{ height: `${count * 45 + 55}vh` }}>
      <div className={styles.scrollSticky}>
        <FramedVisual eyebrow={eyebrow} steps={steps} spec={spec} stepIndex={stepIndex} />
        <p className={styles.scrollHint}>
          <span data-tabular>
            {stepIndex + 1} / {count}
          </span>
          <span>下にスクロールすると次のステップへ進みます</span>
        </p>
      </div>
    </div>
  );
}
