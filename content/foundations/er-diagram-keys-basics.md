---
name: "ER図と主キー・外部キーの基礎"
category: IT知識
subcategory: "データベース"
summary: "データを「もの」(エンティティ)と、その関係で整理するER図。表の行を一意に決める主キーと、他の表を指す外部キーで、関係を表す。"
claim: "主キーは行の名前、外部キーは他の表の行を指す参照。この2つで、表と表がつながる。"
operationSteps:
  - label: "もの(エンティティ)を洗い出す"
    note: "「顧客」「注文」「商品」のように、データとして残したいものを、表の候補として挙げる"
  - label: "主キーで各行を一意にする"
    note: "顧客ID のように、重複せず、空にならない列を決める。それが、その行を指し示す名前になる"
  - label: "関係(1対多)を見つける"
    note: "1人の顧客が複数の注文を持つ、のように、一方の1行が、他方の複数行に対応する関係を見つける"
  - label: "多の側に外部キーを置く"
    note: "注文の表に、顧客ID の列を置き、顧客の主キーを参照させる"
  - label: "多対多は中間の表で表す"
    note: "注文と商品のように、多対多の関係は、両方の主キーを持つ中間の表(明細)に分ける"
quiz:
  - question: "「1人の顧客が複数の注文をする」関係で、外部キーを置くのはどの表か"
    choices:
      - "顧客の表(1の側)"
      - "注文の表(多の側)"
      - "どちらにも置かない"
    answer: 1
    explanation: "多の側(注文)に、1の側(顧客)の主キーを入れる。注文の行が、どの顧客のものかを指す。"
---

## 概要

リレーショナルデータベース([RDBとNoSQLの違い](/foundations/rdb-vs-nosql))の設計は、まず「何をデータとして持つか」と「それらがどう関係するか」を整理することから始まる。その図が**ER図**(エンティティ・リレーションシップ図)で、箱(エンティティ)と線(関係)で描く。実際の表では、関係を**主キー**と**外部キー**で表現する。

## 基礎文法

```sql
CREATE TABLE customers (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),  -- 外部キー
  ordered_at  TEXT
);
```

| 関係 | 例 | 表し方 |
| --- | --- | --- |
| 1対1 | 利用者と、その詳細情報 | 片方の主キーを、他方に一意に持つ |
| 1対多 | 顧客と注文 | 多の側に外部キー |
| 多対多 | 注文と商品 | 中間の表に、双方の外部キー |

- 主キーは、重複せず、`NULL`でない。意味のある値(メールアドレスなど)より、意味を持たない連番やIDが、後で変えずに済む
- 外部キー制約を付けると、存在しない顧客IDを指す注文を、入れられなくなる(参照整合性)
- 表の分け方の考え方は[正規化と非正規化](/foundations/database-normalization-vs-denormalization)を参照

## つまずきやすい点

- データベースによっては、外部キー制約が、初期状態では無効のことがある(SQLiteでは、接続ごとに`PRAGMA foreign_keys = ON`が必要)
- 外部キーの列に索引が自動で付くかは、製品による(PostgreSQLでは付かない)。結合や削除が遅いときは、索引の追加を検討する([インデックス設計の基礎](/foundations/database-index-strategy))
- 親の行を削除したときに子を、どうするか(拒否・連鎖して削除・NULLにする)を決めておく。既定の動作は、製品によって違う
- 多対多を、1つの列にカンマ区切りで詰め込むのは避ける。検索・更新が難しくなる

## 実装例(コード)

```sql
PRAGMA foreign_keys = ON;   -- SQLite の場合
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id)
);
INSERT INTO customers VALUES (1, 'Ann');
INSERT INTO orders VALUES (10, 1);      -- OK
INSERT INTO orders VALUES (11, 99);     -- エラー: 存在しない顧客を指している
```
