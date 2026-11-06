---
name: "Game InstanceとSubsystemの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "ゲーム全体で1つの情報を持つGame Instanceと、機能を分けて持つSubsystem。"
operationSteps:
  - label: "残したい情報を決める"
    note: "レベルをまたいで、保持したい情報(プレイヤー名・進行状況など)を決める"
  - label: "Game Instanceに持たせる"
    note: "ゲームの開始から終了まで、1つだけ存在する、Game Instanceに情報を持たせる"
  - label: "機能ごとに分けたいときはSubsystemを使う"
    note: "決まった寿命を持つ、機能ごとの管理者を、Subsystemとして作る"
  - label: "どこからでも取得する"
    note: "ゲーム中の、どこからでも、Game InstanceやSubsystemを取得できる"
  - label: "寿命を意識して選ぶ"
    note: "レベルごと、ゲーム全体など、必要な寿命に合う方を選ぶ"
---

## 概要

**Game Instance**は、ゲームの起動から終了まで、**1つだけ存在する**オブジェクトで、レベルをまたいで情報を持てる。**Subsystem**は、**決まった寿命を持つ、機能ごとの管理者**で、Game Instanceなどに紐づいて自動で作られる。

## 基礎文法

| 仕組み | 寿命 |
| --- | --- |
| Game Instance | ゲームの起動から終了まで |
| Game Instance Subsystem | Game Instanceと同じ |
| World Subsystem | ワールド(レベル)と同じ |

## つまずきやすい点

- Game Instanceに何でも詰め込むと、膨らむ。機能ごとに、Subsystemへ分ける
- レベルが変わると消える情報は、Game Instanceには入らない。寿命を確認して選ぶ
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UCLASS()
class UScoreSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    int32 Score = 0;  // ゲーム全体で、1つのスコアを持つ
};
```
