---
name: 新Input Systemの基礎
category: ツール別
subcategory: Unity
summary: 複数の入力デバイスをイベント駆動で統一的に扱える、従来のInput Managerを置き換える新しい入力パッケージ。
---

## 概要

Unityの新Input Systemは、キーボード・マウス・ゲームパッド・タッチといった多様な入力デバイスを、統一的な「アクション」という抽象概念で扱えるようにするパッケージ。従来の`Input.GetKey`のようなポーリング(毎フレームの状態確認)ベースのAPIに対し、イベント駆動での入力受け取りをサポートする。

## 基礎文法

```csharp
public class PlayerInput : MonoBehaviour
{
    [SerializeField] private InputActionReference jumpAction;

    void OnEnable()
    {
        jumpAction.action.performed += OnJump; // イベント駆動で購読する
        jumpAction.action.Enable();
    }

    void OnJump(InputAction.CallbackContext context)
    {
        // ジャンプ処理
    }

    void OnDisable()
    {
        jumpAction.action.performed -= OnJump;
    }
}
```

## つまずきやすい点

- 「アクション」(ジャンプ、移動等の意味のある単位)と「バインディング」(具体的などのキー・ボタンがそのアクションに対応するか)を分離して設計する仕組みのため、キーボード用の設定とゲームパッド用の設定を1つのアクションに複数バインドできる。この抽象化に慣れるまでは、旧Input Managerの「キー名を直接指定する」感覚とのギャップに戸惑うことがある
- イベント購読(`performed +=`)を`OnDisable`等で解除し忘れると、[C#のイベントとデリゲート](/foundations/csharp-events-and-delegates)で触れたメモリリークと同様の問題を起こしうる
- 新Input Systemと従来のInput Managerは、プロジェクト設定でどちらを使うか(または両方を併用するか)を明示的に切り替える必要がある。混在した状態のままにすると、意図しない入力の二重処理が起きることがある

## 実装例(コード)

```csharp
// C#スクリプトから直接InputActionを生成する例(アセット不要な簡易版)
var moveAction = new InputAction(binding: "<Gamepad>/leftStick");
moveAction.Enable();
Vector2 move = moveAction.ReadValue<Vector2>();
```
