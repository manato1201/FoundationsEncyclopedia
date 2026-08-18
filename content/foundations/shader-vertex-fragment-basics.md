---
name: 頂点シェーダー/フラグメントシェーダーの役割分担
category: プログラミング言語
subcategory: シェーダー言語
summary: GPUパイプラインの2段階(頂点変換と画素の色決定)を、それぞれが何を担うかで理解する。
---

## 概要

多くのシェーダー言語(HLSL/GLSL等)は、頂点シェーダーとフラグメントシェーダー(ピクセルシェーダー)という2つの主要ステージを持つ。頂点シェーダーは「頂点をどこに描くか」、フラグメントシェーダーは「そのピクセルを何色にするか」を担当し、役割が明確に分離されている。

## 基礎文法

```hlsl
// 頂点シェーダー: モデル座標→クリップ空間座標への変換が主な仕事
float4 VertMain(float3 positionOS : POSITION) : SV_POSITION {
    return TransformObjectToHClip(positionOS);
}

// フラグメントシェーダー: そのピクセルの最終的な色(RGBA)を返すのが仕事
float4 FragMain() : SV_Target {
    return float4(1, 0, 0, 1); // 単色の赤
}
```

## つまずきやすい点

- 頂点シェーダーは「頂点の数」だけ、フラグメントシェーダーは「画面に描かれるピクセルの数」だけ実行される。後者の方が呼び出し回数が桁違いに多くなりやすく、重い処理を書くと直接負荷に直結する
- 頂点シェーダーで計算した値をフラグメントシェーダーで使うには、頂点シェーダーの出力構造体を経由する必要がある(その間の値はラスタライズ時に自動的に補間される)
- 座標空間(オブジェクト空間/ワールド空間/ビュー空間/クリップ空間)の変換順序を誤ると、モデルが正しく描画されない

## 実装例(コード)

```hlsl
struct Varyings {
    float4 positionCS : SV_POSITION;
    float2 uv : TEXCOORD0;
};

Varyings Vert(Attributes IN) {
    Varyings OUT;
    OUT.positionCS = TransformObjectToHClip(IN.positionOS);
    OUT.uv = IN.uv; // フラグメントシェーダー側へ補間されて渡る
    return OUT;
}
```
