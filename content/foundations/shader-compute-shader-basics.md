---
name: コンピュートシェーダーの基礎
category: プログラミング言語
subcategory: シェーダー言語
masteryBadge: advanced
summary: 描画パイプラインを介さず、GPUを汎用的な並列計算装置として使うためのシェーダーステージ。
---

## 概要

コンピュートシェーダーは、頂点シェーダー・フラグメントシェーダーのような描画パイプラインの一部ではなく、GPUの並列計算能力を任意の計算に使うための独立したシェーダーステージ。パーティクルシミュレーション、ポストエフェクト、地形生成のような「大量のデータに同じ計算を並列に適用したい」処理に向く。

## 基礎文法

```hlsl
// HLSLでのコンピュートシェーダーの例
RWStructuredBuffer<float3> Positions; // 読み書き可能なバッファ

[numthreads(64, 1, 1)] // 1グループあたり64スレッド
void CSMain(uint3 id : SV_DispatchThreadID) {
    Positions[id.x] += float3(0, -9.8, 0) * _DeltaTime; // 各要素を並列に更新
}
```

```csharp
// C#側(Unity)からのディスパッチ例
computeShader.SetBuffer(kernel, "Positions", positionsBuffer);
computeShader.Dispatch(kernel, particleCount / 64, 1, 1);
```

## つまずきやすい点

- `[numthreads(x, y, z)]`で指定するスレッドグループのサイズは、GPUのハードウェア特性(ワープ/ウェーブサイズ)に合わせて64や32の倍数にするのが一般的。適当な値にすると一部のスレッドが無駄になる
- CPU側からGPUのバッファへ結果を読み戻す(`GetData`等)処理は、GPUの計算完了を待つ同期処理になりやすく、フレームレートに直結する重い操作になりがち。読み戻しが本当に必要かどうかを設計段階で見極める必要がある
- 通常の描画シェーダーと異なり、コンピュートシェーダーは「同じデータへの複数スレッドからの同時書き込み」が起きうる。競合を避けるにはアトミック操作や、書き込み先を分離する設計が必要になる

## 実装例(コード)

```hlsl
// アトミック加算で複数スレッドからの同時書き込みを安全に行う例
RWStructuredBuffer<int> Counter;

[numthreads(64, 1, 1)]
void CSMain(uint3 id : SV_DispatchThreadID) {
    InterlockedAdd(Counter[0], 1);
}
```
