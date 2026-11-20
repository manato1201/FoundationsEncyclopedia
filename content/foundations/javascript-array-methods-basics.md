---
name: "配列メソッド(map・filter・reduce)の基礎"
category: プログラミング言語
subcategory: "JavaScript"
summary: "配列を1要素ずつ変換する map、条件で絞る filter、1つの値にまとめる reduce。元の配列は変えずに新しい結果を返す。"
claim: "map は変換、filter は絞り込み、reduce は集約。どれも元の配列を書き換えない。"
operationSteps:
  - label: "元の配列を用意する"
    note: "`const prices = [120, 80, 300, 50];` のような配列から始める"
  - label: "filterで絞り込む"
    note: "`prices.filter(p => p >= 100)` は、真を返した要素だけの新しい配列を作る"
  - label: "mapで各要素を変換する"
    note: "`.map(p => p * 1.1)` は、全要素に同じ変換をかけた、同じ長さの新しい配列を作る"
  - label: "reduceで1つの値にまとめる"
    note: "`.reduce((sum, p) => sum + p, 0)` は、累積値と各要素を順に渡して、最後の累積値を返す"
  - label: "つなげて読む"
    note: "メソッドは `.` でつなげられる。上から下へ、データが流れる順に読める"
quiz:
  - question: "reduce の第2引数(初期値)を省略して空の配列に使うとどうなるか"
    choices:
      - "undefined が返る"
      - "TypeError になる"
      - "0 が返る"
    answer: 1
    explanation: "初期値がないと、最初の要素を初期値として使う。要素がない空の配列では、使える値がなく、エラーになる。"
---

## 概要

JavaScriptの配列には、`for`文を書かずにデータを加工できるメソッドが揃っている。中心になるのが`map`・`filter`・`reduce`の3つ。いずれも**元の配列を書き換えず、新しい値を返す**ので、途中のデータが意図せず変わる心配が少ない。

## 基礎文法

| メソッド | コールバックが返すもの | 結果 |
| --- | --- | --- |
| map | 変換後の値 | 同じ長さの新しい配列 |
| filter | 真か偽 | 真だった要素だけの新しい配列 |
| reduce | 次の累積値 | 最後の累積値(配列とは限らない) |

- コールバックには、要素のほかに添字(第2引数)と配列自身(第3引数)も渡される
- `forEach`は戻り値を使わず、副作用(表示など)のためだけに回す

## つまずきやすい点

- `map`で結果を使わず、表示のためだけに呼ぶのは避ける。その場合は`forEach`か`for...of`を使う
- `reduce`の初期値を省略すると、最初の要素が初期値になり、2番目の要素から処理が始まる。空の配列では TypeError になるので、基本は初期値を書く
- `sort`は`map`や`filter`と違い、元の配列を並べ替えてしまう。元を残したいときは、`[...arr].sort()`のようにコピーしてから使う
- `parseInt`を`map`にそのまま渡す(`["1","2","3"].map(parseInt)`)と、添字が第2引数(基数)として渡されて結果が崩れる

## 実装例(コード)

```javascript
const prices = [120, 80, 300, 50];

const total = prices
  .filter((p) => p >= 100) // [120, 300]
  .map((p) => Math.round(p * 1.1)) // [132, 330]
  .reduce((sum, p) => sum + p, 0); // 462

console.log(total); // 462
console.log(prices); // [120, 80, 300, 50](元は変わらない)

console.log(["1", "2", "3"].map(parseInt)); // [1, NaN, NaN]
console.log(["1", "2", "3"].map((s) => Number(s))); // [1, 2, 3]
```
