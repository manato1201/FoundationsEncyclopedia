---
name: "AABBによる衝突判定の基礎"
category: Framework
subcategory: "ゲームエンジン基盤"
summary: "軸に平行な箱(AABB)どうしが重なっているかを、軸ごとの範囲の比較だけで判定する、最も基本的な衝突判定。"
claim: "AABBは、すべての軸で範囲が重なっているときだけ、重なっている。"
operationSteps:
  - label: "物を軸に平行な箱で囲む"
    note: "形が複雑でも、x・y(3Dならz)の最小値と最大値で決まる箱で近似する"
  - label: "x軸の範囲が重なるか調べる"
    note: "`a.minX <= b.maxX` かつ `a.maxX >= b.minX` なら、x軸では重なっている"
  - label: "y軸も同じように調べる"
    note: "3Dなら、z軸も調べる。1つの軸でも離れていれば、その時点で重なっていない"
  - label: "すべての軸で重なれば衝突"
    note: "全軸の条件が成り立ったときだけ、2つの箱は重なっている"
  - label: "衝突したら処理する"
    note: "押し戻す・ダメージを与える・イベントを出すなどの反応を行う"
quiz:
  - question: "2つのAABBが重ならないと言い切れるのは、どの場合か"
    choices:
      - "すべての軸で、範囲が離れているとき"
      - "どれか1つの軸で、範囲が離れているとき"
      - "中心どうしの距離が0でないとき"
    answer: 1
    explanation: "重なるには全軸で範囲が重なる必要がある。1つの軸でも離れていれば、衝突していない。"
---

## 概要

ゲームの衝突判定では、形そのものを厳密に調べると重いため、まず**単純な形で近似**する。最も基本的なのが**AABB**(Axis-Aligned Bounding Box: 軸に平行な箱)。回転しない長方形(3Dなら直方体)なので、各軸の最小値・最大値を比べるだけで、重なりが分かる。計算が軽く、粗い判定として広く使われる。

## 基礎文法

```text
重なる  =  (a.minX <= b.maxX  かつ  a.maxX >= b.minX)
       かつ (a.minY <= b.maxY  かつ  a.maxY >= b.minY)
       (3Dなら、z軸も同じ形で加える)
```

| 形 | 計算の軽さ | 向く場面 |
| --- | --- | --- |
| AABB | 軽い | 最初の粗い判定、矩形のキャラクター |
| 円・球 | 軽い(距離の比較) | 丸いもの、弾 |
| 回転する箱(OBB) | やや重い | 回転する細長いもの |

- 物理エンジンの当たり判定との関係は[物理エンジンの基礎概念](/foundations/physics-engine-basics)を参照
- 多数の物を調べるときは、空間を区切って候補を減らす方法を併用する

## つまずきやすい点

- 境界ぎりぎりで接しているだけの場合を、衝突とみなすかは、比較演算子(`<=`か`<`)で決まる。ゲームの仕様に合わせる
- 回転した物を囲むAABBは、元の形より大きくなる。見た目より広い範囲で反応して見えることがある
- 速い物は、1フレームで相手を飛び越える(すり抜け)ことがある。移動の軌跡を考える判定(連続衝突判定)や、移動を細かく分ける方法が必要になる
- 引数の取り違えを防ぐため、`min`と`max`の大小関係(`min <= max`)を、箱を作るときに保証しておく

## 実装例(コード)

```python
from dataclasses import dataclass

@dataclass
class Box:
    min_x: float
    min_y: float
    max_x: float
    max_y: float

def overlaps(a: Box, b: Box) -> bool:
    return (a.min_x <= b.max_x and a.max_x >= b.min_x
            and a.min_y <= b.max_y and a.max_y >= b.min_y)

player = Box(0, 0, 2, 2)
print(overlaps(player, Box(1, 1, 3, 3)))   # True(重なっている)
print(overlaps(player, Box(3, 0, 5, 2)))   # False(x軸で離れている)
```
