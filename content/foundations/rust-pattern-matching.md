---
name: パターンマッチング(match式)
category: プログラミング言語
subcategory: Rust
masteryBadge: review
summary: 値の形に応じて分岐する強力な制御構文。網羅性がコンパイラによって強制される点が大きな特徴。
---

## 概要

`match`式は、値がどのパターンに合致するかで分岐するRustの制御構文。他言語の`switch`と似ているが、値の分解(デストラクチャリング)と組み合わせられる点、そして**全てのパターンを網羅していないとコンパイルエラーになる**点が大きく異なる。

## 基礎文法

```rust
enum FetchState {
    Loading,
    Error(String),
    Ready(Vec<String>),
}

fn describe(state: &FetchState) -> String {
    match state {
        FetchState::Loading => "読み込み中".to_string(),
        FetchState::Error(message) => format!("エラー: {}", message), // 値を取り出せる
        FetchState::Ready(items) => format!("{}件", items.len()),
    }
}
```

- `match`は式であり、各アームの評価結果が`match`全体の値になる
- 全パターンを網羅していない場合、コンパイラがエラーを出す(TypeScriptのタグ付きユニオンでの網羅性チェックが言語仕様として強制されるイメージ)

## つまずきやすい点

- `enum`に新しいバリアントを追加すると、それを網羅していない既存の`match`式が全てコンパイルエラーになる。一見面倒に思えるが、これにより「新しいケースへの対応漏れ」を実行前に確実に検出できる
- `_`(ワイルドカードパターン)で残りを全て一括で受けると、網羅性チェックの恩恵が薄れる。将来バリアントが増えても`_`が黙って吸収してしまい、対応漏れに気づけなくなることがある
- `if let`は`match`の「1パターンだけに興味がある」場合の簡潔な代替構文だが、多用すると本来`match`の網羅性チェックで防げたはずのケース漏れを見逃しやすくなる

## 実装例(コード)

```rust
// Option<T>に対するmatchはRustで非常に頻出するパターン
fn print_value(value: Option<i32>) {
    match value {
        Some(v) => println!("値: {}", v),
        None => println!("値なし"),
    }
}
```
