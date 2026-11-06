---
name: "Scatterの基礎(Houdini)"
category: DCC
subcategory: "Houdini"
summary: "面や体積の上に、点をランダムに散らす。草や石を並べる土台になる。"
operationSteps:
  - label: "散らす対象を用意する"
    note: "地面など、点を置きたい面を用意する"
  - label: "Scatterノードをつなぐ"
    note: "対象のジオメトリを、Scatterノードの入力へつなぐ"
  - label: "点の数を決める"
    note: "Force Total Countなどで、散らす点の数を設定する"
  - label: "乱数の種を調整する"
    note: "シードを変えると、配置のパターンが変わる"
  - label: "点にコピーして使う"
    note: "できた点に、Copy to Pointsで、草などのオブジェクトを並べる"
---

## 概要

**Scatter**は、面や体積の上に、**点をランダムに散らす**ノード。散らした点に、草・石・木などをコピーして並べると、自然な配置を作れる。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| 点の数 | 散らす点の合計 |
| シード | 乱数の種。値を変えると配置が変わる |
| 密度 | 面積あたりの点の多さ |

## つまずきやすい点

- 点の数が多いと、重くなる。必要な数にとどめる
- 面の大きさが違うと、密度が偏る場合がある。密度の設定を確認する
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import hou

geo = hou.node("/obj").createNode("geo")
grid = geo.createNode("grid")
scatter = geo.createNode("scatter")
scatter.setInput(0, grid)
```
