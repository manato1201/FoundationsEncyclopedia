---
name: "サブクエリとCTEの基礎"
category: プログラミング言語
subcategory: "SQL"
summary: "問い合わせの中に別の問い合わせを入れるサブクエリと、それに名前を付けて読みやすくする WITH 句(CTE)。"
claim: "サブクエリは「クエリの中のクエリ」。CTE は、それに名前を付けて、上から順に読めるようにしたもの。"
operationSteps:
  - label: "2段階の問いに分ける"
    note: "「平均より高い商品は?」なら、まず平均を求め、次にそれと比べる、と段階に分ける"
  - label: "内側のクエリを書く"
    note: "`(SELECT AVG(price) FROM products)` のように、かっこで囲んで、1つの値や一覧を返す"
  - label: "外側から使う"
    note: "`WHERE price > (内側のクエリ)` のように、条件や FROM の中に埋め込む"
  - label: "WITHで名前を付ける"
    note: "`WITH avg_p AS (SELECT ...)` と書くと、内側のクエリに名前が付き、あとで表のように使える"
  - label: "名前を使って本体を書く"
    note: "WITH のあとの本体で `FROM avg_p` のように参照する。長いクエリを上から読める"
quiz:
  - question: "WITH句で名前を付けたクエリは、そのままの形で何として使えるか"
    choices:
      - "永続的に保存される表"
      - "関数"
      - "一時的な表(FROMに書ける)"
    answer: 2
    explanation: "CTEは、そのクエリの実行中だけ有効な、名前付きの結果。FROM句などで、表のように参照できる。"
---

## 概要

SQLでは、「平均より高いものを探す」のように、先に別の集計をしてから比べたい場面がよくある。そのとき、問い合わせの中に別の`SELECT`を入れたものが**サブクエリ**。入れ子が深くなると読みにくくなるので、先に`WITH 名前 AS (...)`で名前を付けておく書き方(**CTE**: 共通テーブル式)も使われる。

## 基礎文法

```sql
-- サブクエリ: 平均より高い商品
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- CTE: 同じ内容を、名前付きで書く
WITH avg_p AS (SELECT AVG(price) AS v FROM products)
SELECT p.name, p.price
FROM products AS p, avg_p
WHERE p.price > avg_p.v;
```

| 形 | 内側のクエリが返すもの | 使う場所 |
| --- | --- | --- |
| スカラーサブクエリ | 1つの値 | `WHERE price > (...)` |
| 一覧を返すサブクエリ | 1列の複数行 | `WHERE id IN (...)` |
| FROMの中のサブクエリ | 表 | `FROM (...) AS t` |
| CTE | 名前付きの表 | `WITH 名前 AS (...)` |

## つまずきやすい点

- スカラーサブクエリが複数行を返すと、エラーになる。1つの値を期待する場所では、集計関数などで1行に絞る
- `NOT IN`の一覧に`NULL`が1つでも含まれると、結果が1件も返らないことがある。`NOT EXISTS`を使うと避けられる
- CTEは、多くのデータベースで、そのクエリ1回の間だけ有効。後から別のクエリで再利用することはできない
- 「CTEにすると速くなる」とは限らない。主な目的は読みやすさ。性能は、データベースの種類・版によって扱いが違うので、実行計画で確かめる([実行計画の読み方](/foundations/query-execution-plan-basics))

## 実装例(コード)

```sql
CREATE TABLE products (id INTEGER, name TEXT, price INTEGER);
INSERT INTO products VALUES (1, 'pen', 100), (2, 'book', 800), (3, 'bag', 3000), (4, 'cup', 500);

-- 平均は 1100。それより高いのは bag だけ
WITH avg_p AS (SELECT AVG(price) AS v FROM products)
SELECT p.name, p.price
FROM products AS p, avg_p
WHERE p.price > avg_p.v;
```
