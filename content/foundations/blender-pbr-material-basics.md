---
name: "PBRマテリアルの基礎(Blender)"
category: DCC
subcategory: "Blender"
summary: "ベースカラー・粗さ・金属感の3つで、現実に近い質感を作る。"
operationSteps:
  - label: "マテリアルを作る"
    note: "オブジェクトに、新しいマテリアルを作る"
  - label: "Principled BSDFを使う"
    note: "多くの質感を、1つのノードで表せる、標準のシェーダーを使う"
  - label: "ベースカラーを設定する"
    note: "表面の基本の色を決める"
  - label: "粗さと金属感を設定する"
    note: "粗さ(つるつる〜ざらざら)と、金属かどうかを設定する"
  - label: "テクスチャをつないで質感を足す"
    note: "画像を、色や粗さへつないで、細かい模様やムラを加える"
---

## 概要

**PBR**(物理ベースのレンダリング)は、現実の光の振る舞いに近づけた、質感の表し方。BlenderのPrincipled BSDFでは、**ベースカラー・粗さ(Roughness)・金属感(Metallic)**を中心に設定する。

## 基礎文法

| 項目 | 意味 |
| --- | --- |
| Base Color | 表面の基本の色 |
| Roughness | 0で鏡のように滑らか、1で粗い |
| Metallic | 0で非金属、1で金属 |

## つまずきやすい点

- 金属感は、ほとんどが0か1。中間の値は、錆びや汚れの境目などに使う
- テクスチャの色空間を間違えると、色や粗さがずれる。色以外のテクスチャは、色空間を調整する
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import bpy

mat = bpy.data.materials.new("Metal")
mat.use_nodes = True
bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
bsdf.inputs["Metallic"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.3
```
