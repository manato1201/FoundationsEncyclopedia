---
name: 配列の基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: TypeScriptの配列は可変長で、要素の型を型注釈で固定できる。JavaScriptの緩さに型の安全性を追加している。
---

## 概要

TypeScript(JavaScript)の配列はC#の`List<T>`に近い可変長のコレクション。JavaScriptの配列自体は要素の型を問わず何でも格納できる緩い仕様だが、TypeScriptでは型注釈(`number[]`のような形)によって、要素の型を静的にチェックできるようになる。

## 基礎文法

```typescript
const scores: number[] = [90, 80, 70]; // number[] または Array<number> と書ける
scores.push(60); // 末尾に追加(可変長)
scores[0] = 100; // インデックスは0始まり
const first = scores[0];

const mixed: (number | string)[] = [1, "two", 3]; // ユニオン型で複数の型を許容

const length = scores.length;
const sliced = scores.slice(1, 3); // 元の配列を変更せず、部分配列のコピーを返す
```

## つまずきやすい点

- `push`/`pop`/`splice`のようなメソッドは元の配列を直接変更する(破壊的)。一方`slice`/`map`/`filter`のようなメソッドは新しい配列を返し、元の配列を変更しない(非破壊的)。この区別を誤ると、意図せず元のデータを書き換えてしまうことがある
- 配列の要素にアクセスする際、範囲外のインデックスを指定してもC#のような例外は発生せず、`undefined`が返るだけになる。この「エラーにならずに黙って`undefined`が返る」挙動は、バグの発見を遅らせる原因になりやすい(TypeScriptの`noUncheckedIndexedAccess`オプションで緩和できる)
- TypeScriptの`readonly number[]`型は、配列の中身が本当に不変であることをコンパイル時に保証するが、実行時に別の場所から同じ配列への参照が`readonly`でない型でアクセスされると変更されてしまうことがある。完全な不変性を保証するものではない点に注意

## 実装例(コード)

```typescript
// 非破壊的なメソッドを使ってフィルタ・変換する典型パターン
const scores = [90, 80, 70, 60];
const passingDoubled = scores.filter((s) => s >= 70).map((s) => s * 2);
// scores自体は変更されない: [90, 80, 70, 60]
```
