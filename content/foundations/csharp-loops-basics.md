---
name: for/whileループの基礎
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: C#はfor/while/do-while/foreachの4種類のループ構文を持つ。用途に応じた使い分けが基本。
---

## 概要

C#には`for`・`while`・`do-while`・`foreach`という4種類のループ構文がある。[forループの実行フロー](/foundations/for-loop-flow)で扱った「初期化→条件判定→本体実行→更新」という構造は`for`文の中に凝縮されており、`while`文はその中の「条件判定→本体実行」の部分だけを繰り返す、より単純な構造を持つ。

## 基礎文法

```csharp
// for: 回数が決まっている繰り返しに向く
for (int i = 0; i < 5; i++)
{
    Debug.Log(i);
}

// while: 条件が満たされる間繰り返す(回数が事前に決まっていない場合に向く)
int hp = 100;
while (hp > 0)
{
    hp -= 10;
}

// do-while: 本体を必ず1回は実行してから条件を判定する
int input;
do
{
    input = ReadInput();
} while (input != -1);

// foreach: コレクションの各要素を順に処理する(インデックス管理が不要)
foreach (var item in items)
{
    Debug.Log(item);
}
```

## つまずきやすい点

- `while`は「条件判定が先」(前判定)、`do-while`は「本体実行が先」(後判定)という違いがある。`do-while`は少なくとも1回は本体が実行されることが保証される点が`while`と異なる
- `foreach`でコレクションを走査しながら、そのコレクション自体に要素を追加・削除しようとすると、`InvalidOperationException`が発生する。走査中の変更が必要な場合は、インデックスを使う`for`文に切り替えるか、別のコレクションにコピーしてから走査する
- `break`はループ全体を抜け、`continue`はその周回だけをスキップして次の周回へ進む。この2つの違いを取り違えると、意図した回数だけ処理をスキップできず無限ループに陥ることがある

## 実装例(コード)

```csharp
// breakとcontinueの使い分けの例
foreach (var enemy in enemies)
{
    if (enemy.IsDead) continue; // 死亡した敵はスキップして次へ
    if (enemy.IsBoss)
    {
        FocusCamera(enemy);
        break; // ボスを見つけたらそこでループ全体を終了
    }
}
```
