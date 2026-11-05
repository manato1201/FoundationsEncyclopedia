---
name: Freeze TransformationsとDelete Historyの基礎(Maya)
category: DCC
subcategory: Maya
summary: 位置・回転・拡大の値を0や1に整理し、不要な作成履歴を消して、あとの作業のトラブルを減らす。
operationSteps:
  - label: モデリングを終える
    note: 位置・回転・スケールを動かしたり、操作の履歴が積み重なったりした状態になる
  - label: Freeze Transformationsを実行する
    note: 見た目は変えずに、位置・回転・スケールの値を、初期値(0や1)に整理する
  - label: Delete Historyを実行する
    note: 作成時のノードの履歴を消して、シーンを軽く単純にする
  - label: ピボットを確認する
    note: 回転や拡大の中心(ピボット)が、意図した位置にあるかを確認する
  - label: 書き出しやリギングに進む
    note: 値が整理されているので、書き出しや次の工程で、予期しないズレが起きにくい
---

## 概要

モデリング中は、オブジェクトの位置・回転・スケールの値が、0や1以外になりやすい。**Freeze Transformations**は、見た目を変えずに、これらの値を初期値(位置・回転は0、スケールは1)へ整理する。**Delete History**は、オブジェクトに残った作成時のノードの履歴を消す。

## 基礎文法

| 操作                   | 効果                                                       |
| ---------------------- | ---------------------------------------------------------- |
| Freeze Transformations | 位置・回転・スケールの値を初期値へ整理する(形は変わらない) |
| Delete History         | 作成履歴のノードを削除する                                 |
| ピボットの調整         | 回転や拡大の中心を、意図した位置に置く                     |

## つまずきやすい点

- Delete Historyを実行すると、履歴に基づいて変形していた機能(デフォーマなど)の結果が固定される。意図せず消えないよう、必要なものは先に確認する
- リグが入ったオブジェクトに、安易に実行しない。構造が壊れる場合がある
- スケールが1でないまま、あとの工程(物理やエクスポート)へ進むと、挙動が意図とずれることがある。値は整理してから渡す

## 実装例(コード)

```python
import maya.cmds as cmds

cmds.makeIdentity("pCube1", apply=True, translate=True, rotate=True, scale=True)  # Freeze Transformations
cmds.delete("pCube1", constructionHistory=True)                                   # Delete History
```
