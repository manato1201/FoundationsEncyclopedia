---
name: "Visual Effect Graphの基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "ノードをつないで、GPUで多数のパーティクルを動かすエフェクトを作る。"
operationSteps:
  - label: "Visual Effect Graphを作る"
    note: "エフェクトの設定を持つアセットを作る"
  - label: "粒の発生を設定する"
    note: "どのくらいの数を、どのように出すかを設定する"
  - label: "初期の状態を決める"
    note: "粒が生まれるときの、位置・速さ・寿命を設定する"
  - label: "時間による変化を加える"
    note: "動きや色の変化を、ノードで追加する"
  - label: "シーンで再生する"
    note: "Visual Effectのコンポーネントで再生して、見た目を確認する"
---

## 概要

**Visual Effect Graph**は、**ノードをつないで**、GPUで大量のパーティクルを動かす、エフェクト作成の仕組み。数万〜数百万の粒を扱える。従来のParticle Systemより、大規模な表現に向く。

## 基礎文法

| ブロック | 役割 |
| --- | --- |
| Spawn | 粒をいつ・いくつ出すか |
| Initialize | 生まれたときの状態 |
| Update | 毎フレームの動き |
| Output | 描画のしかた |

## つまずきやすい点

- 使えるのは、対応するレンダーパイプライン(URPやHDRP)に限られる場合がある。使う版で確認する
- 対応していない端末や、古い機材では、動かない場合がある。対象の機材で確認する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```csharp
using UnityEngine;
using UnityEngine.VFX;

public class PlayEffect : MonoBehaviour
{
    [SerializeField] private VisualEffect effect;

    public void Burst()
    {
        effect.SendEvent("OnPlay");  // グラフ側で定義したイベントを送る
    }
}
```
