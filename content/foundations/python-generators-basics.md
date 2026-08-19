---
name: ジェネレータとyield
category: プログラミング言語
subcategory: Python
summary: 値を1つずつ遅延生成することで、大きなデータ列でもメモリを使い切らずに処理できる仕組み。
---

## 概要

ジェネレータは、`yield`を使って値を1つずつ返す特殊な関数。呼び出した瞬間には何も実行されず、`next()`(または`for`文での反復)のたびに次の`yield`まで実行が進む。リスト全体を一度にメモリ上に構築する必要がないため、巨大なデータや無限に続く列を扱うのに向く。

## 基礎文法

```python
def read_large_file(path: str):
    with open(path) as f:
        for line in f:
            yield line.strip()  # 1行ずつ返し、呼び出し元が次を要求するまで一時停止する

for line in read_large_file("huge_log.txt"):
    process(line)  # ファイル全体を一度にメモリへ読み込まない
```

- ジェネレータ式(`(x * x for x in range(10))`)は、リスト内包表記の`[]`を`()`に変えるだけで作れる、より簡潔な書き方

## つまずきやすい点

- ジェネレータは一度しか反復できない。使い切った後にもう一度`for`文で回そうとしても、何も返ってこない(空の反復になる)
- `return`文をジェネレータ関数の中で使うと、値を返すのではなく`StopIteration`を発生させてジェネレータを終了させる、という通常の関数とは異なる意味になる
- ジェネレータの中身は呼び出し側が実際に値を要求するまで実行されない(遅延評価)。デバッグ時に「ジェネレータを作った時点で処理が走っているはず」という思い込みでハマることがある

## 実装例(コード)

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
```
