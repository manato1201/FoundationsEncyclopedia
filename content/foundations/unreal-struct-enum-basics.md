---
name: "StructとEnumの基礎"
category: ツール別
subcategory: "UnrealEngine"
summary: "関連する値をStructでまとめ、決まった選択肢をEnumで表す。"
operationSteps:
  - label: "まとめたい値を見つける"
    note: "位置・体力・名前など、いつも一緒に扱う値を見つける"
  - label: "Structにまとめる"
    note: "複数の値を、1つの型(Struct)としてまとめる"
  - label: "選択肢をEnumで表す"
    note: "状態(待機・攻撃・死亡など)を、列挙(Enum)で定義する"
  - label: "変数として使う"
    note: "StructやEnumを、変数の型として使う"
  - label: "分岐に使う"
    note: "Enumの値で、Switchなどの分岐を行う"
---

## 概要

**Struct**は、関連する値を**1つにまとめた型**。**Enum**は、「待機・攻撃・死亡」のような、**決まった選択肢**を表す型。Blueprintでも、C++でも作れる。コードの見通しがよくなり、値の誤りも防ぎやすい。

## 基礎文法

| 型 | 役割 |
| --- | --- |
| Struct | 複数の値を、まとめて扱う |
| Enum | 決まった選択肢から、1つを選ぶ |

## つまずきやすい点

- Blueprintで作ったStructを、あとから変更すると、参照している場所に影響する場合がある。慎重に変更する
- 状態を文字列で表すと、綴りの誤りが起きやすい。Enumにすると、防げる
- 名前や場所は、バージョンによって異なる場合がある。

## 実装例(コード)

```cpp
UENUM(BlueprintType)
enum class EEnemyState : uint8 { Idle, Attack, Dead };

USTRUCT(BlueprintType)
struct FStats
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere) int32 Hp = 100;
    UPROPERTY(EditAnywhere) float Speed = 300.f;
};
```
