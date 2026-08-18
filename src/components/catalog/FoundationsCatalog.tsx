"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./FoundationsCatalog.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { FOUNDATIONS_CATEGORY_ORDER, FOUNDATIONS_SUBCATEGORIES_BY_CATEGORY } from "@/lib/foundations-categories";
import { matchesSearchQuery } from "@/lib/foundations-search";
import { MASTERY_BADGE_META, MASTERY_BADGE_ORDER, type MasteryBadge } from "@/lib/mastery-badge";
import type { FoundationsMeta } from "@/lib/content/foundations";

type SortOrder = "category" | "name";

type FoundationsCatalogProps = {
  entries: FoundationsMeta[];
  featuredId: string;
};

/**
 * カタログ画面(The-Algorithm-IllustratedのAlgorithmCatalog.tsx/ColorEncyclopediaのColorCatalog.tsxの直接移植)。
 * カテゴリチップ・サブカテゴリチップ・自由テキスト検索・バッジフィルタチップを組み合わせた絞り込みの有無で、
 * 「代表エントリ+カテゴリ別一覧」と「絞り込み結果の一覧」を切り替える。
 * ロジックは移植元と互換のまま、語彙を5カテゴリ・masteryBadgeに差し替えている(FoundationsEncyclopedia_DESIGN.md Phase 2)。
 */
