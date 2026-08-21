---
name: for/whileループの基礎
category: プログラミング言語
subcategory: Java
masteryBadge: done
summary: JavaはC#と同様、for/while/do-while/拡張for(foreach相当)の4種類のループ構文を持つ。
---

## 概要

Javaのループ構文は[C#のfor/whileループの基礎](/foundations/csharp-loops-basics)と非常によく似ており、伝統的な`for`・`while`・`do-while`に加え、コレクションを簡潔に走査できる「拡張for文」(C#の`foreach`に相当)を持つ。

## 基礎文法

```java
// 伝統的なfor
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// while
int hp = 100;
while (hp > 0) {
    hp -= 10;
}

// do-while: 本体を必ず1回は実行する
int input;
do {
    input = readInput();
} while (input != -1);

// 拡張for文(for-each): コレクションの各要素を順に処理する
List<Integer> scores = List.of(90, 80, 70);
for (int score : scores) {
    System.out.println(score);
}
```

## つまずきやすい点

- 拡張for文でコレクションを走査しながら、そのコレクションに要素を追加・削除しようとすると`ConcurrentModificationException`が発生する。これは[Collectionsフレームワークの基礎](/foundations/java-collections-basics)で触れた`Iterator`の`remove()`メソッドを使うことで安全に回避できる
- ラベル付き`break`(`outer: for (...) { for (...) { break outer; } }`)を使うと、多重ループから一気に抜けられる。この構文を知らないと、フラグ変数を使った冗長な脱出処理を書いてしまいがちになる
- Javaの`for`文の3つの部分(初期化、条件、更新)には、カンマ区切りで複数の式を書ける(`for (int i = 0, j = 10; i < j; i++, j--)`)。あまり多用すると可読性が落ちるため、複雑になる場合は`while`文に書き直す方が読みやすいことが多い

## 実装例(コード)

```java
// ラベル付きbreakで多重ループから一気に抜ける例
outer:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j > 6) {
            break outer;
        }
    }
}
```
