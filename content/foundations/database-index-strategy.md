---
name: インデックス設計の基礎
category: IT知識
subcategory: データベース
masteryBadge: next
summary: どの列にインデックスを張るべきかを、実際のクエリパターンから逆算して設計する考え方。
operationSteps:
  - label: 頻出するクエリパターンを洗い出す
    note: WHERE句・JOIN条件・ORDER BYでよく使われる列を確認する
  - label: 対象の列にインデックスを作成する
    menuPath: "CREATE INDEX idx_entries_category ON entries (category)"
  - label: 実行計画を確認する
    menuPath: "EXPLAIN ANALYZE"
    note: インデックスが実際に使われているかを検証する
  - label: 書き込みコストとのバランスを見直す
    note: インデックスは検索を速くする代わりに書き込みコストが増える
---

## 概要

[インデックスの基礎](/foundations/sql-indexes-basics)を踏まえ、実務では「どの列にインデックスを張るべきか」を、実際に発行されるクエリのパターンから逆算して設計する必要がある。闇雲に全ての列にインデックスを張るのではなく、検索・絞り込み・結合に使われる列を優先する。

## 基礎文法

インデックス設計で優先すべき列の典型例:

- `WHERE`句で頻繁に絞り込みに使われる列
- `JOIN`の結合条件に使われる列(外部キー)
- `ORDER BY`で頻繁にソートに使われる列

```sql
-- カテゴリで絞り込み、名前順に並べるクエリが頻出する場合
CREATE INDEX idx_entries_category_name ON foundations_entries (category, name);
```

## つまずきやすい点

- カーディナリティ(列が取りうる値の種類の多さ)が低い列(真偽値のような2値しか取らない列等)にインデックスを張っても、絞り込みの効果が薄く、書き込みコストの増加ばかりが目立つことがある
- 複合インデックス(複数列にまたがるインデックス)は列の順序が重要。よく使われるクエリの`WHERE`句・`ORDER BY`句の並びに合わせて列順を設計しないと、期待した効果が得られない
- インデックスを追加した後、実際に想定したクエリで使われているかを`EXPLAIN`のような実行計画確認コマンドで検証する習慣が重要。「インデックスを張ったから速くなったはず」という思い込みだけで終わらせず、実測で確認する

## 実装例(コード)

```sql
-- 実行計画を確認し、インデックスが使われているか検証する
EXPLAIN ANALYZE
SELECT * FROM foundations_entries
WHERE category = 'IT知識'
ORDER BY name;
```
