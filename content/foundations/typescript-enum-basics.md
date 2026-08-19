---
name: enumの基礎
category: プログラミング言語
subcategory: TypeScript
summary: 名前付きの定数集合を表現する機能。ユニオン型のリテラル型との使い分けが論点になりやすい。
---

## 概要

`enum`は、関連する定数の集合に名前を付けてグループ化する機能。数値enumと文字列enumがあり、`MasteryBadge.Done`のようにドット記法でアクセスできる。一方で近年のTypeScriptコミュニティでは、同じ目的をユニオン型のリテラル型(`"done" | "review" | ...`)で表現することも多い。

## 基礎文法

```typescript
enum MasteryBadgeEnum {
  Done = "done",
  Review = "review",
  Next = "next",
  Advanced = "advanced",
}

const badge: MasteryBadgeEnum = MasteryBadgeEnum.Done;

// ユニオン型のリテラル型による同等の表現
type MasteryBadgeUnion = "done" | "review" | "next" | "advanced";
const badge2: MasteryBadgeUnion = "done";
```

## つまずきやすい点

- 数値enum(値を指定しない`enum Status { Idle, Active }`のような書き方)は、コンパイル後のJavaScriptで双方向のマッピングオブジェクトが生成され、意図せずバンドルサイズが増えることがある
- `enum`は実行時に実体を持つ独自の構文であり、他のTypeScriptの型システムの機能(タグ付きユニオン等)とは異なる扱いになる。特に`const enum`はコンパイル時にインライン展開されるため挙動が変わり、ビルドツールによっては非対応のこともある
- ユニオン型のリテラル型は追加のランタイムコードを生成せず、既存のオブジェクト(`MASTERY_BADGE_META`のような`Record`)のキーとしてもそのまま使いやすい。本図鑑の`MasteryBadge`型もこの理由でenumではなくユニオン型を採用している

## 実装例(コード)

```typescript
// 本図鑑での実際の採用例(src/lib/mastery-badge.ts)
export type MasteryBadge = "done" | "review" | "next" | "advanced";
export const MASTERY_BADGE_META: Record<
  MasteryBadge,
  { emoji: string; label: string }
> = {
  done: { emoji: "🟢", label: "習得済み" },
  // ...
};
```
