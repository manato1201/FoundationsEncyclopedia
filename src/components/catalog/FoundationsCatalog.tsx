"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import styles from "./FoundationsCatalog.module.css";
import { MasteryBadgeChip } from "@/components/badge/MasteryBadgeChip";
import { AnimatedBadge } from "@/components/badge/AnimatedBadge";
import { FOUNDATIONS_CATEGORY_ORDER, FOUNDATIONS_SUBCATEGORIES_BY_CATEGORY } from "@/lib/foundations-categories";
import { Icon } from "@/components/icons/Icon";
import { StepPreview } from "@/components/visual/StepPreview";
import { HeroTrack } from "@/components/visual/HeroTrack";
import { AsciiCrystal } from "@/components/visual/AsciiCrystal";
import { CategorySidebar, type SidebarCategory } from "./CategorySidebar";
import { EntryCard, type EntryView } from "./EntryCard";
import { isAnimated } from "@/lib/is-animated";
import { matchesSearchQuery } from "@/lib/foundations-search";
import { PURPOSE_GROUPS, STARTER_IDS, type EntryMode } from "@/lib/catalog-entry-points";
import { MASTERY_BADGE_META, MASTERY_BADGE_ORDER, type MasteryBadge } from "@/lib/mastery-badge";
import type { FoundationsMeta } from "@/lib/content/foundations";

type SortOrder = "category" | "name";

/** 「用途から」で最初に見せる章数(残りは「すべて見る」で展開) */
const PURPOSE_PREVIEW_COUNT = 6;

type FoundationsCatalogProps = {
  entries: FoundationsMeta[];
  featuredId: string;
};

/**
 * カタログ画面。左のサイドバー(CategorySidebar: 5 カテゴリ → サブカテゴリ・件数つき、習得度とアニメ対応のみは折りたたみの「絞り込み」)と、
 * 右の一覧(プレビューつきカードのグリッド/リスト切り替え)でできている。
 * 絞り込みの有無で、「入口の段分け(まずはここから/用途から/すべて)」と「絞り込み結果の一覧」を切り替える。
 * ロジックは移植元(The-Algorithm-Illustrated の AlgorithmCatalog)と互換のまま、語彙を5カテゴリ・masteryBadgeに差し替えている。
 */
