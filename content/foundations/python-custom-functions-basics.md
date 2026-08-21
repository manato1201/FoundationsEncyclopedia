---
name: 自作関数の基礎
category: プログラミング言語
subcategory: Python
masteryBadge: done
summary: Pythonの関数はdefで定義し、型宣言は任意。デフォルト引数・可変長引数など柔軟な引数の受け取り方を持つ。
---

## 概要

Pythonの関数は`def`キーワードで定義する。[C#の自作関数の基礎](/foundations/csharp-custom-functions-basics)のように戻り値・引数の型を明示する必要はなく(型ヒントで任意に注釈は可能)、デフォルト引数・可変長引数(`*args`/`**kwargs`)といった柔軟な引数の受け取り方を標準でサポートする。

## 基礎文法

```python
def add(a: int, b: int) -> int:  # 型ヒントは任意(実行時には強制されない)
    return a + b

def greet(name: str, greeting: str = "こんにちは") -> str:  # デフォルト引数
    return f"{greeting}、{name}さん"

def total(*args: int) -> int:  # 可変長引数: 任意の数の位置引数をタプルとして受け取る
    return sum(args)

def describe(**kwargs) -> None:  # 可変長キーワード引数: 任意のキーワード引数を辞書として受け取る
    for key, value in kwargs.items():
        print(f"{key}: {value}")
```

## つまずきやすい点

- デフォルト引数にミュータブルなオブジェクト(リストや辞書)を指定すると、そのデフォルト値が関数呼び出しの間で共有されてしまう有名な罠がある。デフォルト値は関数定義時に1度だけ評価されるため、`def f(items=[])`のような書き方は避け、`None`をデフォルトにして関数内で新しいリストを作るのが定石
- Pythonの関数は全て「第一級オブジェクト」であり、変数に代入したり、他の関数の引数として渡したりできる。[デコレータの基礎](/foundations/python-decorators-basics)はこの性質を土台にしている
- 引数はデフォルトで位置引数としてもキーワード引数としても渡せる。関数のシグネチャが複雑になると、呼び出し側でどちらの渡し方をすべきか分かりにくくなることがあり、`*`を使ってキーワード専用引数を強制する記法も用意されている

## 実装例(コード)

```python
# ミュータブルなデフォルト引数の罠と、その回避策
def add_item(item, items=None):
    if items is None:
        items = []  # 呼び出しのたびに新しいリストを作る
    items.append(item)
    return items
```
