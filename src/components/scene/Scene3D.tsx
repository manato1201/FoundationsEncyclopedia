"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildScene, type Palette, type SceneBuild } from "@/lib/three-scenes";
import { shortLabel, type SolidKind } from "@/lib/step-scene";
import type { OperationStep } from "@/lib/content/foundations";
import styles from "./Scene3D.module.css";

type Scene3DProps = {
  steps: OperationStep[];
  stepIndex: number;
  kind: SolidKind;
  /** WebGLが使えない・初期化に失敗したとき、呼び出し側が平面表示へ戻す */
  onFail: () => void;
  onSeek?: (index: number) => void;
};

function readPalette(element: HTMLElement): Palette {
  const style = getComputedStyle(element);
  const read = (name: string, fallback: string) =>
    new THREE.Color(style.getPropertyValue(name).trim() || fallback);
  return {
    blue: read("--color-accent-blue", "#3ba7ff"),
    green: read("--color-accent-green", "#4dffb0"),
    amber: read("--color-accent-amber", "#ffa733"),
    muted: read("--color-text-muted", "#8792a6"),
    text: read("--color-text", "#eaf0f7"),
    surface: read("--color-bg-surface", "#10141d"),
    light: document.documentElement.dataset.theme === "light",
  };
}

/**
 * 手順を立体(three.js)で見せる。描画ループ・視点・ドラッグ回転・ラベルの重ね合わせを受け持ち、
 * 形の作り方は `three-scenes.ts` の6種類に任せる。
 * - 画面外・タブが裏のときは描画を止める。動きを減らす設定では自動回転と補間をやめ、変化があった時だけ描く
 * - テーマ切替で色を読み直して作り直す。アンマウント時はGPU資源(ジオメトリ・材質・コンテキスト)を解放する
 */
export function Scene3D({
  steps,
  stepIndex,
  kind,
  onFail,
  onSeek,
}: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stepRef = useRef(stepIndex);
  const apiRef = useRef<{ setStep: (index: number) => void } | null>(null);
  const onFailRef = useRef(onFail);
  const count = steps.length;

  useEffect(() => {
    onFailRef.current = onFail;
  }, [onFail]);

  // ステップが変わったら、作ってある立体へ伝える(作り直しはしない)
  useEffect(() => {
    stepRef.current = stepIndex;
    apiRef.current?.setStep(stepIndex);
  }, [stepIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      onFailRef.current();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.className = styles.canvas;
    container.prepend(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(3, 5, 4);
    scene.add(sun);

    let build: SceneBuild | null = null;
    let width = 0;
    let height = 0;
    let dirty = true;
    let visible = true;
    let dragging = false;
    let raf = 0;
    let last = performance.now();
    const fixedLabelElements: {
      element: HTMLSpanElement;
      object: THREE.Object3D;
    }[] = [];

    const clearFixedLabels = () => {
      fixedLabelElements.forEach(({ element }) => element.remove());
      fixedLabelElements.length = 0;
    };

    const rotation = { y: -0.5, x: 0.12 };

    const create = () => {
      if (build) {
        scene.remove(build.root);
        build.dispose();
        clearFixedLabels();
      }
      build = buildScene(kind, { count, palette: readPalette(container) });
      build.root.rotation.set(rotation.x, rotation.y, 0);
      scene.add(build.root);
      build.setStep(stepRef.current);
      build.fixedLabels.forEach((label) => {
        const element = document.createElement("span");
        element.className = styles.fixedLabel;
        element.textContent = label.text;
        container.appendChild(element);
        fixedLabelElements.push({ element, object: label.object });
      });
      applyCamera();
      apiRef.current = {
        setStep: (index) => {
          build?.setStep(index);
          dirty = true;
        },
      };
      dirty = true;
    };

    const applyCamera = () => {
      if (!build || width === 0) return;
      const aspect = width / height;
      const zoom = aspect < 1.5 ? Math.min(1.7, 1.5 / aspect) : 1;
      const target = build.cameraTarget;
      camera.position
        .copy(target)
        .addScaledVector(
          new THREE.Vector3().subVectors(build.cameraPosition, target),
          zoom,
        );
      camera.lookAt(target);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      applyCamera();
      dirty = true;
    };

    const projected = new THREE.Vector3();
    const placeLabel = (element: HTMLElement, object: THREE.Object3D) => {
      object.getWorldPosition(projected);
      projected.project(camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      element.style.opacity = projected.z < 1 ? "1" : "0";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!build || !visible || document.visibilityState === "hidden") return;
      const instant = document.documentElement.dataset.motion === "reduce";
      if (!instant && !dragging) {
        rotation.y += dt * 0.22;
        dirty = true;
      }
      if (instant && !dirty) return;
      build.root.rotation.set(rotation.x, rotation.y, 0);
      build.update(dt, now / 1000, instant, camera);
      scene.updateMatrixWorld(true);
      renderer.render(scene, camera);
      build.anchors.forEach((anchor, index) => {
        const element = labelRefs.current[index];
        if (element) placeLabel(element, anchor);
      });
      fixedLabelElements.forEach(({ element, object }) =>
        placeLabel(element, object),
      );
      dirty = instant ? false : true;
    };

    // ドラッグで回す(縦スクロールは邪魔しない)
    let lastX = 0;
    let lastY = 0;
    const onDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      container.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      rotation.y += (event.clientX - lastX) * 0.009;
      rotation.x = Math.max(
        -0.6,
        Math.min(0.9, rotation.x + (event.clientY - lastY) * 0.005),
      );
      lastX = event.clientX;
      lastY = event.clientY;
      dirty = true;
    };
    const onUp = (event: PointerEvent) => {
      dragging = false;
      if (container.hasPointerCapture(event.pointerId))
        container.releasePointerCapture(event.pointerId);
    };
    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) dirty = true;
    });
    intersection.observe(container);
    // テーマが変わったら、色を読み直して作り直す
    const themeObserver = new MutationObserver(create);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    create();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      clearFixedLabels();
      if (build) {
        scene.remove(build.root);
        build.dispose();
      }
      apiRef.current = null;
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [kind, count]);

  const hasLabels =
    kind === "stack" || kind === "helix" || kind === "ring" || kind === "tree";

  return (
    <div
      ref={containerRef}
      className={styles.stage}
      role="img"
      aria-label={`${count}つの手順を立体で表した図。現在は${stepIndex + 1}番目。ドラッグで回せます`}
    >
      {hasLabels
        ? steps.map((step, index) => {
            const state =
              index === stepIndex
                ? "current"
                : index < stepIndex
                  ? "done"
                  : "todo";
            return (
              <span
                key={index}
                ref={(element) => {
                  labelRefs.current[index] = element;
                }}
                className={styles.label}
                data-state={state}
                aria-hidden="true"
                onClick={onSeek ? () => onSeek(index) : undefined}
              >
                <span className={styles.labelNumber}>{index + 1}</span>
                {state === "current" ? (
                  <span className={styles.labelText}>
                    {shortLabel(step.label, 14)}
                  </span>
                ) : null}
              </span>
            );
          })
        : null}
      <span className={styles.hint} aria-hidden="true">
        ドラッグで回す
      </span>
    </div>
  );
}
