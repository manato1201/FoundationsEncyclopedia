---
name: SELECT文の基礎
category: プログラミング言語
subcategory: SQL
masteryBadge: done
summary: テーブルからデータを取り出す最も基本的な命令。WHERE/ORDER BY/LIMITとの組み合わせが土台になる。
---

## 概要

`SELECT`文は、データベースのテーブルから条件に合う行を取り出すためのSQLの基本命令。「どの列を」「どのテーブルから」「どんな条件で」「どんな順序で」取り出すかを宣言的に書く。

## 基礎文法

```sql
SELECT name, category, mastery_badge
FROM foundations_entries
WHERE category = 'プログラミング言語'
ORDER BY name ASC
LIMIT 10;
```

- `SELECT`: 取り出す列を指定する(`*`で全列)
- `FROM`: 対象のテーブルを指定する
- `WHERE`: 行を絞り込む条件
- `ORDER BY`: 並び替え(`ASC`昇順/`DESC`降順)
- `LIMIT`: 取得する行数の上限

## つまずきやすい点

- `SELECT *`は開発中は便利だが、本番のクエリでは必要な列だけを明示的に指定する方が、転送量の削減やテーブル構造変更時の影響範囲の把握という点で望ましい
- `WHERE`句での文字列比較は、データベースの照合順序(collation)によって大文字小文字を区別するかどうかが変わる。想定と異なるヒット件数になった場合、この設定を疑うとよい
- `LIMIT`だけで「10件目以降」のようなページングをすると、元のデータが更新された際に重複や欠落が起きうる。安定したページングには`ORDER BY`の一意性(主キー等を含める)が重要

## 実装例(コード)

```sql
-- ページング(2ページ目、1ページ10件)
SELECT * FROM foundations_entries
ORDER BY id ASC
LIMIT 10 OFFSET 10;
```
