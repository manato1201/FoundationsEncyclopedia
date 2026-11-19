"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./CategorySidebar.module.css";
import { Icon } from "@/components/icons/Icon";
import { useMediaQuery } from "@/lib/use-media-query";

export type SidebarCategory = {
  name: string;
  count: number;
  subcategories: { name: string; count: number }[];
};

type CategorySidebarProps = {
  categories: SidebarCategory[];
  /** 「すべて」の件数(カテゴリ以外の条件=検索・習得度・アニメ対応を適用した件数) */
  totalCount: number;
  activeCategory: string | null;
  activeSubcategory: string | null;
  onSelect: (category: string | null, subcategory: string | null) => void;
  /** 折りたたみ「絞り込み」の中身(習得度・アニメ対応のみ)と、いま効いている数 */
  filters: ReactNode;
  activeFilterCount: number;
  /** 条件が 1 つでもあるときだけ「条件をクリア」を出す */
  canReset: boolean;
  onReset: () => void;
  /** モバイルのシートに出す「N件を見る」と、シートを開くボタンの現在地表示 */
  resultCount: number;
  currentLabel: string;
};

const SHEET_QUERY = "(max-width: 767px)";

const FOCUSABLE = 'button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])';

/**
 * カテゴリのサイドバー(The-Algorithm-Illustrated の CategorySidebar と同じ型を写し、語彙を 5 カテゴリに替えたもの。共有パッケージは作らない)。
 * 広い画面(768px 以上)は sticky の左列。選んだカテゴリだけサブカテゴリを展開し、件数を出す。
 * 習得度・アニメ対応のみは、折りたたみの「絞り込み」にまとめる。
 * 狭い画面は、同じ要素が「カテゴリ・絞り込み」ボタンで開く下からのシートになる(閉じる・Esc・背景タップ。開いている間は背後をスクロールさせない)。
 * 見た目の切り替えは CSS(メディアクエリ)が行い、JS は挙動(Esc・フォーカス・スクロール固定)だけを切り替える。
 */
export function CategorySidebar({
  categories,
  totalCount,
  activeCategory,
  activeSubcategory,
  onSelect,
  filters,
  activeFilterCount,
  canReset,
  onReset,
  resultCount,
  currentLabel,
}: CategorySidebarProps) {
  const isSheet = useMediaQuery(SHEET_QUERY);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filtersId = useId();
  const open = isSheet && sheetOpen;

  const closeSheet = () => {
    setSheetOpen(false);
    triggerRef.current?.focus();
  };

  // シートが開いている間: Esc で閉じる・Tab をシートの中に閉じ込める・背後のスクロールを止める
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSheetOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const selectAll = () => {
    onSelect(null, null);
    if (isSheet) closeSheet();
  };

  const selectCategory = (name: string) => {
    if (activeCategory !== name) onSelect(name, null);
    else if (activeSubcategory) onSelect(name, null);
    else onSelect(null, null);
  };

  const selectSubcategory = (category: string, name: string) => {
    onSelect(category, activeSubcategory === name ? null : name);
    if (isSheet) closeSheet();
  };

  return (
    <div className={styles.root}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setSheetOpen(true)}
      >
        <Icon name="menu" size={16} />
        <span className={styles.triggerLabel}>カテゴリ・絞り込み</span>
        <span className={styles.triggerCurrent}>{currentLabel}</span>
        {activeFilterCount > 0 ? <span className={styles.filterBadge}>{activeFilterCount}</span> : null}
      </button>

      <div className={styles.backdrop} data-open={open} onClick={closeSheet} aria-hidden="true" />

      <aside
        ref={panelRef}
        className={styles.panel}
        data-open={open}
        aria-label="カテゴリと絞り込み"
        role={isSheet ? "dialog" : undefined}
        aria-modal={isSheet ? true : undefined}
      >
        <div className={styles.panelHead}>
          <h2 className={styles.heading}>CATEGORY</h2>
          {canReset ? (
            <button type="button" className={styles.reset} onClick={onReset}>
              条件をクリア
            </button>
          ) : null}
          <button ref={closeRef} type="button" className={styles.close} onClick={closeSheet} aria-label="閉じる">
            <Icon name="close" size={16} />
          </button>
        </div>

        <ul className={styles.list}>
          <li>
            <button
              type="button"
              className={styles.row}
              aria-pressed={activeCategory === null}
              onClick={selectAll}
            >
              <span className={styles.rowName}>すべて</span>
              <span className={styles.count} data-tabular>
                {totalCount}
              </span>
            </button>
          </li>
          {categories.map((category) => {
            const active = activeCategory === category.name;
            const subs = category.subcategories.filter((sub) => sub.count > 0 || sub.name === activeSubcategory);
            return (
              <li key={category.name}>
                <button
                  type="button"
                  className={styles.row}
                  aria-pressed={active}
                  aria-expanded={active}
                  data-empty={category.count === 0}
                  onClick={() => selectCategory(category.name)}
                >
                  <span className={styles.rowName}>{category.name}</span>
                  <span className={styles.count} data-tabular>
                    {category.count}
                  </span>
                </button>
                {active && subs.length > 0 ? (
                  <ul className={styles.subList}>
                    {subs.map((sub) => (
                      <li key={sub.name}>
                        <button
                          type="button"
                          className={`${styles.row} ${styles.subRow}`}
                          aria-pressed={activeSubcategory === sub.name}
                          data-empty={sub.count === 0}
                          onClick={() => selectSubcategory(category.name, sub.name)}
                        >
                          <span className={styles.rowName}>{sub.name}</span>
                          <span className={styles.count} data-tabular>
                            {sub.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className={styles.filters}>
          <button
            type="button"
            className={styles.filtersToggle}
            aria-expanded={filtersOpen}
            aria-controls={filtersId}
            onClick={() => setFiltersOpen((current) => !current)}
          >
            <span>絞り込み</span>
            {activeFilterCount > 0 ? <span className={styles.filterBadge}>{activeFilterCount}</span> : null}
            <Icon name={filtersOpen ? "chevron-up" : "chevron-down"} size={14} />
          </button>
          <div id={filtersId} className={styles.filtersBody} hidden={!filtersOpen}>
            {filters}
          </div>
        </div>

        <div className={styles.sheetFooter}>
          <button type="button" className={styles.apply} onClick={closeSheet}>
            {resultCount}件を見る
          </button>
        </div>
      </aside>
    </div>
  );
}
