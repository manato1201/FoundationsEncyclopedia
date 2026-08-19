---
name: テクスチャサンプリングの基礎
category: プログラミング言語
subcategory: シェーダー言語
masteryBadge: review
summary: UV座標を使ってテクスチャから色を取り出す処理。フィルタリングとラップモードで見え方が変わる。
---

## 概要

テクスチャサンプリングは、UV座標(通常0〜1の範囲)を指定してテクスチャ画像から色を取得する処理。フラグメントシェーダーの中で最も頻繁に使われる操作の1つで、`sample`や`tex2D`のような関数を通じて行う。

## 基礎文法

```hlsl
Texture2D _MainTex;
SamplerState sampler_MainTex;

float4 FragMain(Varyings IN) : SV_Target {
    float4 color = _MainTex.Sample(sampler_MainTex, IN.uv);
    return color;
}
```

- **フィルタリング**: 拡大・縮小時にどう補間するか。Point(最近傍、ドット絵向き)、Bilinear(滑らかに補間)、Trilinear(ミップマップも補間)などがある
- **ラップモード**: UV座標が0〜1の範囲を超えたときの挙動。Repeat(繰り返し)、Clamp(端の色を伸ばす)、Mirror(反転して繰り返す)などがある

## つまずきやすい点

- Pointフィルタでドット絵を表示するつもりが、テクスチャのインポート設定側がBilinearのままだと、意図せずぼやけた表示になる。シェーダー側とテクスチャアセット側の設定は別々に管理されている点に注意
- ミップマップ(遠景描画用に事前生成した縮小版テクスチャ)を考慮せずにサンプリング関数を選ぶと、遠くのオブジェクトでちらつき(エイリアシング)が発生することがある
- UV座標が意図せず0〜1の範囲外になる(法線マップの計算誤差等)場合、ラップモードの設定によって見た目が大きく変わる。デバッグ時は「UV座標自体が正しい範囲に収まっているか」を疑うのが定石

## 実装例(コード)

```hlsl
// UVをタイル状に繰り返しつつ、境界だけスクロールさせる例
float2 scrolledUv = IN.uv + float2(_Time.y * 0.1, 0);
float4 color = _MainTex.Sample(sampler_MainTex, scrolledUv);
```
