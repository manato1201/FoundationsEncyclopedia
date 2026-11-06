---
name: "ソケットの基礎(Skeletal Mesh)"
category: ツール別
subcategory: "UnrealEngine"
summary: "骨に取り付け位置(ソケット)を作って、武器や装備を、手などへ固定する。"
operationSteps:
  - label: "取り付けたい位置を決める"
    note: "武器を持つ手など、物を取り付けたい場所を決める"
  - label: "骨にソケットを作る"
    note: "スケルタルメッシュの、骨にソケットを追加して、位置と向きを調整する"
  - label: "ソケットを使って取り付ける"
    note: "Attach Component To Componentで、ソケット名を指定して取り付ける"
  - label: "動かして確認する"
    note: "アニメーションを再生して、取り付けた物が追従するかを確かめる"
  - label: "位置を調整する"
    note: "ずれていれば、ソケットの位置や向きを、直す"
---

## 概要

**ソケット**は、スケルタルメッシュの**骨に付ける、取り付け位置**。武器を手に持たせる、帽子を頭に付けるときに使う。アニメーションで骨が動くと、ソケットに付けた物も、追従して動く。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| ソケット | 骨に付ける、取り付け位置 |
| Attach | ソケットへ取り付ける操作 |

## つまずきやすい点

- ソケットの名前を間違えると、取り付けに失敗する。綴りを確認する
- 持たせる物の原点の位置で、持ち方が変わる。見た目を確認して、調整する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
Weapon->AttachToComponent(GetMesh(), FAttachmentTransformRules::SnapToTargetNotIncludingScale, TEXT("hand_r_socket"));
```
