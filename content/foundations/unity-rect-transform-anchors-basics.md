---
name: "RectTransformとアンカーの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "アンカーで、UIが画面のどこを基準に配置されるかを決める。画面サイズが変わっても崩れにくくする。"
operationSteps:
  - label: "UIの基準を決める"
    note: "画面の隅・中央・全体など、どこを基準に置くかを考える"
  - label: "アンカーを設定する"
    note: "親の矩形のどこに固定するかを、アンカーで指定する"
  - label: "位置と大きさを決める"
    note: "アンカーからの距離と、幅・高さを設定する"
  - label: "引き伸ばす設定を使う"
    note: "アンカーを広げると、親の大きさに合わせて、UIが伸び縮みする"
  - label: "画面のサイズを変えて確認する"
    note: "解像度を変えて、レイアウトが崩れないかを確かめる"
---

## 概要

UIの要素は、**RectTransform**で配置される。**アンカー**は、親の矩形のどこに固定するかの基準。画面の隅に固定する、親いっぱいに広げる、といった設定で、解像度が変わっても、崩れにくいレイアウトを作れる。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Anchor Min / Max | 親の矩形のどこに固定するか |
| Pivot | 要素自身の中心 |
| Offset | アンカーからの余白 |

## つまずきやすい点

- アンカーが1点だと、親が大きくなっても、要素の大きさは変わらない。広げたい場合は、アンカーを範囲にする
- 固定の位置(Pos X/Y)で配置すると、解像度が変わったときに、ずれる場合がある
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class StretchUi : MonoBehaviour
{
    private void Start()
    {
        var rect = (RectTransform)transform;
        rect.anchorMin = Vector2.zero;   // 親の左下
        rect.anchorMax = Vector2.one;    // 親の右上(親いっぱいに広げる)
        rect.offsetMin = Vector2.zero;
        rect.offsetMax = Vector2.zero;
    }
}
```
