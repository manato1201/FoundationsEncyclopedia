---
name: "ペアレント(親子付け)の基礎(Blender)"
category: DCC
subcategory: "Blender"
summary: "オブジェクトに親子関係を付けて、親を動かすと子もついてくるようにする。選ぶ順序(最後に親)が重要。"
claim: "親を動かすと子がついてくる。子を先に選び、親を最後に選んで、Ctrl+Pで付ける。"
operationSteps:
  - label: "子にするオブジェクトを選ぶ"
    note: "親子にしたいオブジェクトを選ぶ。複数でもよい"
  - label: "最後に親を選ぶ"
    note: "Shiftを押しながら、親にしたいオブジェクトを、最後にクリックする(最後に選んだものが、アクティブになる)"
  - label: "Ctrl+Pで親子付けする"
    note: "マウスを3Dビューポートに置いて Ctrl+P を押し、メニューから「Object」を選ぶ"
  - label: "親を動かして確認する"
    note: "親を移動・回転・拡大すると、子が同じようについてくる。子は、単独でも動かせる"
  - label: "解除するときはAlt+P"
    note: "子を選んで Alt+P。「Clear and Keep Transformation」なら、いまの見た目の位置を保ったまま解除できる"
quiz:
  - question: "Ctrl+P で親子付けするとき、親にしたいオブジェクトは、いつ選ぶか"
    choices:
      - "最初に選ぶ"
      - "最後に選ぶ(アクティブにする)"
      - "選ばなくてよい"
    answer: 1
    explanation: "アクティブな(最後に選んだ)オブジェクトが親になる。子を先に選んでから、親を最後に選ぶ。"
---

## 概要

**ペアレント**(親子付け)は、オブジェクトどうしに上下の関係を作る機能。子は、親の移動・回転・拡大に連動する。たとえば、車体を親、タイヤを子にすれば、車体を動かすだけでタイヤもついてくる。キャラクターの装備を手の骨に付ける([リギングの基礎](/foundations/blender-rigging-basics)など)といった、さまざまな場面の土台になる。

## 基礎文法

| 操作 | 方法 |
| --- | --- |
| 親子付け | 子を選ぶ → 親を最後に選ぶ → Ctrl+P → Object |
| 解除 | 子を選ぶ → Alt+P → Clear Parent など |
| 階層の確認 | アウトライナーで、親の下に子が入れ子で表示される |

- Ctrl+Pのメニューには、「Object」「Object (Keep Transform)」「Object (Without Inverse)」などの選択肢がある
- 親子付けしたときに、子の見た目の位置が変わらないよう、「親の逆行列」が子に保存される
- 親子の階層は、アウトライナーのドラッグでも作れる

## つまずきやすい点

- 選ぶ順序を逆にすると、親子が逆になる。「最後に選んだものが親」と覚える
- 子の位置の数値(N パネルの Location)は、親からの相対値になる。親を移動しても、子の数値は変わらないが、見た目の位置は動く
- 親にスケールがかかっていると、子の見た目が歪むことがある。事前に、[トランスフォームの適用](/foundations/blender-apply-transform-basics)を検討する
- 親を削除すると、子は、親の位置の影響が消えて、見た目の位置が飛ぶことがある。削除の前に、Alt+Pで「Clear and Keep Transformation」を使う

## 実装例(コード)

```python
import bpy

child = bpy.data.objects["Wheel"]
parent = bpy.data.objects["Body"]

child.parent = parent
# 見た目の位置を保つため、親の逆行列を子に記録する
child.matrix_parent_inverse = parent.matrix_world.inverted()
```
