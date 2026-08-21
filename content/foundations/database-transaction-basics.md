---
name: トランザクションの基礎(ACID)
category: IT知識
subcategory: データベース
masteryBadge: review
summary: 複数の操作を「全て成功するか、全て失敗するか」の単位でまとめる仕組み。ACIDという4つの性質で特徴づけられる。
operationSteps:
  - label: トランザクションを開始する
    menuPath: "BEGIN;"
  - label: 複数の操作を実行する
    note: 例えばAから引き落とし、Bへ入金する2つのUPDATE文
  - label: 全て成功すれば確定する
    menuPath: "COMMIT;"
    note: ここまでの全ての変更が確定する
  - label: 途中で失敗すれば取り消す
    menuPath: "ROLLBACK;"
    note: 1つでも失敗した場合、全ての変更がなかったことになる
---

## 概要

トランザクションは、複数のデータベース操作を1つの不可分な単位としてまとめる仕組み。銀行口座間の送金のように「Aから引き落とし、Bに入金する」という2つの操作が、途中で片方だけ失敗して整合性が崩れることを防ぐために使われる。

## 基礎文法

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- ここまで全て成功して初めて確定する
-- 途中でエラーが起きた場合は ROLLBACK; で全て取り消せる
```

トランザクションが満たすべき4つの性質(ACID):

- **原子性(Atomicity)**: 全て成功するか、全て取り消されるか(中途半端な状態にならない)
- **一貫性(Consistency)**: トランザクションの前後でデータの整合性ルールが保たれる
- **独立性(Isolation)**: 複数のトランザクションが同時に走っても、互いに干渉しない(ように見える)
- **永続性(Durability)**: コミットされた結果は、障害が起きても失われない

## つまずきやすい点

- 「独立性」には複数のレベル(分離レベル)があり、レベルが低いほど並行処理の性能は上がるが、他のトランザクションの未確定な変更が見えてしまう(ダーティリード等)といった問題が起きやすくなる。厳密さと性能はトレードオフの関係にある
- トランザクションを開始したまま長時間放置すると、他のトランザクションがロック待ちで滞留し、システム全体のスループットが下がることがある。トランザクションはできるだけ短く保つのが基本
- アプリケーションコードの例外処理でロールバックを書き忘れると、意図せず中途半端な状態のままコミットされてしまうことがある。多くのフレームワークは「例外が発生したら自動的にロールバックする」仕組みを提供しているため、その挙動を理解しておく必要がある

## 実装例(コード)

```python
# Pythonでの明示的なトランザクション管理の例
try:
    with connection.begin():
        connection.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
        connection.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
except Exception:
    # withブロックを抜ける際に自動的にロールバックされる
    raise
```
