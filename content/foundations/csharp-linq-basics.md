---
name: LINQの基礎(Where/Select/OrderBy)
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: コレクション操作を宣言的に記述するC#の標準機能。UnityのC#スクリプトでも頻出する。
---

## 概要

LINQ(Language Integrated Query)は、配列やリストなどのコレクションに対して「何をするか」を宣言的に書ける機能。for文でインデックスを回して手続き的に書く代わりに、`Where`(絞り込み)・`Select`(変換)・`OrderBy`(並び替え)といったメソッドをチェーンして意図を直接表現できる。

## 基礎文法

```csharp
var aliveEnemies = enemies
    .Where(e => e.Hp > 0)
    .OrderBy(e => e.DistanceToPlayer)
    .Select(e => e.Name)
    .ToList();
```

- `Where`: 条件に合う要素だけを残す
- `Select`: 各要素を別の形に変換する(射影)
- `OrderBy`/`OrderByDescending`: 指定したキーで並び替える
- 遅延評価(遅延実行)される。`ToList()`や`foreach`で実際に列挙されるまで処理は走らない

## つまずきやすい点

- 遅延評価を理解せず同じクエリを何度も列挙すると、その都度コレクションを再走査してしまい無駄なコストが発生する
- `foreach`ループ内でLINQを多用すると、Unityのようにフレームごとに実行される処理では毎フレームのアロケーションが増えGCの負荷になりやすい
- クエリ構文(`from x in ... select x`)とメソッド構文(`.Where(...).Select(...)`)は等価だが、混在させると可読性が落ちる

## 実装例(コード)

```csharp
List<int> scores = new() { 55, 80, 42, 91, 67 };
var passingSorted = scores.Where(s => s >= 60).OrderByDescending(s => s).ToList();
// [91, 80, 67]
```
