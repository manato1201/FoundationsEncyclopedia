---
name: 単体テストのAAAパターン
category: Framework
subcategory: テスト・CI
masteryBadge: review
summary: Arrange(準備)/Act(実行)/Assert(検証)の3段構成でテストを書くと、意図が読み取りやすくなる。
---

## 概要

AAAパターンは、単体テストのコードを「準備(Arrange)」「実行(Act)」「検証(Assert)」の3段階に分けて書くという慣習。テストの構造が統一されることで、テストが何を確認しているのかを素早く読み取れるようになる。

## 基礎文法

```typescript
test("matchesSearchQueryは複数語をAND条件で判定する", () => {
  // Arrange: テスト対象と入力を準備する
  const entry = {
    name: "LINQの基礎",
    category: "プログラミング言語",
    subcategory: "C#",
    summary: "コレクション操作を宣言的に記述する",
  };

  // Act: テスト対象の関数を実行する
  const result = matchesSearchQuery(entry, "C# LINQ");

  // Assert: 結果を検証する
  expect(result).toBe(true);
});
```

## つまずきやすい点

- 1つのテストケースの中に複数の「実行(Act)」と「検証(Assert)」の組を詰め込むと、どの検証がどの実行に対応しているのか読みにくくなる。1テスト1振る舞いを検証するのが基本
- Arrangeの部分が肥大化してテスト間で重複しやすい。共通のセットアップは`beforeEach`のようなフックに切り出すか、テストデータ生成用のヘルパー関数にまとめる
- 「準備・実行・検証」という構造だけを形式的になぞり、実際には何を保証したいテストなのかが曖昧なまま書いてしまうと、後から見て意図が読み取れないテストになる。テスト名(`test("...")`の文字列)に検証したい振る舞いを明確に書くことが重要

## 実装例(コード)

```typescript
describe("MASTERY_BADGE_META", () => {
  test("4値がLEARNING_ROADMAP.mdの凡例と一致する", () => {
    // Arrange
    const expectedColors = ["#2e7d32", "#f9a825", "#1565c0", "#6a1b9a"];

    // Act
    const actualColors = MASTERY_BADGE_ORDER.map((b) => MASTERY_BADGE_META[b].color);

    // Assert
    expect(actualColors).toEqual(expectedColors);
  });
});
```
