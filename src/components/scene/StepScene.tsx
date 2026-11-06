"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FlowScene } from "./FlowScene";
import { resolveScene, type SceneSpec } from "@/lib/step-scene";
import { setScenePref, useScenePref, type SceneView } from "@/lib/scene-pref";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./StepScene.module.css";

/** three.js は立体を使うときだけ読み込む(別チャンク)。読み込み中は同じ高さの枠を出して、ガタつきを防ぐ */
const Scene3D = dynamic(() => import("./Scene3D").then((module) => module.Scene3D), {
  ssr: false,
  loading: () => <div className={styles.loading} aria-hidden="true" />,
});

/** 章ごとの図の種類と、いま平面/立体のどちらで見せるか(好みが未選択なら章の既定、WebGL不可なら平面) */
export function useSceneView(id: string) {
  const spec = resolveScene(id);
  const pref = useScenePref();
  const [failed, setFailed] = useState(false);
  const wanted: SceneView = pref ?? (spec.solidFirst ? "3d" : "2d");
  const view: SceneView = failed ? "2d" : wanted;
  return { spec, view, failed, fail: () => setFailed(true) };
}

type StepSceneProps = {
  spec: SceneSpec;
  view: SceneView;
  steps: OperationStep[];
  stepIndex: number;
  onSeek?: (index: number) => void;
  onFail: () => void;
};

export function StepScene({ spec, view, steps, stepIndex, onSeek, onFail }: StepSceneProps) {
  return (
    <div className={styles.scene} data-view={view}>
      {view === "3d" ? (
        <Scene3D steps={steps} stepIndex={stepIndex} kind={spec.solid} onFail={onFail} onSeek={onSeek} />
      ) : (
        <FlowScene steps={steps} stepIndex={stepIndex} kind={spec.flow} onSeek={onSeek} />
      )}
    </div>
  );
}

/** 平面/立体の切り替え。WebGLが使えない環境では立体を無効にする */
export function SceneViewToggle({ view, disabled3d }: { view: SceneView; disabled3d: boolean }) {
  return (
    <div className={styles.toggle} role="group" aria-label="図の見せ方">
      <button
        type="button"
        className={styles.toggleButton}
        aria-pressed={view === "2d"}
        onClick={() => setScenePref("2d")}
      >
        平面
      </button>
      <button
        type="button"
        className={styles.toggleButton}
        aria-pressed={view === "3d"}
        disabled={disabled3d}
        title={disabled3d ? "この環境では立体表示を使えません" : "three.jsで立体にします。ドラッグで回せます"}
        onClick={() => setScenePref("3d")}
      >
        立体
      </button>
    </div>
  );
}
