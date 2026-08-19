---
name: テスト駆動開発(TDD)の基礎
category: Framework
subcategory: テスト・CI
masteryBadge: next
summary: 実装コードより先にテストを書き、そのテストを通すために実装を進める開発スタイル。
---

## 概要

テスト駆動開発(TDD)は、「Red(失敗するテストを書く)→Green(そのテストを通す最小限の実装をする)→Refactor(コードを整理する)」というサイクルを繰り返しながら開発を進めるスタイル。実装よりも先にテスト(期待する振る舞い)を明文化することで、設計の意図を明確にしながら進められる。

## 基礎文法

```typescript
// Red: まず失敗するテストを書く(この時点でmatchesSearchQueryはまだ存在しない)
test("複数語をAND条件で判定する", () => {
  expect(matchesSearchQuery(entry, "C# LINQ")).toBe(true);
});

// Green: テストを通す最小限の実装をする
function matchesSearchQuery(entry, query) {
  const terms = query.split(" ");
  return terms.every((term) => entry.name.includes(term));
}

// Refactor: 動作を変えずにコードを整理する(重複の除去、命名の改善等)
```

## つまずきやすい点

- TDDは「テストを先に書く」という手順そのものが目的化しやすいが、本質的な価値は「小さいサイクルで動作確認しながら進める」ことにある。形式的にRed→Green→Refactorを回すだけで、テストの質(本当に意味のある検証をしているか)が伴わないと効果は薄い
- 設計が固まっていない探索的な実装(UIのプロトタイピング等)では、先にテストを書くことがかえって足枷になることがある。TDDが向く場面(ロジックが明確な処理)と、向かない場面を見極める判断が必要
- Refactorの段階を省略し、Green(動く状態)で満足して次に進んでしまうと、[技術的負債](/foundations/technical-debt-basics)が蓄積しやすくなる。サイクルの3段階全てを意識することが重要

## 実装例(コード)

```typescript
// 1つのテストケースずつ、小さいサイクルで進める例
test("空文字列のクエリは常にtrueを返す", () => {
  expect(matchesSearchQuery(entry, "")).toBe(true);
});
```
