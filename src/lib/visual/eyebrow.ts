/**
 * 図の枠の英字の小ラベル(`IT KNOWLEDGE / VERSION CONTROL` の形)。
 * カテゴリ/サブカテゴリは foundations-categories.ts の表と同じ値。表にない値はそのまま(大文字)で出す。
 * 章ごとに変えたいときは frontmatter の `visual.eyebrow` で上書きする。
 */
const CATEGORY_EN: Record<string, string> = {
  プログラミング言語: "PROGRAMMING",
  IT知識: "IT KNOWLEDGE",
  DCC: "DCC TOOLS",
  ツール別: "GAME ENGINES",
  Framework: "FRAMEWORKS",
};

const SUBCATEGORY_EN: Record<string, string> = {
  シェーダー言語: "SHADER LANGUAGES",
  ネットワーク: "NETWORKING",
  "OS・アーキテクチャ": "OS / ARCHITECTURE",
  バージョン管理: "VERSION CONTROL",
  "データ構造・計算量": "DATA STRUCTURES",
  セキュリティ: "SECURITY",
  クラウド: "CLOUD",
  データベース: "DATABASES",
  "コンテナ・仮想化": "CONTAINERS / VMS",
  Webの基礎: "WEB BASICS",
  "ソフトウェア工学・開発プロセス": "SOFTWARE ENGINEERING",
  "Linux・シェル操作": "LINUX / SHELL",
  AI基礎: "AI BASICS",
  UnrealEngine: "UNREAL ENGINE",
  "Web(Next.js等)": "WEB FRAMEWORKS",
  ゲームエンジン基盤: "GAME ENGINE CORE",
  "テスト・CI": "TESTING / CI",
};

export function eyebrowFor(category: string, subcategory: string): string {
  const main = CATEGORY_EN[category] ?? category.toUpperCase();
  const sub = SUBCATEGORY_EN[subcategory] ?? subcategory.toUpperCase();
  return `${main} / ${sub}`;
}
