---
name: "ナビゲーションメッシュの基礎(Unreal Engine)"
category: ツール別
subcategory: "UnrealEngine"
summary: "AIが歩ける範囲を示すデータ。Nav Mesh Bounds Volumeで範囲を決める。"
operationSteps:
  - label: "範囲を決める"
    note: "Nav Mesh Bounds Volumeを置き、歩ける範囲を囲む"
  - label: "ナビメッシュを生成する"
    note: "ボリューム内の地形から、歩ける面が、自動で作られる"
  - label: "表示して確認する"
    note: "Pキーで、ナビメッシュを表示し、歩ける範囲を確かめる"
  - label: "AIに移動を命じる"
    note: "Move Toなどで、目的地を指定すると、経路を探して移動する"
  - label: "障害物を設定する"
    note: "動く障害物や、通れない場所は、ナビゲーションに反映させる"
---

## 概要

**ナビゲーションメッシュ**(NavMesh)は、AIが**歩ける範囲**を表したデータ。**Nav Mesh Bounds Volume**で範囲を決めると、地形から自動で生成される。AIは、この上で、経路を探して移動する。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| Nav Mesh Bounds Volume | ナビメッシュを作る範囲 |
| Move To | 目的地へ移動させる命令 |

## つまずきやすい点

- ボリュームの範囲外には、ナビメッシュが作られず、AIが移動できない
- 地形を変えたら、ナビメッシュが、更新されるかを確認する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```text
# 流れ
Nav Mesh Bounds Volumeを置く → Pキーで確認 → AIのMove Toで移動
```
