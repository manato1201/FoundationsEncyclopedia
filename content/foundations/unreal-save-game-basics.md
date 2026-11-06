---
name: "SaveGameの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "プレイの進行や設定を、SaveGameのオブジェクトとして、ファイルに保存する。"
operationSteps:
  - label: "保存する情報を決める"
    note: "進行状況・所持品・設定など、保存したい情報を決める"
  - label: "SaveGameクラスを作る"
    note: "保存する変数を持つ、SaveGameのクラスを作る"
  - label: "保存用のオブジェクトを作る"
    note: "Create Save Game Objectで、オブジェクトを作り、値を入れる"
  - label: "スロットに保存する"
    note: "Save Game to Slotで、名前を付けたスロットへ保存する"
  - label: "読み込んで復元する"
    note: "Load Game from Slotで読み込み、値をゲームへ反映する"
---

## 概要

**SaveGame**は、ゲームの**進行状況や設定を保存**する仕組み。保存する変数を持つクラスを作り、**スロット**という名前を付けて、ファイルへ保存・読み込みする。

## 基礎文法

| 操作 | 役割 |
| --- | --- |
| Create Save Game Object | 保存用のオブジェクトを作る |
| Save Game to Slot | スロットへ保存する |
| Load Game from Slot | スロットから読み込む |

## つまずきやすい点

- 保存するクラスの内容を変えると、古いセーブデータが読めなくなる場合がある。バージョンの管理を考える
- 保存の前に、スロットが存在するかを確認する。存在しない場合の、初期値も用意する
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UMySaveGame* Save = Cast<UMySaveGame>(UGameplayStatics::CreateSaveGameObject(UMySaveGame::StaticClass()));
Save->Level = 3;
UGameplayStatics::SaveGameToSlot(Save, TEXT("Slot1"), 0);
```
