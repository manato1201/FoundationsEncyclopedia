---
name: 文字列の基礎(char型を持たない設計)
category: プログラミング言語
subcategory: Python
masteryBadge: done
summary: PythonにはC#やC++にあるchar(1文字専用の型)が存在せず、1文字も「長さ1の文字列」として扱われる。
---

## 概要

Pythonには、[C#](/foundations/csharp-strings-basics)や[C++](/foundations/cpp-strings-basics)にあるような「1文字を表す専用の型(char)」が存在しない。文字列(`str`)は最初からイミュータブルな文字のシーケンスであり、1文字を取り出しても、それは「長さ1の文字列」として扱われる。

## 基礎文法

```python
name = "Player"
first_char = name[0]    # "P" (これも str型。charという専用型ではない)
print(type(first_char))  # <class 'str'>

# str自体がイミュータブル(char配列のように直接書き換えられない)
# name[0] = "X"  # エラー: 'str' object does not support item assignment

chars = list(name)       # 1文字ずつのリストに変換すれば要素の書き換えが可能
chars[0] = "X"
modified = "".join(chars)  # "Xlayer"
```

## つまずきやすい点

- 「char型がない」ため、C#の`char[]`のような「文字の配列」を扱いたい場合は、文字列を`list()`で分解するか、`bytearray`のような別の型を使う必要がある。C系言語の「文字列は結局char配列」という前提知識がそのまま通用しない
- `str`はイミュータブルなため、C#の[文字列とchar配列の基礎](/foundations/csharp-strings-basics)と同様、ループ内での文字列連結(`+=`)は新しい文字列オブジェクトを毎回生成する。大量の連結には`"".join(list)`を使う方が効率的
- 日本語のような複数バイトを要する文字も、Pythonの`str`では「1文字=1要素」として扱われる(Python 3の文字列はUnicodeコードポイント単位)。C#の`char`がUTF-16コードユニット単位で、絵文字等でズレることがあるのとは異なる設計になっている

## 実装例(コード)

```python
# join()を使った効率的な文字列構築
items = ["Sort", "Search", "Tree"]
result = ", ".join(items)  # "Sort, Search, Tree"
```
