"use client";

import { ForLoopFlowAnimation } from "./entries/ForLoopFlowAnimation";
import { GitBranchWorkflowAnimation } from "./entries/GitBranchWorkflowAnimation";
import { BlenderModifierStackAnimation } from "./entries/BlenderModifierStackAnimation";
import { OsiEncapsulationAnimation } from "./entries/OsiEncapsulationAnimation";
import { GameLoopAnimation } from "./entries/GameLoopAnimation";
import { StateMachineAnimation } from "./entries/StateMachineAnimation";
import { ContainerLayersAnimation } from "./entries/ContainerLayersAnimation";
import { FOR_LOOP_ANIMATIONS } from "@/lib/animations/for-loop-animations";
import { GIT_ANIMATIONS } from "@/lib/animations/git-animations";
import { DCC_STEP_ANIMATIONS } from "@/lib/animations/dcc-step-animations";
import { NETWORK_ANIMATIONS } from "@/lib/animations/network-animations";
import { CONTAINER_ANIMATIONS } from "@/lib/animations/container-animations";

type FoundationsAnimationProps = {
  id: string;
};

/**
 * どのCSSステップアニメーションを使うかをidから振り分ける共通ディスパッチャ
 * (The-Algorithm-IllustratedのAlgorithmVisualizer.tsxと同型)。
 * どの登録にも該当しない場合はnullを返す(呼び出し側でhasAnimation()と組み合わせてプレースホルダを出し分ける)。
 */
export function FoundationsAnimation({ id }: FoundationsAnimationProps) {
  if (id in FOR_LOOP_ANIMATIONS) return <ForLoopFlowAnimation />;
  if (id in GIT_ANIMATIONS) return <GitBranchWorkflowAnimation />;
  if (id in DCC_STEP_ANIMATIONS) return <BlenderModifierStackAnimation />;
  if (id in NETWORK_ANIMATIONS) return <OsiEncapsulationAnimation />;
  if (id in CONTAINER_ANIMATIONS) return <ContainerLayersAnimation />;
  if (id === "game-loop-basics") return <GameLoopAnimation />;
  if (id === "state-machine-basics") return <StateMachineAnimation />;
  return null;
}
