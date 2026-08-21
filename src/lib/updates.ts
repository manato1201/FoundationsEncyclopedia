export type UpdateItem = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  entryIds?: string[];
};

/**
 * このサイト自身の更新履歴(The-Algorithm-Illustratedの/updatesは外部Qiitaフィードを
 * Edge Function経由で中継表示するが、FoundationsEncyclopediaは単一運営者による
 * 自己完結型の図鑑のため、外部フィードではなく「図鑑自体に何を追加・変更したか」を
 * 静的データとして手動記録する形にしている)。
 * 新しいものを配列の先頭に追加していく。
 */
export const UPDATES: UpdateItem[] = [
  {
    id: "2026-08-19-language-fundamentals-expansion",
    date: "2026-08-19",
    title: "言語基礎文法を45件拡充(244件→289件)、ポインタ可視化を新規実装",
    description:
      "C#・C++・Python・TypeScript・Java・Go・Rustの7言語について、変数と型・for/whileループ・自作関数・配列・二次元配列・文字列(char配列)の基礎を追加し、言語ごとの違い(Goにwhileがない、Rustの変数はデフォルト不変、Pythonにchar型がない等)を明示的に比較した。C++/C#(unsafe)/Go/Rustにはポインタの基礎も追加し、「変数→アドレス取得→逆参照→書き換えの反映」を4言語共通で示す専用CSSアニメーション(PointerDereferenceAnimation)を新規実装した。",
  },
  {
    id: "2026-08-19-dcc-tool-framework-expansion",
    date: "2026-08-19",
    title: "DCC・ツール別・Frameworkを75件拡充(169件→244件)、CSSアニメーションも拡大",
    description:
      "DCC(Maya/Blender/Houdini)・ツール別(Unity/UnrealEngine)・Frameworkをそれぞれ30件まで拡充(計75件追加)。あわせて、既存の手続き的なエントリ8件にoperationStepsを後付けしてCSSステップアニメーション対応を広げ、ゲームループ・ステートマシン・コンテナイメージレイヤーの3件には専用のCSSステップアニメーションを新規実装した。収録数は169件から244件に拡充。",
  },
  {
    id: "2026-08-19-programming-it-mass-expansion",
    date: "2026-08-19",
    title: "プログラミング言語・IT知識を140件拡充(29件→169件)",
    description:
      "プログラミング言語にJava/Go/Rust/Kotlin/Swift/JavaScript/SQL/Ruby/PHP/Luaの10サブカテゴリを、IT知識にセキュリティ/クラウド/データベース/コンテナ・仮想化/Webの基礎/ソフトウェア工学・開発プロセス/Linux・シェル操作の7サブカテゴリを新設。両カテゴリにそれぞれ70件、計140件のエントリを追加し、収録数を29件から169件に拡充した。",
  },
  {
    id: "2026-08-19-basics-updates-about",
    date: "2026-08-19",
    title: "はじめての方へ/更新情報/Aboutページを追加、エントリを10件拡充",
    description:
      "「基礎学習図鑑とは?」「更新情報」「About」の3ページを追加し、ナビゲーションに組み込んだ。あわせてプログラミング言語・IT知識・DCC・ツール別・Frameworkの各カテゴリに10件のエントリを追加し、収録数を29件に拡充。",
    entryIds: [
      "csharp-async-await",
      "typescript-utility-types",
      "tcp-vs-udp",
      "process-vs-thread",
      "maya-uv-unwrapping",
      "houdini-node-network-basics",
      "unity-scriptable-object-basics",
      "unreal-actor-component-basics",
      "server-vs-client-components",
      "unit-test-aaa-pattern",
    ],
  },
  {
    id: "2026-08-19-initial-release",
    date: "2026-08-19",
    title: "初期リリース: 19件のエントリでカタログを公開",
    description:
      "プログラミング言語・IT知識・DCC・ツール別・Frameworkの5カテゴリで19件のエントリを収録。カタログ/詳細ビュー、CSSステップアニメーション(forループ/Gitブランチ/Blenderモディファイア/OSIカプセル化)、習得度バッジ、operationSteps駆動のDCC/ツール別エントリを実装。",
  },
];
