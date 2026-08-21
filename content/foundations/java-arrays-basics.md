---
name: 配列の基礎
category: プログラミング言語
subcategory: Java
masteryBadge: done
summary: Javaの配列は固定長で、C#の配列と非常によく似た性質を持つ。可変長にはArrayListを使う。
---

## 概要

Javaの配列は[C#の配列の基礎](/foundations/csharp-arrays-basics)と非常によく似ており、宣言時にサイズが固定される連続領域。参照型として扱われ、要素数を後から変更したい場合は[Collectionsフレームワーク](/foundations/java-collections-basics)の`ArrayList`を使うのが実務的。

## 基礎文法

```java
int[] scores = new int[5];         // 要素数5の配列(各要素は0で初期化される)
int[] fixedScores = {90, 80, 70};   // 初期値付き

scores[0] = 100;    // インデックスは0始まり
int length = scores.length; // 要素数の取得(メソッドではなくフィールド)
```

- `int[] arr`と`int arr[]`はどちらも有効な記法だが、前者(型の後に`[]`を付ける)がJavaの慣習として推奨される

## つまずきやすい点

- 配列の要素数は`scores.length`という「フィールド」であり、C#の`Length`(プロパティ)や、[ArrayListの`.size()`](/foundations/java-collections-basics)(メソッド)とは書き方が異なる。この3つを混同して`scores.length()`や`list.length`と書いてしまうコンパイルエラーは初学者に非常に多い
- 配列の範囲外アクセスは`ArrayIndexOutOfBoundsException`という実行時例外になる。C#の`IndexOutOfRangeException`と役割は同じだが、名前が異なるため、エラーメッセージを検索する際に注意が必要
- 配列は共変性(covariance、`Object[]`に`String[]`を代入できる)を持つが、この柔軟性が実行時エラーの原因になることがある。`Object[] objs = new String[3]; objs[0] = 42;`のようなコードは、コンパイルは通るが実行時に`ArrayStoreException`が発生する

## 実装例(コード)

```java
// 配列のコピーはArraysユーティリティクラスを使うのが一般的
int[] original = {1, 2, 3};
int[] copy = Arrays.copyOf(original, original.length);
```
