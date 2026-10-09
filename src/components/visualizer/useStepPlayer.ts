"use client";

import { useCallback, useEffect, useState } from "react";

const PLAY_INTERVAL_MS = 400;

/**
 * フレーム列の再生状態を管理する共通フック(The-Algorithm-Illustratedからの無改造移植)。
 * effect内で直接setStateせず、setTimeoutコールバック内でのみ呼ぶことでreact-hooks/set-state-in-effectを回避している。
 * 移植元からの唯一の変更は、再生速度のための第2引数`intervalMs`(省略時は移植元と同じ400ms)の追加のみ。
 * FoundationsEncyclopediaではCSS駆動の可視化(CssStepAnimation)がこのフックをそのまま利用する
 * (FoundationsEncyclopedia_DESIGN.md Phase 3: 状態管理層はpixi.js/CSSどちらのバックエンドに対しても変更なしに機能する)。
 */
export function useStepPlayer(frameCount: number, intervalMs: number = PLAY_INTERVAL_MS) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || stepIndex >= frameCount - 1) return;
    const timer = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, frameCount - 1));
    }, intervalMs);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, frameCount, intervalMs]);

  const isFinished = stepIndex >= frameCount - 1;
  const showPause = isPlaying && !isFinished;

  const handlePlayPause = useCallback(() => {
    if (stepIndex >= frameCount - 1) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((playing) => !playing);
  }, [stepIndex, frameCount]);

  const handleStep = useCallback(
    (delta: number) => {
      setIsPlaying(false);
      setStepIndex((i) => Math.min(Math.max(i + delta, 0), frameCount - 1));
    },
    [frameCount],
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  return {
    stepIndex: Math.min(stepIndex, Math.max(frameCount - 1, 0)),
    isFinished,
    showPause,
    handlePlayPause,
    handleStep,
    reset,
  };
}
