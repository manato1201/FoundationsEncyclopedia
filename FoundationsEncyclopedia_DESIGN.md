# FoundationsEncyclopedia(基礎学習図鑑) 設計書

**設計指標: 基礎知識をアルゴリズム図鑑と同じ「一覧して深掘りできる」形式で体系化し、CSS駆動の軽量アニメーションで理解度を底上げする**
作成日: 2026-08-18 / 想定規模: 小〜中規模(The-Algorithm-Illustrated/ColorEncyclopediaと同一スタック、5カテゴリ)

---

## Phase 0: コンセプト・要件定義

### 目的
プログラミング言語・IT基礎知識・DCC(Digital Content Creation)ツール・ゲームエンジン・フレームワークという、あらゆる専門分野の土台になる基礎知識を、CEDEC講演由来の「アルゴリズム図鑑」形式(Markdown+frontmatterでコンテンツを数値・構造データ化し、カタログ・詳細・可視化の3層で見せる)で体系化する。対象は初学者の自己学習だけでなく、既に一定のスキルを持つ学習者が「基礎の抜け漏れ」を確認し直す用途も想定する。

### 3姉妹プロジェクト系譜の観察
本プロジェクトは`The-Algorithm-Illustrated`(1例目、367件・24カテゴリのアルゴリズム図鑑)→`ColorEncyclopedia`(2例目、色彩・図形理論図鑑、`createContentLoader<T>`への一般化を提案済み)に続く**3番目の姉妹プロジェクト**である。同一スタック・同一コンテンツモデルを持つ独立プロジェクトが3例揃う時点で、「共有コンテンツプラットフォームパッケージ(`@encyclopedia/core`のような形での`createContentLoader`・カタログUI・ステッププレイヤーの切り出し)」が初めて費用対効果に見合い始める、という観察は記録に値する。**ただし本書のスコープでは実際の抽出作業は行わない。** 過剰設計を避け、既存2文書が確立したパターン(移植元ファイルを名指しし、直接コピー・改変する)をそのまま踏襲するに留める。抽出の是非は4例目が具体化した時点で改めて判断する。

### アーキテクチャ選定
`The-Algorithm-Illustrated`/`ColorEncyclopedia`のスタックをそのまま流用する。Next.js 16.2.10(App Router)+ React 19.2.4 + TypeScript、`gray-matter`(frontmatter解析)+`marked`(Markdown→HTML)によるビルド時コンテンツロード、npm。

**唯一の意図的な差別化点は可視化バックエンドである。** 移植元2件は`pixi.js`によるcanvas描画(色相環・配色ハーモニー等、連続的な空間表現が本質的に理解を助ける題材)を可視化の主軸に据えていた。本書は逆に、**CSSアニメーションによる軽量な補完可視化**を主軸に据える。

- 「プログラミング言語の基礎文法」「ITの基礎概念(OSI参照モデル、Gitのブランチ操作等)」「DCCツールの操作手順」は、色や図形ほど連続的な空間表現を必要とせず、フローの各ステップを区切って見せる方が理解を助けやすい。
- Canvas実装(pixi.jsでの描画コード)よりCSS実装(クラス切り替え/keyframeアニメーション)の方がエントリ1件あたりの著作コストが低い。多数のエントリを揃える必要がある基礎学習図鑑の性質(色/図形の2カテゴリだったColorEncyclopediaと異なり、5カテゴリ×多数のサブカテゴリを持つ)に合っている。
- 可視化のUXパターン自体(ステップ単位で進む・戻る、再生・一時停止)は移植元の`src/components/visualizer/useStepPlayer.ts`をそのまま再利用する。**変わるのは「同一の状態(現在のステップindex)を何で描画するか」だけ**であり、これは他の設計書に登場する「バックエンド抽象化」パターン(例: `SoundMiddleware`設計書の`IAudioBackend`によるオーディオエンジン差し替え)の系譜として位置づけられる。状態管理層(`useStepPlayer`)はpixi.js/CSSどちらのバックエンドに対しても変更なしに機能する。

### コンテンツモデル
5カテゴリをタクソノミーとして設計する。DCCとツール別はサブカテゴリとして製品名を持つ。

