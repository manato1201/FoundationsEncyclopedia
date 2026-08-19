---
name: インデックスの基礎
category: プログラミング言語
subcategory: SQL
summary: 本の索引のように、特定の列での検索を高速化するデータベースの補助的なデータ構造。
---

## 概要

インデックスは、テーブルの特定の列(または列の組み合わせ)に対する検索を高速化するための補助的なデータ構造。索引がない本を最初から最後まで読んで探す(全表スキャン)代わりに、索引を引いてすぐに目的のページにたどり着けるのと同じ発想。

## 基礎文法

```sql
CREATE INDEX idx_entries_category ON foundations_entries (category);

-- このインデックスがあると、以下のようなWHERE句が高速化される
SELECT * FROM foundations_entries WHERE category = 'IT知識';
```

- 多くのデータベースは、B木(バランス木)というデータ構造でインデックスを実装しており、[二分木の基礎](/foundations/binary-tree-basics)で扱う考え方の実務での応用にあたる

## つまずきやすい点

- インデックスは検索を速くする代わりに、書き込み(INSERT/UPDATE/DELETE)のたびにインデックス自体も更新するコストがかかる。読み取りが多く書き込みが少ないテーブルには効果的だが、書き込みが頻繁なテーブルに無闇にインデックスを増やすと、逆に全体のパフォーマンスが落ちることがある
- 複数列のインデックス(複合インデックス)は、列の順序が重要。`(category, subcategory)`の順で作ったインデックスは`category`単体の検索には有効だが、`subcategory`単体の検索には効かないことが多い
- インデックスを作っても、`WHERE`句の書き方(関数を列に適用している等)によってはデータベースがインデックスを使わず全表スキャンにフォールバックすることがある。実際に使われているかは`EXPLAIN`のようなクエリ実行計画の確認コマンドで検証する必要がある

## 実装例(コード)

```sql
-- クエリがインデックスを使っているか確認する(PostgreSQL/MySQLの例)
EXPLAIN SELECT * FROM foundations_entries WHERE category = 'IT知識';
```
