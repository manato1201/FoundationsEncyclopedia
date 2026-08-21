---
name: 二次元配列の基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: advanced
summary: Rustの二次元配列も「配列の配列」やVecの入れ子で表現するが、所有権のルールが絡み扱いがやや複雑になる。
---

## 概要

Rustで2次元的なデータを扱う場合、[配列とVecの基礎](/foundations/rust-arrays-basics)を入れ子にした`[[i32; 4]; 3]`(固定長の二次元配列)や`Vec<Vec<i32>>`(可変長)を使う。[所有権](/foundations/rust-ownership-basics)のルールがあるため、[Pythonの二次元リスト](/foundations/python-2d-lists-basics)や[Goの二次元スライス](/foundations/go-2d-arrays-basics)で見た「行の参照共有」の罠は起きにくいが、別の種類の制約が生じる。

## 基礎文法

```rust
// 固定長の二次元配列
let grid: [[i32; 4]; 3] = [[0; 4]; 3]; // 3行4列、全要素0で初期化

// Vec<Vec<i32>>: 可変長の二次元配列
let rows = 3;
let cols = 4;
let mut dynamic_grid: Vec<Vec<i32>> = vec![vec![0; cols]; rows];
dynamic_grid[0][0] = 1;
```

## つまずきやすい点

- `vec![vec![0; cols]; rows]`という書き方は、一見[Pythonの罠](/foundations/python-2d-lists-basics)(`[[0] * cols] * rows`)と似ているが、Rustでは`vec![value; n]`マクロが`Clone`トレイトを使って「独立したコピー」をn個作るため、行同士が参照を共有する問題は起きない。ただし内部の値が複雑な型の場合、cloneのコストを意識する必要がある
- `dynamic_grid[0][0] = 1;`のように二次元Vecの要素を変更する際、[借用のルール](/foundations/rust-borrowing-basics)により、同時に複数の行を可変参照しようとするとコンパイルエラーになることがある(例えば「1行目と2行目を同時にスワップする」処理は、単純な書き方だと借用チェッカーに拒否されることがある)
- パフォーマンスが重要な場面では、[C++](/foundations/cpp-2d-arrays-basics)や[Go](/foundations/go-2d-arrays-basics)と同様、1次元の`Vec<i32>`にインデックス計算でアクセスする「疑似2次元配列」パターンがRustでもよく使われる

## 実装例(コード)

```rust
// 借用チェッカーの制約を回避する例: split_at_mutで2つの可変借用に分割する
let (first_half, second_half) = dynamic_grid.split_at_mut(1);
std::mem::swap(&mut first_half[0], &mut second_half[0]); // 1行目と2行目を安全に入れ替える
```
