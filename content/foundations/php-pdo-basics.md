---
name: PDOによるDB接続の基礎
category: プログラミング言語
subcategory: PHP
masteryBadge: review
summary: 複数のデータベース製品に対して統一的なインターフェースでアクセスできる、PHP標準の拡張機能。
---

## 概要

PDO(PHP Data Objects)は、MySQL・PostgreSQL・SQLiteなど複数のデータベース製品に対して、同じAPIでアクセスできるようにするPHPの拡張機能。データベース製品ごとに異なる関数群(`mysql_*`のような古いAPI)を使い分ける必要がなくなる。

## 基礎文法

```php
<?php
$pdo = new PDO("mysql:host=localhost;dbname=app", $user, $password);

// プリペアドステートメント: プレースホルダに値を安全に埋め込む
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute(["id" => 42]);
$user = $stmt->fetch();
```

## つまずきやすい点

- ユーザー入力を直接SQL文字列に連結する(`"SELECT * FROM users WHERE id = " . $id`のような書き方)は、[SQLインジェクション](/foundations/sql-injection-basics)の典型的な原因になる。プリペアドステートメントを使い、値をプレースホルダ経由で渡すのが必須の対策
- PDOはデフォルトではエラーを例外として投げない設定になっていることがある。`$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION)`を設定しておかないと、クエリの失敗が静かに無視され、原因不明のバグにつながる
- トランザクション(`beginTransaction`/`commit`/`rollBack`)を使わずに複数のクエリを実行すると、途中で失敗した場合にデータの整合性が崩れる。関連する複数の更新は必ずトランザクションで囲むべき

## 実装例(コード)

```php
<?php
$pdo->beginTransaction();
try {
    $pdo->prepare("UPDATE accounts SET balance = balance - :amount WHERE id = :from")
        ->execute(["amount" => 100, "from" => 1]);
    $pdo->prepare("UPDATE accounts SET balance = balance + :amount WHERE id = :to")
        ->execute(["amount" => 100, "to" => 2]);
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
}
```
