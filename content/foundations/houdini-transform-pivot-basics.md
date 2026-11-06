---
name: "Transformノードとピボットの基礎(Houdini)"
category: DCC
subcategory: "Houdini"
summary: "Transformノードで、移動・回転・拡大を行う。ピボットを変えて、回転や拡大の中心を決める。"
operationSteps:
  - label: "対象のジオメトリをつなぐ"
    note: "動かしたいジオメトリを、Transformノードへつなぐ"
  - label: "移動・回転・拡大を設定する"
    note: "数値で、位置・向き・大きさを変える"
  - label: "ピボットの位置を決める"
    note: "回転や拡大の中心(ピボット)を設定する"
  - label: "順序に注意して重ねる"
    note: "回転と移動は、順序で結果が変わる。ノードの並びを確認する"
  - label: "結果を確認する"
    note: "意図した位置・向きになっているかを確かめる"
---

## 概要

**Transform**ノードは、ジオメトリを**移動・回転・拡大**する、基本のノード。回転や拡大は、**ピボット**を中心に行われる。順序によって結果が変わるので、ノードの並びも大事。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Translate | 移動 |
| Rotate | 回転 |
| Scale | 拡大・縮小 |
| Pivot | 回転・拡大の中心 |

## つまずきやすい点

- 回転してから移動するのと、移動してから回転するのでは、結果が違う
- ピボットが原点のままだと、意図しない位置を中心に回る
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import hou

geo = hou.node("/obj").createNode("geo")
xf = geo.createNode("xform")
xf.parmTuple("t").set((1, 0, 0))  # X方向に1移動する
```
