---
name: "マテリアルの割り当ての基礎(Houdini)"
category: DCC
subcategory: "Houdini"
summary: "マテリアルを作って、ジオメトリに割り当てる。グループやパスで、割り当てる範囲を決める。"
operationSteps:
  - label: "マテリアルを作る"
    note: "色や質感を持つ、マテリアルを作る"
  - label: "割り当てたい範囲を決める"
    note: "ジオメトリ全体か、グループかを決める"
  - label: "Materialノードで割り当てる"
    note: "Materialノードで、対象にマテリアルを指定する"
  - label: "見た目を確認する"
    note: "ビューポートやレンダリングで、質感を確認する"
  - label: "マテリアルを調整する"
    note: "色・粗さ・テクスチャなどを調整する"
---

## 概要

ジオメトリに色や質感を与えるには、**マテリアル**を作って**割り当てる**。SOPでは**Material**ノード、SolarisではMaterial Libraryなどを使い、グループやパスで、割り当てる範囲を決める。

## 基礎文法

| 方法 | 概要 |
| --- | --- |
| SOPのMaterial | ジオメトリへ、マテリアルを割り当てる |
| Solarisのマテリアル | LOPで、マテリアルを作って割り当てる |

## つまずきやすい点

- 割り当てるグループやパスの指定が合っていないと、反映されない
- 使うレンダラーによって、対応するマテリアルが違う場合がある
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import hou

geo = hou.node("/obj").createNode("geo")
mat = geo.createNode("material")  # マテリアルを割り当てるノード
```
