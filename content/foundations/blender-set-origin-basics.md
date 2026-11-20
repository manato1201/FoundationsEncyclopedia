---
name: "原点(Origin)の設定の基礎(Blender)"
category: DCC
subcategory: "Blender"
summary: "オブジェクトの原点は、回転・拡大の中心になる点。メッシュを動かさずに、原点だけを置き直せる。"
claim: "原点は、そのオブジェクトの回転・拡大の中心。形を変えずに、原点だけを動かせる。"
operationSteps:
  - label: "原点の位置を確認する"
    note: "オブジェクトを選ぶと、小さな黄色い点として、原点が表示される。回転・拡大は、この点を中心に行われる"
  - label: "原点をどこに置くか決める"
    note: "ジオメトリの中心・3Dカーソルの位置・足元など、動かしやすい位置を決める"
  - label: "3Dカーソルを置く(必要なら)"
    note: "Shift+右クリックで置く。Shift+S のメニューで、選択物へ移すこともできる"
  - label: "Set Originで設定する"
    note: "Object > Set Origin から、「Origin to Geometry」や「Origin to 3D Cursor」を選ぶ"
  - label: "回転・拡大で確かめる"
    note: "R や S を使い、期待した点を中心に動くか確かめる。形そのものは、動いていない"
quiz:
  - question: "Set Origin(Origin to Geometry など)を実行すると、メッシュの見た目の位置はどうなるか"
    choices:
      - "メッシュの見た目は、動かない"
      - "メッシュが原点に合わせて動く"
      - "メッシュが削除される"
    answer: 0
    explanation: "原点だけが動き、メッシュは、見た目の位置のまま。(メッシュの方を原点に合わせるのは、別の操作)"
---

## 概要

Blenderのすべてのオブジェクトには**原点**(Origin)があり、位置・回転・拡大の基準になる。原点が形の中心から離れていると、回転すると大きく振り回され、拡大すると位置がずれて見える。原点の置き直しは、**メッシュそのものは動かさずに**、基準点だけを動かす操作。扉を蝶番の位置で回す、キャラクターの足元を原点にする、といった場面で使う。

## 基礎文法

| メニュー(Object > Set Origin) | 意味 |
| --- | --- |
| Geometry to Origin | メッシュを、原点の位置へ動かす(原点は動かない) |
| Origin to Geometry | 原点を、メッシュの中心へ動かす |
| Origin to 3D Cursor | 原点を、3Dカーソルの位置へ動かす |
| Origin to Center of Mass (Surface / Volume) | 原点を、重心に動かす |

- 3Dカーソルは、Shift+右クリックで置き、Shift+S のメニューで「Cursor to Selected」などにできる
- 編集モードで頂点を選び、そこへ3Dカーソルを移して、原点を置く方法もよく使う
- 親子関係([ペアレントの基礎](/foundations/blender-parenting-basics))がある場合は、親の原点が、子の動きの基準になる

## つまずきやすい点

- 「メッシュを原点に合わせたい」のか、「原点をメッシュに合わせたい」のかで、選ぶ項目が逆になる。名前の向き(A to B は、A を B へ動かす)で確認する
- 同じメッシュデータを共有する複数のオブジェクト(リンク複製)では、原点の操作が、他のオブジェクトにも影響することがある。ゲームエンジンへ書き出すときは、原点が、モデルの基準になる点なので、事前に整える
- 原点を移したあとにスケールが変わっていないかは、[トランスフォームの適用](/foundations/blender-apply-transform-basics)の章と合わせて確認する
- 操作の名称は、版によって違う場合がある

## 実装例(コード)

```python
import bpy

obj = bpy.context.active_object

# 原点を、ジオメトリの中心(中央値)へ置き直す(メッシュの見た目は動かない)
bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="MEDIAN")

# 3Dカーソルの位置へ置き直すなら
# bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
print(obj.location)
```
