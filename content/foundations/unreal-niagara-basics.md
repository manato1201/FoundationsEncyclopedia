---
name: Niagara(エフェクト)の基礎
category: ツール別
subcategory: UnrealEngine
masteryBadge: next
summary: パーティクル(火花、煙、魔法エフェクト等)を、モジュール化された仕組みで柔軟に構築するUnreal Engineのビジュアルエフェクトシステム。
---

## 概要

Niagaraは、Unreal Engineのビジュアルエフェクト(パーティクル)を構築するためのシステム。[Blenderのパーティクルシステム](/foundations/blender-particle-system-basics)と同様に大量の小さな要素を扱うが、Niagaraは各処理段階(発生、更新、描画)をモジュール単位で自由に組み合わせられる、より柔軟な設計になっている。

## 基礎文法

Niagaraのシステム構成:

```
System(全体)
  └── Emitter(発生源1つ分)
        ├── Emitter Update(発生源自体の設定)
        ├── Particle Spawn(パーティクル生成時の初期化)
        ├── Particle Update(毎フレームの更新、重力・速度等)
        └── Render(描画方法、スプライト/メッシュ等)
```

## つまずきやすい点

- パーティクル数を増やすほど視覚的な密度は上がるが、GPU/CPUの負荷が直線的またはそれ以上に増加する。特にGPUシミュレーション(大量のパーティクルを高速に処理する方式)とCPUシミュレーション(より複雑なロジックが書けるが数が少なめ)は用途によって使い分ける必要がある
- モジュールの実行順序(Emitter Update → Particle Spawn → Particle Update)を理解していないと、「初期化のつもりで書いた処理が、実は毎フレーム実行されていた」といった意図しない挙動に気づきにくい
- Niagaraのエフェクトは見た目の調整を繰り返しながら作り込む性質が強く、パラメータの数が非常に多い。プリセットやテンプレートを活用し、ゼロから全てを組み立てないことが効率的な制作の鍵になる

## 実装例(コード)

```cpp
// C++からNiagaraエフェクトを再生する例
UNiagaraFunctionLibrary::SpawnSystemAtLocation(
    GetWorld(), NiagaraEffect, GetActorLocation()
);
```
