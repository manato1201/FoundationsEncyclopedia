---
name: インターフェースの基礎
category: プログラミング言語
subcategory: Go
summary: 「このメソッド群を実装していればOK」という暗黙的な契約。implementsキーワードを持たないGo独自の設計。
---

## 概要

Goのインターフェースは、メソッドのシグネチャの集合を定義する型。他の多くの言語と異なり、Goには`implements`のような明示的な宣言がなく、そのインターフェースが要求するメソッドを全て実装していれば、自動的にそのインターフェースを満たしたことになる(構造的部分型、structural typing)。

## 基礎文法

```go
type Stringer interface {
    String() string
}

type Point struct{ X, Y int }

// implementsという宣言なしに、Stringメソッドを実装するだけでStringerを満たす
func (p Point) String() string {
    return fmt.Sprintf("(%d, %d)", p.X, p.Y)
}

func printIt(s Stringer) {
    fmt.Println(s.String())
}

printIt(Point{1, 2}) // Pointは暗黙的にStringerを満たしている
```

## つまずきやすい点

- 「実装していれば自動的に満たされる」という性質上、そのインターフェースを満たしているかどうかはコンパイラが構造を見て判定する。ある型が意図せず別のインターフェースを満たしてしまう(あるいは満たしていないつもりが実は満たしている)ことに気づきにくい場合がある
- 巨大なインターフェース(メソッドが多数)を定義すると、それを満たすために不要な実装を強制されがちになる。Go標準ライブラリの`io.Reader`(メソッド1つ)のように「小さなインターフェースを組み合わせる」設計が推奨される
- 空のインターフェース`interface{}`(Go 1.18以降は`any`)は「どんな型でも受け入れる」ため便利だが、型安全性を失う。可能な限り具体的なインターフェースやジェネリクスで置き換える方が、コンパイル時にミスを検出できる

## 実装例(コード)

```go
// 標準ライブラリの小さなインターフェースの例
type Writer interface {
    Write(p []byte) (n int, err error)
}
// io.Writerを満たす型は、ファイル・ネットワーク接続・バッファなど非常に多岐にわたる
```
