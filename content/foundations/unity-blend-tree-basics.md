---
name: "ブレンドツリーの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "速さなどの値に応じて、複数のアニメーションを滑らかに混ぜる。"
operationSteps:
  - label: "混ぜたい動きを用意する"
    note: "待機・歩く・走るなどの、アニメーションを用意する"
  - label: "パラメーターを決める"
    note: "Speedのような、混ぜ具合を決める数値のパラメーターを作る"
  - label: "ブレンドツリーを作る"
    note: "アニメーターの状態として、ブレンドツリーを作る"
  - label: "動きを値に割り当てる"
    note: "待機を0、歩きを0.5、走りを1、のように、値を対応させる"
  - label: "スクリプトから値を渡す"
    note: "動きの速さに応じて、パラメーターを変えると、滑らかに切り替わる"
---

## 概要

**ブレンドツリー**は、パラメーターの値に応じて、**複数のアニメーションを混ぜ合わせる**仕組み。速さに応じて、待機から歩き、走りへと、滑らかに移り変わる動きを作れる。

## 基礎文法

| 種類 | 用途 |
| --- | --- |
| 1D | 1つの値で混ぜる(速さなど) |
| 2D | 2つの値で混ぜる(前後左右の移動など) |

## つまずきやすい点

- 動きの歩幅や足の位置がそろっていないと、混ぜたときに滑って見える
- パラメーターの名前が、スクリプトとアニメーターで一致していないと、反応しない
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class MoveAnimation : MonoBehaviour
{
    [SerializeField] private Animator animator;

    public void SetSpeed(float speed)
    {
        animator.SetFloat("Speed", speed);  // ブレンドツリーのパラメーター
    }
}
```
