---
name: 二次元配列・二次元スライスの基礎
category: プログラミング言語
subcategory: Go
masteryBadge: next
summary: Goには固定長の二次元配列と、可変長のスライスを入れ子にした二次元スライスの2つの表現がある。
---

## 概要

Goで2次元的なデータを扱う方法には、固定サイズの`[3][4]int`(二次元配列)と、[スライスと配列の違い](/foundations/go-slices-vs-arrays)で扱った可変長のスライスを入れ子にした`[][]int`(二次元スライス)の2種類がある。実務では柔軟性の高い二次元スライスが使われることが多い。

## 基礎文法

```go
// 固定サイズの二次元配列
var grid [3][4]int
grid[0][0] = 1

// 二次元スライス: 行ごとに独立したスライスを作る必要がある
rows, cols := 3, 4
dynamicGrid := make([][]int, rows)
for i := range dynamicGrid {
    dynamicGrid[i] = make([]int, cols) // 各行を個別に確保する
}
dynamicGrid[0][0] = 1
```

## つまずきやすい点

- `make([][]int, rows)`だけでは「行のスライス」しか作られておらず、各行自体(内側のスライス)はまだ`nil`の状態。[Pythonの二次元リスト](/foundations/python-2d-lists-basics)や[TypeScriptの二次元配列](/foundations/typescript-2d-arrays-basics)と同様、各行を個別に`make`しないと、`nil`スライスへの書き込みでパニック(実行時エラー)になる
- 二次元配列(`[3][4]int`)は値型として扱われ、関数への引数渡しや代入のたびにコピーされる。二次元スライスは[スライスと配列の違い](/foundations/go-slices-vs-arrays)で触れた通り、内部的にポインタを持つ参照的な性質があり、コピーのコストが小さい。大きなグリッドを扱う場合はこの違いがパフォーマンスに影響する
- 行ごとに`make`で確保した二次元スライスは、各行のメモリが連続していない(バラバラに確保される)ことが多く、[C++のstd::vector<std::vector<int>>](/foundations/cpp-2d-arrays-basics)と同様の理由でキャッシュ効率が良くない

## 実装例(コード)

```go
// 1次元スライスで疑似的な2次元配列を表現する例(キャッシュ効率重視)
flatGrid := make([]int, rows*cols)
row, col := 1, 2
flatGrid[row*cols+col] = 99 // grid[1][2] に相当
```
