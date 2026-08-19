---
name: strictモードとは
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: tsconfig.jsonの1オプションで、型検査の厳格さを一括で引き上げる設定群。
---

## 概要

`tsconfig.json`の`"strict": true`は、複数の厳格な型検査オプション(`noImplicitAny`、`strictNullChecks`等)を一括で有効化するフラグ。新規プロジェクトでは有効にするのが強く推奨されており、本図鑑を含むThe-Algorithm-Illustrated系譜のプロジェクトも全て`strict: true`を採用している。

## 基礎文法

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true`が束ねている主なオプション:

- `noImplicitAny`: 型注釈がなく`any`と推論される箇所をエラーにする
- `strictNullChecks`: `null`/`undefined`を明示的に許可した型以外では代入できなくする
- `strictFunctionTypes`: 関数の引数の型チェックをより厳密にする
- `alwaysStrict`: 出力するJSに`"use strict"`を付与する

## つまずきやすい点

- 既存プロジェクトに後から`strict: true`を導入すると、大量のエラーが一度に噴出することが多い。個別のフラグ(`noImplicitAny`だけ先に有効化する等)を段階的に有効化していく方が現実的な移行パスになる
- `strict: true`はあくまでコンパイル時の型検査を厳しくするだけで、実行時の安全性を保証しない。`as`によるキャストや`any`への型アサーションを多用すると、strictモードでも実質的に型安全性は失われる
- ライブラリ側の型定義(`.d.ts`)が古い・不正確だと、strictモードを有効にした瞬間に大量のエラーが自分のコード側ではなく依存ライブラリの型定義との不整合として現れることがある

## 実装例(コード)

```typescript
// strictNullChecksがない場合はコンパイルが通ってしまうが、strict: trueでは弾かれる
function getLength(value: string | null): number {
  return value.length; // エラー: 'value' is possibly 'null'
}
```
