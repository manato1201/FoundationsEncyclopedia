---
name: レプリケーション(ネットワーク同期)の基礎
category: ツール別
subcategory: UnrealEngine
masteryBadge: advanced
summary: サーバー上のActorの状態を、接続中の各クライアントへ自動的に同期させるUnrealのネットワーキング機構。
---

## 概要

Unreal Engineのレプリケーションは、サーバー権威(サーバーが「正しい状態」を持つ)モデルに基づき、Actorの変数や関数呼び出しを、接続している各クライアントへ自動的に反映する仕組み。[Unity Netcode for GameObjectsの基礎](/foundations/unity-netcode-basics)と同様の目的を持つが、Unreal独自のマクロと概念([データベースのレプリケーション](/foundations/database-replication-basics)とは異なる、ゲーム内オブジェクトの同期という文脈)で実現されている。

## 基礎文法

```cpp
UCLASS()
class APlayerCharacter : public ACharacter
{
    UPROPERTY(Replicated) // このプロパティは自動的に全クライアントへ同期される
    int32 Health;

    UFUNCTION(Server, Reliable) // クライアントからサーバーへ実行を依頼する
    void ServerFire();

    UFUNCTION(NetMulticast, Reliable) // サーバーから全クライアントへ実行を依頼する
    void MulticastPlayFireEffect();
};
```

## つまずきやすい点

- `Replicated`だけを指定しても、対応する`GetLifetimeReplicatedProps`関数内で明示的に登録しないと、実際には同期されない。この登録を忘れることは初学者が最も頻繁につまずくポイントの1つ
- `Reliable`(確実に届くまで再送する)と`Unreliable`(届かなくても再送しない)の使い分けを誤ると、パフォーマンスと信頼性のバランスが崩れる。頻繁に送信される位置情報等は`Unreliable`、重要な1回きりのイベント([TCPとUDPの違い](/foundations/tcp-vs-udp)の設計思想に近い判断)は`Reliable`が適していることが多い
- サーバーとクライアントで同じコードが実行される部分と、サーバー側だけ・クライアント側だけで実行される部分の区別を誤ると、意図しない二重処理や、逆に処理が一切実行されない状況が起きる。`HasAuthority()`のようなチェックで、今どちら側で実行されているかを明示的に確認する必要がある

## 実装例(コード)

```cpp
void APlayerCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(APlayerCharacter, Health); // 明示的な登録が必要
}
```
