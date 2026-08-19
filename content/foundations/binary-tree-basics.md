---
name: 二分木の基礎
category: IT知識
subcategory: データ構造・計算量
summary: 各ノードが最大2つの子を持つ木構造。特に「二分探索木」は検索・挿入・削除をO(log n)で行える。
---

## 概要

二分木(binary tree)は、各ノードが最大2つの子ノード(左の子・右の子)を持つ木構造。その中でも「二分探索木」は、各ノードについて「左の子孫は全て自分より小さい値、右の子孫は全て自分より大きい値」というルールを保つことで、検索・挿入・削除を平均O(log n)で行えるようにしたもの。

## 基礎文法

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(node, value):
    if node is None:
        return TreeNode(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node

def search(node, value):
    if node is None or node.value == value:
        return node
    return search(node.left, value) if value < node.value else search(node.right, value)
```

## つまずきやすい点

- 挿入する値の順序によっては、木が左右にバランスよく分岐せず「一直線」に近い偏った形になることがある(既にソート済みのデータを順に挿入した場合等)。この場合、計算量はO(log n)ではなくO(n)まで悪化してしまう(連結リストと同じ状態になる)
- この偏りの問題を避けるため、実務ではAVL木や赤黒木のような「自己平衡木」(挿入・削除のたびに自動的にバランスを取り直す木構造)が使われることが多い
- 二分木の走査(全ノードを訪問する順序)には「行きがけ順」「通りがけ順」「帰りがけ順」など複数の方式があり、それぞれ結果の順序が異なる。二分探索木を「通りがけ順」で走査すると、値が昇順に並んだ結果が得られるという性質はよく利用される

## 実装例(コード)

```python
# 通りがけ順の走査: 二分探索木では昇順の結果が得られる
def inorder(node, result):
    if node is None:
        return
    inorder(node.left, result)
    result.append(node.value)
    inorder(node.right, result)
```
