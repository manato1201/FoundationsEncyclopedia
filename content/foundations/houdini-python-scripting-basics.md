---
name: Python(houモジュール)の基礎
category: DCC
subcategory: Houdini
masteryBadge: review
summary: HoudiniのシーンをPythonから直接操作できるようにする、hou モジュールを使ったスクリプティング。
---

## 概要

Houdiniは`hou`モジュールを通じて、ノードの作成・パラメータの設定・シーン全体の走査といった操作をPythonから行える。[VEXの基礎](/foundations/houdini-vex-basics)がジオメトリの各要素に対する高速な並列計算に使われるのに対し、`hou`モジュールはノードネットワークの構築や自動化ツールの作成など、より「シーン全体を操作する」用途で使われる。

## 基礎文法

```python
import hou

# 新しいノードを作成する
geo = hou.node("/obj").createNode("geo", "my_geo")
box = geo.createNode("box")
box.parm("sizex").set(2.0)

# シーン内の全ノードを走査する
for node in hou.node("/obj").children():
    print(node.name(), node.type().name())
```

## つまずきやすい点

- VEXとPythonは役割が異なる。VEXはジオメトリの各ポイントに対して並列に実行される高速な計算に向くのに対し、Pythonはシーン全体の操作(ノードの作成、UIの構築)には向くが、大量の要素に対する反復処理は遅くなりやすい。「どの処理をVEXで、どの処理をPythonで行うか」の判断が重要になる
- `hou.node()`でノードのパスを指定する際、パスの綴りを誤ると`None`が返るだけで明確なエラーにならないことがある。パスの存在確認を省略すると、後続の処理で分かりにくいエラーに繋がることがある
- Pythonスクリプトの実行がHoudiniのUIスレッドをブロックすることがあり、重い処理(大量のノード生成等)を一度に実行するとUIが一時的に応答しなくなることがある

## 実装例(コード)

```python
# パラメータ式(Expression)をPythonで設定する例
box.parm("tx").setExpression("sin($T) * 2", hou.exprLanguage.Python)
```
