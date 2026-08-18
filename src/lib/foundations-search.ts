import type { FoundationsMeta } from "@/lib/content/foundations";

/**
 * カタログ画面が使う自由テキスト検索の判定ロジック(The-Algorithm-Illustratedのalgorithm-search.tsを踏襲)。
 * 空白区切りの複数語をAND条件で扱う。
 */
export function matchesSearchQuery(
  entry: Pick<FoundationsMeta, "name" | "category" | "subcategory" | "summary">,
  query: string,
): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = [
    entry.name,
    entry.category,
    entry.subcategory,
    entry.summary,
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}
