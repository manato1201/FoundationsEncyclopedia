---
name: HTTPリクエスト/レスポンスの基礎
category: IT知識
subcategory: ネットワーク
masteryBadge: done
summary: クライアントが要求し、サーバーが応答するという1往復のやり取りが基本単位になるWebの通信プロトコル。
operationSteps:
  - label: クライアントがリクエストを送る
    menuPath: "GET /foundations/xxx HTTP/1.1"
  - label: サーバーがリクエストを解析する
    note: メソッド・パス・ヘッダの内容を読み取る
  - label: サーバーが処理してレスポンスを返す
    menuPath: "HTTP/1.1 200 OK"
  - label: クライアントが結果を受け取る
    note: ステータスコードとボディを解釈して画面に反映する
---

## 概要

HTTP(HyperText Transfer Protocol)は、クライアント(ブラウザ等)がサーバーに「リクエスト」を送り、サーバーが「レスポンス」を返す、1往復のやり取りを基本単位とする通信プロトコル。それぞれ「開始行」「ヘッダ」「ボディ(任意)」という共通の構造を持つ。

## 基礎文法

```
GET /foundations/dns-basics HTTP/1.1
Host: example.com
Accept: text/html
```

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1234

<html>...</html>
```

- リクエストの開始行: メソッド(GET等) + パス + プロトコルバージョン
- レスポンスの開始行: プロトコルバージョン + ステータスコード + 理由フレーズ

## つまずきやすい点

- HTTP自体は「ステートレス」なプロトコルで、1つのリクエストと次のリクエストの間に状態を覚えていない。ログイン状態の維持のような「継続性」はCookieやセッションといった別の仕組みで補う必要がある
- リクエストヘッダとレスポンスヘッダは似た名前を持つものもあるが役割が異なる(`Accept`はクライアントが望む形式、`Content-Type`はサーバーが実際に返した形式)
- ボディを持たないGETリクエストに誤ってボディを含めて送ると、多くのサーバー・プロキシで無視されたり、意図しない挙動になったりすることがある。データを送りたい場合はPOST等のボディを持つメソッドを使う

## 実装例(コード)

```bash
# curlでリクエスト/レスポンスの詳細を確認する
curl -v https://example.com
```
