---
name: 配列とVecの基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: review
summary: Rustの配列は固定長でスタック上に確保される。可変長が必要な場合はヒープ確保のVec<T>を使う。
---

## 概要

Rustには2つの配列的な型がある。`[T; N]`(固定長配列、サイズが型の一部でありコンパイル時に決まる)と`Vec<T>`(可変長ベクタ、[C++のstd::vector](/foundations/cpp-arrays-basics)に相当)。[所有権の基礎](/foundations/rust-ownership-basics)の考え方の通り、どちらもメモリ安全性がコンパイル時に保証される。

## 基礎文法

```rust
let scores: [i32; 3] = [90, 80, 70]; // 固定長配列(サイズ3が型の一部)
let first = scores[0];                 // インデックスは0始まり
let length = scores.len();

let mut dynamic_scores: Vec<i32> = Vec::new(); // 可変長ベクタ
dynamic_scores.push(100);                        // 末尾に追加
dynamic_scores.push(90);

let vec_literal = vec![90, 80, 70]; // vec!マクロでの初期化
```

## つまずきやすい点

- `[i32; 3]`のようにサイズが型の一部であるため、要素数の異なる配列同士は「別の型」として扱われる。関数の引数にサイズ固定の配列をそのまま使うと、特定のサイズの配列しか受け付けられなくなり、柔軟性が低い(スライス`&[i32]`を引数にすることでこの制約を回避できる)
- Rustの配列アクセス(`scores[10]`のような範囲外アクセス)は、[C++の未定義動作](/foundations/cpp-arrays-basics)とは異なり、実行時に必ずパニック(検出可能なクラッシュ)を起こす。「安全性を保ちながらもチェックのコストがかかる」という設計判断であり、パフォーマンスが極めて重要な箇所では`get_unchecked`のような安全性を犠牲にしたAPIも用意されている
- `Vec<T>`から要素を取り出す際、[所有権](/foundations/rust-ownership-basics)のルールにより、値を直接取り出す(`pop()`等)操作と、参照で覗き見る(`get()`等)操作が明確に区別される。「今、値の所有権を奪いたいのか、ただ見たいだけなのか」を意識してメソッドを選ぶ必要がある

## 実装例(コード)

```rust
// スライスを引数にすることで、配列サイズに依存しない関数を書く
fn sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

let arr = [1, 2, 3];
let v = vec![1, 2, 3, 4];
sum(&arr); // 配列もVecも、スライスとして渡せる
sum(&v);
```
