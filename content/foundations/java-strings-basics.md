---
name: 文字列とchar配列の基礎
category: プログラミング言語
subcategory: Java
masteryBadge: done
summary: JavaのStringはchar配列に近い内部構造を持つイミュータブルな参照型。charという専用のプリミティブ型も存在する。
---

## 概要

Javaは[C#](/foundations/csharp-strings-basics)と同様、`char`という1文字専用のプリミティブ型を持ち、`String`はイミュータブルな文字の列として実装されている。[Pythonのようにchar型を持たない言語](/foundations/python-strings-basics)とは異なり、C系の言語らしい明確な型の区別を保っている。

## 基礎文法

```java
String name = "Player";
char firstChar = name.charAt(0); // 'P' (charAt()メソッドでアクセス、配列のような[]は使えない)
// name.charAt(0) = 'X'; // エラー: Stringはイミュータブル、直接の書き換え不可

char[] chars = name.toCharArray(); // char配列に変換すれば書き換え可能
chars[0] = 'X';
String modified = new String(chars); // "Xlayer"

int length = name.length(); // メソッドとして呼び出す(配列のlengthはフィールドだが、Stringは異なる)
```

## つまずきやすい点

- `String`の`length()`はメソッド(括弧が必要)だが、[配列の`length`](/foundations/java-arrays-basics)はフィールド(括弧なし)という非対称性がある。この違いはJavaの初学者が最も頻繁に間違えるポイントの1つ
- `String`はC#と違い`[]`でのインデックスアクセスができず、`charAt(index)`メソッドを使う必要がある。配列と文字列で異なるアクセス方法を要求される点が、C#やPythonとの大きな違い
- 頻繁な文字列連結(`+=`)は、[C#のStringBuilder](/foundations/csharp-strings-basics)と同様に新しいStringオブジェクトを毎回生成し[ガベージコレクション](/foundations/java-garbage-collection-basics)の負荷を増やす。Javaでも同様に`StringBuilder`クラスを使うのが定石

## 実装例(コード)

```java
// StringBuilderを使った効率的な文字列構築
StringBuilder sb = new StringBuilder();
for (String item : items) {
    sb.append(item).append(", ");
}
String result = sb.toString();
```
