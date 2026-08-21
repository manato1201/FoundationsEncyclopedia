---
name: 二次元配列の基礎
category: プログラミング言語
subcategory: Java
masteryBadge: next
summary: Javaの二次元配列は「配列の配列」として実装されており、C#の多次元配列(int[,])とは内部構造が異なる。
---

## 概要

Javaの二次元配列(`int[][]`)は、[C#の二次元配列の基礎](/foundations/csharp-2d-arrays-basics)にある`int[,]`(真の多次元配列)とは異なり、実際には「配列の配列」として実装されている。これはC#の`int[][]`(ジャグ配列)に相当し、Javaには真の多次元配列という選択肢自体が存在しない。

## 基礎文法

```java
int[][] grid = new int[3][4]; // 3行4列(全行同じ長さで初期化される)
grid[0][0] = 1;
grid[2][3] = 99;

// 行ごとに異なる長さにすることもできる(ジャグ配列)
int[][] jagged = new int[3][];
jagged[0] = new int[]{1, 2};
jagged[1] = new int[]{1, 2, 3, 4};
jagged[2] = new int[]{1};
```

## つまずきやすい点

- `new int[3][4]`という書き方は一見C#の多次元配列と同じ見た目だが、Javaの内部実装は「3個の要素を持つ配列、その各要素がさらに4個の要素を持つ配列」という入れ子構造。C#の[真の多次元配列(int[,])](/foundations/csharp-2d-arrays-basics)のような単一の連続したメモリブロックではないため、[キャッシュ効率](/foundations/cpu-memory-basics)の面で不利になることがある
- 二次元配列の各要素(内側の配列)の長さは、`grid[0].length`のように「行ごとに」確認する必要がある。ジャグ配列の性質上、行によって長さが異なりうるため、`grid.length`(行数)と`grid[i].length`(i行目の列数)を混同しないよう注意が必要
- `new int[3][4]`のように両方のサイズを指定して初期化した場合でも、内部的には「配列の配列」であることに変わりはなく、後から特定の行だけを別の長さの配列に差し替えることも技術的には可能

## 実装例(コード)

```java
// 二次元配列の全走査(行ごとに長さが異なりうることを考慮する)
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        System.out.println(grid[row][col]);
    }
}
```
