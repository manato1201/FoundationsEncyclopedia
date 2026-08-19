---
name: interfaceとtypeの違い
category: プログラミング言語
subcategory: TypeScript
summary: オブジェクトの形を定義する2つの方法。多くの場合置き換え可能だが、いくつかの機能差がある。
---

## 概要

TypeScriptでオブジェクトの形を定義する方法には`interface`と`type`(型エイリアス)の2種類がある。単純なオブジェクト型の定義では見た目も挙動もほぼ同じだが、細かい機能差がいくつか存在する。

## 基礎文法

```typescript
interface FoundationsFrontmatterI {
  name: string;
  category: string;
}

type FoundationsFrontmatterT = {
  name: string;
  category: string;
};

// interfaceは同名の再宣言でマージされる(宣言のマージ)
interface FoundationsFrontmatterI {
  summary: string; // 上のinterfaceに追加される
}
```

- `interface`は同名で複数回宣言すると自動的にマージされる
- `type`はユニオン型(`"a" | "b"`)やプリミティブ型のエイリアスなど、`interface`では表現できない形も定義できる

## つまずきやすい点

- `type`はユニオン型・タプル型・条件型など柔軟な表現ができる一方、`interface`は宣言のマージができるため「後からプロパティを拡張する」設計(ライブラリの型定義を利用側が拡張する等)に向く。どちらが優れているというより用途が異なる
- クラスが実装すべき「契約」を表す場合は`interface`が伝統的に使われてきたが、`type`でも`implements`できるため、この点だけでは決定打にならない
- プロジェクト内で`interface`と`type`が無秩序に混在すると、レビュー時の一貫性チェックのコストが上がる。多くのスタイルガイド(Next.js公式サンプル含む)は「オブジェクトの形はinterface、それ以外(ユニオン等)はtype」のように使い分けを決めている

## 実装例(コード)

```typescript
// ユニオン型はtypeでしか書けない
type MasteryBadge = "done" | "review" | "next" | "advanced";

// オブジェクトの形はinterfaceでもtypeでも書ける
interface ContentFrontmatterBase {
  name: string;
  category: string;
  subcategory: string;
  summary: string;
}
```
