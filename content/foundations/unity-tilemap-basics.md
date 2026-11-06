---
name: "Tilemapの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "格子状のタイルを並べて、2Dの地形やマップを作る。"
operationSteps:
  - label: "タイルの画像を用意する"
    note: "地面・壁など、同じ大きさのタイルの画像を用意する"
  - label: "タイルパレットを作る"
    note: "タイルをまとめた、パレットを作る"
  - label: "Tilemapを作る"
    note: "格子(Grid)の下に、Tilemapを作り、描画する層にする"
  - label: "パレットから塗る"
    note: "パレットのタイルを選び、ブラシのように、シーンへ塗る"
  - label: "コライダーを付ける"
    note: "Tilemap Colliderで、タイルに当たり判定を付ける"
---

## 概要

**Tilemap**は、格子状に**タイルを並べて**、2Dのマップを作る機能。同じタイルを繰り返し使うので、効率よく広いマップを作れる。レイヤーごとに、Tilemapを分けて管理する。

## 基礎文法

| 要素 | 役割 |
| --- | --- |
| Grid | 格子の親。セルの大きさを決める |
| Tilemap | タイルを置く層 |
| Tile Palette | 塗るタイルを選ぶ道具 |

## つまずきやすい点

- タイルの画像の大きさが、そろっていないと、継ぎ目がずれる
- 背景と当たり判定を、別のTilemapに分けると、管理しやすい
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.Tilemaps;

public class PlaceTile : MonoBehaviour
{
    [SerializeField] private Tilemap tilemap;
    [SerializeField] private TileBase tile;

    private void Start()
    {
        tilemap.SetTile(new Vector3Int(0, 0, 0), tile);  // セルにタイルを置く
    }
}
```
