---
name: "タイマーとDelayの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "一定の時間のあとや、一定の間隔で、処理を実行する。"
operationSteps:
  - label: "実行したい処理を決める"
    note: "時間が経ってから、または、繰り返し実行したい処理を決める"
  - label: "一度だけ遅らせるならDelayを使う"
    note: "Delayノードで、指定した秒数のあとに、続きを実行する"
  - label: "繰り返すならSet Timerを使う"
    note: "Set Timer by Eventで、一定の間隔で、イベントを実行する"
  - label: "タイマーを止める"
    note: "Clear and Invalidate Timerで、タイマーを止める"
  - label: "対象が破棄される場合を考える"
    note: "実行時に対象が存在しないと、問題になる。存在の確認や、タイマーの解除を行う"
---

## 概要

時間に関する処理には、**Delay**と**タイマー**がある。**Delay**は、指定した秒数のあとに、続きを実行する。**Set Timer**は、一定の間隔で、繰り返し処理を実行できる。Tickで毎フレーム確認するより、効率がよい。

## 基礎文法

| 方法 | 用途 |
| --- | --- |
| Delay | 一定時間のあとに、1回だけ続きを実行する |
| Set Timer by Event | 一定間隔で繰り返す(または1回) |
| Clear Timer | タイマーを止める |

## つまずきやすい点

- Delayの途中で、対象が破棄されると、その先は実行されない場合がある
- タイマーを、設定したまま止め忘れると、不要な処理が続く。必要がなくなったら、止める
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
FTimerHandle Handle;
GetWorldTimerManager().SetTimer(Handle, this, &AMyActor::Pulse, 1.0f, true);  // 1秒ごとにPulseを呼ぶ
```
