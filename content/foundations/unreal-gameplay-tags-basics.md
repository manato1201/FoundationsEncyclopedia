---
name: Gameplay Tagsの基礎(Unreal Engine)
category: ツール別
subcategory: UnrealEngine
summary: 階層をもつ名前(タグ)で、状態や属性を表して、条件の判定を整理する。
operationSteps:
  - label: タグを定義する
    note: "Status.Burning のように、ドットで階層を作った名前を、プロジェクトに登録する"
  - label: オブジェクトにタグを持たせる
    note: キャラクターやアイテムに、状態や属性を表すタグを持たせる
  - label: タグで条件を判定する
    note: 「このタグを持っているか」で、状態を判定する。親のタグでまとめて判定もできる
  - label: タグを追加・削除して状態を変える
    note: 状態が変わったら、タグを追加・削除して、現在の状態を表す
  - label: ほかの仕組みと組み合わせる
    note: Gameplay Ability Systemなど、タグを前提にした仕組みと組み合わせて使う
---

## 概要

Gameplay Tagsは、Unreal Engineで、**階層を持つ名前**(タグ)を使って、状態や属性を表す仕組み。たとえば、`Status.Burning`(燃えている)、`Status.Frozen`(凍っている)のように、ドットで区切って分類する。文字列の比較やフラグの管理より、整理しやすい。

## 基礎文法

| 要素           | 役割                                           |
| -------------- | ---------------------------------------------- |
| タグ           | 階層付きの名前(`Status.Burning`)               |
| タグのコンテナ | オブジェクトが持つ、タグの集合                 |
| 判定           | 特定のタグを持つか、親のタグに属するかを調べる |

## つまずきやすい点

- 親のタグ(`Status`)で判定すると、その下のタグ(`Status.Burning`など)も一致する。意図したとおりの範囲かを確認する
- タグ名の綴りを間違えると、一致しない。コード中の文字列を直接書かず、定義した一覧から参照する
- 階層は、あとから変えにくい。最初に、分類の方針を決めておく

## 実装例(コード)

```cpp
// タグを持っているかを判定する(タグ名は例)
FGameplayTag Burning = FGameplayTag::RequestGameplayTag(FName("Status.Burning"));
if (OwnedTags.HasTag(Burning))
{
    // 燃えている状態の処理
}
```
