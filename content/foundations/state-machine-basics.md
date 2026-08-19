---
name: ステートマシンの基礎
category: Framework
subcategory: ゲームエンジン基盤
masteryBadge: done
summary: 「今どの状態にあるか」を明確にし、状態ごとに許された遷移だけを行えるようにする設計手法。
---

## 概要

ステートマシン(状態機械)は、システムが取りうる「状態(ステート)」を明確に定義し、ある状態から別の状態への「遷移(トランジション)」を、あらかじめ決められたルールに沿ってのみ許可する設計手法。[Unity Animator Controllerの基礎](/foundations/unity-animator-controller-basics)や[Unreal Animation Blueprintの基礎](/foundations/unreal-animation-blueprint-basics)は、このステートマシンの考え方をアニメーション制御に応用した具体例。

## 基礎文法

キャラクターの行動を表すステートマシンの例:

```
Idle --(移動入力)--> Walk --(ジャンプ入力)--> Jump --(着地)--> Idle
Walk --(入力なし)--> Idle
```

- 各状態は「今どんな振る舞いをするか」を持つ
- 遷移は「どの条件が満たされたら、どの状態へ移るか」を定義する
- 定義されていない遷移(例えばJump状態から直接Attack状態への遷移)は起こりえない

## つまずきやすい点

- ステートの数が増えるほど、全ての状態遷移の組み合わせを把握するのが難しくなる。関連する状態をサブステートマシンとして階層化する([Unity Animator Controller](/foundations/unity-animator-controller-basics)でも触れた工夫)ことで、複雑さを管理しやすくなる
- 「if文の羅列」でキャラクターの行動を制御するコードは、状態の数が増えるにつれて条件分岐が複雑に絡み合い、どの状態からどの状態へ遷移できるのかがコードを読むだけでは把握しづらくなる。ステートマシンとして明示的に設計することで、この複雑さを構造化できる
- 状態遷移の最中(アニメーションのブレンド中等)に、さらに別の遷移条件が満たされてしまうと、遷移が二重に発生し、不自然な挙動になることがある。遷移中は新たな遷移を受け付けない、あるいは優先順位を明確にするといった設計が必要になる

## 実装例(コード)

```csharp
enum PlayerState { Idle, Walk, Jump }

class PlayerStateMachine
{
    private PlayerState current = PlayerState.Idle;

    public void Update(bool hasMoveInput, bool jumpPressed, bool isGrounded)
    {
        switch (current)
        {
            case PlayerState.Idle:
                if (jumpPressed) current = PlayerState.Jump;
                else if (hasMoveInput) current = PlayerState.Walk;
                break;
            case PlayerState.Walk:
                if (jumpPressed) current = PlayerState.Jump;
                else if (!hasMoveInput) current = PlayerState.Idle;
                break;
            case PlayerState.Jump:
                if (isGrounded) current = PlayerState.Idle;
                break;
        }
    }
}
```
