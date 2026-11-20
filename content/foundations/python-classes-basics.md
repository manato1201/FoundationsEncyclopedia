---
name: "クラスの基礎(Python)"
category: プログラミング言語
subcategory: "Python"
summary: "データとそれを扱う処理をひとまとめにする設計図。`class` で定義し、呼び出して実体(インスタンス)を作る。"
claim: "クラスは設計図、インスタンスはそこから作った実物。`self` は、そのインスタンス自身。"
operationSteps:
  - label: "classで設計図を書く"
    note: "`class Player:` の中に、データの初期化とメソッドを書く"
  - label: "__init__で初期値を決める"
    note: "インスタンスを作るときに自動で呼ばれる。`self.hp = hp` のように、持たせるデータを設定する"
  - label: "インスタンスを作る"
    note: "`p = Player(\"A\", 100)` のように、クラス名を関数のように呼ぶ"
  - label: "メソッドを呼ぶ"
    note: "`p.damage(30)` のように呼ぶと、呼んだインスタンスが `self` として渡される"
  - label: "インスタンスごとに値が別になる"
    note: "`q = Player(\"B\", 80)` は、p とは別のデータを持つ。p の変更は q に影響しない"
quiz:
  - question: "メソッドの最初の引数 self は何を指すか"
    choices:
      - "そのメソッドを呼んだインスタンス自身"
      - "クラスの名前"
      - "親クラス"
    answer: 0
    explanation: "p.damage(30) と呼ぶと、self には p が入る。呼び出し時に self を書く必要はない。"
---

## 概要

関連するデータと処理を1つにまとめたいとき、Pythonでは`class`を使う。たとえば「プレイヤー」なら、名前とHPというデータ、ダメージを受けるという処理を、1つのクラスに書く。クラスから作った実体を**インスタンス**と呼ぶ。同じクラスから、独立したインスタンスを何個でも作れる。

## 基礎文法

```python
class Player:
    max_hp = 100                 # クラス変数: 全インスタンスで共通

    def __init__(self, name, hp):
        self.name = name         # インスタンス変数: それぞれが別の値を持つ
        self.hp = hp

    def damage(self, amount):
        self.hp = max(0, self.hp - amount)

p = Player("A", 100)
p.damage(30)
print(p.hp)  # 70
```

- `__init__`は、インスタンスを作った直後に呼ばれる初期化のためのメソッド
- メソッドの最初の引数は慣習的に`self`。呼ぶときには、書かなくてよい
- 特殊メソッド(`__str__`など)は[特殊メソッド(dunderメソッド)](/foundations/python-dunder-methods)を参照

## つまずきやすい点

- メソッドの定義で`self`を書き忘れると、呼び出し時に「引数が多すぎる」という`TypeError`になる
- インスタンス変数は、`self.`を付けて代入したときに作られる。`self.`を付け忘れた変数は、メソッドが終わると消える、ただのローカル変数になる
- クラス変数に、リストなどの変更できる値を置くと、全インスタンスで共有されてしまう。インスタンスごとに持たせたいものは、`__init__`の中で作る
- Pythonには、外から触れないようにする仕組みが言語レベルでない。先頭に`_`を付けた名前は「内部用」という慣習

## 実装例(コード)

```python
class Player:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def is_alive(self):
        return self.hp > 0

a = Player("A", 100)
b = Player("B", 80)
a.damage(30)
print(a.hp, b.hp)     # 70 80(別々の値)
a.damage(100)
print(a.is_alive())   # False
```
