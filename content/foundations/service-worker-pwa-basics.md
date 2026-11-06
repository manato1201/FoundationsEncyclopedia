---
name: "Service WorkerとPWAの基礎"
category: IT知識
subcategory: "Webの基礎"
summary: "Webページとネットワークの間に立つスクリプト。オフライン表示やキャッシュ制御を可能にする。"
claim: "Service Workerは、ページの通信を仲介して、オフラインでも動かせる。"
operationSteps:
  - label: "Service Workerを登録する"
    note: "ページから、Service Workerのスクリプトを登録する(HTTPSが必要)"
  - label: "インストール時にキャッシュする"
    note: "必要なファイルを、あらかじめブラウザに保存しておく"
  - label: "通信を横取りする"
    note: "ページのリクエストを、Service Workerが受け取る"
  - label: "キャッシュかネットワークかを選ぶ"
    note: "保存済みならそれを返す、なければネットワークへ取りにいく、といった方針を決める"
  - label: "オフラインでも表示される"
    note: "ネットワークがなくても、キャッシュから画面を返せる"
quiz:
  - question: "Service Workerの利点として近いものはどれか"
    choices:
      - "通信を仲介して、オフラインでも画面を返せる"
      - "サーバーが不要になる"
      - "ページが自動で書き換わる"
    answer: 0
    explanation: "キャッシュを使って、ネットワークがなくても応答できる。"
---

## 概要

**Service Worker**は、ブラウザの裏で動くスクリプトで、ページとネットワークの間に立って、通信を仲介する。リクエストを受け取って、キャッシュから返せるので、**オフラインでも**画面を表示できる。これを活用したWebアプリを**PWA**(Progressive Web App)と呼ぶ。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| Service Worker | 通信を仲介するスクリプト |
| Cache API | ファイルを保存する仕組み |
| マニフェスト | アプリの名前・アイコンなどの情報(ホーム画面への追加に使う) |

## つまずきやすい点

- キャッシュを更新しないと、古い画面が出続ける。版を管理して、更新の手順を決める
- HTTPSの環境でしか動かない(開発中のlocalhostは例外)
- ブラウザやOSによって、使える機能が違う。対象の環境で確認する

## 実装例(コード)

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```
