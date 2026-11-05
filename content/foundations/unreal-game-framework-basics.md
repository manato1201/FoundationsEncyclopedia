---
name: ゲームフレームワークの基礎(GameModeとPawnなど)
category: ツール別
subcategory: UnrealEngine
summary: GameMode・PlayerController・Pawn・PlayerStateなどが、それぞれ何を担当するかを整理する。
operationSteps:
  - label: GameModeがゲームのルールを決める
    note: ゲームの進行ルール(参加の受け付け、勝敗など)を担当する。マルチプレイでは、サーバー側にだけ存在する
  - label: PlayerControllerが入力を受け取る
    note: プレイヤーの入力を受け取り、操作する対象(Pawn)を動かす
  - label: Pawnが世界の中の体になる
    note: プレイヤーやAIが操作するキャラクターなど、世界の中に存在する体
  - label: PlayerStateがプレイヤーの情報を持つ
    note: スコアなど、プレイヤーごとの情報を持ち、ほかのプレイヤーにも共有できる
  - label: GameStateがゲーム全体の状態を持つ
    note: 経過時間など、全員が知る必要がある、ゲーム全体の状態を持つ
---

## 概要

Unreal Engineには、ゲームの基本的な構造を担う**ゲームフレームワーク**のクラスがある。それぞれの担当を分けて考えると、プレイヤーの操作・ゲームのルール・表示する情報を、整理して作れる。

## 基礎文法

| クラス           | 担当                                         |
| ---------------- | -------------------------------------------- |
| GameMode         | ゲームのルール(サーバー側のみ)               |
| GameState        | ゲーム全体の状態(全員に共有)                 |
| PlayerController | プレイヤーの入力と、操作する対象の管理       |
| Pawn / Character | 世界の中に存在する、操作される体             |
| PlayerState      | プレイヤーごとの情報(スコアなど。全員に共有) |

## つまずきやすい点

- GameModeは、マルチプレイでは**サーバーにだけ**存在する。クライアントから参照できないので、全員に見せたい情報は、GameStateやPlayerStateに置く
- 入力の処理を、PawnとPlayerControllerのどちらに書くかで迷いやすい。「体に固有の操作」はPawn、「プレイヤーとしての操作」はPlayerControllerに置くと整理しやすい
- Pawnが破棄されても、PlayerControllerは残る。リスポーンのしくみは、この違いを利用する

## 実装例(コード)

```cpp
// GameModeで、使うPawnとPlayerControllerを指定する
AMyGameMode::AMyGameMode()
{
    DefaultPawnClass = AMyCharacter::StaticClass();
    PlayerControllerClass = AMyPlayerController::StaticClass();
}
```
