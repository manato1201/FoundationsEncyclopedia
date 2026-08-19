---
name: UniformとVaryingの違い
category: プログラミング言語
subcategory: シェーダー言語
summary: シェーダーに値を渡す2つの経路。実行単位ごとに一定か、補間されて変化するかが分かれ目。
---

## 概要

シェーダーが外部から値を受け取る経路には、大きく分けてUniform(GLSL用語、HLSLでは定数バッファ)とVarying(頂点シェーダーからフラグメントシェーダーへ渡す値)がある。Uniformは1回のドローコールの間、全ての頂点・ピクセルで同じ値を持つのに対し、Varyingは頂点ごとに異なる値を持ち、ラスタライズ時に自動的に補間される。

## 基礎文法

```glsl
// GLSLでの例
uniform mat4 uModelViewProjection; // ドローコール全体で共通(例: 変換行列)
uniform vec4 uBaseColor;           // マテリアル全体で共通の色

attribute vec3 aPosition; // 頂点ごとに異なる入力(頂点シェーダーの入力)
varying vec2 vUv;         // 頂点シェーダーからフラグメントシェーダーへ、補間されて渡る値

void main() {
    vUv = ...; // 頂点シェーダー側でvUvに値を設定
    gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
}
```

## つまずきやすい点

- Uniformはドローコールごとに1回CPU側から設定するものであり、頂点やピクセルごとに変化させることはできない。頂点ごとに変化させたい値はAttribute(頂点シェーダーの入力)として渡す必要がある
- Varying(HLSLでは補間セマンティクスが付いた出力)は、頂点シェーダーからフラグメントシェーダーへ渡る間に自動的に線形補間される。この性質を理解せずにIDのような「補間されると壊れる値」をVaryingとして渡すと、意図しない中間値が出てバグになる
- 最近のシェーディング言語(HLSL、WebGPUのWGSL等)では`uniform`/`varying`という用語そのものは使わず、定数バッファやI/O構造体のセマンティクスとして表現されることが多いが、概念自体は共通している

## 実装例(コード)

```hlsl
// HLSLでの同等の表現
cbuffer PerDraw : register(b0) {
    float4x4 ModelViewProjection; // uniform相当
};

struct Varyings {
    float4 positionCS : SV_POSITION;
    float2 uv : TEXCOORD0; // varying相当、自動的に補間される
};
```
