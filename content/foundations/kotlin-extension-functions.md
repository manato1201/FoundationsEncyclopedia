---
name: 拡張関数
category: プログラミング言語
subcategory: Kotlin
summary: C#の拡張メソッドと同様、既存の型に後からメソッドを追加したかのように見せるKotlinの機能。
---

## 概要

Kotlinの拡張関数は、既存のクラス(自作クラスだけでなく標準ライブラリの型も含む)に対して、そのソースコードを変更せずに新しいメソッドを追加できる機能。[C#の拡張メソッド](/foundations/csharp-extension-methods)と発想は同じで、Android開発やKotlin標準ライブラリ自体(`String`の`isNotEmpty()`等)でも多用されている。

## 基礎文法

```kotlin
fun String.isValidEmail(): Boolean {
    return this.contains("@") && this.contains(".")
}

val email = "user@example.com"
if (email.isValidEmail()) { // あたかもStringのメンバー関数のように呼べる
    println("有効なメールアドレスです")
}
```

- 関数名の前に「拡張対象の型.」を付けることで拡張関数になる
- 関数内では`this`で拡張対象のインスタンスを参照できる

## つまずきやすい点

- 拡張関数は静的に解決される(コンパイル時にどの拡張関数が呼ばれるか決まる)。継承関係にあるクラスに対して、実際の実行時の型ではなく、変数の宣言時の型に基づいて拡張関数が選ばれるため、多態性(オーバーライド)を期待すると意図と異なる挙動になることがある
- 拡張関数はその型の`private`メンバーにはアクセスできない。あくまで外部から見えるAPIを使ってロジックを組み立てるものであり、カプセル化を破壊するものではない
- プロジェクト全体で同名の拡張関数が複数の場所に定義されていると、`import`の状況によって呼ばれる関数が変わり、意図しない挙動を招くことがある

## 実装例(コード)

```kotlin
fun List<Int>.average2(): Double {
    if (isEmpty()) return 0.0
    return sum().toDouble() / size
}

listOf(1, 2, 3).average2() // 2.0
```
