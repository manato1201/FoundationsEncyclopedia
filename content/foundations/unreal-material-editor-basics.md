---
name: マテリアルエディタの基礎
category: ツール別
subcategory: UnrealEngine
summary: UnrealでのマテリアルもBlenderやUnityと同様、ノードを繋いで見た目を構築するビジュアルシステム。
---

## 概要

Unreal Engineのマテリアルエディタは、[Blenderのシェーダーノード](/foundations/blender-shading-nodes-basics)や[Unity Shader Graph](/foundations/unity-shader-graph-basics)と同様に、ノードを接続して物体の見た目(色、粗さ、金属感等)を構築するビジュアルシステム。最終的に「Material」ノードの各入力ピン(Base Color、Roughness等)へ計算結果を接続する構造になっている。

## 基礎文法

典型的なノード構成:

```
[Texture Sample] --RGB--> [Multiply] --> [Base Color]
[Constant: Tint Color] ------^
```

- **Material Instance**: 元となるマテリアル(親)のパラメータだけを上書きした派生版。[Prefab Variantの作成](/foundations/unity-prefab-variant)と同様の「差分管理」の発想に近い
- マテリアルの再コンパイルはコストが高いため、頻繁に変更したいパラメータはMaterial Instance側の数値調整で済ませ、ノード構造自体の変更は最小限に抑えるのが実務的

## つまずきやすい点

- マテリアル自体を直接複製して微調整を繰り返すと、変更のたびに重いシェーダーコンパイルが発生する。色味の調整程度であれば、Material Instanceのパラメータ変更で済ませる方がはるかに高速
- テクスチャのカラースペース設定([シェーダーノードの基礎](/foundations/blender-shading-nodes-basics)でも触れた通り)を誤ると、法線マップやラフネスマップが正しく解釈されず、見た目が破綻することがある
- 複雑なノードネットワークはマテリアル関数(よく使う処理のまとまりを再利用可能な部品として切り出す機能)に分割しないと、後から見返した際の可読性が著しく落ちる

## 実装例(コード)

このエントリはビジュアルなマテリアル構築ツールが主題のため、コード例の代わりに上記の構成例で仕組みを説明しています。
