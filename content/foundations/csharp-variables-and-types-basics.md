---
name: 変数宣言と型の基礎
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: C#は静的型付け言語。変数は宣言時に型が確定し、以降その型以外の値を代入できない。
---

## 概要

C#は「静的型付け」言語で、変数は宣言された時点で型が確定し、コンパイル時にその型と異なる値の代入がエラーとして検出される。Pythonのような「動的型付け」言語(実行時に型が決まる)とは対照的な設計思想を持つ。

## 基礎文法

```csharp
int score = 100;        // 明示的に型を書く
string name = "Player";
bool isActive = true;

var count = 10;          // varは型推論。コンパイル時にintと確定する(動的型ではない)
const double Pi = 3.14;  // constは再代入不可(コンパイル時定数)
readonly int maxHp = 100; // readonlyはコンストラクタでのみ設定可能な実行時定数
```

- `int`/`double`/`bool`のような値型と、`string`/クラスのような参照型がある([structとclassの違い](/foundations/csharp-struct-vs-class)参照)
- `var`は「型を書かなくてよい」だけで、動的型付けではない。一度推論された型は固定される

## つまずきやすい点

- `var`をPythonのような動的型付けと誤解しやすいが、C#の`var`はあくまでコンパイル時に型が確定する「型推論」であり、後から別の型の値を代入しようとするとコンパイルエラーになる
- `const`と`readonly`はどちらも「変更不可」だが、`const`はコンパイル時に値が確定していなければならず、`readonly`は実行時(コンストラクタ内)に値を決められるという違いがある
- 値型(`int`等)と参照型(`class`等)では、変数のコピー時の挙動が異なる([structとclassの違い](/foundations/csharp-struct-vs-class)を参照)。この違いを意識せずに代入すると、意図しない共有・非共有の挙動に驚くことがある

## 実装例(コード)

```csharp
// 型推論が実際の型を固定することを示す例
var items = new List<string>(); // List<string>型として確定する
items.Add("Sort");
// items.Add(42); // コンパイルエラー: intはstringに変換できない
```
