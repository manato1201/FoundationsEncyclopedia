"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import styles from "./FoundationsCatalog.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { FOUNDATIONS_CATEGORY_ORDER, FOUNDATIONS_SUBCATEGORIES_BY_CATEGORY } from "@/lib/foundations-categories";
import { Icon } from "@/components/icons/Icon";
import { computeGridLayout } from "@/lib/grid-layout";
import { matchesSearchQuery } from "@/lib/foundations-search";
import { PURPOSE_GROUPS, STARTER_IDS, type EntryMode } from "@/lib/catalog-entry-points";
import { MASTERY_BADGE_META, MASTERY_BADGE_ORDER, type MasteryBadge } from "@/lib/mastery-badge";
import type { FoundationsMeta } from "@/lib/content/foundations";

type SortOrder = "category" | "name";

/** ステップ表示を持つ章(専用アニメ または operationSteps) */
const isAnimated = (entry: FoundationsMeta) =>
  entry.hasVisualizer || (entry.operationSteps?.length ?? 0) > 0;

/** 「用途から」で最初に見せる章数(残りは「すべて見る」で展開) */
const PURPOSE_PREVIEW_COUNT = 6;

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
  const [mode, setMode] = useState<EntryMode>("start");
  const [expandedPurposes, setExpandedPurposes] = useState<Set<string>>(new Set());
  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;
  const isFiltering = isSearching || activeCategory !== null || animatedOnly || activeBadge !== null;

  const animatedCount = useMemo(
    () => entries.reduce((count, e) => count + (isAnimated(e) ? 1 : 0), 0),
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
      if (animatedOnly && !isAnimated(entry)) return false;
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

  const starterEntries = useMemo(() => {
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    return STARTER_IDS.map((id) => byId.get(id)).filter((entry): entry is FoundationsMeta => entry !== undefined);
  }, [entries]);

  const purposeGroups = useMemo(
    () =>
      PURPOSE_GROUPS.map((group) => ({ group, items: entries.filter(group.match) })).filter(
        ({ items }) => items.length > 0,
      ),
    [entries],
  );

  const sortedAll = useMemo(
    () => (sortOrder === "name" ? [...entries].sort((a, b) => a.name.localeCompare(b.name, "ja")) : entries),
    [entries, sortOrder],
  );

  const togglePurpose = (key: string) => {
    setExpandedPurposes((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>CATALOG</p>
        <h1 className={styles.heroTitle}>
          基礎を、<span className={styles.heroAccent}>順番に</span>。
        </h1>
        <p className={styles.heroSubtitle}>プログラミング言語・IT知識・DCC・ツール別・Frameworkの土台を、一覧して深掘りする図鑑</p>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>章</dt>
            <dd className={styles.statValue}>
              <span className="num">{entries.length}</span>
              <span className={styles.statUnit}>件</span>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>段階アニメ</dt>
            <dd className={styles.statValue}>
              <span className="num">{animatedCount}</span>
              <span className={styles.statUnit}>件</span>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>カテゴリ</dt>
            <dd className={styles.statValue}>
              <span className="num">{categoryCounts.size}</span>
              <span className={styles.statUnit}>種</span>
            </dd>
          </div>
        </dl>
        <a href="#catalog-list" className={styles.startLink}>
          始める
          <Icon name="arrow-down" size={14} />
        </a>
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
        <section id="catalog-list" className={styles.results} aria-labelledby="results-heading">
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
            <EntryGrid entries={filteredResults} showCategory />
          )}
        </section>
      ) : (
        <>
          <div className={styles.entryTabs} role="tablist" aria-label="入口の切り替え">
            {(
              [
                { key: "start", label: "まずはここから" },
                { key: "purpose", label: "用途から" },
                { key: "all", label: "すべて", count: entries.length },
              ] as { key: EntryMode; label: string; count?: number }[]
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={mode === item.key}
                className={`${styles.entryTab} ${mode === item.key ? styles.entryTabActive : ""}`}
                onClick={() => setMode(item.key)}
              >
                {item.label}
                {item.count !== undefined ? <span className={styles.chipCount}>{item.count}</span> : null}
              </button>
            ))}
          </div>

          {mode === "start" ? (
            <section id="catalog-list" className={styles.list} aria-labelledby="start-heading">
              <h2 id="start-heading" className={styles.sectionLabel}>
                ■ START この順に読むと、基礎が積み上がります
              </h2>
              <ol className={styles.startList}>
                {starterEntries.map((entry, index) => (
                  <li key={entry.id} className={styles.startItem}>
                    <span className={styles.startNumber} data-tabular>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.startBody}>
                      <Link href={`/foundations/${entry.id}`} className={styles.startName}>
                        {entry.name}
                        {isAnimated(entry) ? <AnimatedBadge /> : null}
                      </Link>
                      <p className={styles.listSummary}>{entry.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {mode === "purpose" ? (
            <section id="catalog-list" className={styles.list} aria-labelledby="purpose-heading">
              <h2 id="purpose-heading" className={styles.sectionLabel}>
                ■ PURPOSE やりたいことから探す
              </h2>
              {purposeGroups.map(({ group, items }) => {
                const expanded = expandedPurposes.has(group.key);
                const visible = expanded ? items : items.slice(0, PURPOSE_PREVIEW_COUNT);
                return (
                  <div key={group.key} className={styles.categoryGroup}>
                    <h3 className={styles.categoryHeading}>
                      {group.label}
                      <span className={styles.categoryCount}>{items.length}</span>
                    </h3>
                    <p className={styles.purposeDescription}>{group.description}</p>
                    <EntryGrid entries={visible} />
                    {items.length > PURPOSE_PREVIEW_COUNT ? (
                      <button type="button" className={styles.moreButton} onClick={() => togglePurpose(group.key)}>
                        {expanded ? "最初の数件だけ表示" : `すべて見る(${items.length}件)`}
                        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={14} />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </section>
          ) : null}

          {mode === "all" ? (
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
                    {isAnimated(featured) ? <AnimatedBadge /> : null}
                  </div>
                  <h3 className={styles.featuredName}>{featured.name}</h3>
                  <p className={styles.featuredDesc}>{featured.summary}</p>
                </Link>
              </section>

              <section id="catalog-list" className={styles.list} aria-labelledby="list-heading">
                <div className={styles.resultsHeader}>
                  <h2 id="list-heading" className={styles.sectionLabel}>
                    ■ INDEX 一覧 — {entries.length}件
                  </h2>
                  <label className={styles.sortControl}>
                    並べ替え
                    <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                      <option value="category">カテゴリ順</option>
                      <option value="name">名前順</option>
                    </select>
                  </label>
                </div>
                {sortOrder === "name" ? (
                  <EntryGrid entries={sortedAll} showCategory />
                ) : (
                  groupedByCategory.map(({ category, items }) => (
                    <div key={category} className={styles.categoryGroup}>
                      <h3 className={styles.categoryHeading}>
                        {category}
                        <span className={styles.categoryCount}>{items.length}</span>
                      </h3>
                      <EntryGrid entries={items} />
                    </div>
                  ))
                )}
              </section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

/** 件数に合わせて列数を決め、最終段に余りを作らないカードグリッド(P1) */
function EntryGrid({ entries, showCategory = false }: { entries: FoundationsMeta[]; showCategory?: boolean }) {
  const layout = computeGridLayout(entries.length);
  const gridStyle = {
    "--tracks-lg": layout.trackCount,
  } as CSSProperties;
  return (
    <ul className={styles.listItems} style={gridStyle}>
      {entries.map((entry, index) => {
        const span = index >= layout.lastRowStart ? layout.lastSpan : layout.normalSpan;
        return (
          <FoundationsRow
            key={entry.id}
            entry={entry}
            showCategory={showCategory}
            style={{ "--span-lg": span } as CSSProperties}
          />
        );
      })}
    </ul>
  );
}

function FoundationsRow({
  entry,
  showCategory = false,
  style,
}: {
  entry: FoundationsMeta;
  showCategory?: boolean;
  style?: CSSProperties;
}) {
  return (
    <li className={styles.listRow} style={style}>
      <Link href={`/foundations/${entry.id}`} className={styles.listRowHead}>
        <span className={styles.listName}>{entry.name}</span>
        {showCategory ? (
          <span className={styles.listCategory}>
            {entry.category} ・ {entry.subcategory}
          </span>
        ) : null}
        {entry.masteryBadge ? <MasteryBadgeChip badge={entry.masteryBadge} /> : null}
        {isAnimated(entry) ? <AnimatedBadge /> : null}
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
