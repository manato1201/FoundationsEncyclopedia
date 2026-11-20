---
name: "法線マップの基礎"
category: プログラミング言語
subcategory: "シェーダー言語"
summary: "画素ごとの向き(法線)を画像に記録し、ポリゴンを増やさずに、細かな凹凸があるような陰影を作る。"
claim: "法線マップは、形を変えずに、ライティングに使う向きだけを、画素ごとに差し替える。"
operationSteps:
  - label: "法線を色として保存する"
    note: "向き(x, y, z)は -1〜1 の値。これを 0〜1 に変換して、RGB の色として画像に記録したものが、法線マップ"
  - label: "テクスチャから色を読む"
    note: "UV 座標で、法線マップをサンプリングして、画素ごとの色を得る"
  - label: "色を向きに戻す"
    note: "`n = rgb * 2.0 - 1.0` で、-1〜1 の向きに戻す"
  - label: "座標系を合わせる"
    note: "マップの向きは、面に対する相対(接空間)。TBN 行列で、ライトと同じ空間へ変換する"
  - label: "ライティングに使う"
    note: "面の法線の代わりに、この法線で、`dot(n, ライトへの向き)` を計算して、陰影を決める"
quiz:
  - question: "ほぼ平らな面の法線マップは、どんな色の画像になるか"
    choices:
      - "全体が薄い青紫(R=0.5, G=0.5, B=1)"
      - "全体が白"
      - "全体が黒"
    answer: 0
    explanation: "面と垂直な向き(0, 0, 1)は、0〜1 に変換すると (0.5, 0.5, 1)。そのため、平らな部分は、薄い青紫に見える。"
---

## 概要

細かな凹凸(レンガの目地・布のしわ)を、すべてポリゴンで作ると、頂点が大量になり、重くなる。**法線マップ**は、画素ごとの向きを画像に持たせて、ライティングの計算だけを、凹凸があるかのように変える手法。見た目の陰影は凹凸に見えるが、形(輪郭)は変わらない。ライティングの基本は[Lambert](/foundations/shader-lighting-basics)、画像の読み出しは[テクスチャサンプリング](/foundations/shader-texture-sampling-basics)を参照。

## 基礎文法

```glsl
// フラグメントシェーダー(GLSL)の一部
vec3 n = texture(uNormalMap, vUv).rgb * 2.0 - 1.0;  // 色 → 向き
n = normalize(TBN * n);                              // 接空間 → ワールド空間
float diffuse = max(dot(n, normalize(uLightDir)), 0.0);
// uLightDir は、面からライトへ向かう向き
```

| 用語 | 意味 |
| --- | --- |
| 接空間(タンジェント空間) | 面に沿った座標系。法線マップは、この空間で保存される |
| TBN | 接線(T)・従接線(B)・法線(N)を並べた行列。空間の変換に使う |
| 法線 | 面が向いている方向を示す、長さ1のベクトル |

## つまずきやすい点

- 法線マップは、画像として扱うので、色として補正される設定(sRGB)をかけてはいけない。数値のデータとして読む(Unityでは Normal map の種類、エンジンごとの設定を確認する)
- 緑のチャンネル(Y)の向きは、規約が2種類あり(OpenGL系とDirectX系)、逆だと凹凸が反転して見える。使うエンジンに合わせる
- 輪郭は変わらないので、斜めから見ると、平らなことが分かる。大きな凹凸は、形そのもの(またはディスプレイスメント)で作る
- 補間後の法線は、長さが1とは限らない。ライティングの前に`normalize`し直す

## 実装例(コード)

```glsl
#version 330 core
in vec2 vUv;
in mat3 TBN;                 // 頂点シェーダーから渡された接空間の行列
uniform sampler2D uNormalMap;
uniform sampler2D uAlbedo;
uniform vec3 uLightDir;      // 面からライトへ向かう向き
out vec4 fragColor;

void main() {
    vec3 n = texture(uNormalMap, vUv).rgb * 2.0 - 1.0;
    n = normalize(TBN * n);
    float diffuse = max(dot(n, normalize(uLightDir)), 0.0);
    vec3 base = texture(uAlbedo, vUv).rgb;
    fragColor = vec4(base * diffuse, 1.0);
}
```
