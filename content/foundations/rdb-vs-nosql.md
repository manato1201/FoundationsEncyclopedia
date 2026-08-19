---
name: リレーショナルDBとNoSQLの違い
category: IT知識
subcategory: データベース
masteryBadge: done
summary: 表形式で厳格なスキーマを持つRDBと、柔軟な形式でスケールしやすさを重視するNoSQLの設計思想の違い。
---

## 概要

リレーショナルデータベース(RDB、MySQL/PostgreSQL等)は、[正規化](/foundations/sql-normalization-basics)された表(テーブル)の集まりとしてデータを扱い、厳格なスキーマとACID特性([トランザクションの基礎](/foundations/database-transaction-basics))を重視する。NoSQLは、ドキュメント指向(MongoDB等)、キーバリュー型(Redis等)、カラム指向など多様な形式を持ち、柔軟なスキーマと水平方向のスケールしやすさを重視する傾向がある。

## 基礎文法

```sql
-- RDB: 厳格なスキーマに沿った行として保存される
INSERT INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com');
```

```javascript
// NoSQL(ドキュメント指向)の例: JSONに近い柔軟な構造でそのまま保存できる
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  preferences: { theme: "dark", notifications: true }, // ネストした構造も自然に扱える
});
```

## つまずきやすい点

- 「NoSQLの方が新しくて優れている」という単純な優劣ではなく、要件によって適材適所がある。複数のエンティティ間で強い整合性(在庫管理、決済処理等)が必要な場合はRDBが向き、スキーマが頻繁に変わる・大量の書き込みを水平にスケールさせたい場合はNoSQLが向くことが多い
- NoSQLはJOINに相当する機能を持たない、または制限があることが多い。RDBの感覚で正規化した設計をNoSQLにそのまま持ち込むと、複数回のクエリが必要になったり、非効率なデータ構造になったりすることがある
- 一部のNoSQLは「結果整合性」(更新が全ノードに反映されるまでにタイムラグがあり、一時的に古いデータが読めることを許容するモデル)を採用している。強い一貫性を前提にした設計のままNoSQLに移行すると、予期しないデータの不整合に遭遇することがある

## 実装例(コード)

このエントリはデータベースの分類比較が主題のため、コード例の代わりに上記の比較で違いを整理しています。
