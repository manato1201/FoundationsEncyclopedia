---
name: "GameObjectとComponentの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "Unityのシーンに置くものはすべてGameObject。それ自体は空の入れ物で、Componentを付けることで、見た目や動きが決まる。"
claim: "GameObjectは入れ物、振る舞いはComponentが持つ。"
operationSteps:
  - label: "GameObjectを作る"
    note: "Hierarchyで右クリックして、Create Empty などから作る。最初から Transform(位置・回転・拡縮)を持っている"
  - label: "Componentを追加する"
    note: "Inspectorの Add Component から、Rigidbody・Collider・MeshRenderer・自作スクリプトなどを付ける"
  - label: "Componentが性質を決める"
    note: "同じ空のGameObjectでも、付けたComponentの組み合わせで、物理・描画・音などの性質が決まる"
  - label: "スクリプトもComponent"
    note: "MonoBehaviourを継承したクラスは、Componentとして付けられる"
  - label: "GetComponentで取る"
    note: "同じGameObjectにある別のComponentを、コードから取り出して使う"
quiz:
  - question: "Unityで、GameObjectに必ず付いているComponentはどれか"
    choices:
      - "Rigidbody"
      - "Transform"
      - "MeshRenderer"
    answer: 1
    explanation: "Transformは、すべてのGameObjectが持つ(外せない)。Rigidbody などは、必要なときに追加する。"
visual:
  kind: zones
  question: "このオブジェクトの振る舞いは、どこが決めている?"
  legend:
    - { key: core, label: "必ずある(外せない)", tone: gray, mark: "T" }
    - { key: added, label: "追加した Component", tone: blue, mark: "+" }
    - { key: script, label: "自作スクリプト", tone: violet, mark: "S" }
    - { key: got, label: "GetComponent で取得", tone: green, mark: "→" }
  zones:
    - { id: lib, label: "Add Component の候補", note: "Inspector から選んで付ける" }
    - { id: go, label: "GameObject「Player」", note: "名前と有効状態を持つ入れ物" }
  items:
    - { id: tf, label: "Transform" }
    - { id: rb, label: "Rigidbody" }
    - { id: col, label: "BoxCollider" }
    - { id: mr, label: "MeshRenderer" }
    - { id: jp, label: "Jumper(スクリプト)" }
  steps:
    - short: "作る"
      place: { tf: go, rb: lib, col: lib, mr: lib, jp: lib }
      state: { tf: core }
      highlight: [tf]
      zoneFocus: [go]
      verdict: "Create Empty の直後は Transform(位置・回転・拡縮)だけを持つ、空の入れ物"
    - short: "Add Component"
      place: { rb: go, col: go, mr: go }
      state: { rb: added, col: added, mr: added }
      highlight: [rb, col, mr]
      verdict: "Add Component で、Rigidbody・BoxCollider・MeshRenderer を付ける"
    - short: "性質が決まる"
      zoneFocus: [go]
      verdict: "○ 重力で落ちる・ぶつかる・見える。どれも付けた Component が持つ性質"
    - short: "スクリプト"
      place: { jp: go }
      state: { jp: script }
      highlight: [jp]
      verdict: "MonoBehaviour を継承した Jumper も、同じように付ける Component の 1 つ"
    - short: "GetComponent"
      state: { rb: got }
      highlight: [jp, rb]
      zoneFocus: [go]
      verdict: "Jumper は GetComponent で同じ GameObject の Rigidbody を取り出し、力を加える"
  summary: "GameObject は入れ物。落ちる・ぶつかる・見える・跳ぶといった振る舞いは、付けた Component が持つ。"
---

## 概要

Unityのシーンに置くキャラクター・カメラ・ライト・UIは、すべて**GameObject**。ただしGameObject自体は、名前と有効・無効の状態を持つ入れ物にすぎない。見た目(Mesh Renderer)・物理(Rigidbody)・当たり判定(Collider)・自作の処理(スクリプト)などは、すべて**Component**として付け足す。この「部品を組み合わせる」設計をコンポジション(合成)と呼ぶ。

## 基礎文法

| 用語 | 役割 |
| --- | --- |
| GameObject | シーン内の物の入れ物。名前・タグ・レイヤー・有効状態を持つ |
| Transform | 位置・回転・拡縮と親子関係。すべてのGameObjectが持つ |
| Component | GameObjectに付ける機能の単位 |
| MonoBehaviour | 自作スクリプトをComponentにするための基底クラス |

- 同じ種類のComponentを複数付けられるもの(Colliderなど)と、1つだけのもの(Rigidbodyなど)がある
- タグとレイヤーの使い分けは[レイヤーとタグの使い分け](/foundations/unity-layers-tags-basics)、親子関係は[Transformと親子関係](/foundations/unity-transform-hierarchy-basics)を参照

## つまずきやすい点

- `GetComponent`は、見つからないと`null`を返す。使う前に`null`でないことを確認するか、`[RequireComponent(typeof(Rigidbody))]`で付け忘れを防ぐ
- `GetComponent`を`Update`で毎フレーム呼ぶと、無駄が出る。`Awake`や`Start`で一度だけ取って、変数に保存する
- GameObjectを無効にする(`SetActive(false)`)と、付いているComponentの`Update`も止まる
- 子のGameObjectにあるComponentは`GetComponent`では取れない。子を探すときは`GetComponentInChildren`を使う

## 実装例(コード)

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class Jumper : MonoBehaviour
{
    private Rigidbody body;

    private void Awake()
    {
        body = GetComponent<Rigidbody>(); // 一度だけ取得して保存する
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            body.AddForce(Vector3.up * 5f, ForceMode.Impulse);
        }
    }
}
```
