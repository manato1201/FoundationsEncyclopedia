---
name: ビルド設定の基礎
category: ツール別
subcategory: Unity
masteryBadge: done
summary: プロジェクトを実行可能な形式(実機・PC向け等)に書き出すための設定と手順。
operationSteps:
  - label: Build Settingsを開く
    menuPath: File > Build Settings
  - label: 対象プラットフォームを選択する
    note: PC/Mac、Android、iOS等、書き出し先のプラットフォームを選ぶ
  - label: ビルドに含めるシーンを指定する
    note: Scenes In Buildリストに、ビルドへ含めたいシーンを追加・並び替えする
  - label: Buildを実行する
    note: 出力先フォルダを指定し、実行可能な形式(exe、apk等)へ書き出す
---

## 概要

Unityのビルド設定は、エディタ上で作成したプロジェクトを、実際に対象デバイス上で動作する実行可能な形式(Windows向けexe、Android向けapk等)へ書き出すための設定。プラットフォームごとに異なる最適化オプションや、ビルドに含めるシーンの範囲を指定する。

## 操作手順(OperationSteps)

frontmatterの`operationSteps`に記載した4手順が、詳細ページのCSSステップアニメーションと連動して表示されます。

## つまずきやすい点

- 「Scenes In Build」リストに追加し忘れたシーンは、`SceneManager.LoadScene`で読み込もうとしてもビルド後の実行環境では見つからずエラーになる。エディタ上では動くのにビルド後だけ動かない典型的な原因の1つ
- プラットフォームを切り替える(Switch Platform)際、対象プラットフォーム向けのアセットの再インポートが走ることがあり、プロジェクトの規模によっては非常に時間がかかる。頻繁な切り替えは開発効率に影響するため、可能な限り対象プラットフォームを絞って作業するのが実務的
- 開発用ビルド(Development Build)と本番用ビルドでは、デバッグ機能(プロファイラの接続等)の有無が異なる。デバッグ機能を有効にしたまま配信用のビルドを作ってしまうと、パフォーマンスやセキュリティの面で望ましくない

## 実装例(コード)

```csharp
// スクリプトからビルドを自動実行する例(CI連携等で使われる)
using UnityEditor;

BuildPipeline.BuildPlayer(scenes, "Builds/MyGame.exe", BuildTarget.StandaloneWindows64, BuildOptions.None);
```
