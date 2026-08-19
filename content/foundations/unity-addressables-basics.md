---
name: Addressablesの基礎
category: ツール別
subcategory: Unity
masteryBadge: advanced
summary: アセットを「アドレス」という文字列キーで管理し、ロード方法(同梱/ダウンロード配信等)を柔軟に切り替えられる仕組み。
---

## 概要

Addressablesは、アセット(プレハブ、テクスチャ等)を「アドレス」という一意の文字列キーで参照し、そのアセットが実際にどこに配置されているか(ビルドに同梱、リモートサーバーからのダウンロード配信等)を意識せずにロードできるようにするUnityのパッケージ。従来の`Resources`フォルダによるロードや、シーンへの直接参照に比べて、メモリ管理とアセット配信の柔軟性が高い。

## 基礎文法

```csharp
using UnityEngine.AddressableAssets;

// アドレスを指定して非同期にロードする
var handle = Addressables.LoadAssetAsync<GameObject>("Enemy_Slime");
handle.Completed += (op) =>
{
    if (op.Status == AsyncOperationStatus.Succeeded)
    {
        Instantiate(op.Result);
    }
};

// 使い終わったら明示的に解放する
Addressables.Release(handle);
```

## つまずきやすい点

- Addressablesでロードしたアセットは、参照カウントで管理される。`Release`を呼び忘れると、そのアセットがメモリ上に残り続け、[ガベージコレクションの基礎](/foundations/java-garbage-collection-basics)で扱ったような負荷とは別の種類の「解放し忘れ」によるメモリ圧迫を引き起こす
- 従来の`Resources`フォルダは、フォルダに入れた全アセットがビルドに含まれてしまい、アプリのサイズ増大やロード時間の悪化を招きやすかった。Addressablesはこの問題を、必要なアセットだけを個別にロード・アンロードできる設計で解決しようとしている
- リモート配信(CDN経由でのアセットダウンロード、[CDNの基礎](/foundations/cdn-basics)参照)を組み合わせる場合、ネットワークエラーやダウンロード中の状態管理など、ローカルアセットのロードにはなかった考慮事項が増える

## 実装例(コード)

```csharp
// アドレスではなくラベルで複数アセットをまとめてロードする例
Addressables.LoadAssetsAsync<GameObject>("EnemyGroup", null);
```
