---
name: 基本的なライティングモデル(Lambert)
category: プログラミング言語
subcategory: シェーダー言語
summary: 法線と光の方向の内積だけで陰影を表現する、最も単純な拡散反射モデル。
---

## 概要

Lambert反射モデル(拡散反射モデル)は、表面の法線ベクトルと光源へ向かうベクトルの内積を使って明るさを決める、最も基本的なライティング計算。物理的には「表面がどれだけ光源に正対しているか」を明るさに変換する。

## 基礎文法

```hlsl
float4 FragMain(Varyings IN) : SV_Target {
    float3 normal = normalize(IN.normalWS);
    float3 lightDir = normalize(_LightDirection); // 光源へ向かう単位ベクトル
    float ndotl = max(0.0, dot(normal, lightDir)); // 内積、負の値は0にクランプ
    float3 diffuse = _BaseColor.rgb * ndotl;
    return float4(diffuse, 1.0);
}
```

- `dot(normal, lightDir)`は、法線と光源方向が同じ向き(正対)なら1に近く、直交すれば0、逆向きなら負になる
- 負の値をそのまま使うと裏側が「マイナスの明るさ」になり不自然なため、`max(0.0, ...)`でクランプする

## つまずきやすい点

- 法線ベクトルは補間の過程で長さが1でなくなることがあるため、フラグメントシェーダー内で改めて`normalize()`する必要がある(頂点シェーダーで正規化しても、補間後に長さが崩れる)
- Lambertモデルは拡散反射(ざらざらした質感)しか表現できず、金属やツルツルした表面のハイライト(鏡面反射)は別途Blinn-Phongやより物理ベースなモデル(PBR)で計算する必要がある
- ワールド空間の法線(`normalWS`)を使う場合、オブジェクトの拡大縮小(非一様スケール)があると法線が歪む。モデル行列の逆転置行列で法線を変換する必要があり、そのまま通常のモデル行列を使うと不正確になる

## 実装例(コード)

```hlsl
// 環境光(Ambient)を足して、完全な暗闇にならないようにする典型的な拡張
float3 ambient = _AmbientColor.rgb * _BaseColor.rgb;
float3 finalColor = ambient + diffuse;
```
