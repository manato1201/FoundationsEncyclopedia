---
name: 二次元配列の基礎
category: プログラミング言語
subcategory: TypeScript
masteryBadge: next
summary: TypeScriptの二次元配列は「配列の配列」として表現する。行ごとに独立した配列を作る必要がある。
---

## 概要

TypeScriptには専用の多次元配列構文はなく、[配列の基礎](/foundations/typescript-arrays-basics)を入れ子にした「配列の配列」(`number[][]`)で2次元的なデータを表現する。[Pythonの二次元リストの基礎](/foundations/python-2d-lists-basics)と同様、行ごとに独立した配列を作らないと、参照が共有されてしまう罠がある。

## 基礎文法

```typescript
const grid: number[][] = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
grid[0][0] = 1;
grid[2][2] = 9;

// 正しい初期化方法: 行ごとに新しい配列を作る
const rows = 3,
  cols = 4;
const correctGrid: number[][] = Array.from({ length: rows }, () =>
  Array(cols).fill(0),
);
```

## つまずきやすい点

- `Array(rows).fill(Array(cols).fill(0))`のような書き方は、全ての行が同じ配列オブジェクトへの参照を共有してしまい、1つの行を変更すると全ての行が変わってしまう。[Pythonの二次元リスト](/foundations/python-2d-lists-basics)の`[[0] * cols] * rows`と全く同じ性質の罠であり、行ごとに新しい配列を生成する`Array.from`のようなパターンで回避する必要がある
- `number[][]`という型注釈は「全ての行が同じ長さの配列である」ことまでは保証しない。行ごとに異なる長さの配列(ジャグ配列に相当)を許容してしまうため、意図しない長さの行が紛れ込んでも型チェックでは検出できない
- 二次元配列を`JSON.stringify`でシリアライズしたりコピーしたりする際、浅いコピー(`[...grid]`)では内側の行の配列は共有されたままになる。深いコピーが必要な場合は、行ごとに明示的にコピーする必要がある

## 実装例(コード)

```typescript
// 浅いコピーと深いコピーの違い
const shallowCopy = [...grid]; // 外側の配列だけコピー、内側の行は共有される
const deepCopy = grid.map((row) => [...row]); // 行ごとに新しい配列を作る、完全なコピー
```
