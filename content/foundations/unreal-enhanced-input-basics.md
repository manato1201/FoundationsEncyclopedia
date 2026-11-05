---
name: Enhanced Inputの基礎(Unreal Engine)
category: ツール別
subcategory: UnrealEngine
summary: 入力を「アクション」と「マッピング」に分けて、キーボードやパッドの操作を柔軟に割り当てる。
operationSteps:
  - label: Input Actionを作る
    note: 「ジャンプ」「移動」など、プレイヤーがしたい操作を、アクションとして作る
  - label: Input Mapping Contextを作る
    note: どのキーやボタンが、どのアクションに対応するかを、まとめて設定する
  - label: コンテキストを有効にする
    note: プレイヤーの操作を処理する側で、使うマッピングのコンテキストを追加する
  - label: アクションにイベントを結びつける
    note: アクションが入力されたときに実行する処理を、Blueprintやコードで結びつける
  - label: 状況に応じて切り替える
    note: 歩行中・乗り物に乗った状態など、状況ごとにコンテキストを切り替えられる
---

## 概要

Enhanced Inputは、Unreal Engineの入力システム。キーボードやゲームパッドの個々のキーを直接扱うのではなく、「ジャンプ」「移動」のような**アクション**と、それをどのキーに割り当てるかという**マッピング**に分ける。割り当ての変更や、状況ごとの切り替えがしやすい。

## 基礎文法

| 要素                  | 役割                                           |
| --------------------- | ---------------------------------------------- |
| Input Action          | プレイヤーの操作の単位(ジャンプ・移動など)     |
| Input Mapping Context | キーやボタンと、アクションの対応表             |
| 有効にする            | プレイヤーの入力処理に、コンテキストを追加する |

## つまずきやすい点

- コンテキストを有効にしていないと、キーを押しても反応しない。追加する処理が、実行されているかを確認する
- 使えるバージョンや、既定で有効かどうかは、エンジンのバージョンで変わる場合がある。使っている版のドキュメントで確認する
- アクションの値の種類(押した/押していない、2次元の値など)が、操作に合っているかを確認する

## 実装例(コード)

```cpp
// プレイヤーの操作を処理するクラスで、マッピングのコンテキストを追加する(関数名・型名は版によって異なる場合がある)
if (UEnhancedInputLocalPlayerSubsystem* Subsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer()))
{
    Subsystem->AddMappingContext(DefaultMappingContext, 0);
}
```
