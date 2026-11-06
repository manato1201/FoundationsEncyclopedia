---
name: "セットドリブンキーの基礎(Maya)"
category: DCC
subcategory: "Maya"
summary: "ある値が変わると、別の値が連動して変わる関係を、キーで設定する。"
operationSteps:
  - label: "動かす側(ドライバー)を決める"
    note: "操作する側の属性(例: ノブの回転)を決める"
  - label: "動く側(ドリブン)を決める"
    note: "連動して動く側の属性(例: 扉の開き)を決める"
  - label: "基準の状態でキーを設定する"
    note: "ドライバーが0のとき、ドリブンも0、というように、基準を記録する"
  - label: "別の状態でもキーを設定する"
    note: "ドライバーを変えて、ドリブンも変え、その組み合わせを記録する"
  - label: "ドライバーを動かして確認する"
    note: "ドライバーを動かすと、ドリブンが連動して動く"
---

## 概要

**セットドリブンキー**(SDK)は、ある属性(ドライバー)の値に応じて、別の属性(ドリブン)の値が変わるように、**関係をキーで記録**する機能。時間ではなく、別の値に従って動かす。指の曲げに連動する関節など、リグでよく使う。

## 基礎文法

| 用語 | 意味 |
| --- | --- |
| ドライバー | 操作する側の属性 |
| ドリブン | 連動して変わる側の属性 |

## つまずきやすい点

- 時間でアニメーションするキーとは別。ドライバーの値で動く
- キーを設定する順序を間違えると、意図と違う関係になる。基準の状態から設定する
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import maya.cmds as cmds

cmds.setDrivenKeyframe("door.rotateY", currentDriver="knob.rotateZ", driverValue=0, value=0)
cmds.setDrivenKeyframe("door.rotateY", currentDriver="knob.rotateZ", driverValue=45, value=60)
```
