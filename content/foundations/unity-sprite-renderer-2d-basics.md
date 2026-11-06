---
name: "2DスプライトとSprite Rendererの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "2Dの画像をスプライトとして表示する。描画の順序や、ピクセルの見え方を設定する。"
operationSteps:
  - label: "画像をスプライトとして取り込む"
    note: "画像を、テクスチャタイプをSpriteにして、インポートする"
  - label: "シーンに配置する"
    note: "スプライトをシーンへ置くと、Sprite Rendererが付く"
  - label: "描画の順序を決める"
    note: "Sorting LayerとOrder in Layerで、前後関係を決める"
  - label: "ピクセルの見え方を整える"
    note: "ピクセルアートでは、Pixels Per Unitなどを合わせる"
  - label: "色や反転を調整する"
    note: "Colorで色味を変え、Flipで左右を反転する"
---

## 概要

2Dのゲームでは、画像を**スプライト**として扱う。シーンに置くと、**Sprite Renderer**が付いて表示される。前後関係は**Sorting Layer**と**Order in Layer**で決める。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Sorting Layer | 描画の大きなグループ(背景・キャラなど) |
| Order in Layer | 同じレイヤー内の前後 |
| Pixels Per Unit | 1ユニットあたりのピクセル数 |

## つまずきやすい点

- Pixels Per Unitの値で、画面上の大きさが変わる。複数の素材で、そろえる
- 前後関係が思ったとおりにならないときは、Sorting LayerとOrderの両方を確認する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;

public class FlipSprite : MonoBehaviour
{
    [SerializeField] private SpriteRenderer sprite;

    public void FaceLeft(bool left)
    {
        sprite.flipX = left;  // 左右を反転する
    }
}
```
