---
name: 変数宣言と型の基礎
category: プログラミング言語
subcategory: Java
masteryBadge: done
summary: Javaは静的型付けで、プリミティブ型と参照型を明確に区別する。全ての変数は必ずどちらかに属する。
---

## 概要

Javaは[C#](/foundations/csharp-variables-and-types-basics)と同じ静的型付け言語で、変数は宣言時に型が確定する。Javaの型は「プリミティブ型」(`int`、`boolean`等、値そのものを保持する)と「参照型」(クラスのインスタンスへの参照を保持する)に明確に分かれており、この区別がJavaの設計の随所に影響している。

## 基礎文法

```java
int score = 100;          // プリミティブ型
double health = 99.5;
boolean isActive = true;
char grade = 'A';

String name = "Player";    // 参照型(Stringはプリミティブではなくクラス)

final int MAX_HP = 100;     // 再代入不可(C#のconstに近い)

var count = 10;              // 型推論(Java 10以降)。varは動的型ではない
```

## つまずきやすい点

- `String`は見た目こそプリミティブのように使えるが、実際には参照型(クラス)。`==`でStringを比較すると、内容ではなく参照(同一オブジェクトかどうか)を比較してしまうことがあり、内容を比較したい場合は`.equals()`を使う必要がある
- プリミティブ型には対応する「ラッパークラス」(`int`に対する`Integer`等)が存在し、[Collectionsフレームワーク](/foundations/java-collections-basics)のようにプリミティブを直接扱えない場面で自動的に変換される(オートボクシング)。この変換にはわずかなコストがあり、大量のループの中で意識せず発生すると性能に影響することがある
- Javaには「符号なし整数型」が(一部を除き)標準では存在しない。C++やC#の`unsigned int`に慣れていると、Javaで負にならない値を扱いたい場合の対処法(`Integer.toUnsignedLong`等)に戸惑うことがある

## 実装例(コード)

```java
// Stringの==比較の罠と正しい比較方法
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b);        // false (別オブジェクト)
System.out.println(a.equals(b));   // true (内容は同じ)
```
