---
name: structとclassの違い
category: プログラミング言語
subcategory: C#
masteryBadge: next
summary: 値型(struct)と参照型(class)の違い。コピーされ方とメモリ配置の違いがパフォーマンスに直結する。
operationSteps:
  - label: "値型か参照型かを知る"
    note: "struct は値型、class は参照型"
  - label: "代入するとコピーされる(struct)"
    note: "別の変数へ代入すると、中身が複製される"
  - label: "代入すると参照が共有される(class)"
    note: "同じオブジェクトを、2つの変数が指す"
  - label: "配置の違いを知る"
    note: "struct は、変数の場所に直接置かれやすく、class はヒープに置かれる"
  - label: "用途で選ぶ"
    note: "小さく不変の値は struct、共有して変更するものは class"
---

## 概要

C#の`struct`は値型、`class`は参照型。値型は変数に代入したり引数として渡したりするたびに値そのものがコピーされるのに対し、参照型は「その実体を指す参照」がコピーされる。`Vector3`のような数学的な値の集まりが`struct`で実装されているのは、この値型としての性質が適しているため。

## 基礎文法

```csharp
struct PointStruct { public int X, Y; }
class PointClass { public int X, Y; }

var a = new PointStruct { X = 1, Y = 1 };
var b = a; // 値がコピーされる。aとbは別の実体
b.X = 99;  // aのXは1のまま

var c = new PointClass { X = 1, Y = 1 };
var d = c; // 参照がコピーされる。cとdは同じ実体を指す
d.X = 99;  // cのXも99になる
```

## つまずきやすい点

- 大きなデータを持つ`struct`を値渡しで頻繁にコピーすると、そのコピーコスト自体がパフォーマンスの問題になりうる。逆に小さな`struct`(`Vector3`程度)はヒープ確保が発生しない分、GCの負荷軽減に有利
- `struct`を`List<T>`や`object`として扱うとボックス化(ヒープへのコピー)が発生し、値型のメリットが薄れることがある
- `struct`はデフォルトでは可変(mutable)にできるが、コピーされる性質と可変性を組み合わせると「どの変数を書き換えたつもりが実は別の実体だった」というバグを生みやすい。可能な限りイミュータブル(読み取り専用)な`struct`として設計するのが安全

## 実装例(コード)

```csharp
readonly struct Damage
{
    public readonly int Amount;
    public readonly bool IsCritical;

    public Damage(int amount, bool isCritical)
    {
        Amount = amount;
        IsCritical = isCritical;
    }
}
```
