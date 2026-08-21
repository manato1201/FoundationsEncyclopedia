---
name: 自作関数の基礎
category: プログラミング言語
subcategory: Go
masteryBadge: done
summary: Goの関数は複数の戻り値を返せる点が最大の特徴。エラーハンドリングの慣習と密接に結びついている。
---

## 概要

Goの関数定義は`func`キーワードで始まる。最大の特徴は、[C#](/foundations/csharp-custom-functions-basics)や多くの言語と異なり、1つの関数が複数の値を同時に返せる点で、この機能は[Goのエラーハンドリング](/foundations/go-error-handling)の「`(結果, error)`を返す」という慣習の土台になっている。

## 基礎文法

```go
func add(a int, b int) int {
    return a + b
}

// 同じ型の引数はまとめて書ける
func multiply(a, b int) int {
    return a * b
}

// 複数の戻り値
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("ゼロ除算はできません")
    }
    return a / b, nil
}

// 名前付き戻り値
func minMax(numbers []int) (min, max int) {
    min, max = numbers[0], numbers[0]
    for _, n := range numbers {
        if n < min { min = n }
        if n > max { max = n }
    }
    return // 名前付き戻り値は明示的な値なしでreturnできる
}
```

## つまずきやすい点

- Goには関数のオーバーロード(同じ名前で引数の型・数が異なる複数の関数を定義すること)がない。[C#](/foundations/csharp-custom-functions-basics)や[Java](/foundations/java-custom-functions-basics)に慣れていると不便に感じるが、関数名を変える、または可変長引数(`...int`)で代用するのがGoの流儀
- 複数の戻り値のうち一部だけを使いたい場合でも、Goでは基本的に全ての戻り値を受け取る必要がある(使わない値は`_`で明示的に無視する)。この省略できない設計により、「エラーを返す関数なのに、エラーチェックを忘れる」というミスを構造的に減らしている
- 関数自体も値として変数に代入したり、他の関数の引数として渡したりできる(第一級関数)。[Goroutineの基礎](/foundations/go-goroutines-basics)で`go func(...) { ... }()`のように無名関数を直接起動できるのは、この性質を利用している

## 実装例(コード)

```go
// 複数戻り値のうち一部だけを使う(_で明示的に無視する)
_, max := minMax([]int{3, 1, 4, 1, 5})
fmt.Println(max) // 5
```
