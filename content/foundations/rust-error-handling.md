---
name: Result型によるエラーハンドリング
category: プログラミング言語
subcategory: Rust
summary: 例外ではなく戻り値の型として成功/失敗を表現し、コンパイラにエラー処理を強制させる仕組み。
---

## 概要

Rustには例外機構がなく、失敗する可能性のある処理は`Result<T, E>`型(成功時は`Ok(T)`、失敗時は`Err(E)`)を返す。呼び出し側はこの`Result`を必ず何らかの形で処理しなければならず(未使用の警告が出る)、[Goのエラーハンドリング](/foundations/go-error-handling)に近い明示性を持つが、型システムによってより強く保証される。

## 基礎文法

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err("ゼロ除算はできません".to_string());
    }
    Ok(a / b)
}

match divide(10.0, 0.0) {
    Ok(value) => println!("結果: {}", value),
    Err(message) => println!("エラー: {}", message),
}
```

- `?`演算子: `Result`がエラーなら即座に呼び出し元へエラーを伝播させ、成功なら中身を取り出す糖衣構文

## つまずきやすい点

- `.unwrap()`は`Result`が`Err`だった場合に即座にパニック(プログラムのクラッシュ)を起こす。プロトタイピング中は便利だが、本番コードで安易に多用すると、想定外の入力でクラッシュしやすい脆いコードになる
- `?`演算子は、呼び出し元の関数も`Result`(または`Option`)を返す型である必要がある。`main`関数でそのまま使いたい場合は`main`の戻り値を`Result<(), Box<dyn Error>>`にする必要がある
- `Option<T>`(値があるかないか)と`Result<T, E>`(成功か失敗か、失敗理由付き)は似ているが目的が異なる。「値が存在しないことがエラーそのものなのか、単に無いのが正常な状態なのか」で使い分ける

## 実装例(コード)

```rust
fn read_config() -> Result<Config, io::Error> {
    let content = std::fs::read_to_string("config.toml")?; // エラーなら即座にreturn
    let config = parse_config(&content)?;
    Ok(config)
}
```
