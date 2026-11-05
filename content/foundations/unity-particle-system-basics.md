---
name: Particle Systemの基礎(Unity)
category: ツール別
subcategory: Unity
summary: 小さな粒を大量に出して、炎・煙・火花などの表現を作る。モジュールごとに動きを設定する。
operationSteps:
  - label: Particle Systemを作る
    note: エフェクトを置きたい位置に、Particle Systemのオブジェクトを作る
  - label: 粒の出し方を決める(Emission)
    note: 1秒に何個出すか、一度にまとめて出すか、を決める
  - label: 出る場所と向きを決める(Shape)
    note: 点・円錐・球などの形で、粒が出る場所と方向を決める
  - label: 粒の寿命と見た目を決める
    note: 寿命・大きさ・速度・色など、粒1つの基本の性質を決める
  - label: 時間による変化を加える
    note: 寿命の間に、色を薄くする・大きくするなど、変化を設定する
---

## 概要

Particle Systemは、小さな粒(パーティクル)を大量に生成して、炎・煙・火花・魔法などの効果を作る仕組み。設定は**モジュール**に分かれていて、必要なものだけを有効にして調整する。

## 基礎文法

| モジュール                 | 役割                                       |
| -------------------------- | ------------------------------------------ |
| Main                       | 寿命・速度・大きさ・色など、粒の基本の性質 |
| Emission                   | 粒を出す量とタイミング                     |
| Shape                      | 粒が出る場所と方向                         |
| Color / Size over Lifetime | 寿命の間の、色や大きさの変化               |

## つまずきやすい点

- 粒の数が多いと、処理が重くなる。画面に出す必要のある数に絞る(Max Particlesで上限を決める)
- 見た目は、粒に使うマテリアルと、描画の設定(ブレンドの方式)でも大きく変わる。色だけでなく、マテリアルも確認する
- スクリプトから再生・停止するときは、`Play`と`Stop`を使う。`Stop`のしかたで、すでに出た粒を消すかどうかが変わる

## 実装例(コード)

```csharp
using UnityEngine;

public class Explosion : MonoBehaviour
{
    [SerializeField] private ParticleSystem effect;

    public void Play()
    {
        effect.Play();  // エフェクトを再生する
    }
}
```
