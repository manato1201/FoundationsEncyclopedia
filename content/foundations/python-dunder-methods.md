---
name: 特殊メソッド(dunderメソッド)
category: プログラミング言語
subcategory: Python
summary: __init__や__str__のような前後にアンダースコア2つを持つメソッド。演算子や組み込み関数の挙動をカスタマイズする。
---

## 概要

特殊メソッド(dunderメソッド、"double underscore"の略)は、`__init__`・`__str__`・`__eq__`のように前後を2つのアンダースコアで囲まれたメソッド名の総称。Pythonの演算子(`+`、`==`等)や組み込み関数(`len()`、`str()`等)は、対応する特殊メソッドを裏で呼び出すことで動作している。

## 基礎文法

```python
class Vector2:
    def __init__(self, x: float, y: float):
        self.x, self.y = x, y

    def __add__(self, other: "Vector2") -> "Vector2":
        return Vector2(self.x + other.x, self.y + other.y)  # + 演算子をサポート

    def __repr__(self) -> str:
        return f"Vector2({self.x}, {self.y})"  # print()やreplでの表示形式

v = Vector2(1, 2) + Vector2(3, 4)  # __add__が呼ばれる
print(v)  # __repr__が呼ばれ Vector2(4, 6) と表示
```

## つまずきやすい点

- `__eq__`(`==`の挙動)を定義すると、Pythonはデフォルトのハッシュ可能性を無効化する。辞書のキーや集合の要素として使いたい場合は`__hash__`も併せて定義する必要がある
- `__str__`と`__repr__`は役割が異なる。`__str__`は人間向けの読みやすい表示、`__repr__`はデバッグ用途で「可能ならそのコードを評価すれば同じオブジェクトが作れる」形式が推奨される。`__str__`が未定義だと`__repr__`が代わりに使われる
- 特殊メソッドを使いすぎると、通常の演算子の挙動から予想しにくい「独自ルール」を持つクラスになりがちで、コードを読む側の負担が増える。数学的なベクトル・行列のように直感的な対応がある場合に限定するのが安全

## 実装例(コード)

```python
class Deck:
    def __init__(self, cards: list[str]):
        self.cards = cards

    def __len__(self) -> int:
        return len(self.cards)  # len(deck) で呼ばれる

    def __getitem__(self, index: int) -> str:
        return self.cards[index]  # deck[0] で呼ばれる
```
