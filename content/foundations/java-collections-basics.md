---
name: Collectionsフレームワークの基礎
category: プログラミング言語
subcategory: Java
masteryBadge: review
summary: List/Set/Mapという3つの基本インターフェースを軸にした、Java標準のコレクション体系。
---

## 概要

JavaのCollectionsフレームワークは、複数の要素を扱うためのインターフェースと実装クラスの体系。用途に応じて`List`(順序付き、重複可)、`Set`(重複なし)、`Map`(キーと値の対応)という3つの基本インターフェースから選ぶ。

## 基礎文法

```java
List<String> names = new ArrayList<>();  // 順序付き、インデックスアクセス可、重複可
names.add("Alice");

Set<String> uniqueNames = new HashSet<>(); // 重複を自動的に排除する
uniqueNames.add("Alice");

Map<String, Integer> scores = new HashMap<>(); // キー→値の対応
scores.put("Alice", 100);
```

- `ArrayList`: 内部的に配列を使う。ランダムアクセスは速いが、途中への挿入・削除は遅い
- `LinkedList`: 内部的に連結リストを使う。途中への挿入・削除は速いが、ランダムアクセスは遅い
- `HashMap`: ハッシュテーブルベース。挿入順序は保証されない
- `LinkedHashMap`: 挿入順序を保持するHashMap

## つまずきやすい点

- `ArrayList`と`LinkedList`のどちらを使うべきかは、実際のアクセスパターン(ランダムアクセスが多いか、挿入削除が多いか)に依存する。「連結リストの方が挿入が速いから常に有利」という思い込みは誤りで、多くの実務ケースでは`ArrayList`の方がキャッシュ効率がよく総合的に速いことが多い
- `HashMap`のキーに使うオブジェクトは、`equals()`と`hashCode()`を一貫して(両方とも、あるいはどちらも定義しない形で)オーバーライドする必要がある。片方だけオーバーライドすると、意図した通りにキーの一致判定が行われなくなる
- for-eachループでコレクションを走査しながら要素を削除すると`ConcurrentModificationException`が発生する。走査中に削除したい場合は`Iterator`の`remove()`メソッドを使う必要がある

## 実装例(コード)

```java
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    String name = it.next();
    if (name.isEmpty()) {
        it.remove(); // 走査中でも安全に削除できる
    }
}
```
