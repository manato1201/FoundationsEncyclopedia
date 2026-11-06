---
name: Python API(bpy)の基礎
category: DCC
subcategory: Blender
masteryBadge: review
summary: Blenderの内部構造そのものがPythonから直接操作できるよう設計された、拡張性の高いスクリプティング環境。
operationSteps:
  - label: "スクリプトの画面を開く"
    note: "テキストエディターと、Pythonコンソールを使えるようにする"
  - label: "bpyモジュールを読み込む"
    note: "`import bpy` で、Blenderの機能へアクセスする"
  - label: "データを読む"
    note: "bpy.dataやbpy.contextから、オブジェクトやシーンの情報を取得する"
  - label: "プロパティを変更する"
    note: "位置・名前・マテリアルなどの値を、コードから書き換える"
  - label: "オペレーターを実行する"
    note: "bpy.opsで、メニューの操作と同じ処理を実行する"
  - label: "繰り返し作業を自動化する"
    note: "ループで、多数のオブジェクトに同じ処理を行う"
---

## 概要

Blenderは、UI操作を含むほぼ全ての機能がPythonの`bpy`モジュールを通じてアクセスできるよう設計されている。[Maya Python API](/foundations/maya-python-scripting-basics)と同様に、繰り返し作業の自動化やカスタムツール(アドオン)の作成に使われる。

## 基礎文法

```python
import bpy

# 立方体を作成し、位置を設定する
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
cube = bpy.context.active_object
cube.location.z = 5

# シーン内の全オブジェクトを走査する
for obj in bpy.data.objects:
    print(obj.name, obj.type)
```

- `bpy.ops`: メニュー操作に相当する「オペレーター」を実行するAPI(UIの状態に依存することがある)
- `bpy.data`: シーンのデータ(オブジェクト、メッシュ、マテリアル等)へ直接アクセスするAPI(UIの状態に依存しない)

## つまずきやすい点

- `bpy.ops`系のAPIは、現在のUIコンテキスト(どのエリアがアクティブか、どのモードか)に依存して動作することがある。バックグラウンドで実行するスクリプト(UIを介さない自動処理)からは正しく動かないことがあり、その場合は`bpy.data`系のAPIで代替する必要がある
- Blenderのバージョンアップに伴い、APIの名前や引数が変更されることが比較的頻繁にある。あるバージョンで書かれたスクリプトが、別のバージョンではそのまま動かないことがあり、アドオンの保守コストに直結する
- スクリプトの実行がBlenderのメインスレッドをブロックするため、時間のかかる処理をそのまま実行するとUIがフリーズしたように見える。長時間の処理はモーダルオペレーターやタイマーを使って分割実行する設計が必要になることがある

## 実装例(コード)

```python
# シンプルなアドオンの雛形
bl_info = {"name": "My Tool", "blender": (4, 0, 0), "category": "Object"}

import bpy

class SimpleOperator(bpy.types.Operator):
    bl_idname = "object.simple_operator"
    bl_label = "Simple Operator"

    def execute(self, context):
        self.report({'INFO'}, "実行されました")
        return {'FINISHED'}
```
