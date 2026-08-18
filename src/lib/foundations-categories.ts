/**
 * カタログ画面のカテゴリ・サブカテゴリ階層(FoundationsEncyclopedia_DESIGN.md Phase 0)。
 * コンテンツ(content/foundations/*.md)のfrontmatter category/subcategoryはこの表のいずれかの値と一致させること。
 * 新カテゴリ・新サブカテゴリの追加はこの配列への追記だけで完結する(他の場所に重複させない)。
 */
export const FOUNDATIONS_TAXONOMY = [
  { category: "プログラミング言語", subcategories: ["C#", "C++", "Python", "TypeScript", "シェーダー言語"] },
  { category: "IT知識", subcategories: ["ネットワーク", "OS・アーキテクチャ", "バージョン管理", "データ構造・計算量"] },
  { category: "DCC", subcategories: ["Maya", "Blender", "Houdini"] },
  { category: "ツール別", subcategories: ["Unity", "UnrealEngine"] },
  { category: "Framework", subcategories: ["Web(Next.js等)", "ゲームエンジン基盤", "テスト・CI"] },
] as const;

export const FOUNDATIONS_CATEGORY_ORDER = FOUNDATIONS_TAXONOMY.map((c) => c.category);

export const FOUNDATIONS_SUBCATEGORIES_BY_CATEGORY: Record<string, readonly string[]> = Object.fromEntries(
  FOUNDATIONS_TAXONOMY.map((c) => [c.category, c.subcategories]),
);
