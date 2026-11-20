---
name: "コレクション(List・Set・Map)の基礎"
category: プログラミング言語
subcategory: "Kotlin"
summary: "Kotlinの標準のコレクションは、読み取り専用の List・Set・Map と、変更できる Mutable 版の2系統。map や filter で変換できる。"
claim: "listOf は読み取り専用、mutableListOf は変更可能。型で、変更の可否を使い分ける。"
operationSteps:
  - label: "読み取り専用で作る"
    note: "`listOf(1, 2, 3)`・`setOf(...)`・`mapOf(\"a\" to 1)` は、要素を追加・削除するメソッドを持たない"
  - label: "変更できる版で作る"
    note: "`mutableListOf()`・`mutableMapOf()` などは、add や put で、要素を変えられる"
  - label: "要素を読む"
    note: "List は `list[0]`、Map は `map[\"a\"]`(なければ null)で読む"
  - label: "filterで絞り込む"
    note: "`list.filter { it > 1 }` は、条件に合う要素だけの新しいコレクションを返す"
  - label: "mapで変換する"
    note: "`list.map { it * 2 }` は、各要素を変換した新しいリストを返す。元は変わらない"
quiz:
  - question: "listOf で作ったリストに、add で要素を追加できるか"
    choices:
      - "できる"
      - "実行時にだけエラーになる"
      - "できない(add メソッドがない)"
    answer: 2
    explanation: "listOf は List 型を返し、List には add がない。コンパイル時にエラーになる。追加したいなら mutableListOf を使う。"
---

## 概要

Kotlinのコレクションは、**読み取り専用**のインターフェース(`List`・`Set`・`Map`)と、**変更可能**のインターフェース(`MutableList`・`MutableSet`・`MutableMap`)に分かれている。基本は読み取り専用で作り、本当に変える必要がある箇所だけを変更可能にすると、意図しない変更が減る。`map`・`filter`などの操作は、元を変えずに、新しいコレクションを返す。

## 基礎文法

| 種類 | 読み取り専用 | 変更可能 |
| --- | --- | --- |
| 並び(順序あり、重複可) | listOf | mutableListOf |
| 集合(重複なし) | setOf | mutableSetOf |
| 対応表(キーと値) | mapOf | mutableMapOf |

- `"a" to 1`は、`Pair`を作る書き方。`mapOf`に並べて渡す
- ラムダの引数が1つのとき、`it`で参照できる
- `for (x in list)`で、要素を順に取り出せる

## つまずきやすい点

- 「読み取り専用」は「絶対に変わらない」とは違う。同じ実体を、変更可能な型の別の変数から変えられると、読み取り専用の側からも、変化が見える
- `map[key]`は、キーがなければ`null`を返す型(`Int?`)になる。`null`の扱いは[Null安全性](/foundations/kotlin-null-safety)の章を参照
- `filter`や`map`は、そのたびに新しいコレクションを作る。大きなデータを何度も連鎖させると無駄が出る。その場合は`asSequence()`で、遅延評価にする方法がある
- 空の`List`に`first()`を呼ぶと、例外になる。安全に取るなら、`firstOrNull()`を使う

## 実装例(コード)

```kotlin
fun main() {
    val names = listOf("Ann", "Bob", "Cid")             // 読み取り専用
    val scores = mutableMapOf("Ann" to 80, "Bob" to 65) // 変更可能
    scores["Cid"] = 90                                  // 追加

    println(names.map { it.uppercase() })               // [ANN, BOB, CID]
    val high = scores.filter { it.value >= 80 }.keys
    println(high)                                       // [Ann, Cid]
    println(scores["Zed"])                              // null(キーがない)
}
```
