---
name: パッケージング(ビルド)の基礎
category: ツール別
subcategory: UnrealEngine
masteryBadge: done
summary: プロジェクトを実行可能な配布形式に書き出す工程。Unityのビルド設定に相当するUnreal側の工程。
operationSteps:
  - label: プロジェクト設定を確認する
    note: 対象プラットフォーム向けの解像度・品質設定等を事前に確認する
  - label: Package Projectを選択する
    menuPath: Platforms > (対象プラットフォーム) > Package Project
  - label: 出力先フォルダを指定する
  - label: パッケージングの完了を待つ
    note: シェーダーのコンパイルやアセットのクッキング(実行環境向けへの変換)が行われるため、時間がかかることが多い
---

## 概要

パッケージングは、Unreal Editor上で作成したプロジェクトを、対象プラットフォーム上で実行可能な配布形式に書き出す工程。[Unityのビルド設定の基礎](/foundations/unity-build-settings-basics)と目的は同じだが、Unreal特有の「クッキング」(アセットを実行環境向けの最適化された形式に事前変換する処理)という工程を経る点が特徴的。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- クッキングの過程で、実際には使われていないはずのアセットが誤って含まれてしまう(参照が残っている等)ことがあり、パッケージサイズの肥大化につながる。「Reference Viewer」等のツールで、不要な参照が残っていないか確認する作業が重要になる
- 開発中(エディタ上)では問題なく動いていた処理が、パッケージ後のビルドでは動かなくなることがある。多くはエディタ専用のコード(`WITH_EDITOR`マクロで囲まれていない箇所)や、パスの解決方法の違いに起因する
- パッケージングは規模によっては非常に時間がかかる作業であり、[CIパイプラインの基本ステージ](/foundations/ci-pipeline-basics)に組み込んで自動化する場合、ビルドサーバーのスペックやキャッシュ戦略が開発サイクルの速度に直結する

## 実装例(コード)

```bash
# コマンドラインからパッケージングを自動実行する例(CI連携等で使われる)
RunUAT.bat BuildCookRun -project=MyGame.uproject -platform=Win64 -build -cook -package
```
