---
name: 文字列とruneの基礎
category: プログラミング言語
subcategory: Go
masteryBadge: review
summary: Goの文字列はUTF-8のバイト列。char型は存在せず、1文字を扱うにはruneという専用の型を使う。
---

## 概要

Goの文字列(`string`)は、内部的にはUTF-8でエンコードされたバイト列で、[C#のchar型](/foundations/csharp-strings-basics)のような専用の1文字型は存在しない。代わりに、Unicodeのコードポイント1つを表す`rune`(実体は`int32`のエイリアス)という型を使って、1文字単位の処理を行う。

## 基礎文法

```go
s := "こんにちは"
fmt.Println(len(s))  // バイト数を返す(文字数ではない! 日本語は1文字3バイト)

// runeとして文字単位で走査する
for i, r := range s {
    fmt.Printf("%d: %c\n", i, r) // rはrune(文字)、iはバイト単位のインデックス
}

runes := []rune(s)      // rune配列に変換すれば文字数を正しく数えられる
fmt.Println(len(runes))  // 5 (文字数)
```

## つまずきやすい点

- `len(s)`は「バイト数」を返すのであって「文字数」ではない。ASCII文字だけなら両者は一致するが、日本語のようなマルチバイト文字を含む文字列では、この違いに気づかずインデックス操作をすると、文字の途中で切ってしまい文字化けを起こすことがある
- `s[0]`のようにインデックスでアクセスすると、`byte`(1バイト)が返る。日本語文字の途中のバイトを取得してしまうことがあり、1文字を安全に取得したい場合は`for range`によるrune単位の走査か、`[]rune(s)`への変換が必要になる
- Goの文字列はイミュータブル([Pythonの文字列](/foundations/python-strings-basics)や[Javaの文字列](/foundations/java-strings-basics)と同様)。頻繁な連結には`strings.Builder`を使うのが、GoにおけるStringBuilder相当の定石

## 実装例(コード)

```go
// strings.Builderを使った効率的な文字列構築
var sb strings.Builder
for _, item := range items {
    sb.WriteString(item)
    sb.WriteString(", ")
}
result := sb.String()
```
