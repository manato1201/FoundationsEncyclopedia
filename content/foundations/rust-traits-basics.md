---
name: トレイトの基礎
category: プログラミング言語
subcategory: Rust
summary: 型が実装すべき振る舞いの集合を定義する仕組み。他言語のインターフェースに近いが、既存の型に後から実装を追加できる。
---

## 概要

トレイト(trait)は、型が実装すべきメソッドの集合を定義する仕組みで、他言語のインターフェースに相当する。Rust特有の点として、自分が定義していない既存の型(標準ライブラリの型など)に対しても、自分で定義したトレイトを実装できる(ただし孤児ルールという制約がある)。

## 基礎文法

```rust
trait Describable {
    fn describe(&self) -> String;
}

struct Enemy {
    name: String,
    hp: i32,
}

impl Describable for Enemy {
    fn describe(&self) -> String {
        format!("{}(HP: {})", self.name, self.hp)
    }
}

fn print_description(item: &impl Describable) { // トレイトを実装した型なら何でも受け取れる
    println!("{}", item.describe());
}
```

## つまずきやすい点

- 「孤児ルール(orphan rule)」により、外部クレートで定義された型に対して、外部クレートで定義されたトレイトを実装することはできない(自分のクレートで定義したトレイトか型のどちらかが必要)。既存の型に機能を足したいだけなのに、この制約に阻まれることがある
- トレイトのデフォルトメソッド(実装済みのメソッド)は便利だが、実装する型側で意図せずそのままにしてしまい、その型にとって不適切な挙動になっていることに気づきにくい場合がある
- `dyn Trait`(トレイトオブジェクト、実行時多態性)と`impl Trait`(コンパイル時に型が確定するジェネリクス)は似た書き方に見えるが、内部の仕組みとパフォーマンス特性が異なる。動的ディスパッチが必要な場面(異なる型を同じコレクションに入れたい等)以外では`impl Trait`やジェネリクスの方が高速

## 実装例(コード)

```rust
// 異なる型を同じVecに入れたい場合はdyn Traitが必要
let items: Vec<Box<dyn Describable>> = vec![
    Box::new(Enemy { name: "Slime".to_string(), hp: 10 }),
];
```
