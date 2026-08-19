---
name: Null安全性
category: プログラミング言語
subcategory: Kotlin
masteryBadge: done
summary: 型が「nullになりうるか」を明示させることで、NullPointerExceptionをコンパイル時に大幅に減らす仕組み。
---

## 概要

Kotlinは型システムのレベルでnull許容型(`String?`)と非null型(`String`)を区別する。JavaのNullPointerException(通称NPE)が「10億ドルの失敗」と呼ばれるほど頻発した反省から設計されており、非null型の変数にはコンパイラがnullの代入を許さない。

## 基礎文法

```kotlin
var name: String = "Player"   // 非null型: nullを代入するとコンパイルエラー
var nickname: String? = null  // null許容型: nullを許容する

// 安全呼び出し演算子: nullなら式全体がnullになる(例外にならない)
val length = nickname?.length

// エルビス演算子: nullの場合のデフォルト値を指定
val displayName = nickname ?: "名無し"
```

## つまずきやすい点

- `!!`(non-null assertion演算子)は、null許容型を強制的に非null型として扱う。実際にnullだった場合はNPEが発生するため、Kotlinのnull安全性の恩恵を自ら手放す使い方になる。可能な限り`?.`や`?:`で安全に扱う方が望ましい
- KotlinからJavaのコード(null許容注釈のない古いAPI等)を呼び出す場合、その戻り値は「プラットフォーム型」という特殊な扱いになり、コンパイラのnullチェックが効かなくなる。Java境界でのnull安全性はプログラマの注意に委ねられる
- `let`と組み合わせた`nickname?.let { ... }`のようなイディオムは、「nullでなければブロックを実行する」という意味で頻出するが、ネストが深くなると可読性が落ちるため多用は避けたい

## 実装例(コード)

```kotlin
fun greet(name: String?) {
    val greeting = name?.let { "こんにちは、$it さん" } ?: "こんにちは、ゲストさん"
    println(greeting)
}
```
