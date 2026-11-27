"use client";

import { useSyncExternalStore } from "react";

/**
 * お気に入りの章(章の id の集合)。scene-pref・review-store と同じく localStorage に保存する。
 * 保存できない環境でも、そのページ内では切り替わる(メモリ上の値を使う)。他のサイトとは共有しない。
 */
const STORAGE_KEY = "fe-favorites-v1";
const CHANGE_EVENT = "fe-favorites-change";
const EMPTY: ReadonlySet<string> = new Set();

let memory: string | null = null;
let cachedRaw: string | null = null;
let cachedSet: ReadonlySet<string> = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

/** useSyncExternalStore 用。中身が変わらない限り同じ Set を返す */
function snapshot(): ReadonlySet<string> {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedSet;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedSet = new Set(
      Array.isArray(parsed)
        ? parsed.filter((v): v is string => typeof v === "string")
        : [],
    );
  } catch {
    cachedSet = EMPTY;
  }
  return cachedSet;
}

export function toggleFavorite(id: string) {
  const next = new Set(snapshot());
  if (next.has(id)) next.delete(id);
  else next.add(id);
  const raw = JSON.stringify([...next]);
  memory = raw;
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // 保存できない環境では、このページの間だけ覚える
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

export function useFavorites(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}
