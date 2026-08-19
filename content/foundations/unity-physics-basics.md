---
name: Unity物理エンジンの基礎(Rigidbody/Collider)
category: ツール別
subcategory: Unity
masteryBadge: done
summary: オブジェクトに物理的な振る舞いを与えるRigidbodyと、当たり判定の形状を定義するColliderの役割分担。
---

## 概要

Unityの物理挙動は、主に「Rigidbody」(重力・力・衝突による動きの計算を担うコンポーネント)と「Collider」(当たり判定の形状を定義するコンポーネント)の組み合わせで実現される。GameObjectにこの2つを追加することで、物理エンジンによる自動的な落下・跳ね返り・衝突検知が機能するようになる。

## 基礎文法

```csharp
// Rigidbodyに力を加えて動かす(直接Transformを書き換えない)
Rigidbody rb = GetComponent<Rigidbody>();
rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);

void OnCollisionEnter(Collision collision)
{
    Debug.Log($"{collision.gameObject.name}と衝突した");
}
```

- Collider単体(Rigidbodyなし)は「静的な障害物」として扱われる
- Rigidbody + Colliderの組み合わせは「物理演算で動くオブジェクト」として扱われる
- Colliderの`Is Trigger`にチェックを入れると、物理的な押し返しは発生せず、重なりの検知(`OnTriggerEnter`)だけが行われる

## つまずきやすい点

- Rigidbodyが付いたオブジェクトの位置を、`transform.position`で直接書き換えると、物理エンジンの計算と競合し、不自然な挙動(すり抜け、振動)を起こすことがある。物理演算下のオブジェクトは`AddForce`や`MovePosition`のような専用のAPIで動かすのが基本
- 物理演算の更新は、通常のフレーム更新(`Update`)とは別の固定間隔(`FixedUpdate`)で行われる。物理挙動に関わるコードを`Update`に書くと、フレームレートによって物理挙動の一貫性が崩れることがある
- 高速で移動するオブジェクト(弾丸等)は、1フレームの間に薄い障害物をすり抜けてしまうことがある(トンネリング)。Rigidbodyの「Collision Detection」設定を「Continuous」に変更することで軽減できるが、計算コストとのトレードオフがある

## 実装例(コード)

```csharp
void FixedUpdate() // 物理関連の処理はFixedUpdateに書く
{
    rb.MovePosition(rb.position + velocity * Time.fixedDeltaTime);
}
```
