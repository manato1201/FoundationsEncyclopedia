---
name: "キャッシュの基礎(Cache-Aside)"
category: IT知識
subcategory: "データベース"
summary: "よく読むデータを、速い保管場所(Redisなど)に置いて、データベースへの問い合わせを減らす。"
claim: "Cache-Asideは、まずキャッシュを見て、なければデータベースから読んで保存する。"
operationSteps:
  - label: "アプリがデータを必要とする"
    note: "まず、キャッシュにあるかを確認する"
  - label: "キャッシュにあれば、それを使う"
    note: "ヒット。データベースへ問い合わせずに、速く返せる"
  - label: "なければデータベースから読む"
    note: "ミス。データベースから取得する"
  - label: "取得したデータをキャッシュに保存する"
    note: "次回からは、キャッシュで返せるようにする(有効期限を付ける)"
  - label: "データを更新したらキャッシュを消す"
    note: "古い値が残らないよう、更新時にキャッシュを削除する"
quiz:
  - question: "Cache-Asideで、キャッシュにデータがなかったときの動きはどれか"
    choices:
      - "データベースから読んで、キャッシュに保存する"
      - "エラーにする"
      - "空のデータを返す"
    answer: 0
    explanation: "取得した結果をキャッシュに入れて、次回以降を速くする。"
visual:
  kind: zones
  question: "そのデータは、どこから返ってくる?"
  legend:
    - { key: want, label: "読みたい", tone: gray, mark: "?" }
    - { key: hit, label: "ヒット(キャッシュから)", tone: green, mark: "○" }
    - { key: miss, label: "ミス(DB から)", tone: amber, mark: "×" }
    - { key: cached, label: "キャッシュ済み(TTL つき)", tone: cyan, mark: "C" }
    - { key: stored, label: "データベースの値", tone: violet, mark: "D" }
    - { key: updated, label: "更新した値", tone: pink, mark: "U" }
  zones:
    - { id: app, label: "アプリ", note: "まずキャッシュを見る" }
    - { id: cache, label: "キャッシュ", note: "Redis など。速いが一時的" }
    - { id: db, label: "データベース", note: "元のデータ。問い合わせは重い" }
  items:
    - { id: q7, label: "user:7 を読む" }
    - { id: q42, label: "user:42 を読む" }
    - { id: c7, label: "user:7" }
    - { id: c42, label: "user:42" }
    - { id: d7, label: "user:7" }
    - { id: d42, label: "user:42" }
  steps:
    - short: "要求"
      place: { q7: app, q42: app, c7: cache, d7: db, d42: db }
      state: { q7: want, q42: want, c7: cached, d7: stored, d42: stored }
      zoneFocus: [cache]
      verdict: "2 つのデータが必要になった。まずキャッシュにあるかを確かめる"
    - short: "ヒット"
      state: { q7: hit }
      highlight: [q7, c7]
      zoneFocus: [cache]
      verdict: "○ user:7 はキャッシュにあった。データベースに問い合わせず、速く返せる"
    - short: "ミス"
      state: { q42: miss }
      highlight: [q42, d42]
      zoneFocus: [db]
      verdict: "△ user:42 はキャッシュになかった。データベースから読む"
    - short: "保存"
      place: { c42: cache }
      state: { c42: cached }
      highlight: [c42]
      zoneFocus: [cache]
      verdict: "読んだ user:42 を有効期限つきでキャッシュに入れる。次からはヒットになる"
    - short: "更新で消す"
      place: { c42: null }
      state: { d42: updated }
      highlight: [d42]
      zoneFocus: [cache]
      verdict: "user:42 を更新したら、キャッシュの user:42 を消す。古い値を返さないため"
  summary: "まずキャッシュを見て、なければデータベースから読んで保存する。更新したらキャッシュを消し、古い値を残さない。"
---

## 概要

**キャッシュ**は、よく読まれるデータを、速くアクセスできる場所(メモリ上のRedisなど)に一時的に置く仕組み。**Cache-Aside**は、アプリが「まずキャッシュを見て、なければデータベースから読み、結果をキャッシュへ入れる」という手順を行う、代表的な使い方。

## 基礎文法

| 用語 | 意味 |
| --- | --- |
| ヒット | キャッシュにデータがあった |
| ミス | キャッシュになく、データベースから読んだ |
| TTL | キャッシュの有効期限 |

## つまずきやすい点

- 元のデータが変わっても、キャッシュが古いまま残ることがある。有効期限(TTL)を決め、更新時に削除する
- キャッシュが空の状態で、大量のアクセスが来ると、データベースへ集中する(スタンピード)場合がある
- 個人ごとに違うデータは、キャッシュのキーに、利用者の情報を含める

## 実装例(コード)

```python
def get_user(user_id):
    user = cache.get(f"user:{user_id}")
    if user is None:                       # ミス
        user = db.find_user(user_id)       # データベースから読む
        cache.set(f"user:{user_id}", user, ttl=300)
    return user
```
