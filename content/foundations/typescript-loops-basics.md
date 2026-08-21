---
name: for/whileループの基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: done
summary: JavaScript由来のfor/while/do-whileに加え、for...ofとfor...inという2種類の反復専用構文を持つ。
---

## 概要

TypeScript(JavaScript)は、C系言語と同じ`for`・`while`・`do-while`に加え、コレクションを反復するための`for...of`(値を反復)と`for...in`(キー/インデックスを反復)という2つの専用構文を持つ。似た名前だが挙動が大きく異なり、初学者が混同しやすい代表例。

## 基礎文法

```typescript
// for: 伝統的な形式
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while
let hp = 100;
while (hp > 0) {
  hp -= 10;
}

// for...of: 配列やイテラブルの「値」を順に取り出す
const scores = [90, 80, 70];
for (const score of scores) {
  console.log(score);
}

// for...in: オブジェクトの「キー」を順に取り出す(配列ではインデックスが文字列で返る)
const player = { name: "Alice", hp: 100 };
for (const key in player) {
  console.log(key, player[key as keyof typeof player]);
}
```

## つまずきやすい点

- `for...of`と`for...in`の使い分けを誤ると、意図しない結果になる。配列に`for...in`を使うと、インデックスが文字列型として返り、かつ配列に独自に追加したプロパティまで列挙されてしまうことがある。配列の値を反復したい場合は`for...of`を使うのが基本
- `for`文のループ変数を`var`で宣言すると、[クロージャの基礎](/foundations/javascript-closures-basics)で触れた「全てのコールバックが同じ変数を共有する」問題が起きる。`let`を使えばループの各回で新しいスコープが作られ、この問題を回避できる
- `for...of`は`Symbol.iterator`を実装したオブジェクト(配列、Map、Set等)にしか使えない。プレーンなオブジェクト(`{}`)には直接使えず、`Object.entries()`等で変換する必要がある

## 実装例(コード)

```typescript
// Mapやentriesと組み合わせたfor...ofの例
const scoreMap = new Map([
  ["Alice", 90],
  ["Bob", 80],
]);
for (const [name, score] of scoreMap) {
  console.log(`${name}: ${score}`);
}
```
