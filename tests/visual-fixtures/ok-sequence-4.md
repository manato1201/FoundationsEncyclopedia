---
name: "検証用: sequence(登場者 4)"
category: IT知識
subcategory: "Webの基礎"
summary: "登場者 4 の sequence が 390px でつぶれないかの確認用。エラー 0 件であること。"
expectErrors: []
operationSteps:
  - label: "ブラウザが名前を問い合わせる"
  - label: "リゾルバが権威サーバーへたずねる"
  - label: "IP アドレスが返る"
  - label: "ブラウザがサーバーへ接続する"
visual:
  kind: sequence
  question: "名前から IP アドレスを引くのは誰?"
  legend:
    - { key: ask, label: "問い合わせ", tone: blue }
    - { key: answer, label: "答え", tone: green }
    - { key: cached, label: "覚えている", tone: amber }
  actors:
    - { id: browser, label: "ブラウザ" }
    - { id: resolver, label: "リゾルバ" }
    - { id: auth, label: "権威サーバー" }
    - { id: web, label: "Web サーバー" }
  messages:
    - { id: q1, from: browser, to: resolver, label: "example.com は?", key: ask }
    - { id: q2, from: resolver, to: auth, label: "example.com は?", key: ask }
    - { id: a2, from: auth, to: resolver, label: "203.0.113.5", key: answer }
    - { id: a1, from: resolver, to: browser, label: "203.0.113.5", key: answer }
    - { id: http, from: browser, to: web, label: "GET /", key: ask }
  steps:
    - send: [q1]
    - send: [q2]
    - send: [a2, a1]
      state: { resolver: cached }
      verdict: "リゾルバは答えをしばらく覚える"
    - send: [http]
      verdict: "○ 以後は IP アドレスで直接つながる"
---

検証用のフィクスチャ(章ではない)。開発時だけ `/dev/visuals` で表示する。
