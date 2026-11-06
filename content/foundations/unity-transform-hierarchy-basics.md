---
name: "Transformと親子関係の基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "位置・回転・拡大は、親から見た相対の値(ローカル)と、世界での値(ワールド)で表される。"
operationSteps:
  - label: "オブジェクトのTransformを確認する"
    note: "位置・回転・スケールの3つが、すべてのオブジェクトにある"
  - label: "親子関係を作る"
    note: "オブジェクトを、別のオブジェクトの下に置くと、親子になる"
  - label: "親を動かして子を確認する"
    note: "親を動かすと、子も一緒に動く。子の値は、親から見た相対の値(ローカル)"
  - label: "ローカルとワールドを使い分ける"
    note: "親から見た値はlocalPosition、世界での値はpositionで扱う"
  - label: "スクリプトから操作する"
    note: "SetParentなどで、親子関係を変える。そのとき、位置を保つかを指定する"
---

## 概要

Unityのすべてのオブジェクトは**Transform**(位置・回転・スケール)を持つ。オブジェクトを別のオブジェクトの下に置くと**親子関係**になり、親の動きが子に伝わる。子の値は、**親から見た相対の値(ローカル)**として表示される。

## 基礎文法

| 値 | 意味 |
| --- | --- |
| position | 世界での位置(ワールド) |
| localPosition | 親から見た位置(ローカル) |
| SetParent | 親子関係を変える |

## つまずきやすい点

- 親のスケールが1でないと、子の見た目や回転が、ゆがむ場合がある
- ローカルとワールドを取り違えると、思わぬ位置に動く。どちらの値を使うかを確認する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class Attach : MonoBehaviour
{
    [SerializeField] private Transform parent;

    private void Start()
    {
        transform.SetParent(parent, worldPositionStays: true); // 見た目の位置を保ったまま、親子にする
    }
}
```