```typescript
// src/lib/foundations-categories.ts (案。ColorEncyclopediaのcreateContentLoader系譜)
export const FOUNDATIONS_TAXONOMY = [
  { category: "プログラミング言語", subcategories: ["C#", "C++", "Python", "TypeScript", "シェーダー言語"] },
  { category: "IT知識", subcategories: ["ネットワーク", "OS・アーキテクチャ", "バージョン管理", "データ構造・計算量"] },
  { category: "DCC", subcategories: ["Maya", "Blender", "Houdini"] },
  { category: "ツール別", subcategories: ["Unity", "UnrealEngine"] },
  { category: "Framework", subcategories: ["Web(Next.js等)", "ゲームエンジン基盤", "テスト・CI"] },
] as const;
```

### 要求機能
- カタログ/詳細ビュー(5カテゴリ横断・カテゴリ/サブカテゴリ絞り込み)
- CSSステップアニメーションによる手順・フローの可視化(Phase 3)
- 習得度バッジ(🟢🟡🔵🟣)によるフィルタリング(Phase 4)
- DCC/ツール別エントリの操作手順記述と可視化の連動(Phase 5)

### 非機能要件
- 静的優先(SSG)。移植元2件と同じくNode `fs`ベースのビルド時ロードのみで、実行時DBアクセスを持たない。
- レスポンシブ(既存2文書のブレークポイント・グリッドパターンをそのまま踏襲)。

### 前提・制約
- 本書のスコープでは共有パッケージ化(プラットフォーム抽出)は行わない(上記系譜観察を参照)。
- 新規リポジトリとして独立させ、`The-Algorithm-Illustrated`本体・`ColorEncyclopedia`本体には手を加えない(コピー元として参照するのみ)。
- 可視化ライブラリとして新規に`pixi.js`を追加しない。CSSアニメーションで表現しきれない題材(3D的な空間操作の再現等)が出た場合でも、本書のスコープでは無理にCanvas実装へ逃げず、対象題材の選定側で調整する。

### アンチパターン(全フェーズ共通)
- 新カテゴリ・新サブカテゴリの追加を`FOUNDATIONS_TAXONOMY`以外の場所(コンポーネント側の決め打ち配列)に重複させない(移植元`CATEGORY_TAXONOMY`一元管理の思想を踏襲)。
- `hasAnimation`(Phase 3)をfrontmatterに直書きしない。移植元の`hasVisualizer`と同じく、ビルド時にレジストリ照合で真偽値を導出する。
- `masteryBadge`の4値を独自の色・独自の意味に再定義しない。`LEARNING_ROADMAP.md`のバッジ体系(🟢🟡🔵🟣)とその配色を一次ソースとしてそのまま参照する(Phase 4参照)。
- CSSステップアニメーションを「動きが本質を説明しない」題材に無理に適用しない(移植元がデザインパターンを可視化対象から外した判断と対称的な基準)。

**検証チェックリスト:**
- [ ] `FOUNDATIONS_TAXONOMY`が5カテゴリ・DCC={Maya, Blender, Houdini}・ツール別={Unity, UnrealEngine}を過不足なく含む
- [ ] 3姉妹プロジェクト系譜の観察がPhase 0に明記され、かつ「本書では抽出しない」という結論が併記されている
- [ ] 可視化バックエンドがCSSである理由(著作コスト・題材特性)がColorEncyclopediaとの対比で明記されている
- [ ] `masteryBadge`が独自定義ではなく`LEARNING_ROADMAP.md`のバッジ体系の流用であることが前提として記載されている

---

## Phase 1: コンテンツ基盤(移植・拡張)(最優先)

**方針:** `content/foundations/*.md`をフラット構成で持つ(移植元`content/algorithms/*.md`のフラット配置を踏襲)。frontmatterは移植元の`name`/`category`/`subcategory`/`summary`の4項目に加え、本書固有の`masteryBadge`(任意)を持つ。

**実装内容:**
1. frontmatterスキーマを定義する。

   ```yaml
   # content/foundations/csharp-linq-basics.md
   ---
   name: LINQの基礎(Where/Select/OrderBy)
   category: プログラミング言語
   subcategory: C#
   masteryBadge: done
   summary: コレクション操作を宣言的に記述するC#の標準機能。UnityのC#スクリプトでも頻出する。
   ---
   ## 概要
   ## 基礎文法
   ## つまずきやすい点
   ## 実装例(コード)
   ```

   DCC/ツール別エントリは本文見出しに`## 操作手順(OperationSteps)`を持つ点が言語/IT知識エントリと異なる(具体スキーマはPhase 5参照)。

