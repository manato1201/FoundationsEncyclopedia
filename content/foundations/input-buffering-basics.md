---
name: 入力バッファリングの基礎
category: Framework
subcategory: ゲームエンジン基盤
masteryBadge: advanced
summary: プレイヤーの入力を少しの間「覚えておく」ことで、タイミングのシビアさを緩和し、操作の快適さを高める技法。
operationSteps:
  - label: "入力を受け取る"
    note: "プレイヤーが、ボタンを押す"
  - label: "すぐに実行できない状況を検知する"
    note: "攻撃の動作中など、いまは受け付けられない状態"
  - label: "入力を短い時間だけ覚える"
    note: "バッファに、入力を、数フレームのあいだ保存する"
  - label: "実行できるようになったら取り出す"
    note: "動作が終わった時点で、覚えていた入力を実行する"
  - label: "期限が切れたら捨てる"
    note: "古い入力は、破棄して、意図しない動きを避ける"
---

## 概要

入力バッファリングは、プレイヤーが入力したタイミングが、ゲーム側が受け付けられるタイミングよりわずかに早かった場合でも、その入力を短時間だけ「覚えておき」、受付可能になった瞬間に自動的に反映する技法。特にアクションゲームの着地際のジャンプ入力や、コンボ入力の受付などで、操作の快適さに直結する。

## 基礎文法

```csharp
private float jumpBufferTime = 0.1f; // 0.1秒だけジャンプ入力を覚えておく
private float jumpBufferTimer = 0f;

void Update()
{
    if (Input.GetButtonDown("Jump"))
    {
        jumpBufferTimer = jumpBufferTime; // 入力があったらタイマーをセット
    }
    else
    {
        jumpBufferTimer -= Time.deltaTime; // 時間経過とともに減らす
    }

    if (jumpBufferTimer > 0 && isGrounded)
    {
        Jump();
        jumpBufferTimer = 0; // ジャンプを実行したらバッファをクリア
    }
}
```

## つまずきやすい点

- バッファの許容時間を長くしすぎると、意図しないタイミングで過去の入力が反映されてしまい、逆に操作性を損なうことがある。ゲームのテンポやジャンルに応じて、適切な許容時間を実際のプレイフィールで調整する必要がある
- 入力バッファリングは、[ステートマシンの基礎](/foundations/state-machine-basics)と組み合わせて使われることが多い。「どの状態にいる間にどの入力をバッファすべきか」を整理しないと、意図しない状態遷移が起きることがある
- ネットワーク越しの対戦ゲーム([Unity Netcodeの基礎](/foundations/unity-netcode-basics)参照)では、通信遅延の影響も重なるため、入力バッファリングの設計はローカルプレイ以上に慎重な調整が求められる

## 実装例(コード)

```csharp
// コンボ入力のバッファリングにも同様の考え方が使われる
if (Input.GetButtonDown("Attack") && comboWindowTimer > 0)
{
    ExecuteComboAttack();
}
```
