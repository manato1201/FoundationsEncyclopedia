---
name: Sealed Classes
category: プログラミング言語
subcategory: Kotlin
masteryBadge: next
summary: 継承できるサブクラスをコンパイル時に限定し、when式での網羅性チェックを可能にするKotlinの機能。
---

## 概要

`sealed class`(またはKotlin 1.5以降の`sealed interface`)は、そのサブクラスを同じファイル(またはモジュール)内に限定するクラス。TypeScriptの[タグ付きユニオン](/foundations/typescript-discriminated-unions)やRustの[enumとmatch](/foundations/rust-pattern-matching)に近い発想で、「ありうる全パターン」をコンパイラが把握できるようにする。

## 基礎文法

```kotlin
sealed class FetchState {
    object Loading : FetchState()
    data class Error(val message: String) : FetchState()
    data class Ready(val items: List<String>) : FetchState()
}

fun describe(state: FetchState): String = when (state) {
    is FetchState.Loading -> "読み込み中"
    is FetchState.Error -> "エラー: ${state.message}"
    is FetchState.Ready -> "${state.items.size}件"
    // elseブロックは不要。全パターンを網羅していればコンパイラがチェックしてくれる
}
```

## つまずきやすい点

- 通常の(`sealed`でない)継承では、`when`式が全サブクラスを網羅しているかコンパイラは検証できない。`sealed`にすることで初めて「新しいサブクラスを追加したのに、既存の`when`式の対応が漏れている」ことをコンパイルエラーとして検出できるようになる
- `when`式に`else`ブランチを付けてしまうと、この網羅性チェックの恩恵が失われる。将来サブクラスが増えても`else`が黙って吸収してしまい、対応漏れに気づけなくなる
- `sealed class`のサブクラスは同じモジュール内に限定されるため、ライブラリの利用者が独自のサブクラスを追加するような拡張性は意図的に持たない設計になっている。外部からの拡張を想定するなら通常の`open class`やインターフェースを使うべき

## 実装例(コード)

```kotlin
// 新しいサブクラスAuthErrorを追加すると、既存のdescribe()がコンパイルエラーになり対応漏れを防げる
data class AuthError(val code: Int) : FetchState()
```
