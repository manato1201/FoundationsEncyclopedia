---
name: HTTPSとTLSの基礎
category: IT知識
subcategory: ネットワーク
masteryBadge: review
summary: 通信内容を暗号化し、通信相手が本物であることを検証する、HTTPに安全性を追加した仕組み。
operationSteps:
  - label: クライアントが対応可能な暗号方式を提示する
    note: ClientHelloメッセージで、対応するTLSバージョンや暗号スイートの一覧を送る
  - label: サーバーが証明書を提示する
    note: 公開鍵を含む証明書を返し、認証局による署名を含める
  - label: クライアントが証明書を検証し、鍵交換の情報を送る
    note: 信頼できる認証局が発行しているか等を確認してから、共通鍵の元になる情報を暗号化して送信する
  - label: 以降は共通鍵暗号で高速に通信する
    note: 重い公開鍵暗号は鍵交換だけに使い、実際のデータ転送は軽い共通鍵暗号に切り替える
visual:
  kind: sequence
  question: "安全な通信は、どんな順で始まる?"
  legend:
    - { key: hs, label: "ハンドシェイク", tone: blue, mark: "H" }
    - { key: check, label: "検証", tone: amber, mark: "?" }
    - { key: enc, label: "共通鍵で暗号化", tone: green, mark: "E" }
    - { key: shared, label: "共通鍵を持つ", tone: violet, mark: "鍵" }
  actors:
    - { id: client, label: "クライアント", note: "ブラウザ" }
    - { id: server, label: "サーバー", note: "Web サイト" }
  messages:
    - { id: hello, from: client, to: server, label: "ClientHello", note: "使える TLS の版・暗号方式の一覧", key: hs }
    - { id: cert, from: server, to: client, label: "証明書", note: "サーバーの公開鍵+認証局の署名", key: hs }
    - { id: verify, from: client, to: client, label: "証明書を検証", note: "信頼する認証局の署名か・名前が合うか", key: check }
    - { id: keyx, from: client, to: server, label: "鍵の材料", note: "共通鍵の元になる情報を、相手にだけ読める形で送る", key: hs }
    - { id: req, from: client, to: server, label: "リクエスト", note: "中身は暗号化されている", key: enc }
    - { id: res, from: server, to: client, label: "レスポンス", note: "中身は暗号化されている", key: enc }
  steps:
    - short: "Hello"
      send: [hello]
      verdict: "まず、お互いに使える方式を決める"
    - short: "証明書"
      send: [cert]
      verdict: "証明書には、サーバーの公開鍵と認証局の署名が入っている"
    - short: "検証・鍵"
      send: [verify, keyx]
      state: { client: shared, server: shared }
      verdict: "○ 本物と確かめてから鍵の材料を渡す。両者が同じ共通鍵を持つ"
    - short: "暗号化通信"
      send: [req, res]
      verdict: "○ 以降は軽い共通鍵暗号で、中身を読まれずにやりとりする"
  summary: "重い公開鍵暗号は鍵を渡すのにだけ使い、データは軽い共通鍵暗号で送る。証明書の検証で、相手が本物かを確かめる。"
---

## 概要

HTTPSは、HTTP通信をTLS(Transport Layer Security、旧称SSL)で暗号化したもの。通信内容の盗聴・改ざんを防ぐ「暗号化」と、通信相手が偽物でないことを保証する「認証」の2つの役割を持つ。

## 基礎文法

TLSハンドシェイクの大まかな流れ:

1. クライアントがサーバーに接続を要求し、対応する暗号方式の一覧を提示する
2. サーバーが証明書(公開鍵を含む)を提示する
3. クライアントが証明書を検証し(信頼できる認証局が発行しているか等)、共通鍵の元になる情報を暗号化してサーバーへ送る
4. 以降の通信は、その共通鍵を使った高速な暗号化(共通鍵暗号)で行われる

## つまずきやすい点

- 「暗号化されている(HTTPSである)」ことと「安全なサイトである」ことは同義ではない。フィッシングサイトも正規のHTTPS証明書を取得できるため、URLの表記が本物のドメインかどうかは別途確認する必要がある
- 証明書の有効期限が切れると、ブラウザは警告を表示して通信をブロックする。自動更新の仕組み(Let's Encrypt等)を導入していないと、運用中に見落としがちな障害原因になる
- 公開鍵暗号(非対称鍵、ハンドシェイクの認証に使用)と共通鍵暗号(対称鍵、実際のデータ転送に使用)は計算コストが大きく異なる。ハンドシェイクの重い公開鍵暗号は最初の鍵交換だけに使い、以降は軽い共通鍵暗号に切り替えるのがTLSの設計の要点

## 実装例(コード)

```bash
# サーバーのTLS証明書の情報を確認する
openssl s_client -connect example.com:443 -servername example.com
```
