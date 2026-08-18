---
name: リスト内包表記
category: プログラミング言語
subcategory: Python
masteryBadge: next
summary: for文とif文を1行に凝縮してリストを構築するPythonの構文糖衣。可読性と速度を両立させやすい。
---

## 概要

リスト内包表記(list comprehension)は、既存のイテラブルから新しいリストを1行で構築するPython独自の構文。`for`ループで`append`を繰り返すよりも簡潔で、CPython内部の最適化により実行速度も速いことが多い。

## 基礎文法

```python
squares = [x * x for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
pairs = [(x, y) for x in range(3) for y in range(3) if x != y]
```

- `[式 for 変数 in イテラブル]` が基本形
- 末尾に `if 条件` を足すと絞り込みができる
- 辞書版(`{k: v for ...}`)・集合版(`{x for ...}`)・ジェネレータ版(`(x for ...)`)も同じ発想で書ける

## つまずきやすい点

- ネストが深くなる(2重・3重のfor)と可読性が急激に落ちる。3段以上は通常のforループに戻した方がよいことが多い
- 内包表記の中で副作用(状態変更)を起こすコードを書くと意図が読み取りにくくなる。値の変換・絞り込みに用途を限定するのが安全
- 巨大なデータに対しては`[...]`のリスト内包表記ではなく`(...)`のジェネレータ式を使うことでメモリを節約できる

## 実装例(コード)

```python
words = ["Sort", "Search", "Tree", "Graph"]
lowered_long = [w.lower() for w in words if len(w) > 4]
# ["sort", "search", "graph"]
```
