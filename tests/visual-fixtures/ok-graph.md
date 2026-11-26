---
name: "検証用: graph(幅優先探索)"
category: IT知識
subcategory: "データ構造・計算量"
summary: "graph 型の動作確認用。エラー 0 件であること。"
expectErrors: []
operationSteps:
  - label: "出発点 A をキューに入れる"
  - label: "A の隣(B・C)を訪問する"
    note: "距離 1 のノードを先に全部見る"
  - label: "B・C の隣(D・E)を訪問する"
    note: "距離 2 のノード"
  - label: "最後に F へ届く"
    note: "A から F までの最短の道がわかる"
visual:
  kind: graph
  question: "幅優先探索は、どの順にノードを訪ねる?"
  legend:
    - { key: queued, label: "キューの中", tone: amber }
    - { key: visited, label: "訪問済み", tone: green }
    - { key: path, label: "最短の道", tone: blue }
  nodes:
    - { id: A, label: "A", x: 10, y: 50 }
    - { id: B, label: "B", x: 35, y: 20 }
    - { id: C, label: "C", x: 35, y: 80 }
    - { id: D, label: "D", x: 62, y: 20 }
    - { id: E, label: "E", x: 62, y: 80 }
    - { id: F, label: "F", x: 90, y: 50 }
  edges:
    - { from: A, to: B }
    - { from: A, to: C }
    - { from: B, to: D }
    - { from: C, to: E }
    - { from: D, to: F }
    - { from: E, to: F }
    - { from: B, to: C }
  steps:
    - nodes: { A: queued }
      notes: { A: "距離 0" }
      focus: [A]
    - nodes: { A: visited, B: queued, C: queued }
      notes: { B: "1", C: "1" }
      edges: { "A>B": visited, "A>C": visited }
      focus: [B, C]
      verdict: "近い順に、横へ広がる"
    - nodes: { B: visited, C: visited, D: queued, E: queued }
      notes: { D: "2", E: "2" }
      edges: { "B>D": visited, "C>E": visited }
      focus: [D, E]
    - nodes: { D: visited, E: visited, F: visited }
      notes: { F: "3" }
      edges: { "A>B": path, "B>D": path, "D>F": path }
      focus: [F]
      verdict: "○ 辺の数が最少の道が見つかる"
---

検証用のフィクスチャ(章ではない)。開発時だけ `/dev/visuals` で表示する。
