---
name: Hypershadeでマテリアルを作る基礎
category: DCC
subcategory: Maya
summary: Hypershadeは、マテリアルとテクスチャをノードでつないで作る画面。
operationSteps:
  - label: Hypershadeを開く
    note: マテリアルやテクスチャを、ノードとして一覧・編集できる画面
  - label: マテリアル(シェーダー)ノードを作る
    note: たとえば、標準的な表面を表すシェーダーを作り、色や粗さなどの基本設定を行う
  - label: テクスチャのノードをつなぐ
    note: 画像などのテクスチャノードを、色や粗さなどの入力につなぐ
  - label: オブジェクトにマテリアルを割り当てる
    note: マテリアルを、対象のオブジェクトやフェースに割り当てる
  - label: 見た目を確認して調整する
    note: ビューポートやレンダリングで確認して、つなぎ方や数値を調整する
---

## 概要

Hypershadeは、Mayaでマテリアル(質感)とテクスチャを管理・編集する画面。マテリアルとテクスチャを**ノード**として表示し、つなぎ合わせて見た目を作る。

## 基礎文法

| 要素                   | 役割                                     |
| ---------------------- | ---------------------------------------- |
| マテリアル(シェーダー) | 表面の色・粗さ・透明感などを決める       |
| テクスチャノード       | 画像や模様を作り、マテリアルの入力へ渡す |
| シェーディンググループ | マテリアルとオブジェクトを結びつける     |

## つまずきやすい点

- 使えるマテリアルの種類や名前は、Mayaのバージョンと、使うレンダラーで違う。使うレンダラーに対応したマテリアルを選ぶ
- マテリアルを作っても、オブジェクトに割り当てなければ、見た目は変わらない
- 同じ名前のノードが増えやすい。マテリアルには、分かりやすい名前を付けて整理する

## 実装例(コード)

```python
import maya.cmds as cmds

shader = cmds.shadingNode("lambert", asShader=True, name="wallMat")
sg = cmds.sets(renderable=True, noSurfaceShader=True, empty=True, name="wallMatSG")
cmds.connectAttr(shader + ".outColor", sg + ".surfaceShader", force=True)
cmds.sets("pCube1", edit=True, forceElement=sg)  # オブジェクトに割り当てる
```