2. `masteryBadge`の4値は`LEARNING_ROADMAP.md`冒頭のバッジ凡例表とそのまま対応させる。新規の意味づけを行わない。

   ```typescript
   // masteryBadge <-> LEARNING_ROADMAP.md バッジ対応表
   type MasteryBadge = "done" | "review" | "next" | "advanced";
   const MASTERY_BADGE_META: Record<MasteryBadge, { emoji: string; label: string; color: string }> = {
     done:     { emoji: "🟢", label: "習得済み",       color: "#2e7d32" }, // 実績・成果物あり
     review:   { emoji: "🟡", label: "復習すべき",     color: "#f9a825" }, // 経験はあるが体系化・言語化が必要
     next:     { emoji: "🔵", label: "今後学ぶ",       color: "#1565c0" }, // 自分の路線の延長で必要になる
     advanced: { emoji: "🟣", label: "応用・発展",     color: "#6a1b9a" }, // 既存スキルを掛け合わせて到達できる領域
   };
   ```

   `masteryBadge`はオプショナル項目とする(全エントリに習熟度を割り当てる運用は強制しない。図鑑としての中立的な参照用途とユーザー個人の学習進捗トラッキング用途を両立させるため)。

3. `createContentLoader<T>`(ColorEncyclopediaが`src/lib/content/createContentLoader.ts`として既に一般化提案済み)を**3個目の利用先としてそのまま使う**。独自ローダーを新規に書かない。

   ```typescript
   // src/lib/content/foundations.ts
   import { createContentLoader, type ContentFrontmatterBase } from "./createContentLoader";

   export interface FoundationsFrontmatter extends ContentFrontmatterBase {
     masteryBadge?: "done" | "review" | "next" | "advanced";
     operationSteps?: { label: string; menuPath?: string; note?: string }[]; // Phase 5
   }
   export const foundationsLoader = createContentLoader<FoundationsFrontmatter>("content/foundations");
   ```

**検証チェックリスト:**
- [ ] `content/foundations/*.md`が`createContentLoader`の既存実装で改造なしにロードできる
- [ ] `masteryBadge`の4値が`MASTERY_BADGE_META`経由で`LEARNING_ROADMAP.md`の凡例表(絵文字・色・意味)と1対1対応している
- [ ] `masteryBadge`未設定エントリでも型・カタログ表示の両方でエラーにならない(オプショナル項目として機能する)
- [ ] `createContentLoader`の3個目の利用先追加によって、既存2利用先(`colors`/`shapes`)側にコード変更が発生していない

---

## Phase 2: カタログ・詳細ビュー(既存コンポーネント移植)

**方針:** カタログ・詳細ページは移植元の構造(絞り込みチップ+一覧+詳細ページ)をほぼ無改造で移植する。本書固有の追加要素はバッジフィルタチップのみ。

**実装内容:**
1. `src/components/catalog/FoundationsCatalog.tsx` — `AlgorithmCatalog.tsx`(347行)/ColorEncyclopedia側`ColorCatalog.tsx`の直接移植。カテゴリ/サブカテゴリ絞り込みチップの語彙を`FOUNDATIONS_TAXONOMY`の5カテゴリに差し替える以外はロジック互換を維持する。`AlgorithmCatalog.module.css`のグリッドパターン(`grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr))`)もそのまま踏襲する。
2. `src/app/foundations/[id]/page.tsx` — 詳細ページ。`foundationsLoader.getDetail(id)`で取得したMarkdown本文を描画し、`masteryBadge`があるエントリはヘッダ部にバッジを表示する。
3. バッジをカタログの絞り込みチップとしても使えるようにする。既存の「可視化対応のみ」チップ(移植元)と横並びで「🟢習得済みのみ表示」のようなチップを追加する。

   ```typescript
   // FoundationsCatalog.tsx 内、絞り込みロジック追加分(既存chip配列に1項目追加するだけ)
   const badgeFilterChips = (Object.keys(MASTERY_BADGE_META) as MasteryBadge[]).map((badge) => ({
     key: badge,
     label: `${MASTERY_BADGE_META[badge].emoji} ${MASTERY_BADGE_META[badge].label}のみ`,
   }));
   ```

**検証チェックリスト:**
- [ ] `FoundationsCatalog.tsx`の絞り込みチップが5カテゴリ全てで破綻なく機能する
- [ ] バッジフィルタチップが単独選択・解除の両方で一覧に正しく反映される
- [ ] `masteryBadge`未設定エントリがバッジフィルタ適用時に「該当なし」として除外される(エラーにならない)
- [ ] モバイル幅でカタログが1列に折り返される(移植元ブレークポイント踏襲)

