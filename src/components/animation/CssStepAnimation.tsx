"use client";

import type { CSSProperties, ReactNode } from "react";
import { useStepPlayer } from "@/components/visualizer/useStepPlayer";
import { PlaybackControls } from "@/components/visualizer/PlaybackControls";
import styles from "./CssStepAnimation.module.css";

type CssStepAnimationProps = {
  frameCount: number;
  children: ReactNode;
  resetLabel?: string;
};

/**
 * CSSステップアニメーションの共通土台(FoundationsEncyclopedia_DESIGN.md Phase 3、本図鑑最大の差別化要素)。
 * 状態管理はThe-Algorithm-Illustrated移植元の`useStepPlayer`に完全委譲し、ここでは一切変更しない。
 * `stepIndex`をCSS custom property(`--step-index`)と`data-step`属性の両方に反映するだけで、
 * 実際の見た目はエントリ側の`.module.css`が持つkeyframe/`[data-step="N"]`セレクタが決める。
 * これによりエントリ作者は新規Reactコンポーネントを書かずに新しい可視化を追加できる。
 */
export function CssStepAnimation({
  frameCount,
  children,
  resetLabel,
}: CssStepAnimationProps) {
  const player = useStepPlayer(frameCount);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.stage}
        data-step={player.stepIndex}
        style={{ "--step-index": player.stepIndex } as CSSProperties}
      >
        {children}
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
      />
    </div>
  );
}
