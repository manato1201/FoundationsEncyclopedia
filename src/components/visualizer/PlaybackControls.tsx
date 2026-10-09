"use client";

import { Icon } from "@/components/icons/Icon";
import styles from "./PlaybackControls.module.css";

export type PlaybackSpeed = 0.5 | 1 | 2;
export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 1, 2];

type PlaybackControlsProps = {
  stepIndex: number;
  frameCount: number;
  showPause: boolean;
  isFinished: boolean;
  onPlayPause: () => void;
  onStep: (delta: number) => void;
  onReset: () => void;
  resetLabel?: string;
  /** 指定した場合のみ速度切替を表示する */
  speed?: PlaybackSpeed;
  onSpeedChange?: (speed: PlaybackSpeed) => void;
};

/**
 * 再生/一時停止/ステップ送り/リセットの共通コントロール(useStepPlayerとセットで使う)。
 * 段階番号は半角・等幅の「3 / 9」形式で表示し(P1)、速度は0.5x/1x/2xから選ぶ。
 */
export function PlaybackControls({
  stepIndex,
  frameCount,
  showPause,
  isFinished,
  onPlayPause,
  onStep,
  onReset,
  resetLabel = "リセット",
  speed,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => onStep(-1)}
        disabled={stepIndex === 0}
        aria-label="前のステップ"
      >
        <Icon name="step-back" />
      </button>
      <button
        type="button"
        className={styles.buttonPrimary}
        onClick={onPlayPause}
        aria-label={showPause ? "一時停止" : isFinished ? "最初から再生" : "再生"}
      >
        <Icon name={showPause ? "pause" : "play"} />
        <span>{showPause ? "一時停止" : isFinished ? "最初から" : "再生"}</span>
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => onStep(1)}
        disabled={isFinished}
        aria-label="次のステップ"
      >
        <Icon name="step-forward" />
      </button>
      <button type="button" className={styles.button} onClick={onReset} aria-label={resetLabel} title={resetLabel}>
        <Icon name="reset" />
      </button>
      {speed !== undefined && onSpeedChange ? (
        <div className={styles.speed} role="group" aria-label="再生速度">
          {PLAYBACK_SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.speedButton} ${speed === value ? styles.speedActive : ""}`}
              aria-pressed={speed === value}
              onClick={() => onSpeedChange(value)}
            >
              {value}x
            </button>
          ))}
        </div>
      ) : null}
      <span className={styles.stepCount} aria-live="polite" data-tabular>
        {stepIndex + 1} / {frameCount}
      </span>
    </div>
  );
}
