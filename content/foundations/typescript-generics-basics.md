---
name: ジェネリクスの基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: advanced
summary: 型を引数として受け取ることで、型安全性を保ったまま再利用可能な関数・型を書くための機能。
---

## 概要

ジェネリクスは、関数やインターフェースが扱う型を呼び出し側で指定できるようにする機能。`any`で型検査を諦めることなく、複数の型に対応する共通ロジックを1つの定義で表現できる。`createContentLoader<T>`のような、コンテンツ種別に依存しない共通処理の型付けにも使われる。

## 基礎文法

```typescript
function firstElement<T>(list: T[]): T | undefined {
  return list[0];
}

const firstNumber = firstElement([1, 2, 3]); // number | undefined
const firstName = firstElement(["Alice", "Bob"]); // string | undefined
```

- `<T>` は型パラメータで、呼び出し時に実際の型に置き換わる
- `T extends 制約` で「Tはこの形を満たす型に限る」という制約をかけられる
- インターフェースやクラスにもジェネリクスは適用できる(`interface Box<T> { value: T }`)

## つまずきやすい点

- 型パラメータを増やしすぎると、呼び出し側で型推論が効かなくなり明示的な型引数の指定を強いられることがある
- `T extends ContentFrontmatterBase` のような制約を忘れると、ジェネリック関数の内部でプロパティに安全にアクセスできない
- ジェネリクスは実行時には消える(型消去)。実行時の型分岐が必要な場合は別途タグ付きユニオンなどの手段が必要

## 実装例(コード)

```typescript
interface ContentFrontmatterBase {
  name: string;
  category: string;
}

function getName<T extends ContentFrontmatterBase>(item: T): string {
  return item.name;
}
```
