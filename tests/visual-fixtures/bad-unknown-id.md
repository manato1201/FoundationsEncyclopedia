---
name: "検証用: 未定義の id"
category: IT知識
subcategory: "ネットワーク"
summary: "存在しない登場者・メッセージを参照している。verify-visuals がエラーにすること。"
expectErrors:
  - "未定義の actor"
  - "未定義の message"
operationSteps:
  - label: "送る"
  - label: "返す"
visual:
  kind: sequence
  question: "id の参照が壊れている例"
  actors: [{ id: client, label: "クライアント" }, { id: server, label: "サーバー" }]
  messages:
    - { id: hello, from: client, to: proxy, label: "こんにちは" }
  steps:
    - { send: [hello] }
    - { send: [bye] }
---

検証用のフィクスチャ(章ではない)。
