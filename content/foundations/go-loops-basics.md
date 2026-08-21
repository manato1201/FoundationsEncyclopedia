---
name: for文の基礎(whileが存在しない言語)
category: プログラミング言語
subcategory: Go
masteryBadge: done
summary: GoにはC#やC++にあるwhile文が存在せず、forという1つのキーワードだけで全てのループを表現する。
---

## 概要

Goの最大の特徴の1つは、[C#](/foundations/csharp-loops-basics)や[C++](/foundations/cpp-loops-basics)にある`while`・`do-while`という別々のキーワードが存在せず、`for`という1つのキーワードだけで全ての繰り返しパターンを表現することにある。「言語をできるだけ単純に保つ」というGoの設計思想が、この統一に表れている。

## 基礎文法

```go
// 伝統的なfor(初期化、条件、更新の3部構成)
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// while相当(条件部分だけを書く)
hp := 100
for hp > 0 {
    hp -= 10
}

// 無限ループ(条件部分すら省略する)
for {
    if shouldStop() {
        break
    }
}

// range: コレクションを走査する(C#のforeachに相当)
scores := []int{90, 80, 70}
for i, score := range scores {
    fmt.Println(i, score)
}
```

## つまずきやすい点

- `while`というキーワードを探してもGoには存在しない。C#やPython出身の開発者が最初につまずくポイントで、「条件だけを書いた`for`」がwhileの役割を果たすことを知らないと、意図した繰り返し処理の書き方が分からず戸惑う
- `range`でスライス([スライスと配列の違い](/foundations/go-slices-vs-arrays)参照)を走査する際、2つ目の戻り値(要素の値)は「コピー」であることが多い(Go 1.22より前のバージョンでは特に、ループ変数自体が使い回されることに起因する罠があった)。要素そのものを変更したい場合は、インデックスを使って`scores[i]`のようにアクセスする必要がある
- Goの`for`ループの条件式には、C系言語のような`&&`/`||`と`i++`を1つの式にまとめて書く自由度が低い(複合代入や複数条件をシンプルに書きにくい)。複雑な繰り返し条件は、ループの外や中で明示的な変数・関数として整理するスタイルが好まれる

## 実装例(コード)

```go
// range でインデックスだけ、または値だけを受け取る書き方
for i := range scores {       // インデックスだけ
    fmt.Println(i)
}
for _, score := range scores { // 値だけ(インデックスは _ で無視)
    fmt.Println(score)
}
```