export function FoundationsCatalog({ entries, featuredId }: FoundationsCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [animatedOnly, setAnimatedOnly] = useState(false);
  const [activeBadge, setActiveBadge] = useState<MasteryBadge | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("category");
  const [mode, setMode] = useState<EntryMode>("start");
  const [livePreview, setLivePreview] = useState(false);
  const [view, setView] = useState<EntryView>("grid");
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

  const badgeCounts = useMemo(() => {
    const counts = new Map<MasteryBadge, number>();
    for (const entry of entries) {
      if (!entry.masteryBadge) continue;
      counts.set(entry.masteryBadge, (counts.get(entry.masteryBadge) ?? 0) + 1);
    }
    return counts;
  }, [entries]);

  // サイドバーの件数は「カテゴリ以外の条件(検索・習得度・アニメ対応)を適用した件数」。0 件のカテゴリも残し、選ぶと空状態が出る
  const baseMatches = useMemo(
    () =>
      entries.filter((entry) => {
        if (animatedOnly && !isAnimated(entry)) return false;
        if (activeBadge && entry.masteryBadge !== activeBadge) return false;
        if (isSearching && !matchesSearchQuery(entry, query)) return false;
        return true;
      }),
    [entries, animatedOnly, activeBadge, query, isSearching],
  );

  const sidebarCategories = useMemo<SidebarCategory[]>(() => {
    const byCategory = new Map<string, Map<string, number>>();
    for (const entry of baseMatches) {
      const subs = byCategory.get(entry.category) ?? new Map<string, number>();
      subs.set(entry.subcategory, (subs.get(entry.subcategory) ?? 0) + 1);
      byCategory.set(entry.category, subs);
    }
    return FOUNDATIONS_CATEGORY_ORDER.map((category) => {
      const subs = byCategory.get(category) ?? new Map<string, number>();
      return {
        name: category,
        count: Array.from(subs.values()).reduce((sum, n) => sum + n, 0),
        subcategories: (FOUNDATIONS_SUBCATEGORIES_BY_CATEGORY[category] ?? []).map((name) => ({
          name,
          count: subs.get(name) ?? 0,
        })),
      };
    });
  }, [baseMatches]);

  const handleSidebarSelect = (category: string | null, subcategory: string | null) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };

  const handleBadgeClick = (badge: MasteryBadge) => {
    setActiveBadge((current) => (current === badge ? null : badge));
  };

  const resetAll = () => {
    setQuery("");
    setActiveCategory(null);
    setActiveSubcategory(null);
    setAnimatedOnly(false);
    setActiveBadge(null);
  };

  const filteredResults = useMemo(() => {
    if (!isFiltering) return [];
    const results = baseMatches.filter((entry) => {
      if (activeCategory && entry.category !== activeCategory) return false;
      if (activeSubcategory && entry.subcategory !== activeSubcategory) return false;
      return true;
    });
    if (sortOrder === "name") {
      return [...results].sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    return results;
  }, [baseMatches, activeCategory, activeSubcategory, isFiltering, sortOrder]);

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

  const activeFilterCount = (animatedOnly ? 1 : 0) + (activeBadge ? 1 : 0);
  const currentLabel = activeCategory
    ? activeSubcategory
      ? `${activeCategory} ・ ${activeSubcategory}`
      : activeCategory
    : "すべて";

  const liveSwitch = (
    <button
      type="button"
      role="switch"
      aria-checked={livePreview}
      className={styles.liveSwitch}
      onClick={() => setLivePreview((current) => !current)}
      title="カードの段階プレビューを、ホバーしなくても動かします"
    >
      <span className={styles.liveTrack} aria-hidden="true">
        <span className={styles.liveThumb} />
      </span>
      プレビューを動かす
    </button>
  );

  const viewToggle = (
    <div className={styles.viewToggle} role="group" aria-label="表示の切り替え">
      {(
        [
          { key: "grid", label: "グリッド" },
          { key: "list", label: "リスト" },
        ] as { key: EntryView; label: string }[]
      ).map((item) => (
        <button
          key={item.key}
          type="button"
          className={`${styles.viewButton} ${view === item.key ? styles.viewButtonActive : ""}`}
          aria-pressed={view === item.key}
          onClick={() => setView(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  // サイドバーの折りたたみ「絞り込み」の中身
  const filtersNode = (
    <div className={styles.filterGroups}>
      <div role="group" aria-labelledby="filter-badge-label">
        <p id="filter-badge-label" className={styles.filterLabel}>
          習得度
        </p>
        <div className={styles.chipRow}>
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
      </div>
      <div role="group" aria-labelledby="filter-animated-label">
        <p id="filter-animated-label" className={styles.filterLabel}>
          アニメーション
        </p>
        <div className={styles.chipRow}>
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
      </div>
    </div>
  );

  return (
    <div className={styles.page} data-preview={livePreview ? "live" : undefined}>
      <AsciiCrystal className={styles.heroCrystal} />
      <section className={`${styles.hero} bp-sheet`} data-title="CATALOG · 図面一覧">
        <p className={styles.eyebrow}>CATALOG</p>
        <h1 className={styles.heroTitle}>
          基礎を、<span className={styles.heroAccent}>順番に</span>。
        </h1>
        <p className={styles.heroSubtitle}>プログラミング言語・IT知識・DCC・ツール別・Frameworkの土台を、一覧して深掘りする図鑑</p>
        <HeroTrack />
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
      </section>

      <div className={styles.layout}>
        <CategorySidebar
          categories={sidebarCategories}
          totalCount={baseMatches.length}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onSelect={handleSidebarSelect}
          filters={filtersNode}
          activeFilterCount={activeFilterCount}
          canReset={isFiltering}
          onReset={resetAll}
          resultCount={isFiltering ? filteredResults.length : entries.length}
          currentLabel={currentLabel}
        />

        <div className={styles.content}>
          {isFiltering ? (
            <section id="catalog-list" className={styles.results} aria-labelledby="results-heading">
              <div className={styles.resultsHeader}>
                <h2 id="results-heading" className={styles.sectionLabel}>
                  ■ RESULTS {filterLabel}の絞り込み結果 — {filteredResults.length}件
                </h2>
                <div className={styles.controls}>
                  {viewToggle}
                  {view === "grid" ? liveSwitch : null}
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
              </div>
              {filteredResults.length === 0 ? (
                <div className={styles.emptyState}>
                  <AsciiCrystal cols={29} rows={15} />
                  <p>該当する基礎知識が見つかりませんでした。別のキーワードやカテゴリでお試しください。</p>
                  <button type="button" className={styles.moreButton} onClick={resetAll}>
                    条件をクリア
                  </button>
                </div>
              ) : (
                <EntryGrid entries={filteredResults} view={view} showCategory />
              )}
            </section>
          ) : (
            <>
              <div className={styles.entryTabs}>
                <div className={styles.entryTabList} role="tablist" aria-label="入口の切り替え">
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
                <div className={styles.controls}>
                  {mode !== "start" ? viewToggle : null}
                  {mode === "start" || view === "grid" ? liveSwitch : null}
                </div>
              </div>

              {mode === "start" ? (
                <section id="catalog-list" className={styles.list} aria-labelledby="start-heading">
                  <h2 id="start-heading" className={styles.sectionLabel}>
                    ■ START この順に読むと、基礎が積み上がります
                  </h2>
                  <ol className={styles.startList}>
                    {starterEntries.map((entry, index) => (
                      <li key={entry.id} className={styles.startItem} data-step-preview-host>
                        <span className={`${styles.startNumber} bp-balloon`} data-tabular>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className={styles.startBody}>
                          <Link href={`/foundations/${entry.id}`} className={styles.startName}>
                            {entry.name}
                            {isAnimated(entry) ? <AnimatedBadge /> : null}
                          </Link>
                          <p className={styles.listSummary}>{entry.summary}</p>
                          <StepPreview steps={entry.operationSteps} bespoke={entry.hasVisualizer} />
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
                        <EntryGrid entries={visible} view={view} />
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
                      <EntryGrid entries={sortedAll} view={view} showCategory />
                    ) : (
                      groupedByCategory.map(({ category, items }) => (
                        <div key={category} className={styles.categoryGroup}>
                          <h3 className={styles.categoryHeading}>
                            {category}
                            <span className={styles.categoryCount}>{items.length}</span>
                          </h3>
                          <EntryGrid entries={items} view={view} />
                        </div>
                      ))
                    )}
                  </section>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** 一覧の出現演出をかける先頭の枚数(件数が多い一覧で全部を動かさない) */
const ROW_ENTER_COUNT = 8;

/** グリッドは幅に応じて列数が変わる(auto-fill)。リストは 1 列。プレビューは各カードが画面に入ったときだけ描く */
function EntryGrid({
  entries,
  view,
  showCategory = false,
}: {
  entries: FoundationsMeta[];
  view: EntryView;
  showCategory?: boolean;
}) {
  return (
    <ul className={view === "grid" ? styles.listItems : styles.listRows}>
      {entries.map((entry, index) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          view={view}
          showCategory={showCategory}
          style={{ "--row-i": Math.min(index, 4) } as CSSProperties}
          enter={index < ROW_ENTER_COUNT}
        />
      ))}
    </ul>
  );
}
