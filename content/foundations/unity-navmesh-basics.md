---
name: NavMeshによる経路探索の基礎(Unity)
category: ツール別
subcategory: Unity
summary: 歩ける範囲を事前に計算して(ベイク)、NavMeshAgentに目的地を指定すると、障害物を避けて移動する。
operationSteps:
  - label: 歩ける範囲を決める
    note: 床や地形など、キャラクターが歩ける面を、ナビゲーションの対象にする
  - label: NavMeshをベイクする
    note: 歩ける範囲を、あらかじめ計算してデータにする(ベイク)
  - label: エージェントを設定する
    note: 動かしたいキャラクターに、NavMeshAgentを付ける。速度・大きさなどを設定する
  - label: 目的地を指定する
    note: スクリプトから、エージェントに目的地を指定する
  - label: 障害物を避けて移動する
    note: エージェントが、ベイクされた範囲の中で、経路を探して移動する
---

## 概要

NavMesh(ナビゲーションメッシュ)は、キャラクターが**歩ける範囲を表したデータ**。あらかじめ計算(ベイク)しておくと、`NavMeshAgent`に目的地を渡すだけで、障害物を避ける経路を探して、移動してくれる。

## 基礎文法

| 要素            | 役割                                        |
| --------------- | ------------------------------------------- |
| NavMesh         | 歩ける範囲のデータ(ベイクして作る)          |
| NavMeshAgent    | NavMesh上を、目的地へ移動するコンポーネント |
| NavMeshObstacle | 動く障害物。エージェントが避ける            |

## つまずきやすい点

- 地形を変えたら、NavMeshのベイクをやり直す。変更前のデータのままだと、実際の地形と食い違う
- エージェントの大きさ(半径・高さ)が、ベイクの設定と合っていないと、通れるはずの場所を通れないことがある
- 使うパッケージや、設定画面の場所は、Unityのバージョンで異なる場合がある。使っている版のドキュメントで確認する

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.AI;

public class MoveToTarget : MonoBehaviour
{
    [SerializeField] private Transform target;
    private NavMeshAgent agent;

    private void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        agent.SetDestination(target.position);  // 障害物を避けて、目的地へ向かう
    }
}
```
