---
name: StringとStrの基礎
category: プログラミング言語
subcategory: Rust
masteryBadge: advanced
summary: Rustには所有権を持つStringと、借用した文字列スライスstrという2つの文字列型があり、この使い分けが最初の壁になる。
---

## 概要

Rustの文字列は、[所有権の基礎](/foundations/rust-ownership-basics)の考え方が最も色濃く表れる部分の1つ。ヒープ上に確保され所有権を持つ`String`型と、どこか(多くは`String`やプログラム自体)が所有するデータを「借用」した`&str`(文字列スライス)型の、2つの異なる型が存在する。

## 基礎文法

```rust
let s1: String = String::from("Hello"); // 所有権を持つ、可変長の文字列
let s2: &str = "Hello";                  // 文字列スライス(多くはプログラムに埋め込まれた不変のデータへの借用)

let mut owned = String::from("Hello");
owned.push_str(", World!"); // Stringは可変(mutが必要)

fn print_greeting(name: &str) { // &strを引数に取ると、StringでもリテラルでもOK
    println!("こんにちは、{}", name);
}
print_greeting(&owned); // Stringは&strへ自動的に借用される
print_greeting("Bob");   // 文字列リテラルはそのまま渡せる
```

## つまずきやすい点

- 「なぜ2つの文字列型があるのか」は、[所有権とムーブ](/foundations/rust-ownership-basics)を理解して初めて腑に落ちることが多い。`&str`は所有権を持たない「借用」であるため、関数の引数としては`String`より`&str`を使う方が、呼び出し元の所有権を奪わずに済み柔軟性が高い
- Rustの文字列はUTF-8でエンコードされており、[Goの文字列](/foundations/go-strings-basics)と同様、インデックス(`s[0]`)で直接1文字を取り出すことができない(バイト境界と文字境界が一致しない場合があるため)。文字単位で処理したい場合は`.chars()`メソッドでイテレータを取得する必要がある
- `String`から`&str`への変換(借用)は自動的に行われることが多いが、逆に`&str`から`String`を作るには`.to_string()`や`String::from()`のような明示的な変換が必要。この非対称性(片方向は自動、もう片方は手動)に最初は戸惑いやすい

## 実装例(コード)

```rust
// UTF-8の文字境界を意識した文字単位の走査
let s = "こんにちは";
for c in s.chars() {
    println!("{}", c); // 1文字ずつ正しく取得できる(バイト単位のインデックスとは異なる)
}
println!("{}", s.chars().count()); // 5 (文字数)
println!("{}", s.len());            // 15 (バイト数、日本語は1文字3バイト)
```
