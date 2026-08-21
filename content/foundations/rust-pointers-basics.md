---
name: ポインタと参照の基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: advanced
summary: Rustは通常「参照」という安全なポインタ相当の機能を使う。生ポインタも存在するが、unsafeブロックでのみ扱える。
---

## 概要

Rustの[借用とライフタイム](/foundations/rust-borrowing-basics)で扱った「参照(`&T`/`&mut T`)」は、実質的に安全性が保証されたポインタ。[C++の生ポインタ](/foundations/cpp-pointers-basics)や[Goのポインタ](/foundations/go-pointers-basics)と異なり、参照は借用チェッカーによって「ダングリング参照が絶対に発生しない」ことがコンパイル時に保証される。ただし、`unsafe`ブロックの中では、この保証を持たない「生ポインタ」(`*const T`/`*mut T`)も扱える。

## つまずきやすい点

- 通常の参照(`&T`)は、[C++の生ポインタ](/foundations/cpp-pointers-basics)のように`nullptr`を表現できない。「値が存在しないかもしれない」ことを表現したい場合は、`Option<&T>`のように`Option`型と組み合わせる、というのがRustの慣習であり、null安全性が言語の型システムに組み込まれている
- `unsafe`ブロックの中で生ポインタを使う場合、[C++のポインタの基礎](/foundations/cpp-pointers-basics)と同じ危険性(ダングリングポインタ、範囲外アクセス等)がそのまま復活する。Rustが「安全」と言われるのは、あくまで`unsafe`を使わない範囲においてであり、`unsafe`ブロックの中身は開発者自身が正しさを保証する責任を負う
- 可変参照(`&mut T`)は、同時に1つしか存在できないという[借用のルール](/foundations/rust-borrowing-basics)がある。C++やGoのポインタでは複数のポインタから同じデータを自由に書き換えられるが、Rustはこの「複数箇所からの同時書き込み」をコンパイル時に構造的に禁止することで、データ競合を防いでいる

## 実装例(コード)

```rust
// unsafeブロックでの生ポインタの利用例(通常のコードでは推奨されない)
let value = 42;
let raw_ptr: *const i32 = &value;
unsafe {
    println!("{}", *raw_ptr); // 生ポインタの逆参照にはunsafeが必須
}
```
