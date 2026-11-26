---
name: "コレクションの基礎(Blender)"
category: DCC
subcategory: "Blender"
summary: "コレクションは、オブジェクトを整理するフォルダ。表示や描画の切り替えを、まとめて行える。"
operationSteps:
  - label: "オブジェクトを役割で分ける"
    note: "背景・小物・キャラクターなど、まとまりで考える"
  - label: "コレクションを作る"
    note: "アウトライナーで、新しいコレクションを作り、名前を付ける"
  - label: "オブジェクトを移す"
    note: "オブジェクトを、対応するコレクションへ移す"
  - label: "表示とレンダリングを切り替える"
    note: "目のアイコンや、カメラのアイコンで、まとめて表示・描画を切り替える"
  - label: "別のファイルから読み込んで使う"
    note: "コレクションを、ほかのファイルへ読み込んで再利用する"
visual:
  kind: graph
  question: "どのオブジェクトが、どのコレクションに入っている?"
  directed: true
  legend:
    - { key: "root", label: "シーンのコレクション", tone: "violet", mark: "S" }
    - { key: "bg", label: "背景", tone: "amber", mark: "背" }
    - { key: "prop", label: "小物", tone: "pink", mark: "小" }
    - { key: "chara", label: "キャラクター", tone: "cyan", mark: "キ" }
    - { key: "link", label: "入れ子・所属", tone: "blue", mark: "—" }
    - { key: "hidden", label: "非表示", tone: "gray", mark: "×" }
    - { key: "reuse", label: "別ファイルで再利用", tone: "green", mark: "↗" }
  nodes:
    - { id: "scene", label: "シーン", x: 50, y: 0, hidden: true }
    - { id: "bgCol", label: "背景", x: 25, y: 33, hidden: true }
    - { id: "charaCol", label: "キャラ", x: 78, y: 33, hidden: true }
    - { id: "floor", label: "床", x: 5, y: 66 }
    - { id: "wall", label: "壁", x: 22, y: 66 }
    - { id: "propCol", label: "小物", x: 42, y: 66, hidden: true }
    - { id: "human", label: "人", x: 78, y: 66 }
    - { id: "chair", label: "椅子", x: 32, y: 100 }
    - { id: "cup", label: "カップ", x: 52, y: 100 }
  edges:
    - { from: scene, to: bgCol, hidden: true }
    - { from: scene, to: charaCol, hidden: true }
    - { from: bgCol, to: floor, hidden: true }
    - { from: bgCol, to: wall, hidden: true }
    - { from: bgCol, to: propCol, hidden: true }
    - { from: propCol, to: chair, hidden: true }
    - { from: propCol, to: cup, hidden: true }
    - { from: charaCol, to: human, hidden: true }
  steps:
    - short: "分ける"
      nodes: { floor: "bg", wall: "bg", chair: "prop", cup: "prop", human: "chara" }
      focus: ["floor", "wall", "chair", "cup", "human"]
      verdict: "背景・小物・キャラクターの 3 つのまとまりで考える"
    - short: "作る"
      nodes: { scene: "root", bgCol: "bg", propCol: "prop", charaCol: "chara" }
      edges: { "scene>bgCol": "link", "scene>charaCol": "link", "bgCol>propCol": "link" }
      focus: ["bgCol", "propCol", "charaCol"]
      verdict: "コレクションは入れ子にできる(背景の中に小物)"
    - short: "移す"
      edges: { "bgCol>floor": "link", "bgCol>wall": "link", "propCol>chair": "link", "propCol>cup": "link", "charaCol>human": "link" }
      focus: ["floor", "wall", "chair", "cup", "human"]
      verdict: "○ 各オブジェクトが、どのコレクションに入っているかが線でわかる"
    - short: "表示切替"
      nodes: { bgCol: "hidden", propCol: "hidden", floor: "hidden", wall: "hidden", chair: "hidden", cup: "hidden" }
      focus: ["bgCol"]
      verdict: "背景の目のアイコンを切ると、入れ子の小物ごと隠れる。描画はカメラのアイコンで切り替える"
    - short: "再利用"
      nodes: { charaCol: "reuse", human: "reuse" }
      focus: ["charaCol"]
      verdict: "○ キャラのコレクションを別のファイルへ読み込むと、中の人もまとめて入る"
  summary: "コレクションは、オブジェクトを入れるフォルダで、入れ子にできる。表示・描画の切り替えや、別ファイルへの読み込みを、まとめて行える。"
---

## 概要

**コレクション**は、オブジェクトをまとめて整理する、フォルダのようなもの。表示・非表示や、レンダリングに含めるかを、コレクション単位で切り替えられる。大きなシーンの整理に欠かせない。

## 基礎文法

| 機能 | 役割 |
| --- | --- |
| 表示の切り替え | ビューポートでの表示・非表示 |
| レンダリングの切り替え | レンダリングへ含めるかどうか |

## つまずきやすい点

- 1つのオブジェクトを、複数のコレクションに入れられる。意図しない重複に注意する
- 名前を付けないと、増えたときに分かりにくくなる
- 操作の名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```python
import bpy

col = bpy.data.collections.new("Props")
bpy.context.scene.collection.children.link(col)
col.objects.link(bpy.context.active_object)
```
