---
name: "enumとOption型の基礎"
category: プログラミング言語
subcategory: "Rust"
summary: "Rustの enum は、場合ごとに異なる値を持てる。「値があるかもしれない」を表す Option も、標準の enum。"
claim: "Rust には null がない。値がないかもしれないときは、Option で表し、match で両方の場合を扱う。"
operationSteps:
  - label: "enumで場合を定義する"
    note: "`enum Shape { Circle(f64), Rect(f64, f64) }` のように、場合ごとに持つ値を決める"
  - label: "値を作る"
    note: "`Shape::Circle(2.0)` のように、場合の名前で作る"
  - label: "matchで場合ごとに処理する"
    note: "`match s { Shape::Circle(r) => ..., Shape::Rect(w, h) => ... }` で、中身を取り出す"
  - label: "Optionで「ない」を表す"
    note: "`Some(値)` か `None`。null の代わりで、型の上で区別される"
  - label: "両方の場合を扱う"
    note: "`match` か `if let` で Some と None を扱う。`unwrap_or(0)` で、既定値を使う方法もある"
quiz:
  - question: "Option<i32> の値から、中身の i32 を取り出すには、どうする必要があるか"
    choices:
      - "None の場合も考えて、match などで取り出す"
      - "そのまま整数として使える"
      - "キャストするだけでよい"
    answer: 0
    explanation: "Option<i32> と i32 は別の型。None の可能性を扱ったうえで、中身を取り出す必要がある。"
---

## 概要

Rustの`enum`は、「いくつかの場合のうち、いずれか1つ」を表す型で、場合ごとに別の種類のデータを持てる。この性質を使った標準の型が**`Option<T>`**で、「`T`の値がある(`Some`)」か「ない(`None`)」かを表す。多くの言語の`null`の代わりで、「ない」可能性が型に現れるので、扱い忘れをコンパイラが指摘してくれる。値の分岐は[パターンマッチング](/foundations/rust-pattern-matching)で行う。

## 基礎文法

```rust
enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => 3.14159 * r * r,
        Shape::Rect(w, h) => w * h,
    }
}

let found: Option<i32> = Some(3);
let none: Option<i32> = None;
```

| メソッド・構文 | 意味 |
| --- | --- |
| `unwrap_or(x)` | `None`のとき、既定値`x`を使う |
| `if let Some(v) = opt` | `Some`のときだけ、中身を`v`で使う |
| `opt.map(\|v\| v + 1)` | `Some`のときだけ、中身を変換する |
| `unwrap()` | `None`だとパニックする。試作用 |

## つまずきやすい点

- `Option<i32>`と`i32`は別の型なので、足し算などはできない。中身を取り出す必要がある
- `unwrap()`は、`None`のとき、プログラムを異常終了させる。本番のコードでは、`match`・`if let`・`unwrap_or`などで扱う
- `enum`の`match`は、すべての場合を書かないと、コンパイルエラー。場合を追加したときに、扱い漏れが見つかる
- 失敗の理由まで持たせたいときは、`Option`ではなく`Result`を使う([Result型によるエラーハンドリング](/foundations/rust-error-handling))

## 実装例(コード)

```rust
enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => 3.14159 * r * r,
        Shape::Rect(w, h) => w * h,
    }
}

fn first_even(nums: &[i32]) -> Option<i32> {
    nums.iter().copied().find(|n| n % 2 == 0)
}

fn main() {
    println!("{}", area(&Shape::Rect(2.0, 3.0))); // 6
    println!("{}", area(&Shape::Circle(1.0)));    // 3.14159

    println!("{:?}", first_even(&[1, 3, 4]));     // Some(4)
    println!("{:?}", first_even(&[1, 3]));        // None
    println!("{}", first_even(&[1, 3]).unwrap_or(0)); // 0
}
```