---

## Phase 3: CSSステップアニメーション基盤(最大の差別化要素)

**方針:** `useStepPlayer.ts`(移植元のステップindex管理フック)はそのまま再利用し、描画だけを`<canvas>`(pixi.js)からCSS駆動に差し替える。`useStepPlayer`の戻り値(`stepIndex`/`isFinished`/`showPause`/`handlePlayPause`/`handleStep`/`reset`)はバックエンド非依存であり、変更は一切不要。

**実装内容:**
1. `src/components/animation/CssStepAnimation.tsx` — `stepIndex`をCSS custom property(`--step-index`)と`data-step`属性の両方に反映し、実際の見た目はエントリ側の`.module.css`が持つkeyframeが決める。

   ```tsx
   // src/components/animation/CssStepAnimation.tsx
   "use client";
   import { useStepPlayer } from "@/components/visualizer/useStepPlayer"; // 移植元フックをそのまま import
   import { PlaybackControls } from "@/components/visualizer/PlaybackControls"; // 再生UIも移植元を共用

   export function CssStepAnimation({ frameCount, children }: { frameCount: number; children: React.ReactNode }) {
     const player = useStepPlayer(frameCount); // 状態管理は移植元フックに完全委譲、変更なし
     return (
       <div className="css-step-stage" data-step={player.stepIndex}
            style={{ "--step-index": player.stepIndex } as React.CSSProperties}>
         {children /* エントリ固有の描画要素(下記keyframe適用対象) */}
         <PlaybackControls isFinished={player.isFinished} showPause={player.showPause}
           onPlayPause={player.handlePlayPause} onStep={player.handleStep} onReset={player.reset} />
       </div>
     );
   }
   ```

2. エントリ作者は各エントリに隣接する`.module.css`に、ステップ別のkeyframe(または`[data-step="N"]`セレクタでの状態切り替え)を書くだけで新しい可視化を追加できる。**新規Reactコンポーネントを書く必要がない**、という著作簡易性が本フェーズの中心要求である。

   ```css
   /* content/foundations/for-loop-flow.module.css (例: forループの実行フロー) */
   [data-step="0"] .init-box      { outline: 2px solid var(--color-accent-blue); }
   [data-step="1"] .condition-box { outline: 2px solid var(--color-accent-blue); }
   [data-step="2"] .body-box      { outline: 2px solid var(--color-accent-green); }
   [data-step="3"] .increment-box { outline: 2px solid var(--color-accent-amber); }
   .increment-box { transition: transform 300ms ease-out; transform: translateX(calc(var(--step-index) * 4px)); }
   ```

3. CSSステップアニメーション向きの題材例(いずれも「連続的な空間表現」ではなく「区切られたステップの遷移」が本質のもの):
   - **forループの実行フロー**(初期化→条件判定→本体実行→更新、の4ステップ循環)
   - **Gitのブランチ操作**(`checkout -b`→変更→`commit`→`merge`、ブランチグラフをステップごとにノード追加)
   - **Blenderモディファイアスタックの適用順**(スタック内モディファイアを上から順に適用、各ステップでメッシュ形状のクラス切り替え)
   - **OSI参照モデルのパケットカプセル化**(L7→L1へ各層でヘッダが付与される様子を層ごとのボックス表示)
4. `hasAnimation`ビルド時真偽値パターン — 移植元`hasVisualizer`(`src/lib/has-visualizer.ts`)と同型で踏襲する。frontmatterに直書きせず、`*-animations.ts`相当のレジストリ(`FOR_LOOP_ANIMATIONS`/`GIT_ANIMATIONS`/`DCC_STEP_ANIMATIONS`等)へのid登録有無をビルド時に`in`演算子で照合し真偽値を導出する。これによりアニメーション未対応エントリの詳細ページでも`CssStepAnimation`の欠落がSSGビルドをブロックしない。

**検証チェックリスト:**
- [ ] `useStepPlayer.ts`が移植元から無改造でimportされ、`CssStepAnimation.tsx`側での状態管理の再実装がない
- [ ] `--step-index`/`data-step`の両方がステップ遷移ごとに同期して更新される
- [ ] エントリ作者が新規`.module.css`の追加のみ(新規TSXコンポーネント不要)で新しい可視化を追加できることをforループ例で確認する
- [ ] `hasAnimation`がfrontmatterに存在せず、レジストリ照合によるビルド時導出になっている(`hasVisualizer`のアンチパターンをgrepで再確認)
- [ ] アニメーション未対応エントリを含めても`next build`がブロックされない

