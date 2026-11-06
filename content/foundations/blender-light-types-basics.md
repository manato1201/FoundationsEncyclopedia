---
name: "ライトの種類の基礎(Blender)"
category: DCC
subcategory: "Blender"
summary: "点光源・太陽光・スポット・エリアなど、ライトの種類ごとの特徴を知って、使い分ける。"
operationSteps:
  - label: "ライトの種類を選ぶ"
    note: "ポイント・サン・スポット・エリアから、目的に合うものを選ぶ"
  - label: "位置と向きを決める"
    note: "光を当てたい位置と、向きに配置する"
  - label: "強さと色を設定する"
    note: "強さ(パワー)と色を調整する"
  - label: "影の柔らかさを調整する"
    note: "ライトの大きさで、影の柔らかさが変わる"
  - label: "レンダリングして確認する"
    note: "明るさと影を、レンダリングで確かめる"
---

## 概要

Blenderのライトには、いくつかの種類がある。**ポイント**は点から全方向へ、**サン**は平行な太陽の光、**スポット**は円錐状、**エリア**は面から、柔らかい光を出す。

## 基礎文法

| 種類 | 特徴 |
| --- | --- |
| ポイント | 一点から全方向へ |
| サン | 遠くからの平行な光。屋外に向く |
| スポット | 円錐状に照らす |
| エリア | 面で光り、柔らかい影 |

## つまずきやすい点

- ライトの大きさが小さいほど、影が硬くなる。柔らかくしたいときは、大きくする
- サンは、位置ではなく向きで、光の当たり方が決まる
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import bpy

light_data = bpy.data.lights.new(name="Sun", type="SUN")
light_data.energy = 3.0
light = bpy.data.objects.new("Sun", light_data)
bpy.context.collection.objects.link(light)
```
