/**
 * 間隔反復(F6)の固定間隔版。間違えた問題を「翌日 → 3日後 → 7日後」に再出題する。
 * 効果を確認してから FSRS 等へ置き換える前提のため、保存形式は最小限(localStorage)に留める。
 */
export type ReviewRecord = {
  entryId: string;
  questionIndex: number;
  /** 0: 初回の間違い → 1日後 / 1: 次も正解 → 3日後 / 2: さらに正解 → 7日後 / 3到達で卒業(削除) */
  stage: number;
  dueAt: number;
};

const STORAGE_KEY = "fe-review-v1";
const CHANGE_EVENT = "fe-review-change";
const INTERVAL_DAYS = [1, 3, 7];
const DAY_MS = 24 * 60 * 60 * 1000;

const keyOf = (entryId: string, questionIndex: number) => `${entryId}#${questionIndex}`;

function readAll(): Record<string, ReviewRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReviewRecord>) : {};
  } catch {
    return {};
  }
}

function writeAll(records: Record<string, ReviewRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // 保存できない環境では復習機能のみ無効になる
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** 回答結果を記録する。不正解は初期段階に戻し、正解は復習中の問題だけ段階を進める */
export function recordAnswer(entryId: string, questionIndex: number, correct: boolean, now = Date.now()) {
  const records = readAll();
  const key = keyOf(entryId, questionIndex);
  const existing = records[key];
  if (!correct) {
    records[key] = { entryId, questionIndex, stage: 0, dueAt: now + INTERVAL_DAYS[0] * DAY_MS };
  } else if (existing) {
    const stage = existing.stage + 1;
    if (stage >= INTERVAL_DAYS.length) {
      delete records[key];
    } else {
      records[key] = { ...existing, stage, dueAt: now + INTERVAL_DAYS[stage] * DAY_MS };
    }
  }
  writeAll(records);
}

export function listAll(): ReviewRecord[] {
  return Object.values(readAll());
}

export function subscribeReviews(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export const REVIEW_INTERVAL_DAYS = INTERVAL_DAYS;
