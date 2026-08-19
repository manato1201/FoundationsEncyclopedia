---
name: Stream APIの基礎
category: プログラミング言語
subcategory: Java
summary: コレクションに対するフィルタ・変換・集計を宣言的に書けるJava 8以降の機能。C#のLINQに近い発想。
---

## 概要

Stream APIは、コレクションの要素に対する一連の操作(絞り込み・変換・集計)を、for文を使わず宣言的なメソッドチェーンとして書ける機能。[C#のLINQ](/foundations/csharp-linq-basics)と発想は近いが、Streamは一度しか使えない(消費型)という違いがある。

## 基礎文法

```java
List<String> names = List.of("Alice", "Bob", "Charlie", "Dave");

List<String> result = names.stream()
    .filter(name -> name.length() > 3) // 絞り込み
    .map(String::toUpperCase)          // 変換
    .sorted()                          // 並び替え
    .collect(Collectors.toList());     // Listとして収集
```

- `filter`: 条件に合う要素だけを残す
- `map`: 各要素を別の形に変換する
- `collect`: Stream操作の結果を`List`/`Set`/`Map`等に集約する

## つまずきやすい点

- Streamは一度`collect`や`forEach`などの終端操作を行うと消費され、再利用できない。同じStreamに対して2回操作しようとすると`IllegalStateException`が発生する
- `filter`や`map`のような中間操作は遅延評価される。終端操作が呼ばれるまで実際には何も実行されないため、「Streamを組み立てた時点で処理が走るはず」という思い込みでデバッグに詰まることがある(Pythonのジェネレータの遅延評価と同じ発想)
- 並列Stream(`parallelStream()`)は簡単に並列処理を書けるように見えるが、要素数が少ない場合や、操作の中に副作用(共有状態への書き込み)がある場合は、逐次処理より遅くなったり、データ競合を起こしたりすることがある

## 実装例(コード)

```java
// 集計の例: 名前の合計文字数を求める
int totalLength = names.stream()
    .mapToInt(String::length)
    .sum();
```
