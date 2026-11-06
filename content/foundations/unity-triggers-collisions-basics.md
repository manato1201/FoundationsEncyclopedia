---
name: "トリガーとコリジョンの違い(Unity)"
category: ツール別
subcategory: "Unity"
summary: "コリジョンは物理的にぶつかり、トリガーは通り抜けながら、入ったことだけを知らせる。"
operationSteps:
  - label: "コライダーを付ける"
    note: "判定に使う、形(コライダー)を付ける"
  - label: "ぶつけたいならコリジョンにする"
    note: "Is Triggerをオフのまま。物理的にぶつかり、OnCollisionEnterが呼ばれる"
  - label: "通り抜けたいならトリガーにする"
    note: "Is Triggerをオンにする。通り抜けて、OnTriggerEnterが呼ばれる"
  - label: "Rigidbodyの有無を確認する"
    note: "どちらも、片方にRigidbodyがないと、イベントが呼ばれない"
  - label: "イベントの中で処理する"
    note: "入った相手を調べて、ダメージやアイテム取得などの処理を行う"
---

## 概要

Unityの当たり判定は、**コリジョン**と**トリガー**がある。コリジョンは、物理的にぶつかって、跳ね返ったり止まったりする。トリガーは、**通り抜けられる**が、入ったことを検知できる。取得アイテムや、エリアの判定に向く。

## 基礎文法

| 種類 | 挙動 | イベント |
| --- | --- | --- |
| コリジョン | ぶつかって止まる・跳ね返る | OnCollisionEnter など |
| トリガー | 通り抜ける | OnTriggerEnter など |

## つまずきやすい点

- 2つのオブジェクトのどちらにも、Rigidbodyがないと、イベントは呼ばれない(少なくとも一方に必要)
- トリガーにしたつもりが、Is Triggerがオフだと、物理的にぶつかってしまう
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class Coin : MonoBehaviour
{
    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            Destroy(gameObject);  // コインを取得して消す
        }
    }
}
```
