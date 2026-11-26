---
name: グラフの探索(幅優先と深さ優先)
category: IT知識
subcategory: データ構造・計算量
summary: 幅優先は近いところから順に、深さ優先は行けるところまで深く進んで、グラフを調べる。
claim: "幅優先は近い順に、深さ優先は行き止まりまで進んで調べる。"
operationSteps:
  - label: 出発点を決めて、訪問済みに記録する
    note: 同じ点を何度も調べないよう、訪問済みの点を覚えておく
  - label: 次に調べる点の入れ物を決める
    note: 幅優先はキュー(先に入れた点から調べる)、深さ優先はスタック(最後に入れた点から調べる)
  - label: 入れ物から点を取り出す
    note: 取り出した点が、いま調べる点になる
  - label: つながっている未訪問の点を追加する
    note: 隣り合う点のうち、まだ訪問していないものを、入れ物に追加して訪問済みにする
  - label: 入れ物が空になるまで繰り返す
    note: すべての到達できる点を調べ終わると終了。計算量は、点の数V+辺の数Eに比例する
quiz:
  - question: "幅優先探索で使うデータ構造はどれか"
    choices:
      - "スタック"
      - "キュー"
      - "ハッシュテーブル"
    answer: 1
    explanation: "先に入れた点から順に調べるため、キュー(先入れ先出し)を使う。深さ優先はスタックか再帰を使う。"
visual:
  kind: graph
  question: "同じグラフを、幅優先(左)と深さ優先(右)はどの順に訪ねる?"
  legend:
    - { key: "seen", label: "訪問済み(入れ物の中)", tone: "amber", mark: "□" }
    - { key: "cur", label: "取り出して調べ中", tone: "pink", mark: "▶" }
    - { key: "done", label: "調べ終わった", tone: "green", mark: "✓" }
    - { key: "tree", label: "見つけたときに通った辺", tone: "blue", mark: "—" }
  nodes:
    - { id: "bA", label: "A", x: 0, y: 45 }
    - { id: "bB", label: "B", x: 20, y: 8 }
    - { id: "bC", label: "C", x: 20, y: 85 }
    - { id: "bD", label: "D", x: 42, y: 0 }
    - { id: "bE", label: "E", x: 42, y: 45 }
    - { id: "bF", label: "F", x: 42, y: 92 }
    - { id: "dA", label: "A", x: 56, y: 45 }
    - { id: "dB", label: "B", x: 76, y: 8 }
    - { id: "dC", label: "C", x: 76, y: 85 }
    - { id: "dD", label: "D", x: 98, y: 0 }
    - { id: "dE", label: "E", x: 98, y: 45 }
    - { id: "dF", label: "F", x: 98, y: 92 }
  edges:
    - { from: bA, to: bB }
    - { from: bA, to: bC }
    - { from: bB, to: bD }
    - { from: bB, to: bE }
    - { from: bC, to: bF }
    - { from: bE, to: bF }
    - { from: dA, to: dB }
    - { from: dA, to: dC }
    - { from: dB, to: dD }
    - { from: dB, to: dE }
    - { from: dC, to: dF }
    - { from: dE, to: dF }
  steps:
    - short: "出発"
      nodes: { bA: "seen", dA: "seen" }
      notes: { bA: "BFS ①", dA: "DFS ①" }
      focus: ["bA", "dA"]
      verdict: "どちらも A から。A に訪問済みの印を付けて入れ物へ"
    - short: "入れ物"
      focus: ["bA", "dA"]
      callout: { value: "キュー / スタック", label: "左 BFS / 右 DFS" }
      verdict: "BFS は先に入れた点から、DFS は最後に入れた点から取り出す"
    - short: "取り出す"
      nodes: { bA: "cur", dA: "cur" }
      focus: ["bA", "dA"]
      verdict: "入れ物から A を取り出して調べる"
    - short: "追加"
      nodes: { bA: "done", dA: "done", bB: "seen", bC: "seen", dB: "seen", dC: "seen" }
      edges: { "bA>bB": "tree", "bA>bC": "tree", "dA>dB": "tree", "dA>dC": "tree" }
      focus: ["bB", "bC", "dB", "dC"]
      verdict: "A の隣の B・C を入れ物へ。ここまでは左右とも同じ"
    - short: "繰り返す"
      nodes: { bA: "done", bB: "done", bC: "done", bD: "done", bE: "done", bF: "done", dA: "done", dB: "done", dC: "done", dD: "done", dE: "done", dF: "done" }
      edges: { "bB>bD": "tree", "bB>bE": "tree", "bC>bF": "tree", "dC>dF": "tree", "dE>dF": "tree", "dB>dD": "tree" }
      notes: { bB: "②", bC: "③", bD: "④", bE: "⑤", bF: "⑥", dC: "②", dF: "③", dE: "④", dB: "⑤", dD: "⑥" }
      callout: { value: "O(V+E)", label: "どちらも" }
      verdict: "BFS は近い順 A→B→C→D→E→F。DFS は最後に入れた C から奥へ A→C→F→E、戻って B→D"
  summary:
    columns: ["BFS(幅優先)", "DFS(深さ優先)"]
    rows:
      - { label: "入れ物", cells: ["キュー(先に入れた点から)", "スタック(最後に入れた点から)"] }
      - { label: "この図の順", cells: ["A B C D E F", "A C F E B D"] }
      - { label: "向く用途", cells: ["○ 辺の数が最少の道", "○ 経路の有無・迷路・閉路"] }
    note: "隣は名前の順に入れ物へ追加した場合。追加の順が変わると、訪ねる順も変わる"
---

## 概要

グラフは、点(頂点)と、点をつなぐ線(辺)でできたデータ構造。地図の道路網や、人のつながりを表せる。すべての点をたどる方法に、**幅優先探索(BFS)**と**深さ優先探索(DFS)**がある。

## 基礎文法

| 方法 | 調べる順 | 使う入れ物 | 向く用途 |
| --- | --- | --- | --- |
| 幅優先(BFS) | 出発点に近い点から順に | キュー | 辺の数が最も少ない道のり(最短経路)を求める |
| 深さ優先(DFS) | 行けるところまで深く進み、行き止まりで戻る | スタック(または再帰) | 経路の存在の確認、迷路、閉路の検出 |

どちらも、点の数をV、辺の数をEとして、計算量はO(V+E)。

## つまずきやすい点

- 訪問済みの記録を忘れると、閉路(ぐるっと回る道)で永久に繰り返す
- BFSが最短になるのは、**辺の長さがすべて同じ**(辺の数で数える)場合。長さが違うときは、別のアルゴリズム(ダイクストラ法など)を使う
- DFSを再帰で書くと、グラフが深いときに、スタックが足りなくなる場合がある

## 実装例(コード)

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()      # キューの先頭から取り出す
        order.append(node)
        for next_node in graph[node]:
            if next_node not in visited:
                visited.add(next_node)
                queue.append(next_node)
    return order

print(bfs({"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}, "A"))  # ['A', 'B', 'C', 'D']
```
