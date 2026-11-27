"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { toggleFavorite, useFavorites } from "@/lib/favorites-store";
import styles from "./ChapterDetail.module.css";

type NavTarget = { id: string; name: string };

type ChapterNavProps = {
  id: string;
  name: string;
  previous: NavTarget;
  next: NavTarget;
  /** カテゴリ順の全章の中で何番目か(1 始まり) */
  position: { index: number; total: number };
};

/** 入力中・タブ列・スライダーなど、矢印キーを自分で使う所では章を移らない */
function ownsArrowKeys(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.closest("input, textarea, select")) return true;
  return target.closest('[role="tablist"], [role="group"], [role="slider"], [role="radiogroup"], [aria-keyshortcuts]') !== null;
}

/**
 * 詳細画面の ITEM パネルの操作列(シェーダー・3Dモーション図鑑と同じ並び): 前の章 · n / N · 次の章 …… お気に入り · 一覧へ。
 * 前後はカテゴリ順(カタログの並び)で全章をたどり、端では反対の端へ回る。← / → キーでも移れる。
 */
export function ChapterNav({ id, name, previous, next, position }: ChapterNavProps) {
  const router = useRouter();
  const favorites = useFavorites();
  const isFavorite = favorites.has(id);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (ownsArrowKeys(event.target)) return;
      event.preventDefault();
      router.push(`/foundations/${event.key === "ArrowLeft" ? previous.id : next.id}`);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router, previous.id, next.id]);

  return (
    <nav className={styles.nav} aria-label="章の移動">
      <Link href={`/foundations/${previous.id}`} className={styles.navButton} aria-label={`前の章: ${previous.name}(←)`} title={`前の章: ${previous.name}`}>
        <Icon name="step-back" size={16} />
      </Link>
      <span className={styles.navPos} data-tabular aria-label={`カテゴリ順で ${position.total} 章中 ${position.index} 番目`}>
        {position.index} / {position.total}
      </span>
      <Link href={`/foundations/${next.id}`} className={styles.navButton} aria-label={`次の章: ${next.name}(→)`} title={`次の章: ${next.name}`}>
        <Icon name="step-forward" size={16} />
      </Link>
      <span className={styles.navGrow} />
      <button
        type="button"
        className={`${styles.navButton} ${isFavorite ? styles.navButtonOn : ""}`}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `お気に入りから外す: ${name}` : `お気に入りに入れる: ${name}`}
        title={isFavorite ? "お気に入りから外す" : "お気に入りに入れる"}
        onClick={() => toggleFavorite(id)}
      >
        <Icon name="star" size={16} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      <Link href="/" className={`${styles.navButton} ${styles.navBack}`} aria-label="一覧へ戻る" title="一覧へ戻る">
        <Icon name="close" size={16} />
        <span className={styles.navBackText}>一覧へ</span>
      </Link>
    </nav>
  );
}
