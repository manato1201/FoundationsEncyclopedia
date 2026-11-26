---
name: "検証用: 段の数の不一致"
category: IT知識
subcategory: "バージョン管理"
summary: "visual.steps が operationSteps より少ない。verify-visuals がエラーにすること。"
expectErrors:
  - "steps の数"
operationSteps:
  - label: "1 つ目"
  - label: "2 つ目"
  - label: "3 つ目"
visual:
  kind: zones
  question: "段の数が合わない例"
  legend: [{ key: edited, label: "編集済み" }]
  zones: [{ id: work, label: "作業ツリー" }, { id: repo, label: "リポジトリ" }]
  items: [{ id: a, label: "a.txt" }]
  steps:
    - { place: { a: work }, state: { a: edited } }
    - { place: { a: repo } }
---

検証用のフィクスチャ(章ではない)。
