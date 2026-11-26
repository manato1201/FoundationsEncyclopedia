---
name: ロードバランシングの基礎
category: IT知識
subcategory: ネットワーク
masteryBadge: next
summary: 複数のサーバーにリクエストを分散させ、単一障害点を避けながら処理能力を積み増す仕組み。
operationSteps:
  - label: リクエストがロードバランサーに届く
  - label: アルゴリズムに従い振り分け先を決める
    note: ラウンドロビン・最少接続数・IPハッシュ等
  - label: ヘルスチェックで正常なサーバーだけを対象にする
    note: 故障したサーバーには振り分けない
  - label: 選ばれたサーバーへ転送する
visual:
  kind: graph
  question: "届いたリクエストを、どのサーバーへ回す?"
  directed: true
  legend:
    - { key: "req", label: "リクエスト", tone: "blue", mark: "R" }
    - { key: "lb", label: "振り分け役", tone: "violet", mark: "振" }
    - { key: "ok", label: "正常", tone: "green", mark: "○" }
    - { key: "down", label: "応答なし(外す)", tone: "pink", mark: "×" }
    - { key: "fwd", label: "転送", tone: "cyan", mark: "→" }
  nodes:
    - { id: "r1", label: "要求1", x: 4, y: 5 }
    - { id: "r2", label: "要求2", x: 4, y: 50 }
    - { id: "r3", label: "要求3", x: 4, y: 95 }
    - { id: "lb", label: "LB", x: 46, y: 50 }
    - { id: "s1", label: "S1", x: 92, y: 5 }
    - { id: "s2", label: "S2", x: 92, y: 50 }
    - { id: "s3", label: "S3", x: 92, y: 95 }
  edges:
    - { from: r1, to: lb }
    - { from: r2, to: lb }
    - { from: r3, to: lb }
    - { from: lb, to: s1 }
    - { from: lb, to: s2 }
    - { from: lb, to: s3 }
  steps:
    - short: "受付"
      nodes: { r1: "req", r2: "req", r3: "req", lb: "lb" }
      edges: { "r1>lb": "req", "r2>lb": "req", "r3>lb": "req" }
      focus: ["lb"]
      verdict: "利用者は、ロードバランサーという 1 つの宛先へ送るだけ"
    - short: "方式"
      notes: { s1: "1 番目", s2: "2 番目", s3: "3 番目" }
      focus: ["s1", "s2", "s3"]
      verdict: "ラウンドロビンなら、届いた順に S1 → S2 → S3 と回す"
    - short: "ヘルスチェック"
      nodes: { s1: "ok", s2: "ok", s3: "down" }
      edges: { "lb>s3": "down" }
      notes: { s3: "外す" }
      focus: ["s3"]
      verdict: "△ S3 が応答しない → 振り分け先から外す"
    - short: "転送"
      edges: { "lb>s1": "fwd", "lb>s2": "fwd" }
      notes: { s1: "要求1・3", s2: "要求2" }
      focus: ["s1", "s2"]
      verdict: "○ 正常な S1・S2 が交互に受け持つ。1 台止まってもサービスは続く"
  summary: "ロードバランサーは、届いたリクエストを決めた方式で、ヘルスチェックに通ったサーバーだけへ配る。ロードバランサー自体の冗長化も別に要る。"
---

## 概要

ロードバランシング(負荷分散)は、1台のサーバーでは処理しきれないトラフィックを、複数のサーバーに振り分けて処理する仕組み。ロードバランサーと呼ばれる中継役が、あらかじめ決められたアルゴリズムに従ってリクエストの送り先を決定する。

## 基礎文法

代表的な振り分けアルゴリズム:

- **ラウンドロビン**: サーバーへ順番に均等に振り分ける、最も単純な方式
- **最少接続数**: 現在処理中の接続数が最も少ないサーバーへ振り分ける
- **IPハッシュ**: 送信元IPアドレスに基づいて振り分け先を決める(同じユーザーは同じサーバーへ)

## つまずきやすい点

- サーバー側でセッション情報(ログイン状態等)をメモリ上に保持していると、同じユーザーが毎回異なるサーバーに振り分けられた場合にログイン状態が引き継がれない問題が起きる。セッションを外部ストア(Redis等)に集約するか、IPハッシュのような「同じユーザーは同じサーバーへ」という方式を選ぶ必要がある
- ロードバランサー自体が単一障害点にならないよう、ロードバランサー自体を冗長化する構成(複数台+フェイルオーバー)も実務では重要になる
- 「ヘルスチェック」(各サーバーが正常に応答するかの定期確認)を設定していないと、故障したサーバーにもリクエストが振り分け続けられ、一部のリクエストが失敗し続けることになる

## 実装例(コード)

```nginx
# nginxでの簡単なロードバランシング設定例
upstream backend {
    server 10.0.0.1;
    server 10.0.0.2;
    server 10.0.0.3;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```
