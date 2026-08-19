---
name: 型の絞り込み(Type Narrowing)
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: 条件分岐の中でユニオン型をより具体的な型に絞り込んでいく、TypeScriptの型推論の仕組み。
---

## 概要

型の絞り込み(narrowing)は、`if`文や`typeof`チェックなどの条件分岐を通じて、TypeScriptコンパイラが変数の型をより狭く(具体的に)推論していく仕組み。ユニオン型(`string | number`のような複数の型の組み合わせ)を安全に扱う上で中心的な役割を果たす。

## 基礎文法

```typescript
function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase(); // ここではidはstringに絞り込まれている
  }
  return id.toFixed(0); // ここではidはnumberに絞り込まれている
}
```

- `typeof`: プリミティブ型の絞り込み
- `instanceof`: クラスインスタンスの絞り込み
- `in`演算子: オブジェクトが特定のプロパティを持つかどうかでの絞り込み
- カスタム型ガード(`is`を使った戻り値型)で独自の絞り込みロジックも定義できる

## つまずきやすい点

- 絞り込みはあくまで静的解析であり、実行時の値を保証するものではない。`as`によるキャストで型を偽ると、実際には合致しない値が紛れ込んでいても検出できなくなる
- 分割代入(destructuring)した変数は元の絞り込み情報を引き継がないことがある。`const { value } = obj;`のように取り出した後は、改めて`value`自体の型ガードが必要になる場合がある
- 配列やオブジェクトのプロパティに対する絞り込みは、その後にコールバック関数の中で使われると失われることがある(TypeScriptがコールバック実行前に値が変わらない保証を持てないため)

## 実装例(コード)

```typescript
function isFoundationsFrontmatter(
  value: unknown,
): value is FoundationsFrontmatter {
  return typeof value === "object" && value !== null && "name" in value;
}

function process(data: unknown) {
  if (isFoundationsFrontmatter(data)) {
    console.log(data.name); // dataはFoundationsFrontmatterに絞り込まれている
  }
}
```
