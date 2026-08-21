---
name: 二次元リスト(配列)の基礎
category: プログラミング言語
subcategory: Python
masteryBadge: next
summary: Pythonの二次元配列は「リストのリスト」で表現する。作り方次第で行同士が意図せず共有されてしまう罠がある。
---

## 概要

Pythonで2次元的なデータ(グリッド等)を表現する場合、[リスト(配列に相当)の基礎](/foundations/python-lists-basics)を入れ子にした「リストのリスト」が使われる。[C#の二次元配列の基礎](/foundations/csharp-2d-arrays-basics)のような専用の多次元配列構文は標準にはなく、リストの入れ子で代用する。

## 基礎文法

```python
grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]  # 3x3のグリッド
grid[0][0] = 1
grid[2][2] = 9

rows, cols = 3, 4
correct_grid = [[0 for _ in range(cols)] for _ in range(rows)]  # 正しい作り方
```

## つまずきやすい点

- `[[0] * cols] * rows`のような書き方で二次元リストを作ると、全ての行が「同じリストオブジェクトへの参照」を共有してしまい、1つの行を変更すると他の全ての行も変更されてしまう罠がある。正しくはリスト内包表記(`[[0] * cols for _ in range(rows)]`)で、行ごとに新しいリストを作る必要がある
- この罠は、Pythonの変数が「値」ではなく「オブジェクトへの参照」を持つという性質([変数宣言と型の基礎](/foundations/python-variables-and-types-basics)で触れたミュータブルなオブジェクトの共有)に起因している。`*`によるリストの複製は、中身のオブジェクト自体はコピーせず参照だけを複製する(浅いコピー)ため発生する
- 大規模なグリッドを扱う場合、リストのリストは[C++のstd::vector<std::vector<int>>](/foundations/cpp-2d-arrays-basics)と同様にメモリ上で連続していないため、キャッシュ効率が良くない。パフォーマンスが重要な場面ではnumpyの多次元配列を使う選択肢もある

## 実装例(コード)

```python
# 罠の実演: 参照共有バグ
wrong_grid = [[0] * 3] * 3
wrong_grid[0][0] = 1
print(wrong_grid)  # [[1, 0, 0], [1, 0, 0], [1, 0, 0]] (全行が変わってしまう)
```
