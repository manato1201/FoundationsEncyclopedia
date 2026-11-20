---
name: "複製とインスタンスの基礎(Maya)"
category: DCC
subcategory: "Maya"
summary: "Duplicate は独立したコピーを作り、Instance は形(シェイプ)を共有するコピーを作る。形を後から直すなら、インスタンスが便利。"
claim: "コピーは独立、インスタンスは形を共有。形をまとめて直したいときはインスタンスを使う。"
operationSteps:
  - label: "複製したいオブジェクトを選ぶ"
    note: "ビューポートかアウトライナーで選ぶ"
  - label: "通常の複製を行う"
    note: "Ctrl+D(Edit > Duplicate)で、独立したコピーができる。元とコピーは、形も別のデータになる"
  - label: "Duplicate Special"
    note: "Edit > Duplicate Special のオプションで、コピー数・移動量・回転・拡大を指定する"
  - label: "Instanceを選ぶ"
    note: "オプションの Geometry type を Instance にすると、形(シェイプ)を共有するコピーになる"
  - label: "形を編集して確かめる"
    note: "元の頂点を動かすと、インスタンスにも反映される。位置・回転・拡大は、それぞれ別に設定できる"
quiz:
  - question: "インスタンスで複製した2つのオブジェクトのうち、片方の頂点を編集すると、どうなるか"
    choices:
      - "もう一方にも同じ変形が反映される"
      - "もう一方は変わらない"
      - "もう一方が削除される"
    answer: 0
    explanation: "インスタンスは、形のデータを共有する。形の編集は、すべてのインスタンスに反映される。"
---

## 概要

同じ形のものを何度も置くとき(柱・木・ボルトなど)、Mayaには2つの複製の方法がある。通常の**複製**(Duplicate)は、形のデータごとコピーするので、元とは別物になる。**インスタンス**(Instance)は、形のデータを1つだけ持ち、複数の場所から参照する。位置・回転・拡大は別々に持てるが、形は常に同じ。あとから形を直すときに、1か所を直すだけで済み、データ量も減らせる。

## 基礎文法

| 操作 | 結果 | 向く場面 |
| --- | --- | --- |
| Duplicate(Ctrl+D) | 独立したコピー | あとで個別に形を変える |
| Duplicate Special > Instance | 形を共有するコピー | 同じ形を何度も置く |
| Duplicate Special のオフセット | コピーごとに、位置などをずらす | 等間隔に並べる |

- インスタンスは、アウトライナーで、別々のトランスフォームの下に、同じシェイプの名前が表示される
- インスタンスを、独立したオブジェクトに戻したいときは、Modify > Convert > Instance to Object を使う(名称は版による)

## つまずきやすい点

- インスタンスの頂点を編集して、全部に反映されて驚く。個別に形を変えたいものは、最初から通常の複製にする
- インスタンスのスケールを、負の値にして、鏡像を作る方法がある。ただし、法線やゲームエンジンへの書き出しで問題になることがあるので、確認する
- ゲームエンジンへ書き出す(FBX)と、インスタンスが、通常のオブジェクトとして展開されることがある。取り扱いは、書き出し先の設定で確かめる([FBXの書き出し](/foundations/maya-fbx-export-basics))
- 複製のオプションは、前回の設定が残る。実行前に、毎回、オプションを確認する

## 実装例(コード)

```python
import maya.cmds as cmds

pillar = cmds.polyCylinder(name="pillar", radius=0.5, height=4)[0]

for i in range(1, 4):
    inst = cmds.instance(pillar)[0]                 # 形を共有するコピー
    cmds.move(i * 3, 0, 0, inst, relative=True)     # 位置だけを、別に動かす

copy = cmds.duplicate(pillar)[0]                    # 独立した複製
```
