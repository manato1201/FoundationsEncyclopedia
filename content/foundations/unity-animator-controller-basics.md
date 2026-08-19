---
name: Animator Controllerの基礎
category: ツール別
subcategory: Unity
masteryBadge: review
summary: アニメーションクリップの切り替えを、ビジュアルなステートマシンとして管理するUnityの仕組み。
operationSteps:
  - label: Animator Controllerアセットを作成する
    menuPath: Project ウィンドウ右クリック > Create > Animator Controller
  - label: ステート(状態)を配置する
    note: Idle、Walk、Jumpなど、それぞれのアニメーションクリップに対応するステートを作る
  - label: ステート間にトランジション(遷移)を繋ぐ
    note: どのステートからどのステートへ遷移できるかを線で結ぶ
  - label: パラメータで遷移条件を設定する
    note: 速度(float)、ジャンプフラグ(bool)などのパラメータで、いつ遷移するかを制御する
---

## 概要

Animator Controllerは、複数のアニメーションクリップ(Idle、Walk、Jump等)の間の切り替えを、ステートマシン([ステートマシンの基礎](/foundations/state-machine-basics))として視覚的に管理する仕組み。パラメータ(速度、ジャンプの有無等)の値に応じて、どのステートからどのステートへ遷移するかを条件付きで定義する。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- ステートの数が増えると、遷移の組み合わせが爆発的に増え、ステートマシン全体の見通しが悪くなる(いわゆる「ステートマシンのスパゲッティ化」)。関連するステートをサブステートマシンにまとめて階層化すると管理しやすくなる
- パラメータの型(Float、Int、Bool、Trigger)を誤って選ぶと、意図した遷移が発生しないことがある。特に`Trigger`は「一度消費されると自動的にリセットされる」という他の型と異なる性質を持ち、複数のトランジションが同じTriggerを待っている場合に競合が起きやすい
- Animatorのブレンドツリー(複数のアニメーションを滑らかに混ぜ合わせる仕組み)を使わずにステートを切り替えるだけだと、切り替えの瞬間にアニメーションが不自然にカクつくことがある。滑らかな遷移が必要な箇所では、トランジションの遷移時間(Transition Duration)の調整も重要になる

## 実装例(コード)

```csharp
// パラメータを更新してAnimatorに遷移条件を伝える
animator.SetFloat("Speed", currentSpeed);
animator.SetBool("IsGrounded", isGrounded);
animator.SetTrigger("Jump");
```
