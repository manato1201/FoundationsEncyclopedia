# FoundationsEncyclopedia 学習資料(保守・拡張の実務編)

このフォルダは、**この図鑑を直す・足す人**のための資料です。基礎から順に学ぶ講義は [../lecture/index.md](../lecture/index.md)(第 0〜5 回・実行できる例つき)。画面の決めごと・機能の詳細(旧 README)は [ui-and-features.md](../reference/ui-and-features.md)。

| # | 資料 | いつ読むか |
|---|---|---|
| 1 | [全体像](01-overview.md) | 部品・ページ・データの流れ・保存先 |
| 2 | [コードの読み方](02-code-tour.md) | どのファイルから読むか |
| 3 | [内側のしくみ](03-internals.md) | ローダー・アニメーションの登録・手順の図・立体・復習・予想 |
| 4 | [拡張のレシピ](04-extend.md) | 章・分類・規則・アニメーション・検査を**足したい** |
| 5 | [テストの書き方と実行](05-testing.md) | **自動テストが無い**現状・足し方・文書の検査・確かめていないこと |
| 6 | [トラブルと保守](06-troubleshooting-maintenance.md) | 動かない・**既知の問題**・定期の保守 |
| – | [用語集](glossary.md) | 分からない言葉が出た |

## 最初の 15 分

1. `npm install` → `npm run dev` で、カタログと 1 つの章(`/foundations/for-loop-flow`)を開く。
2. 章の Markdown(`content/foundations/for-loop-flow.md`)と見比べる。
3. [構成図](../diagrams/architecture.svg)を見ながら、[全体像](01-overview.md)を読む。

## コードの地図

| 場所 | 役割 |
|---|---|
| `content/foundations/` | 章(Markdown + frontmatter。495 件) |
| `src/lib/content/` | `createContentLoader`・`foundationsLoader`(frontmatter の型) |
| `src/lib/step-scene.ts` | 章の id → 図の型・手順 → グリフ(規則表。純粋関数) |
| `src/lib/three-scenes.ts` | 立体(three.js)のシーン(738 行) |
| `src/lib/animations/` | 章ごとの CSS ステップアニメーションの**登録表** |
| `src/lib/has-animation.ts` | アニメーションの有無(`id in 表`) |
| `src/lib/review-store.ts` | 復習(固定間隔・localStorage) |
| `src/lib/guess.ts`・`guess-pref.ts`・`scene-pref.ts` | 先に予想・好みの保存 |
| `src/lib/chapter-links.ts`・`chapter-sections.ts` | 章の地図・本文の分割 |
| `src/lib/foundations-categories.ts`・`foundations-search.ts`・`catalog-entry-points.ts` | 分類表・検索・入口の段分け |
| `src/lib/ascii-crystal.ts` | ASCII の結晶(決定論的) |
| `src/components/` | 画面の部品(`animation`・`chapter`・`quiz`・`scene`・`catalog`・`hud`・`icons`・`theme`・`badge`) |
| `src/app/` | ページ(`foundations/[id]`・`about`・`basics`・`updates`) |
