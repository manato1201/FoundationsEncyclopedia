---
name: "ライトのモビリティ(Static・Stationary・Movable)の基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "Unreal Engine のライトは、動かせるかどうかと、光を事前に焼くかどうかを、モビリティで決める。処理の軽さと自由度のトレードオフ。"
claim: "Static は焼く(軽い・動かせない)、Movable は毎フレーム計算(自由・重い)、Stationary はその中間。"
operationSteps:
  - label: "ライトを配置する"
    note: "Point Light・Spot Light・Directional Light などを、レベルに置く"
  - label: "Mobilityを選ぶ"
    note: "Details パネルの Transform > Mobility で、Static・Stationary・Movable から選ぶ"
  - label: "Staticは光を焼き込む"
    note: "ビルド時に、光の結果をテクスチャ(ライトマップ)に焼く。実行時の計算は、ほぼ不要。ライトは動かせず、設定も変えられない"
  - label: "Stationaryは一部を焼く"
    note: "位置は固定だが、色・強さを実行時に変えられる。静的な物が落とす影は、焼かれる"
  - label: "Movableは完全に動的"
    note: "移動・色・強さを自由に変えられ、影も毎フレーム計算される。そのぶん、負荷が高い"
quiz:
  - question: "ゲーム中に、ライトを動かしたい(例: 持ち運ぶランタン)。適したモビリティはどれか"
    choices:
      - "Static"
      - "Stationary"
      - "Movable"
    answer: 2
    explanation: "位置を動かせるのは Movable だけ。Static と Stationary は、位置が固定。"
visual:
  kind: compare
  question: "光をどこまで焼いておくと、何を変えられなくなる?"
  approx: "実行時の計算量は定性的な傾向(版・設定で変わる)"
  columns:
    - { id: static, label: "Static", tag: "BAKED", tone: blue, units: { count: 8, cols: 4, label: "実行時の計算(傾向)" } }
    - { id: stationary, label: "Stationary", tag: "MIXED", tone: amber, units: { count: 8, cols: 4, label: "実行時の計算(傾向)" } }
    - { id: movable, label: "Movable", tag: "DYNAMIC", tone: pink, units: { count: 8, cols: 4, label: "実行時の計算(傾向)" } }
  steps:
    - short: "配置"
      cells:
        static: { lit: 0, text: "同じライトを置く" }
        stationary: { lit: 0, text: "同じライトを置く" }
        movable: { lit: 0, text: "同じライトを置く" }
      verdict: "同じライトを、Mobility だけ変えて比べる"
    - short: "Mobility"
      cells:
        static: { lit: 1, order: all, text: "光をすべて焼く" }
        stationary: { lit: 4, order: all, text: "一部を焼く" }
        movable: { lit: 8, order: all, text: "毎フレーム計算する" }
      verdict: "焼く部分が多いほど、実行時は軽く、変えられることは減る"
    - short: "軽さ"
      cells:
        static: { lit: 1, order: all, mark: good, text: "実行時の計算はほぼ不要", note: "ライトマップに焼き込む" }
        stationary: { lit: 4, order: all, mark: fair, text: "中くらい" }
        movable: { lit: 8, order: all, mark: poor, text: "重い", note: "影も毎フレーム計算" }
      verdict: "動かさない照明は、焼いて軽くできる"
    - short: "色・強さ"
      cells:
        static: { lit: 1, order: all, mark: poor, text: "変えられない", note: "変更はライティングのビルドが要る" }
        stationary: { lit: 4, order: all, mark: good, text: "実行時に変えられる", note: "静的な物の影は焼く" }
        movable: { lit: 8, order: all, mark: good, text: "実行時に変えられる" }
      verdict: "色・強さを変えたいなら、Stationary か Movable"
    - short: "移動"
      cells:
        static: { lit: 1, order: all, mark: poor, text: "動かせない" }
        stationary: { lit: 4, order: all, mark: poor, text: "位置は固定" }
        movable: { lit: 8, order: all, mark: good, text: "自由に動かせる", note: "そのぶん負荷が高い" }
      verdict: "位置を動かせるのは Movable だけ"
  summary:
    title: "焼くほど軽く、変えにくい"
    columns: ["Static", "Stationary", "Movable"]
    rows:
      - { label: "位置の移動", cells: ["× できない", "× できない", "○ できる"] }
      - { label: "色・強さの変更", cells: ["× できない", "○ できる", "○ できる"] }
      - { label: "影・間接光", cells: ["焼き込み", "静的な物の影は焼き込み", "動的"] }
      - { label: "実行時の負荷", cells: ["○ 低い", "△ 中", "× 高い"] }
    note: "UE5 の Lumen など動的な GI を使う場合は事情が変わる。Stationary の重なりの上限などの細部は、使う版で確かめる。"
---

## 概要

3Dのライティングは、計算が重い。そこでUnreal Engineでは、ライトごとに**モビリティ**(Mobility)を設定して、「どこまで事前に計算して焼いておくか」を決める。焼いておく部分が多いほど実行時は軽くなるが、ゲーム中に変えられることは減る。ただし、UE5のLumenなど、動的なグローバルイルミネーションを使う場合は、事情が変わる([NaniteとLumenの概要](/foundations/unreal-nanite-lumen-overview))。

## 基礎文法

| モビリティ | 位置の移動 | 色・強さの変更 | 影・間接光 | 負荷 |
| --- | --- | --- | --- | --- |
| Static | できない | できない | 焼き込み | 低い |
| Stationary | できない | できる | 静的な物の影は焼き込み | 中 |
| Movable | できる | できる | 動的 | 高い |

- 焼き込み(ベイク)の考え方は、Unityの[ライティング(ベイクとリアルタイム)](/foundations/unity-lighting-baked-realtime-basics)と同じ
- Staticの変更を画面に反映するには、ライティングのビルドが必要
- 動かす物(キャラクターなど)は、Movableなオブジェクトとして扱われる

## つまずきやすい点

- Staticのライトを、Blueprintで動かそうとしても、動かない。実行中に変更するライトは、Movable(または色・強さだけなら Stationary)にする
- Movableのライトを多数置くと、負荷が急に上がる。特に、影を落とすライトの数は、必要最小限にする
- Stationaryのライトは、重なる数に、エンジン側の上限がある。多すぎると、一部が動的な扱いに切り替わり、表示が変わる。上限は、エンジンの版で、確かめる
- ライトマップを使うメッシュには、重ならないライトマップ用のUVが必要で、焼き込みの結果に影響する

## 実装例(コード)

```python
import unreal

# Python(エディタースクリプト)で、点光源を置き、Movable にする
light = unreal.EditorLevelLibrary.spawn_actor_from_class(
    unreal.PointLight, unreal.Vector(0, 0, 200)
)
light.root_component.set_mobility(unreal.ComponentMobility.MOVABLE)
```