---

## Phase 4: 習得度バッジ+進捗可視化(LEARNING_ROADMAP.md連携)

**方針:** frontmatterの`masteryBadge`をカタログ・詳細ページ上で`LEARNING_ROADMAP.md`と完全に同じ配色のバッジとして表示する。新規のバッジ体系・新規配色は発明しない(Phase 0のアンチパターン参照)。

**実装内容:**
1. `src/components/badge/MasteryBadge.tsx` — Phase 1で定義した`MASTERY_BADGE_META`をそのまま参照するプレゼンテーショナルコンポーネント。`<MasteryBadgeChip badge="done">`のように受け取り、`meta.color`を背景色、`${meta.emoji} ${meta.label}`をラベルとして描画する薄いラッパーに徹する(独自の色分岐ロジックを持たない)。
2. カタログ一覧の各カード・詳細ページヘッダの両方に`MasteryBadgeChip`を表示する(Phase 2の`FoundationsCatalog.tsx`カード内、`[id]/page.tsx`ヘッダ内)。
3. **任意の発展(本フェーズでは実装しない):** `scripts/sync_roadmap_badges.mjs`のようなスクリプトで、`LEARNING_ROADMAP.md`のmermaidノードラベル(`L1[🟢 習得済み]:::done`のような記法)から図鑑エントリのバッジを半自動抽出する案。`:::done`等のCSSクラスによる機械的抽出自体は原理的に可能だが、ノード名と図鑑エントリ名の対応付けは表記ゆれ・粒度の不一致があり自明でない。誤マッピングのリスクが実装コストに見合わないため、**本フェーズでは手動運用のみとし将来検討に留める。**

**検証チェックリスト:**
- [ ] `MasteryBadgeChip`の4色(`#2e7d32`/`#f9a825`/`#1565c0`/`#6a1b9a`)が`LEARNING_ROADMAP.md`冒頭のバッジ凡例表と完全一致する
- [ ] カタログカード・詳細ページヘッダの両方でバッジが表示される
- [ ] `masteryBadge`未設定エントリでバッジ領域が空表示(エラーやプレースホルダ崩れなし)になる
- [ ] `sync_roadmap_badges.mjs`が「将来検討」として明記され、本フェーズのスコープに含まれていないことが文書上明確である

---

## Phase 5: カテゴリ別テンプレート拡張(DCC/ツール別特有のニーズ)

**方針:** DCC(Maya/Blender/Houdini)・ツール別(Unity/UnrealEngine)のエントリは「操作手順」「メニューパス」のような手続き的知識が中心になりやすく、プログラミング言語・IT知識カテゴリの「概念説明」中心のエントリと性質が異なる。新規スキーマを増やしすぎず、Phase 1で定義した`operationSteps`フィールドをPhase 3のCSSステップアニメーションの入力データとしてそのまま使う設計にする。

**実装内容:**
1. `OperationSteps`frontmatterフィールド(Phase 1の`FoundationsFrontmatter.operationSteps`)を実データで運用する。

   ```yaml
   # content/foundations/unity-prefab-variant.md
   ---
   name: Prefab Variantの作成
   category: ツール別
   subcategory: Unity
   masteryBadge: done
   summary: 既存Prefabの差分だけを保持する派生アセット。共通レイアウトを保ちつつ個別調整を可能にする。
   operationSteps:
     - label: 元になるPrefabを選択
       menuPath: Project ウィンドウ > 対象Prefabを右クリック
     - label: Variantを作成
       menuPath: Create > Prefab Variant
       note: 元Prefabへの変更は自動反映されるが、Variant側の上書き項目は維持される
     - label: 差分プロパティを編集
       note: インスペクタ上で太字表示された項目がVariant固有の上書き値
   ---
   ```

2. `operationSteps`配列の各要素(`label`/`menuPath?`/`note?`)を、Phase 3の`CssStepAnimation`の`frameCount`(=配列長)とステップラベルの入力データとして直接使う。DCC/ツール別エントリ用の`src/components/animation/OperationStepsAnimation.tsx`は`CssStepAnimation`を`<CssStepAnimation frameCount={steps.length}>`の形でラップし、`steps.map`で各ステップを`label`/`menuPath`/`note`付きの`<div data-index={i}>`として描画する薄いラッパーに徹する(`useStepPlayer`側への変更は発生しない)。
3. `operationSteps`はDCC/ツール別カテゴリに限定せず、`IT知識`カテゴリの「Gitのブランチ操作」のような手続き的知識にも同フィールドを流用可能とする(カテゴリ単位で強制せず、内容の性質で任意選択)。これにより新規スキーマの増殖を避ける。

