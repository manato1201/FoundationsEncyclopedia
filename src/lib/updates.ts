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
    id: "2026-11-06-expansion-150",
    date: "2026-11-06",
    title: "IT知識・DCC・ツール別を各50章追加(345件→495件)、全章をステップ表示に対応",
    description:
      "IT知識(103→153)・DCC(45→95)・ツール別(45→95)を、それぞれ50章ずつ追加した。IT知識は、ネットワーク(ping・VPN・ファイアウォール・リバースプロキシ・ARP)、OS(ミューテックス・スタックとヒープ・起動の流れ・コンテキストスイッチ)、Git(bisect・reflog・ブランチ戦略・フック)、データ構造(二分探索・動的計画法・トライ木・Union-Find・ダイクストラ法)、セキュリティ(MFA・レート制限・ゼロトラスト・シークレット管理・CSP)、クラウド(メッセージキュー・APIゲートウェイ・カナリアリリース)、データベース(ロック・実行計画・キャッシュ・バックアップ・OLTPとOLAP)、コンテナ(Kubernetes・レジストリ・ネットワーク)、Web(CSR/SSR/SSG・Web Storage・Service Worker・GraphQL)、開発プロセス(DI・フィーチャーフラグ・APIバージョニング・ポストモーテム)、Linux(sedとawk・df/du・apt・tmux)、AI基礎(プロンプト・ファインチューニングとRAG・評価指標・意味検索)など。DCCはMaya・Blender・Houdini、ツール別はUnity(+26)・Unreal Engine(+24)を追加した。新章の150件に加え、ステップ表示がなかった既存の164章(プログラミング言語102件、DCC・ツール別・Framework計62件)へ、ステップ(operationSteps)を後付けし、全495章をステップ表示に対応させた。",
  },
  {
    id: "2026-11-06-expansion-crystal",
    date: "2026-11-06",
    title: "IT知識・DCC・ツール別を52章拡充(293件→345件)、鉱石モチーフ(結晶)を追加",
    description:
      "IT知識を22章(AI基礎: RAG・トークンとコンテキストウィンドウ・ハルシネーション・量子化 / ネットワーク: IPとサブネット・DHCP / OS: システムコール・割り込み / セキュリティ: パスワード保存・JWT / データベース: N+1・コネクションプール / Linux: grepとfind・systemd / 工学: 単体と結合テスト・リファクタリング / Git: resetとrevert・cherry-pick / データ構造: グラフ探索・ヒープ / Web: HTTPキャッシュ / クラウド: オブザーバビリティ)、DCCを15章(Maya・Blender・Houdini各5章)、ツール別を15章(Unity 8章・Unreal Engine 7章)追加した。すべてにステップ表示(operationSteps)を付けている。あわせて、設計書の追補(ASCIIモチーフ)に沿って、結晶(雪の結晶のような6回対称)をASCII文字で描いた静止画を、トップのヒーロー・検索結果なしの表示・404ページに追加した。動きはなく、既存の青のトークンだけを使い、本文や操作部品には出さない。",
  },
  {
    id: "2026-10-25-anatomy-exploded-rail",
    date: "2026-10-25",
    title: "章に「ひとことで」・次へボタン・内部の窓、実行環境の分解ビュー、目次レールを追加",
    description:
      "章の見せ方を、anatomyの原則に合わせて整えた。章の見出しの下に、その章の主張を1文で示す「ひとことで」を置き(frontmatterの claim)、ステップ操作の上には有効な操作を次の1つに絞った「次へ: ○○」の大きなボタンを追加した。CPU・GPU・NPUの章には、いまのステップの装置の中身を概念図で見せる「内部をのぞく窓」を加えた(個数・配置は説明用で、実機の構成ではない)。実行環境の分離の章は、5つの層を重ねた状態から斜めに引き離して見せる分解ビュー(Exploded view)に置き換えた。あわせて、画面右端に章全体のうちの読んでいる位置を示す縦の目次レールを追加した(クリック・ドラッグ・矢印キーで移動できる)。左の目次は「どの見出しか」、レールは「全体のどこか」と役割を分けて併用する。",
    entryIds: ["cpu-gpu-npu", "execution-environment-isolation"],
  },
  {
    id: "2026-10-16-visual-motion",
    date: "2026-10-16",
    title: "カードの段階プレビューとヒーローの動きで、視覚表現を強化",
    description:
      "カタログの各カードに、章のステップを順に点灯する小さな段階プレビューを追加した。ふだんは最初のステップを点灯して静止し、カードにホバー(またはフォーカス)している間だけ動く。「プレビューを動かす」スイッチをONにすると、全カードが常時ループする。ヒーローには「変数と型 → 条件分岐 → ループ → 関数 → 配列・データ構造」が順に点灯するトラックを置いた。章ページのステップ一覧では、通過したステップに緑のチェックを付け、現在のステップに切り替わった瞬間だけ入場アニメを再生する。動きは「カタログはヒーローとカードの2種類まで」に絞り、動きを減らす設定(OS設定・ヘッダーのスイッチ)では常に静止する。",
  },
  {
    id: "2026-10-16-ui-parts-entry-points",
    date: "2026-10-16",
    title: "入口の段分け・章のタブ化・スクロールで進める表示などを追加",
    description:
      "カタログの入口を「まずはここから(読む順に10章)/ 用途から / すべて(件数)」に分け、すべてでは並べ替えもできるようにした。章ページは本文を「解説 / 例 / クイズ」のタブにし、左の目次には現在地を示す見出し一覧(スクロールスパイ)を追加した。ステップ操作には、全体の位置を示すインジケーター、コマ送りのキー(, と .)、直前のステップを薄く残す「直前を残す」を追加。ステップ形式の章では「スクロールで進める」も選べる。ヘッダーに「動きを減らす」スイッチを追加し、OS設定が有効なときは常にONになる。章末には「この章の見方」(見るポイント / 使うときの注意 / よくある誤解)を書いた章だけ表示し、復習の記録はJSONで書き出し・読み込みできる。あわせて、段階アニメ対応の件数に operationSteps の章を含めるよう直した。",
  },
  {
    id: "2026-10-09-ui-quiz-ai-basics",
    date: "2026-10-09",
    title: "UI改善・ライトテーマ・章末クイズ・AI基礎の4章を追加",
    description:
      "ダークとライトのテーマ切替(OS設定に追従、初回のちらつきなし)を追加し、光るのは「いま見ているステップ」だけに整理した。カタログ先頭を「基礎を、順番に。」のヒーローと3つの数字に刷新し、カードの並びは端が余らないレイアウトにした。章ページは左に同じ分類の目次、中央に解説とステップアニメの型にし、再生速度(0.5x/1x/2x)と「3 / 9」形式の進捗表示を追加。章末クイズと、間違えた問題を1・3・7日後に再出題する復習(固定間隔)をトップに追加した。新章は、CPU・GPU・NPUの違い(3レーンの専用アニメ)、生成モデルと判断モデル、実行環境の分離、埋め込みとベクトル検索の4つ。なお、実行環境の分離の比較表は一般的な整理で、各ツールの公式ドキュメントでの確認が必要。",
    entryIds: [
      "cpu-gpu-npu",
      "generative-vs-decision-model",
      "execution-environment-isolation",
      "embedding-vector-search",
    ],
  },
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
