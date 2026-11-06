---
name: "Timelineノードの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "時間の経過に沿って値を変える。扉の開閉や、光の変化などを滑らかに動かす。"
operationSteps:
  - label: "動かしたい対象を決める"
    note: "扉の回転、ライトの明るさなど、時間で変えたい値を決める"
  - label: "Timelineノードを追加する"
    note: "Blueprintのグラフに、Timelineを追加する"
  - label: "曲線で値の変化を作る"
    note: "時間と値を結ぶ曲線を作って、変化の形を決める"
  - label: "再生や逆再生を制御する"
    note: "Play・Reverseなどで、動きを始めたり、戻したりする"
  - label: "更新のたびに値を反映する"
    note: "Updateのピンから、現在の値を、対象に反映する"
---

## 概要

**Timeline**は、Blueprintで、**時間に沿って値を変える**ノード。時間と値を結んだ曲線を作り、扉の開閉、ライトの明滅、オブジェクトの移動などを滑らかに動かせる。

## 基礎文法

| ピン | 役割 |
| --- | --- |
| Play / Reverse | 再生 / 逆再生 |
| Update | 再生中に毎フレーム出る |
| Finished | 終わったときに出る |

## つまずきやすい点

- Timelineは、Actorの中のグラフで使える。関数の中では使えない
- 曲線の形で、動きの緩急が決まる。直線だと、一定の速さになる
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```text
# 流れ
Playで開始 → Updateの値を扉の回転へ反映 → Finishedで終了処理
```
