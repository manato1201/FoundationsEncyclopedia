---
name: withステートメントとコンテキストマネージャ
category: プログラミング言語
subcategory: Python
masteryBadge: next
summary: リソースの確保と解放を確実にペアで実行させるPythonの構文。C++のRAIIに近い発想。
operationSteps:
  - label: withブロックに入る
    note: "__enter__ メソッドが呼ばれ、リソースの確保などの準備処理が実行される"
  - label: ブロックの中身を実行する
    note: ここで例外が発生してもしなくても、次のステップは必ず実行される
  - label: withブロックを抜ける
    note: "__exit__ メソッドが呼ばれ、後始末処理(クローズ・解放)が実行される"
  - label: 正常終了または例外の伝播
    note: "__exit__がTrueを返さない限り、ブロック内で発生した例外は呼び出し元に伝播する"
---

## 概要

`with`ステートメントは、ブロックに入るときに何らかの準備処理を、ブロックを抜けるとき(正常終了でも例外発生でも)に後始末処理を確実に実行する構文。ファイルのクローズ・ロックの解放・DB接続のクローズなど、「必ず対で実行したい処理」を書くのに使う。

## 基礎文法

```python
with open("data.txt") as f:
    content = f.read()
# ここでファイルは自動的にクローズされる(例外が発生していても)

# 自作のコンテキストマネージャ
class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print(f"経過時間: {time.perf_counter() - self.start:.4f}s")

with Timer():
    heavy_computation()
```

- `__enter__`: `with`ブロックに入るときに呼ばれる
- `__exit__`: ブロックを抜けるときに呼ばれる(例外情報も引数で受け取れる)

## つまずきやすい点

- `try`/`finally`で同じことを書けるが、`with`の方が「このリソースは必ず解放される」という意図がコードの見た目からも明確になる。似たパターンを何度も書くコードベースでは`with`化した方が保守しやすい
- `__exit__`が`True`を返すと、ブロック内で発生した例外が握りつぶされる。意図せず例外を握りつぶしてしまうバグの原因になりやすいため、明示的にその意図がある場合以外は`True`を返さないようにする
- `contextlib.contextmanager`デコレータを使うと、クラスを定義せず関数1つでコンテキストマネージャを作れる。単純なケースではこちらの方が簡潔

## 実装例(コード)

```python
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.perf_counter()
    yield
    print(f"経過時間: {time.perf_counter() - start:.4f}s")
```
