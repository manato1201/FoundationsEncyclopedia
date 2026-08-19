---
name: リギング(アーマチュア)の基礎
category: DCC
subcategory: Blender
masteryBadge: next
summary: Blenderでキャラクターに骨組み(アーマチュア)を仕込み、動かせるようにする工程。
operationSteps:
  - label: アーマチュアを追加する
    menuPath: Add > Armature
  - label: ボーンを配置・接続する
    note: 関節ごとにボーンを配置し、親子関係(階層)を設定する
  - label: メッシュにアーマチュアモディファイアを追加する
    note: メッシュがボーンに追従するようになる
  - label: ウェイトペイントで影響範囲を調整する
    menuPath: Weight Paint モード
    note: 関節周辺の不自然な変形を、頂点ごとの影響度を塗って補正する
---

## 概要

Blenderでのリギングは、[Mayaでのジョイント作成とバインド](/foundations/maya-rigging-basics)と同じ発想で、キャラクターに「アーマチュア」(骨組み)を仕込み、メッシュがそれに追従して変形するようにする工程。基本的な流れはDCCツール間で共通しているが、用語や操作手順はツールごとに異なる。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- ボーンの回転の原点(ロール)を揃えずに配置すると、ポーズを付けた際に関節の曲がる向きが不自然になることがある。あらかじめボーンのロールを整えておくことが後工程の作業効率に直結する
- ウェイトペイントは「関節を実際に動かしながら」確認しないと、静止ポーズでは自然に見えても可動域(腕を大きく曲げた時等)で破綻に気づけないことが多い([Mayaでのジョイント作成とバインド](/foundations/maya-rigging-basics)と共通する注意点)
- アーマチュアモディファイアを追加した後にメッシュの編集モードで頂点を大きく動かすと、ウェイト情報と実際の形状がずれてしまうことがある。基本的にはリギング前にモデリングを完成させておくのが望ましい

## 実装例(コード)

```python
# BlenderのPython APIでボーンの情報を取得する例
import bpy

armature = bpy.data.objects["Armature"]
for bone in armature.pose.bones:
    print(bone.name, bone.rotation_quaternion)
```
