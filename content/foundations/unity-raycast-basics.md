---
name: "Raycastの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "見えない光線を飛ばして、何に当たるかを調べる。視線の判定や、クリックした物体の取得に使う。"
operationSteps:
  - label: "始点と向きを決める"
    note: "光線を出す位置と、向き(方向)を決める"
  - label: "距離とレイヤーを決める"
    note: "どこまで調べるか、どのレイヤーを対象にするかを決める"
  - label: "Raycastを実行する"
    note: "Physics.Raycastで、光線を飛ばして、最初に当たったものを調べる"
  - label: "結果を受け取る"
    note: "RaycastHitから、当たったオブジェクトや、位置・法線を取得する"
  - label: "結果に応じて処理する"
    note: "当たったものに応じて、選択・攻撃・移動などの処理を行う"
---

## 概要

**Raycast**は、ある点から、ある方向へ**光線を飛ばし**、最初に当たったコライダーを調べる機能。敵に当たったか、足元に地面があるか、クリックした位置に何があるかなどを、判定できる。

## 基礎文法

| 引数 | 意味 |
| --- | --- |
| origin | 光線の始点 |
| direction | 光線の向き |
| maxDistance | 調べる最大の距離 |
| layerMask | 対象のレイヤー |

## つまずきやすい点

- 対象のオブジェクトに、コライダーが付いていないと、当たらない
- 自分自身のコライダーに、当たってしまう場合がある。レイヤーで除外する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class Shooter : MonoBehaviour
{
    private void Update()
    {
        if (Physics.Raycast(transform.position, transform.forward, out RaycastHit hit, 20f))
        {
            Debug.Log(hit.collider.name);  // 当たったオブジェクトの名前
        }
    }
}
```
