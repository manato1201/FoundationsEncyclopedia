---
name: "ライントレースの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "線を飛ばして、何に当たるかを調べる。視線の判定や、射撃に使う。"
operationSteps:
  - label: "始点と終点を決める"
    note: "線の始まりと終わりの位置を決める"
  - label: "トレースのチャンネルを選ぶ"
    note: "何に反応するかを、チャンネルで決める"
  - label: "Line Trace By Channelを実行する"
    note: "線を飛ばして、最初に当たったものを調べる"
  - label: "結果を受け取る"
    note: "当たったかどうかと、当たったActorや位置を、ヒット結果から取り出す"
  - label: "結果に応じて処理する"
    note: "当たった相手に、ダメージを与えるなどの処理を行う"
---

## 概要

**ライントレース**は、ある点から別の点へ**線を飛ばし**、何に当たるかを調べる機能。銃弾の命中判定、足元の地面の確認、視線の先にあるものの取得などに使う。

## 基礎文法

| 入力 | 意味 |
| --- | --- |
| Start / End | 線の始点と終点 |
| Trace Channel | 判定の種類 |
| Actors to Ignore | 無視する対象(自分など) |

## つまずきやすい点

- 自分自身に当たらないよう、無視する対象に、自分を入れる
- 当たる相手に、対応するコリジョンの設定がないと、当たらない
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
FHitResult Hit;
FVector Start = GetActorLocation();
FVector End = Start + GetActorForwardVector() * 1000.f;
if (GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility))
{
    UE_LOG(LogTemp, Log, TEXT("%s"), *Hit.GetActor()->GetName());
}
```
