"use client";

import { useSyncExternalStore } from "react";

/** 手順の図を平面/立体のどちらで見るかの好み。未選択(null)なら章ごとの既定に従う */
export type SceneView = "2d" | "3d";

const STORAGE_KEY = "fe-scene-view";
const CHANGE_EVENT = "fe-scene-view-change";

function read(): SceneView | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "2d" || value === "3d" ? value : null;
  } catch {
    return null;
  }
}

export function setScenePref(view: SceneView) {
  try {
    localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // 保存できない環境でも、そのページ内の切り替えは効く(イベントで再読込される)
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useScenePref(): SceneView | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
