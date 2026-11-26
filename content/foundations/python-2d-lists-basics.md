---
name: 二次元リスト(配列)の基礎
category: プログラミング言語
subcategory: Python
masteryBadge: next
summary: Pythonの二次元配列は「リストのリスト」で表現する。作り方次第で行同士が意図せず共有されてしまう罠がある。
operationSteps:
  - label: "リストのリストで作る"
    note: "[[0, 0, 0], [0, 0, 0]] のように、リストを入れ子にする"
  - label: "内包表記で作る"
    note: "[[0] * 3 for _ in range(2)] で、行ごとに別のリストを作る"
  - label: "乗算での作成に注意する"
    note: "[[0] * 3] * 2 は、同じ行を複数参照してしまう"
  - label: "grid[i][j]でアクセスする"
    note: "i行j列の要素を読み書きする"
  - label: "二重ループで全体をたどる"
    note: "外側が行、内側が列を回る"
visual:
  kind: grid
  question: "grid[i][j] はどのマス? 行を * で複製すると何が起きる?"
  legend:
    - { key: "own", label: "行ごとに別のリスト", tone: "blue", mark: "別" }
    - { key: "shared", label: "同じ行を共有", tone: "pink", mark: "共" }
    - { key: "set", label: "書き込んだ", tone: "green", mark: "書" }
    - { key: "read", label: "たどった", tone: "amber", mark: "読" }
  rows: ["0", "1"]
  cols: ["0", "1", "2"]
  rowLabel: "行 i"
  colLabel: "列 j"
  steps:
    - short: "入れ子"
      cells: { "0,0": "own", "0,1": "own", "0,2": "own", "1,0": "own", "1,1": "own", "1,2": "own" }
      values: { "0,0": "0", "0,1": "0", "0,2": "0", "1,0": "0", "1,1": "0", "1,2": "0" }
      verdict: "外側のリストに、行のリストが 2 つ入る"
    - short: "内包表記"
      clear: true
      cells: { "0,0": "set", "0,1": "own", "0,2": "own", "1,0": "own", "1,1": "own", "1,2": "own" }
      values: { "0,0": "1", "0,1": "0", "0,2": "0", "1,0": "0", "1,1": "0", "1,2": "0" }
      focus: ["0,0"]
      verdict: "○ grid[0][0] = 1 で変わるのは行 0 だけ"
    - short: "* の罠"
      clear: true
      cells: { "0,0": "shared", "0,1": "shared", "0,2": "shared", "1,0": "shared", "1,1": "shared", "1,2": "shared" }
      values: { "0,0": "1", "0,1": "0", "0,2": "0", "1,0": "1", "1,1": "0", "1,2": "0" }
      focus: ["0,0", "1,0"]
      verdict: "× 同じ書き込みで行 1 も変わる。2 つの行が同じリストを指している"
    - short: "grid[i][j]"
      clear: true
      cells: { "0,0": "own", "0,1": "own", "0,2": "own", "1,0": "own", "1,1": "own", "1,2": "set" }
      values: { "0,0": "0", "0,1": "0", "0,2": "0", "1,0": "0", "1,1": "0", "1,2": "5" }
      focus: ["1,2"]
      verdict: "grid[1][2] = 5 → 行 1・列 2 のマスだけが変わる"
    - short: "二重ループ"
      cells: { "0,0": "read", "0,1": "read", "0,2": "read", "1,0": "read", "1,1": "read", "1,2": "read" }
      values: { "0,0": "①", "0,1": "②", "0,2": "③", "1,0": "④", "1,1": "⑤", "1,2": "⑥" }
      focus: ["1,2"]
      verdict: "外側のループが行、内側が列。数字はたどる順(①→⑥)"
  summary: "行は grid[i]、マスは grid[i][j]。行ごとに別のリストを作るのは内包表記で、[[0] * 3] * 2 は同じ行を共有してしまう。"
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
