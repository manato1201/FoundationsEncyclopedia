---
name: "Animation Montageの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "攻撃やジャンプなどの動きを、必要なときに、再生する。区間を分けて制御できる。"
operationSteps:
  - label: "再生したい動きを用意する"
    note: "攻撃などの、アニメーションを用意する"
  - label: "Montageを作る"
    note: "アニメーションから、Animation Montageを作る"
  - label: "セクションを分ける"
    note: "始まり・途中・終わりなど、区間(セクション)に分ける"
  - label: "コードやBlueprintから再生する"
    note: "Play Montageで、好きなタイミングで、再生する"
  - label: "通知で処理と同期する"
    note: "アニメーションの途中で、通知(Notify)を呼んで、ダメージ判定などを行う"
---

## 概要

**Animation Montage**は、アニメーションを、**好きなタイミングで再生**したり、**区間に分けて制御**したりできるアセット。攻撃・装備・ジャンプなどの動きを、入力に応じて、再生するときに使う。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| Montage | 再生を制御しやすい、アニメーションの入れ物 |
| セクション | Montageの区間 |
| Notify | 途中で処理を呼び出す印 |

## つまずきやすい点

- 再生するには、Animation Blueprint側で、Montageを再生できる設定が必要
- 同じスロットで、複数のMontageを再生すると、重なって、動きが乱れる
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
if (UAnimInstance* Anim = GetMesh()->GetAnimInstance())
{
    Anim->Montage_Play(AttackMontage);
}
```
