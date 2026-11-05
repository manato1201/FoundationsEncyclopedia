---
name: レイヤーとタグの使い分け(Unity)
category: ツール別
subcategory: Unity
summary: タグは「何者か」を見分ける名札、レイヤーは「どう扱うか」(衝突・描画・Raycast)を決めるグループ。
operationSteps:
  - label: 目的を決める
    note: オブジェクトを見分けたいのか、衝突や描画の扱いを変えたいのかを分ける
  - label: 見分けたいならタグを付ける
    note: たとえば、Player や Enemy のタグを付けて、スクリプトから判定する
  - label: 扱いを変えたいならレイヤーに入れる
    note: 衝突の判定・カメラの描画・Raycastの対象を、レイヤー単位で切り替える
  - label: レイヤー間の衝突を設定する
    note: 物理の設定で、どのレイヤーどうしが衝突するかを決める
  - label: スクリプトで使う
    note: CompareTagでタグを判定し、LayerMaskでRaycastの対象を絞る
---

## 概要

Unityでは、オブジェクトを分類する仕組みが2つある。**タグ**は、オブジェクトに付ける名札で、「それが何か」を判定するために使う。**レイヤー**は、オブジェクトのグループで、物理の衝突・カメラの描画・Raycastの対象を、グループ単位で切り替えるために使う。

## 基礎文法

| 仕組み | 用途 |
| --- | --- |
| タグ | 「このオブジェクトはPlayerか」といった判定 |
| レイヤー | 衝突の有無、カメラに映すか、Raycastの対象にするか |

## つまずきやすい点

- 1つのオブジェクトに付けられるタグとレイヤーは、それぞれ1つだけ
- タグは文字列で比べる。`CompareTag`を使うと、`==`で比べるより、安全で効率がよい。存在しないタグ名を指定すると、エラーになる
- レイヤー間の衝突は、Physicsの設定(衝突マトリクス)で決まる。「ぶつからない」ときは、マトリクスの設定を確認する

## 実装例(コード)

```csharp
using UnityEngine;

public class Hit : MonoBehaviour
{
    [SerializeField] private LayerMask targetLayers;

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            Debug.Log("プレイヤーが入った");
        }
    }

    private void Update()
    {
        if (Physics.Raycast(transform.position, transform.forward, out RaycastHit hit, 10f, targetLayers))
        {
            Debug.Log(hit.collider.name);  // 指定したレイヤーのオブジェクトだけが対象
        }
    }
}
```
