---
name: Netcode for GameObjectsの基礎
category: ツール別
subcategory: Unity
masteryBadge: advanced
summary: 複数のプレイヤー間でオブジェクトの状態を同期させる、Unity公式のマルチプレイヤーネットワーキングフレームワーク。
---

## 概要

Netcode for GameObjectsは、Unity公式のマルチプレイヤー向けネットワーキングフレームワーク。ホストとなるサーバー(または「ホストクライアント」)を中心に、複数のクライアント間でGameObjectの状態(位置、体力等)を同期させる仕組みを提供する。[WebSocketの基礎](/foundations/websocket-basics)や[TCPとUDPの違い](/foundations/tcp-vs-udp)で扱ったネットワーク通信の概念を、ゲーム向けに抽象化したものといえる。

## 基礎文法

```csharp
using Unity.Netcode;

public class PlayerHealth : NetworkBehaviour
{
    // NetworkVariableは自動的に全クライアントへ同期される
    private NetworkVariable<int> hp = new NetworkVariable<int>(100);

    [ServerRpc]
    void TakeDamageServerRpc(int amount)
    {
        // サーバー上でのみ実行される処理(信頼できる計算はサーバー側で行う)
        hp.Value -= amount;
    }
}
```

- `NetworkVariable`: 値が変わると自動的に他のクライアントへ同期される変数
- `ServerRpc`: クライアントからサーバーへ処理の実行を依頼する
- `ClientRpc`: サーバーからクライアントへ処理の実行を依頼する

## つまずきやすい点

- クライアント側で直接ゲームの結果を確定させてしまう(例えば当たり判定の成否をクライアントだけで決める)設計は、チート行為(改造クライアントでの不正)を許しやすい。ダメージ計算や勝敗判定のような「信頼すべき処理」はサーバー側([Server Componentsの発想](/foundations/server-vs-client-components)にも通じる、権威をどこに置くかという考え方)で行うのが基本
- ネットワーク越しの同期には必ず遅延([プロセスとスレッドの違い](/foundations/process-vs-thread)とは別の、ネットワーク由来の遅延)が伴う。この遅延を隠すための補間・予測処理を入れないと、他プレイヤーの動きがカクついて見えることがある
- ローカル環境(遅延がほぼゼロ)でのテストだけでは、実際のネットワーク環境で起きる遅延・パケットロスによる問題に気づけないことが多い。意図的に遅延をシミュレートするツールでのテストが実務的に重要になる

## 実装例(コード)

```csharp
[ClientRpc]
void ShowDamageEffectClientRpc(int amount)
{
    // 全クライアントで演出だけを再生する(判定自体はサーバーで確定済み)
    PlayHitEffect(amount);
}
```
