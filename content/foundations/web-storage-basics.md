---
name: "ブラウザの保存領域(localStorage・sessionStorage・Cookie)"
category: IT知識
subcategory: "Webの基礎"
summary: "ブラウザにデータを保存する3つの仕組みの、保存期間・容量・送信のされ方の違い。"
claim: "保存期間と、サーバーへ送られるかどうかで、使い分ける。"
operationSteps:
  - label: "保存したいデータを決める"
    note: "設定・下書き・ログインの状態など、何を、どれだけの期間保存するかを考える"
  - label: "サーバーへ送る必要があるか確認する"
    note: "サーバーに毎回送るなら、Cookie。ブラウザの中だけなら、Web Storage"
  - label: "期間でWeb Storageを選ぶ"
    note: "タブを閉じたら消えていいなら sessionStorage、残したいなら localStorage"
  - label: "保存と読み出しをする"
    note: "`setItem` と `getItem` で、キーと値を出し入れする"
  - label: "機密情報は置かない"
    note: "スクリプトから読めるため、パスワードなどは置かない"
quiz:
  - question: "タブを閉じると消える保存領域はどれか"
    choices:
      - "sessionStorage"
      - "localStorage"
      - "どれも消えない"
    answer: 0
    explanation: "sessionStorageは、そのタブの間だけ保持される。"
---

## 概要

ブラウザには、データを保存する仕組みがいくつかある。**localStorage**は、ブラウザを閉じても残る。**sessionStorage**は、タブを閉じると消える。**Cookie**は、サーバーへのリクエストに自動で付けられる。

## 基礎文法

| 仕組み | 保存期間 | サーバーへ送信 |
| --- | --- | --- |
| localStorage | 消すまで残る | 送られない |
| sessionStorage | タブを閉じるまで | 送られない |
| Cookie | 設定した期限まで | リクエストのたびに送られる |

## つまずきやすい点

- Web Storageは、同じサイトのスクリプトから読める。XSSがあると盗まれるため、機密情報は置かない
- 容量には上限がある。大量のデータは、別の仕組み(IndexedDBなど)を使う
- 保存できる値は文字列。オブジェクトは、JSONに変換して保存する

## 実装例(コード)

```javascript
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme")); // "dark"
```
