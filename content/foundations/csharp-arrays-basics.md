---
name: 配列の基礎
category: プログラミング言語
subcategory: C#
masteryBadge: done
summary: C#の配列は固定長で、宣言時にサイズを決める。可変長が必要な場合はList<T>を使う。
---

## 概要

C#の配列(`T[]`)は、宣言時にサイズが固定される連続したメモリ領域。[配列と連結リストの違い](/foundations/array-vs-linked-list)で扱った通り、インデックスによるアクセスがO(1)で高速な反面、要素数を後から変更できない。可変長が必要な場合は`List<T>`を使うのが実務では一般的。

## 基礎文法

```csharp
int[] scores = new int[5];        // 要素数5の配列(各要素は0で初期化される)
int[] fixedScores = { 90, 80, 70 }; // 初期値を指定して作成(要素数は自動で3)

scores[0] = 100;   // インデックスは0始まり
int first = scores[0];
int length = scores.Length; // 要素数の取得
```

## つまずきやすい点

- 配列のインデックスは0から始まり、末尾は`Length - 1`になる。`scores[scores.Length]`のように末尾+1にアクセスすると`IndexOutOfRangeException`が発生する
- 配列は宣言時のサイズで固定される。要素を追加・削除したい場合、配列自体にはその機能がなく、`Array.Resize`(内部で新しい配列を作り直す、コストの高い操作)を使うか、そもそもList&lt;T&gt;のような[可変長のコレクション](/foundations/java-collections-basics)を使うべき
- 配列は参照型として扱われる(要素の型が値型でも、配列そのものは参照型)。配列を関数に渡すと、その配列の参照が渡されるため、関数内での要素の書き換えは呼び出し元にも反映される

## 実装例(コード)

```csharp
// 配列を関数に渡すと、中身の変更は呼び出し元にも反映される
void DoubleAll(int[] arr)
{
    for (int i = 0; i < arr.Length; i++)
    {
        arr[i] *= 2;
    }
}

int[] numbers = { 1, 2, 3 };
DoubleAll(numbers);
// numbers は { 2, 4, 6 } になっている
```
