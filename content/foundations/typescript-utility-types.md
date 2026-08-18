---
name: ユーティリティ型(Partial/Pick/Omit)の基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: next
summary: 既存の型を元に「一部だけ変更した型」を作るための組み込み型。型定義の重複を避けられる。
---

## 概要

TypeScriptのユーティリティ型は、既存の型から新しい型を導出するための組み込みジェネリック型。同じ形のインターフェースを何度も手書きする代わりに、既存の型を変形して使い回せる。

## 基礎文法

```typescript
interface FoundationsFrontmatter {
  name: string;
  category: string;
  subcategory: string;
  summary: string;
  masteryBadge?: string;
}

// 全プロパティを任意(optional)にする
type DraftFrontmatter = Partial<FoundationsFrontmatter>;

// 指定したプロパティだけを取り出す
type FrontmatterPreview = Pick<FoundationsFrontmatter, "name" | "summary">;

// 指定したプロパティだけを除外する
type FrontmatterWithoutBadge = Omit<FoundationsFrontmatter, "masteryBadge">;
```

- `Partial<T>`: 全プロパティを`?`付き(任意)にする
- `Required<T>`: 全プロパティから`?`を外す(必須にする)
- `Pick<T, K>`: `T`から指定したキー`K`だけを取り出した型を作る
- `Omit<T, K>`: `T`から指定したキー`K`を除いた型を作る

## つまずきやすい点

- `Pick`/`Omit`は元の型のプロパティ名が変わると追従して壊れる(コンパイルエラーになる)ため、リファクタリングへの追従自体は安全だが、「元の型が何を指しているか」を見失うと意図が読みにくくなる
- `Partial<T>`で全プロパティを任意にした型をそのまま関数の引数型として使うと、必須であるべきプロパティまで省略可能になってしまうことがある。本当に必要な範囲だけに`Partial`を使う
- ユーティリティ型はあくまで「型」の変形であり、実行時の値には一切影響しない。値側のデフォルト値埋めなどは別途実装が必要

## 実装例(コード)

```typescript
function updateEntry(id: string, patch: Partial<FoundationsFrontmatter>): void {
  // patchはFoundationsFrontmatterの一部だけを含んでいてよい
}

updateEntry("csharp-linq-basics", { masteryBadge: "done" });
```
