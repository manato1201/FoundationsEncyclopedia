---
name: "Data Assetの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "ゲームの設定値や、アイテムの情報を、アセットとして管理する。"
operationSteps:
  - label: "持たせたい情報を決める"
    note: "アイテムの名前・価格・アイコンなど、まとめたい情報を決める"
  - label: "Data Assetのクラスを作る"
    note: "情報の項目を持つ、Data Assetのクラスを作る"
  - label: "アセットを作って値を入力する"
    note: "クラスから、アセットを作り、エディタで値を入力する"
  - label: "ゲームから参照する"
    note: "Blueprintやコードから、アセットを読み込んで、値を使う"
  - label: "値を変えて調整する"
    note: "アセットの値を変えるだけで、ゲームの内容を、調整できる"
---

## 概要

**Data Asset**は、ゲームの**設定や情報を、アセットとして保存**する仕組み。アイテムのデータやキャラクターの性能などを、コードやBlueprintの外で管理できる。値を変えるだけで、調整できる。

## 基礎文法

| 方法 | 特徴 |
| --- | --- |
| Data Asset | 1つのデータを、1つのアセットとして持つ |
| Data Table | 表形式で、多数の行をまとめて持つ |

## つまずきやすい点

- 大量の似たデータは、Data Tableのほうが管理しやすい場合がある
- アセットの参照を、強く持ちすぎると、メモリへ読み込まれ続ける。必要なときだけ読む設計も検討する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UCLASS()
class UItemData : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere) FText Name;
    UPROPERTY(EditAnywhere) int32 Price = 0;
};
```
