# 第 1 回 章のデータの形

> 所要時間の目安: 2.5 時間 / 前提: 第 0 回

## この回のゴール

- 章の frontmatter(手順・クイズ・ガイド・主張)の**形**を説明できる。
- **分類表**と章の分類が一致しているかを、自分で**機械的に検査**できる。
- このリポジトリに**自動の検査が無い**ことの意味を説明できる。

## 1. 形

```typescript
// 抜粋ファイル: src/lib/content/foundations.ts
export interface OperationStep {
  label: string;
  menuPath?: string;
  note?: string;
export interface QuizItem {
  question: string;
  choices: string[];
  answer: number;
  explanation?: string;
export interface FoundationsFrontmatter extends ContentFrontmatterBase {
  masteryBadge?: MasteryBadge;
  operationSteps?: OperationStep[];
  quiz?: QuizItem[];
  guide?: ChapterGuideFrontmatter;
  claim?: string;
```

| 項目 | 意味 |
|---|---|
| `operationSteps` | 手順(3〜6 個ほど)。`label` が図の名前、`menuPath`(メニューの経路)・`note`(補足)は詳細に出る |
| `quiz` | 章末クイズ。`answer` は**選択肢の番号(0 始まり)** |
| `guide` | 「この章の見方」(`watch`・`caution`・`misconception`)。**書いた項目だけ**表示 |
| `claim` | 章の主張を**1 文**で。1 文で言えない章は、2 つに分ける |
| `masteryBadge` | 習得の印(`done`・`review`・`next`・`advanced`) |

共通の項目(`name`・`nameEn`・`category`・`subcategory`・`summary`)は、色の図鑑と**同じローダー**(`createContentLoader`)の型を共有する。

## 2. 分類表と一致させる

`category`・`subcategory` は、`FOUNDATIONS_TAXONOMY`(分類表)の組み合わせのどれかと**一致**させる。新しい分類は、**表への追記だけ**で足りる。

## 3. 自分で検査を書く

このリポジトリには、`npm run verify` のような**自動検査がありません**。そこで、検査を**自分で書く**練習をします。守りたいことを**1 行で**言い、**全章に対して**確かめます。

```javascript
// 実行できる
(async () => {
  const fs = require("fs");
  const path = require("path");
  const matter = (await import("gray-matter")).default;
  const { FOUNDATIONS_TAXONOMY } = await import("./src/lib/foundations-categories.ts");

  const valid = new Set(FOUNDATIONS_TAXONOMY.flatMap((c) => c.subcategories.map((s) => `${c.category}::${s}`)));
  const dir = "content/foundations";
  const problems = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!valid.has(`${data.category}::${data.subcategory}`)) problems.push(`${file}: 分類が表に無い`);
    for (const [i, q] of (data.quiz ?? []).entries()) {
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) problems.push(`${file}: quiz[${i}] の answer が範囲外`);
    }
    for (const [i, s] of (data.operationSteps ?? []).entries()) {
      if (typeof s.label !== "string" || s.label.trim() === "") problems.push(`${file}: operationSteps[${i}] の label が空`);
    }
  }
  console.log("問題の数:", problems.length);
  for (const p of problems.slice(0, 5)) console.log(" -", p);

  // 検査が働くことを、壊したデータで確かめる(通るだけの検査は、何も守らない)
  const broken = { quiz: [{ question: "?", choices: ["a", "b"], answer: 2 }] };
  const q = broken.quiz[0];
  console.log("わざと壊した quiz を、検査は見つけるか:", !(q.answer >= 0 && q.answer < q.choices.length));
})();
```

```text
# 出力
問題の数: 0
わざと壊した quiz を、検査は見つけるか: true
```

- **守りたいこと**を 1 行で言う → **全件**に当てる → **わざと壊して、落ちる**ことを確かめる(最後の行)。
- この検査を、`scripts/verify-content.mjs` にして `npm run verify` に登録するのが、自然な拡張(→ [学習資料 4](../learn/04-extend.md))。

## 確認問題

1. `quiz` の `answer` は、何を指しますか。
2. `guide` に、一部の項目だけ書いたら、どうなりますか。
3. 自分で書いた検査を、わざと壊したデータで試すのは、なぜですか。

## 解答

1. 選択肢の番号(0 始まり)。
2. 書いた項目だけが、章の末尾の「この章の見方」に出る。
3. 通るだけで、何も守っていない検査を、見つけるため(壊したデータで落ちるか確かめる)。

## まとめ

- 章は frontmatter(手順・クイズ・ガイド・主張)+ 本文。分類は表と一致。
- 検査は「守りたいことを 1 行で言い、全件に当て、壊して確かめる」。
- 次の回は、**図の型を決める規則表**。
