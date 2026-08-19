---
name: Composerによる依存管理
category: プログラミング言語
subcategory: PHP
summary: PHPエコシステム標準のパッケージマネージャ。composer.jsonで依存ライブラリを宣言する。
---

## 概要

Composerは、PHPプロジェクトの依存ライブラリを管理するデファクトスタンダードのツール。npmのpackage.jsonに相当する`composer.json`に依存関係を書き、`composer install`でインストールする。Laravel・Symfonyのような主要フレームワークも全てComposer経由で配布されている。

## 基礎文法

```bash
composer init                  # composer.jsonを対話的に作成
composer require guzzlehttp/guzzle  # ライブラリを追加してインストール
composer install                # composer.lockに基づいて依存関係を再現
composer update                 # 依存関係を最新バージョンに更新
```

```json
{
  "require": {
    "php": ">=8.1",
    "guzzlehttp/guzzle": "^7.0"
  }
}
```

- `composer.lock`: 実際にインストールされた正確なバージョンを記録するファイル。npmの`package-lock.json`と同じ役割

## つまずきやすい点

- `composer.json`のバージョン指定(`^7.0`等)は「互換性のある範囲での自動更新」を許すが、`composer.lock`をコミットしていないと、開発者ごとに微妙に異なるバージョンがインストールされ、環境差異によるバグの原因になる
- Composerのオートローディング機能(`autoload`セクション)を正しく設定していないと、`require`文を大量に手書きする必要が生じる。PSR-4という命名規約に沿ったディレクトリ構成にすることで、クラス名からファイルパスを自動的に解決できる
- グローバルインストール(`composer global require`)とプロジェクトローカルへのインストールを混同すると、「あるプロジェクトでは動くのに別のプロジェクトでは動かない」という依存関係の混乱を招く

## 実装例(コード)

```json
{
  "autoload": {
    "psr-4": { "App\\": "src/" }
  }
}
```
