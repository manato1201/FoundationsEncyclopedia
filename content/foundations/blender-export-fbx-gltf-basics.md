---
name: "FBXとglTFの書き出しの基礎(Blender)"
category: DCC
subcategory: "Blender"
summary: "ゲームエンジンなどへ、モデルやアニメーションを、FBXやglTFで渡す。"
operationSteps:
  - label: "書き出す前にシーンを整える"
    note: "不要なオブジェクトを消し、名前・スケール・向きを整える"
  - label: "トランスフォームを適用する"
    note: "スケールなどを適用して、値を整理する"
  - label: "書き出す形式を選ぶ"
    note: "FBXかglTFかを、取り込み先に合わせて選ぶ"
  - label: "オプションを確認して書き出す"
    note: "選択したものだけを出すか、アニメーションを含めるかなどを決める"
  - label: "取り込み先で確認する"
    note: "大きさ・向き・質感が、意図どおりかを確かめる"
---

## 概要

Blenderで作ったモデルを、ゲームエンジンやほかのソフトへ渡すときは、**FBX**や**glTF**で書き出す。大きさや向きの違いが出やすいので、書き出し前の整理と、取り込み先での確認が大切。

## 基礎文法

| 形式 | 特徴 |
| --- | --- |
| FBX | 広く使われる。ゲームエンジンとの連携に多く使われる |
| glTF | Web向けなどに使われる、軽い形式 |

## つまずきやすい点

- 軸の向きや単位が、ソフトごとに違う。書き出しの設定で、合わせる
- 質感(マテリアル)の情報は、形式や設定によって、渡せる範囲が違う
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import bpy

bpy.ops.export_scene.fbx(filepath="out.fbx", use_selection=True)
bpy.ops.export_scene.gltf(filepath="out.glb")
```
