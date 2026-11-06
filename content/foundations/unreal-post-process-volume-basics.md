---
name: "Post Process Volumeの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "画面全体に、露出・色調整・ブルームなどの効果をかける。"
operationSteps:
  - label: "Post Process Volumeを置く"
    note: "効果をかけたい範囲に、ボリュームを配置する"
  - label: "範囲の扱いを決める"
    note: "Infinite Extent(無限の範囲)にするか、箱の内側だけにするかを決める"
  - label: "効果を設定する"
    note: "露出・色調整・ブルームなどの値を、有効にして設定する"
  - label: "重なる場合の優先度を決める"
    note: "複数のボリュームが重なるときは、優先度で決まる"
  - label: "見た目を確認して調整する"
    note: "やりすぎないように、強さを控えめに調整する"
---

## 概要

**Post Process Volume**は、レンダリングされた画面全体に、**効果**(露出・色調整・ブルームなど)を、**あとからかける**ボリューム。シーン全体にかける、特定の範囲に入ったときだけかける、といった使い方ができる。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Infinite Extent (Unbound) | シーン全体にかける |
| Priority | 重なったときの優先度 |
| Blend Weight | 効果の強さ |

## つまずきやすい点

- 効果を強くしすぎると、画面が見にくくなる。控えめな値から試す
- 自動露出の設定で、明るさが勝手に変わって見える場合がある。意図に合わせて設定する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```text
# 流れ
Post Process Volumeを置く → Infinite Extentを設定 → 露出や色調整を調整
```
