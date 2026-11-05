---
name: MonoBehaviourのライフサイクル(呼ばれる順序)
category: ツール別
subcategory: Unity
summary: Awake・Start・Update などが呼ばれる順序を知って、初期化と毎フレームの処理を正しい場所に書く。
operationSteps:
  - label: Awake が呼ばれる
    note: オブジェクトが読み込まれたときに、1回呼ばれる。自分自身の初期化に使う
  - label: OnEnable が呼ばれる
    note: オブジェクトが有効になるたびに呼ばれる。イベントの登録などに使う
  - label: Start が呼ばれる
    note: 最初のUpdateの前に、1回呼ばれる。ほかのオブジェクトのAwakeが終わったあとなので、参照して初期化できる
  - label: FixedUpdate と Update が繰り返される
    note: FixedUpdate は一定間隔(物理の更新用)、Update は毎フレーム呼ばれる
  - label: LateUpdate が呼ばれる
    note: すべてのUpdateが終わったあとに呼ばれる。カメラの追従など、動きが終わったあとの処理に使う
  - label: OnDisable と OnDestroy が呼ばれる
    note: 無効になるとき・破棄されるときの後始末(イベントの解除など)を行う
quiz:
  - question: "物理演算に関わる処理を書くのに向いているメソッドはどれか"
    choices:
      - "Update"
      - "FixedUpdate"
      - "Start"
    answer: 1
    explanation: "FixedUpdateは一定の間隔で呼ばれるので、物理演算の処理に向く。"
---

## 概要

Unityの`MonoBehaviour`は、決まった順序で特定のメソッドが呼ばれる。この**ライフサイクル**を理解すると、初期化・毎フレームの処理・後始末を、正しい場所に書ける。

## 基礎文法

| メソッド | いつ呼ばれるか |
| --- | --- |
| Awake | 読み込み時に1回(自分自身の初期化) |
| OnEnable | 有効になるたびに |
| Start | 最初のUpdateの前に1回(他の参照を使う初期化) |
| FixedUpdate | 一定間隔で(物理の更新) |
| Update | 毎フレーム |
| LateUpdate | すべてのUpdateのあとで |
| OnDisable / OnDestroy | 無効になるとき / 破棄されるとき |

## つまずきやすい点

- 別のオブジェクトを参照する初期化を`Awake`で行うと、相手の`Awake`がまだ終わっていないことがある。参照は`Start`で使う
- `Update`は、フレームレートによって呼ばれる回数が変わる。移動などは、`Time.deltaTime`を掛けて、速さをそろえる
- `OnEnable`で登録したイベントは、`OnDisable`で必ず解除する。解除し忘れると、破棄されたオブジェクトが呼ばれる原因になる

## 実装例(コード)

```csharp
using UnityEngine;

public class Mover : MonoBehaviour
{
    [SerializeField] private float speed = 3f;

    private void Update()
    {
        transform.Translate(Vector3.forward * (speed * Time.deltaTime));
    }
}
```
