---
name: "MergeとSwitchの基礎(Houdini)"
category: DCC
subcategory: "Houdini"
summary: "複数のジオメトリを1つにまとめるMerge、入力を切り替えるSwitch。"
operationSteps:
  - label: "まとめたいジオメトリを用意する"
    note: "複数のノードで、それぞれジオメトリを作る"
  - label: "Mergeでつなぎ合わせる"
    note: "複数の入力を、Mergeノードで、1つのジオメトリにまとめる"
  - label: "後続の処理を1回で行う"
    note: "まとめた結果に、まとめて処理をかける"
  - label: "Switchで入力を切り替える"
    note: "複数の入力から、どれを使うかを、番号で選ぶ"
  - label: "切り替えて比較する"
    note: "番号を変えて、結果を見比べる"
---

## 概要

**Merge**は、複数のジオメトリを**1つにまとめる**ノード。**Switch**は、複数の入力のうち、**1つを番号で選ぶ**ノード。パーツを組み合わせたり、別のバージョンを比べたりするときに使う。

## 基礎文法

| ノード | 役割 |
| --- | --- |
| Merge | 複数の入力を、1つにまとめる |
| Switch | 入力を番号で切り替える |

## つまずきやすい点

- Mergeしたあとは、元の個別のパーツの区別がなくなる。区別したいときは、グループや名前の属性を付けておく
- Switchの番号は0から始まる。範囲外の番号だと、結果が空になる
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import hou

geo = hou.node("/obj").createNode("geo")
merge = geo.createNode("merge")
switch = geo.createNode("switch")
```
