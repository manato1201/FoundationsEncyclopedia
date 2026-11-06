---
name: "git bisectで原因のコミットを探す"
category: IT知識
subcategory: "バージョン管理"
summary: "「ここは正常、ここは異常」と指定すると、二分探索でバグが入ったコミットを見つけてくれる。"
claim: "git bisectは、半分ずつ絞り込んで、バグが入ったコミットを見つける。"
operationSteps:
  - label: "bisectを開始する"
    note: "`git bisect start` で、探索の記録を始める"
  - label: "異常なコミットを指定する"
    note: "いま異常が出ているコミット(通常は最新)を、badとして指定する"
  - label: "正常だったコミットを指定する"
    note: "過去に正常だった、確かなコミットを、goodとして指定する"
  - label: "真ん中のコミットを確認する"
    note: "gitが範囲の真ん中のコミットへ切り替える。動かして、正常か異常かを確かめる"
  - label: "good / bad を伝えて範囲を半分にする"
    note: "判定を伝えるたびに、候補が半分になる。これを繰り返す"
  - label: "原因のコミットが特定される"
    note: "最初に異常が出たコミットが示されたら、`git bisect reset` で元の状態に戻る"
quiz:
  - question: "git bisectが使う探索の方法はどれか"
    choices:
      - "二分探索"
      - "先頭から1つずつ確認する線形探索"
      - "ランダムに選ぶ"
    answer: 0
    explanation: "範囲を半分ずつに絞るので、少ない回数で見つかる。"
---

## 概要

**git bisect**は、「ここまでは正常」「ここからは異常」という2点を指定すると、その間のコミットを**二分探索**して、問題が最初に入ったコミットを見つける機能。コミットが100個あっても、確認は7回前後で済む(2の7乗が128のため)。

## 基礎文法

| コマンド | 意味 |
| --- | --- |
| git bisect start | 探索を始める |
| git bisect bad / good | 現在のコミットが異常 / 正常だと伝える |
| git bisect reset | 探索を終えて、元のブランチに戻る |

## つまずきやすい点

- 毎回の確認を手作業で行うと大変。再現できる自動テストがあれば、`git bisect run` で自動化できる
- goodとbadの指定が逆だと、結果がおかしくなる。何を「異常」と呼ぶかを、最初に決めておく
- 途中のコミットがビルドできないと、判定できない。その場合は `git bisect skip` で飛ばす

## 実装例(コード)

```bash
git bisect start
git bisect bad              # いまのコミットは異常
git bisect good v1.0        # v1.0 は正常だった
# 判定を伝えながら進める
git bisect reset
```
