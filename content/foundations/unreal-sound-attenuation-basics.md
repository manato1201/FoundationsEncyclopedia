---
name: "サウンドの減衰の基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "音が、距離に応じて小さくなるよう設定する。立体的な音響を作る。"
operationSteps:
  - label: "音源を配置する"
    note: "音を鳴らす場所に、サウンドを置く"
  - label: "Attenuationの設定を作る"
    note: "距離による、音量の変化を決める、減衰の設定を作る"
  - label: "範囲を決める"
    note: "音が最大で聞こえる範囲と、聞こえなくなる範囲を設定する"
  - label: "空間の定位を設定する"
    note: "左右の位置などが、音に反映されるように設定する"
  - label: "聞こえ方を確認する"
    note: "音源に近づいたり離れたりして、聞こえ方を確かめる"
---

## 概要

**サウンドの減衰(Attenuation)**は、**音源からの距離に応じて、音が小さくなる**設定。遠くの音は小さく、近くの音は大きく聞こえるので、立体的で自然な音響を作れる。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Inner Radius | 音が最大の音量で聞こえる範囲 |
| Falloff Distance | 音が小さくなっていく範囲 |
| Spatialization | 左右などの定位 |

## つまずきやすい点

- 減衰の設定がないと、どこにいても同じ音量で聞こえる(2Dの音)
- 範囲が広すぎると、離れた場所でも、うるさい。範囲を、ゲームの規模に合わせる
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UGameplayStatics::PlaySoundAtLocation(GetWorld(), Sound, GetActorLocation(), 1.f, 1.f, 0.f, AttenuationSettings);
```
