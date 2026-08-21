---
name: 正規化と非正規化のトレードオフ
category: IT知識
subcategory: データベース
summary: データの重複を避ける正規化と、読み取り速度を優先してあえて重複させる非正規化のバランス。
operationSteps:
  - label: 正規化してデータの重複を排除する
    note: テーブルを分割し、更新時の不整合を防ぐ
  - label: JOINが増えて読み取りが複雑になる
    note: 正規化を進めるほど、取り出す際に多数の結合が必要になることがある
  - label: 読み取り性能を優先し一部を非正規化する
    note: 集計済みの値等をあえて重複して持たせる
  - label: 更新時の同期コストを受け入れる
    note: 非正規化した列は、元データが変わるたびに同期する仕組みが必要になる
---

## 概要

[正規化の基礎](/foundations/sql-normalization-basics)で扱った通り、正規化はデータの重複と更新時の不整合を防ぐ設計手法だが、実務では読み取り性能を優先してあえて一部のデータを重複させる「非正規化」を選択することもある。両者はトレードオフの関係にあり、システムの特性(読み取りが多いか書き込みが多いか)によって最適なバランスが変わる。

## 基礎文法

```sql
-- 正規化された設計: 注文の合計金額は都度JOINして計算する
SELECT orders.id, SUM(order_items.price * order_items.quantity) AS total
FROM orders
JOIN order_items ON orders.id = order_items.order_id
GROUP BY orders.id;

-- 非正規化された設計: 合計金額を注文テーブルに直接持たせ、都度の計算を省略する
SELECT id, total FROM orders; -- totalは注文確定時に計算済みの値
```

## つまずきやすい点

- 非正規化した列(上記の`total`のような集計済みの値)は、元になるデータ(`order_items`)が変更された際に、手動または仕組み(トリガー等)で同期させる必要がある。同期を忘れると、集計済みの値と実際のデータが食い違う不整合が発生する
- 読み取り性能を優先した非正規化を、更新頻度の高いデータに対して行うと、更新のたびに複数箇所を書き換える必要が生じ、かえって書き込み性能や整合性維持のコストが増えることがある
- 「正規化か非正規化か」は全か無かの二択ではなく、テーブルごと・列ごとに使い分けるのが実務的。読み取りが極端に多い一部のレポート用データだけを非正規化する、といった部分的な適用も一般的

## 実装例(コード)

```sql
-- キャッシュ的な非正規化列を更新するトリガーの例(PostgreSQL)
CREATE TRIGGER update_order_total
AFTER INSERT OR UPDATE ON order_items
FOR EACH ROW EXECUTE FUNCTION recalculate_order_total();
```
