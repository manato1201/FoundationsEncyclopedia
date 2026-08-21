---
name: 自作関数の基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: review
summary: Rustの関数はfnで定義し、最後の式がセミコロンなしで書かれていれば、それが暗黙的な戻り値になる。
---

## 概要

Rustの関数は`fn`キーワードで定義する。[C#](/foundations/csharp-custom-functions-basics)や[Go](/foundations/go-custom-functions-basics)のように`return`で明示的に戻り値を返すこともできるが、Rust独自の性質として、関数本体(ブロック)の最後の式がセミコロンなしで書かれていれば、それが自動的に戻り値になる。

## 基礎文法

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b // セミコロンなし: これが暗黙的な戻り値になる
}

fn add_explicit(a: i32, b: i32) -> i32 {
    return a + b; // returnを明示することもできる(早期returnで特に使われる)
}

fn greet(name: &str) -> String { // &str: 借用した文字列スライス(引数として一般的)
    format!("こんにちは、{}さん", name)
}
```

## つまずきやすい点

- 関数の最後の行にうっかりセミコロンを付けてしまうと、その式は「文」として扱われ、値を返さなくなる(戻り値が`()`、いわゆるunit型になる)。戻り値の型を`-> i32`のように宣言しているのにセミコロンを付けてしまうと、コンパイルエラーになる。「式と文の違い」を理解することがRustの関数を書く上で重要になる
- Rustにはデフォルト引数や関数のオーバーロードが(直接的には)ない。[Goに関数オーバーロードがない](/foundations/go-custom-functions-basics)のと同様の設計判断で、複数のパターンに対応したい場合は、引数を`Option<T>`にする、トレイトを使う、複数の関数名を使い分けるといった方法で対処する
- 引数として`&str`(文字列スライス、借用)を受け取るか、`String`(所有権を持つ文字列)を受け取るかで、呼び出し元への影響が変わる。[所有権の基礎](/foundations/rust-ownership-basics)を理解していないと、なぜ多くの関数が`String`ではなく`&str`を引数に取るのか(呼び出し元の所有権を奪わずに済むため)が分かりにくい

## 実装例(コード)

```rust
// 早期returnとブロック末尾の暗黙の戻り値を組み合わせる例
fn classify(score: i32) -> &'static str {
    if score < 0 {
        return "無効なスコア"; // 早期returnには明示的なreturnが必要
    }
    if score >= 90 { "優秀" } else { "普通" } // if式自体が値を返す
}
```
