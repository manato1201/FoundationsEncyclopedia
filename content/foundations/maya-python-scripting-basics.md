---
name: Maya Python API(maya.cmds)の基礎
category: DCC
subcategory: Maya
masteryBadge: review
summary: Pythonの標準的な文法でMayaを操作できるようにする、MELの後継として広く使われているAPI。
---

## 概要

Mayaは`maya.cmds`モジュールを通じて、Pythonからほぼ全ての操作を実行できる。[MELスクリプティングの基礎](/foundations/maya-mel-scripting-basics)と同等の機能を、Pythonの豊富なライブラリエコシステムやモダンな文法と組み合わせて使えるため、現在のMayaツール開発の主流になっている。

## 基礎文法

```python
import maya.cmds as cmds

# 選択中のオブジェクトを一括複製する(MELの例と同等の処理)
selected = cmds.ls(selection=True)
for obj in selected:
    cmds.duplicate(obj, name=f"{obj}_copy")

# 新しいオブジェクトを作成する
cube = cmds.polyCube(width=2, height=2, depth=2)[0]
cmds.move(0, 5, 0, cube)
```

## つまずきやすい点

- `maya.cmds`は手続き的なAPIで、MELコマンドをそのままPython関数として呼び出す形になっている。よりオブジェクト指向的な操作を求める場合は、`OpenMaya`(Maya Python API 2.0)という別のより低レベルなAPIを使う選択肢もあるが、学習コストは高くなる
- Mayaのバージョンによって、内蔵されているPythonのバージョンが異なることがある(Maya 2022以降はPython 3系が標準)。古いバージョン向けに書かれたスクリプトをそのまま新しいMayaで動かそうとすると、構文エラーになることがある
- スクリプトの実行結果がビューポートに反映されない場合、多くは`cmds.refresh()`の呼び出し忘れや、選択状態(`selection=True`)の取得タイミングのズレが原因であることが多い

## 実装例(コード)

```python
# UI付きの簡単なツールの例
import maya.cmds as cmds

def create_tool_ui():
    if cmds.window("myTool", exists=True):
        cmds.deleteUI("myTool")
    cmds.window("myTool", title="簡易ツール")
    cmds.columnLayout()
    cmds.button(label="立方体を作成", command=lambda x: cmds.polyCube())
    cmds.showWindow("myTool")
```
