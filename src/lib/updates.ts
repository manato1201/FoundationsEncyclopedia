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
    id: "2026-08-19-it-knowledge-full-visualization",
    date: "2026-08-19",
    title: "IT知識カテゴリを可視化対応100%に(77件全件)",
    description:
      "IT知識カテゴリの残り57件全てにoperationStepsを後付けし、既存の5件(bespokeアニメーション: forループ/Gitブランチ/OSIカプセル化/コンテナレイヤー/再帰スタック)と合わせて77件全件を可視化対応にした。ネットワーク・OS・データベース・セキュリティ・クラウド・コンテナ・Web基礎・ソフトウェア工学・バージョン管理・Linux操作・データ構造の全サブカテゴリを網羅し、比較・概念型のエントリ(RDB vs NoSQL、SOLID原則、ハッシュ化と暗号化の違い等)もチェックリスト形式のステップとして可視化した。",
  },
  {
    id: "2026-08-19-visualization-expansion",
    date: "2026-08-19",
    title: "視覚化対応を大幅拡大(可視化済み34件→69件)",
    description:
      "新しい専用CSSステップアニメーションを3種類実装: 再帰のコールスタック(RecursionStackAnimation、factorial呼び出しの積み上がり→巻き戻り)、Rustの所有権ムーブ(OwnershipMoveAnimation、s1からs2への所有権移動とs1の無効化)、配列のインデックスアクセス(ArrayIndexAccessAnimation、C#/C++/Java/TypeScript/Rust/Pythonの配列系エントリ6件で共用)。あわせて、TDDのRed-Green-Refactorサイクル、XSS/CSRFの攻撃フロー、DBトランザクション、SemVer、WebSocket/CORSのハンドシェイク、Next.js Middleware/エラーハンドリング、Blender/Unrealのノード接続手順など26件の既存エントリにoperationStepsを後付けし、可視化対応エントリを34件から69件に拡大した。",
  },
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
