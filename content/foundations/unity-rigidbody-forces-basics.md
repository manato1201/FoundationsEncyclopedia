---
name: "Rigidbodyに力を加える基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "Rigidbodyに力や速度を与えて、物理の動きを作る。FixedUpdateで行う。"
operationSteps:
  - label: "Rigidbodyを付ける"
    note: "動かしたいオブジェクトに、Rigidbodyを付けて、物理の対象にする"
  - label: "動かし方を決める"
    note: "力を加える(AddForce)か、速度を直接設定するかを決める"
  - label: "FixedUpdateで力を加える"
    note: "物理の更新に合わせて、FixedUpdateの中で、力を与える"
  - label: "力の種類を選ぶ"
    note: "継続的な力、一瞬の衝撃など、ForceModeで加え方を選ぶ"
  - label: "質量や抵抗を調整する"
    note: "質量・空気抵抗などを調整して、動きの重さを整える"
---

## 概要

**Rigidbody**を付けたオブジェクトは、物理演算に従って動く。**AddForce**で力を加えると、質量や抵抗に従って、加速や減速をする。物理の処理は、一定間隔で呼ばれる**FixedUpdate**で行うのが基本。

## 基礎文法

| ForceMode | 意味 |
| --- | --- |
| Force | 継続的な力(質量を考慮) |
| Impulse | 一瞬の衝撃(質量を考慮) |
| VelocityChange | 速度を直接変える(質量を無視) |

## つまずきやすい点

- Transformを直接動かすと、物理演算と食い違って、すり抜けなどが起きる。物理で動かすものは、Rigidbodyを通して動かす
- Updateで力を加えると、フレームレートによって効き方が変わる。FixedUpdateで行う
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class Jump : MonoBehaviour
{
    [SerializeField] private Rigidbody body;

    private void FixedUpdate()
    {
        if (Input.GetKey(KeyCode.Space))
        {
            body.AddForce(Vector3.up * 10f, ForceMode.Force);
        }
    }
}
```
