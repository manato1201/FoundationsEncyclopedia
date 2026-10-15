"use client";

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useStepPlayer } from "@/components/visualizer/useStepPlayer";
import { PlaybackControls, type PlaybackSpeed } from "@/components/visualizer/PlaybackControls";
import styles from "./CssStepAnimation.module.css";

type CssStepAnimationProps = {
  frameCount: number;
  /** 関数を渡すと現在のステップ番号を受け取れる(直前ステップの表示などに使う)。その場合はオニオンスキンの切替も出る */
  children: ReactNode | ((context: { stepIndex: number }) => ReactNode);
  resetLabel?: string;
};

/**
 * CSSステップアニメーションの共通土台(FoundationsEncyclopedia_DESIGN.md Phase 3、本図鑑最大の差別化要素)。
 * 状態管理はThe-Algorithm-Illustrated移植元の`useStepPlayer`に委譲する(再生速度の間隔だけを渡す)。
 * `stepIndex`をCSS custom property(`--step-index`)と`data-step`属性の両方に反映するだけで、
 * 実際の見た目はエントリ側の`.module.css`が持つkeyframe/`[data-step="N"]`セレクタが決める。
 * これによりエントリ作者は新規Reactコンポーネントを書かずに新しい可視化を追加できる。
 */
export function CssStepAnimation({
  frameCount,
  children,
  resetLabel,
}: CssStepAnimationProps) {
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [onion, setOnion] = useState(false);
  const player = useStepPlayer(frameCount, 400 / speed);
  const renderPrev = typeof children === "function";

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
    <div className={styles.wrapper} tabIndex={0} onKeyDown={handleKeyDown} aria-keyshortcuts=", .">
      <div
        className={styles.stage}
        data-step={player.stepIndex}
        data-onion={onion ? "on" : undefined}
        style={{ "--step-index": player.stepIndex } as CSSProperties}
      >
        {typeof children === "function" ? children({ stepIndex: player.stepIndex }) : children}
      </div>
      <PlaybackControls
        stepIndex={player.stepIndex}
        frameCount={frameCount}
        isFinished={player.isFinished}
        showPause={player.showPause}
        onPlayPause={player.handlePlayPause}
        onStep={player.handleStep}
        onReset={player.reset}
        resetLabel={resetLabel}
        speed={speed}
        onSpeedChange={setSpeed}
        onSeek={player.goTo}
        onion={renderPrev ? onion : undefined}
        onOnionChange={renderPrev ? setOnion : undefined}
      />
    </div>
  );
}