**検証チェックリスト:**
- [ ] `operationSteps`が`FoundationsFrontmatter`型に過不足なく定義され(`label`必須/`menuPath`・`note`任意)、DCC/ツール別以外のカテゴリでも利用可能である
- [ ] `OperationStepsAnimation`が`CssStepAnimation`のラッパーとして実装され、`useStepPlayer`側への変更が発生していない
- [ ] `operationSteps`配列長と`CssStepAnimation`の`frameCount`が常に一致する(ステップ数の二重管理がない)
- [ ] Maya/Blender/Houdini/Unity/UnrealEngineそれぞれ最低1件の実データエントリで`operationSteps`→ステップアニメーション連動が確認できる

---

## Final Phase: 統合検証

- [ ] 共有`createContentLoader<T>`が`foundations`を3個目の利用先として問題なく動作し、既存2利用先(`colors`/`shapes`)に回帰がない
- [ ] CSSステップアニメーション(Phase 3)がアニメーション未対応エントリを含めても`next build`をブロックしない
- [ ] バッジ配色(Phase 4)が`LEARNING_ROADMAP.md`のバッジ凡例表と完全一致している
- [ ] DCC/ツール別エントリの`operationSteps`(Phase 5)がCSSステップアニメーションと連動して表示される
- [ ] `npm run lint` / `npx tsc --noEmit` / `npm run build`が全パスする
- [ ] 5カテゴリ(プログラミング言語/IT知識/DCC/ツール別/Framework)それぞれ最低数件のエントリでカタログ・詳細・バッジ・アニメーションの一連の流れが崩れない

---

## 相互参照ドキュメント

- **`The-Algorithm-Illustrated`**(1例目、`The-Algorithm-Illustrated/IMPROVEMENT_PLAN.md`): スタック(Next.js 16.2.10 + React 19.2.4 + `gray-matter` + `marked`)・コンテンツモデル(frontmatter方式)・`useStepPlayer.ts`(`src/components/visualizer/useStepPlayer.ts`)の直接の移植元。本書のPhase 3はこのフックを無改造で再利用し、描画バックエンドのみCSSに差し替える。
- **`ColorEncyclopedia`**(2例目、`ColorEncyclopedia/ColorEncyclopedia_DESIGN.md`): 直近の姉妹プロジェクト。`createContentLoader<T>`(移植元`algorithms.ts`の一般化)の共同利用先であり、本書がその3個目の利用先として合流する。カタログUI(`AlgorithmCatalog.tsx`→`ColorCatalog.tsx`→本書`FoundationsCatalog.tsx`)の移植系譜も共通する。
- **`LEARNING_ROADMAP.md`**: `masteryBadge`バッジ体系(🟢習得済み/🟡復習すべき/🔵今後学ぶ/🟣応用・発展、配色`#2e7d32`/`#f9a825`/`#1565c0`/`#6a1b9a`)の一次ソース。本書は新規バッジ体系を発明せずこれをそのまま流用する。任意の発展として、将来的に本図鑑がユーザー個人の習熟度可視化ツールとしても機能しうる(Phase 4の`sync_roadmap_badges.mjs`案、本フェーズでは未実装)。

3姉妹プロジェクト(`The-Algorithm-Illustrated`/`ColorEncyclopedia`/`FoundationsEncyclopedia`)が揃ったことで、次に同種の「encyclopedia系」プロジェクトが構想された際は、共有コンテンツプラットフォームパッケージへの抽出を検討する価値がある。ただし本書の時点ではこれを実行しない(Phase 0参照)。

**優先度注記:** 低〜中リスク。アーキテクチャの大部分は2つの姉妹プロジェクトからの実証済みパターンの再利用であり、`createContentLoader<T>`・カタログUI・`useStepPlayer.ts`の移植はいずれも既に確立済みの経路をなぞるだけである。新規性はPhase 3のCSSステップアニメーション基盤(著作コストの低い可視化手段の確立)とPhase 4のバッジ体系連携の2点に限られる。