export function FoundationsCatalog({ entries, featuredId }: FoundationsCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [animatedOnly, setAnimatedOnly] = useState(false);
  const [activeBadge, setActiveBadge] = useState<MasteryBadge | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("category");
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;
  const isFiltering = isSearching || activeCategory !== null || animatedOnly || activeBadge !== null;

  const animatedCount = useMemo(
    () => entries.reduce((count, e) => count + (e.hasVisualizer ? 1 : 0), 0),
    [entries],
  );

  const featured = entries.find((e) => e.id === featuredId) ?? entries[0];

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }
    return counts;
  }, [entries]);

  const subcategoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (!activeCategory) return counts;
    for (const entry of entries) {
      if (entry.category !== activeCategory) continue;
      counts.set(entry.subcategory, (counts.get(entry.subcategory) ?? 0) + 1);
    }
    return counts;
  }, [entries, activeCategory]);

  const badgeCounts = useMemo(() => {
    const counts = new Map<MasteryBadge, number>();
    for (const entry of entries) {
      if (!entry.masteryBadge) continue;
      counts.set(entry.masteryBadge, (counts.get(entry.masteryBadge) ?? 0) + 1);
    }
    return counts;
  }, [entries]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory((current) => (current === category ? null : category));
    setActiveSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setActiveSubcategory((current) => (current === subcategory ? null : subcategory));
  };

  const handleBadgeClick = (badge: MasteryBadge) => {
    setActiveBadge((current) => (current === badge ? null : badge));
  };

  const filteredResults = useMemo(() => {
    if (!isFiltering) return [];
    const results = entries.filter((entry) => {
      if (activeCategory && entry.category !== activeCategory) return false;
      if (activeSubcategory && entry.subcategory !== activeSubcategory) return false;
      if (animatedOnly && !entry.hasVisualizer) return false;
      if (activeBadge && entry.masteryBadge !== activeBadge) return false;
      if (isSearching && !matchesSearchQuery(entry, query)) return false;
      return true;
    });
    if (sortOrder === "name") {
      return [...results].sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    return results;
  }, [
    entries,
    activeCategory,
    activeSubcategory,
    animatedOnly,
    activeBadge,
    query,
    isSearching,
    isFiltering,
    sortOrder,
  ]);

  const filterLabelParts: string[] = [];
  if (activeCategory) {
    filterLabelParts.push(activeSubcategory ? `${activeCategory} ・ ${activeSubcategory}` : activeCategory);
  }
  if (animatedOnly) filterLabelParts.push("アニメーション対応のみ");
  if (activeBadge) filterLabelParts.push(`${MASTERY_BADGE_META[activeBadge].emoji} ${MASTERY_BADGE_META[activeBadge].label}のみ`);
  if (isSearching) filterLabelParts.push(`「${query}」`);
  const filterLabel = filterLabelParts.join(" ／ ");

  const groupedByCategory = useMemo(() => {
    const rest = entries.filter((entry) => entry.id !== featured.id);
    const groups = new Map<string, FoundationsMeta[]>();
    for (const entry of rest) {
      const list = groups.get(entry.category) ?? [];
      list.push(entry);
      groups.set(entry.category, list);
    }
    return FOUNDATIONS_CATEGORY_ORDER.filter((category) => groups.has(category)).map((category) => ({
      category,
      items: groups.get(category)!,
    }));
  }, [entries, featured.id]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>■ CATALOG 基礎学習図鑑</p>
        <h1 className={styles.heroTitle}>
          基礎を、
          <br />
          一覧して深掘りする。
        </h1>
        <p className={styles.heroLead}>
          プログラミング言語・IT知識・DCC・ツール別・Framework——あらゆる専門分野の土台になる基礎知識を、
          カタログ・詳細・可視化の3層で体系化した図鑑です。
        </p>
        <p className={styles.countLine}>
          <span className={styles.countNumber}>{entries.length}</span>
          <span className={styles.countLabel}>件の基礎知識を収録</span>
        </p>
        <form className={styles.searchBar} role="search" onSubmit={(event) => event.preventDefault()}>
          <span className={styles.searchLabel}>SEARCH</span>
          <input
            className={styles.searchInput}
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="名前・カテゴリで検索(例: C#、Git、Blender)"
            aria-label="基礎知識を検索"
          />
        </form>

        <div className={styles.chipRow} role="group" aria-label="カテゴリで絞り込む">
          <button
            type="button"
            className={`${styles.chip} ${activeCategory === null ? styles.chipActive : ""}`}
            aria-pressed={activeCategory === null}
            onClick={() => {
              setActiveCategory(null);
              setActiveSubcategory(null);
            }}
          >
            すべて
          </button>
          {FOUNDATIONS_CATEGORY_ORDER.filter((category) => categoryCounts.has(category)).map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.chip} ${activeCategory === category ? styles.chipActive : ""}`}
              aria-pressed={activeCategory === category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
              <span className={styles.chipCount}>{categoryCounts.get(category)}</span>
            </button>
          ))}
        </div>

        {activeCategory ? (
          <div className={styles.chipRow} role="group" aria-label="サブカテゴリで絞り込む">
            {(FOUNDATIONS_SUBCATEGORIES_BY_CATEGORY[activeCategory] ?? [])
              .filter((subcategory) => subcategoryCounts.has(subcategory))
              .map((subcategory) => (
                <button
                  key={subcategory}
                  type="button"
                  className={`${styles.chip} ${styles.chipSub} ${activeSubcategory === subcategory ? styles.chipActive : ""}`}
                  aria-pressed={activeSubcategory === subcategory}
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  {subcategory}
                  <span className={styles.chipCount}>{subcategoryCounts.get(subcategory)}</span>
                </button>
              ))}
          </div>
        ) : null}

        <div className={styles.chipRow} role="group" aria-label="習得度で絞り込む">
          {MASTERY_BADGE_ORDER.filter((badge) => badgeCounts.has(badge)).map((badge) => (
            <button
              key={badge}
              type="button"
              className={`${styles.chip} ${styles.chipBadge} ${activeBadge === badge ? styles.chipActive : ""}`}
              aria-pressed={activeBadge === badge}
              onClick={() => handleBadgeClick(badge)}
            >
              {MASTERY_BADGE_META[badge].emoji} {MASTERY_BADGE_META[badge].label}のみ
              <span className={styles.chipCount}>{badgeCounts.get(badge)}</span>
            </button>
          ))}
        </div>

        <div className={styles.chipRow} role="group" aria-label="アニメーション対応で絞り込む">
          <button
            type="button"
            className={`${styles.chip} ${styles.chipAnimated} ${animatedOnly ? styles.chipActive : ""}`}
            aria-pressed={animatedOnly}
            onClick={() => setAnimatedOnly((current) => !current)}
          >
            <span className={styles.chipAnimatedDot} aria-hidden="true" />
            アニメーション対応のみ
            <span className={styles.chipCount}>{animatedCount}</span>
          </button>
        </div>
      </section>

      {isFiltering ? (
        <section className={styles.results} aria-labelledby="results-heading">
          <div className={styles.resultsHeader}>
            <h2 id="results-heading" className={styles.sectionLabel}>
              ■ RESULTS {filterLabel}の絞り込み結果 — {filteredResults.length}件
            </h2>
            {filteredResults.length > 1 ? (
              <label className={styles.sortControl}>
                並び替え
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                  <option value="category">カテゴリ順</option>
                  <option value="name">名前順</option>
                </select>
              </label>
            ) : null}
          </div>
          {filteredResults.length === 0 ? (
            <div className={styles.emptyState}>
              該当する基礎知識が見つかりませんでした。別のキーワードやカテゴリでお試しください。
            </div>
          ) : (
            <ul className={styles.listItems}>
              {filteredResults.map((entry) => (
                <FoundationsRow key={entry.id} entry={entry} showCategory />
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section className={styles.showcase} aria-labelledby="featured-heading">
            <h2 id="featured-heading" className={styles.sectionLabel}>
              ■ FEATURED 代表エントリ
            </h2>
            <Link href={`/foundations/${featured.id}`} className={styles.featuredCard}>
              <div className={styles.featuredMeta}>
                <span className={styles.category}>
                  {featured.category} ・ {featured.subcategory}
                </span>
                {featured.masteryBadge ? <MasteryBadgeChip badge={featured.masteryBadge} /> : null}
                {featured.hasVisualizer ? <AnimatedBadge /> : null}
              </div>
              <h3 className={styles.featuredName}>{featured.name}</h3>
              <p className={styles.featuredDesc}>{featured.summary}</p>
            </Link>
          </section>

          <section className={styles.list} aria-labelledby="list-heading">
            <h2 id="list-heading" className={styles.sectionLabel}>
              ■ INDEX 一覧
            </h2>
            {groupedByCategory.map(({ category, items }) => (
              <div key={category} className={styles.categoryGroup}>
                <h3 className={styles.categoryHeading}>
                  {category}
                  <span className={styles.categoryCount}>{items.length}</span>
                </h3>
                <ul className={styles.listItems}>
                  {items.map((entry) => (
                    <FoundationsRow key={entry.id} entry={entry} />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function FoundationsRow({ entry, showCategory = false }: { entry: FoundationsMeta; showCategory?: boolean }) {
  return (
    <li className={styles.listRow}>
      <Link href={`/foundations/${entry.id}`} className={styles.listRowHead}>
        <span className={styles.listName}>{entry.name}</span>
        {showCategory ? (
          <span className={styles.listCategory}>
            {entry.category} ・ {entry.subcategory}
          </span>
        ) : null}
        {entry.masteryBadge ? <MasteryBadgeChip badge={entry.masteryBadge} /> : null}
        {entry.hasVisualizer ? <AnimatedBadge /> : null}
      </Link>
      <p className={styles.listSummary}>{entry.summary}</p>
    </li>
  );
}

/** CSSステップアニメーション対応済みであることを示す小さなバッジ。 */
function AnimatedBadge() {
  return (
    <span className={styles.animatedBadge} title="このエントリはCSSステップアニメーション対応済みです">
      <span className={styles.animatedDot} aria-hidden="true" />
      アニメーション対応
    </span>
  );
}
