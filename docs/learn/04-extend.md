# 4. 拡張のレシピ

どのレシピも、**同じ順**で進めます: ①何を足すか決める → ②データを書く → ③**自分で確かめる**(自動検査が無いので) → ④必要なら規則・登録表 → ⑤文書(更新履歴)。

## レシピ A: 章を 1 件足す

1. `content/foundations/<id>.md` を作る。`<id>` は**英数字・ハイフン**(URL になる)。**規則表は id に当たるので、id の付け方で図の型が変わる**(第 2 回)。
2. frontmatter: `name`・`category`・`subcategory`・`summary`(と、`nameEn`)。**`category` と `subcategory` は、`FOUNDATIONS_TAXONOMY` の組み合わせと一致**させる。
3. 手順があれば `operationSteps`(3〜6 個)。`label` は**短く**(図に収まる)。`menuPath`・`note` は詳細に出る。
4. クイズは `quiz`(`answer` は**選択肢の番号・0 始まり**)。
5. `claim`(1 文の主張)・`guide`(見るポイント・注意・誤解)は、**書いた項目だけ**表示される。
6. 本文は `## 概要` …。**「実装例」で始まる `##` は、「例」タブへ**分けられる。
7. 他の章へのリンクは、`/foundations/<id>` を指す普通の Markdown のリンクで書く(つながりの地図に使われる)。
8. **確かめる**: 第 1 回の検査(分類・クイズの答え・手順のラベル)を回し、`npm run dev` で章を開いて、**図の型・アイコン**を目で見る。

## レシピ B: 分類を足す

`src/lib/foundations-categories.ts` の `FOUNDATIONS_TAXONOMY` に**追記**する(他の場所に重複させない)。足したら、その分類に章を 1 件以上置き、「用途から」(`PURPOSE_GROUPS`)に入れるかを決める。

## レシピ C: 図の型の規則を直す・足す

1. 対象の章 id を決める。**まず `OVERRIDES` に 1 件足せば足りるか**を考える(影響が 1 章で済む)。
2. 規則を足す・直すなら、**全章の結果を、前後で比べる**。

```javascript
// 実行できる
(async () => {
  const fs = require("fs");
  const s = await import("./src/lib/step-scene.ts");
  const ids = fs.readdirSync("content/foundations").map((f) => f.replace(/\.md$/, ""));

  // 規則を直す前の結果を、(id → 立体の種類・既定)の表にして取っておく。直した後にもう一度作って、差分を見る
  const table = Object.fromEntries(ids.map((id) => [id, s.resolveScene(id)]));
  const changed = (before, after) => ids.filter((id) => JSON.stringify(before[id]) !== JSON.stringify(after[id]));

  // 例: loop の章だけを ring にした「仮の結果」と比べる
  const hypothetical = { ...table };
  for (const id of ids.filter((i) => /(^|-)loops?(-|$)/.test(i))) hypothetical[id] = { ...table[id], solid: "ring" };
  console.log("全章の数が 3 桁:", ids.length >= 100);
  console.log("loop を ring にすると、結果が変わる章がある:", changed(table, hypothetical).length > 0);
  console.log("変わる章(先頭 3 件):", changed(table, hypothetical).slice(0, 3).join(", "));
})();
```

```text
# 出力
全章の数が 3 桁: true
loop を ring にすると、結果が変わる章がある: true
変わる章(先頭 3 件): blender-loop-cut-basics, cpp-loops-basics, csharp-loops-basics
```

3. 差分の章を**目で確かめ**、意図した章だけが変わったことを確認する。

## レシピ D: アニメーションを足す

1. `src/lib/animations/` の該当する表(または新しい `*-animations.ts`)に、id を足す。新しい表を作ったら、`has-animation.ts` の `in` の連なりにも足す。
2. 画面側の部品を足す(`src/components/animation/entries/`)。**React に依存する部品は、登録表に入れない**(登録表は純粋に保つ)。
3. `operationSteps` で足りる章は、**アニメーションを作らず**、手順の図に任せる。

## レシピ E: 検査を足す(`npm run verify`)

自動検査が無いので、**足す価値が大きい**。第 1 回の例を `scripts/verify-content.mjs` にし、`package.json` の `scripts` に `"verify": "node --experimental-strip-types scripts/verify-content.mjs"` を足す。守りたいこと(分類・クイズの答え・手順のラベル・id の形式)を、**番号つきの一覧**を先頭に書き、`fail(file, message)` で全件を集めて、最後に終了コードで落とす。

## レシピ F: 更新履歴を足す

`src/lib/updates.ts` の配列の**先頭**に、`id`(日付 + 短い名前)・`date`・`title`・`description`・(`entryIds`)を足す。

## 足したら、必ずやること

1. `npm run lint`・`npm run build`(型検査を含む)。
2. 章を足したら、**その章を開いて**、図・アイコン・クイズ・目次を目で見る。
3. `python tools/check_docs.py`(文書の検査)。
