---
name: BlueprintとC++の使い分け
category: ツール別
subcategory: UnrealEngine
masteryBadge: review
summary: ビジュアルスクリプティングのBlueprintと、コードベースのC++。両者は排他ではなく組み合わせて使うのが一般的。
operationSteps:
  - label: "作りたいものを考える"
    note: "素早く試したいのか、性能や構造が重要かを考える"
  - label: "Blueprintが向く場面"
    note: "見た目の調整・簡単な流れの組み立て・試作"
  - label: "C++が向く場面"
    note: "重い計算・基盤となるクラス・細かい制御"
  - label: "C++で基盤を作る"
    note: "共通の機能を、C++で作る"
  - label: "Blueprintで拡張する"
    note: "C++のクラスを継承して、値や見た目を調整する"
---

## 概要

Unreal Engineは、[Blueprintでのイベント駆動処理の基礎](/foundations/unreal-blueprint-basics)で扱ったノードベースのビジュアルスクリプティングと、通常のC++コーディングの両方でゲームロジックを実装できる。どちらか一方だけを使うのではなく、「C++で基盤となるクラスや重い処理を実装し、Blueprintでそれを継承してゲームデザイナーが調整しやすい形にする」という組み合わせが実務では一般的。

## 基礎文法

典型的な役割分担:

```
C++: AEnemyBase クラス(基本的な体力管理、攻撃ロジックの骨組み)
  └── Blueprint: BP_Slime、BP_Dragon(C++クラスを継承し、数値やアニメーションを調整)
```

- プログラマーはC++で「型安全で高速な基盤」を作る
- ゲームデザイナーやアーティストはBlueprintで「数値調整やビジュアルの組み立て」を行う

## つまずきやすい点

- Blueprintは実行速度の面でC++に劣る場面がある(特に毎フレーム大量に実行されるロジック)。パフォーマンスが重要な処理(大量の敵の一括更新等)はC++側に実装し、Blueprintは個別のオブジェクトの調整・演出に限定するという判断が必要になることが多い
- C++で定義したクラスのメンバー変数・関数をBlueprintから編集・呼び出し可能にするには、`UPROPERTY`や`UFUNCTION`のようなマクロで明示的に公開する必要がある。これを忘れると、意図した通りにBlueprint側から操作できない
- プログラマーとデザイナーが同じ機能に対してそれぞれC++とBlueprintで別々に手を加えてしまうと、どちらが「正」のロジックなのか分からなくなることがある。役割分担をチームで明確にしておくことが重要

## 実装例(コード)

```cpp
// C++側でBlueprintに公開する変数・関数を定義する例
UCLASS()
class AEnemyBase : public AActor
{
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float MaxHealth = 100.0f;

    UFUNCTION(BlueprintCallable)
    void TakeDamage(float Amount);
};
```
