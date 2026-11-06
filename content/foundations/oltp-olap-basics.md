---
name: "OLTPとOLAPの違い"
category: IT知識
subcategory: "データベース"
summary: "日々の取引を処理するデータベース(OLTP)と、大量のデータを集計・分析するデータベース(OLAP)の違い。"
claim: "OLTPは小さな更新をたくさん、OLAPは大量のデータの集計を行う。"
operationSteps:
  - label: "用途を確認する"
    note: "取引を記録したいのか、データを集めて分析したいのかを分ける"
  - label: "OLTP: 日々の処理を受け持つ"
    note: "注文・決済など、少量のデータを、素早く読み書きする"
  - label: "データを集めて移す"
    note: "OLTPのデータを、定期的に分析用の場所へ集める"
  - label: "OLAP: 集計・分析を受け持つ"
    note: "大量のデータを、まとめて読んで、集計する。更新は少ない"
  - label: "目的に合う構成を選ぶ"
    note: "処理の性質が違うため、別々のシステムとして用意する場合が多い"
quiz:
  - question: "大量のデータをまとめて集計・分析する用途に向くのはどれか"
    choices:
      - "OLAP"
      - "OLTP"
      - "どちらも向かない"
    answer: 0
    explanation: "OLAPは、分析のために、大量のデータを集計することに向く。"
---

## 概要

**OLTP**(Online Transaction Processing)は、注文や決済のような、日々の**取引を処理**するデータベース。**OLAP**(Online Analytical Processing)は、蓄積した大量のデータを**集計・分析**するデータベース。性質が違うため、別々に用意することが多い。

## 基礎文法

| 項目 | OLTP | OLAP |
| --- | --- | --- |
| 主な処理 | 少量の読み書きを大量に | 大量のデータの集計 |
| 更新 | 多い | 少ない(まとめて取り込む) |
| 例 | 注文・決済・在庫の更新 | 売上の月次集計・傾向の分析 |

## つまずきやすい点

- 分析のための重い集計を、取引用のデータベースに直接かけると、日々の処理が遅くなる
- データを集めるときに、形式や時点がそろっていないと、分析結果がずれる
- どちらにも向く万能のデータベースは少ない。用途ごとに選ぶ

## 実装例(コード)

```sql
-- OLTP的な処理: 1件の更新
UPDATE stock SET count = count - 1 WHERE item_id = 10;

-- OLAP的な処理: 大量のデータの集計
SELECT month, SUM(amount) FROM sales GROUP BY month;
```
