---
name: 変数宣言と型の基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: review
summary: Rustの変数はデフォルトで不変(immutable)。可変にしたい場合はmutキーワードを明示する必要がある。
---

## 概要

Rustの変数宣言で最も特徴的な点は、`let`で宣言した変数がデフォルトで「不変(immutable)」であること。[C#](/foundations/csharp-variables-and-types-basics)や[Java](/foundations/java-variables-and-types-basics)のように「デフォルトで可変、`const`/`final`で不変にする」言語とは正反対の設計思想で、「変更したい場合にこそ明示的な宣言を要求する」ことで、意図しない変更をコンパイル時に防ぐ。

## 基礎文法

```rust
let score = 100;        // デフォルトで不変
// score = 200;          // コンパイルエラー: scoreはmutではない

let mut health = 100;    // mutを付けると可変になる
health -= 10;             // OK

const MAX_HP: i32 = 100;  // 定数(常に不変、型注釈が必須)

let count: i32 = 10;      // 型注釈は省略可能(型推論が働く)
```

## つまずきやすい点

- `let`のシャドーイング(同じ名前で`let`を再度書くと、新しい変数として扱われる)は、`mut`による書き換えとは異なる概念。シャドーイングは型を変えることもできるが、`mut`は同じ型のまま値だけを変更する点が異なる
- 「デフォルトで不変」という設計は、[所有権の基礎](/foundations/rust-ownership-basics)や[借用とライフタイム](/foundations/rust-borrowing-basics)と組み合わさることで、Rustのメモリ安全性を支える中核的な仕組みになっている。「なぜ不変がデフォルトなのか」を理解すると、Rustの設計思想全体が見えやすくなる
- `mut`を付けても、変数の「型」自体を変えることはできない(あくまで同じ型の範囲内での値の変更)。異なる型の値を代入し直したい場合は、シャドーイング(新しい`let`)を使う必要がある

## 実装例(コード)

```rust
// シャドーイングとmutの違い
let x = 5;
let x = x + 1;   // シャドーイング: xという名前の新しい変数(値は6)
let x = x * 2;    // さらにシャドーイング(値は12)

let mut y = 5;
y = y + 1;         // mutによる変更(同じ変数、値は6のまま更新される)
```
