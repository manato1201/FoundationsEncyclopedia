---
name: Gameplay Ability Systemの基礎
category: ツール別
subcategory: UnrealEngine
masteryBadge: advanced
summary: スキル・ステータス・効果(バフ/デバフ)を、拡張性の高い共通の枠組みで管理するUnreal公式のフレームワーク。
---

## 概要

Gameplay Ability System(GAS)は、キャラクターのスキル(アビリティ)、ステータス(体力・攻撃力等)、それらに影響する効果(バフ・デバフ・状態異常)を、統一されたフレームワークで管理するUnreal Engine公式のシステム。RPGやアクションゲームのような、多数のスキル・ステータス相互作用を持つゲームで特に威力を発揮する。

## 基礎文法

GASの主な構成要素:

- **Attribute**: 体力・マナ・攻撃力といった数値ステータス
- **GameplayAbility**: スキルそのもの(発動条件、効果、クールダウン等)のロジック
- **GameplayEffect**: Attributeに対する変更(ダメージ、回復、バフ等)を表現するデータ
- **GameplayTag**: 状態(スタン中、無敵中等)をタグとして表現し、アビリティ同士の相互作用の条件判定に使う

## つまずきやすい点

- GASは非常に強力だが学習コストが高く、シンプルなプロトタイプ段階のゲームにいきなり導入すると、その複雑さ自体が開発速度のボトルネックになることがある。[コンテナオーケストレーション(Kubernetes)](/foundations/container-orchestration-basics)でも触れたように、規模に見合わないツールの導入は避けるべきという判断がここでも当てはまる
- GASは[Unity Netcode](/foundations/unity-netcode-basics)のようなマルチプレイヤー対応を前提に設計されており、シングルプレイヤーのゲームであっても、その分の複雑さ(サーバー権威の概念等)がついて回ることがある
- GameplayEffectの適用順序やスタック(重複適用)の扱いを正しく設計しないと、「毒のデバフが2重にかかって想定外のダメージが入る」といった、複雑な相互作用に起因するバグが発生しやすい

## 実装例(コード)

```cpp
// アビリティを発動する典型的な呼び出し例
AbilitySystemComponent->TryActivateAbilityByClass(FireballAbilityClass);
```
