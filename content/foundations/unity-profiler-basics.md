---
name: "Profilerの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "Profilerで、どの処理に時間がかかっているかを調べて、重さの原因を特定する。"
operationSteps:
  - label: "重いと感じる場面を再現する"
    note: "遅くなる操作や、場所を再現できるようにする"
  - label: "Profilerを開いて記録する"
    note: "ゲームを実行しながら、Profilerで記録を取る"
  - label: "重いフレームを探す"
    note: "グラフの山が高い、処理の重いフレームを見つける"
  - label: "原因の処理を特定する"
    note: "CPUの内訳を見て、時間のかかっているスクリプトや処理を探す"
  - label: "直して再計測する"
    note: "改善して、もう一度測り、効果を確かめる"
---

## 概要

**Profiler**は、ゲームの実行中に、**どの処理にどれだけ時間がかかっているか**を記録して、見せてくれる道具。推測で直さず、測って原因を特定するために使う。CPU・メモリ・描画などの項目がある。

## 基礎文法

| 項目 | 見るもの |
| --- | --- |
| CPU Usage | 処理ごとの時間 |
| Memory | メモリの使用量 |
| Rendering | 描画に関する数値 |

## つまずきやすい点

- エディターでの計測は、実際の端末と違う。最終的には、ビルドして実機で計測する
- 計測そのものが、動作に影響する場合がある(特に詳細な計測)
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine.Profiling;
using UnityEngine;

public class Heavy : MonoBehaviour
{
    private void Update()
    {
        Profiler.BeginSample("HeavyWork");  // Profilerに、名前付きの区間として表示される
        // 重い処理
        Profiler.EndSample();
    }
}
```
