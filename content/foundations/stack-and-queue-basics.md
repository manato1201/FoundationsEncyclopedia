---
name: スタックとキューの基礎
category: IT知識
subcategory: データ構造・計算量
masteryBadge: done
summary: 「後入れ先出し」と「先入れ先出し」という2つの基本的なデータの出し入れ順序。
---

## 概要

スタックとキューは、どちらも要素の追加・取り出しの操作だけを持つシンプルなデータ構造だが、取り出す順序が正反対。スタックは後入れ先出し(LIFO: Last In First Out)、キューは先入れ先出し(FIFO: First In First Out)という規則に従う。

## 基礎文法

```python
# スタック(LIFO): 最後に入れたものが最初に出てくる
stack = []
stack.append(1)  # push
stack.append(2)
stack.append(3)
stack.pop()  # 3が返る(最後に入れたもの)

# キュー(FIFO): 最初に入れたものが最初に出てくる
from collections import deque
queue = deque()
queue.append(1)  # enqueue
queue.append(2)
queue.append(3)
queue.popleft()  # 1が返る(最初に入れたもの)
```

## つまずきやすい点

- スタックは関数呼び出しの管理(コールスタック)、Undo機能、深さ優先探索(DFS)など「直前の状態に戻る」性質を持つ処理と相性がよい。キューは印刷待ちの管理、幅優先探索(BFS)など「先着順に処理する」性質を持つ処理と相性がよい。この対応関係を理解していると、アルゴリズムの選択が直感的になる
- Pythonのリストの末尾への追加・削除(`append`/`pop`)はO(1)だが、先頭への追加・削除(`insert(0, x)`/`pop(0)`)は他の要素をずらす必要がありO(n)になる。キューを実装する際に素朴なリストを使うと、この非効率に気づかずパフォーマンス問題を作り込むことがある(`collections.deque`は両端の操作がO(1))
- 優先度付きキュー(要素に優先度があり、優先度の高いものから取り出す)は、通常のキューとは異なるデータ構造(ヒープ)で実装されることが多い。「キュー」という名前が付いているが、内部の実装や計算量特性は素朴なキューと大きく異なる

## 実装例(コード)

```python
# スタックを使った括弧の対応チェック(よくある応用例)
def is_balanced(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in ')]}':
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
```
