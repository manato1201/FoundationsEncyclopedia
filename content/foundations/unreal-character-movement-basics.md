---
name: "Character Movementコンポーネントの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "歩く・走る・ジャンプ・落下などの動きを、キャラクターの設定で調整する。"
operationSteps:
  - label: "Characterクラスを使う"
    note: "Characterは、移動のためのコンポーネントを、あらかじめ持っている"
  - label: "入力を移動に変える"
    note: "入力を受け取り、Add Movement Inputで、移動の入力を与える"
  - label: "速さや加速を設定する"
    note: "最大の歩く速さ・加速・減速などを、設定する"
  - label: "ジャンプや重力を調整する"
    note: "ジャンプの高さや、重力の強さを調整する"
  - label: "移動モードを理解する"
    note: "歩行・落下・飛行・水泳などの、移動モードを使い分ける"
---

## 概要

**Character Movement**は、キャラクターの**歩く・走る・ジャンプ・落下**などの動きを扱うコンポーネント。**Character**クラスに最初から付いており、速さや重力などの設定で、動きの手応えを調整できる。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Max Walk Speed | 歩く最大の速さ |
| Jump Z Velocity | ジャンプの初速 |
| Gravity Scale | 重力の強さの倍率 |

## つまずきやすい点

- 入力は、移動の「入力」を与えるもの。実際の移動は、コンポーネントが計算する
- プレイヤーの感触は、加速や減速の設定でも大きく変わる。操作して、調整する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
// 移動の入力を与える(Characterクラスの中で)
AddMovementInput(GetActorForwardVector(), 1.0f);
GetCharacterMovement()->MaxWalkSpeed = 600.f;
```
