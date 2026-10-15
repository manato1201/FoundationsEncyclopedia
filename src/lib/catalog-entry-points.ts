import type { FoundationsMeta } from "@/lib/content/foundations";

/** カタログの入口の段分け: まずはここから / 用途から / すべて */
export type EntryMode = "start" | "purpose" | "all";

/**
 * 「まずはここから」の章(この順で読むと、基礎が積み上がる並び)。
 * 存在しないidは表示時に無視されるため、章を改名・削除しても画面は壊れない。
 */
export const STARTER_IDS: string[] = [
  "for-loop-flow",
  "big-o-basics",
  "array-vs-linked-list",
  "recursion-basics",
  "git-branch-workflow",
  "http-request-response-basics",
  "rest-api-basics",
  "osi-model-encapsulation",
  "docker-basics",
  "cpu-gpu-npu",
];

export type PurposeGroup = {
  key: string;
  label: string;
  description: string;
  match: (entry: FoundationsMeta) => boolean;
};

const inSubcategories =
  (...names: string[]) =>
  (entry: FoundationsMeta) =>
    names.includes(entry.subcategory);

/** 「用途から」の分け方。既存のカテゴリ・サブカテゴリを、やりたいことで束ね直しただけ */
export const PURPOSE_GROUPS: PurposeGroup[] = [
  {
    key: "ai",
    label: "AIの仕組みを知りたい",
    description: "CPU・GPU・NPU、生成と判断、埋め込みなどの基礎",
    match: inSubcategories("AI基礎"),
  },
  {
    key: "language",
    label: "プログラミング言語の基礎を固めたい",
    description: "変数・型・ループ・関数・配列・ポインタを言語ごとに比べる",
    match: (entry) => entry.category === "プログラミング言語",
  },
  {
    key: "data",
    label: "データとアルゴリズムを理解したい",
    description: "データ構造、計算量、データベース",
    match: inSubcategories("データ構造・計算量", "データベース"),
  },
  {
    key: "web",
    label: "WebとAPIの仕組みを知りたい",
    description: "ネットワーク、HTTP、Next.js、セキュリティ",
    match: inSubcategories("ネットワーク", "Webの基礎", "Web(Next.js等)", "セキュリティ"),
  },
  {
    key: "team",
    label: "チームで開発する",
    description: "Git、開発プロセス、テストとCI",
    match: inSubcategories("バージョン管理", "ソフトウェア工学・開発プロセス", "テスト・CI"),
  },
  {
    key: "infra",
    label: "動かす環境を整えたい",
    description: "OS、Linux、コンテナ、クラウド",
    match: inSubcategories("OS・アーキテクチャ", "Linux・シェル操作", "コンテナ・仮想化", "クラウド"),
  },
  {
    key: "creative",
    label: "ゲーム・3Dを作りたい",
    description: "Maya・Blender・Houdini、Unity・Unreal、ゲームエンジン基盤",
    match: (entry) =>
      entry.category === "DCC" || entry.category === "ツール別" || entry.subcategory === "ゲームエンジン基盤",
  },
];
