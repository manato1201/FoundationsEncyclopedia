---
name: データクラス
category: プログラミング言語
subcategory: Kotlin
summary: equals/hashCode/toString/copyを自動生成してくれる、値の入れ物としてのクラス定義を簡潔にする機能。
---

## 概要

`data class`は、値を保持するだけのクラスを簡潔に定義できるKotlinの機能。`equals()`/`hashCode()`/`toString()`/`copy()`といった、通常であれば手書きが面倒なメソッド群をコンパイラが自動生成してくれる。

## 基礎文法

```kotlin
data class Point(val x: Int, val y: Int)

val p1 = Point(1, 2)
val p2 = Point(1, 2)

println(p1 == p2)          // true (自動生成されたequalsで値が比較される)
println(p1)                // Point(x=1, y=2) (自動生成されたtoString)

val p3 = p1.copy(y = 99)   // yだけ書き換えたコピーを作る(copy)
```

## つまずきやすい点

- `data class`が自動生成する`equals`/`hashCode`は、コンストラクタで宣言されたプロパティのみを対象にする。コンストラクタ外で追加した`var`プロパティは比較対象に含まれないため、「等しいはずなのに`==`がfalseになる」逆のケースに気づきにくいことがある
- `copy()`は浅いコピー(shallow copy)であるため、プロパティがミュータブルなオブジェクト(可変リスト等)を参照している場合、`copy()`後もその参照先は元のインスタンスと共有されたままになる
- 継承を前提とした設計(`open class`を継承する等)には`data class`はあまり向かない。値の入れ物としてのシンプルな用途に限定して使うのが基本

## 実装例(コード)

```kotlin
data class FoundationsEntry(
    val id: String,
    val name: String,
    val masteryBadge: String? = null,
)

val updated = entry.copy(masteryBadge = "done") // idとnameは元のまま、masteryBadgeだけ変更
```
