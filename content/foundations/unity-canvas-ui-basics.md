---
name: UGUIのCanvas基礎
category: ツール別
subcategory: Unity
summary: UnityのUI要素を配置・描画するための土台となるコンポーネント。3種類の描画モードを持つ。
---

## 概要

Canvasは、UnityのUGUI(標準UIシステム)における全てのUI要素(ボタン、テキスト等)の描画の土台となるコンポーネント。全てのUI要素はいずれかのCanvasの子として配置され、Canvasの「Render Mode」設定によって、画面上でどのように描画されるかが決まる。

## 基礎文法

Canvasの3つのRender Mode:

- **Screen Space - Overlay**: 常に画面の最前面に描画される。カメラの影響を受けない、HUD等に最適
- **Screen Space - Camera**: 特定のカメラからの距離に応じて描画される、3D空間内の要素と組み合わせやすい
- **World Space**: 3D空間内の1つのオブジェクトとして扱われる。頭上のHPバーのような、ワールド内に存在するUIに使う

## つまずきやすい点

- 1つのシーンに複数のCanvasを配置し、描画順序(Sort Order)を管理しないと、意図した重なり順でUIが表示されないことがある。特にポップアップやダイアログのような「常に最前面に出したいUI」は、専用のCanvasを分けて管理するのが一般的
- CanvasはUI要素が変更されるたびに再描画のための再構築(バッチの再計算)が発生する。動的に頻繁に変化するUI要素を、静的な要素と同じCanvasにまとめてしまうと、無関係な要素まで巻き込んで再構築が走り、パフォーマンスに影響することがある
- Canvas Scaler(解像度に応じたUIのスケーリング設定)を適切に設定していないと、異なる画面サイズ・アスペクト比の端末でUIのレイアウトが崩れることがある。モバイル向け開発では特に重要な設定になる

## 実装例(コード)

```csharp
// 動的に変化するUIだけを別Canvasに分離してパフォーマンスへの影響を抑える設計例
[SerializeField] private Canvas staticCanvas; // メニュー等、あまり変化しない
[SerializeField] private Canvas dynamicCanvas; // HPバー等、頻繁に更新される
```
