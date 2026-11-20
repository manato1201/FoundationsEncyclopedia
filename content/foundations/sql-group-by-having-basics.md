---
name: "GROUP BYとHAVINGの基礎"
category: プログラミング言語
subcategory: "SQL"
summary: "行をグループに分けて、グループごとに件数や合計を求める。行の絞り込みは WHERE、グループの絞り込みは HAVING。"
claim: "WHERE は行を絞ってからまとめる。HAVING はまとめたあとのグループを絞る。"
operationSteps:
  - label: "対象の行をWHEREで絞る"
    note: "集計の前に、不要な行を落とす(例: 取り消した注文を除く)"
  - label: "GROUP BYでまとめる"
    note: "`GROUP BY customer_id` で、同じ値の行が、顧客ごとのかたまりになる"
  - label: "集計関数でグループごとに計算する"
    note: "`COUNT(*)`・`SUM(amount)`・`AVG(amount)` などを、グループ1つにつき1回計算する"
  - label: "HAVINGでグループを絞る"
    note: "`HAVING SUM(amount) >= 1000` のように、集計の結果で、残すグループを決める"
  - label: "ORDER BYで並べる"
    note: "最後に並べ替える。結果の1行は、1つのグループに対応する"
quiz:
  - question: "「合計が1000以上の顧客」だけを残す条件は、どこに書くか"
    choices:
      - "WHERE"
      - "ORDER BY"
      - "HAVING"
    answer: 2
    explanation: "WHERE は集計の前に働くため、集計関数(SUM など)は使えない。集計後の条件は HAVING に書く。"
---

## 概要

`GROUP BY`は、指定した列の値が同じ行を1つのグループにまとめ、グループごとに集計する句。「顧客ごとの注文数」「月ごとの売上」のような問い合わせを書くときに使う。グループは、集計関数(`COUNT`・`SUM`・`AVG`・`MIN`・`MAX`)と組み合わせて意味を持つ。

## 基礎文法

```sql
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(amount) >= 1000
ORDER BY total DESC;
```

- 書く順序は`SELECT`→`FROM`→`WHERE`→`GROUP BY`→`HAVING`→`ORDER BY`。処理される順序は、`FROM`→`WHERE`→`GROUP BY`→`HAVING`→`SELECT`→`ORDER BY`
- `SELECT`に書ける列は、`GROUP BY`に書いた列か、集計関数の中の列

## つまずきやすい点

- `WHERE`には集計関数を書けない(まだグループができていないため)。集計結果での絞り込みは`HAVING`に書く
- `GROUP BY`に書いていない列を、集計関数なしで`SELECT`に書くと、多くのデータベースでエラーになる。1グループに複数の値があり、どれを出すか決まらないため
- `COUNT(*)`は行数を数え、`COUNT(列名)`は`NULL`を除いて数える。結果が変わることがある
- 実行順序は`WHERE`のほうが先なので、行を先に絞れる条件は`WHERE`に書くほうが、処理する行が減って速くなることが多い

## 実装例(コード)

```sql
CREATE TABLE orders (id INTEGER, customer_id INTEGER, amount INTEGER, status TEXT);
INSERT INTO orders VALUES
  (1, 1, 600, 'paid'), (2, 1, 700, 'paid'), (3, 2, 300, 'paid'),
  (4, 2, 900, 'cancelled'), (5, 3, 1500, 'paid');

SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(amount) >= 1000
ORDER BY total DESC;
-- customer_id=3 (1 件, 1500) と customer_id=1 (2 件, 1300)
```
