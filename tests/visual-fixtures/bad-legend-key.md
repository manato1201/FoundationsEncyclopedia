---
name: "検証用: 未定義の凡例キー"
category: IT知識
subcategory: "データ構造・計算量"
summary: "凡例にないキーでマスを塗っている。verify-visuals がエラーにすること。"
expectErrors:
  - "凡例にないキー"
operationSteps:
  - label: "1 行目を埋める"
  - label: "2 行目を埋める"
visual:
  kind: grid
  question: "凡例のキーが壊れている例"
  legend: [{ key: filled, label: "埋まった" }]
  rows: ["0", "1"]
  cols: ["0", "1"]
  steps:
    - { cells: { "0,0": filled, "0,1": filled } }
    - { cells: { "1,0": hot, "1,1": filled } }
---

検証用のフィクスチャ(章ではない)。
