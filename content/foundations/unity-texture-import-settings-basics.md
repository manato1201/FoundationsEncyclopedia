---
name: "テクスチャのインポート設定の基礎(Unity)"
category: ツール別
subcategory: "Unity"
summary: "画像をUnityに取り込んだときの設定。種類・sRGB・サイズ・圧縮・ミップマップで、見た目とメモリ使用量が決まる。"
claim: "テクスチャは、取り込みの設定で、見た目とメモリが決まる。色用か、データ用かを最初に決める。"
operationSteps:
  - label: "画像を取り込む"
    note: "画像をProjectウィンドウへ置くと、自動で取り込まれる。選ぶと、Inspectorに設定が出る"
  - label: "Texture Typeを選ぶ"
    note: "Default(通常)・Normal map(法線マップ)・Sprite(2D用)など、用途に合った種類を選ぶ"
  - label: "sRGBの扱いを決める"
    note: "色を表す画像は sRGB をオン。法線やマスクなど、数値のデータは、オフにする(種類の選択で自動のことも多い)"
  - label: "サイズと圧縮を決める"
    note: "Max Size で上限を、Compression で圧縮の強さを決める。小さく圧縮するほど、メモリは減るが、画質は下がる"
  - label: "ミップマップとフィルターを決める"
    note: "遠くの表示を滑らかにする Generate Mip Maps と、拡大時の見え方を決める Filter Mode を設定して、Apply を押す"
quiz:
  - question: "法線マップやマスクなど、色ではなく数値データを入れた画像で、sRGB はどうすべきか"
    choices:
      - "オンにする"
      - "オフにする"
      - "どちらでも同じ"
    answer: 1
    explanation: "sRGB は、見た目用の色の補正。数値データに補正をかけると、値が変わってしまうので、オフにする。"
---

## 概要

Unityは、画像を取り込むとき、元のPNGやJPEGをそのまま使うのではなく、GPUが扱いやすい形式に変換して使う。この変換の仕方を決めるのが、**インポート設定**。同じ画像でも、設定によって、見た目・読み込みの速さ・メモリの使用量が大きく変わる。モバイルなど、メモリの限られた環境で、特に重要になる。メモリの扱いは[メモリとGCの基礎](/foundations/unity-memory-gc-basics)も参照。

## 基礎文法

| 設定 | 意味 |
| --- | --- |
| Texture Type | 用途(Default・Normal map・Sprite など) |
| sRGB (Color Texture) | 色用ならオン、数値データならオフ |
| Max Size | 取り込み後の大きさの上限 |
| Compression | 圧縮の強さ(メモリと画質の兼ね合い) |
| Generate Mip Maps | 縮小版を作り、遠くの表示のちらつきを抑える |
| Filter Mode | Point(ドット絵向き)・Bilinear・Trilinear |
| Read/Write | CPU から画素を読み書きする(メモリが、およそ倍になる) |

- 2Dのスプライトとしての使い方は[2DスプライトとSprite Renderer](/foundations/unity-sprite-renderer-2d-basics)を参照
- 設定を変えたら、右下の Apply を押して、反映する

## つまずきやすい点

- 法線マップに、通常(Default)のまま、sRGBがオンだと、陰影がおかしくなる。Texture Type を Normal map にする
- UIやドット絵に、ミップマップを付けると、ぼやける。UI用のスプライトでは、通常はオフにする
- Read/Write を、念のためにオンにすると、メモリを余計に使う。コードから画素を読む必要があるときだけ、オンにする
- 大きな画像の圧縮は、ターゲット(Windows・Android・iOS)ごとに形式が違い、設定を変えることもできる。実機で、見た目を確認する

## 実装例(コード)

```csharp
// Editor フォルダの中に置く(エディター専用のスクリプト)
using UnityEditor;

public class NormalMapPostprocessor : AssetPostprocessor
{
    // "/Normals/" フォルダの画像を、自動で法線マップとして取り込む
    private void OnPreprocessTexture()
    {
        if (!assetPath.Contains("/Normals/")) return;

        var importer = (TextureImporter)assetImporter;
        importer.textureType = TextureImporterType.NormalMap;
        importer.maxTextureSize = 1024;
    }
}
```
