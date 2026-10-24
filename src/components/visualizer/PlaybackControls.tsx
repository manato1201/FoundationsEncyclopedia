"use client";

import { Icon } from "@/components/icons/Icon";
import styles from "./PlaybackControls.module.css";

export type PlaybackSpeed = 0.5 | 1 | 2;
export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 1, 2];

/** これを超えるステップ数では、ドットの代わりに連続バーで位置を示す */
const MAX_INDICATOR_DOTS = 20;

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
  /** 指定した場合、ステップインジケーターから任意のステップへ移動できる */
  onSeek?: (index: number) => void;
  /** 指定した場合のみ、直前ステップを薄く残す(オニオンスキン)の切替を表示する */
  onion?: boolean;
  onOnionChange?: (onion: boolean) => void;
};

/**
 * 再生/一時停止/ステップ送り/リセットの共通コントロール(useStepPlayerとセットで使う)。
 * 段階番号は半角・等幅の「3 / 9」形式で表示し(P1)、速度は0.5x/1x/2xから選ぶ。
 * ステップインジケーターは色の役割に従う(青 = 現在地 / 緑 = 通過済み)。
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
  onSeek,
  onion,
  onOnionChange,
}: PlaybackControlsProps) {
  const useDots = frameCount <= MAX_INDICATOR_DOTS;

  return (
    <div className={styles.controls}>
      {frameCount > 1 ? (
        useDots ? (
          <ol className={styles.indicator} aria-label="ステップの位置">
            {Array.from({ length: frameCount }, (_, index) => {
              const state = index === stepIndex ? "current" : index < stepIndex ? "done" : "todo";
              return (
                <li key={index} className={styles.indicatorItem}>
                  <button
                    type="button"
                    className={[styles.indicatorDot, styles[`indicator_${state}`]].filter(Boolean).join(" ")}
                    aria-label={`${index + 1}番目のステップへ`}
                    aria-current={state === "current" ? "step" : undefined}
                    disabled={!onSeek}
                    onClick={() => onSeek?.(index)}
                  />
                </li>
              );
            })}
          </ol>
        ) : (
          <div
            className={styles.indicatorBar}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={frameCount}
            aria-valuenow={stepIndex + 1}
          >
            <span
              className={styles.indicatorBarFill}
              style={{ width: `${((stepIndex + 1) / frameCount) * 100}%` }}
            />
          </div>
        )
      ) : null}
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => onStep(-1)}
        disabled={stepIndex === 0}
        aria-label="前のステップ"
        aria-keyshortcuts=","
        title="前のステップ( , )"
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
        aria-keyshortcuts="."
        title="次のステップ( . )"
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
      {onion !== undefined && onOnionChange ? (
        <button
          type="button"
          className={`${styles.toggleButton} ${onion ? styles.toggleActive : ""}`}
          aria-pressed={onion}
          onClick={() => onOnionChange(!onion)}
          title="直前のステップを薄く残して、何が変わったかを見比べます"
        >
          直前を残す
        </button>
      ) : null}
      <span className={styles.stepCount} aria-live="polite" data-tabular>
        {stepIndex + 1} / {frameCount}
      </span>
    </div>
  );
}
