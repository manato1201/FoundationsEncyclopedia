---
name: Behavior Treeの基礎(Unreal Engine)
category: ツール別
subcategory: UnrealEngine
summary: AIの行動を木の形で組む。Blackboardに状況を記録して、条件に応じて行動を選ぶ。
operationSteps:
  - label: AIControllerがAIを動かす
    note: AIキャラクターを操作する、専用のコントローラーが、Behavior Treeを実行する
  - label: Blackboardに状況を記録する
    note: 「敵が見えているか」「目的地はどこか」など、AIが判断に使う情報を、Blackboardに入れる
  - label: 木の上から順に評価する
    note: ルートから、左の枝から順に、実行できる行動を探していく
  - label: 条件に合う行動を実行する
    note: Selectorは、成功する枝を1つ選ぶ。Sequenceは、枝を順にすべて実行する
  - label: 状況が変わったら再評価する
    note: Blackboardの値が変わると、条件が評価し直されて、別の行動に切り替わる
---

## 概要

Behavior Treeは、Unreal Engineで、AIの行動を**木の形**で組む仕組み。状況(Blackboard)を見て、条件に合う行動を選ぶ。巡回する、敵を見つけたら追いかける、といった行動の切り替えを、整理して作れる。

## 基礎文法

| 要素             | 役割                                             |
| ---------------- | ------------------------------------------------ |
| Behavior Tree    | 行動を木で組んだもの                             |
| Blackboard       | AIが判断に使う情報の入れ物                       |
| Selector         | 子のうち、成功する1つを選ぶ                      |
| Sequence         | 子を順に、すべて実行する(途中で失敗すれば止まる) |
| Task / Decorator | 実際の行動 / 実行の条件                          |

## つまずきやすい点

- 左の枝ほど優先される。優先したい行動を、左に置く
- Blackboardの値を更新しないと、条件が変わらず、行動が切り替わらない。値を更新する処理が動いているかを確認する
- 複雑な判断を1つの木に詰め込むと、読みにくくなる。サブツリーに分ける

## 実装例(コード)

```cpp
// AIControllerで、Behavior Treeを実行する(アセットは、エディタで設定した参照)
void AMyAIController::OnPossess(APawn* InPawn)
{
    Super::OnPossess(InPawn);
    RunBehaviorTree(BehaviorTreeAsset);
}
```
