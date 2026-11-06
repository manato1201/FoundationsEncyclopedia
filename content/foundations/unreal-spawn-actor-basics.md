---
name: "Actorを生成する基礎(Spawn Actor)"
category: ツール別
subcategory: "UnrealEngine"
summary: "実行中に、新しいActorを世界へ出現させる。弾・敵・アイテムなどを出すときに使う。"
operationSteps:
  - label: "出すActorのクラスを決める"
    note: "弾・敵など、生成したいBlueprintのクラスを選ぶ"
  - label: "出す位置と向きを決める"
    note: "Transform(位置・回転・拡大)を決める"
  - label: "Spawn Actorを実行する"
    note: "クラスとTransformを渡して、生成する"
  - label: "生成したActorを受け取る"
    note: "戻り値の参照を使って、初期設定を行う"
  - label: "不要になったら破棄する"
    note: "使い終わったら、Destroy Actorで消す"
---

## 概要

**Spawn Actor**は、ゲームの実行中に、**新しいActorを世界へ出現させる**機能。弾・敵・アイテムなどを、必要なときに出すために使う。出す位置や向きを、Transformで指定する。

## 基礎文法

| 入力 | 意味 |
| --- | --- |
| Class | 生成するActorの種類 |
| Transform | 位置・向き・大きさ |
| Collision Handling | ぶつかる場所に出すときの扱い |

## つまずきやすい点

- クラスが空のままだと、何も生成されない
- 出す場所が、ほかの物体と重なると、生成に失敗することがある。衝突時の扱いを設定する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
FActorSpawnParameters Params;
GetWorld()->SpawnActor<AActor>(ProjectileClass, GetActorLocation(), GetActorRotation(), Params);
```
