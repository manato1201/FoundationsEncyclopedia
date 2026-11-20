---
name: "OBJレベルとSOPレベルの違い(Houdini)"
category: DCC
subcategory: "Houdini"
summary: "Houdiniは、シーン全体を扱うOBJ(オブジェクト)レベルと、1つのジオメトリの中身を作るSOPレベルの二層でできている。"
claim: "OBJは「物の置き場」、SOPは「物の中身を作る場所」。Transformがどちらにあるかで、動く範囲が変わる。"
operationSteps:
  - label: "OBJレベルでシーンを見る"
    note: "/obj には、Geometry・カメラ・ライトなどの、オブジェクトノードが並ぶ"
  - label: "Geometryを作る"
    note: "/obj で Geometry ノードを作る。これは、ジオメトリを入れる箱で、形は持っていない"
  - label: "中に入ってSOPで形を作る"
    note: "ノードをダブルクリックするか、選んで i キーを押すと、中(/obj/geo1)に入る。Box や Transform などの SOP を並べる"
  - label: "上のレベルへ戻る"
    note: "u キーで、1つ上のレベルへ戻る。OBJレベルでは、Geometry ノードが1つの物として見える"
  - label: "どちらで動かすかを選ぶ"
    note: "OBJのTransformは物全体を動かす。SOPのTransformは、形を作る途中で、点の位置を変える"
quiz:
  - question: "Geometryオブジェクトの中でBoxやTransformなどのノードを並べる階層は、どれか"
    choices:
      - "OBJレベル"
      - "SOPレベル"
      - "どれでもない"
    answer: 1
    explanation: "SOP(Surface Operator)は、ジオメトリを作る・変えるノードの階層。OBJ はシーンの物を並べる階層。"
---

## 概要

Houdiniのノードは、階層(コンテキスト)ごとに、置けるものが違う。最初に覚えるのは2つ。**OBJ**(`/obj`)は、シーンに置く物(Geometry・カメラ・ライトなど)を並べる階層で、「どこに何があるか」を扱う。その中の**SOP**(`/obj/geo1`など)は、1つのGeometryの形を、ノードをつないで作る階層。物理シミュレーションなど別のレベル(DOPなど)は、[SOPとDOPの役割](/foundations/houdini-sop-dop-context)を参照。

## 基礎文法

| 階層 | パス(例) | 置くノード | 主な役割 |
| --- | --- | --- | --- |
| OBJ | /obj | Geometry・Camera・Light | 物の配置、親子、シーン構成 |
| SOP | /obj/geo1 | Box・Transform・Merge など | 点・面などの形を作る |

- 下の階層へは`i`キー、上へは`u`キー(ネットワークエディタ上)
- 画面上部のパス欄(`/obj/geo1`のような表示)をクリックして、直接移動もできる
- OBJレベルのノードは、SOPの中身を、ひとかたまりの「物」として扱う

## つまずきやすい点

- OBJレベルでGeometryを作っても、中にノードを置かなければ何も表示されない。中に入って、SOPを作る
- 動かしたいのが物全体なら、OBJレベル(オブジェクトのTransformパラメーター)で動かす。形そのものを変えたいなら、SOPレベルで変更する。2つを混ぜると、後で元に戻しにくい
- 形が表示されないときは、いま見ているのがどの階層(パス)かと、SOPの表示フラグがどのノードに付いているかを確かめる
- ショートカットやノード名は、版によって違う場合がある

## 実装例(コード)

```python
import hou

obj = hou.node("/obj")                    # OBJレベル
geo = obj.createNode("geo", "my_geo")     # Geometryオブジェクトを作る(中身は空)

box = geo.createNode("box")               # SOPレベル(/obj/my_geo の中)にノードを作る
box.setDisplayFlag(True)                  # 表示するノードとして指定する
print(geo.path(), box.path())             # /obj/my_geo /obj/my_geo/box1
```
