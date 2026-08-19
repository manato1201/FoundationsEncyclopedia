---
name: JOINの基礎
category: プログラミング言語
subcategory: SQL
masteryBadge: review
summary: 複数のテーブルを共通のキーで結合し、1つの結果として取り出すための操作。
---

## 概要

`JOIN`は、正規化によって分割された複数のテーブル(例: `users`テーブルと`orders`テーブル)を、共通のキー(外部キー)で結びつけて1つの結果として取得するための操作。代表的な種類として`INNER JOIN`と`LEFT JOIN`がある。

## 基礎文法

```sql
-- INNER JOIN: 両方のテーブルに一致する行だけを取得
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN: 左側(users)の全行を取得し、一致するordersがなければNULLで埋める
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

## つまずきやすい点

- `INNER JOIN`は「両方に一致する行だけ」を返すため、注文履歴が1件もないユーザーは結果から消えてしまう。「注文がないユーザーも含めて一覧したい」場合は`LEFT JOIN`を使う必要がある
- 結合条件(`ON`句)を書き間違えると、意図せず全行×全行の組み合わせ(直積、デカルト積)に近い結果になり、行数が爆発的に増えることがある
- 複数のテーブルを何段も`JOIN`すると、それぞれの結合が正しく絞り込まれているかを追うのが難しくなる。`WHERE`句とは異なるタイミング(結合そのものの条件)で絞り込みを行っていることを意識しないと、意図しない行が紛れ込むことがある

## 実装例(コード)

```sql
-- 3テーブルの結合例
SELECT foundations_entries.name, categories.label
FROM foundations_entries
INNER JOIN categories ON foundations_entries.category_id = categories.id
LEFT JOIN mastery_records ON foundations_entries.id = mastery_records.entry_id;
```
