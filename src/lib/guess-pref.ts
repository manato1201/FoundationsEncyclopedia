"use client";

import { useSyncExternalStore } from "react";

/** 「先に予想する」を使うかどうか。既定はオフ(任意の機能で、押しつけない) */
const STORAGE_KEY = "fe-guess-first";
const CHANGE_EVENT = "fe-guess-first-change";

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setGuessPref(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // 保存できない環境でも、そのページ内では効く
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

export function useGuessPref(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}
